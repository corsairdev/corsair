import type { ZodTypeAny } from 'zod';
import type { CorsairDbAdapter } from '../../adapters';
import type { CorsairPluginSchema } from '../../db/orm';
import type { InferPluginServices } from '../client';
import type { AllProviders } from '../constants';
import type {
	BindEndpoints,
	BoundEndpointTree,
	CorsairContext,
	CorsairEndpoint,
	EndpointTree,
} from '../endpoints';
import type { CorsairErrorHandler } from '../errors';
import type {
	CorsairWebhook,
	CorsairWebhookHandler,
	CorsairWebhookMatcher,
	WebhookRequest,
	WebhookResponse,
	WebhookTree,
} from '../webhooks';

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
	after?: (ctx: Record<string, unknown>, res: unknown) => void | Promise<void>;
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
	) => void | Promise<void>;
};

/**
 * Recursively maps an endpoint tree to a hooks map with the same structure.
 * Each endpoint gets optional before/after hooks.
 */
type CorsairEndpointHooksMap<Endpoints extends EndpointTree> = {
	[K in keyof Endpoints]?: Endpoints[K] extends CorsairEndpoint<any, any, any>
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
				 */
				after?: (
					ctx: EndpointContext<Endpoints[K]>,
					res: EndpointResult<Endpoints[K]>,
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
				 */
				after?: (
					ctx: WebhookContext<Webhooks[K]>,
					response: WebhookResponse<WebhookResponseData<Webhooks[K]>>,
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
 * Type for the keyBuilder callback function that generates a key from the plugin options.
 * @template Options - The options type for the plugin
 */
export type CorsairKeyBuilder<Options extends Record<string, unknown>> = (
	options: Options,
) => string | Promise<string>;

/**
 * Base keyBuilder type used internally for type compatibility.
 * Uses `any` to avoid contravariance issues when plugins are stored in arrays.
 */
export type CorsairKeyBuilderBase = (options: any) => string | Promise<string>;

/**
 * Defines a Corsair plugin with endpoints, webhooks, schema, and configuration.
 * @template Id - The plugin identifier (must be one of AllProviders)
 * @template Endpoints - The endpoint tree structure
 * @template Schema - The plugin schema for database services
 * @template Options - Plugin-specific options (credentials, config, etc.)
 * @template Webhooks - The webhook tree structure
 */
export type CorsairPlugin<
	Id extends AllProviders = AllProviders,
	Schema extends CorsairPluginSchema<
		Record<string, ZodTypeAny>
	> = CorsairPluginSchema<Record<string, ZodTypeAny>>,
	Endpoints extends EndpointTree = EndpointTree,
	Webhooks extends WebhookTree = WebhookTree,
	Options extends Record<string, unknown> = Record<string, unknown>,
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
	 * Async callback to generate a key from the plugin options.
	 * This key is used to access data for API calls.
	 * Note: Uses CorsairKeyBuilderBase for array compatibility, but type inference
	 * works correctly when using `satisfies` on plugin definitions.
	 */
	keyBuilder?: CorsairKeyBuilderBase;
};

/**
 * The full context type for a plugin, combining base context with typed services and options.
 * @template Schema - The plugin schema for database services
 * @template Options - Plugin-specific options
 * @template Endpoints - The endpoint tree structure
 */
export type CorsairPluginContext<
	Schema extends
		| CorsairPluginSchema<Record<string, ZodTypeAny>>
		| undefined = undefined,
	Options extends Record<string, unknown> | undefined = undefined,
	Endpoints extends EndpointTree | undefined = undefined,
> = CorsairContext<
	Endpoints extends EndpointTree ? BindEndpoints<Endpoints> : BoundEndpointTree
> &
	InferPluginServices<Schema> &
	(Options extends undefined ? {} : { options: Options });

/**
 * Configuration for creating a Corsair integration with plugins.
 * @template Plugins - Array of plugin definitions
 */
export type CorsairIntegration<Plugins extends readonly CorsairPlugin[]> = {
	/** Database adapter for ORM services (e.g. `slack.api.messages.post(...)` for API, `slack.db.messages.findByResourceId(...)` for DB) */
	database?: CorsairDbAdapter;
	/** Array of plugin definitions to include */
	plugins: Plugins;
	/** If true, enables tenant-scoped access via `withTenant()` */
	multiTenancy?: boolean;
	/** Root-level error handlers that apply when plugin-specific handlers are not defined */
	errorHandlers?: CorsairErrorHandler;
};
