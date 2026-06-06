import type { CorsairInternalConfig } from '..';
import { CORSAIR_INTERNAL } from '..';
import { errorResponse, json, ManagementApiError, notFound } from './errors';
import {
	createTenant,
	getConnectionStatus,
	getPermission,
	getPermissionByToken,
	getPlugin,
	getTenant,
	listPlugins,
	listTenants,
	ok,
} from './operations';

// ─────────────────────────────────────────────────────────────────────────────
// Management HTTP handler — framework-agnostic (Request) => Promise<Response>.
//
// Mirrors better-auth's one-core-handler design. Framework adapters in Phase 1b
// will be thin fan-outs over this single function.
// ─────────────────────────────────────────────────────────────────────────────

export type ManagementHandlerOptions = {
	/** Path prefix the handler is mounted at, e.g. '/api/corsair'. Stripped before dispatch. */
	basePath?: string;
	/** Override the default error response. Return undefined to fall through. */
	onError?: (
		err: unknown,
		req: Request,
	) => Response | Promise<Response> | undefined;
};

type RouteCtx = {
	internal: CorsairInternalConfig;
	req: Request;
	params: Record<string, string>;
	query: Record<string, string>;
	body: unknown;
};

type Route = {
	method: 'GET' | 'POST';
	pattern: string;
	handler: (ctx: RouteCtx) => Promise<Response>;
};

const ROUTES: Route[] = [
	{
		method: 'GET',
		pattern: '/ok',
		handler: async () => json(200, ok()),
	},
	{
		method: 'GET',
		pattern: '/tenants',
		handler: async ({ internal }) => json(200, await listTenants(internal)),
	},
	{
		method: 'POST',
		pattern: '/tenants',
		handler: async ({ internal, body }) =>
			json(
				200,
				await createTenant(internal, body as { id: string }),
			),
	},
	{
		method: 'GET',
		pattern: '/tenants/:id',
		handler: async ({ internal, params }) =>
			json(200, await getTenant(internal, params.id!)),
	},
	{
		method: 'GET',
		pattern: '/plugins',
		handler: async ({ internal }) => json(200, await listPlugins(internal)),
	},
	{
		method: 'GET',
		pattern: '/plugins/:id',
		handler: async ({ internal, params }) =>
			json(200, await getPlugin(internal, params.id!)),
	},
	{
		method: 'GET',
		pattern: '/connection-status',
		handler: async ({ internal, query }) =>
			json(200, await getConnectionStatus(internal, query.tenantId)),
	},
	{
		method: 'GET',
		pattern: '/permissions/:id',
		handler: async ({ internal, params }) =>
			json(200, await getPermission(internal, params.id!)),
	},
	{
		method: 'GET',
		pattern: '/permissions/by-token/:token',
		handler: async ({ internal, params }) =>
			json(200, await getPermissionByToken(internal, params.token!)),
	},
];

// ── pre-flight conflict check (better-auth pattern) ─────────────────────────
(() => {
	const seen = new Set<string>();
	for (const r of ROUTES) {
		const key = `${r.method} ${r.pattern}`;
		if (seen.has(key)) {
			throw new Error(`Duplicate management route registered: ${key}`);
		}
		seen.add(key);
	}
})();

function matchPattern(
	pattern: string,
	pathname: string,
): Record<string, string> | null {
	const pSegs = pattern.split('/').filter(Boolean);
	const aSegs = pathname.split('/').filter(Boolean);
	if (pSegs.length !== aSegs.length) return null;
	const params: Record<string, string> = {};
	for (let i = 0; i < pSegs.length; i++) {
		const p = pSegs[i]!;
		const a = aSegs[i]!;
		if (p.startsWith(':')) {
			params[p.slice(1)] = decodeURIComponent(a);
		} else if (p !== a) {
			return null;
		}
	}
	return params;
}

function stripBasePath(pathname: string, basePath: string): string {
	if (!basePath) return pathname;
	const normalized = basePath.endsWith('/')
		? basePath.slice(0, -1)
		: basePath;
	if (pathname === normalized) return '/';
	if (pathname.startsWith(`${normalized}/`)) {
		return pathname.slice(normalized.length);
	}
	return pathname;
}

function getInternal(corsair: unknown): CorsairInternalConfig {
	const internal = (corsair as Record<symbol, unknown>)[CORSAIR_INTERNAL] as
		| CorsairInternalConfig
		| undefined;
	if (!internal) {
		throw new Error(
			'managementHandler: invalid corsair instance (missing internal config)',
		);
	}
	return internal;
}

async function parseBody(req: Request): Promise<unknown> {
	if (req.method === 'GET' || req.method === 'HEAD') return undefined;
	const ct = req.headers.get('content-type') ?? '';
	if (!ct.includes('application/json')) return undefined;
	try {
		const text = await req.text();
		if (!text) return undefined;
		return JSON.parse(text);
	} catch {
		throw new ManagementApiError(400, 'invalid_json', 'Request body is not valid JSON');
	}
}

const DEFAULT_BASE_PATH = '/api/corsair';

export function managementHandler(
	corsair: unknown,
	opts: ManagementHandlerOptions = {},
): (req: Request) => Promise<Response> {
	const basePath = opts.basePath ?? DEFAULT_BASE_PATH;
	const internal = getInternal(corsair);

	return async (req: Request): Promise<Response> => {
		try {
			const url = new URL(req.url);
			const pathname = stripBasePath(url.pathname, basePath);
			const method = req.method.toUpperCase() as 'GET' | 'POST';
			const query = Object.fromEntries(url.searchParams);

			for (const route of ROUTES) {
				if (route.method !== method) continue;
				const params = matchPattern(route.pattern, pathname);
				if (!params) continue;
				const body = await parseBody(req);
				return await route.handler({ internal, req, params, query, body });
			}

			throw notFound(`No route for ${method} ${pathname}`);
		} catch (err) {
			if (opts.onError) {
				const overridden = await opts.onError(err, req);
				if (overridden) return overridden;
			}
			if (err instanceof ManagementApiError) return errorResponse(err);
			const message =
				err instanceof Error ? err.message : 'Internal server error';
			return json(500, { error: 'internal_error', message });
		}
	};
}
