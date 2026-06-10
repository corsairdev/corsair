import type {
	ConnectionStatus,
	ManagementOk,
	PermissionRecord,
	PluginInfo,
	Tenant,
} from '../core/management/types';
import type {
	CorsairClientOptions,
	CorsairManagementClient,
} from './types';
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
	const fetchImpl = opts.fetch ?? globalThis.fetch.bind(globalThis);

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
			get: (id) => getJson<PermissionRecord>(`/permissions/${enc(id)}`),
			// POST + body keeps the token off the URL where reverse proxies and
			// access logs would capture it.
			getByToken: (token) =>
				postJson<PermissionRecord>('/permissions/lookup-by-token', { token }),
		},
	};
}

export { CorsairClientError } from './types';
export type {
	CorsairClientOptions,
	CorsairManagementClient,
} from './types';
