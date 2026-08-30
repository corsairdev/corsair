import { logEventFromContext } from 'corsair/core';
import type { CampaynEndpoints } from '..';
import type { CampaynEndpointOutputs } from './types';
import { makeCampaynRequest } from '../client';

export const get: CampaynEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeCampaynRequest<CampaynEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'campayn.example.get', { ...input }, 'completed');
	return response;
};
