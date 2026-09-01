import { logEventFromContext } from 'corsair/core';
import type { SendGridEndpoints } from '..';
import { makeSendGridRequest } from '../client';
import type { SendGridEndpointOutputs } from './types';

export const getAll: SendGridEndpoints['listsGetAll'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page_size) query.page_size = input.page_size;
	if (input.page_token) query.page_token = input.page_token;

	const response = await makeSendGridRequest<
		SendGridEndpointOutputs['listsGetAll']
	>('marketing/lists', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'sendgrid.lists.getAll',
		{ result_count: response.result.length },
		'completed',
	);
	return response;
};

export const create: SendGridEndpoints['listsCreate'] = async (ctx, input) => {
	const response = await makeSendGridRequest<
		SendGridEndpointOutputs['listsCreate']
	>('marketing/lists', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (ctx.db.lists && response.id) {
		await ctx.db.lists.upsertByEntityId(response.id, response);
	}

	await logEventFromContext(
		ctx,
		'sendgrid.lists.create',
		{ list_id: response.id },
		'completed',
	);
	return response;
};
