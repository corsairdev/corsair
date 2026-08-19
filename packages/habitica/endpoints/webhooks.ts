import { logEventFromContext } from 'corsair/core';
import type { HabiticaEndpoints } from '../index';
import { HabiticaWebhookEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { compactBody, habiticaCall, pathSegment } from './shared';
import type { HabiticaEndpointOutputs } from './types';

const LABEL = 'webhook';

/**
 * The user's **outbound** webhooks - Habitica calling a URL of their choosing.
 *
 * These are not Corsair webhooks and this plugin registers no webhook handlers:
 * the catalog lists no triggers for Habitica, and these three appear in it as
 * ordinary operations. They are implemented as such.
 *
 * The surface is create, list and enable only. The API also has a general
 * update and a delete, and the catalog lists neither, so neither is added here
 * - the catalog defines the surface, and inventing siblings would put this
 * plugin out of step with other consumers of the same catalog.
 */

/** Registers a webhook. */
export const create: HabiticaEndpoints['webhooksCreate'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['webhooksCreate']>(
		ctx,
		'user/webhook',
		{ method: 'POST', body: compactBody({ ...input }) },
	);

	await cacheEntity(ctx.db.webhooks, HabiticaWebhookEntity, result, {
		label: LABEL,
	});

	// The target URL is the caller's own endpoint and can carry a secret in its
	// path or query, so it is not logged.
	await logEventFromContext(
		ctx,
		'habitica.webhooks.create',
		auditPayload(input, ['type', 'enabled']),
		'completed',
	);
	return result;
};

/**
 * Lists the account's webhooks.
 *
 * Worth mirroring for `failures`, Habitica's consecutive-delivery-failure
 * counter - it is the only health signal the API offers, and Habitica disables
 * a webhook once it reaches 10.
 */
export const list: HabiticaEndpoints['webhooksList'] = async (ctx, input) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['webhooksList']>(
		ctx,
		'user/webhook',
	);

	await cacheEntities(ctx.db.webhooks, HabiticaWebhookEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'habitica.webhooks.list',
		{ ...auditPayload(input, []), returned: result.length },
		'completed',
	);
	return result;
};

/**
 * Enables a webhook.
 *
 * The catalog calls this "Subscribe Webhook", and its own description says it
 * is an update that sets `enabled=true`. There is no subscribe route; this is
 * `PUT /user/webhook/:id` with a single field.
 *
 * Idempotent: enabling an already-enabled webhook leaves it enabled.
 */
export const subscribe: HabiticaEndpoints['webhooksSubscribe'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<
		HabiticaEndpointOutputs['webhooksSubscribe']
	>(ctx, `user/webhook/${pathSegment(input.id)}`, {
		method: 'PUT',
		body: { enabled: true },
	});

	await cacheEntity(ctx.db.webhooks, HabiticaWebhookEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'habitica.webhooks.subscribe',
		auditPayload(input, ['id']),
		'completed',
	);
	return result;
};
