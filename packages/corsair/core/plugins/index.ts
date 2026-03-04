import type { ZodTypeAny } from 'zod';
import type { CorsairDatabaseInput } from '../../db/kysely/database';
import type { CorsairPluginSchema } from '../../db/orm';
import type { AccountKeyManagerFor, PluginAuthConfig } from '../auth/types';
import type { ExtractAuthType, InferPluginEntities } from '../client';
import type { AllProviders, AuthTypes } from '../constants';
import type {
	BindEndpoints,
	BoundEndpointTree,
	CorsairContext,
	CorsairEndpoint,
	EndpointPathsOf,
	EndpointTree,
} from '../endpoints';
import type { CorsairErrorHandler } from '../errors';
import type {
	CorsairWebhook,
	CorsairWebhookHandler,
	CorsairWebhookMatcher,
	WebhookPathsOf,
	WebhookRequest,
	WebhookResponse,
	WebhookTree,
} from '../webhooks';

// ─────────────────────────────────────────────────────────────────────────────
// Permission System Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Risk level classification for plugin endpoints.
 * The permission mode maps each risk level to a policy (allow / deny / require_approval).
 */
export type EndpointRiskLevel = 'read' | 'write' | 'destructive';

/**
 * Permission mode controlling what the AI agent is allowed to do by default.
 *
 * | mode     | read  | write            | destructive         |
 * |----------|-------|------------------|---------------------|
 * | open     | allow | allow            | allow               |
 * | cautious | allow | allow            | require_approval    |
 * | strict   | allow | require_approval | deny                |
 * | readonly | allow | deny             | deny                |
 */
export type PermissionMode = 'open' | 'cautious' | 'strict' | 'readonly';

/**
 * The resolved policy for a specific endpoint after combining mode + overrides.
 * - `allow`            → executes immediately
 * - `deny`             → returns a denied response, does not call the API
 * - `require_approval` → stores a pending approval, returns a review URL to the agent
 */
export type PermissionPolicy = 'allow' | 'deny' | 'require_approval';

/**
 * Metadata for a single endpoint entry. Drives permission decisions and MCP tool descriptions.
 * Plugin authors populate this on the `endpointMeta` field of their plugin definition.
 */
export type EndpointMetaEntry = {
	/** Risk classification — determines the default policy given the active permission mode. */
	riskLevel: EndpointRiskLevel;
	/**
	 * If true, this action cannot be undone. Shown prominently on the approval review page
	 * and in the MCP tool description so the agent can warn users proactively.
	 */
	irreversible?: boolean;
	/**
	 * Human-readable description of what this endpoint does.
	 * Included in the MCP tool description surfaced to the AI agent.
	 */
	description?: string;
};

/**
 * A partial map from dot-notation endpoint paths to their metadata entries.
 * Keys are strongly typed as exact string literals derived from the plugin's endpoint tree —
 * using an invalid path (e.g. a typo) is a compile-time error.
 *
 * @template T - The plugin's endpoint tree (e.g. `typeof githubEndpointsNested`)
 */
export type PluginEndpointMeta<T extends EndpointTree> = Partial<
	Record<EndpointPathsOf<T>, EndpointMetaEntry>
>;

/**
 * A **required** map from dot-notation endpoint paths to their metadata entries.
 * Every endpoint in the tree must have a corresponding entry — omitting any path
 * is a compile-time error. Use this for `satisfies` annotations on `endpointMeta`
 * objects where exhaustiveness is enforced.
 *
 * @template T - The plugin's endpoint tree (e.g. `typeof githubEndpointsNested`)
 */
export type RequiredPluginEndpointMeta<T extends EndpointTree> = Record<
	EndpointPathsOf<T>,
	EndpointMetaEntry
>;

/**
 * A **required** map from dot-notation endpoint paths to their `{ input, output }` schema
 * pairs. Every endpoint in the tree must have a corresponding entry — omitting any path
 * is a compile-time error. Use this for `satisfies` annotations on `endpointSchemas`
 * objects where exhaustiveness is enforced.
 *
 * @template T - The plugin's endpoint tree (e.g. `typeof githubEndpointsNested`)
 */
export type RequiredPluginEndpointSchemas<T extends EndpointTree> = Record<
	EndpointPathsOf<T>,
	{ input?: ZodTypeAny; output?: ZodTypeAny }
>;

/**
 * A **required** map from dot-notation webhook paths to their `{ description, payload, response }`
 * schema entries. Every webhook in the tree must have a corresponding entry — omitting any path
 * is a compile-time error. Use this for `satisfies` annotations on `webhookSchemas` objects
 * where exhaustiveness is enforced.
 *
 * @template T - The plugin's webhook tree (e.g. `typeof slackWebhooksNested`)
 */
export type RequiredPluginWebhookSchemas<T extends WebhookTree> = Record<
	WebhookPathsOf<T>,
	{ description?: string; payload?: ZodTypeAny; response?: ZodTypeAny }
>;

/**
 * Permission configuration for a plugin, passed as `permissions` in the plugin options.
 * Controls what the AI agent is allowed to do.
 *
 * The `overrides` object uses dot-notation keys derived from the plugin's endpoint tree at
 * the TypeScript level — only valid paths autocomplete and compile. Passing a nonexistent
 * endpoint path is a type error.
 *
 * @template T - The plugin's endpoint tree (enables path autocomplete and type safety)
 *
 * @example
 * ```ts
 * github({
 *   permissions: {
 *     mode: 'cautious',
 *     overrides: {
 *       'repositories.delete': 'deny',          // never allowed
 *       'releases.create': 'require_approval',  // escalate beyond mode default
 *     },
 *   },
 * })
 * ```
 */
export type PluginPermissionsConfig<T extends EndpointTree = EndpointTree> = {
	/** The default permission mode for all endpoints in this plugin. */
	mode: PermissionMode;
	/**
	 * Per-endpoint policy overrides.
	 * Keys are strongly-typed dot-notation paths through this plugin's endpoint tree.
	 * Only valid paths for this specific plugin compile — typos are type errors.
	 */
	overrides?: Partial<Record<EndpointPathsOf<T>, PermissionPolicy>>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook Types for Endpoints
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts the context type from an endpoint function.
 */
type EndpointContext<E> = E extends CorsairEndpoint<infer Ctx, any, any>
	? Ctx
	: never;

/**
 * Extracts the arguments type from an endpoint function.
 */
type EndpointArgs<E> = E extends CorsairEndpoint<any, infer Args, any>
	? Args
	: never;

/**
 * Extracts the return type from an endpoint function.
 */
type EndpointResult<E> = E extends CorsairEndpoint<any, any, infer Res>
	? Res
	: never;

/**
 * Return type for the before hook, containing optionally updated context and args.
 */
export type BeforeHookResult<Ctx, Args> = {
	ctx: Ctx;
	args: Args;
	continue?: boolean;
	passToAfter?: string;
};

/**
 * Type for endpoint hooks used internally by the bind function.
 */
export type EndpointHooks = {
	before?: (
		ctx: Record<string, unknown>,
		args: unknown,
	) =>
		| BeforeHookResult<Record<string, unknown>, unknown>
		| Promise<BeforeHookResult<Record<string, unknown>, unknown>>;
	after?: (
		ctx: Record<string, unknown>,
		res: unknown,
		passToAfter?: string,
	) => void | Promise<void>;
};

/**
 * Type for webhook hooks used internally by the bind function.
 */
export type WebhookHooks = {
	before?: (
		ctx: Record<string, unknown>,
		request: unknown,
	) =>
		| BeforeHookResult<Record<string, unknown>, unknown>
		| Promise<BeforeHookResult<Record<string, unknown>, unknown>>;
	after?: (
		ctx: Record<string, unknown>,
		response: unknown,
		passToAfter?: string,
	) => void | Promise<void>;
};

/**
 * Recursively maps an endpoint tree to a hooks map with the same structure.
 * Each endpoint gets optional before/after hooks.
 */
type CorsairEndpointHooksMap<Endpoints extends EndpointTree> = {
	[K in keyof Endpoints]?: Endpoints[K] extends CorsairEndpoint
		? {
				/**
				 * Hook that runs before the endpoint is executed.
				 * @param ctx - The endpoint context
				 * @param args - The endpoint arguments
				 * @returns An object containing the updated context and args to pass to the endpoint
				 */
				before?: (
					ctx: EndpointContext<Endpoints[K]>,
					args: EndpointArgs<Endpoints[K]>,
				) =>
					| BeforeHookResult<
							EndpointContext<Endpoints[K]>,
							EndpointArgs<Endpoints[K]>
					  >
					| Promise<
							BeforeHookResult<
								EndpointContext<Endpoints[K]>,
								EndpointArgs<Endpoints[K]>
							>
					  >;
				/**
				 * Hook that runs after the endpoint is executed.
				 * @param ctx - The endpoint context
				 * @param res - The endpoint result
				 * @param passToAfter - Optional string passed from the before hook
				 */
				after?: (
					ctx: EndpointContext<Endpoints[K]>,
					res: EndpointResult<Endpoints[K]>,
					passToAfter?: string,
				) => void | Promise<void>;
			}
		: Endpoints[K] extends EndpointTree
			? CorsairEndpointHooksMap<Endpoints[K]>
			: never;
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook Types for Webhooks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts the context type from a webhook handler.
 */
type WebhookContext<W> = W extends CorsairWebhook<infer Ctx, any, any>
	? Ctx
	: W extends { handler: CorsairWebhookHandler<infer Ctx, any, any> }
		? Ctx
		: never;

/**
 * Extracts the payload type from a webhook handler.
 */
type WebhookPayload<W> = W extends CorsairWebhook<any, infer P, any>
	? P
	: W extends { handler: CorsairWebhookHandler<any, infer P, any> }
		? P
		: never;

/**
 * Extracts the response data type from a webhook handler.
 */
type WebhookResponseData<W> = W extends CorsairWebhook<any, any, infer R>
	? R
	: W extends { handler: CorsairWebhookHandler<any, any, infer R> }
		? R
		: never;

/**
 * Recursively maps a webhook tree to a hooks map with the same structure.
 * Each webhook gets optional before/after hooks.
 */
type CorsairWebhookHooksMap<Webhooks extends WebhookTree> = {
	[K in keyof Webhooks]?: Webhooks[K] extends CorsairWebhook<any, any, any>
		? {
				/**
				 * Hook that runs before the webhook is processed.
				 * @param ctx - The webhook context
				 * @param request - The webhook request
				 * @returns An object containing the updated context and request to pass to the webhook handler
				 */
				before?: (
					ctx: WebhookContext<Webhooks[K]>,
					request: WebhookRequest<WebhookPayload<Webhooks[K]>>,
				) =>
					| BeforeHookResult<
							WebhookContext<Webhooks[K]>,
							WebhookRequest<WebhookPayload<Webhooks[K]>>
					  >
					| Promise<
							BeforeHookResult<
								WebhookContext<Webhooks[K]>,
								WebhookRequest<WebhookPayload<Webhooks[K]>>
							>
					  >;
				/**
				 * Hook that runs after the webhook is processed.
				 * @param ctx - The webhook context
				 * @param response - The webhook response
				 * @param passToAfter - Optional string passed from the before hook
				 */
				after?: (
					ctx: WebhookContext<Webhooks[K]>,
					response: WebhookResponse<WebhookResponseData<Webhooks[K]>>,
					passToAfter?: string,
				) => void | Promise<void>;
			}
		: Webhooks[K] extends WebhookTree
			? CorsairWebhookHooksMap<Webhooks[K]>
			: never;
};

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts ALL possible auth types from options, ignoring defaultAuthType.
 * Used for internal types like KeyBuilderContext where all auth types must be handled.
 */
type ExtractAllAuthTypes<Options> = 'authType' extends keyof Options
	? NonNullable<Options['authType']> extends AuthTypes
		? NonNullable<Options['authType']>
		: never
	: never;

/**
 * Context passed to keyBuilder as a discriminated union.
 * Check `ctx.authType` to narrow the type of `ctx.keys`.
 *
 * @template Options - The plugin options type
 * @template AuthConfig - Optional plugin auth config for extension fields
 *
 * @example
 * ```ts
 * keyBuilder: async (ctx) => {
 *   if (ctx.authType === 'api_key') {
 *     return await ctx.keys.get_api_key();
 *   } else if (ctx.authType === 'oauth_2') {
 *     return await ctx.keys.get_access_token();
 *   } else if (ctx.authType === 'bot_token') {
 *     return await ctx.keys.get_bot_token();
 *   }
 *   return '';
 * }
 * ```
 */
export type KeyBuilderContext<
	Options extends Record<string, unknown>,
	AuthConfig extends PluginAuthConfig | undefined = undefined,
> = ExtractAllAuthTypes<Options> extends infer A
	? A extends AuthTypes
		? {
				/** The auth type - use this for narrowing ctx.keys */
				authType: A;
				/** Plugin-specific options */
				options: Options;
				/** Account-level key manager - type narrows based on authType check */
				keys: AccountKeyManagerFor<A, AuthConfig>;
			}
		: never
	: never;

/**
 * Type for the keyBuilder callback function that retrieves the authentication key.
 * The keyBuilder has access to the keys manager to retrieve or refresh tokens as needed.
 * @template Options - The options type for the plugin
 * @template AuthConfig - Optional plugin auth config for extension fields
 */
export type CorsairKeyBuilder<
	Options extends Record<string, unknown>,
	AuthConfig extends PluginAuthConfig | undefined = undefined,
> = (
	ctx: KeyBuilderContext<Options, AuthConfig>,
	source: 'endpoint' | 'webhook',
) => string | Promise<string>;

/**
 * Base keyBuilder type used internally for type compatibility.
 * Uses `any` to avoid contravariance issues when plugins are stored in arrays.
 */
export type CorsairKeyBuilderBase = (
	ctx: any,
	source: 'endpoint' | 'webhook',
) => string | Promise<string>;

/**
 * Defines a Corsair plugin with endpoints, webhooks, schema, and configuration.
 * @template Id - The plugin identifier (must be one of AllProviders)
 * @template Schema - The plugin schema for database services
 * @template Endpoints - The endpoint tree structure
 * @template Webhooks - The webhook tree structure
 * @template Options - Plugin-specific options (credentials, config, etc.)
 * @template DefaultAuthType - The default auth type when authType is optional and not specified
 * @template AuthConfig - Optional auth config for extending base auth fields with plugin-specific fields
 */
export type CorsairPlugin<
	Id extends AllProviders = AllProviders,
	Schema extends CorsairPluginSchema<
		Record<string, ZodTypeAny>
	> = CorsairPluginSchema<Record<string, ZodTypeAny>>,
	Endpoints extends EndpointTree = EndpointTree,
	Webhooks extends WebhookTree = WebhookTree,
	Options extends Record<string, unknown> = Record<string, unknown>,
	DefaultAuthType extends AuthTypes | undefined = AuthTypes | undefined,
	AuthConfig extends PluginAuthConfig | undefined =
		| PluginAuthConfig
		| undefined,
> = {
	/** Unique identifier for the plugin */
	id: Id;
	/** API endpoint definitions */
	endpoints?: Endpoints;
	/** Database schema for ORM services */
	schema?: Schema;
	/** Plugin-specific options (e.g. credentials, API keys, tokens) */
	options?: Options;
	/** Webhook handlers for incoming webhook events from external services */
	webhooks?: Webhooks;
	/** Hooks for endpoint handlers */
	hooks?: Endpoints extends EndpointTree
		? CorsairEndpointHooksMap<Endpoints>
		: never;
	/** Hooks for webhook handlers */
	webhookHooks?: Webhooks extends WebhookTree
		? CorsairWebhookHooksMap<Webhooks>
		: never;
	/**
	 * Top-level matcher to quickly determine if any webhook in this plugin
	 * should handle an incoming request. Acts as a first-level filter.
	 */
	pluginWebhookMatcher?: CorsairWebhookMatcher;
	/** Plugin-specific error handlers */
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Async callback to retrieve the authentication key for API calls.
	 * The keyBuilder receives a typed context with access to the keys manager,
	 * allowing it to retrieve or refresh tokens as needed.
	 * @param ctx - Context with `options` and `keys` (the account-level key manager)
	 * @returns The authentication key string to use for API calls
	 */
	keyBuilder?: CorsairKeyBuilder<Options, AuthConfig>;
	/**
	 * @internal Type-only field for inference. Do not set at runtime.
	 * Specifies the default auth type when authType is optional and not provided.
	 */
	__defaultAuthType?: DefaultAuthType;
	/**
	 * Auth config that extends the base auth fields with plugin-specific fields.
	 * Each auth type can define extra integration-level and/or account-level fields
	 * that will get auto-generated getters/setters on the key managers.
	 *
	 * @example
	 * ```ts
	 * authConfig: {
	 *   oauth_2: {
	 *     integration: ["topic_id"],
	 *     account: ["history_id"],
	 *   },
	 * }
	 * ```
	 */
	authConfig?: AuthConfig;
	/**
	 * Risk metadata for each endpoint in this plugin. Drives the permission system:
	 * riskLevel against the active mode determines the policy (allow / deny / require_approval).
	 * Also used by list_operations() and get_schema() to surface descriptions to the agent.
	 *
	 * Keys are dot-notation paths derived from `Endpoints` — only valid paths compile.
	 *
	 * @example
	 * ```ts
	 * endpointMeta: {
	 *   'issues.list':          { riskLevel: 'read' },
	 *   'issues.create':        { riskLevel: 'write' },
	 *   'repositories.delete':  { riskLevel: 'destructive', irreversible: true },
	 * }
	 * ```
	 */
	endpointMeta?: Endpoints extends EndpointTree
		? PluginEndpointMeta<Endpoints>
		: never;
	/**
	 * Zod input and output schemas for each endpoint, keyed by dot-notation path.
	 * Used by get_schema() to expose structured endpoint type information to the agent.
	 * Keys must match the endpoint dot-paths used in endpointMeta.
	 *
	 * @example
	 * ```ts
	 * endpointSchemas: {
	 *   'issues.list': { input: IssuesListInputSchema, output: IssuesListOutputSchema },
	 *   'issues.create': { input: IssuesCreateInputSchema, output: IssuesCreateOutputSchema },
	 * }
	 * ```
	 */
	endpointSchemas?: Record<string, { input?: ZodTypeAny; output?: ZodTypeAny }>;
	/**
	 * Zod schemas for each webhook, keyed by dot-notation path.
	 * Used by get_schema() to expose structured webhook type information to the agent.
	 * Keys must match the dot-paths of the webhook tree (e.g. 'messages.message').
	 *
	 * - `payload` — the type of `request.payload` in the before hook
	 * - `response` — the type of `response.data` in the after hook
	 * - `description` — optional human-readable description of what triggers this webhook
	 *
	 * @example
	 * ```ts
	 * webhookSchemas: {
	 *   'messages.message': { description: 'Fires when a message is posted', payload: MessageEventSchema, response: z.object({ ... }) },
	 * }
	 * ```
	 */
	webhookSchemas?: Record<
		string,
		{ description?: string; payload?: ZodTypeAny; response?: ZodTypeAny }
	>;
};

/**
 * The full context type for a plugin, combining base context with typed services and options.
 * @template Schema - The plugin schema for database services
 * @template Options - Plugin-specific options
 * @template Endpoints - The endpoint tree structure
 * @template AuthConfig - Optional plugin auth config for extension fields
 */
export type CorsairPluginContext<
	Schema extends
		| CorsairPluginSchema<Record<string, ZodTypeAny>>
		| undefined = undefined,
	Options extends Record<string, unknown> | undefined = undefined,
	Endpoints extends EndpointTree | undefined = undefined,
	AuthConfig extends PluginAuthConfig | undefined = undefined,
> = CorsairContext<
	Endpoints extends EndpointTree ? BindEndpoints<Endpoints> : BoundEndpointTree
> &
	InferPluginEntities<Schema> & {
		/**
		 * Get the account ID for this plugin's tenant and integration.
		 * The result is cached after the first call.
		 */
		$getAccountId: () => Promise<string>;
		/**
		 * The resolved authentication key string for making API calls.
		 * This is populated by the keyBuilder before endpoint execution.
		 */
		key: string;
		/**
		 * The tenant ID for this context (when multi-tenancy is enabled).
		 * Available in webhook hooks and endpoint hooks.
		 */
		tenantId?: string;
	} & (Options extends undefined ? {} : { options: Options }) &
	// Include keys manager if authType is defined in options
	(ExtractAuthType<Options> extends AuthTypes
		? { keys: AccountKeyManagerFor<ExtractAuthType<Options>, AuthConfig> }
		: {});

/**
 * Configuration for creating a Corsair integration with plugins.
 * @template Plugins - Array of plugin definitions
 */
export type CorsairIntegration<Plugins extends readonly CorsairPlugin[]> = {
	/** Database connection for ORM entities (e.g. `slack.api.messages.post(...)` for API, `slack.db.messages.findByEntityId(...)` for DB) */
	database?: CorsairDatabaseInput;
	/** Array of plugin definitions to include */
	plugins: Plugins;
	/** If true, enables tenant-scoped access via `withTenant()` */
	multiTenancy?: boolean;
	/** Root-level error handlers that apply when plugin-specific handlers are not defined */
	errorHandlers?: CorsairErrorHandler;
	/** Key Encryption Key (KEK) for envelope encryption. Used to encrypt/decrypt Data Encryption Keys (DEK) stored in the database. */
	kek: string;
	/**
	 * Global approval configuration for the permission system.
	 * Controls how long approval requests stay active and what happens when they expire.
	 * Only relevant when the MCP server is used and a plugin is in `cautious` or `strict` mode.
	 */
	approval?: {
		/**
		 * How long an approval request remains valid before expiring.
		 * Accepts duration strings: '10m', '1h', '30s', '2h30m'.
		 * Defaults to '10m' if not specified.
		 */
		timeout: string;
		/**
		 * What to do when an approval request expires without a response.
		 * - `'deny'`    → the action is automatically denied (recommended)
		 * - `'approve'` → the action is automatically approved (use only in low-risk setups)
		 */
		onTimeout: 'deny' | 'approve';
	};
};
