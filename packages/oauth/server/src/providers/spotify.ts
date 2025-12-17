import type { OAuthService } from './types';

export const spotify: OAuthService = {
	name: 'spotify',
	displayName: 'Spotify',
	authUrl: 'https://accounts.spotify.com/authorize',
	tokenUrl: 'https://accounts.spotify.com/api/token',
	scopes: [
		'ugc-image-upload',
		'user-read-playback-state',
		'user-modify-playback-state',
		'user-read-currently-playing',
		'app-remote-control',
		'streaming',
		'playlist-read-private',
		'playlist-read-collaborative',
		'playlist-modify-private',
		'playlist-modify-public',
		'user-follow-modify',
		'user-follow-read',
		'user-read-playback-position',
		'user-top-read',
		'user-read-recently-played',
		'user-library-modify',
		'user-library-read',
		'user-read-email',
		'user-read-private',
		'user-personalized',
		'user-soa-link',
		'user-soa-unlink',
		'soa-manage-entitlements',
		'soa-manage-partner',
		'soa-create-partner',
	],
	clientIdLabel: 'Client ID',
	clientSecretLabel: 'Client Secret',
	requiresState: true,
	usesRefreshToken: true,
	setupInstructions: (redirectUri: string) =>
		`
**Setup Instructions for Spotify:**

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app or use an existing one
3. In your app settings, add **${redirectUri}** to your app's Redirect URIs
4. Copy your Client ID and Client Secret from the app settings and paste them above

**Important:** Spotify requires loopback addresses (127.0.0.1) for local development instead of localhost. Make sure to use the exact URI: **${redirectUri}**
  `.trim(),
};
