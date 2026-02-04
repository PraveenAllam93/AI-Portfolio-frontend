/**
 * API Utilities
 *
 * Helper functions for calling AWS API Gateway endpoints
 */

import { getIdToken } from './auth';

const API_BASE_URL = 'https://xkj0z5334g.execute-api.us-east-1.amazonaws.com/dev';

export interface UserInfo {
	userId: string;
	email: string;
	name: string;
	emailVerified: string | null;
	tokenIssuedAt: string;
	tokenExpiresAt: string;
	issuer: string;
	audience: string;
}

export interface UserInfoResponse {
	success: boolean;
	message: string;
	user: UserInfo;
	metadata: {
		requestId: string;
		requestTime: string;
		sourceIp: string;
	};
}

/**
 * Fetch user information from API Gateway
 */
export async function getUserInfo(): Promise<{ success: boolean; data?: UserInfoResponse; error?: string }> {
	try {
		const idToken = await getIdToken();

		if (!idToken) {
			return {
				success: false,
				error: 'Not authenticated. Please log in again.'
			};
		}

		const response = await fetch(`${API_BASE_URL}/user/info`, {
			method: 'GET',
			headers: {
				'Authorization': idToken,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			if (response.status === 401) {
				return {
					success: false,
					error: 'Session expired. Please log in again.'
				};
			}
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const data: UserInfoResponse = await response.json();

		return {
			success: true,
			data
		};
	} catch (error: any) {
		console.error('Failed to fetch user info:', error);
		return {
			success: false,
			error: error.message || 'Failed to fetch user information'
		};
	}
}
