import { makeAgiledRequest } from '../client';
import type { AgiledContext } from '../index';
import type { ListContactsInput, ListContactsResponse } from './types';

export const Contacts = {
	list: async (
		ctx: AgiledContext,
		input: ListContactsInput,
	): Promise<ListContactsResponse> => {
		const apiKey = await ctx.key;

		return makeAgiledRequest<ListContactsResponse>('/contacts', apiKey, {
			method: 'GET',
			query: input as Record<string, string | number | boolean | undefined>,
		});
	},
};
