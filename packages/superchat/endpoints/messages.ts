import type { SuperchatEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	SuperchatEndpointInputSchemas as Inputs,
	SuperchatEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Sending a message reaches a real person on WhatsApp, SMS or another channel.
 * The `from` channel and the recipient's handle decide which, and the content
 * must suit that channel, so a text body sent to a channel that only accepts
 * templates is rejected by Superchat after the call.
 */
export const send: SuperchatEndpoints['messagesSend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.send',
			input: Inputs.messagesSend,
			output: Outputs.messagesSend,
		},
		input,
		(body) => ({ method: 'POST', path: '/messages', body }),
		{
			// The recipient handle is an email or phone number, so only ids and the
			// channel are logged.
			log: (parsed, result) => ({
				messageId: result.id,
				channelId: parsed.from.channel_id,
				conversationId: result.conversation_id ?? undefined,
			}),
		},
	);

export const get: SuperchatEndpoints['messagesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.get',
			input: Inputs.messagesGet,
			output: Outputs.messagesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/messages/${segment(id)}` }),
		{ log: ({ id }) => ({ messageId: id }) },
	);
