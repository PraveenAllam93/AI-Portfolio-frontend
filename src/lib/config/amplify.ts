import { Amplify } from 'aws-amplify';
import { env } from '$env/dynamic/public';

export function configureAmplify() {
	const userPoolId = env.PUBLIC_COGNITO_USER_POOL_ID;
	const userPoolClientId = env.PUBLIC_COGNITO_CLIENT_ID;

	if (!userPoolId || !userPoolClientId) {
		console.warn(
			'Cognito config missing. Set PUBLIC_COGNITO_USER_POOL_ID and PUBLIC_COGNITO_CLIENT_ID in .env'
		);
		return;
	}

	Amplify.configure({
		Auth: {
			Cognito: {
				userPoolId,
				userPoolClientId,
				loginWith: {
					email: true
				}
			}
		}
	});
}
