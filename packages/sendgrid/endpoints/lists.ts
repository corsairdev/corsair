import { logEventFromContext } from 'corsair/core';
import type { SendGridEndpoints } from '..';
import { makeSendGridRequest } from '../client';
import type { SendGridEndpointOutputs } from './types';

export const getAll: SendGridEndpoints['listsGetAll'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.pageSize) query.page_size = input.pageSize;
	if (input.pageToken) query.page_token = input.pageToken;

	const response = await makeSendGridRequest<
		SendGridEndpointOutputs['listsGetAll']
	>('marketing/lists', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'sendgrid.lists.getAll',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: SendGridEndpoints['listsCreate'] = async (ctx, input) => {
	const response = await makeSendGridRequest<
		SendGridEndpointOutputs['listsCreate']
	>('marketing/lists', ctx.key, {
		method: 'POST',
		body: input as unknown as Record<string, unknown>,
	});

	await logEventFromContext(
		ctx,
		'sendgrid.lists.create',
		{ ...input },
		'completed',
	);
	return response;
};
