import type {
	AuthFlowStatus,
	AuthorizeOpts,
	BaseToolProviderOptions,
	ExistingConnection,
	ListConnectionsOpts,
	ListConnectionsResult,
	ListToolsOpts,
	ListToolsResult,
	ResolveToolsOpts,
	ToolProviderCapabilities,
	ToolProviderConnectionScope,
	ToolProviderHealth,
	ToolProviderInfo,
	ToolProviderToolkit,
} from '@mastra/core/tool-provider';
import { BaseToolProvider } from '@mastra/core/tool-provider';
import type { ToolAction } from '@mastra/core/tools';
import type { AnyCorsairInstance } from 'corsair';
import { getStructuredSchema, listOperations } from 'corsair';
import { z } from 'zod';
import { formFieldToZod } from './form-field-to-zod.js';

/**
 * A Corsair plugin's connection state for one tenant, as reported by
 * `corsair.manage.connectionStatus`.
 */
type PluginConnectionState =
	| 'connected'
	| 'missing_credentials'
	| 'not_connected';

/**
 * The subset of Corsair's management API this provider calls. Declared locally
 * so the provider does not depend on Corsair's internal management types.
 */
interface CorsairManage {
	plugins: { list(): Promise<Array<{ id: string }>> };
	connectionStatus: {
		get(query?: {
			tenantId?: string;
		}): Promise<Record<string, PluginConnectionState>>;
	};
	connect: {
		createLink(input: {
			plugin?: string;
			tenantId?: string;
		}): Promise<{ connectUrl: string; tenantId: string }>;
	};
	disconnect(input: {
		plugin: string;
		tenantId?: string;
	}): Promise<{ ok: true; disconnected: boolean }>;
}

/**
 * Context passed to a {@link CorsairToolProviderConfig.tenantId} resolver
 * function so it can map a Mastra request to a Corsair tenant.
 */
export type TenantResolveInput = {
	/** The connection bucket Mastra is resolving, if any (decodes to a tenant). */
	connectionId?: string;
	/** The agent author's id, when the runtime provides one. */
	authorId?: string;
	/** The toolkit (Corsair plugin) slug being resolved. */
	toolkit?: string;
	/**
	 * Mastra's live per-request context. Use its typed accessors to derive the
	 * tenant for `caller-supplied` (multi-tenant) deployments.
	 */
	requestContext?: unknown;
};

/**
 * Configuration for {@link CorsairToolProvider}. Extends
 * {@link BaseToolProviderOptions} so `allowedToolkits` / `allowedTools` /
 * `defaultScope` are accepted alongside the Corsair-specific fields.
 */
export interface CorsairToolProviderConfig extends BaseToolProviderOptions {
	/** The value returned by `createCorsair()` (or `corsair.withTenant(...)`). */
	corsair: { [key: string]: unknown };
	/**
	 * How a Mastra request maps to a Corsair **tenant** — Corsair's multi-tenancy
	 * primitive, where each tenant owns its own connections and credentials.
	 * Three modes, each of which also picks the Mastra connection scope for you:
	 *
	 * - **`string`** — pin every request to one tenant (single-tenant apps).
	 *   Derives `defaultScope: 'shared'`.
	 * - **function** — choose the tenant for a *new* connection from the author
	 *   id or request context (multi-tenant SaaS). Derives
	 *   `defaultScope: 'caller-supplied'`.
	 * - **omitted** — fall back to the author id, then `'default'`. Derives
	 *   `defaultScope: 'per-author'`.
	 *
	 * An existing connection always resolves to the tenant baked into its
	 * `connectionId`, regardless of this setting, so a connection stays bound to
	 * the tenant it was created for. The derived scope is only a default; pass
	 * `defaultScope` to override it.
	 */
	tenantId?: string | ((input: TenantResolveInput) => string | Promise<string>);
}

/**
 * Derives the Mastra connection {@link ToolProviderConnectionScope} from how
 * `tenantId` is configured, so the editor buckets connections correctly without
 * a separate scope setting: a pinned string is `'shared'`, a per-request
 * function is `'caller-supplied'`, and the default author fallback is
 * `'per-author'`.
 */
function scopeForTenant(
	tenantId: CorsairToolProviderConfig['tenantId'],
): ToolProviderConnectionScope {
	if (typeof tenantId === 'string') return 'shared';
	if (typeof tenantId === 'function') return 'caller-supplied';
	return 'per-author';
}

/**
 * Encodes a `(tenant, toolkit)` pair into the opaque `connectionId`/`authId`
 * string Mastra passes around, so the provider can recover the pair later.
 *
 * @param tenantId - The Corsair tenant this connection belongs to.
 * @param toolkit - The Corsair plugin (toolkit) slug.
 * @returns A base64url token that {@link decodeConnectionId} can reverse.
 */
export function encodeConnectionId(tenantId: string, toolkit: string): string {
	return Buffer.from(
		JSON.stringify({ t: tenantId, k: toolkit }),
		'utf8',
	).toString('base64url');
}

/**
 * Reverses {@link encodeConnectionId}.
 *
 * @param id - A token previously produced by {@link encodeConnectionId}.
 * @returns The `(tenantId, toolkit)` pair, or `null` when the token is
 * malformed (never throws).
 */
export function decodeConnectionId(
	id: string,
): { tenantId: string; toolkit: string } | null {
	try {
		const parsed = JSON.parse(Buffer.from(id, 'base64url').toString('utf8'));
		if (
			parsed &&
			typeof parsed.t === 'string' &&
			typeof parsed.k === 'string'
		) {
			return { tenantId: parsed.t, toolkit: parsed.k };
		}
	} catch {
		// fall through to null
	}
	return null;
}

/**
 * Maps a Corsair connection state to a Mastra {@link AuthFlowStatus}. Only a
 * live credential (`'connected'`) completes the flow; every other state stays
 * `'pending'` so an in-progress authorize poll is not aborted.
 */
export function mapAuthStatus(state?: PluginConnectionState): AuthFlowStatus {
	return state === 'connected' ? 'completed' : 'pending';
}

/**
 * Splits Corsair's newline-delimited operation listing (from `listOperations`)
 * into individual tool slugs, tolerating blank lines and surrounding
 * whitespace.
 */
export function parseOperationPaths(listing: string): string[] {
	return listing
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean);
}

/**
 * Invokes a Corsair operation by its dotted path (e.g. `slack.api.channels.list`)
 * on a tenant-scoped instance, preserving the `this` binding of the namespace
 * that owns the method.
 */
async function invokeOperation(
	instance: unknown,
	path: string,
	args: Record<string, unknown>,
): Promise<unknown> {
	const segments = path.split('.');
	const method = segments.pop();
	if (!method) throw new Error(`Invalid operation path: ${path}`);
	let target: any = instance;
	for (const segment of segments) {
		target = target?.[segment];
		if (target == null) throw new Error(`Unknown operation path: ${path}`);
	}
	const fn = target[method];
	if (typeof fn !== 'function')
		throw new Error(`Operation is not callable: ${path}`);
	return fn.call(target, args);
}

/**
 * Exposes Corsair as a Mastra {@link BaseToolProvider}: each Corsair plugin is a
 * toolkit, each operation is a tool, and Corsair Hub's managed OAuth backs the
 * authorize / connection-status lifecycle.
 *
 * Extending `BaseToolProvider` provides the allowlist filtering and the legacy
 * `listTools()` / `resolveTools()` shims for free, so the same provider drives
 * both the Mastra editor (via the VNext surface) and static, code-config agents
 * (via `resolveTools`).
 *
 * @example
 * ```ts
 * const provider = new CorsairToolProvider({
 *   corsair,                       // createCorsair({ ... })
 *   tenantId: (req) => req.authorId ?? 'default',
 * });
 *
 * // Register with the Mastra editor:
 * new Mastra({ editor: new MastraEditor({ toolProviders: { corsair: provider } }) });
 *
 * // …or resolve tools directly for a code-config agent:
 * const tools = await provider.resolveTools(['slack.api.channels.list']);
 * ```
 */
export class CorsairToolProvider extends BaseToolProvider {
	/** Provider identity surfaced in the Mastra tool picker. */
	readonly info: ToolProviderInfo = {
		id: 'corsair',
		name: 'Corsair',
		description:
			'Managed OAuth and 200+ API integrations, with credentials stored in your own database.',
	};

	/** Feature flags the Mastra runtime branches on (batch status, in-place reauth, …). */
	readonly capabilities: ToolProviderCapabilities = {
		multipleConnectionsPerToolkit: false,
		batchConnectionStatus: true,
		reauthorizeReusesConnectionId: true,
		supportsRevoke: true,
	};

	private readonly corsair: { [key: string]: unknown };
	private readonly tenantConfig: CorsairToolProviderConfig['tenantId'];

	/**
	 * @param config - The Corsair instance plus optional tenant mapping and the
	 * inherited {@link BaseToolProviderOptions} allowlists. When `defaultScope`
	 * is omitted it is derived from `tenantId` (see {@link scopeForTenant}).
	 */
	constructor(config: CorsairToolProviderConfig) {
		super({
			allowedToolkits: config.allowedToolkits,
			allowedTools: config.allowedTools,
			defaultScope: config.defaultScope ?? scopeForTenant(config.tenantId),
		});
		this.corsair = config.corsair;
		this.tenantConfig = config.tenantId;
	}

	/** The Corsair instance re-typed as the inspect-helper union. */
	private asInstance(): AnyCorsairInstance {
		return this.corsair as unknown as AnyCorsairInstance;
	}

	/** Corsair's management namespace (plugins / connection status / connect). */
	private get manage(): CorsairManage {
		return (this.corsair as unknown as { manage: CorsairManage }).manage;
	}

	/**
	 * Resolves a request to a Corsair tenant.
	 *
	 * A decodable `connectionId` is authoritative: it is minted once when the
	 * connection is created and then handed identically to `authorize` and
	 * `resolveToolsVNext`, so binding to it keeps a connection on the same tenant
	 * for its whole lifecycle. `authorize` receives no author/request context
	 * (see {@link AuthorizeOpts}), so without this precedence a function resolver
	 * could open the OAuth flow under one tenant and later resolve tools under
	 * another. The configured mapping only chooses a tenant when minting a fresh
	 * connection (no id to decode yet).
	 */
	private async resolveTenant(input: TenantResolveInput): Promise<string> {
		if (input.connectionId) {
			const decoded = decodeConnectionId(input.connectionId);
			if (decoded) return decoded.tenantId;
		}
		const configured = this.tenantConfig;
		if (typeof configured === 'function') return configured(input);
		if (typeof configured === 'string') return configured;
		return input.authorId ?? 'default';
	}

	/** Scopes the Corsair instance to a tenant (multi-tenant), else returns it as-is. */
	private scopedInstance(tenantId: string): AnyCorsairInstance {
		const withTenant = (
			this.corsair as unknown as {
				withTenant?: (id: string) => AnyCorsairInstance;
			}
		).withTenant;
		return typeof withTenant === 'function'
			? withTenant.call(this.corsair, tenantId)
			: this.asInstance();
	}

	// ── Discovery (BaseToolProvider layers allowlist filtering on top) ──────────

	/**
	 * Every registered Corsair plugin becomes a toolkit. The base class applies
	 * `allowedToolkits` filtering on top before exposing this to the editor.
	 */
	protected async listAllToolkits(): Promise<ToolProviderToolkit[]> {
		const plugins = await this.manage.plugins.list();
		return plugins.map((plugin) => ({ slug: plugin.id, name: plugin.id }));
	}

	/**
	 * Lists a plugin's API operations as tools, honouring the `toolkit`, `search`
	 * and pagination options. The base class applies `allowedTools` filtering on
	 * top.
	 */
	protected async listAllTools(opts: ListToolsOpts): Promise<ListToolsResult> {
		const listing = listOperations(this.asInstance(), {
			plugin: opts?.toolkit,
			type: 'api',
		});
		let paths = parseOperationPaths(listing);
		if (opts?.search) {
			const needle = opts.search.toLowerCase();
			paths = paths.filter((path) => path.toLowerCase().includes(needle));
		}
		const all = paths.map((path) => ({
			slug: path,
			name: path.split('.').pop() ?? path,
			toolkit: path.split('.')[0],
		}));

		const perPage = opts?.perPage;
		if (!perPage) {
			return { data: all, pagination: { page: 1, hasMore: false } };
		}
		const page = opts?.page ?? 1;
		const start = (page - 1) * perPage;
		return {
			data: all.slice(start, start + perPage),
			pagination: { page, perPage, hasMore: start + perPage < all.length },
		};
	}

	/**
	 * The JSON Schema for one tool's input, so the editor's tool-detail view can
	 * render it without materialising the tool. Built from Corsair's structured
	 * schema; `null` when the operation is unknown or takes no input.
	 */
	async getToolSchema(
		toolSlug: string,
	): Promise<Record<string, unknown> | null> {
		const schema = getStructuredSchema(this.asInstance(), toolSlug);
		if (!schema?.input) return null;
		return z.toJSONSchema(formFieldToZod(schema.input)) as Record<
			string,
			unknown
		>;
	}

	// ── Runtime ─────────────────────────────────────────────────────────────────

	/**
	 * Materialises executable Mastra tools for the requested slugs, bound to the
	 * resolved tenant's Corsair credentials. The runtime calls this once per
	 * connection; each tool's `execute` runs the Corsair operation with the
	 * managed token from your database.
	 */
	async resolveToolsVNext(
		opts: ResolveToolsOpts,
	): Promise<Record<string, ToolAction<any, any, any>>> {
		if (opts.toolSlugs.length === 0) return {};
		const tenantId = await this.resolveTenant({
			connectionId: opts.connectionId,
			authorId: opts.authorId,
			toolkit: opts.toolkit,
			requestContext: opts.requestContext,
		});
		const scoped = this.scopedInstance(tenantId);
		const { createTool } = await import(
			/* webpackIgnore: true */ /* turbopackIgnore: true */ '@mastra/core/tools'
		);

		const tools: Record<string, ToolAction<any, any, any>> = {};
		for (const slug of opts.toolSlugs) {
			const schema = getStructuredSchema(this.asInstance(), slug);
			const inputSchema = schema?.input
				? formFieldToZod(schema.input)
				: z.object({});
			const description =
				opts.toolMeta?.[slug]?.description ?? schema?.description ?? slug;
			tools[slug] = createTool({
				id: slug,
				description,
				inputSchema,
				execute: async (inputData) =>
					invokeOperation(
						scoped,
						slug,
						(inputData ?? {}) as Record<string, unknown>,
					),
			}) as ToolAction<any, any, any>;
		}
		return tools;
	}

	// ── Managed OAuth lifecycle ───────────────────────────────────────────────

	/**
	 * Starts Corsair Hub's managed-OAuth flow for a toolkit and returns the
	 * connect URL to send the user to, plus an opaque `authId` to poll.
	 */
	async authorize(
		opts: AuthorizeOpts,
	): Promise<{ url: string; authId: string }> {
		const tenantId = await this.resolveTenant({
			connectionId: opts.connectionId,
			toolkit: opts.toolkit,
		});
		const link = await this.manage.connect.createLink({
			plugin: opts.toolkit,
			tenantId,
		});
		return {
			url: link.connectUrl,
			authId: encodeConnectionId(tenantId, opts.toolkit),
		};
	}

	/**
	 * Polls a managed-OAuth flow: returns `'completed'` once the tenant has a
	 * live credential for the toolkit, otherwise `'pending'` (`'failed'` only for
	 * an unreadable `authId`).
	 */
	async getAuthStatus(authId: string): Promise<AuthFlowStatus> {
		const decoded = decodeConnectionId(authId);
		if (!decoded) return 'failed';
		const status = await this.manage.connectionStatus.get({
			tenantId: decoded.tenantId,
		});
		return mapAuthStatus(status[decoded.toolkit]);
	}

	/**
	 * Batch-checks whether each `(connectionId, toolkit)` is still connected,
	 * grouping by resolved tenant so one status call covers many items. Result is
	 * keyed by `connectionId`.
	 */
	async getConnectionStatus(opts: {
		items: Array<{ connectionId: string; toolkit: string }>;
	}): Promise<Record<string, { connected: boolean }>> {
		const result: Record<string, { connected: boolean }> = {};
		const byTenant = new Map<
			string,
			Array<{ connectionId: string; toolkit: string }>
		>();
		for (const item of opts.items) {
			const tenantId = await this.resolveTenant({
				connectionId: item.connectionId,
				toolkit: item.toolkit,
			});
			const group = byTenant.get(tenantId) ?? [];
			group.push(item);
			byTenant.set(tenantId, group);
		}
		for (const [tenantId, items] of byTenant) {
			const status = await this.manage.connectionStatus.get({ tenantId });
			for (const item of items) {
				result[item.connectionId] = {
					connected: status[item.toolkit] === 'connected',
				};
			}
		}
		return result;
	}

	/**
	 * Lists the already-connected accounts for the given user bucket(s) + toolkit
	 * so the picker can offer them without re-running OAuth. Corsair models one
	 * connection per (tenant, toolkit), so at most one item per bucket.
	 */
	async listConnections(
		opts: ListConnectionsOpts,
	): Promise<ListConnectionsResult> {
		// userIds (multi-bucket) takes precedence over userId when present.
		const targets = opts.userIds?.length ? opts.userIds : [opts.userId];
		const items: ExistingConnection[] = [];
		for (const userId of targets) {
			const tenantId = await this.resolveTenant({
				authorId: userId,
				toolkit: opts.toolkit,
			});
			const status = await this.manage.connectionStatus.get({ tenantId });
			if (status[opts.toolkit] === 'connected') {
				items.push({
					connectionId: encodeConnectionId(tenantId, opts.toolkit),
					status: 'active',
					authorId: userId,
				});
			}
		}
		return { items, pagination: { page: 1, hasMore: false } };
	}

	/**
	 * Revokes a connection by removing its stored credentials (and account-scoped
	 * data) through Corsair's management API. Idempotent per the ToolProvider
	 * contract: an unreadable `connectionId` or an already-gone connection
	 * resolves without error.
	 */
	async revokeConnection(connectionId: string): Promise<void> {
		const decoded = decodeConnectionId(connectionId);
		if (!decoded) return;
		await this.manage.disconnect({
			plugin: decoded.toolkit,
			tenantId: decoded.tenantId,
		});
	}

	/** Reports provider health by probing Corsair's management API. */
	async getHealth(): Promise<ToolProviderHealth> {
		try {
			await this.manage.plugins.list();
			return { ok: true };
		} catch (err) {
			return {
				ok: false,
				message: err instanceof Error ? err.message : 'unavailable',
			};
		}
	}
}
