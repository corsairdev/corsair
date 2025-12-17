import type { OAuthService } from './types';

export const slack: OAuthService = {
	name: 'slack',
	displayName: 'Slack',
	authUrl: 'https://slack.com/oauth/v2/authorize',
	tokenUrl: 'https://slack.com/api/oauth.v2.access',
	scopes: [
		'channels:read',
		'users:read',
		'chat:write',
		'files:read',
		'files:write',
		'groups:read',
		'im:read',
		'mpim:read',
		'usergroups:read',
		'team:read',
	],
	clientIdLabel: 'Client ID',
	clientSecretLabel: 'Client Secret',
	requiresState: true,
	usesRefreshToken: true,
	setupInstructions: (redirectUri: string) =>
		`
**Setup Instructions for Slack:**

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Create a new app or use an existing one
3. Go to "OAuth & Permissions" in your app settings
4. Add **${redirectUri}** to the Redirect URLs section
5. Copy your Client ID and Client Secret from "App Credentials" and paste them above

**Note:** Make sure your app has the required OAuth scopes configured in the "OAuth & Permissions" section.
  `.trim(),
};
