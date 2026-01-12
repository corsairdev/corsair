import type { ZodTypeAny } from 'zod';
import { withTenantAdapter } from './adapters/tenant';
import type { CorsairDbAdapter } from './adapters/types';
import type {
	CorsairPluginSchema,
	PluginServiceClient,
	PluginServiceClients,
} from './orm';

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

type EndpointContext<E> = E extends CorsairEndpoint<infer Ctx, any, any>
	? Ctx
	: never;

type EndpointArgs<E> = E extends CorsairEndpoint<any, infer Args, any>
	? Args
	: never;

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
	Schema extends CorsairPluginSchema<Record<string, ZodTypeAny>> | undefined =
		| CorsairPluginSchema<Record<string, ZodTypeAny>>
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

/**
 * Extracts typed service clients from a plugin schema.
 * Each service becomes a `PluginServiceClient<DataSchema>`.
 */
type InferPluginServices<
	Schema extends CorsairPluginSchema<Record<string, ZodTypeAny>> | undefined,
> = Schema extends CorsairPluginSchema<infer Services>
	? PluginServiceClients<Services>
	: {};

/**
 * The full context type for a plugin, combining:
 * - Base context with bound endpoints
 * - Typed service clients from the schema
 * - Plugin options (if defined)
 */
export type CorsairPluginContext<
	Resource extends string,
	Schema extends
		| CorsairPluginSchema<Record<string, ZodTypeAny>>
		| undefined = undefined,
	Options extends Record<string, unknown> | undefined = undefined,
	Endpoints extends Record<string, CorsairEndpoint> | undefined = undefined,
> = CorsairContext<
	Endpoints extends Record<string, CorsairEndpoint>
		? BindEndpoints<Endpoints>
		: Record<string, BoundEndpointFn>
> &
	InferPluginServices<Schema> &
	(Options extends undefined ? {} : { options: Options });

// ─────────────────────────────────────────────────────────────────────────────
// Client Types
// ─────────────────────────────────────────────────────────────────────────────

type InferPluginNamespace<P extends CorsairPlugin> = P extends CorsairPlugin<
	infer Id,
	infer Endpoints,
	infer Schema
>
	? {
			[K in Id]: (Endpoints extends Record<string, CorsairEndpoint>
				? BindEndpoints<Endpoints>
				: {}) &
				InferPluginServices<Schema>;
		}
	: never;

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

// ─────────────────────────────────────────────────────────────────────────────
// Service Client Factory (inline to avoid circular deps)
// ─────────────────────────────────────────────────────────────────────────────

function generateUuidV4(): string {
	const cryptoAny = globalThis.crypto as unknown as
		| { randomUUID?: () => string }
		| undefined;
	if (cryptoAny?.randomUUID) {
		return cryptoAny.randomUUID();
	}
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

function parseJsonLike(value: unknown): unknown {
	if (typeof value === 'string') {
		try {
			return JSON.parse(value);
		} catch {
			return value;
		}
	}
	return value;
}

function createServiceClient(
	database: CorsairDbAdapter | undefined,
	pluginId: string,
	serviceName: string,
	tenantId: string,
	version: string,
	dataSchema: ZodTypeAny,
): PluginServiceClient<ZodTypeAny> {
	const tableName = 'corsair_resources';

	function baseWhere() {
		return [
			{ field: 'tenant_id', value: tenantId },
			{ field: 'resource', value: pluginId },
			{ field: 'service', value: serviceName },
		];
	}

	function parseRow(row: any) {
		const data = parseJsonLike(row.data);
		return { ...row, data: dataSchema.parse(data) };
	}

	return {
		findByResourceId: async (resourceId) => {
			if (!database) return null;
			const row = await database.findOne<any>({
				table: tableName,
				where: [...baseWhere(), { field: 'resource_id', value: resourceId }],
			});
			return row ? parseRow(row) : null;
		},

		findById: async (id) => {
			if (!database) return null;
			const row = await database.findOne<any>({
				table: tableName,
				where: [...baseWhere(), { field: 'id', value: id }],
			});
			return row ? parseRow(row) : null;
		},

		findManyByResourceIds: async (resourceIds) => {
			if (!database || resourceIds.length === 0) return [];
			const rows = await database.findMany<any>({
				table: tableName,
				where: [
					...baseWhere(),
					{ field: 'resource_id', operator: 'in' as const, value: resourceIds },
				],
			});
			return rows.map(parseRow);
		},

		list: async (options) => {
			if (!database) return [];
			const rows = await database.findMany<any>({
				table: tableName,
				where: baseWhere(),
				limit: options?.limit ?? 100,
				offset: options?.offset ?? 0,
			});
			return rows.map(parseRow);
		},

		search: async ({ query, limit, offset }) => {
			if (!database) return [];
			const rows = await database.findMany<any>({
				table: tableName,
				where: [
					...baseWhere(),
					{
						field: 'resource_id',
						operator: 'like' as const,
						value: `%${query}%`,
					},
				],
				limit: limit ?? 100,
				offset: offset ?? 0,
			});
			return rows.map(parseRow);
		},

		upsert: async (resourceId, data) => {
			if (!database) throw new Error('Database not configured');
			const parsed = dataSchema.parse(data);
			const now = new Date();

			const existing = await database.findOne<{ id: string }>({
				table: tableName,
				select: ['id'],
				where: [...baseWhere(), { field: 'resource_id', value: resourceId }],
			});

			if (existing?.id) {
				await database.update({
					table: tableName,
					where: [{ field: 'id', value: existing.id }],
					data: { version, data: parsed, updated_at: now },
				});
				const updated = await database.findOne<any>({
					table: tableName,
					where: [{ field: 'id', value: existing.id }],
				});
				return parseRow(updated);
			}

			const id = generateUuidV4();
			await database.insert({
				table: tableName,
				data: {
					id,
					created_at: now,
					updated_at: now,
					tenant_id: tenantId,
					resource_id: resourceId,
					resource: pluginId,
					service: serviceName,
					version,
					data: parsed,
				},
			});

			const inserted = await database.findOne<any>({
				table: tableName,
				where: [{ field: 'id', value: id }],
			});
			return parseRow(inserted);
		},

		deleteById: async (id) => {
			if (!database) return false;
			const deleted = await database.deleteMany({
				table: tableName,
				where: [...baseWhere(), { field: 'id', value: id }],
			});
			return deleted > 0;
		},

		deleteByResourceId: async (resourceId) => {
			if (!database) return false;
			const deleted = await database.deleteMany({
				table: tableName,
				where: [...baseWhere(), { field: 'resource_id', value: resourceId }],
			});
			return deleted > 0;
		},

		count: async () => {
			if (!database) return 0;
			return database.count({ table: tableName, where: baseWhere() });
		},
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Client Builder
// ─────────────────────────────────────────────────────────────────────────────

function buildCorsairClient<const Plugins extends readonly CorsairPlugin[]>(
	plugins: Plugins,
	database: CorsairDbAdapter | undefined,
	tenantId: string | undefined,
): CorsairClient<Plugins> {
	const scopedDatabase =
		database && tenantId ? withTenantAdapter(database, tenantId) : database;

	const apiUnsafe: Record<string, Record<string, unknown>> = {};
	const pluginServicesUnsafe: Record<string, Record<string, unknown>> = {};

	for (const plugin of plugins) {
		apiUnsafe[plugin.id] = {};
		pluginServicesUnsafe[plugin.id] = {};
	}

	for (const plugin of plugins) {
		const schema = plugin.schema as
			| CorsairPluginSchema<Record<string, ZodTypeAny>>
			| undefined;

		// Create typed service clients from plugin schema
		if (schema?.services) {
			for (const [serviceName, dataSchema] of Object.entries(schema.services)) {
				const serviceClient = createServiceClient(
					scopedDatabase,
					plugin.id,
					serviceName,
					tenantId ?? 'default',
					schema.version,
					dataSchema,
				);
				pluginServicesUnsafe[plugin.id]![serviceName] = serviceClient;
				apiUnsafe[plugin.id]![serviceName] = serviceClient;
			}
		}

		// Build plugin context with service clients
		const ctxForPlugin: Record<string, unknown> = {
			database: scopedDatabase,
			...(pluginServicesUnsafe[plugin.id] ?? {}),
			...(plugin.options ? { options: plugin.options } : {}),
		};

		const endpoints = plugin.endpoints ?? {};
		const hooks = plugin.hooks as
			| Record<string, { before?: Function; after?: Function }>
			| undefined;

		// Create bound endpoints
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

		ctxForPlugin.endpoints = boundEndpoints;
	}

	const api = apiUnsafe as InferPluginNamespaces<Plugins>;

	return {
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
