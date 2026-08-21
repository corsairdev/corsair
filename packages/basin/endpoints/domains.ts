import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { BasinEndpointOutputSchemas } from './types';

export const list: BasinEndpoints['domainsList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input?.page !== undefined) query.page = input.page;
	if (input?.query !== undefined) query.query = input.query;

	const res = await makeBasinRequest<unknown>('domains', ctx.key, {
		method: 'GET',
		query,
	});
	const response = BasinEndpointOutputSchemas.domainsList.parse(res);
	await logEventFromContext(
		ctx,
		'basin.domains.list',
		{ ...input },
		'completed',
	);
	return response;
};
