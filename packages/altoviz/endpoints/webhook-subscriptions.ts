import { logEventFromContext } from 'corsair/core';
import { makeAltovizRequest } from '../client';
import type { AltovizEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactBody } from './shared';
import type { AltovizEndpointOutputs } from './types';

export const list: AltovizEndpoints['webhookSubscriptions']['list'] = async (
	ctx,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['webhookSubscriptionsList']
	>('v1/webhooks', ctx.key);

	await logEventFromContext(
		ctx,
		'altoviz.webhookSubscriptions.list',
		{},
		'completed',
	);
	return result;
};

/**
 * The only 201 in the surface, and the response body carries `id: 0` -
 * confirmed live. The real id only appears in `LIST_WEBHOOKS`, and that list
 * is eventually consistent (a deleted webhook briefly reappeared for one call
 * about two seconds after its delete during recon), so this returns exactly
 * what the provider sent rather than inventing a usable id. A caller that
 * needs the real id should list immediately after registering.
 */
export const register: AltovizEndpoints['webhookSubscriptions']['register'] =
	async (ctx, input) => {
		const body = compactBody({
			name: input.name,
			url: input.url,
			types: input.types,
			secretKey: input.secretKey,
		});

		const result = await makeAltovizRequest<
			AltovizEndpointOutputs['webhookSubscriptionsRegister']
		>('v1/webhooks', ctx.key, { method: 'POST', body });

		await logEventFromContext(
			ctx,
			'altoviz.webhookSubscriptions.register',
			auditPayload(input, { typesCount: input.types.length }),
			'completed',
		);
		return result;
	};

/**
 * `id` and `url` are both optional in the provider's own spec, so a call
 * supplying neither could plausibly delete broadly. That shape was
 * deliberately never probed live - the input schema
 * (`UnregisterWebhookInputSchema`) already refuses a call with neither before
 * this handler is reached, so the guard is enforced twice: once by the
 * schema, once implicitly by never constructing a bodyless query here.
 */
export const unregister: AltovizEndpoints['webhookSubscriptions']['unregister'] =
	async (ctx, input) => {
		const query =
			input.webhookId !== undefined
				? { id: input.webhookId }
				: { url: input.url };

		await makeAltovizRequest<unknown>('v1/webhooks', ctx.key, {
			method: 'DELETE',
			query,
		});

		await logEventFromContext(
			ctx,
			'altoviz.webhookSubscriptions.unregister',
			auditPayload(input),
			'completed',
		);
		return input.webhookId !== undefined
			? { deleted: true, id: input.webhookId }
			: { deleted: true, url: input.url };
	};
