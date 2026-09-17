import { logEventFromContext } from 'corsair/core';
import { makeChatworkRequest } from '../client';
import type { ChatworkEndpoints } from '../index';
import type { ChatworkEndpointOutputs } from './types';
import {
	ChatworkEndpointInputSchemas,
	ChatworkEndpointOutputSchemas,
} from './types';

export const get: ChatworkEndpoints['accountGet'] = async (ctx, input) => {
	const parsedInput = ChatworkEndpointInputSchemas.accountGet.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['accountGet']
	>('me', ctx.key, {
		method: 'GET',
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.accountGet.parse(result);

	if (ctx.db.accounts) {
		try {
			await ctx.db.accounts.upsertByEntityId(
				String(validatedResult.account_id),
				validatedResult,
			);
		} catch (error) {
			console.warn('Failed to save Chatwork account to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'chatwork.account.get',
		{ ...parsedInput },
		'completed',
	);

	return validatedResult;
};
