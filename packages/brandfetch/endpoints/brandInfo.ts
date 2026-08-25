import { logEventFromContext } from 'corsair/core';

import type { BrandfetchEndpoints } from '..';
import { makeBrandfetchRequest } from '../client';
import type { BrandfetchEndpointOutputs } from './types';

export const getBrandInfo: BrandfetchEndpoints['getBrandInfo'] = async (
	ctx,
	input,
) => {
	const response = await makeBrandfetchRequest<
		BrandfetchEndpointOutputs['getBrandInfo']
	>(`/v2/brands/domain/${encodeURIComponent(input.domain)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'brandfetch.brand.getInfo',
		{ ...input },
		'completed',
	);

	return response;
};
