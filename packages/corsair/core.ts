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
	Endpoints extends BoundEndpointTree = BoundEndpointTree,
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

/**
 * A tree of endpoints that can be nested arbitrarily deep.
 * Supports both flat and nested organization like tRPC routers.
 *
 * @example
 * ```ts
 * // Flat structure
 * endpoints: {
 *   channelsGet: async (ctx, args) => { ... },
 *   channelsList: async (ctx, args) => { ... },
 * }
 *
 * // Nested structure (tRPC-style)
 * endpoints: {
 *   channels: {
 *     get: async (ctx, args) => { ... },
 *     list: async (ctx, args) => { ... },
 *   },
 *   users: {
 *     get: async (ctx, args) => { ... },
 *   },
 * }
 * ```
 */
export type EndpointTree = {
	[key: string]: CorsairEndpoint<any, any, any> | EndpointTree;
};

/**
 * A tree of bound endpoints (context already applied).
 */
export type BoundEndpointTree = {
	[key: string]: BoundEndpointFn<any, any> | BoundEndpointTree;
};

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

/**
 * Recursively maps an endpoint tree to a hooks map with the same structure.
 * Each endpoint gets optional before/after hooks.
 */
type CorsairEndpointHooksMap<Endpoints extends EndpointTree> = {
	[K in keyof Endpoints]?: Endpoints[K] extends CorsairEndpoint<any, any, any>
		? {
				before?: (
					ctx: EndpointContext<Endpoints[K]>,
					args: EndpointArgs<Endpoints[K]>,
				) => void | Promise<void>;
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
// Plugin Types
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairPlugin<
	Id extends Providers = Providers,
	Endpoints extends EndpointTree | undefined = EndpointTree | undefined,
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
	hooks?: Endpoints extends EndpointTree
		? CorsairEndpointHooksMap<Endpoints>
		: never;
};

/**
 * Recursively transforms endpoint definitions to their bound (context-free) signatures.
 * Handles both flat and nested endpoint structures.
 */
export type BindEndpoints<T extends EndpointTree> = {
	[K in keyof T]: T[K] extends CorsairEndpoint<any, infer A, infer R>
		? (args: A) => Promise<R>
		: T[K] extends EndpointTree
			? BindEndpoints<T[K]>
			: never;
};

/**
 * Extracts typed service clients from a plugin schema.
 * Each service becomes a `PluginServiceClient<DataSchema>`.
 * Services are nested under `db` to separate them from API endpoints.
 */
type InferPluginServices<
	Schema extends CorsairPluginSchema<Record<string, ZodTypeAny>> | undefined,
> = Schema extends CorsairPluginSchema<infer Services>
	? { db: PluginServiceClients<Services> }
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
	Endpoints extends EndpointTree | undefined = undefined,
> = CorsairContext<
	Endpoints extends EndpointTree ? BindEndpoints<Endpoints> : BoundEndpointTree
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
			[K in Id]: (Endpoints extends EndpointTree
				? { api: BindEndpoints<Endpoints> }
				: {}) &
				InferPluginServices<Schema>;
		}
	: never;

type InferPluginNamespaces<Plugins extends readonly CorsairPlugin[]> =
	UnionToIntersection<InferPluginNamespace<Plugins[number]>>;

export type CorsairIntegration<Plugins extends readonly CorsairPlugin[]> = {
	/** Database adapter for ORM services (e.g. `slack.api.messages.post(...)` for API, `slack.db.messages.findByResourceId(...)` for DB). */
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

/**
 * Checks if a value is an endpoint function (has function signature).
 */
function isEndpoint(value: unknown): value is Function {
	return typeof value === 'function';
}

/**
 * Recursively binds endpoints in a tree structure.
 * Handles both flat (key -> fn) and nested (key -> { key -> fn }) structures.
 */
function bindEndpointsRecursively(
	endpoints: Record<string, unknown>,
	hooks: Record<string, unknown> | undefined,
	ctx: Record<string, unknown>,
	boundTree: Record<string, unknown>,
	apiTree: Record<string, unknown>,
): void {
	for (const [key, value] of Object.entries(endpoints)) {
		const nodeHooks = hooks?.[key] as Record<string, unknown> | undefined;

		if (isEndpoint(value)) {
			// It's an endpoint function - bind it with context and hooks
			const endpointHooks = nodeHooks as
				| { before?: Function; after?: Function }
				| undefined;

			const boundFn = (...args: unknown[]) => {
				const call = () => value(ctx, ...args);

				if (!endpointHooks?.before && !endpointHooks?.after) {
					return call();
				}

				return (async () => {
					await endpointHooks.before?.(ctx, ...args);
					const res = await call();
					await endpointHooks.after?.(ctx, res);
					return res;
				})();
			};

			boundTree[key] = boundFn;
			apiTree[key] = boundFn;
		} else if (value && typeof value === 'object') {
			// It's a nested object - recurse into it
			const nestedBoundTree: Record<string, unknown> = {};
			const nestedApiTree: Record<string, unknown> = {};

			bindEndpointsRecursively(
				value as Record<string, unknown>,
				nodeHooks as Record<string, unknown> | undefined,
				ctx,
				nestedBoundTree,
				nestedApiTree,
			);

			boundTree[key] = nestedBoundTree;
			apiTree[key] = nestedApiTree;
		}
	}
}

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

		// Create typed service clients from plugin schema, nested under `db`
		if (schema?.services) {
			const dbClients: Record<string, unknown> = {};
			for (const [serviceName, dataSchema] of Object.entries(schema.services)) {
				const serviceClient = createServiceClient(
					scopedDatabase,
					plugin.id,
					serviceName,
					tenantId ?? 'default',
					schema.version,
					dataSchema,
				);
				dbClients[serviceName] = serviceClient;
			}
			pluginServicesUnsafe[plugin.id]!.db = dbClients;
			apiUnsafe[plugin.id]!.db = dbClients;
		}

		// Build plugin context with service clients under `db`
		const ctxForPlugin: Record<string, unknown> = {
			database: scopedDatabase,
			db: pluginServicesUnsafe[plugin.id]?.db ?? {},
			...(plugin.options ? { options: plugin.options } : {}),
		};

		const endpoints = (plugin.endpoints ?? {}) as Record<string, unknown>;
		const hooks = plugin.hooks as Record<string, unknown> | undefined;

		// Create bound endpoints under `api` (supports nested structures)
		const boundEndpoints: Record<string, unknown> = {};
		const apiEndpoints: Record<string, unknown> = {};
		bindEndpointsRecursively(
			endpoints,
			hooks,
			ctxForPlugin,
			boundEndpoints,
			apiEndpoints,
		);

		// Put API endpoints under the `api` key
		if (Object.keys(apiEndpoints).length > 0) {
			apiUnsafe[plugin.id]!.api = apiEndpoints;
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
