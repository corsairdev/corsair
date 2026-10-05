import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import type { BenzingaEndpointOutputs } from './types';

export const listNewsChannels: BenzingaEndpoints['listNewsChannels'] = async (
	ctx,
	input,
) => {
	const response = await makeBenzingaRequest<
		BenzingaEndpointOutputs['listNewsChannels']
	>('/api/v2.1/news/channels', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'benzinga.news.listChannels',
		{ ...input },
		'completed',
	);

	return response;
};
