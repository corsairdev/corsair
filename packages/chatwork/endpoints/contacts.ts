import { logEventFromContext } from 'corsair/core';
import { makeChatworkRequest } from '../client';
import type { ChatworkEndpoints } from '../index';
import type { ChatworkEndpointOutputs } from './types';
import {
	ChatworkEndpointInputSchemas,
	ChatworkEndpointOutputSchemas,
} from './types';

export const list: ChatworkEndpoints['contactsList'] = async (ctx, input) => {
	const parsedInput = ChatworkEndpointInputSchemas.contactsList.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['contactsList']
	>('contacts', ctx.key, {
		method: 'GET',
		authType: ctx.options?.authType,
		defaultEmptyArray: true,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.contactsList.parse(result);

	if (ctx.db.accounts) {
		try {
			for (const contact of validatedResult) {
				await ctx.db.accounts.upsertByEntityId(
					String(contact.account_id),
					contact,
				);
			}
		} catch (error) {
			console.warn('Failed to save Chatwork contacts to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'chatwork.contacts.list',
		{ ...parsedInput },
		'completed',
	);

	return validatedResult;
};

export const listIncomingRequests: ChatworkEndpoints['contactsListIncomingRequests'] =
	async (ctx, input) => {
		const parsedInput =
			ChatworkEndpointInputSchemas.contactsListIncomingRequests.parse(input);
		const result = await makeChatworkRequest<
			ChatworkEndpointOutputs['contactsListIncomingRequests']
		>('incoming_requests', ctx.key, {
			method: 'GET',
			authType: ctx.options?.authType,
			defaultEmptyArray: true,
		});
		const validatedResult =
			ChatworkEndpointOutputSchemas.contactsListIncomingRequests.parse(result);

		await logEventFromContext(
			ctx,
			'chatwork.contacts.listIncomingRequests',
			{ ...parsedInput },
			'completed',
		);

		return validatedResult;
	};
