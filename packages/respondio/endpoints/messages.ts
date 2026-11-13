import type { RespondioEndpoints } from '..';
import { contactIdentifier, cursorFrom } from '../client';
import { call } from './call';
import {
	RespondioEndpointInputSchemas as Inputs,
	RespondioEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Sends a message to a contact.
 *
 * Without a `channelId` respond.io uses the last channel the contact interacted
 * on, which is convenient but means a message can go somewhere unexpected if the
 * contact has moved; a custom_payload message *requires* the channel.
 */
export const send: RespondioEndpoints['messageSend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.send',
			input: Inputs.messageSend,
			output: Outputs.messageSend,
		},
		input,
		({ identifier, channelId, message }) => ({
			method: 'POST',
			path: `/contact/${contactIdentifier(identifier)}/message`,
			body: { channelId, message },
			// Sending the same text twice delivers two messages; there is no
			// idempotency key.
			replayable: false,
		}),
		{
			log: (parsed, result) => ({
				messageId: result.messageId,
				type: parsed.message.type,
				channelId: parsed.channelId ?? undefined,
			}),
		},
	);

export const get: RespondioEndpoints['messageGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.get',
			input: Inputs.messageGet,
			output: Outputs.messageGet,
		},
		input,
		({ identifier, messageId }) => ({
			method: 'GET',
			path: `/contact/${contactIdentifier(identifier)}/message/${encodeURIComponent(String(messageId))}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({
				// The read-back model is loose, so its scalars widen; a presence
				// flag is what is safe to report.
				hasStatus: (result.status?.length ?? 0) > 0,
			}),
		},
	);

/**
 * Lists messages for a contact.
 *
 * With `includeComments` the list mixes comments in, and a page can be empty while
 * `pagination.next` is still set, so a caller must keep paging until `next` is
 * null rather than stopping at an empty page.
 */
export const list: RespondioEndpoints['messageList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.list',
			input: Inputs.messageList,
			output: Outputs.messageList,
		},
		input,
		({ identifier, cursorId, includeComments, limit }) => ({
			method: 'GET',
			path: `/contact/${contactIdentifier(identifier)}/message/list`,
			query: { cursorId: cursorFrom(cursorId), includeComments, limit },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				count: result.items?.length ?? 0,
				hasNext:
					result.pagination?.next !== null &&
					result.pagination?.next !== undefined,
			}),
		},
	);

/** Adds an internal comment to a contact. Not visible to the customer. */
export const comment: RespondioEndpoints['commentCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.create',
			input: Inputs.commentCreate,
			output: Outputs.commentCreate,
		},
		input,
		({ identifier, text }) => ({
			method: 'POST',
			path: `/contact/${contactIdentifier(identifier)}/comment`,
			body: { text },
			// A second call posts a second comment.
			replayable: false,
		}),
		{
			log: (_, result) => ({ contactId: result.contactId ?? undefined }),
		},
	);
