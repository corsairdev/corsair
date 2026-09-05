import { logEventFromContext } from 'corsair/core';
import { makeClickmeetingRequest } from '../client';
import type { ClickmeetingEndpoints } from '../index';

export const getChats: ClickmeetingEndpoints['getChats'] = async (
	ctx,
	input,
) => {
	const query = input.page ? { page: input.page } : undefined;
	const res = await makeClickmeetingRequest<any>('/chats', ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'clickmeeting.chats.getChats',
		{},
		'completed',
	);
	return res;
};

export const getChatDetails: ClickmeetingEndpoints['getChatDetails'] = async (
	ctx,
	input,
) => {
	const res = await makeClickmeetingRequest<any>(
		`/chats/${encodeURIComponent(String(input.chatId))}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	await logEventFromContext(
		ctx,
		'clickmeeting.chats.getChatDetails',
		{ chatId: input.chatId },
		'completed',
	);
	return res;
};
