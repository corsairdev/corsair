import type { AuthTypes } from '../constants';

// ─────────────────────────────────────────────────────────────────────────────
// Integration-Level Config Types (stored in corsair_integrations.config)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * OAuth2 integration config - stored at integration level (shared across tenants)
 */
export type OAuth2IntegrationConfig = {
	client_id: string;
	client_secret: string;
	redirect_url?: string;
};

/**
 * Bot token integration config - no integration-level secrets
 */
export type BotTokenIntegrationConfig = Record<string, never>;

/**
 * API key integration config - no integration-level secrets
 */
export type ApiKeyIntegrationConfig = Record<string, never>;

/**
 * Maps auth types to their integration-level config shapes
 */
export type IntegrationConfigMap = {
	oauth_2: OAuth2IntegrationConfig;
	bot_token: BotTokenIntegrationConfig;
	api_key: ApiKeyIntegrationConfig;
};

/**
 * Get the integration config type for a given auth type
 */
export type IntegrationConfigFor<T extends AuthTypes> =
	T extends keyof IntegrationConfigMap ? IntegrationConfigMap[T] : never;

// ─────────────────────────────────────────────────────────────────────────────
// Account-Level Config Types (stored in corsair_accounts.config)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * OAuth2 account config - per-tenant tokens
 */
export type OAuth2AccountConfig = {
	access_token: string;
	refresh_token: string;
	/** Optional: token expiry timestamp */
	expires_at?: number;
	/** Optional: scopes granted */
	scope?: string;
};

/**
 * Bot token account config - per-tenant bot token
 */
export type BotTokenAccountConfig = {
	bot_token: string;
};

/**
 * API key account config - per-tenant API key
 */
export type ApiKeyAccountConfig = {
	api_key: string;
};

/**
 * Maps auth types to their account-level config shapes
 */
export type AccountConfigMap = {
	oauth_2: OAuth2AccountConfig;
	bot_token: BotTokenAccountConfig;
	api_key: ApiKeyAccountConfig;
};

/**
 * Get the account config type for a given auth type
 */
export type AccountConfigFor<T extends AuthTypes> =
	T extends keyof AccountConfigMap ? AccountConfigMap[T] : never;

// ─────────────────────────────────────────────────────────────────────────────
// Key Manager Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Base key manager interface with DEK operations
 */
export type BaseKeyManager = {
	/**
	 * Get the current DEK (decrypted using KEK)
	 */
	getDEK: () => Promise<string>;

	/**
	 * Issue a new DEK and re-encrypt all associated secrets
	 * @returns The new DEK (for reference, not typically needed)
	 */
	issueNewDEK: () => Promise<string>;
};

/**
 * OAuth2 integration-level key manager methods
 */
export type OAuth2IntegrationKeyManager = BaseKeyManager & {
	getClientId: () => Promise<string>;
	setClientId: (clientId: string) => Promise<void>;
	getClientSecret: () => Promise<string>;
	setClientSecret: (clientSecret: string) => Promise<void>;
	getRedirectUrl: () => Promise<string | null>;
	setRedirectUrl: (redirectUrl: string | null) => Promise<void>;
};

/**
 * Bot token integration-level key manager - only DEK operations
 */
export type BotTokenIntegrationKeyManager = BaseKeyManager;

/**
 * API key integration-level key manager - only DEK operations
 */
export type ApiKeyIntegrationKeyManager = BaseKeyManager;

/**
 * Maps auth types to their integration key manager types
 */
export type IntegrationKeyManagerMap = {
	oauth_2: OAuth2IntegrationKeyManager;
	bot_token: BotTokenIntegrationKeyManager;
	api_key: ApiKeyIntegrationKeyManager;
};

/**
 * Get the integration key manager type for a given auth type
 */
export type IntegrationKeyManagerFor<T extends AuthTypes> =
	T extends keyof IntegrationKeyManagerMap
		? IntegrationKeyManagerMap[T]
		: never;

/**
 * Integration credentials returned by getIntegrationCredentials
 */
export type OAuth2IntegrationCredentials = {
	clientId: string;
	clientSecret: string;
	redirectUrl: string | null;
};

/**
 * OAuth2 account-level key manager methods
 */
export type OAuth2AccountKeyManager = BaseKeyManager & {
	getAccessToken: () => Promise<string>;
	setAccessToken: (accessToken: string) => Promise<void>;
	getRefreshToken: () => Promise<string>;
	setRefreshToken: (refreshToken: string) => Promise<void>;
	getExpiresAt: () => Promise<number | null>;
	setExpiresAt: (expiresAt: number | null) => Promise<void>;
	getScope: () => Promise<string | null>;
	setScope: (scope: string | null) => Promise<void>;
	/**
	 * Get the integration-level OAuth2 credentials (client_id, client_secret, redirect_url).
	 * Useful for token refresh flows that need access to both account and integration secrets.
	 */
	getIntegrationCredentials: () => Promise<OAuth2IntegrationCredentials>;
};

/**
 * Bot token account-level key manager methods
 */
export type BotTokenAccountKeyManager = BaseKeyManager & {
	getBotToken: () => Promise<string>;
	setBotToken: (botToken: string) => Promise<void>;
};

/**
 * API key account-level key manager methods
 */
export type ApiKeyAccountKeyManager = BaseKeyManager & {
	getApiKey: () => Promise<string>;
	setApiKey: (apiKey: string) => Promise<void>;
};

/**
 * Maps auth types to their account key manager types
 */
export type AccountKeyManagerMap = {
	oauth_2: OAuth2AccountKeyManager;
	bot_token: BotTokenAccountKeyManager;
	api_key: ApiKeyAccountKeyManager;
};

/**
 * Get the account key manager type for a given auth type
 */
export type AccountKeyManagerFor<T extends AuthTypes> =
	T extends keyof AccountKeyManagerMap ? AccountKeyManagerMap[T] : never;

// ─────────────────────────────────────────────────────────────────────────────
// Key Context Types (internal use)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Context needed to create key managers
 */
export type KeyManagerContext = {
	/** The Key Encryption Key for DEK operations */
	kek: string;
	/** Integration name (plugin id) */
	integrationName: string;
};

/**
 * Integration key manager context
 */
export type IntegrationKeyContext = KeyManagerContext & {
	/** Function to get the integration row */
	getIntegration: () => Promise<{
		id: string;
		config: Record<string, unknown>;
		dek: string | null;
	}>;
	/** Function to update the integration row */
	updateIntegration: (data: {
		config?: Record<string, unknown>;
		dek?: string;
	}) => Promise<void>;
};

/**
 * Account key manager context
 */
export type AccountKeyContext = KeyManagerContext & {
	/** Tenant ID for account lookup */
	tenantId: string;
	/** Function to get the account row */
	getAccount: () => Promise<{
		id: string;
		config: Record<string, unknown>;
		dek: string | null;
	}>;
	/** Function to update the account row */
	updateAccount: (data: {
		config?: Record<string, unknown>;
		dek?: string;
	}) => Promise<void>;
	/** Function to get the integration row (for accessing integration-level credentials) */
	getIntegration: () => Promise<{
		id: string;
		config: Record<string, unknown>;
		dek: string | null;
	}>;
};
