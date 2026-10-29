import { logEventFromContext } from 'corsair/core';
import { makeDeepseekRequest } from '../client';
import type { DeepseekEndpoints } from '../index';
import type { GetUserBalanceResponse } from '../schema/balance';

export const getBalance: DeepseekEndpoints['userGetBalance'] = async (ctx) => {
	const result = await makeDeepseekRequest<GetUserBalanceResponse>(
		'user/balance',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'deepseek.user.getBalance', {}, 'completed');
	return result;
};
