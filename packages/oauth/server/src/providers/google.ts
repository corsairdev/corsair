import type { OAuthService } from './types';

export const google: OAuthService = {
	name: 'google',
	displayName: 'Google',
	authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
	tokenUrl: 'https://oauth2.googleapis.com/token',
	scopes: [
		'openid',
		'email',
		'profile',
		'https://www.googleapis.com/auth/drive',
		'https://www.googleapis.com/auth/drive.readonly',
		'https://www.googleapis.com/auth/gmail.readonly',
		'https://www.googleapis.com/auth/gmail.modify',
		'https://www.googleapis.com/auth/calendar',
		'https://www.googleapis.com/auth/calendar.readonly',
		'https://www.googleapis.com/auth/youtube',
		'https://www.googleapis.com/auth/youtube.readonly',
	],
	clientIdLabel: 'Client ID',
	clientSecretLabel: 'Client Secret',
	requiresState: true,
	usesRefreshToken: true,
	setupInstructions: (redirectUri: string) =>
		`
**Setup Instructions for Google:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the APIs you need (e.g., Google+ API for basic profile)
4. Go to "Credentials" and create an "OAuth 2.0 Client ID"
5. Add **${redirectUri}** to the Authorized redirect URIs
6. Copy your Client ID and Client Secret and paste them above

**Note:** Google requires HTTPS for production, but allows localhost/127.0.0.1 for development.
  `.trim(),
};
