/**
 * Authentication Utilities
 *
 * Helper functions for AWS Cognito authentication using Amplify
 */

import { Amplify } from 'aws-amplify';
import { signUp, signIn, signOut, confirmSignUp, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { amplifyConfig } from '$lib/config/amplify';

// Configure Amplify
Amplify.configure(amplifyConfig);

export interface SignUpData {
	name: string;
	email: string;
	password: string;
}

export interface SignInData {
	email: string;
	password: string;
}

/**
 * Sign up a new user with Cognito
 */
export async function handleSignUp(data: SignUpData) {
	try {
		const { isSignUpComplete, userId, nextStep } = await signUp({
			username: data.email,
			password: data.password,
			options: {
				userAttributes: {
					email: data.email,
					name: data.name
				},
				autoSignIn: true
			}
		});

		return {
			success: true,
			isSignUpComplete,
			userId,
			nextStep,
			message: 'Account created successfully! Please check your email for verification code.'
		};
	} catch (error: any) {
		console.error('Sign up error:', error);
		return {
			success: false,
			error: error.message || 'Failed to create account'
		};
	}
}

/**
 * Confirm user signup with verification code
 */
export async function handleConfirmSignUp(email: string, code: string) {
	try {
		const { isSignUpComplete, nextStep } = await confirmSignUp({
			username: email,
			confirmationCode: code
		});

		return {
			success: true,
			isSignUpComplete,
			nextStep,
			message: 'Email verified successfully!'
		};
	} catch (error: any) {
		console.error('Verification error:', error);
		return {
			success: false,
			error: error.message || 'Failed to verify email'
		};
	}
}

/**
 * Sign in an existing user
 */
export async function handleSignIn(data: SignInData) {
	try {
		const { isSignedIn, nextStep } = await signIn({
			username: data.email,
			password: data.password
		});

		return {
			success: true,
			isSignedIn,
			nextStep,
			message: 'Logged in successfully!'
		};
	} catch (error: any) {
		console.error('Sign in error:', error);
		return {
			success: false,
			error: error.message || 'Failed to log in'
		};
	}
}

/**
 * Sign out current user
 */
export async function handleSignOut() {
	try {
		await signOut();
		return {
			success: true,
			message: 'Logged out successfully!'
		};
	} catch (error: any) {
		console.error('Sign out error:', error);
		return {
			success: false,
			error: error.message || 'Failed to log out'
		};
	}
}

/**
 * Get current authenticated user
 */
export async function getAuthenticatedUser() {
	try {
		const user = await getCurrentUser();
		return {
			success: true,
			user
		};
	} catch (error) {
		return {
			success: false,
			user: null
		};
	}
}

/**
 * Get JWT ID token for API calls
 */
export async function getIdToken(): Promise<string | null> {
	try {
		const session = await fetchAuthSession();
		return session.tokens?.idToken?.toString() || null;
	} catch (error) {
		console.error('Failed to get ID token:', error);
		return null;
	}
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
	try {
		await getCurrentUser();
		return true;
	} catch {
		return false;
	}
}
