import { randomUUID } from 'node:crypto';
import { AuthMissingError } from '../core/auth/errors/auth-missing';
import { singleFlight } from '../core/auth/single-flight';
import { hubApiPost, normalizeHubApiUrl } from './client/http';
import { parseManagedPricingCredentialsResponse } from './contracts/managed-pricing-api';
import { runtimeProofHeaders } from './runtime-proof';
import type { HubConfig } from './types';

/** Separates scope segments — must not appear in encoded field values. */
const HUB_SCOPE_FIELD_SEP = '\x1e';

const CREDENTIAL_REFRESH_BUFFER_SECONDS = 60;
/** Every managed call waits on its key, so a Hub that stalls fails the call
 *  instead of holding it until the runtime's own wall. */
const KEY_REQUEST_TIMEOUT_MS = 10_000;

export type ManagedPricingAuthContext = {
	hub: HubConfig;
	plugin: string;
	tenantId: string;
	/** In-process cache owner — never written to the customer's database. */
	cache: object;
};

export type GetManagedPricingApiKeyOptions = {
	/** Plugin operation id (e.g. scrape.run) — forwarded to Hub; prices are resolved server-side. */
	operation: string;
	forceRefresh?: boolean;
	/**
	 * One key per endpoint call. Hub charges once per key, so a call that sends
	 * one is always fetched fresh: a cached credential would let repeat calls
	 * through without a charge.
	 */
	idempotencyKey?: string;
};

/** Context from keyBuilder when the runtime is executing a metered endpoint. */
export type ManagedPricingKeyBuilderContext = {
	hub?: HubConfig;
	tenantId?: string;
	meteredOperationId?: string;
};

export type ManagedPricingApiKeyResult = {
	apiKey: string;
	expiresAt: number | null;
	fromCache: boolean;
	/** Where the result says how much the call used, for a per-unit price. */
	usagePath?: string;
};

type CachedManagedPricingCredential = {
	apiKey: string;
	expiresAt: number | null;
};

const credentialCache = new WeakMap<
	object,
	Map<string, CachedManagedPricingCredential>
>();

/** Separates in-process cache and single-flight by Hub authority + project + instance. */
export function managedPricingHubScope(hub: HubConfig): string {
	const apiUrl = normalizeHubApiUrl(hub.apiUrl);
	const instanceKey = hub.instanceKey?.trim() ?? '';
	return [
		encodeURIComponent(apiUrl),
		encodeURIComponent(hub.projectApiKey),
		encodeURIComponent(instanceKey),
	].join(HUB_SCOPE_FIELD_SEP);
}

function cacheKey(
	hub: HubConfig,
	plugin: string,
	tenantId: string,
	operation?: string,
): string {
	const scope = managedPricingHubScope(hub);
	const base = `${scope}:${plugin}:${tenantId}`;
	return operation ? `${base}:${operation}` : base;
}

function readCache(
	cache: object,
	key: string,
): CachedManagedPricingCredential | undefined {
	return credentialCache.get(cache)?.get(key);
}

function writeCache(
	cache: object,
	key: string,
	value: CachedManagedPricingCredential,
): void {
	let bucket = credentialCache.get(cache);
	if (!bucket) {
		bucket = new Map();
		credentialCache.set(cache, bucket);
	}
	bucket.set(key, value);
}

function isCredentialFresh(
	entry: CachedManagedPricingCredential,
	now: number,
): boolean {
	if (entry.expiresAt === null) {
		return false;
	}
	return entry.expiresAt > now + CREDENTIAL_REFRESH_BUFFER_SECONDS;
}

export function requireHubForManagedPricing(
	plugin: string,
	hub: HubConfig | undefined,
): asserts hub is HubConfig {
	if (!hub) {
		throw new AuthMissingError(
			plugin,
			'managed_pricing',
			`[auth-missing:${plugin}:managed_pricing]: Hub config is required. Pass hub: { ... } to createCorsair().`,
		);
	}
}

// Returns a provider API key minted by Hub. Credentials are cached in-process
// only — never persisted to corsair_integrations or corsair_accounts.
export async function getManagedPricingApiKey(
	ctx: ManagedPricingAuthContext,
	options: GetManagedPricingApiKeyOptions,
): Promise<ManagedPricingApiKeyResult> {
	requireHubForManagedPricing(ctx.plugin, ctx.hub);

	const operation = options.operation.trim();
	if (!operation) {
		throw new AuthMissingError(
			ctx.plugin,
			'managed_pricing',
			`[auth-missing:${ctx.plugin}:managed_pricing]: Operation id is required for Hub metering.`,
		);
	}

	const forceRefresh = options.forceRefresh ?? false;
	const idempotencyKey = options.idempotencyKey?.trim() || undefined;
	const storageKey = cacheKey(ctx.hub, ctx.plugin, ctx.tenantId, operation);
	const flightKind = idempotencyKey
		? `call:${idempotencyKey}`
		: forceRefresh
			? 'force'
			: 'routine';
	const flightKey = `managed_pricing:${flightKind}:${storageKey}`;

	return singleFlight(ctx.cache, flightKey, async () => {
		const now = Math.floor(Date.now() / 1000);

		if (!forceRefresh && !idempotencyKey) {
			const cached = readCache(ctx.cache, storageKey);
			if (cached && isCredentialFresh(cached, now)) {
				return {
					apiKey: cached.apiKey,
					expiresAt: cached.expiresAt,
					fromCache: true,
				};
			}
		}

		const response = await hubApiPost({
			hub: ctx.hub,
			path: '/managed-pricing/credentials',
			body: {
				plugin: ctx.plugin,
				tenantId: ctx.tenantId,
				operation,
				...(idempotencyKey ? { idempotencyKey } : {}),
			},
			extraHeaders: {
				...runtimeProofHeaders(ctx.hub, {
					path: '/managed-pricing/credentials',
					plugin: ctx.plugin,
					tenantId: ctx.tenantId,
					operation,
				}),
				'x-corsair-metered-operation': operation,
				...(idempotencyKey
					? { 'x-corsair-idempotency-key': idempotencyKey }
					: {}),
			},
			notFoundMessage: 'Managed pricing is not configured for this project',
			parseResponse: parseManagedPricingCredentialsResponse,
			signal: AbortSignal.timeout(KEY_REQUEST_TIMEOUT_MS),
		});

		const expiresAt =
			response.expires_in !== undefined ? now + response.expires_in : null;

		if (!idempotencyKey) {
			writeCache(ctx.cache, storageKey, {
				apiKey: response.api_key,
				expiresAt,
			});
		}

		return {
			apiKey: response.api_key,
			expiresAt,
			fromCache: false,
			...(response.usage_path ? { usagePath: response.usage_path } : {}),
		};
	});
}

/** Shared in-process cache for a Corsair instance / plugin keyBuilder. */
export function createManagedPricingCredentialCache(): object {
	return {};
}

/**
 * Resolves a provider API key for managed_pricing endpoint auth.
 * Forwards `meteredOperationId` to Hub; credit cost is configured in Hub only.
 */
/** What Hub charged for one managed endpoint call, as it was sent. */
export type ManagedPricingCall = {
	plugin: string;
	tenantId: string;
	operation: string;
	idempotencyKey: string;
};

/**
 * Fetches the provider key for one endpoint call and returns, with it, what
 * the charge was made under, so a failed call can be reported against it
 * (reportManagedPricingCallFailed).
 */
export async function resolveManagedPricingCall(
	ctx: ManagedPricingKeyBuilderContext,
	input: { plugin: string; cache: object; operation?: string },
): Promise<{ apiKey: string; call: ManagedPricingCall; usagePath?: string }> {
	requireHubForManagedPricing(input.plugin, ctx.hub);
	const tenantId = ctx.tenantId?.trim();
	if (!tenantId) {
		throw new AuthMissingError(
			input.plugin,
			'managed_pricing',
			`[auth-missing:${input.plugin}:managed_pricing]: tenantId is required for metered credentials.`,
		);
	}
	const operation = (input.operation ?? ctx.meteredOperationId)?.trim();
	if (!operation) {
		throw new AuthMissingError(
			input.plugin,
			'managed_pricing',
			`[auth-missing:${input.plugin}:managed_pricing]: Endpoint operation id missing — cannot meter usage.`,
		);
	}
	// Each endpoint call is metered on its own; retries inside the call
	// reuse the key resolved here.
	const idempotencyKey = randomUUID();
	const call = { plugin: input.plugin, tenantId, operation, idempotencyKey };
	try {
		const result = await getManagedPricingApiKey(
			{
				hub: ctx.hub,
				plugin: input.plugin,
				tenantId,
				cache: input.cache,
			},
			{ operation, idempotencyKey },
		);
		return {
			apiKey: result.apiKey,
			call,
			...(result.usagePath ? { usagePath: result.usagePath } : {}),
		};
	} catch (error) {
		// Hub may have charged a key request whose answer never arrived (it
		// timed out, or the connection dropped), so it is reported like a failed
		// call: Hub gives the credits back, or says it never charged that key.
		// A request Hub answered with a refusal charged nothing.
		if (gotNoAnswer(error)) {
			await reportManagedPricingCallFailed(ctx.hub, call, error);
		}
		throw error;
	}
}

// unknown: whatever fetch threw. An abort or timeout comes as a DOMException
// named for it, a failed connection as fetch's TypeError. Read by name: a
// DOMException is not always an Error instance across realms.
function gotNoAnswer(error: unknown): boolean {
	const name =
		typeof error === 'object' && error !== null && 'name' in error
			? error.name
			: undefined;
	return (
		name === 'TimeoutError' || name === 'AbortError' || name === 'TypeError'
	);
}

export async function resolveManagedPricingApiKey(
	ctx: ManagedPricingKeyBuilderContext,
	input: { plugin: string; cache: object; operation?: string },
): Promise<string> {
	return (await resolveManagedPricingCall(ctx, input)).apiKey;
}

// unknown: a thrown value can be anything. String() itself throws for some
// (an object without a prototype), and the report must never replace the
// caller's own error.
function describeThrown(error: unknown): string {
	try {
		return error instanceof Error
			? `${error.name}: ${error.message}`
			: String(error);
	} catch {
		return 'Unprintable thrown value';
	}
}

/** How long the end of a call waits on its report. A report that does not
 *  arrive leaves the charge in place, which is what happened before. */
const OUTCOME_REPORT_TIMEOUT_MS = 3_000;

/**
 * Tells Hub a managed call failed, so it gives the call's credits back. Best
 * effort and bounded: it never throws, and never holds the caller's own error
 * up by more than OUTCOME_REPORT_TIMEOUT_MS.
 */
/** Signed like the key request: Hub moves credits on these reports, and takes
 *  them only from Corsair Cloud's runtime. Empty outside it. */
export function managedPricingOutcomeHeaders(
	hub: HubConfig,
	call: ManagedPricingCall,
): Record<string, string> {
	return runtimeProofHeaders(hub, {
		path: '/managed-pricing/usage/outcome',
		plugin: call.plugin,
		tenantId: call.tenantId,
		operation: call.operation,
	});
}

export async function reportManagedPricingCallFailed(
	hub: HubConfig,
	call: ManagedPricingCall,
	// unknown: a thrown value can be anything, not only an Error.
	error: unknown,
): Promise<void> {
	const reason = describeThrown(error);
	try {
		await hubApiPost({
			hub,
			path: '/managed-pricing/usage/outcome',
			body: { ...call, outcome: 'failed', error: reason.slice(0, 300) },
			extraHeaders: managedPricingOutcomeHeaders(hub, call),
			parseResponse: (payload) => payload,
			signal: AbortSignal.timeout(OUTCOME_REPORT_TIMEOUT_MS),
		});
	} catch {
		// Unreported means still charged: the behaviour before this report.
	}
}

/**
 * The number at a dot path in an endpoint's result, if it is a usable count:
 * finite and not negative. Anything else reads as nothing, and the call keeps
 * the price Hub held for it.
 */
export function readUsageUnits(
	// unknown: endpoint results differ per plugin; only the path is known.
	result: unknown,
	path: string,
): number | undefined {
	let node: unknown = result;
	for (const key of path.split('.')) {
		if (!node || typeof node !== 'object') return undefined;
		node = (node as Record<string, unknown>)[key];
	}
	return typeof node === 'number' && Number.isFinite(node) && node >= 0
		? node
		: undefined;
}

/**
 * Tells Hub what a per-unit call used, so it charges for that instead of the
 * hold. Best effort and bounded like the failure report: an unsent report
 * leaves the hold as the price.
 */
export async function reportManagedPricingCallUsage(
	hub: HubConfig,
	call: ManagedPricingCall,
	units: number,
): Promise<void> {
	try {
		await hubApiPost({
			hub,
			path: '/managed-pricing/usage/outcome',
			body: { ...call, outcome: 'succeeded', usage: { units } },
			parseResponse: (payload) => payload,
			signal: AbortSignal.timeout(OUTCOME_REPORT_TIMEOUT_MS),
		});
	} catch {
		// Unreported means the hold stands.
	}
}
