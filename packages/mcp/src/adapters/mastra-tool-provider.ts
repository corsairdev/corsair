import type {
	AuthFlowStatus,
	AuthorizeOpts,
	ExistingConnection,
	ListConnectionsOpts,
	ListConnectionsResult,
	ListToolProviderToolsOptions,
	ResolveToolProviderToolsOptions,
	ToolProvider,
	ToolProviderCapabilities,
	ToolProviderHealth,
	ToolProviderInfo,
	ToolProviderListResult,
	ToolProviderToolInfo,
	ToolProviderToolkit,
} from '@mastra/core/tool-provider';
import type { ToolAction } from '@mastra/core/tools';
import type { AnyCorsairInstance } from 'corsair';
import { getStructuredSchema, listOperations } from 'corsair';
import { z } from 'zod';
import { formFieldToZod } from './form-field-to-zod.js';

type PluginConnectionState =
	| 'connected'
	| 'missing_credentials'
	| 'not_connected';

// The subset of Corsair's management API this provider calls. Declared locally
// so the provider does not depend on Corsair's internal management types.
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
}

type TenantResolveInput = {
	userId?: string;
	connectionId?: string;
	toolkit?: string;
};

export interface CorsairToolProviderConfig {
	/** The value returned by `createCorsair()` (or `corsair.withTenant(...)`). */
	corsair: { [key: string]: unknown };
	/**
	 * Maps a Mastra identity to a Corsair tenant. A string pins one tenant; a
	 * function resolves per request. Defaults to the decoded connection, then the
	 * caller's userId, then `'default'`.
	 */
	tenantId?: string | ((input: TenantResolveInput) => string | Promise<string>);
}

// A Corsair connection is identified by (tenant, plugin). Mastra hands us an
// opaque connectionId/authId, so we encode that pair into it and decode on the
// way back.
export function encodeConnectionId(tenantId: string, toolkit: string): string {
	return Buffer.from(
		JSON.stringify({ t: tenantId, k: toolkit }),
		'utf8',
	).toString('base64url');
}

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

// Only a live credential means the flow is done. Every other state
// (not_connected, or missing_credentials mid-flow) is still pending — mapping
// them to 'failed' would abort an authorize poll that has not completed yet.
export function mapAuthStatus(state?: PluginConnectionState): AuthFlowStatus {
	return state === 'connected' ? 'completed' : 'pending';
}

export function parseOperationPaths(listing: string): string[] {
	return listing
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean);
}

async function invokeOperation(
	instance: unknown,
	path: string,
	args: Record<string, unknown>,
): Promise<unknown> {
	const segments = path.split('.');
	const method = segments.pop();
	if (!method) throw new Error(`Invalid operation path: ${path}`);
	// Walk the instance namespace, keeping the parent so the method call retains
	// its `this` binding.
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
 * Exposes Corsair as a Mastra {@link ToolProvider}: each Corsair plugin is a
 * toolkit, each operation is a tool, and Corsair Hub's managed OAuth backs the
 * authorize / connection-status lifecycle.
 */
export class CorsairToolProvider implements ToolProvider {
	readonly info: ToolProviderInfo = {
		id: 'corsair',
		name: 'Corsair',
		description:
			'Managed OAuth and 200+ API integrations, with credentials stored in your own database.',
	};

	readonly capabilities: ToolProviderCapabilities = {
		multipleConnectionsPerToolkit: false,
		batchConnectionStatus: true,
		reauthorizeReusesConnectionId: true,
		supportsRevoke: false,
	};

	readonly defaultScope = 'caller-supplied' as const;

	private readonly corsair: { [key: string]: unknown };
	private readonly tenantConfig: CorsairToolProviderConfig['tenantId'];

	constructor(config: CorsairToolProviderConfig) {
		this.corsair = config.corsair;
		this.tenantConfig = config.tenantId;
	}

	// The public config accepts the loosely-typed instance (matching the rest of
	// this package); the inspect helpers want the AnyCorsairInstance union.
	private asInstance(): AnyCorsairInstance {
		return this.corsair as unknown as AnyCorsairInstance;
	}

	private get manage(): CorsairManage {
		return (this.corsair as unknown as { manage: CorsairManage }).manage;
	}

	private async resolveTenant(input: TenantResolveInput): Promise<string> {
		const configured = this.tenantConfig;
		if (typeof configured === 'function') return configured(input);
		if (typeof configured === 'string') return configured;
		if (input.connectionId) {
			const decoded = decodeConnectionId(input.connectionId);
			if (decoded) return decoded.tenantId;
		}
		return input.userId ?? 'default';
	}

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

	async listToolkits(): Promise<ToolProviderListResult<ToolProviderToolkit>> {
		const plugins = await this.manage.plugins.list();
		return {
			data: plugins.map((plugin) => ({ slug: plugin.id, name: plugin.id })),
			pagination: { hasMore: false },
		};
	}

	async listTools(
		options?: ListToolProviderToolsOptions,
	): Promise<ToolProviderListResult<ToolProviderToolInfo>> {
		const listing = listOperations(this.asInstance(), {
			plugin: options?.toolkit,
			type: 'api',
		});
		let paths = parseOperationPaths(listing);
		if (options?.search) {
			const needle = options.search.toLowerCase();
			paths = paths.filter((path) => path.toLowerCase().includes(needle));
		}
		const all: ToolProviderToolInfo[] = paths.map((path) => ({
			slug: path,
			name: path.split('.').pop() ?? path,
			toolkit: path.split('.')[0],
		}));

		const perPage = options?.perPage;
		if (!perPage) {
			return { data: all, pagination: { total: all.length, hasMore: false } };
		}
		const page = options?.page ?? 1;
		const start = (page - 1) * perPage;
		return {
			data: all.slice(start, start + perPage),
			pagination: {
				total: all.length,
				page,
				perPage,
				hasMore: start + perPage < all.length,
			},
		};
	}

	async resolveTools(
		toolSlugs: string[],
		_toolConfigs?: Record<string, unknown>,
		options?: ResolveToolProviderToolsOptions,
	): Promise<Record<string, ToolAction<any, any, any>>> {
		if (toolSlugs.length === 0) return {};
		const tenantId = await this.resolveTenant({ userId: options?.userId });
		const scoped = this.scopedInstance(tenantId);
		const { createTool } = await import(
			/* webpackIgnore: true */ /* turbopackIgnore: true */ '@mastra/core/tools'
		);

		const tools: Record<string, ToolAction<any, any, any>> = {};
		for (const slug of toolSlugs) {
			const schema = getStructuredSchema(this.asInstance(), slug);
			const inputSchema = schema?.input
				? formFieldToZod(schema.input)
				: z.object({});
			tools[slug] = createTool({
				id: slug,
				description: schema?.description ?? slug,
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

	async getAuthStatus(authId: string): Promise<AuthFlowStatus> {
		const decoded = decodeConnectionId(authId);
		if (!decoded) return 'failed';
		const status = await this.manage.connectionStatus.get({
			tenantId: decoded.tenantId,
		});
		return mapAuthStatus(status[decoded.toolkit]);
	}

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

	async listConnections(
		opts: ListConnectionsOpts,
	): Promise<ListConnectionsResult> {
		// userIds (multi-bucket) takes precedence over userId when present.
		const targets = opts.userIds?.length ? opts.userIds : [opts.userId];
		const items: ExistingConnection[] = [];
		for (const userId of targets) {
			const tenantId = await this.resolveTenant({
				userId,
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
