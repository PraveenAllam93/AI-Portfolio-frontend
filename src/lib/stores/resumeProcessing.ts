import { writable } from 'svelte/store';
import {
	startPolling,
	type ProcessingStatus,
	type FailureStage,
	type StatusResponse
} from '$lib/services/resumeStatus';

export interface ResumeProcessingState {
	uploadId: string | null;
	status: ProcessingStatus | null;
	message: string | null;
	/** 0–100 from backend — drives the progress bar directly */
	progress: number;
	portfolioPath: string | null;
	/** Human-readable error from backend — display as-is */
	failureReason: string | null;
	/** Which pipeline stage failed */
	failureStage: FailureStage | null;
	/** True on all failure states — drives retry button visibility */
	canRetry: boolean;
	polling: boolean;
	networkError: boolean;
}

const initial: ResumeProcessingState = {
	uploadId: null,
	status: null,
	message: null,
	progress: 0,
	portfolioPath: null,
	failureReason: null,
	failureStage: null,
	canRetry: false,
	polling: false,
	networkError: false
};

function createResumeProcessingStore() {
	const { subscribe, set, update } = writable<ResumeProcessingState>(initial);

	let currentUploadId: string | null = null;
	let stopPoll: (() => void) | null = null;

	function applyResponse(s: ResumeProcessingState, data: StatusResponse): ResumeProcessingState {
		return {
			...s,
			status: data.status,
			message: data.message,
			progress: data.progress,
			failureReason: data.failureReason ?? null,
			failureStage: data.failureStage ?? null,
			canRetry: data.canRetry
		};
	}

	function start(uploadId: string) {
		stopPoll?.();
		stopPoll = null;
		currentUploadId = uploadId;

		update(() => ({
			...initial,
			uploadId,
			status: 'UPLOADED',
			polling: true
		}));

		stopPoll = startPolling(uploadId, {
			onStatus(data: StatusResponse) {
				update((s) => applyResponse(s, data));
			},
			onComplete(data: StatusResponse) {
				update((s) => ({
					...applyResponse(s, data),
					portfolioPath: data.portfolioPath ?? null,
					polling: false
				}));
				stopPoll = null;
			},
			onError() {
				update((s) => ({ ...s, polling: false, networkError: true }));
				stopPoll = null;
			}
		});
	}

	function retry() {
		if (currentUploadId) {
			update((s) => ({ ...s, networkError: false }));
			start(currentUploadId);
		}
	}

	function stop() {
		stopPoll?.();
		stopPoll = null;
		currentUploadId = null;
		set(initial);
	}

	return { subscribe, start, retry, stop };
}

export const resumeProcessing = createResumeProcessingStore();
