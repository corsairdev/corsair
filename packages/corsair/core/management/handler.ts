import { respondToHubDeliveryFromRequest } from '../../hub/delivery';
import type { CorsairInternalConfig } from '..';
import {
	clearConnectRequest,
	readConnectRequest,
} from '../connect-request/store';
import { getCorsairInternal } from '../utils/corsair-instance';
import type { CappedReadOptions } from './body-limit';
import {
	bodyTooLargeError,
	readRequestBodyTextCapped,
	resolveBodyStallTimeoutMs,
	resolveMaxBodyBytes,
} from './body-limit';
import { errorResponse, json, ManagementApiError, notFound } from './errors';
import {
	completeOAuthCallback,
	createConnectLink,
	createTenant,
	getConnectionStatus,
	getPermission,
	getPermissionByToken,
	getPlugin,
	getTenant,
	listPlugins,
	listTenants,
	ok,
	resolveConnect,
} from './operations';
import type { CreateConnectLinkInput, OAuthCallbackInput } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Management HTTP handler — framework-agnostic (Request) => Promise<Response>.
//
// One fetch-style core handler is the canonical entry point. Framework
// adapters (Next.js, Express, Hono) are thin fan-outs over this function.
// ─────────────────────────────────────────────────────────────────────────────

export type ManagementHandlerOptions = {
	/** Path prefix the handler is mounted at, e.g. '/api/corsair'. Stripped before dispatch. */
	basePath?: string;
	/**
	 * Upper bound for inbound request bodies in bytes. Defaults to
	 * DEFAULT_MAX_BODY_BYTES (see body-limit.ts). Enforced as an advisory
	 * content-length gate before ANY routing (including base-path Hub delivery)
	 * and, on the Node adapters, against every forwarded body regardless of who
	 * buffered it.
	 */
	maxBodyBytes?: number;
	/**
	 * Max idle gap between body bytes before a read answers 408
	 * request_timeout. Bounds trickling uploads on hosts without their own
	 * request deadline (Fastify ships `requestTimeout: 0`). 0 disables.
	 * Defaults to DEFAULT_BODY_STALL_TIMEOUT_MS (see body-limit.ts).
	 */
	bodyStallTimeoutMs?: number;
	/**
	 * Override the default error response. Return undefined to fall through.
	 * Covers errors raised inside the handler; adapter-stage failures thrown
	 * before a Request exists (e.g. a 413 from body draining) are answered with
	 * the built-in envelope and do not reach this hook.
	 */
	onError?: (
		err: unknown,
		req: Request,
	) => Response | Promise<Response> | undefined;
	/**
	 * Resolve the tenant for an incoming request from your own auth (cookies /
	 * session). When set, the tenant-scoped routes (/connect/links and
	 * /connection-status) use the returned id and IGNORE any client-sent
	 * tenantId — so a browser can't act for another tenant. Return null to reject
	 * the request as unauthenticated. Omit in single-tenant apps, or when your own
	 * backend already scopes the tenant server-side.
	 */
	resolveTenant?: (req: Request) => string | null | Promise<string | null>;
};

type RouteCtx = {
	corsair: unknown;
	internal: CorsairInternalConfig;
	req: Request;
	params: Record<string, string>;
	query: Record<string, string>;
	body: unknown;
	// The resolved tenant — see resolveScopedTenant for the tri-state.
	scopedTenant: string | null | undefined;
};

// The resolver's result is authoritative for the two routes that take a raw
// tenantId. A string scopes the request; null means the caller isn't
// authenticated for any tenant; undefined means no resolver, so trust the
// client value (single-tenant, or a server-fronted handler).
export function resolveScopedTenant(
	scoped: string | null | undefined,
	fromClient: string | undefined,
): string | undefined {
	if (scoped === undefined) return fromClient;
	if (scoped === null) {
		throw new ManagementApiError(
			401,
			'unauthenticated',
			'Could not determine the tenant for this request. Sign in and retry.',
		);
	}
	return scoped;
}

// End-user mode (resolveTenant configured): the cross-tenant admin routes are
// off so a user can't enumerate tenants or read another's records. `undefined`
// means no resolver, i.e. admin/server mode.
export function assertAdminRouteAllowed(
	scoped: string | null | undefined,
): void {
	if (scoped !== undefined) {
		throw new ManagementApiError(
			403,
			'forbidden',
			'This route is disabled when resolveTenant is configured (end-user mode). Use a handler without resolveTenant, behind your own admin auth.',
		);
	}
}

type Route = {
	method: 'GET' | 'POST';
	pattern: string;
	handler: (ctx: RouteCtx) => Promise<Response>;
};

// Inline `body as { ... }` casts narrow the parsed-JSON `unknown` to a
// structural shape for TypeScript only. Operation functions validate every
// required field at runtime (e.g., `createTenant` rejects empty `id`), so the
// cast never propagates unvalidated data.
const ROUTES: Route[] = [
	{
		method: 'GET',
		pattern: '/ok',
		handler: async () => json(200, ok()),
	},
	{
		method: 'GET',
		pattern: '/tenants',
		handler: async ({ internal, scopedTenant }) => {
			assertAdminRouteAllowed(scopedTenant);
			return json(200, await listTenants(internal));
		},
	},
	{
		method: 'POST',
		pattern: '/tenants',
		handler: async ({ internal, body, scopedTenant }) => {
			assertAdminRouteAllowed(scopedTenant);
			return json(201, await createTenant(internal, body as { id: string }));
		},
	},
	{
		method: 'GET',
		pattern: '/tenants/:id',
		handler: async ({ internal, params, scopedTenant }) => {
			assertAdminRouteAllowed(scopedTenant);
			return json(200, await getTenant(internal, params.id!));
		},
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
		handler: async ({ internal, query, scopedTenant }) =>
			json(
				200,
				await getConnectionStatus(
					internal,
					resolveScopedTenant(scopedTenant, query.tenantId),
				),
			),
	},
	{
		method: 'GET',
		pattern: '/permissions/:id',
		handler: async ({ internal, params, scopedTenant }) => {
			assertAdminRouteAllowed(scopedTenant);
			return json(200, await getPermission(internal, params.id!));
		},
	},
	{
		// POST + body, not GET + path. Tokens are short-lived authorization
		// credentials; reverse proxies and access-log formatters routinely
		// capture URL paths, so placing the token in the path leaks it.
		method: 'POST',
		pattern: '/permissions/lookup-by-token',
		handler: async ({ internal, body }) => {
			const token = (body as { token?: string } | undefined)?.token?.trim();
			if (!token) {
				return json(400, {
					error: 'bad_request',
					message: 'token is required',
					missingFields: ['token'],
				});
			}
			return json(200, await getPermissionByToken(internal, token));
		},
	},
	{
		method: 'POST',
		pattern: '/connect/links',
		handler: async ({ corsair, internal, body, scopedTenant }) => {
			const input = body as CreateConnectLinkInput;
			const tenantId = resolveScopedTenant(scopedTenant, input.tenantId);
			return json(
				200,
				await createConnectLink(corsair, internal, { ...input, tenantId }),
			);
		},
	},
	{
		method: 'GET',
		pattern: '/connect/resolve',
		handler: async ({ corsair, internal, query }) =>
			json(200, await resolveConnect(corsair, internal, query.state ?? '')),
	},
	{
		method: 'POST',
		pattern: '/connect/oauth/callback',
		handler: async ({ corsair, internal, body }) =>
			json(
				200,
				await completeOAuthCallback(
					corsair,
					internal,
					body as OAuthCallbackInput,
				),
			),
	},
	{
		// Read on-demand when a failure surfaces (read boundary / `call`), not polled.
		method: 'GET',
		pattern: '/connect/request',
		handler: async ({ internal, query, scopedTenant }) => {
			const tenantId =
				resolveScopedTenant(scopedTenant, query.tenantId) ?? 'default';
			const request = internal.database
				? await readConnectRequest(internal.database, tenantId)
				: null;
			// Tenant-scoped connect link — never let a shared cache reuse it.
			return json(200, { request }, { 'cache-control': 'no-store' });
		},
	},
	{
		method: 'POST',
		pattern: '/connect/request/clear',
		handler: async ({ internal, body, scopedTenant }) => {
			const parsed = body as { tenantId?: string; plugin?: string } | undefined;
			const tenantId =
				resolveScopedTenant(scopedTenant, parsed?.tenantId) ?? 'default';
			if (internal.database) {
				await clearConnectRequest(
					internal.database,
					tenantId,
					undefined,
					parsed?.plugin,
				);
			}
			return json(200, { ok: true });
		},
	},
];

// ── pre-flight route conflict check ─────────────────────────────────────────
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
	const normalized = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
	if (pathname === normalized) return '/';
	if (pathname.startsWith(`${normalized}/`)) {
		return pathname.slice(normalized.length);
	}
	return pathname;
}

// Reads the request body under the byte-counting cap and stall watchdog, then
// parses it as JSON. Limit errors keep their own envelope (413/408); every
// other read failure still maps to invalid_json exactly like before.
async function parseBody(
	req: Request,
	limits: CappedReadOptions,
): Promise<unknown> {
	if (req.method === 'GET' || req.method === 'HEAD') return undefined;
	const ct = req.headers.get('content-type') ?? '';
	if (!ct.includes('application/json')) return undefined;
	const text = await readRequestBodyTextCapped(req, limits).catch(
		(err: unknown) => {
			if (err instanceof ManagementApiError) throw err;
			throw new ManagementApiError(
				400,
				'invalid_json',
				'Request body is not valid JSON',
			);
		},
	);
	if (!text) return undefined;
	try {
		return JSON.parse(text);
	} catch {
		throw new ManagementApiError(
			400,
			'invalid_json',
			'Request body is not valid JSON',
		);
	}
}

const DEFAULT_BASE_PATH = '/api/corsair';

export function managementHandler(
	// `corsair: unknown` is intentional: the handler accepts both
	// CorsairSingleTenantClient and CorsairTenantWrapper, but it never reads
	// public properties — only the CORSAIR_INTERNAL symbol via getInternal().
	// Typing this as the union of both client shapes would require importing
	// the generic Plugins type parameter at every call site and adds no
	// safety, since the symbol read is dynamic.
	corsair: unknown,
	opts: ManagementHandlerOptions = {},
): (req: Request) => Promise<Response> {
	const basePath = opts.basePath ?? DEFAULT_BASE_PATH;
	const maxBodyBytes = resolveMaxBodyBytes(opts.maxBodyBytes);
	const bodyStallTimeoutMs = resolveBodyStallTimeoutMs(opts.bodyStallTimeoutMs);
	// Every body read below funnels through these two resolved values.
	const bodyLimits: CappedReadOptions = { maxBodyBytes, bodyStallTimeoutMs };
	const internal = getCorsairInternal(
		corsair,
		() =>
			new Error(
				'managementHandler: invalid corsair instance (missing internal config)',
			),
	);

	return async (req: Request): Promise<Response> => {
		try {
			// Cheap advisory gate BEFORE any routing: rejects oversized bodies
			// that DECLARE their length without reading a byte (covers the
			// base-path Hub delivery branch too). Bodies that arrive chunked
			// with no declared length are bounded by the byte-counting reads
			// themselves (parseBody / hub delivery), and the Node adapters by
			// the bridge drain (resolveBody).
			const contentLength = req.headers.get('content-length');
			if (contentLength !== null && Number(contentLength) > maxBodyBytes) {
				throw bodyTooLargeError(maxBodyBytes);
			}

			const url = new URL(req.url);
			const pathname = stripBasePath(url.pathname, basePath);
			const method = req.method.toUpperCase();

			// Hub delivery is mounted at the base path (e.g. GET /api/corsair?d=…,
			// POST signed envelopes). OPTIONS supports browser-delivery CORS preflight.
			if (method === 'OPTIONS' || pathname === '/' || pathname === '') {
				return await respondToHubDeliveryFromRequest(corsair, req, {
					maxBodyBytes,
					bodyStallTimeoutMs,
				});
			}

			if (method !== 'GET' && method !== 'POST') {
				return json(405, {
					error: 'method_not_allowed',
					message: `Method ${method} not allowed`,
				});
			}

			const query = Object.fromEntries(url.searchParams);

			for (const route of ROUTES) {
				if (route.method !== method) continue;
				const params = matchPattern(route.pattern, pathname);
				if (!params) continue;
				const body = await parseBody(req, bodyLimits);
				const scopedTenant = opts.resolveTenant
					? await opts.resolveTenant(req)
					: undefined;
				return await route.handler({
					corsair,
					internal,
					req,
					params,
					query,
					body,
					scopedTenant,
				});
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
