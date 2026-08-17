import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactBody, loyverseCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

/**
 * Webhook management.
 *
 * These four operations administer Loyverse's own webhook subscriptions. They
 * are **not** Corsair triggers: this plugin registers none, matching the OSS
 * catalog, which lists zero triggers for Loyverse. A caller can create a
 * subscription pointing at infrastructure it already runs.
 *
 * Worth knowing before relying on them: a subscription created with a personal
 * access token belongs to the merchant and its notifications are **unsigned** -
 * no `X-Loyverse-Signature` header. Only subscriptions created through an OAuth
 * application are signed, using that application's client secret. Anything
 * consuming these notifications has to account for that.
 *
 * Webhook records are account configuration rather than business reference data,
 * so none of them is mirrored locally.
 */
const COLLECTION = 'webhooks/';

/**
 * Lists webhook subscriptions.
 *
 * The collection accepts no query parameters - no cursor, no limit, no filters -
 * and returns every subscription on the account, so none are sent. An account can
 * hold only a handful, since the combination of event type and URL must be unique.
 */
export const list: LoyverseEndpoints['webhooksList'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['webhooksList']>(
		ctx,
		COLLECTION,
	);

	await logEventFromContext(ctx, 'loyverse.webhooks.list', {}, 'completed');
	return result;
};

/** Retrieves one webhook subscription by id. */
export const get: LoyverseEndpoints['webhooksGet'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['webhooksGet']>(
		ctx,
		`webhooks/${input.webhook_id}`,
	);

	await logEventFromContext(
		ctx,
		'loyverse.webhooks.get',
		auditPayload(input, ['webhook_id']),
		'completed',
	);
	return result;
};

/**
 * Creates or updates a webhook subscription.
 *
 * `status` is required even though the published spec lists only `url`:
 * omitting it is answered with
 * `MISSING_REQUIRED_PARAMETER  field: object.status`, verified live.
 *
 * One subscription covers one event, and the combination of event type and URL
 * must be unique.
 */
export const upsert: LoyverseEndpoints['webhooksUpsert'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['webhooksUpsert']>(
		ctx,
		COLLECTION,
		{
			method: 'POST',
			body: compactBody({
				id: input.id,
				url: input.url,
				type: input.type,
				status: input.status,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'loyverse.webhooks.upsert',
		// The URL can carry a token in its path or query, so it is not logged.
		{
			webhook_id: result.id,
			type: input.type,
			status: input.status,
			created: input.id === undefined,
		},
		'completed',
	);
	return result;
};

/** Deletes a webhook subscription. Nothing to evict - webhooks are not mirrored. */
export const remove: LoyverseEndpoints['webhooksDelete'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['webhooksDelete']>(
		ctx,
		`webhooks/${input.webhook_id}`,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'loyverse.webhooks.delete',
		auditPayload(input, ['webhook_id']),
		'completed',
	);
	return result;
};
