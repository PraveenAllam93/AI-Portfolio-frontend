/**
 * Client-side polling service for resume processing status.
 *
 * Security model:
 *   Browser → fetch('/api/resume/status/{uploadId}')  (SvelteKit proxy)
 *   SvelteKit reads id_token from HttpOnly cookie
 *   SvelteKit → Backend GET /status/{uploadId}  (server-to-server)
 */

export type ProcessingStatus =
	| 'UPLOADED'
	| 'PARSING'
	| 'AI_PROCESSING'
	| 'GENERATING'
	| 'COMPLETE'
	| 'FAILED'
	| 'AI_FAILED'
	| 'REJECTED';

export type FailureStage = 'VALIDATION' | 'AI_PROCESSING' | 'PROCESSING';

export interface StatusResponse {
	uploadId: string;
	status: ProcessingStatus;
	message: string;
	updatedAt: string;
	/** 0–100 integer — use directly for the progress bar */
	progress: number;
	/** Backend tells us when to stop — no need to maintain a list client-side */
	isTerminal: boolean;
	/** Present on all failure states — display directly, already human-readable */
	failureReason?: string;
	/** Which pipeline stage failed */
	failureStage?: FailureStage;
	/** true on failure states, false on COMPLETE — drives the retry button */
	canRetry: boolean;
	/** Present only when status === 'COMPLETE' */
	portfolioPath?: string;
}

export interface PollingCallbacks {
	onStatus: (data: StatusResponse) => void;
	onComplete: (data: StatusResponse) => void;
	onError: () => void;
}

const POLL_INTERVAL_MS = 1000;
const MAX_FAILURES = 3;

/**
 * Starts polling /api/resume/status/{uploadId} every 1 s.
 * Stops automatically when backend signals isTerminal === true.
 * Returns a stop function — call it on component destroy.
 */
export function startPolling(uploadId: string, callbacks: PollingCallbacks): () => void {
	let consecutiveFailures = 0;
	let stopped = false;

	async function poll() {
		if (stopped) return;

		try {
			const res = await fetch(`/api/resume/status/${encodeURIComponent(uploadId)}`);

			if (!res.ok) {
				// 401 → session expired — hard stop, no retry
				if (res.status === 401) {
					stop();
					callbacks.onError();
					return;
				}
				throw new Error(`HTTP ${res.status}`);
			}

			consecutiveFailures = 0;
			const data = (await res.json()) as StatusResponse;
			callbacks.onStatus(data);

			// Backend is authoritative — trust isTerminal over our own status checks
			if (data.isTerminal) {
				stop();
				callbacks.onComplete(data);
			}
		} catch {
			consecutiveFailures += 1;
			if (consecutiveFailures >= MAX_FAILURES) {
				stop();
				callbacks.onError();
			}
		}
	}

	poll();
	const intervalId = setInterval(poll, POLL_INTERVAL_MS);

	function stop() {
		stopped = true;
		clearInterval(intervalId);
	}

	return stop;
}
