import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import { makeHandwryttenRequest } from '../client';
import type { BundlesListResponse } from './types';
import {
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
} from './types';

export const list: HandwryttenEndpoints['bundles.list'] = async (
	ctx,
	input,
) => {
	HandwryttenEndpointInputSchemas['bundles.list'].parse(input);
	const response = await makeHandwryttenRequest<BundlesListResponse>(
		'/bundles/list',
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['bundles.list'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.bundles.list',
		{ count: parsed.bundles?.length ?? 0 },
		'completed',
	);
	return parsed;
};
