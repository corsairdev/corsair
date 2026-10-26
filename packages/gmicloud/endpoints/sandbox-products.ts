import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const list: GmicloudEndpoints['sandboxProductsList'] = async (
	ctx,
	input,
) => {
	const { idc_name, resource_type, include_unavailable } =
		GmicloudEndpointInputSchemas.sandboxProductsList.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxProductsList.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v2/products',
			query: { idc_name, resource_type, include_unavailable },
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.sandboxProducts.list',
		{},
		'completed',
	);
	return result;
};
