/**
 * Client-side interview service.
 * All calls proxy through SvelteKit +server.ts routes.
 */

export type Difficulty = 'easy' | 'medium' | 'hard' | 'mix';
export type InterviewMode = 'non-follow-up' | 'follow-up';
export type InterviewSource = 'resume' | 'role';

export interface StartInterviewParams {
	difficulty: Difficulty;
	totalQuestions: 7 | 15 | 25;
	mode: InterviewMode;
	source: InterviewSource;
	roleInfo?: string;
}

export interface StartInterviewResult {
	sessionId: string;
	question: string;
	questionNumber: number;
	totalQuestions: number;
	topic: string;
}

export interface NextQuestion {
	question: string;
	questionNumber: number;
	topic: string;
}

export interface AnswerResult {
	nextQuestion?: NextQuestion;
	isComplete: boolean;
	sessionId?: string;
}

export interface HistoryEntry {
	question: string;
	answer: string;
	topic: string;
	score: number;
	strengths: string[];
	weaknesses: string[];
	idealAnswer: string;
}

export interface InterviewReport {
	overallScore: number;
	totalAnswered: number;
	topicScores: Record<string, number>;
	strengths: string[];
	weaknesses: string[];
	suggestions: string[];
}

export interface ReportResult {
	sessionId: string;
	status: string;
	report: InterviewReport;
	history: HistoryEntry[];
	mode: InterviewMode;
	difficulty: Difficulty;
	roleInfo: string;
	createdAt: string;
}

export interface SessionSummary {
	sessionId: string;
	status: string;
	mode: InterviewMode;
	difficulty: Difficulty;
	totalQuestions: number;
	questionsAnswered: number;
	roleInfo: string;
	source: InterviewSource;
	createdAt: string;
	overallScore?: number;
	topicScores: Record<string, number>;
}

export interface ServiceResult<T> {
	success: boolean;
	data?: T;
	error?: string;
}

async function _parseError(res: Response, fallback: string): Promise<string> {
	try {
		const data = await res.json();
		return data.message || data.error || fallback;
	} catch {
		return fallback;
	}
}

async function post<T>(url: string, body: unknown, fallback = 'Something went wrong. Please try again.'): Promise<ServiceResult<T>> {
	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		if (!res.ok) {
			return { success: false, error: await _parseError(res, fallback) };
		}
		return { success: true, data: await res.json() };
	} catch {
		return { success: false, error: 'Network error. Please check your connection.' };
	}
}

export async function startInterview(
	params: StartInterviewParams
): Promise<ServiceResult<StartInterviewResult>> {
	return post('/api/interview/start', params, 'Could not start interview. Please try again.');
}

export async function submitAnswer(
	sessionId: string,
	answer: string
): Promise<ServiceResult<AnswerResult>> {
	return post('/api/interview/answer', { sessionId, answer }, 'Could not submit your answer. Please try again.');
}

export async function exitInterview(sessionId: string): Promise<ServiceResult<{ sessionId: string; report: InterviewReport }>> {
	return post('/api/interview/exit', { sessionId }, 'Could not end the interview. Please try again.');
}

export async function getReport(sessionId: string): Promise<ServiceResult<ReportResult>> {
	try {
		const res = await fetch(`/api/interview/${sessionId}/report`);
		if (!res.ok) return { success: false, error: await _parseError(res, 'Could not load your report. Please try again.') };
		return { success: true, data: await res.json() };
	} catch {
		return { success: false, error: 'Network error. Please check your connection.' };
	}
}

export async function listSessions(): Promise<ServiceResult<{ sessions: SessionSummary[] }>> {
	try {
		const res = await fetch('/api/interview/sessions');
		if (!res.ok) return { success: false, error: await _parseError(res, 'Could not load your interview history. Please try again.') };
		return { success: true, data: await res.json() };
	} catch {
		return { success: false, error: 'Network error. Please check your connection.' };
	}
}
