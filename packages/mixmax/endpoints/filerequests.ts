import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { mixmaxPathParameter } from './path';
import type { MixmaxEndpointOutputs } from './types';

export const fileRequestsList: MixmaxEndpoints['fileRequestsList'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['fileRequestsList']
	>(ctx, '/v1/filerequests', {
		method: 'GET',
		query: {
			limit: input.limit,
			next: input.next,
			previous: input.previous,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.fileRequests.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const fileRequestsGet: MixmaxEndpoints['fileRequestsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['fileRequestsGet']
	>(ctx, mixmaxPathParameter('/v1/filerequests/{id}', 'id', input.id), {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'mixmax.fileRequests.get',
		{ ...input },
		'completed',
	);
	return result;
};
