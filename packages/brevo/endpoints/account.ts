import { logEventFromContext } from 'corsair/core';
import { makeBrevoRequest } from '../client';
import type { BrevoEndpoints } from '../index';
import type { BrevoEndpointOutputs } from './types';

export const get: BrevoEndpoints['accountGet'] = async (ctx, _input) => {
	const response = await makeBrevoRequest<BrevoEndpointOutputs['accountGet']>(
		'account',
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'brevo.account.get',
		{ email: response.email },
		'completed',
	);

	return response;
};
