import type { OAuthService } from './types';

export const discord: OAuthService = {
	name: 'discord',
	displayName: 'Discord',
	authUrl: 'https://discord.com/api/oauth2/authorize',
	tokenUrl: 'https://discord.com/api/oauth2/token',
	scopes: [
		'identify',
		'email',
		'guilds',
		'guilds.join',
		'guilds.members.read',
		'gdm.join',
		'rpc',
		'rpc.notifications.read',
		'rpc.voice.read',
		'rpc.voice.write',
		'rpc.activities.write',
		'bot',
		'webhook.incoming',
		'messages.read',
		'applications.builds.upload',
		'applications.builds.read',
		'applications.commands',
		'applications.store.update',
	],
	clientIdLabel: 'Client ID',
	clientSecretLabel: 'Client Secret',
	requiresState: true,
	usesRefreshToken: true,
	setupInstructions: (redirectUri: string) =>
		`
**Setup Instructions for Discord:**

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or use an existing one
3. Go to the "OAuth2" section
4. Add **${redirectUri}** to the Redirects list
5. Copy your Client ID and Client Secret and paste them above

**Note:** Discord supports both localhost and 127.0.0.1 for local development.
  `.trim(),
};
