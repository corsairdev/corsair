import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { BasinEndpointInputSchemas, BasinEndpointOutputSchemas } from './types';

export const list: BasinEndpoints['formViewsList'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.formViewsList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (validated.page !== undefined) query.page = validated.page;
	if (validated.query !== undefined) query.query = validated.query;

	const res = await makeBasinRequest<unknown>('form_views', ctx.key, {
		method: 'GET',
		query,
	});
	const response = BasinEndpointOutputSchemas.formViewsList.parse(res);
	await logEventFromContext(
		ctx,
		'basin.formViews.list',
		{ ...validated },
		'completed',
	);
	return response;
};

export const get: BasinEndpoints['formViewsGet'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.formViewsGet.parse(input);
	const res = await makeBasinRequest<unknown>(
		`form_views/${validated.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const response = BasinEndpointOutputSchemas.formViewsGet.parse(res);
	await logEventFromContext(
		ctx,
		'basin.formViews.get',
		{ ...validated },
		'completed',
	);
	return response;
};
