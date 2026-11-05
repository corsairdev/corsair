// Wire shapes of the management API. Field names are snake_case, as sent.

export type Permission = 'readonly' | 'readwrite' | 'admin';
export type AuthType = 'managed' | 'oauth_2' | 'api_key' | 'bot_token';
export type PermissionMode = 'open' | 'cautious' | 'strict' | 'readonly';
export type PermissionDecision = 'allow' | 'deny' | 'require_approval';
export type CredentialSource = 'app_owned' | 'user_owned';
export type ProjectStatus =
	| 'error'
	| 'applying'
	| 'pending'
	| 'stopped'
	| 'running';

export type CloudInstance = {
	object: 'instance';
	id: string;
	instance_key: string;
	description: string | null;
	writable: boolean;
	credential_source: CredentialSource;
	quota_limit: number | null;
	quota_window: string | null;
	/** Where this instance's operation calls execute. Null until deployed. */
	url: string | null;
};

export type CloudTenant = {
	object: 'tenant';
	/** `<instance>:<tenant>`. */
	id: string;
	instance: string;
	tenant: string;
	email: string | null;
	label: string | null;
	created: string;
};

export type CloudAccess = {
	object: 'access';
	/** `<instance>:<tenant>`. */
	id: string;
	instance: string;
	tenant: string;
	label: string | null;
	permission: Permission;
	/** The tenant has at least one live connection on this instance. */
	connected: boolean;
	/** A credential behind this line has expired and needs reconnecting. */
	expired: boolean;
};

export type CloudConnection = {
	object: 'connection';
	/** `<instance>:<integration>:<tenant>`. */
	id: string;
	instance: string;
	tenant: string;
	integration: string;
	status: string;
};

export type CloudIntegration = {
	object: 'integration';
	/** `<instance>:<integration>`. */
	id: string;
	instance: string;
	integration: string;
	auth_type: AuthType | null;
	has_credentials: boolean;
	permissions: {
		mode: PermissionMode;
		overrides?: Record<string, PermissionDecision>;
	} | null;
};

export type CloudCatalogIntegration = {
	object: 'catalog_integration';
	id: string;
	name: string;
	auth_types: string[];
	/** Corsair hosts an OAuth app for this plugin, so no client id is needed.
	 *  Separate from your plan's managed-integration quota. */
	managed_available: boolean;
};

export type CloudOauthApp = {
	object: 'oauth_app';
	id: string;
	configured: boolean;
	scopes: string | null;
	app_install_slug: string | null;
};

export type CloudWebhook = {
	object: 'webhook';
	/** `<instance>:<integration>`. */
	id: string;
	instance: string;
	integration: string;
	/** Register this with the provider as the delivery target. */
	url: string;
	has_secret: boolean;
	created: string;
};

export type CloudDelivery = {
	object: 'delivery';
	id: string;
	integration: string;
	tenant: string | null;
	status: string;
	event_type: string | null;
	latency_ms: number | null;
	attempts: number;
	error: string | null;
	received: string;
	delivered: string | null;
};

/** A tenant on an instance, as the link reaches it. */
export type CloudLinkLine = {
	instance: string;
	tenant: string;
	/** This line's access has since been revoked, so it reaches nothing. */
	lost_access: boolean;
};

export type CloudLink = {
	object: 'link';
	id: string;
	recipient: string | null;
	/** The ceiling every call through this link is judged by, applied per call.
	 *  It bounds `admin` too: a readonly link writes nothing. */
	mode: PermissionMode;
	/** Whether a failed call hands the agent a connect URL. */
	can_mint_links: boolean;
	/** Whether the link may add an integration to the instance it administers. */
	can_add_plugins: boolean;
	/** The one line the link may write on. Null for a link whose stored lines
	 *  never parsed; such a link reaches nothing. */
	admin: CloudLinkLine | null;
	/** Everything else the link can see, read-only. */
	context: CloudLinkLine[];
	url: string;
	created: string;
};

export type CloudMcpToken = {
	object: 'mcp_token';
	url: string;
	token: string;
	instance: string;
	tenant: string;
	expires_at: string;
};

export type CloudConnectSession = {
	object: 'connect_session';
	url: string;
	expires_at: string;
	instance: string;
	tenant: string;
	integrations: string[];
};

export type CloudSigningSecret = {
	object: 'signing_secret';
	id: string;
	instance: string;
	signing_secret: string;
};

export type CloudSigningSecretRotation = CloudSigningSecret & {
	previous_secret_revoked: true;
	/** False when the redeploy failed: the new secret is stored, but the
	 *  deployed runtime is still signing with the old one. */
	applied: boolean;
	/** Open sessions signed with the revoked secret, now dead. */
	invalidated: { connect_sessions: number; permission_sessions: number };
};

export type CloudKey = {
	object: 'key';
	project_key: string;
};

export type CloudKeyRotation = CloudKey & {
	previous_key_revoked: true;
	/** Instances the project has. */
	instances: number;
	/** Instances redeployed with the new key. */
	reapplied: number;
	/** Instance keys still serving the revoked key. Reconcile each one. */
	failed: string[];
};

/** `Extra` defaults to no extra fields, not to a forbidden-key record: an
 *  intersection with `Record<string, never>` would make `object` unassignable. */
/** The result of pushing an instance's stored configuration into the runtime. */
export type CloudInstanceApply = {
	object: 'instance_apply';
	id: string;
	instance: string;
	/** False when the instance was already serving and this re-pushed it. */
	first_apply: boolean;
	/** Where the instance answers, once it is serving. */
	url: string | null;
};

/** The result of dropping an instance's runtime record. */
export type CloudInstanceRemoval = {
	object: 'instance_removal';
	id: string;
	instance: string;
	removed: true;
	/** The configuration survives, so one apply rebuilds it. */
	config_retained: true;
};

/** One operation an integration exposes. */
export type CloudOperation = {
	object: 'operation';
	/** The dotted path, as `overrides` keys it. */
	id: string;
	description: string | null;
	/** What a permission mode judges it by. */
	risk_level: 'read' | 'write' | 'destructive';
};

/** An integration's operations, with the policy currently stored for it. */
export type CloudIntegrationOperations = {
	object: 'integration_operations';
	id: string;
	instance: string;
	integration: string;
	mode: PermissionMode | null;
	overrides: Record<string, PermissionDecision>;
	data: CloudOperation[];
};

export type CloudDeleted<Extra = Record<never, never>> = {
	object: string;
	id: string;
	deleted: true;
} & Extra;

/** A first page embedded in another object. Capped at 100 and never paged:
 *  when `has_more` is true, list the collection itself. */
export type CloudEmbeddedList<T> = {
	object: 'list';
	data: T[];
	has_more: boolean;
	next_cursor: null;
};

export type CloudProject = {
	object: 'project';
	/** The project slug. */
	id: string | null;
	/** The worst status across the project's instances. */
	status: ProjectStatus;
	instance_count: number;
	/** Managed-OAuth plugins in use against the plan's ceiling. `limit: null`
	 *  is unlimited. */
	managed_integrations: { limit: number | null; used: number };
	/** The project's OAuth-authenticated MCP endpoint. */
	mcp_oauth_url: string | null;
	created: string;
	instances: CloudEmbeddedList<CloudInstance>;
	tenants: CloudEmbeddedList<CloudTenant>;
	access: CloudEmbeddedList<CloudAccess>;
	connections: CloudEmbeddedList<CloudConnection>;
	links: CloudEmbeddedList<CloudLink>;
};
