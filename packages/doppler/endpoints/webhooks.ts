import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { DopplerWebhookEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compact, dopplerCall, seg } from './shared';
import type { DopplerEndpointOutputs } from './types';

const LABEL = 'webhook';

/**
 * A webhook's identifier is the same value under two different names
 * depending on context: Doppler's own path template addresses it as
 * `{slug}` (`/webhooks/webhook/{slug}`), while every response body names
 * the identical field `id`. Re-confirmed live this session: creating a
 * webhook, then fetching it back via that same value passed as `{slug}`,
 * returns the identical `id`.
 *
 * Declared here, once, and used for both caching (from a response's `id`)
 * and eviction (from a request's `slug`) - rather than left to
 * `persist.ts`'s default `.id` read to merely coincide with whatever
 * `remove` evicts by. Without this, a cache-key source and an evict-key
 * source that happen to agree today have no structural reason to keep
 * agreeing, and no test built on a single literal shared between the two
 * (e.g. both hardcoded to `'wh-1'`) can tell "they're the same by
 * construction" apart from "they're the same by coincidence of the
 * fixture." See `endpoints.test.ts`'s dedicated round-trip test.
 */
const entityId = (w: { id: string }) => w.id;

/**
 * `authentication` and `secret` are both declared `unknown`/absent on the
 * entity because they may carry (or, for `secret`, request-echo) a value the
 * caller just set as a signing credential. Confirmed live: the API only
 * ever echoes `authentication` back as `{type}` (e.g. `{"type":"Bearer"}`)
 * and never echoes `secret` at all (only the boolean `hasSecret`) - but
 * stripping both before caching costs nothing and keeps the mirror safe even
 * if that ever changes. `record` here is the raw, not-yet-schema-parsed API
 * response, so an undeclared field the entity's `.loose()` would otherwise
 * pass straight through is still caught. The full record (including
 * `authentication`) still reaches the caller, who already knows what they
 * set; only the local mirror is stripped. Neither field is passed to
 * `auditPayload` below either - every call here lists only identifier
 * fields (`project`, `slug`, `url`, `name`).
 */
function forCache<T extends { authentication?: unknown; secret?: unknown }>(
	record: T,
) {
	const { authentication: _authentication, secret: _secret, ...safe } = record;
	return safe;
}

/** Lists webhooks, optionally scoped to a project. Confirmed live: `project` is effectively required for a workplace-scoped token. */
export const list: DopplerEndpoints['webhooksList'] = async (ctx, input) => {
	const result = await dopplerCall<{
		webhooks: DopplerEndpointOutputs['webhooksList'];
	}>(ctx, 'webhooks', { query: compact({ project: input.project }) });

	await cacheEntities(
		ctx.db.webhooks,
		DopplerWebhookEntity,
		result.webhooks.map(forCache),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'doppler.webhooks.list',
		{ returned: result.webhooks.length },
		'completed',
	);
	return result.webhooks;
};

/** Retrieves a single webhook. */
export const get: DopplerEndpoints['webhooksGet'] = async (ctx, input) => {
	const result = await dopplerCall<{
		webhook: DopplerEndpointOutputs['webhooksGet'];
	}>(ctx, `webhooks/webhook/${seg(input.slug)}`, {
		query: compact({ project: input.project }),
	});

	await cacheEntity(
		ctx.db.webhooks,
		DopplerWebhookEntity,
		forCache(result.webhook),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'doppler.webhooks.get',
		auditPayload(input, ['project', 'slug']),
		'completed',
	);
	return result.webhook;
};

/** Creates a webhook. */
export const add: DopplerEndpoints['webhooksAdd'] = async (ctx, input) => {
	const result = await dopplerCall<{
		webhook: DopplerEndpointOutputs['webhooksAdd'];
	}>(ctx, 'webhooks', {
		method: 'POST',
		query: compact({ project: input.project }),
		body: compact({
			url: input.url,
			name: input.name,
			secret: input.secret,
			authentication: input.authentication,
			payload: input.payload,
			enableConfigs: input.enableConfigs,
		}),
	});

	await cacheEntity(
		ctx.db.webhooks,
		DopplerWebhookEntity,
		forCache(result.webhook),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'doppler.webhooks.add',
		auditPayload(input, ['project', 'url', 'name']),
		'completed',
	);
	return result.webhook;
};

/** Updates a webhook. */
export const update: DopplerEndpoints['webhooksUpdate'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		webhook: DopplerEndpointOutputs['webhooksUpdate'];
	}>(ctx, `webhooks/webhook/${seg(input.slug)}`, {
		method: 'PATCH',
		query: compact({ project: input.project }),
		body: compact({
			url: input.url,
			name: input.name,
			secret: input.secret,
			authentication: input.authentication,
			payload: input.payload,
			enableConfigs: input.enableConfigs,
			disableConfigs: input.disableConfigs,
		}),
	});

	await cacheEntity(
		ctx.db.webhooks,
		DopplerWebhookEntity,
		forCache(result.webhook),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'doppler.webhooks.update',
		auditPayload(input, ['project', 'slug']),
		'completed',
	);
	return result.webhook;
};

/** Deletes a webhook. */
export const remove: DopplerEndpoints['webhooksDelete'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<DopplerEndpointOutputs['webhooksDelete']>(
		ctx,
		`webhooks/webhook/${seg(input.slug)}`,
		{ method: 'DELETE', query: compact({ project: input.project }) },
	);

	// `input.slug` is the same identifier `entityId` reads as `.id` off a
	// cached record (see the doc comment above) - routed through the same
	// function, not just the same value by coincidence, so a future change
	// to how the identifier is derived cannot update one side without the
	// other.
	await evictEntity(ctx.db.webhooks, entityId({ id: input.slug }), LABEL);
	await logEventFromContext(
		ctx,
		'doppler.webhooks.delete',
		auditPayload(input, ['project', 'slug']),
		'completed',
	);
	return result;
};

/** Enables a webhook. */
export const enable: DopplerEndpoints['webhooksEnable'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		webhook: DopplerEndpointOutputs['webhooksEnable'];
	}>(ctx, `webhooks/webhook/${seg(input.slug)}/enable`, {
		method: 'POST',
		query: compact({ project: input.project }),
	});

	await cacheEntity(
		ctx.db.webhooks,
		DopplerWebhookEntity,
		forCache(result.webhook),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'doppler.webhooks.enable',
		auditPayload(input, ['project', 'slug']),
		'completed',
	);
	return result.webhook;
};

/** Disables a webhook. */
export const disable: DopplerEndpoints['webhooksDisable'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		webhook: DopplerEndpointOutputs['webhooksDisable'];
	}>(ctx, `webhooks/webhook/${seg(input.slug)}/disable`, {
		method: 'POST',
		query: compact({ project: input.project }),
	});

	await cacheEntity(
		ctx.db.webhooks,
		DopplerWebhookEntity,
		forCache(result.webhook),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'doppler.webhooks.disable',
		auditPayload(input, ['project', 'slug']),
		'completed',
	);
	return result.webhook;
};
