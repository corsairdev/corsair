export type StatusResp = {
	multiTenancy: boolean;
	pluginCount: number;
	hasDatabase: boolean;
	cwd: string;
};

export type PluginField = {
	name: string;
	level: 'integration' | 'account';
	set: boolean;
};

export type PluginInfo = {
	id: string;
	authType: 'oauth_2' | 'api_key' | 'bot_token' | 'none';
	authed: boolean;
	requiredFields: PluginField[];
	oauth: {
		available: boolean;
		scopes: readonly string[];
		providerName: string | null;
	} | null;
};

export type PluginAuthState = {
	authType: PluginInfo['authType'] | null;
	integration: Record<string, string | null>;
	account: Record<string, string | null>;
};

export type TenantListResp = {
	tenants: string[];
};

export type OperationResult =
	| { ok: true; durationMs: number; result: unknown }
	| { ok: false; durationMs: number; error: string };

export type DbTablesResp = {
	core: string[];
	missing: string[];
	all: string[];
};

export type DbRowsResp = {
	rows: Array<Record<string, unknown>>;
	limit: number;
	offset: number;
};

export type DbEntityRowsResp = {
	rows: Array<Record<string, unknown>>;
	limit: number;
	offset: number;
	total: number;
	hasMore: boolean;
};

export type DbEntitySortField = 'created_at' | 'updated_at';
export type DbEntitySortDirection = 'asc' | 'desc';

async function request<T>(
	method: 'GET' | 'POST',
	path: string,
	body?: unknown,
): Promise<T> {
	const controller = new AbortController();
	const timeoutId = window.setTimeout(() => controller.abort(), 15000);
	let res: Response;
	try {
		res = await fetch(path, {
			method,
			headers: body ? { 'content-type': 'application/json' } : undefined,
			body: body ? JSON.stringify(body) : undefined,
			signal: controller.signal,
		});
	} catch (err) {
		if (err instanceof Error && err.name === 'AbortError') {
			throw new Error(`Request timed out: ${path}`);
		}
		throw err;
	} finally {
		window.clearTimeout(timeoutId);
	}
	const text = await res.text();
	let data: unknown = null;
	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		throw new Error(`Bad JSON from ${path}: ${text.slice(0, 200)}`);
	}
	if (!res.ok) {
		const msg =
			data && typeof data === 'object' && 'error' in data
				? String((data as { error: unknown }).error)
				: `Request failed (${res.status})`;
		throw new Error(msg);
	}
	return data as T;
}

export const api = {
	status: () => request<StatusResp>('GET', '/api/status'),
	plugins: (tenant?: string, scope: 'main' | 'tenant' = 'tenant') =>
		request<PluginInfo[]>(
			'GET',
			`/api/plugins?scope=${scope}${tenant ? `&tenant=${encodeURIComponent(tenant)}` : ''}`,
		),
	listOperations: (input: {
		plugin?: string;
		type?: 'api' | 'webhooks' | 'db';
	}) =>
		request<Record<string, string[]> | string[] | string>(
			'POST',
			'/api/operations/list',
			input,
		),
	schema: (path: string) =>
		request<{ schema: string }>('POST', '/api/operations/schema', { path }),
	runOperation: (input: { path: string; input: unknown; tenant?: string }) =>
		request<OperationResult>('POST', '/api/operations/run', input),
	runScript: (input: { code: string; tenant?: string }) =>
		request<OperationResult>('POST', '/api/operations/script', input),

	getCredentials: (input: {
		pluginId: string;
		tenantId?: string;
		scope?: 'main' | 'tenant';
		showRaw?: boolean;
	}) => request<PluginAuthState>('POST', '/api/credentials/get', input),
	setCredentials: (input: {
		pluginId: string;
		tenantId?: string;
		scope?: 'main' | 'tenant';
		fields: Record<string, string>;
	}) =>
		request<{ ok: true; updated: string[] }>(
			'POST',
			'/api/credentials/set',
			input,
		),
	listTenants: () => request<TenantListResp>('GET', '/api/tenants'),
	createTenant: (input: { tenantId: string }) =>
		request<{ ok: true; created: boolean }>(
			'POST',
			'/api/tenants/create',
			input,
		),
	setupPlugin: (input: { pluginId: string; tenantId?: string }) =>
		request<{ ok: true }>('POST', '/api/plugins/setup', input),

	startOAuth: (input: { pluginId: string; tenantId?: string }) =>
		request<{
			status: 'pending_oauth' | 'needs_code';
			authUrl: string;
			redirectUri: string;
			note?: string;
		}>('POST', '/api/auth/start', input),
	exchangeOAuth: (input: {
		pluginId: string;
		tenantId?: string;
		code: string;
	}) => request<{ ok: true }>('POST', '/api/auth/exchange', input),

	dbTables: () => request<DbTablesResp>('GET', '/api/db/tables'),
	dbRows: (input: { table: string; limit?: number; offset?: number }) =>
		request<DbRowsResp>('POST', '/api/db/rows', input),
	dbEntityRows: (input: {
		tenant: string;
		integration: string;
		entity: string;
		search?: string;
		limit?: number;
		offset?: number;
		sortField?: DbEntitySortField;
		sortDirection?: DbEntitySortDirection;
	}) => request<DbEntityRowsResp>('POST', '/api/db/entities/query', input),
	permissions: () =>
		request<{ rows: Array<Record<string, unknown>>; note?: string }>(
			'GET',
			'/api/db/permissions',
		),
};
