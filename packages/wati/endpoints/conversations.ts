import type { WatiEndpoints } from '..';
import { target } from '../client';
import { call } from './call';
import {
	WatiEndpointInputSchemas as Inputs,
	WatiEndpointOutputSchemas as Outputs,
} from './types';

/** Conversations, newest first, filtered by channel. */
export const list: WatiEndpoints['conversationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'conversations.list',
			input: Inputs.conversationsList,
			output: Outputs.conversationsList,
		},
		input,
		({ page_number, page_size, channel_type, channel_id }) => ({
			method: 'GET',
			path: '/conversations',
			query: { page_number, page_size, channel_type, channel_id },
		}),
		{
			log: (_, result) => ({
				count: result.conversation_list?.length ?? 0,
				page: result.page_number ?? undefined,
			}),
		},
	);

/**
 * The messages in one conversation.
 *
 * The target is a conversation target — a wa_id, a phone number or a
 * conversation ID — and the docs warn against substituting a bare contact ID,
 * which is a different value.
 */
export const messages: WatiEndpoints['conversationsMessages'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'conversations.messages',
			input: Inputs.conversationsMessages,
			output: Outputs.conversationsMessages,
		},
		input,
		({ target: who, page_number, page_size }) => ({
			method: 'GET',
			path: `/conversations/${target(who)}/messages`,
			query: { page_number, page_size },
		}),
		{
			log: (_, result) => ({
				count: result.message_list?.length ?? 0,
				page: result.page_number ?? undefined,
			}),
		},
	);
