import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { BasinEndpointInputSchemas, BasinEndpointOutputSchemas } from './types';

export const list: BasinEndpoints['domainsList'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.domainsList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (validated.page !== undefined) query.page = validated.page;
	if (validated.query !== undefined) query.query = validated.query;

	const res = await makeBasinRequest<unknown>('domains', ctx.key, {
		method: 'GET',
		query,
	});
	const response = BasinEndpointOutputSchemas.domainsList.parse(res);
	await logEventFromContext(
		ctx,
		'basin.domains.list',
		{ ...validated },
		'completed',
	);
	return response;
};
