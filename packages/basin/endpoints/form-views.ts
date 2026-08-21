import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { safeDbUpsert, toFormViewRecord } from '../utils';
import type { BasinEndpointOutputs } from './types';

export const list: BasinEndpoints['formViewsList'] = async (
	ctx,
	input = {},
) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.page !== undefined) query.page = input.page;
	if (input?.query !== undefined) query.query = input.query;

	const result = await makeBasinRequest<BasinEndpointOutputs['formViewsList']>(
		'form_views',
		ctx.key,
		{ method: 'GET', query },
	);

	const viewsList = Array.isArray(result)
		? result
		: (result as { form_views?: unknown[] }).form_views;

	if (Array.isArray(viewsList)) {
		for (const view of viewsList) {
			if (view && typeof view === 'object' && 'id' in view) {
				await safeDbUpsert(
					ctx.db.formViews,
					(view as { id: string | number }).id,
					toFormViewRecord(view as Parameters<typeof toFormViewRecord>[0]),
					'formView',
				);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'basin.formViews.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const FormViews = {
	list,
};
