/**
 * AWS Amplify Configuration
 *
 * Connects frontend to deployed Cognito User Pool and API Gateway
 */

export const amplifyConfig = {
	Auth: {
		Cognito: {
			userPoolId: 'us-east-1_Vzmccyneq',
			userPoolClientId: '6qhfqn73tq8q25b2iocmc942t3',
			loginWith: {
				email: true
			},
			signUpVerificationMethod: 'code',
			userAttributes: {
				email: {
					required: true
				},
				name: {
					required: true
				}
			},
			passwordFormat: {
				minLength: 8,
				requireLowercase: true,
				requireUppercase: true,
				requireNumbers: true,
				requireSpecialCharacters: false
			}
		}
	},
	API: {
		REST: {
			aiPortfolioAPI: {
				endpoint: 'https://xkj0z5334g.execute-api.us-east-1.amazonaws.com/dev',
				region: 'us-east-1'
			}
		}
	}
};
