import type { ZodTypeAny } from 'zod';
import { withTenantAdapter } from './adapters/tenant';
import type { CorsairDbAdapter } from './adapters/types';
import type { CorsairOrmServiceClient, CorsairPluginOrmSchema } from './orm';
import { createCorsairServiceOrm } from './orm';

// ─────────────────────────────────────────────────────────────────────────────
// Utility Types
// ─────────────────────────────────────────────────────────────────────────────

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I,
) => void
	? I
	: never;

/**
 * Bivariance hack for function types.
 * Allows plugin endpoints to retain precise argument tuples while being storable
 * in object maps without strict-function contravariance issues.
 */
type Bivariant<Args extends unknown[], R> = {
	bivarianceHack(...args: Args): R;
}['bivarianceHack'];

// ─────────────────────────────────────────────────────────────────────────────
// Core Types
// ─────────────────────────────────────────────────────────────────────────────

export type Providers =
	| 'slack'
	| 'github'
	| 'linear'
	| 'hubspot'
	| 'gmail'
	| (string & {});

/**
 * A bound endpoint function - the user-facing API after context is applied.
 */
export type BoundEndpointFn<Args = unknown, Res = unknown> = (
	args: Args,
) => Promise<Res>;

/**
 * The base context object passed to every plugin endpoint/hook.
 *
 * At runtime, each plugin endpoint receives a **plugin-scoped** context:
 * - `database`: optional DB adapter
 * - `endpoints`: bound endpoints for cross-calling
 * - plus ORM service clients from the plugin's schema (e.g. `ctx.messages.*`)
 */
export type CorsairContext<
	Endpoints extends Record<string, BoundEndpointFn> = Record<
		string,
		BoundEndpointFn
	>,
> = {
	/** The configured Corsair DB adapter (if provided to `createCorsair`). */
	database?: CorsairDbAdapter;
	/** All bound endpoints for this plugin, allowing endpoints to call each other. */
	endpoints: Endpoints;
};

/**
 * An endpoint function definition. Takes context + args, returns a promise.
 */
export type CorsairEndpoint<
	Ctx extends CorsairContext = CorsairContext,
	Args = unknown,
	Res = unknown,
> = Bivariant<[ctx: Ctx, args: Args], Promise<Res>>;

// ─────────────────────────────────────────────────────────────────────────────
// Hook Types
// ─────────────────────────────────────────────────────────────────────────────

/** Extracts the context type from an endpoint. */
type EndpointContext<E> = E extends CorsairEndpoint<infer Ctx, any, any>
	? Ctx
	: never;

/** Extracts the args type from an endpoint. */
type EndpointArgs<E> = E extends CorsairEndpoint<any, infer Args, any>
	? Args
	: never;

/** Extracts the result type from an endpoint. */
type EndpointResult<E> = E extends CorsairEndpoint<any, any, infer Res>
	? Res
	: never;

type CorsairEndpointHooksMap<
	Endpoints extends Record<string, CorsairEndpoint>,
> = {
	[K in keyof Endpoints]?: {
		before?: (
			ctx: EndpointContext<Endpoints[K]>,
			args: EndpointArgs<Endpoints[K]>,
		) => void | Promise<void>;
		after?: (
			ctx: EndpointContext<Endpoints[K]>,
			res: EndpointResult<Endpoints[K]>,
		) => void | Promise<void>;
	};
};

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Types
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairPlugin<
	Id extends Providers = Providers,
	Endpoints extends Record<string, CorsairEndpoint> | undefined =
		| Record<string, CorsairEndpoint>
		| undefined,
	Schema extends
		| CorsairPluginOrmSchema<Record<string, ZodTypeAny>>
		| undefined =
		| CorsairPluginOrmSchema<Record<string, ZodTypeAny>>
		| undefined,
	Options extends Record<string, unknown> | undefined =
		| Record<string, unknown>
		| undefined,
> = {
	id: Id;
	endpoints?: Endpoints;
	schema?: Schema;
	/** Plugin-specific options (e.g. credentials, API keys, tokens). */
	options?: Options;
	hooks?: Endpoints extends Record<string, CorsairEndpoint>
		? CorsairEndpointHooksMap<Endpoints>
		: never;
};

/** Transforms endpoint definitions to their bound (context-free) signatures. */
export type BindEndpoints<T extends Record<string, CorsairEndpoint>> = {
	[K in keyof T]: T[K] extends CorsairEndpoint<any, infer A, infer R>
		? (args: A) => Promise<R>
		: never;
};

/** Extracts ORM service clients from a plugin schema. */
type InferOrmServices<
	Resource extends string,
	Schema extends CorsairPluginOrmSchema<Record<string, ZodTypeAny>> | undefined,
> = Schema extends CorsairPluginOrmSchema<infer Services>
	? {
			[K in keyof Services & string]: CorsairOrmServiceClient<
				Resource,
				K,
				Services[K]
			>;
		}
	: {};

/**
 * The full context type for a plugin, combining:
 * - Base context with bound endpoints
 * - ORM services from the schema
 * - Plugin options (if defined)
 */
export type CorsairPluginContext<
	Resource extends string,
	Schema extends
		| CorsairPluginOrmSchema<Record<string, ZodTypeAny>>
		| undefined = undefined,
	Options extends Record<string, unknown> | undefined = undefined,
	Endpoints extends Record<string, CorsairEndpoint> | undefined = undefined,
> = CorsairContext<
	Endpoints extends Record<string, CorsairEndpoint>
		? BindEndpoints<Endpoints>
		: Record<string, BoundEndpointFn>
> &
	InferOrmServices<Resource, Schema> &
	(Options extends undefined ? {} : { options: Options });

// ─────────────────────────────────────────────────────────────────────────────
// Client Types
// ─────────────────────────────────────────────────────────────────────────────

/** Infers the namespace object for a single plugin. */
type InferPluginNamespace<P extends CorsairPlugin> = P extends CorsairPlugin<
	infer Id,
	infer Endpoints,
	infer Schema
>
	? {
			[K in Id]: (Endpoints extends Record<string, CorsairEndpoint>
				? BindEndpoints<Endpoints>
				: {}) &
				InferOrmServices<Id, Schema>;
		}
	: never;

/** Infers all plugin namespaces and merges them into a single object. */
type InferPluginNamespaces<Plugins extends readonly CorsairPlugin[]> =
	UnionToIntersection<InferPluginNamespace<Plugins[number]>>;

export type CorsairIntegration<Plugins extends readonly CorsairPlugin[]> = {
	/** Database adapter for ORM services (e.g. `slack.messages.findByResourceId(...)`). */
	database?: CorsairDbAdapter;
	plugins: Plugins;
	/** If true, enables tenant-scoped access via `withTenant()`. */
	multiTenancy?: boolean;
};

export type CorsairClient<Plugins extends readonly CorsairPlugin[]> =
	InferPluginNamespaces<Plugins>;

export type CorsairTenantWrapper<Plugins extends readonly CorsairPlugin[]> = {
	withTenant: (tenantId: string) => CorsairClient<Plugins>;
};

function buildCorsairClient<const Plugins extends readonly CorsairPlugin[]>(
	plugins: Plugins,
	database: CorsairDbAdapter | undefined,
	tenantId: string | undefined,
): CorsairClient<Plugins> {
	const scopedDatabase =
		database && tenantId ? withTenantAdapter(database, tenantId) : database;

	// NOTE: This is constructed dynamically from runtime plugin ids + endpoint keys.
	// TS can't model that perfectly during mutation, so we build an `unknown` map and
	// assert it to the computed type at the end.
	const apiUnsafe: Record<string, Record<string, unknown>> = {};
	const pluginOrmUnsafe: Record<string, Record<string, unknown>> = {};

	for (const plugin of plugins) {
		apiUnsafe[plugin.id] = {};
		pluginOrmUnsafe[plugin.id] = {};
	}

	for (const plugin of plugins) {
		// Auto-generate ORM service namespaces from plugin schema, if present.
		// NOTE: Schema type is opaque at runtime; we access it dynamically.
		const schema = plugin.schema as
			| CorsairPluginOrmSchema<Record<string, ZodTypeAny>>
			| undefined;

		if (schema?.services) {
			for (const [service, dataSchema] of Object.entries(schema.services)) {
				const serviceOrm = createCorsairServiceOrm({
					database: scopedDatabase,
					resource: plugin.id,
					service,
					tenantId,
					version: schema.version,
					dataSchema,
				});
				pluginOrmUnsafe[plugin.id]![service] = serviceOrm;
				apiUnsafe[plugin.id]![service] = serviceOrm;
			}
		}

		// Each plugin endpoint gets a plugin-scoped context:
		// `{ database, options, endpoints, ...<that plugin's service orms> }`.
		// We create this as a mutable object so we can add bound endpoints later.
		const ctxForPlugin: Record<string, unknown> = {
			database: scopedDatabase,
			...(pluginOrmUnsafe[plugin.id] ?? {}),
			...(plugin.options ? { options: plugin.options } : {}),
		};

		const endpoints = plugin.endpoints ?? {};
		const hooks = plugin.hooks as
			| Record<string, { before?: Function; after?: Function }>
			| undefined;

		// First pass: create bound endpoints that reference the mutable context
		const boundEndpoints: Record<string, Function> = {};
		for (const [key, fn] of Object.entries(endpoints)) {
			const endpointHooks = hooks?.[key];

			const boundFn = (...args: unknown[]) => {
				const call = () => (fn as Function)(ctxForPlugin, ...args);

				if (!endpointHooks?.before && !endpointHooks?.after) {
					return call();
				}

				return (async () => {
					await endpointHooks.before?.(ctxForPlugin, ...args);
					const res = await call();
					await endpointHooks.after?.(ctxForPlugin, res);
					return res;
				})();
			};

			boundEndpoints[key] = boundFn;
			apiUnsafe[plugin.id]![key] = boundFn;
		}

		// Second pass: inject bound endpoints into the context so endpoints can call each other
		ctxForPlugin.endpoints = boundEndpoints;
	}

	const api = apiUnsafe as InferPluginNamespaces<Plugins>;

	// Expose `corsair.slack.*` (and other plugin namespaces).
	return {
		// NOTE: This spread is how we provide the ergonomic `corsair.slack.*` surface.
		// Type-wise, it’s equivalent to `& InferPluginNamespaces<Plugins>` in the return type,
		// but TS can’t see that relationship through the runtime spread without an assertion.
		...(api as unknown as Record<string, unknown>),
	} as CorsairClient<Plugins>;
}

export function createCorsair<const Plugins extends readonly CorsairPlugin[]>(
	config: CorsairIntegration<Plugins> & { multiTenancy: true },
): CorsairTenantWrapper<Plugins>;
export function createCorsair<const Plugins extends readonly CorsairPlugin[]>(
	config: CorsairIntegration<Plugins> & { multiTenancy?: false | undefined },
): CorsairClient<Plugins>;
export function createCorsair<const Plugins extends readonly CorsairPlugin[]>(
	config: CorsairIntegration<Plugins>,
): CorsairClient<Plugins> | CorsairTenantWrapper<Plugins> {
	if (config.multiTenancy) {
		return {
			withTenant: (tenantId: string) => {
				if (!tenantId) {
					throw new Error(
						'corsair.withTenant(tenantId): tenantId must be a non-empty string',
					);
				}
				return buildCorsairClient(config.plugins, config.database, tenantId);
			},
		};
	}

	return buildCorsairClient(config.plugins, config.database, undefined);
}
