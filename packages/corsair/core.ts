import type { ZodTypeAny } from 'zod';
import { withTenantAdapter } from './adapters/tenant';
import type { CorsairDbAdapter } from './adapters/types';
import type { CorsairOrmServiceClient, CorsairPluginOrmSchema } from './orm';
import { createCorsairServiceOrm } from './orm';

export type Providers =
	| 'slack'
	| 'github'
	| 'linear'
	| 'hubspot'
	| 'gmail'
	| (string & {});

/**
 * The context object passed as the first argument to every plugin endpoint/hook.
 *
 * At runtime, each plugin endpoint receives a **plugin-scoped** context:
 * - base context fields defined here
 * - plus the plugin's ORM service clients (e.g. `ctx.messages.*`, `ctx.channels.*`)
 *   generated from that plugin's `schema.services`
 */
export type CorsairContext = {
	/**
	 * The configured Corsair DB adapter (if provided to `createCorsair`).
	 */
	database?: CorsairDbAdapter | undefined;
};

export type CorsairTenantContext = CorsairContext;

type BivariantCallback<Args extends unknown[], R> = {
	// NOTE: This “bivariance hack” is intentional.
	// We want plugin endpoints to retain their precise argument tuples (e.g. `[input: {...}]`)
	// while still being storable in object maps without running into strict-function
	// contravariance issues.
	bivarianceHack(...args: Args): R;
}['bivarianceHack'];

export type CorsairEndpoint<
	Ctx extends CorsairContext = CorsairContext,
	Args extends unknown[] = unknown[],
	Res = unknown,
> = BivariantCallback<[ctx: Ctx, ...args: Args], Res>;

type CorsairEndpointBeforeHook<E> = E extends CorsairEndpoint<
	infer Ctx,
	infer Args,
	any
>
	? (ctx: Ctx, ...args: Args) => Promise<void>
	: never;

type CorsairEndpointAfterHook<E> = E extends CorsairEndpoint<
	infer Ctx,
	any,
	infer Res
>
	? (ctx: Ctx, res: Awaited<Res>) => Promise<void>
	: never;

type CorsairEndpointHooksMap<
	Endpoints extends Record<string, CorsairEndpoint>,
> = {
	[K in keyof Endpoints]?: {
		before?: CorsairEndpointBeforeHook<Endpoints[K]> | undefined;
		after?: CorsairEndpointAfterHook<Endpoints[K]> | undefined;
	};
};

export type CorsairPlugin<
	Id extends Providers = string,
	Endpoints extends Record<string, CorsairEndpoint> | undefined =
		| Record<string, CorsairEndpoint>
		| undefined,
	Schema extends
		| CorsairPluginOrmSchema<Record<string, ZodTypeAny>>
		| undefined =
		| CorsairPluginOrmSchema<Record<string, ZodTypeAny>>
		| undefined,
> = {
	id: Id;
	endpoints?: Endpoints;
	schema?: Schema;
	hooks?: Endpoints extends Record<string, CorsairEndpoint>
		? CorsairEndpointHooksMap<Endpoints>
		: never;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I,
) => void
	? I
	: never;

type BindEndpoints<T extends Record<string, CorsairEndpoint>> = {
	[K in keyof T]: T[K] extends CorsairEndpoint<any, infer A, infer R>
		? (...args: A) => R
		: never;
};

type InferOrmServices<
	Resource extends string,
	Schema extends CorsairPluginOrmSchema<Record<string, ZodTypeAny>> | undefined,
> = Schema extends CorsairPluginOrmSchema<infer Services>
	? {
			[K in keyof Services]: K extends string
				? CorsairOrmServiceClient<Resource, K, Services[K]>
				: never;
		}
	: {};

export type CorsairPluginContext<
	Resource extends string,
	Schema extends CorsairPluginOrmSchema<Record<string, ZodTypeAny>> | undefined,
> = CorsairContext & InferOrmServices<Resource, Schema>;

type InferPluginNamespaces<Plugins extends readonly CorsairPlugin[]> =
	UnionToIntersection<
		Plugins[number] extends infer P
			? P extends CorsairPlugin<infer Id, infer Endpoints>
				? P extends CorsairPlugin<Id, Endpoints, infer Schema>
					? Endpoints extends Record<string, CorsairEndpoint>
						? {
								[K in Id]: Prettify<
									BindEndpoints<Endpoints> & InferOrmServices<Id, Schema>
								>;
							}
						: { [K in Id]: InferOrmServices<Id, Schema> }
					: {}
				: {}
			: {}
	>;

type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type CorsairIntegration<Plugins extends readonly CorsairPlugin[]> = {
	/**
	 * Optional shared resource-table DB adapter. If provided, each configured plugin can expose
	 * `plugin.<service>.*` methods (e.g. `slack.messages.findByResourceId(...)`).
	 */
	/**
	 * Better-Auth-style database adapter entrypoint.
	 */
	database?: CorsairDbAdapter | undefined;
	plugins: Plugins;
	/**
	 * If true, two plugins defining the same table name throws.
	 *
	 * @default false (merge)
	 */
	multiTenancy?: boolean | undefined;
};

export type CorsairClient<Plugins extends readonly CorsairPlugin[]> = Prettify<
	InferPluginNamespaces<Plugins>
>;

export type CorsairTenantWrapper<Plugins extends readonly CorsairPlugin[]> = {
	withTenant: (tenantId: string) => CorsairClient<Plugins>;
};

function buildCorsairClient<const Plugins extends readonly CorsairPlugin[]>(
	plugins: Plugins,
	baseCtx: CorsairContext,
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
		if (plugin.schema?.services) {
			for (const [service, dataSchema] of Object.entries(
				plugin.schema.services,
			)) {
				const serviceOrm = createCorsairServiceOrm({
					database: scopedDatabase,
					resource: plugin.id,
					service,
					tenantId,
					version: plugin.schema.version,
					dataSchema: dataSchema as ZodTypeAny,
				});
				pluginOrmUnsafe[plugin.id]![service] = serviceOrm;
				apiUnsafe[plugin.id]![service] = serviceOrm;
			}
		}

		// Each plugin endpoint gets a plugin-scoped context:
		// `{ ...baseCtx, database, ...<that plugin's service orms> }`.
		const ctxForPlugin = {
			...(baseCtx as Record<string, unknown>),
			database: scopedDatabase,
			...(pluginOrmUnsafe[plugin.id] ?? {}),
		} as CorsairContext;

		const endpoints = plugin.endpoints ?? {};
		for (const [key, fn] of Object.entries(endpoints)) {
			// NOTE: `Object.entries()` returns `(string, unknown)`; we know `fn` is a `CorsairEndpoint`
			// because `plugin.endpoints` is typed that way. We keep args/results as `unknown` here
			// because the specific tuple/return type depends on which plugin/method key is accessed.
			apiUnsafe[plugin.id]![key] = (...args: unknown[]) =>
				(fn as CorsairEndpoint<CorsairContext, unknown[], unknown>)(
					ctxForPlugin,
					...args,
				);
		}
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
				return buildCorsairClient(
					config.plugins,
					{},
					config.database,
					tenantId,
				);
			},
		};
	}

	return buildCorsairClient(config.plugins, {}, config.database, undefined);
}
