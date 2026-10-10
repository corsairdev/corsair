import { logEventFromContext } from 'corsair/core';
import { makeRetellRequest } from '../client';
import type { RetellEndpoints } from '../index';
import { cacheChat } from './persist';
import type { RetellEndpointOutputs } from './types';
import { RetellEndpointOutputSchemas } from './types';

export const list: RetellEndpoints['chatsList'] = async (ctx, input) => {
	const response = await makeRetellRequest<RetellEndpointOutputs['chatsList']>(
		'/v3/list-chats',
		ctx.key,
		{
			method: 'POST',
			body: {
				filter_criteria: input.filterCriteria,
				limit: input.limit,
				pagination_key: input.paginationKey,
				sort_order: input.sortOrder,
				enable_total: input.enableTotal,
			},
		},
	);
	const parsed = RetellEndpointOutputSchemas.chatsList.parse(response);
	await logEventFromContext(
		ctx,
		'retellai.api.chats.list',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const get: RetellEndpoints['chatsGet'] = async (ctx, input) => {
	const response = await makeRetellRequest<RetellEndpointOutputs['chatsGet']>(
		`/get-chat/${encodeURIComponent(input.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = RetellEndpointOutputSchemas.chatsGet.parse(response);
	await cacheChat(ctx.db?.chats, parsed);
	await logEventFromContext(
		ctx,
		'retellai.api.chats.get',
		{ chatId: input.id },
		'completed',
	);
	return parsed;
};
