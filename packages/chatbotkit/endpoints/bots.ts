import { logEventFromContext } from 'corsair/core';
import type { ChatbotkitEndpoints } from '..';
import { makeChatbotkitRequest } from '../client';
import type { BotsGetResponse, BotsListResponse } from './types';

function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> {
	return Object.fromEntries(
		Object.entries(query).filter(([, value]) => value !== undefined),
	) as Record<string, string | number | boolean>;
}

export const list: ChatbotkitEndpoints['botsList'] = async (ctx, input) => {
	const response = await makeChatbotkitRequest<BotsListResponse>(
		'bot/list',
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				cursor: input.cursor,
				limit: input.limit,
				order: input.order,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'chatbotkit.bots.list',
		{ cursor: input.cursor, limit: input.limit, order: input.order },
		'completed',
	);
	return { items: response.items ?? [], cursor: response.cursor };
};

export const get: ChatbotkitEndpoints['botsGet'] = async (ctx, input) => {
	const response = await makeChatbotkitRequest<BotsGetResponse>(
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
	return response;
};
