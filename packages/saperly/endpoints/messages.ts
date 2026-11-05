import type { SaperlyEndpoints } from '../index';
import { callSaperly, idempotencyHeaders } from './call';
import {
	ListMessagesInputSchema,
	MessageSchema,
	SaperlyEndpointOutputSchemas,
	SendMessageInputSchema,
} from './types';

export const send: SaperlyEndpoints['sendMessage'] = async (ctx, input) => {
	return callSaperly(
		ctx,
		'saperly.messages.send',
		SendMessageInputSchema,
		MessageSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/messages',
			headers: idempotencyHeaders(body.idempotencyKey),
			body: {
				fromNumberId: body.fromNumberId,
				to: body.to,
				body: body.body,
			},
		}),
		(body, message) => ({
			messageId: message.id,
			fromNumberId: body.fromNumberId,
			segments: message.segments,
		}),
	);
};

export const list: SaperlyEndpoints['listMessages'] = async (ctx, input) => {
	return callSaperly(
		ctx,
		'saperly.messages.list',
		ListMessagesInputSchema,
		SaperlyEndpointOutputSchemas.listMessages,
		input,
		(body) => ({
			method: 'GET',
			url: '/messages',
			query: { numberId: body.numberId },
		}),
		(body, messages) => ({
			numberId: body.numberId ?? null,
			count: messages.length,
		}),
	);
};
