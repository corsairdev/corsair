import type { LoomioEndpoints } from '..';
import { segment } from '../client';
import { bodyWithout, call, unwrapResource, withPaging } from './call';
import {
	LoomioEndpointInputSchemas as Inputs,
	LoomioEndpointOutputSchemas as Outputs,
} from './types';

// Loomio names group webhooks "chatbots" in its routes (/api/user0/chatbots).

export const list: LoomioEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		({ group_id, limit, offset }) => ({
			method: 'GET',
			path: '/chatbots',
			query: { group_id, limit, offset },
		}),
		{
			shape: (raw, parsed) => withPaging(raw, 'chatbots', parsed.offset ?? 0),
			log: (_, result) => ({ count: result.chatbots.length }),
		},
	);

export const create: LoomioEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/chatbots', body: parsed }),
		{
			shape: (raw) => unwrapResource(raw, 'chatbots', 'chatbot'),
			// The destination URL is a credential; never log it.
			log: (_, result) => ({ webhookId: result.chatbot.id }),
		},
	);

export const update: LoomioEndpoints['webhooksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/chatbots/${segment(parsed.id)}`,
			body: bodyWithout(parsed, 'id'),
			resourceScoped: true,
		}),
		{
			shape: (raw) => unwrapResource(raw, 'chatbots', 'chatbot'),
			log: (_, result) => ({ webhookId: result.chatbot.id }),
		},
	);

export const remove: LoomioEndpoints['webhooksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/chatbots/${segment(id)}`,
			resourceScoped: true,
		}),
		{ log: ({ id }) => ({ webhookId: id }) },
	);

export const check: LoomioEndpoints['webhooksCheck'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.check',
			input: Inputs.webhooksCheck,
			output: Outputs.webhooksCheck,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/chatbots/check', body: parsed }),
		{
			// Loomio answers `head :ok` (an empty 200) whether or not the
			// destination took the message, so this is an acknowledgment only.
			shape: () => ({ accepted: true }),
			log: ({ group_id }) => ({ groupId: group_id }),
		},
	);
