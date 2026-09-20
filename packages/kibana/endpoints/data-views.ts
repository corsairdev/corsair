import { logEventFromContext } from 'corsair/core';
import type { KibanaEndpoints } from '..';
import { makeKibanaRequest } from '../client';
import type { KibanaEndpointOutputs } from './types';

export const get: KibanaEndpoints['dataViewsGet'] = async (ctx, input) => {
	const baseUrl = ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['dataViewsGet']
	>(
		`api/data_views/data_view/${encodeURIComponent(input.id)}`,
		baseUrl,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'kibana.dataViews.get',
		{ ...input },
		'completed',
	);
	return response;
};
