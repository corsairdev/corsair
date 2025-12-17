import type { OAuthService } from './types';

export const github: OAuthService = {
	name: 'github',
	displayName: 'GitHub',
	authUrl: 'https://github.com/login/oauth/authorize',
	tokenUrl: 'https://github.com/login/oauth/access_token',
	scopes: [
		'repo',
		'user',
		'public_repo',
		'user:email',
		'read:user',
		'gist',
		'notifications',
		'read:org',
		'write:org',
		'admin:org',
	],
	clientIdLabel: 'Client ID',
	clientSecretLabel: 'Client Secret',
	requiresState: true,
	usesRefreshToken: false,
	setupInstructions: (redirectUri: string) =>
		`
**Setup Instructions for GitHub:**

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App" or use an existing one
3. Set the Authorization callback URL to: **${redirectUri}**
4. Copy your Client ID and generate a Client Secret, then paste them above

**Note:** GitHub OAuth apps work with both localhost and 127.0.0.1 for local development.
  `.trim(),
};
