import type { WebexEndpoints } from '..';
import { segment } from '../client';
import { call, list as listPage } from './call';
import {
	WebexEndpointInputSchemas as Inputs,
	WebexEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Lists messages. Webex requires either a room or a thread parent, which the
 * input schema enforces — without one the API would return the whole org's
 * messages, which is never what is wanted.
 */
export const list: WebexEndpoints['messagesList'] = (ctx, input) =>
	listPage(
		ctx,
		{
			event: 'messages.list',
			input: Inputs.messagesList,
			output: Outputs.messagesList,
		},
		input,
		({ roomId, parentId, mentionedPeople, before, beforeMessage, max }) => ({
			method: 'GET',
			path: '/messages',
			query: { roomId, parentId, mentionedPeople, before, beforeMessage, max },
		}),
		{ log: (_, result) => ({ count: result.items?.length ?? 0 }) },
	);

export const get: WebexEndpoints['messagesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.get',
			input: Inputs.messagesGet,
			output: Outputs.messagesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/messages/${segment(id)}` }),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				room: result.roomId ?? undefined,
				// Whether the message held files, never their URLs.
				files: result.files?.length ?? 0,
			}),
		},
	);

/**
 * Sends a message. The body is passed through as given: Webex decides which of
 * `text`, `markdown`, `html` and `files` to render, and the input schema has
 * already refused a message with none of them and no destination.
 */
export const create: WebexEndpoints['messagesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.create',
			input: Inputs.messagesCreate,
			output: Outputs.messagesCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/messages', body }),
		{
			// The body is the user's content, so only its shape is logged.
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				room: parsed.roomId,
				reply: parsed.parentId !== undefined,
				files: parsed.files?.length ?? 0,
			}),
		},
	);

export const update: WebexEndpoints['messagesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.update',
			input: Inputs.messagesUpdate,
			output: Outputs.messagesUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/messages/${segment(id)}`,
			body,
		}),
		{
			log: (_, result) => ({ id: result.id ?? undefined }),
		},
	);

export const remove: WebexEndpoints['messagesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.delete',
			input: Inputs.messagesDelete,
			output: Outputs.messagesDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/messages/${segment(id)}` }),
		{
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id }) => ({ id }),
		},
	);
