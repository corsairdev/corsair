import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { DopplerWebhookEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { compact, dopplerCall } from './shared';
import type { DopplerEndpointOutputs } from './types';

const LABEL = 'webhook';

/**
 * A webhook's `authentication` is declared `unknown` on the entity (its
 * shape is caller-defined: Bearer/Basic/None) because it may carry a token
 * or password the caller just set. Confirmed live: the API only ever echoes
 * `{type}` back (e.g. `{"type":"Bearer"}`), never the token/password itself
 * - but stripping it before caching costs nothing and keeps the mirror safe
 * even if that ever changes. The full record (including `authentication`)
 * still reaches the caller, who already knows what they set; only the local
 * mirror is stripped. The webhook signing `secret` and `authentication`'s
 * `token`/`password` are also never passed to `auditPayload` below - every
 * call here lists only identifier fields (`project`, `slug`, `url`, `name`).
 */
function forCache<T extends { authentication?: unknown }>(record: T) {
	const { authentication: _authentication, ...safe } = record;
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
		{ label: LABEL },
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
	}>(ctx, `webhooks/webhook/${input.slug}`, {
		query: compact({ project: input.project }),
	});

	await cacheEntity(
		ctx.db.webhooks,
		DopplerWebhookEntity,
		forCache(result.webhook),
		{ label: LABEL },
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
		{ label: LABEL },
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
	}>(ctx, `webhooks/webhook/${input.slug}`, {
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
		{ label: LABEL },
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
		`webhooks/webhook/${input.slug}`,
		{ method: 'DELETE', query: compact({ project: input.project }) },
	);

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
	}>(ctx, `webhooks/webhook/${input.slug}/enable`, {
		method: 'POST',
		query: compact({ project: input.project }),
	});

	await cacheEntity(
		ctx.db.webhooks,
		DopplerWebhookEntity,
		forCache(result.webhook),
		{ label: LABEL },
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
	}>(ctx, `webhooks/webhook/${input.slug}/disable`, {
		method: 'POST',
		query: compact({ project: input.project }),
	});

	await cacheEntity(
		ctx.db.webhooks,
		DopplerWebhookEntity,
		forCache(result.webhook),
		{ label: LABEL },
	);
	await logEventFromContext(
		ctx,
		'doppler.webhooks.disable',
		auditPayload(input, ['project', 'slug']),
		'completed',
	);
	return result.webhook;
};
