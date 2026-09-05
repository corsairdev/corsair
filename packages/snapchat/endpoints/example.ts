import { logEventFromContext } from 'corsair/core';
import type { SnapchatEndpoints } from '..';
import type { SnapchatEndpointOutputs } from './types';
import { makeSnapchatRequest } from '../client';

export const getPublicData: SnapchatEndpoints['getPublicData'] = async (
	ctx,
	input,
) => {
	const response = await makeSnapchatRequest<
		SnapchatEndpointOutputs['getPublicData']
	>('public-data', ctx.key ?? '', {
		method: 'GET',
		query: {
			search: input.search,
		},
	});

	await logEventFromContext(
		ctx,
		'snapchat.public_data.get',
		{ ...input },
		'completed',
	);

	return response;
};