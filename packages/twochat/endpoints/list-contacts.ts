import { logEventFromContext } from 'corsair/core';
import { makeTwoChatRequest } from '../client';
import type { TwoChatContext } from '../index';
import { cacheContacts } from './persist';
import type { TwoChatEndpointOutputs } from './types';

export const listContacts = async (
	ctx: TwoChatContext & { key: string },
	input: { page_number?: number; results_per_page?: number },
): Promise<TwoChatEndpointOutputs['listContacts']> => {
	const response = await makeTwoChatRequest<
		TwoChatEndpointOutputs['listContacts']
	>('open/contacts', ctx.key, {
		method: 'GET',
		query: {
			page_number: input.page_number ?? 0,
			results_per_page: input.results_per_page ?? 30,
		},
	});

	await cacheContacts(ctx, response.contacts);
	await logEventFromContext(
		ctx,
		'twochat.contacts.listContacts',
		{},
		'completed',
	);

	return response;
};
