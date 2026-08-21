import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { BasinEndpointOutputSchemas } from './types';

export const list: BasinEndpoints['formViewsList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input?.page !== undefined) query.page = input.page;
	if (input?.query !== undefined) query.query = input.query;

	const res = await makeBasinRequest<unknown>('form_views', ctx.key, {
		method: 'GET',
		query,
	});
	const response = BasinEndpointOutputSchemas.formViewsList.parse(res);
	await logEventFromContext(
		ctx,
		'basin.formViews.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: BasinEndpoints['formViewsGet'] = async (ctx, input) => {
	const res = await makeBasinRequest<unknown>(
		`form_views/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const response = BasinEndpointOutputSchemas.formViewsGet.parse(res);
	await logEventFromContext(
		ctx,
		'basin.formViews.get',
		{ ...input },
		'completed',
	);
	return response;
};
