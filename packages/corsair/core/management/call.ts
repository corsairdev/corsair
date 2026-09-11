import type { CorsairInternalConfig } from '..';
import { AuthMissingError } from '../auth/errors/auth-missing';
import {
	PermissionRequiredError,
	ReadonlyForbiddenError,
} from '../permissions';
import { badRequest, ManagementApiError } from './errors';

export type ResolveCallInput = {
	plugin: string;
	op: string;
	tenant?: string;
	args?: unknown;
};

// ── call-specific error factories (reuse ManagementApiError; errorResponse
// spreads `extra` into the body, so reason/providerStatus/body surface). ──
const unknownPlugin = (plugin: string) =>
	new ManagementApiError(
		404,
		'unknown_plugin',
		`Plugin '${plugin}' is not registered.`,
	);
const unknownOp = (plugin: string, op: string) =>
	new ManagementApiError(
		404,
		'unknown_op',
		`Operation '${op}' not found on plugin '${plugin}'.`,
	);
export const callDisabled = () =>
	new ManagementApiError(
		403,
		'call_disabled',
		'The /call route is disabled. Construct managementHandler with { unsafeAllowUnauthenticated: true } to enable it — only when your own backend fronts the handler.',
	);
const notConnected = (plugin: string) =>
	new ManagementApiError(
		401,
		'not_connected',
		`Tenant is not connected for plugin '${plugin}'. Reconnect and retry.`,
	);
const permissionDenied = (reason: string) =>
	new ManagementApiError(
		403,
		'permission_denied',
		`The call was blocked (${reason}).`,
		{ reason },
	);
const approvalRequired = () =>
	new ManagementApiError(
		403,
		'approval_required',
		'This action needs human approval before it can run. Approval is not resumable over HTTP in this version.',
		{ reason: 'pending' },
	);
// G4: body is EXACTLY { providerStatus, body }. Never spread the ApiError — its
// `request` carries the Authorization header, which must not reach a client.
const providerError = (providerStatus: number, body: unknown) =>
	new ManagementApiError(
		502,
		'provider_error',
		'The provider returned an error.',
		{ providerStatus, body },
	);

function normalizeCallError(err: unknown, plugin: string): ManagementApiError {
	if (err instanceof ManagementApiError) return err;
	if (err instanceof AuthMissingError)
		return notConnected(err.pluginId || plugin);
	if (err instanceof ReadonlyForbiddenError)
		return permissionDenied('readonly');
	if (err instanceof PermissionRequiredError) {
		return err.reason === 'pending'
			? approvalRequired()
			: permissionDenied(err.reason);
	}
	if (err instanceof Error && err.name === 'ApiError') {
		const e = err as { status?: number; body?: unknown };
		return providerError(typeof e.status === 'number' ? e.status : 502, e.body);
	}
	// Never surface an arbitrary operation error's message — it can carry
	// internal hosts, config, or credential-bearing text (CWE-209). Keep the
	// original for server-side diagnostics; return a fixed public message.
	console.error('[corsair] unhandled error in call operation', err);
	return new ManagementApiError(500, 'internal_error', 'Internal error');
}

// Per-(corsair instance, tenant) client cache: concurrent same-tenant calls
// share ONE client → ONE key-manager → ONE refresh single-flight store, so a
// burst can't double-refresh and stale-write the rotating refresh_token.
const clientCacheByCorsair = new WeakMap<object, Map<string, unknown>>();
// LRU cap — the URL tenant is unbounded in cardinality, so evict the
// least-recently-used client past this size. Hot tenants keep their shared
// client (refresh single-flight); idle ones just rebuild on next use.
const MAX_TENANT_CLIENTS = 512;

function resolveClient(
	corsair: unknown,
	internal: CorsairInternalConfig,
	tenant: string | undefined,
): unknown {
	if (!internal.multiTenancy) return corsair;
	const tenantId = typeof tenant === 'string' ? tenant.trim() : '';
	if (!tenantId) {
		throw badRequest('tenant is required for a multi-tenant runtime', {
			missingFields: ['tenant'],
		});
	}
	let cache = clientCacheByCorsair.get(corsair as object);
	if (!cache) {
		cache = new Map();
		clientCacheByCorsair.set(corsair as object, cache);
	}
	const cached = cache.get(tenantId);
	if (cached) {
		cache.delete(tenantId); // LRU: move to most-recently-used
		cache.set(tenantId, cached);
		return cached;
	}
	const client = (corsair as { withTenant: (t: string) => unknown }).withTenant(
		tenantId,
	);
	cache.set(tenantId, client);
	if (cache.size > MAX_TENANT_CLIENTS) {
		const oldest = cache.keys().next().value;
		if (oldest !== undefined) cache.delete(oldest);
	}
	return client;
}

function walkToBoundFn(apiTree: unknown, op: string): Function | null {
	let node: unknown = apiTree;
	for (const seg of op.split('.')) {
		if (node == null || typeof node !== 'object') return null;
		// Own-property only: never traverse into inherited members, or ops like
		// `constructor` / `__proto__.constructor` would resolve to Object methods.
		if (!Object.prototype.hasOwnProperty.call(node, seg)) return null;
		node = (node as Record<string, unknown>)[seg];
	}
	return typeof node === 'function' ? (node as Function) : null;
}

function collectOpPaths(
	endpoints: Record<string, unknown>,
	prefix: string[] = [],
): string[] {
	const out: string[] = [];
	for (const [key, value] of Object.entries(endpoints ?? {})) {
		if (typeof value === 'function') {
			out.push([...prefix, key].join('.'));
		} else if (value && typeof value === 'object') {
			out.push(
				...collectOpPaths(value as Record<string, unknown>, [...prefix, key]),
			);
		}
	}
	return out;
}

export function listRegisteredOps(
	internal: CorsairInternalConfig,
): Record<string, string[]> {
	const out: Record<string, string[]> = {};
	for (const plugin of internal.plugins) {
		out[plugin.id] = collectOpPaths(
			(plugin as { endpoints?: Record<string, unknown> }).endpoints ?? {},
		);
	}
	return out;
}

export async function resolveCall(
	corsair: unknown,
	internal: CorsairInternalConfig,
	{ plugin, op, tenant, args }: ResolveCallInput,
): Promise<unknown> {
	if (!internal.plugins.some((p) => p.id === plugin))
		throw unknownPlugin(plugin);
	const client = resolveClient(corsair, internal, tenant);
	const pluginNs = (client as Record<string, unknown>)[plugin] as
		| { api?: unknown }
		| undefined;
	const fn = walkToBoundFn(pluginNs?.api, op);
	if (!fn) throw unknownOp(plugin, op);
	try {
		return await fn(args ?? {});
	} catch (err) {
		throw normalizeCallError(err, plugin);
	}
}
