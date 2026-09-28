import { logEventFromContext } from 'corsair/core';
import type { KibanaEndpoints } from '..';
import { makeKibanaRequest } from '../client';
import type { KibanaEndpointOutputs } from './types';

export const get: KibanaEndpoints['statusGet'] = async (ctx, input) => {
	const baseUrl = ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
	const response = await makeKibanaRequest<KibanaEndpointOutputs['statusGet']>(
		'api/status',
		baseUrl,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'kibana.status.get',
		{ ...input },
		'completed',
	);
	return response;
};
