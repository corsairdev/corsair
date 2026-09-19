export type IntegrationAuthType = 'oauth_2' | 'api_key' | 'bot_token';

export type IntegrationCounts = {
	api: number;
	webhooks: number;
	db: number;
};

export type IntegrationCatalogEntry = {
	id: string;
	displayName: string;
	description: string;
	npmPackageName: string;
	authTypes: IntegrationAuthType[];
	defaultAuthType: IntegrationAuthType;
	counts: IntegrationCounts;
	totalOperations: number;
};

export type IntegrationsCatalog = {
	generatedAt: string;
	corsairVersion: string;
	integrations: IntegrationCatalogEntry[];
};
