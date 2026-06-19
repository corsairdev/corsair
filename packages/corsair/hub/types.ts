export type HubConnectSource = 'client' | 'server';

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
};

export type HubConnectSessionResult = {
	connectUrl: string;
	token: string;
	projectId: string;
	expiresAt?: string;
};
