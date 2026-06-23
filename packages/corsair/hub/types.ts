export type HubConnectSource = 'client' | 'server';

export type HubOAuthMode = 'byo' | 'managed';

export const DEFAULT_HUB_API_URL = 'https://auth.corsair.dev';

export type HubConfigInput = {
	projectApiKey: string;
	signingSecret: string;
	deliveryUrl: string;
	apiUrl?: string;
	oauthCallbackUrl?: string;
};

export type HubConfig = {
	apiUrl: string;
	projectApiKey: string;
	signingSecret: string;
	deliveryUrl: string;
	oauthCallbackUrl?: string;
};

export type HubConnectSessionInput = {
	plugin: string;
	tenantId: string;
	source: HubConnectSource;
	providerName?: string;
	oauthMode?: HubOAuthMode;
};

export type HubConnectSessionResult = {
	connectUrl: string;
	token: string;
	projectId: string;
	expiresAt?: string;
};
