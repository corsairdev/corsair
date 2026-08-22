import { logEventFromContext } from 'corsair/core';
import type { ChatbotkitEndpoints } from '..';
import { makeChatbotkitRequest } from '../client';
import type { Bot } from './types';

function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> {
	return Object.fromEntries(
		Object.entries(query).filter(([, value]) => value !== undefined),
	) as Record<string, string | number | boolean>;
}

export const list: ChatbotkitEndpoints['botsList'] = async (ctx, input) => {
	const envelope = await makeChatbotkitRequest<Bot[]>('bot/list', ctx.key, {
		method: 'GET',
		query: compactQuery({
			cursor: input.cursor,
			limit: input.limit,
			order: input.order,
		}),
	});

	await logEventFromContext(
		ctx,
		'chatbotkit.bots.list',
		{ cursor: input.cursor, limit: input.limit, order: input.order },
		'completed',
	);
	return { data: envelope.data ?? [], meta: envelope.meta };
};

export const get: ChatbotkitEndpoints['botsGet'] = async (ctx, input) => {
	const envelope = await makeChatbotkitRequest<Bot>(
		`bot/${encodeURIComponent(input.id)}/fetch`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'chatbotkit.bots.get',
		{ id: input.id },
		'completed',
	);
	return envelope.data;
};
