import type { AuthTypes } from '../constants';
import type { UnionToIntersection } from '../utils';

// ─────────────────────────────────────────────────────────────────────────────
// Base Auth Field Configuration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Defines the default fields for each auth type at the integration and account levels.
 * These are the base fields that every key manager of that auth type will have.
 * Plugins can extend these with additional fields via `authConfig`.
 */
export const BASE_AUTH_FIELDS = {
	oauth_2: {
		integration: ['client_id', 'client_secret', 'redirect_url'] as const,
		account: [
			'access_token',
			'refresh_token',
			'expires_at',
			'scope',
			'webhook_signature',
		] as const,
	},
	api_key: {
		integration: [] as const,
		account: ['api_key', 'webhook_signature'] as const,
	},
	bot_token: {
		integration: [] as const,
		account: ['bot_token', 'webhook_signature'] as const,
	},
} as const satisfies Record<
	AuthTypes,
	{
		integration: readonly string[];
		account: readonly string[];
	}
>;

/**
 * Type-level representation of the base auth field config.
 */
export type BaseAuthFieldConfig = typeof BASE_AUTH_FIELDS;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Auth Config (extension mechanism)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Configuration that plugins can provide to extend the base auth fields.
 * Each auth type can have additional integration-level and/or account-level fields.
 *
 * @example
 * ```ts
 * const gmailAuthConfig = {
 *   oauth_2: {
 *     integration: ["topic_id"] as const,
 *     account: ["history_id"] as const,
 *   },
 * } as const satisfies PluginAuthConfig;
 * ```
 */
export type PluginAuthConfig = {
	[K in AuthTypes]?: {
		integration?: readonly string[];
		account?: readonly string[];
	};
};

// ─────────────────────────────────────────────────────────────────────────────
// Field Name Utility Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts extra integration fields from a plugin auth config for a given auth type.
 */
type ExtraIntegrationFields<
	Config extends PluginAuthConfig | undefined,
	T extends AuthTypes,
> = Config extends PluginAuthConfig
	? T extends keyof Config
		? NonNullable<Config[T]> extends {
				integration: infer F extends readonly string[];
			}
			? F[number]
			: never
		: never
	: never;

/**
 * Extracts extra account fields from a plugin auth config for a given auth type.
 */
type ExtraAccountFields<
	Config extends PluginAuthConfig | undefined,
	T extends AuthTypes,
> = Config extends PluginAuthConfig
	? T extends keyof Config
		? NonNullable<Config[T]> extends {
				account: infer F extends readonly string[];
			}
			? F[number]
			: never
		: never
	: never;

/**
 * All integration field names for a given auth type (base + extension).
 */
export type IntegrationFieldNames<
	T extends AuthTypes,
	Config extends PluginAuthConfig | undefined = undefined,
> =
	| BaseAuthFieldConfig[T]['integration'][number]
	| ExtraIntegrationFields<Config, T>;

/**
 * All account field names for a given auth type (base + extension).
 */
export type AccountFieldNames<
	T extends AuthTypes,
	Config extends PluginAuthConfig | undefined = undefined,
> = BaseAuthFieldConfig[T]['account'][number] | ExtraAccountFields<Config, T>;

// ─────────────────────────────────────────────────────────────────────────────
// Getter/Setter Type Generation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates getter and setter types for a single field.
 * e.g., "client_id" → { get_client_id: () => Promise<string | null>, set_client_id: (value: string | null) => Promise<void> }
 */
type FieldAccessors<Field extends string> = {
	[K in `get_${Field}`]: () => Promise<string | null>;
} & {
	[K in `set_${Field}`]: (value: string | null) => Promise<void>;
};

/**
 * Generates getters and setters for all fields in a union.
 * Uses UnionToIntersection to merge individual field accessor types.
 */
type AllFieldAccessors<Fields extends string> = [Fields] extends [never]
	? {}
	: UnionToIntersection<FieldAccessors<Fields>>;

// ─────────────────────────────────────────────────────────────────────────────
// Key Manager Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Base key manager interface with DEK operations.
 * All key managers (integration and account) include these.
 */
export type BaseKeyManager = {
	/**
	 * Get the current DEK (decrypted using KEK)
	 */
	get_dek: () => Promise<string>;

	/**
	 * Issue a new DEK and re-encrypt all associated secrets
	 * @returns The new DEK (for reference, not typically needed)
	 */
	issue_new_dek: () => Promise<string>;
};

/**
 * Integration credentials returned by get_integration_credentials (OAuth2 only).
 */
export type OAuth2IntegrationCredentials = {
	client_id: string | null;
	client_secret: string | null;
	redirect_url: string | null;
};

/**
 * Integration-level key manager for a given auth type.
 * Includes base DEK operations + auto-generated getters/setters for all fields.
 *
 * @template T - The auth type
 * @template Config - Optional plugin auth config for extension fields
 */
export type IntegrationKeyManagerFor<
	T extends AuthTypes,
	Config extends PluginAuthConfig | undefined = undefined,
> = BaseKeyManager & AllFieldAccessors<IntegrationFieldNames<T, Config>>;

/**
 * Account-level key manager for a given auth type.
 * Includes base DEK operations + auto-generated getters/setters for all fields.
 * OAuth2 account managers also include `get_integration_credentials`.
 *
 * @template T - The auth type
 * @template Config - Optional plugin auth config for extension fields
 */
export type AccountKeyManagerFor<
	T extends AuthTypes,
	Config extends PluginAuthConfig | undefined = undefined,
> = BaseKeyManager &
	AllFieldAccessors<AccountFieldNames<T, Config>> &
	(T extends 'oauth_2'
		? {
				/**
				 * Get the integration-level OAuth2 credentials (client_id, client_secret, redirect_url).
				 * Useful for token refresh flows that need access to both account and integration secrets.
				 */
				get_integration_credentials: () => Promise<OAuth2IntegrationCredentials>;
			}
		: {});

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
