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
export async function resolveManagedPricingApiKey(
	ctx: ManagedPricingKeyBuilderContext,
	input: { plugin: string; cache: object; operation?: string },
): Promise<string> {
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
	const result = await getManagedPricingApiKey(
		{
			hub: ctx.hub,
			plugin: input.plugin,
			tenantId,
			cache: input.cache,
		},
		// Each endpoint call is metered on its own; retries inside the call
		// reuse the key resolved here.
		{ operation, idempotencyKey: randomUUID() },
	);
	return result.apiKey;
}
