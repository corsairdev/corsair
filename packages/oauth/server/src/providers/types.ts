export interface OAuthService {
	name: string;
	displayName: string;
	authUrl: string;
	tokenUrl: string;
	scopes: string[];
	clientIdLabel: string;
	clientSecretLabel: string;
	setupInstructions: (redirectUri: string) => string;
	requiresState?: boolean;
	usesRefreshToken?: boolean;
}
