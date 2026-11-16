import type { SignwellEndpoints } from '..';
import { segment } from '../client';
import { call, deletion } from './shared';
import {
	SignwellEndpointInputSchemas as Inputs,
	SignwellEndpointOutputSchemas as Outputs,
} from './types';

export const list: SignwellEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		() => ({ method: 'GET', path: '/v1/hooks' }),
		{
			// The route answers a bare array, so the envelope is added here.
			shape: (raw) => {
				if (!Array.isArray(raw)) {
					throw new Error(
						'webhooks.list expected an array of webhooks from SignWell.',
					);
				}
				return { webhooks: raw };
			},
			log: (_, result) => ({ count: result.webhooks.length }),
		},
	);

export const create: SignwellEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/v1/hooks', body }),
		{
			// Nothing identifying is logged: the webhook id is also the HMAC key
			// that signs deliveries, and the URL can carry a secret path. The
			// caller gets the id in the response.
			log: () => ({}),
		},
	);

export const remove: SignwellEndpoints['webhooksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/v1/hooks/${segment(id)}` }),
		{
			shape: (raw, { id }) => deletion(raw, 'webhooks.delete', id),
			// The id is the signing key (see create), so it stays out of the log.
			log: () => ({}),
		},
	);
