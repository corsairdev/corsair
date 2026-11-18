import type { SuperchatEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	SuperchatEndpointInputSchemas as Inputs,
	SuperchatEndpointOutputSchemas as Outputs,
} from './types';

export const list: SuperchatEndpoints['conversationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'conversations.list',
			input: Inputs.conversationsList,
			output: Outputs.conversationsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/conversations', query }),
		{ log: (_, result) => ({ count: result.results.length }) },
	);

export const get: SuperchatEndpoints['conversationsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'conversations.get',
			input: Inputs.conversationsGet,
			output: Outputs.conversationsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/conversations/${segment(id)}` }),
		{ log: ({ id }) => ({ conversationId: id }) },
	);

/**
 * The body carries only what changes, but snoozing needs a status of `snoozed`
 * together with a `snoozed_until`, which the input schema enforces.
 */
export const update: SuperchatEndpoints['conversationsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'conversations.update',
			input: Inputs.conversationsUpdate,
			output: Outputs.conversationsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/conversations/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ conversationId: id }) },
	);

export const messages: SuperchatEndpoints['conversationsMessages'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'conversations.messages',
			input: Inputs.conversationsMessages,
			output: Outputs.conversationsMessages,
		},
		input,
		({ id, ...query }) => ({
			method: 'GET',
			path: `/conversations/${segment(id)}/messages`,
			query,
		}),
		{
			log: ({ id }, result) => ({
				conversationId: id,
				count: result.results.length,
			}),
		},
	);
