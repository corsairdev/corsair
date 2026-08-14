export type HubEnvironmentSlug = 'development' | 'production';

export type HubOAuthMode = 'byo' | 'managed';

export const DEFAULT_HUB_API_URL = 'https://auth.corsair.dev';

export type HubConfigInput = {
	projectApiKey: string;
	signingSecret: string;
	apiUrl?: string;
	oauthCallbackUrl?: string;
	/** URL the connect/approve pages send the user back to when they're done. */
	redirectURL?: string;
	/**
	 * Opt-in to executing Hub-delivered workflow code (`type: 'run'`). Off by
	 * default because it dynamically evaluates code in-process. Sandbox before
	 * enabling in production — see workflows/execute.ts.
	 */
	allowWorkflowExecution?: boolean;
	/**
	 * A `ck_dev_` key tunnels automatically so the Hub can reach your local
	 * server — no config needed (the share host and per-key slug are internal).
	 * Set `false` to opt out (or `CORSAIR_TUNNEL=0`). A {@link TunnelConfig}
	 * object is an advanced escape hatch to override the binary, host, or name.
	 */
	tunnel?: boolean | TunnelConfig;
};

/**
 * Targets a self-hosted zrok for auto-tunneling. Defaults match zrok.io's
 * hosted service; override `bin`/`shareHost` for your own instance.
 */
export type TunnelConfig = {
	/** zrok binary to spawn. Default `'zrok'`; use `'zrok2'` for a self-hosted zrok2 instance. */
	bin?: string;
	/** DNS host of the share URLs to capture, e.g. `'corsair.cloud'`. Default `'shares.zrok.io'`. */
	shareHost?: string;
};

export type HubConfig = {
	apiUrl: string;
	projectApiKey: string;
	signingSecret: string;
	oauthCallbackUrl?: string;
	redirectURL?: string;
	allowWorkflowExecution?: boolean;
	tunnel?: boolean | TunnelConfig;
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
	ProbeResultPayload,
	ProbeTunnelPayload,
	RunResultPayload,
	RunStepResult,
	RunTriggerType,
	RunTunnelPayload,
	TunnelEnvelope,
	TunnelType,
} from './contracts/tunnel';
