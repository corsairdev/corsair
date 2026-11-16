import type { TelnyxEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	MessagesGetInputSchema,
	MessagesGetResponseSchema,
	MessagesRemoveInputSchema,
	MessagesRemoveResponseSchema,
	MessagesSendInputSchema,
	MessagesSendResponseSchema,
} from './types';

export const messagesSend: TelnyxEndpoints['messagesSend'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'messages.send',
			input: MessagesSendInputSchema,
			output: MessagesSendResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/messages',
			body: parsed,
		}),
	);
};

export const messagesGet: TelnyxEndpoints['messagesGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'messages.get',
			input: MessagesGetInputSchema,
			output: MessagesGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/messages/${segment(parsed.messageId)}`,
		}),
	);
};

export const messagesRemove: TelnyxEndpoints['messagesRemove'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'messages.remove',
			input: MessagesRemoveInputSchema,
			output: MessagesRemoveResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/messages/${segment(parsed.messageId)}`,
		}),
	);
};
