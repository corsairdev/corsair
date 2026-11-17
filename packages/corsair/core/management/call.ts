import type { CorsairInternalConfig } from '..';
import { AccountSelectionError } from '../account-lookup';
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
	account?: string;
	// Unvalidated request input; each op validates its own args.
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
export const callDisabled = (route = '/call') =>
	new ManagementApiError(
		403,
		'call_disabled',
		`The ${route} route is disabled. Construct managementHandler with { unsafeAllowUnauthenticated: true } to enable it — only when your own backend fronts the handler.`,
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

/**
 * The optional `account` a caller binds, from a body or query value.
 * Present means a non-empty string, as on disconnect.
 */
export function parseAccount(raw: unknown): string | undefined {
	if (raw === undefined) return undefined;
	if (typeof raw !== 'string' || !raw.trim()) {
		throw badRequest('account must be a non-empty string');
	}
	return raw.trim();
}

function normalizeCallError(err: unknown, plugin: string): ManagementApiError {
	if (err instanceof ManagementApiError) return err;
	if (err instanceof AccountSelectionError && err.code !== 'account_limit') {
		return new ManagementApiError(
			err.code === 'account_required' ? 400 : 404,
			err.code,
			err.message,
			{ accounts: err.accounts },
		);
	}
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
// In-flight op count per tenant — a client with active work is never evicted,
// so the LRU can't split a tenant's refresh single-flight (see resolveCall).
const inFlightByCorsair = new WeakMap<object, Map<string, number>>();
// LRU cap — the URL tenant is unbounded in cardinality, so evict the
// least-recently-used IDLE client past this size. Hot/in-flight tenants keep
// their shared client; idle ones just rebuild on next use.
const MAX_TENANT_CLIENTS = 512;

function mapFor<V>(
	store: WeakMap<object, Map<string, V>>,
	corsair: object,
): Map<string, V> {
	let m = store.get(corsair);
	if (!m) {
		m = new Map();
		store.set(corsair, m);
	}
	return m;
}

// Evict the oldest idle client. `keep` is the just-inserted tenant — never evict
// it (its op isn't marked in-flight yet, so it'd otherwise look idle and get
// dropped when every older client is busy). If no other candidate is idle, skip
// — a brief overshoot is safe; splitting a live refresh isn't.
function evictIdle(
	corsair: object,
	cache: Map<string, unknown>,
	keep: string,
): void {
	if (cache.size <= MAX_TENANT_CLIENTS) return;
	const inFlight = inFlightByCorsair.get(corsair);
	for (const key of cache.keys()) {
		// Map iterates in insertion order → oldest first.
		if (key === keep) continue;
		if ((inFlight?.get(key) ?? 0) === 0) {
			cache.delete(key);
			return;
		}
	}
}

/**
 * The tenant-scoped client for a request, from a bounded LRU cache.
 *
 * Shared with the db route so both reuse one `withTenant` per tenant: building
 * a client imports plugins and runs provisioning, which is not per-request work.
 */
export function resolveTenantClient(
	corsair: unknown,
	internal: CorsairInternalConfig,
	tenant: string | undefined,
	bind?: { plugin: string; account?: string },
): { client: unknown; tenantId?: string; cacheKey?: string } {
	if (!internal.multiTenancy) {
		if (bind?.account !== undefined) {
			throw badRequest('account requires multiTenancy');
		}
		return { client: corsair };
	}
	const tenantId = typeof tenant === 'string' ? tenant.trim() : '';
	if (!tenantId) {
		throw badRequest('tenant is required for a multi-tenant runtime', {
			missingFields: ['tenant'],
		});
	}
	const account = bind?.account;
	// JSON-encoded so a tenant containing the separator cannot alias a bound key.
	const cacheKey = account
		? JSON.stringify([tenantId, bind.plugin, account])
		: JSON.stringify([tenantId]);
	const cache = mapFor(clientCacheByCorsair, corsair as object);
	const cached = cache.get(cacheKey);
	if (cached) {
		cache.delete(cacheKey);
		cache.set(cacheKey, cached);
		return { client: cached, tenantId, cacheKey };
	}
	// The client's generic type isn't known here; withTenant is on every instance.
	const withTenant = (
		corsair as {
			withTenant: (t: string, o?: unknown) => unknown;
		}
	).withTenant;
	const client = account
		? withTenant.call(corsair, tenantId, {
				accounts: { [bind.plugin]: account },
			})
		: withTenant.call(corsair, tenantId);
	cache.set(cacheKey, client);
	evictIdle(corsair as object, cache, cacheKey);
	return { client, tenantId, cacheKey };
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

/**
 * Runs `fn` against a tenant-scoped client, with the guards every route that
 * reaches plugin code needs.
 *
 * Shared so the op route and the entity-store route cannot drift apart: the
 * plugin must be registered, the tenant is marked busy for the whole call
 * (which spans the credential refresh inside `fn`) so the LRU cannot evict its
 * client mid-flight, and anything thrown becomes a ManagementApiError rather
 * than a raw 500.
 */
export async function withTenantClient<T>(
	corsair: unknown,
	internal: CorsairInternalConfig,
	input: { plugin: string; tenant?: string; account?: string },
	fn: (client: unknown) => Promise<T> | T,
): Promise<T> {
	if (!internal.plugins.some((p) => p.id === input.plugin))
		throw unknownPlugin(input.plugin);
	const { client, tenantId, cacheKey } = resolveTenantClient(
		corsair,
		internal,
		input.tenant,
		{ plugin: input.plugin, account: input.account },
	);
	const inFlight = tenantId
		? mapFor(inFlightByCorsair, corsair as object)
		: null;
	if (inFlight && cacheKey)
		inFlight.set(cacheKey, (inFlight.get(cacheKey) ?? 0) + 1);
	try {
		return await fn(client);
	} catch (err) {
		throw normalizeCallError(err, input.plugin);
	} finally {
		if (inFlight && cacheKey) {
			const n = (inFlight.get(cacheKey) ?? 1) - 1;
			if (n <= 0) inFlight.delete(cacheKey);
			else inFlight.set(cacheKey, n);
		}
	}
}

export async function resolveCall(
	corsair: unknown,
	internal: CorsairInternalConfig,
	{ plugin, op, tenant, account, args }: ResolveCallInput,
): Promise<unknown> {
	return withTenantClient(
		corsair,
		internal,
		{ plugin, tenant, account },
		(client) => {
			// The client's plugin namespaces are keyed by plugin id; the id was
			// checked against internal.plugins in withTenantClient.
			const pluginNs = (client as Record<string, unknown>)[plugin] as
				| { api?: unknown }
				| undefined;
			const fn = walkToBoundFn(pluginNs?.api, op);
			if (!fn) throw unknownOp(plugin, op);
			return fn(args ?? {});
		},
	);
}
