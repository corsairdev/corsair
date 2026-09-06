import { logEventFromContext } from 'corsair/core';
import { makeImejisioRequest } from '../client';
import type { ImejisioEndpoints } from '../index';
import type { ImejisioEndpointOutputs } from './types';

export const list: ImejisioEndpoints['listDesigns'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) {
		query.$page = input.page;
	}
	if (input.limit !== undefined) {
		query.$limit = input.limit;
	}

	const response = await makeImejisioRequest<
		ImejisioEndpointOutputs['listDesigns']
	>('/designs/v2', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'imejisio.designs.list',
		{ ...input },
		'completed',
	);

	return response;
};
