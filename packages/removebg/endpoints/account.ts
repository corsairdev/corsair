import { logEventFromContext } from 'corsair/core';
import { makeRemovebgRequest } from '../client';
import type { RemovebgEndpoints } from '../index';
import { AccountGetOutputSchema } from './types';

export const get: RemovebgEndpoints['account'] = async (ctx) => {
	const response = AccountGetOutputSchema.parse(
		await makeRemovebgRequest('/account', ctx.key, { method: 'GET' }),
	);

	await logEventFromContext(
		ctx,
		'removebg.account.get',
		{
			totalCredits: response.data.attributes.credits.total,
		},
		'completed',
	);

	return response;
};
