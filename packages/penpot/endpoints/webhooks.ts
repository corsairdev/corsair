import type { PenpotEndpoints } from '..';
import { call, shapeDeleted } from './call';
import {
	PenpotEndpointInputSchemas as Inputs,
	PenpotEndpointOutputSchemas as Outputs,
} from './types';

export const list: PenpotEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		() => 'get-webhooks',
		{
			body: ({ teamId }) => ({ teamId }),
			log: (_, webhooks) => ({ count: webhooks.length }),
		},
	);

export const create: PenpotEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		() => 'create-webhook',
		{
			body: (input) => input,
			log: (_, webhook) => ({ webhookId: webhook.id ?? undefined }),
		},
	);

export const update: PenpotEndpoints['webhooksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		() => 'update-webhook',
		{
			body: (input) => input,
			log: (_, webhook) => ({ webhookId: webhook.id ?? undefined }),
		},
	);

export const remove: PenpotEndpoints['webhooksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		() => 'delete-webhook',
		{
			body: ({ id }) => ({ id }),
			shape: shapeDeleted,
			log: (_, result) => ({ webhookId: result.id }),
		},
	);
