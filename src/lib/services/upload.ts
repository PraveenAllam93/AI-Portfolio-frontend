/**
 * Client-side upload service.
 * Auth is handled server-side via HttpOnly cookies — no token handling here.
 */

export type ResumeCategory = 'software_engineer' | 'designer' | 'marketing' | 'finance';

export interface PresignedUrlRequest {
	filename: string;
	contentType: string;
	category: ResumeCategory;
	templateId: string;
}

export interface UploadResult {
	success: boolean;
	uploadId?: string;
	error?: string;
}

const SUPPORTED_TYPES: Record<string, string> = {
	'application/pdf': 'application/pdf',
	'application/msword': 'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

export function isSupportedFileType(file: File): boolean {
	return file.type in SUPPORTED_TYPES;
}

interface PresignedUrlResponse {
	uploadUrl: string;
	uploadId: string;
	expiresIn: number;
}

async function getPresignedUrl(request: PresignedUrlRequest): Promise<PresignedUrlResponse> {
	// Cookie is sent automatically — no Authorization header needed
	const response = await fetch('/api/upload/presigned-url', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(request)
	});

	if (!response.ok) {
		let message = 'Could not prepare your upload. Please try again.';
		try {
			const data = await response.json();
			const key = (data.error || data.message || '') as string;
			if (key.includes('templateId') || key.includes('template')) {
				message = 'The selected template is not available. Please choose a different one.';
			} else if (key.includes('quota') || key.includes('limit') || key.includes('upload')) {
				message = 'You have too many uploads in progress. Please wait for one to finish.';
			} else if (key.includes('content') || key.includes('mime') || key.includes('file')) {
				message = 'Unsupported file type. Please upload a PDF or DOCX resume.';
			} else if (key.includes('category')) {
				message = 'Invalid job category selected. Please go back and choose again.';
			}
		} catch { /* ignore parse errors */ }
		throw new Error(message);
	}

	const data = await response.json();

	if (!data.uploadUrl || !data.uploadId) {
		throw new Error('Invalid response from server: missing uploadUrl or uploadId');
	}

	return {
		uploadUrl: data.uploadUrl as string,
		uploadId: data.uploadId as string,
		expiresIn: (data.expiresIn as number) ?? 300
	};
}

export async function uploadResume(
	file: File,
	category: ResumeCategory,
	templateId: string,
	onProgress?: (percent: number) => void
): Promise<UploadResult> {
	try {
		if (!isSupportedFileType(file)) {
			return {
				success: false,
				error: 'Unsupported file type. Please upload a PDF or DOC/DOCX file.'
			};
		}

		// 1. Get presigned URL + uploadId via server proxy (auth via cookie)
		onProgress?.(10);
		const { uploadUrl, uploadId } = await getPresignedUrl({
			filename: file.name,
			contentType: file.type,
			category,
			templateId
		});

		// 2. Upload file directly to S3 via the presigned URL
		onProgress?.(30);
		const uploadResponse = await fetch(uploadUrl, {
			method: 'PUT',
			headers: { 'Content-Type': file.type },
			body: file
		});

		if (!uploadResponse.ok) {
			throw new Error(`Upload to S3 failed (${uploadResponse.status})`);
		}

		onProgress?.(100);
		return { success: true, uploadId };
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
		return { success: false, error: message };
	}
}
