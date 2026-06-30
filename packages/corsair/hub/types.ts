export type HubEnvironmentSlug = 'development' | 'production';

export type HubOAuthMode = 'byo' | 'managed';

export const DEFAULT_HUB_API_URL = 'https://auth.corsair.dev';

export type HubConfigInput = {
	projectApiKey: string;
	signingSecret: string;
	apiUrl?: string;
	oauthCallbackUrl?: string;
};

export type HubConfig = {
	apiUrl: string;
	projectApiKey: string;
	signingSecret: string;
	oauthCallbackUrl?: string;
};

export type HubConnectSessionInput = {
	/** When omitted, the connect link covers all configured plugins. */
	plugin?: string;
	tenantId: string;
	/** Override auto-detected delivery URL (development only). */
	deliveryUrl?: string;
	providerName?: string;
	oauthMode?: HubOAuthMode;
};

export type HubConnectSessionResult = {
	connectUrl: string;
	token: string;
	projectId: string;
	environmentId: string;
	expiresAt?: string;
};

export type HubListProjectConnectionsInput = {
	projectId: string;
};

export type HubPermissionSessionInput = {
	permissionId: string;
	permissionToken: string;
	plugin: string;
	endpoint: string;
	args: unknown;
	tenantId: string;
	expiresAt: string;
	deliveryUrl?: string;
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
	HubProjectConnection,
} from './contracts/connect-api';
export type { DeliveryTransport } from './contracts/environment';
export type {
	BrowserDeliveryMode,
	TunnelEnvelope,
	TunnelType,
} from './contracts/tunnel';
