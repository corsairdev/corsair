import { logEventFromContext } from 'corsair/core';
import { makeAmaraRequest } from '../client';
import type { AmaraEndpoints } from '../index';
import { MessageSendResponseSchema } from './types';

export const send: AmaraEndpoints['messagesSend'] = async (ctx, input) => {
	const body: Record<string, unknown> = {
		subject: input.subject,
		content: input.content,
	};
	if (input.user !== undefined) body.user = input.user;
	if (input.team !== undefined) body.team = input.team;

	const raw = await makeAmaraRequest('message/', ctx.key, {
		method: 'POST',
		body,
	});
	const response = MessageSendResponseSchema.parse(raw);
	await logEventFromContext(ctx, 'amara.messages.send', {}, 'completed');
	return response;
};
