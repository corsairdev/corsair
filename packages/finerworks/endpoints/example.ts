import { logEventFromContext } from 'corsair/core';
import type { FinerWorksEndpoints } from '..';
import { makeFinerWorksRequest } from '../client';
import type { FinerWorksEndpointOutputs } from './types';

export const get: FinerWorksEndpoints['testConnection'] = async (
	ctx,
	input,
) => {
	const response = await makeFinerWorksRequest<
		FinerWorksEndpointOutputs['exampleGet']
	>('/v3/test_my_credentials', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'finerworks.test.connection',
		{ ...input },
		'completed',
	);

	return response;
};
