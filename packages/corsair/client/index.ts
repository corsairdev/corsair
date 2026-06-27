import type {
	ConnectionStatus,
	ConnectLink,
	ManagementOk,
	OAuthCallbackResult,
	PermissionRecord,
	PluginInfo,
	ResolvedConnectLink,
	Tenant,
} from '../core/management/types';
import type { CorsairClientOptions, CorsairManagementClient } from './types';
import { CorsairClientError } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// createCorsairClient — vanilla client for the management control plane.
//
// Phase 1a ships an explicit dispatch (9 routes). Phase 2 will swap this for
// a recursive Proxy once routes become plugin-extensible. The public shape
// stays the same: client.tenants.list(), client.plugins.get(id), etc.
// ─────────────────────────────────────────────────────────────────────────────

function trimBase(base: string): string {
	return base.endsWith('/') ? base.slice(0, -1) : base;
}

async function parseError(res: Response): Promise<CorsairClientError> {
	let body: Record<string, unknown> = {};
	try {
		body = (await res.json()) as Record<string, unknown>;
	} catch {
		// non-JSON error body
	}
	const code = typeof body.error === 'string' ? body.error : 'request_failed';
	const message =
		typeof body.message === 'string'
			? body.message
			: `Request failed (${res.status})`;
	const { error: _e, message: _m, ...extra } = body;
	return new CorsairClientError(res.status, code, message, extra);
}

export function createCorsairClient(
	opts: CorsairClientOptions,
): CorsairManagementClient {
	const baseURL = trimBase(opts.baseURL);
	// Defer globalThis.fetch binding to call time so environments that inject
	// fetch after module load (e.g. jsdom test environments) work correctly.
	// An explicit opts.fetch always wins.
	const fetchImpl =
		opts.fetch ?? ((...args: Parameters<typeof fetch>) => globalThis.fetch(...args));

	async function getJson<T>(
		path: string,
		query?: Record<string, string>,
	): Promise<T> {
		const qs =
			query && Object.keys(query).length
				? `?${new URLSearchParams(query).toString()}`
				: '';
		const res = await fetchImpl(`${baseURL}${path}${qs}`, { method: 'GET' });
		if (!res.ok) throw await parseError(res);
		return (await res.json()) as T;
	}

	async function postJson<T>(path: string, body: unknown): Promise<T> {
		const res = await fetchImpl(`${baseURL}${path}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),
		});
		if (!res.ok) throw await parseError(res);
		return (await res.json()) as T;
	}

	const enc = encodeURIComponent;

	return {
		ok: () => getJson<ManagementOk>('/ok'),
		tenants: {
			list: () => getJson<Tenant[]>('/tenants'),
			create: (input) => postJson<Tenant>('/tenants', input),
			get: (id) => getJson<Tenant>(`/tenants/${enc(id)}`),
		},
		plugins: {
			list: () => getJson<PluginInfo[]>('/plugins'),
			get: (id) => getJson<PluginInfo>(`/plugins/${enc(id)}`),
		},
		connectionStatus: {
			get: (q) => {
				const query: Record<string, string> = {};
				if (q?.tenantId) query.tenantId = q.tenantId;
				return getJson<ConnectionStatus>('/connection-status', query);
			},
		},
		permissions: {
			get: (input) => {
				if ('id' in input) {
					return getJson<PermissionRecord>(`/permissions/${enc(input.id)}`);
				}
				return postJson<PermissionRecord>('/permissions/lookup-by-token', {
					token: input.token,
				});
			},
		},
		connect: {
			createLink: (input) => postJson<ConnectLink>('/connect/links', input),
			resolve: (state) =>
				getJson<ResolvedConnectLink>('/connect/resolve', { state }),
			oauthCallback: (input) =>
				postJson<OAuthCallbackResult>('/connect/oauth/callback', input),
		},
	};
}

export type {
	CorsairClientOptions,
	CorsairManagementClient,
} from './types';
export { CorsairClientError } from './types';
