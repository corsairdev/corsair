import type { ParsioEndpoints } from '..';
import { call, expectEmptyBody } from './call';
import {
	ParsioEndpointInputSchemas as Inputs,
	ParsioEndpointOutputSchemas as Outputs,
} from './types';

export const listForMailbox: ParsioEndpoints['webhooksListForMailbox'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.listForMailbox',
			input: Inputs.webhooksListForMailbox,
			output: Outputs.webhooksListForMailbox,
		},
		input,
		({ mailboxId }) => ({
			method: 'GET',
			path: `/webhooks/mb/${encodeURIComponent(mailboxId)}`,
		}),
		{ log: (_, webhooks) => ({ count: webhooks.length }) },
	);

export const get: ParsioEndpoints['webhooksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.get',
			input: Inputs.webhooksGet,
			output: Outputs.webhooksGet,
		},
		input,
		({ webhookId }) => ({
			method: 'GET',
			path: `/webhooks/${encodeURIComponent(webhookId)}`,
		}),
		{ log: (_, webhook) => ({ webhookId: webhook._id ?? undefined }) },
	);

export const create: ParsioEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		({ mailboxId, ...body }) => ({
			method: 'POST',
			path: `/webhooks/${encodeURIComponent(mailboxId)}`,
			body,
		}),
		{
			// The signing secret lives in the Parsio app, never in this answer.
			log: (_, webhook) => ({ webhookId: webhook._id ?? undefined }),
		},
	);

export const update: ParsioEndpoints['webhooksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		({ webhookId, ...body }) => ({
			method: 'POST',
			path: '/webhooks',
			body: { _id: webhookId, ...body },
		}),
		{ log: (_, webhook) => ({ webhookId: webhook._id ?? undefined }) },
	);

export const remove: ParsioEndpoints['webhooksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		({ ids }) => ({
			method: 'DELETE',
			path: '/webhooks',
			body: { ids },
		}),
		{
			shape: (raw, { ids }) => {
				expectEmptyBody(raw, 'webhooks.delete');
				return { ids, success: true };
			},
			log: (_, result) => ({ count: result.ids.length }),
		},
	);
