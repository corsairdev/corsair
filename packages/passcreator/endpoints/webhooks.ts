import type { PasscreatorEndpoints } from '..';
import { call } from './call';
import {
	PasscreatorEndpointInputSchemas as Inputs,
	PasscreatorEndpointOutputSchemas as Outputs,
} from './types';

export const subscribe: PasscreatorEndpoints['webhooksSubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.subscribe',
			input: Inputs.webhooksSubscribe,
			output: Outputs.webhooksSubscribe,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/api/hook/subscribe',
			body,
		}),
		{ log: (_, subscription) => ({ event: subscription.event ?? undefined }) },
	);

export const unsubscribe: PasscreatorEndpoints['webhooksUnsubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.unsubscribe',
			input: Inputs.webhooksUnsubscribe,
			output: Outputs.webhooksUnsubscribe,
		},
		input,
		({ subscriptionUid }) => ({
			method: 'DELETE',
			path: `/api/hook/subscribe/${encodeURIComponent(subscriptionUid)}`,
		}),
		{ log: (_, result) => ({ success: result.success }) },
	);

export const list: PasscreatorEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		() => ({ method: 'GET', path: '/api/hook' }),
		{ log: (_, subscriptions) => ({ count: subscriptions.length }) },
	);

export const getPublicKey: PasscreatorEndpoints['webhooksGetPublicKey'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.getPublicKey',
			input: Inputs.webhooksGetPublicKey,
			output: Outputs.webhooksGetPublicKey,
		},
		input,
		() => ({ method: 'GET', path: '/api/hook/publickey' }),
		{
			// The key itself is not logged, only that one was returned.
			log: (_, result) => ({ hasKey: result.publicKey.length > 0 }),
		},
	);
