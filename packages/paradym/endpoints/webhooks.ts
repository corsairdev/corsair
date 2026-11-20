import type { ParadymEndpoints } from '..';
import { call, expectEmptyBody } from './call';
import {
	ParadymEndpointInputSchemas as Inputs,
	ParadymEndpointOutputSchemas as Outputs,
	pageQuery,
} from './types';

export const listSubscriptions: ParadymEndpoints['webhooksListSubscriptions'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'webhooks.listSubscriptions',
				input: Inputs.webhooksListSubscriptions,
				output: Outputs.webhooksListSubscriptions,
			},
			input,
			(_query, walletId) => ({
				method: 'GET',
				path: `/v1/wallets/${encodeURIComponent(walletId)}/webhooks`,
			}),
			{ log: (_, result) => ({ count: result.data.length }) },
		);

export const createSubscription: ParadymEndpoints['webhooksCreateSubscription'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'webhooks.createSubscription',
				input: Inputs.webhooksCreateSubscription,
				output: Outputs.webhooksCreateSubscription,
			},
			input,
			(body, walletId) => ({
				method: 'POST',
				path: `/v1/wallets/${encodeURIComponent(walletId)}/webhooks`,
				body,
			}),
			{
				// The response carries the secret deliveries are signed with; log
				// only its presence, never the value.
				log: (_, subscription) => ({
					subscriptionId: subscription.id,
					hasSignatureSecret:
						subscription.signatureSecret !== undefined &&
						subscription.signatureSecret !== null,
				}),
			},
		);

export const deleteSubscription: ParadymEndpoints['webhooksDeleteSubscription'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'webhooks.deleteSubscription',
				input: Inputs.webhooksDeleteSubscription,
				output: Outputs.webhooksDeleteSubscription,
			},
			input,
			({ webhookSubscriptionId }, walletId) => ({
				method: 'DELETE',
				path: `/v1/wallets/${encodeURIComponent(walletId)}/webhooks/${encodeURIComponent(webhookSubscriptionId)}`,
			}),
			{
				shape: (raw, { webhookSubscriptionId }) => {
					expectEmptyBody(raw, 'webhooks.deleteSubscription');
					return { id: webhookSubscriptionId, success: true };
				},
				log: (_, result) => ({ subscriptionId: result.id }),
			},
		);

export const listDeliveries: ParadymEndpoints['webhooksListDeliveries'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.listDeliveries',
			input: Inputs.webhooksListDeliveries,
			output: Outputs.webhooksListDeliveries,
		},
		input,
		(query, walletId) => ({
			method: 'GET',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/webhooks/deliveries`,
			query: {
				'filter[status]': query.filterStatus,
				...pageQuery(query),
			},
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const getDelivery: ParadymEndpoints['webhooksGetDelivery'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.getDelivery',
			input: Inputs.webhooksGetDelivery,
			output: Outputs.webhooksGetDelivery,
		},
		input,
		({ deliveryId }, walletId) => ({
			method: 'GET',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/webhooks/deliveries/${encodeURIComponent(deliveryId)}`,
		}),
		{
			log: (_, delivery) => ({
				deliveryId: delivery.id,
				status: delivery.status,
			}),
		},
	);

export const redeliverDelivery: ParadymEndpoints['webhooksRedeliverDelivery'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'webhooks.redeliverDelivery',
				input: Inputs.webhooksRedeliverDelivery,
				output: Outputs.webhooksRedeliverDelivery,
			},
			input,
			({ deliveryId }, walletId) => ({
				method: 'POST',
				path: `/v1/wallets/${encodeURIComponent(walletId)}/webhooks/deliveries/${encodeURIComponent(deliveryId)}/redeliver`,
			}),
			{
				log: (_, delivery) => ({
					deliveryId: delivery.id,
					status: delivery.status,
				}),
			},
		);
