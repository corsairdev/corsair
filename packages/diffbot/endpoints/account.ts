import { logEventFromContext } from 'corsair/core';
import { makeDiffbotRequest } from '../client';
import type { DiffbotEndpoints } from '../index';

export const getAccount: DiffbotEndpoints['getAccount'] = async (
	ctx,
	_input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['getAccount']>>
	>('account', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'diffbot.account.getAccount', {}, 'completed');
	return response;
};
