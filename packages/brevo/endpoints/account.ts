import { logEventFromContext } from 'corsair/core';
import { makeBrevoRequest } from '../client';
import type { BrevoEndpoints } from '../index';
import { BrevoEndpointInputSchemas, BrevoEndpointOutputSchemas } from './types';

export const get: BrevoEndpoints['accountGet'] = async (ctx, input) => {
	BrevoEndpointInputSchemas.accountGet.parse(input);

	const raw = await makeBrevoRequest<unknown>('account', ctx.key, {
		method: 'GET',
	});
	const response = BrevoEndpointOutputSchemas.accountGet.parse(raw);

	await logEventFromContext(
		ctx,
		'brevo.account.get',
		{ email: response.email },
		'completed',
	);

	return response;
};
