export type HubConnectSource = 'client' | 'server';

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
