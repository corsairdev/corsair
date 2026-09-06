import { logEventFromContext } from 'corsair/core';
import type { CampaynEndpoints } from '..';
import { makeCampaynRequest } from '../client';
import type { CampaynEndpointOutputs } from './types';

export const getLists: CampaynEndpoints['listsGet'] = async (ctx) => {
	const response = await makeCampaynRequest<CampaynEndpointOutputs['listsGet']>(
		'lists.json',
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(ctx, 'campayn.lists.get', {}, 'completed');

	return response;
};
