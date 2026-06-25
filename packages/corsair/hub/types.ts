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
	/** When omitted, the connect link covers all configured plugins. */
	plugin?: string;
	tenantId: string;
	/** Inferred from hub deliveryUrl when omitted (loopback → client, else server). */
	source?: HubConnectSource;
	providerName?: string;
	oauthMode?: HubOAuthMode;
};

export type HubConnectSessionResult = {
	connectUrl: string;
	token: string;
	projectId: string;
	expiresAt?: string;
};

export type HubPermissionSessionInput = {
	permissionId: string;
	permissionToken: string;
	plugin: string;
	endpoint: string;
	args: unknown;
	tenantId: string;
	expiresAt: string;
};

export type HubPermissionSessionResult = {
	approvalUrl: string;
	token: string;
	projectId: string;
	expiresAt: string;
};

export type {
	ConnectAuthKind,
	ConnectPluginManifestEntry,
	CreateConnectSessionRequestBody,
	CreatePermissionSessionRequestBody,
	HubOAuthRefreshResponse,
} from './contracts/connect-api';
export type { ConnectSourceValidationError } from './contracts/delivery-mode';
export type {
	BrowserDeliveryMode,
	TunnelEnvelope,
	TunnelType,
} from './contracts/tunnel';
