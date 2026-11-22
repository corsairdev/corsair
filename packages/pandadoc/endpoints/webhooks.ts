import type { PandadocEndpoints } from '..';
import { call, expectEmptyBody } from './call';
import {
	PandadocEndpointInputSchemas as Inputs,
	PandadocEndpointOutputSchemas as Outputs,
} from './types';

export const listSubscriptions: PandadocEndpoints['webhooksListSubscriptions'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'webhooks.listSubscriptions',
				input: Inputs.webhooksListSubscriptions,
				output: Outputs.webhooksListSubscriptions,
			},
			input,
			() => ({
				method: 'GET',
				path: '/public/v1/webhook-subscriptions',
			}),
			{ log: (_, result) => ({ count: result.items.length }) },
		);

export const createSubscription: PandadocEndpoints['webhooksCreateSubscription'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'webhooks.createSubscription',
				input: Inputs.webhooksCreateSubscription,
				output: Outputs.webhooksCreateSubscription,
			},
			input,
			(body) => ({
				method: 'POST',
				path: '/public/v1/webhook-subscriptions',
				body,
			}),
			{
				// The response carries the shared_key used to verify deliveries;
				// log only its presence, never the value.
				log: (_, subscription) => ({
					subscriptionId: subscription.uuid,
					hasSharedKey:
						subscription.shared_key !== undefined &&
						subscription.shared_key !== null,
				}),
			},
		);

export const deleteSubscription: PandadocEndpoints['webhooksDeleteSubscription'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'webhooks.deleteSubscription',
				input: Inputs.webhooksDeleteSubscription,
				output: Outputs.webhooksDeleteSubscription,
			},
			input,
			({ id }) => ({
				method: 'DELETE',
				path: `/public/v1/webhook-subscriptions/${encodeURIComponent(id)}`,
			}),
			{
				shape: (raw, { id }) => {
					expectEmptyBody(raw, 'webhooks.deleteSubscription');
					return { id, success: true };
				},
				log: (_, result) => ({ subscriptionId: result.id }),
			},
		);

export const getEvent: PandadocEndpoints['webhooksGetEvent'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.getEvent',
			input: Inputs.webhooksGetEvent,
			output: Outputs.webhooksGetEvent,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/public/v1/webhook-events/${encodeURIComponent(id)}`,
		}),
		{
			log: (_, result) => ({
				eventId: result.id ?? undefined,
				event: result.event ?? undefined,
			}),
		},
	);
