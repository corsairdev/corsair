import type { PiggyEndpoints } from '..';
import { call } from './call';
import {
	PiggyEndpointInputSchemas as Inputs,
	PiggyEndpointOutputSchemas as Outputs,
} from './types';

const CLIENT = '/api/v3/oauth/clients';

export const list: PiggyEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		({ eventType, status }) => ({
			method: 'GET',
			path: `${CLIENT}/webhook-subscriptions`,
			query: { event_type: eventType, status },
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const create: PiggyEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		({ name, eventType, url, secret, version }) => ({
			method: 'POST',
			path: `${CLIENT}/webhook-subscriptions`,
			body: {
				name,
				event_type: eventType,
				url,
				secret,
				version,
			},
		}),
		// The secret is not echoed back and is never logged.
		{
			log: (_, subscription) => ({
				subscriptionUuid: subscription.data.uuid ?? undefined,
				eventType: subscription.data.event_type ?? undefined,
			}),
		},
	);

export const get: PiggyEndpoints['webhooksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.get',
			input: Inputs.webhooksGet,
			output: Outputs.webhooksGet,
		},
		input,
		({ webhookSubscriptionUuid }) => ({
			method: 'GET',
			path: `${CLIENT}/webhook-subscriptions/${encodeURIComponent(webhookSubscriptionUuid)}`,
		}),
		{
			log: (_, subscription) => ({
				subscriptionUuid: subscription.data.uuid ?? undefined,
			}),
		},
	);

export const update: PiggyEndpoints['webhooksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		({ webhookSubscriptionUuid, name, url, status }) => ({
			method: 'PUT',
			path: `${CLIENT}/webhook-subscriptions/${encodeURIComponent(webhookSubscriptionUuid)}`,
			body: { name, url, status },
		}),
		{
			log: (_, subscription) => ({
				subscriptionUuid: subscription.data.uuid ?? undefined,
			}),
		},
	);

export const deleteSubscription: PiggyEndpoints['webhooksDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		({ webhookSubscriptionUuid }) => ({
			method: 'DELETE',
			path: `${CLIENT}/webhook-subscriptions/${encodeURIComponent(webhookSubscriptionUuid)}`,
		}),
		{ log: ({ webhookSubscriptionUuid }) => ({ webhookSubscriptionUuid }) },
	);
