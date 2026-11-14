import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** DELETE /v2/webhooks/subscriptions/{subscription_id} (DeleteWebhookSubscription). */
export const remove: SquareEndpoints['webhookSubscriptionsDelete'] = async (
	ctx,
	rawInput,
) => {
	const input =
		SquareEndpointInputSchemas.webhookSubscriptionsDelete.parse(rawInput);
	return callSquare(ctx, '/v2/webhooks/subscriptions/{subscription_id}', {
		method: 'DELETE',
		path: { subscription_id: input.subscription_id },
		output: SquareEndpointOutputSchemas.webhookSubscriptionsDelete,
		event: 'webhookSubscriptions.delete',
		logged: { subscription_id: input.subscription_id },
	});
};

/** GET /v2/webhooks/subscriptions (ListWebhookSubscriptions). */
export const list: SquareEndpoints['webhookSubscriptionsList'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.webhookSubscriptionsList.parse(
		rawInput ?? {},
	);
	return callSquare(ctx, '/v2/webhooks/subscriptions', {
		query: input,
		output: SquareEndpointOutputSchemas.webhookSubscriptionsList,
		event: 'webhookSubscriptions.list',
	});
};

/** GET /v2/webhooks/subscriptions/{subscription_id} (RetrieveWebhookSubscription). */
export const get: SquareEndpoints['webhookSubscriptionsGet'] = async (
	ctx,
	rawInput,
) => {
	const input =
		SquareEndpointInputSchemas.webhookSubscriptionsGet.parse(rawInput);
	return callSquare(ctx, '/v2/webhooks/subscriptions/{subscription_id}', {
		path: { subscription_id: input.subscription_id },
		output: SquareEndpointOutputSchemas.webhookSubscriptionsGet,
		event: 'webhookSubscriptions.get',
		logged: { subscription_id: input.subscription_id },
	});
};

/** POST /v2/webhooks/subscriptions/{subscription_id}/test (TestWebhookSubscription). */
export const test: SquareEndpoints['webhookSubscriptionsTest'] = async (
	ctx,
	rawInput,
) => {
	const input =
		SquareEndpointInputSchemas.webhookSubscriptionsTest.parse(rawInput);
	const { subscription_id, ...body } = input;
	return callSquare(ctx, '/v2/webhooks/subscriptions/{subscription_id}/test', {
		method: 'POST',
		body,
		path: { subscription_id },
		output: SquareEndpointOutputSchemas.webhookSubscriptionsTest,
		event: 'webhookSubscriptions.test',
		logged: { subscription_id },
	});
};

/** PUT /v2/webhooks/subscriptions/{subscription_id} (UpdateWebhookSubscription). */
export const update: SquareEndpoints['webhookSubscriptionsUpdate'] = async (
	ctx,
	rawInput,
) => {
	const input =
		SquareEndpointInputSchemas.webhookSubscriptionsUpdate.parse(rawInput);
	const { subscription_id, ...body } = input;
	return callSquare(ctx, '/v2/webhooks/subscriptions/{subscription_id}', {
		method: 'PUT',
		body,
		path: { subscription_id },
		output: SquareEndpointOutputSchemas.webhookSubscriptionsUpdate,
		event: 'webhookSubscriptions.update',
		logged: { subscription_id },
	});
};

/** POST /v2/webhooks/subscriptions/{subscription_id}/signature-key (UpdateWebhookSubscriptionSignatureKey). */
export const updateSignatureKey: SquareEndpoints['webhookSubscriptionsUpdateSignatureKey'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.webhookSubscriptionsUpdateSignatureKey.parse(
				rawInput,
			);
		const { subscription_id, ...body } = input;
		return callSquare(
			ctx,
			'/v2/webhooks/subscriptions/{subscription_id}/signature-key',
			{
				method: 'POST',
				body,
				path: { subscription_id },
				output:
					SquareEndpointOutputSchemas.webhookSubscriptionsUpdateSignatureKey,
				event: 'webhookSubscriptions.updateSignatureKey',
				logged: { subscription_id },
			},
		);
	};

/** POST /v2/webhooks/subscriptions (CreateWebhookSubscription). */
export const create: SquareEndpoints['webhookSubscriptionsCreate'] = async (
	ctx,
	rawInput,
) => {
	const input =
		SquareEndpointInputSchemas.webhookSubscriptionsCreate.parse(rawInput);
	return callSquare(ctx, '/v2/webhooks/subscriptions', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.webhookSubscriptionsCreate,
		event: 'webhookSubscriptions.create',
	});
};
