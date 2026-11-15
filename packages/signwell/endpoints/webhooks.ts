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
			// The webhook id is what verifies delivery signatures, so a caller
			// needs it; the URL is not logged because it can carry a secret path.
			log: (_, result) => ({ webhookId: result.id }),
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
			log: ({ id }) => ({ webhookId: id }),
		},
	);
