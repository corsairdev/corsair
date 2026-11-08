import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import type { SalesflareEndpointOutputs } from './types';

export const listCampaignMergeFields: SalesflareEndpoints['listCampaignMergeFields'] =
	async (ctx, input) => {
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['listCampaignMergeFields']
		>(ctx, '/campaigns/mergefields', { method: 'GET' });
		await logEventFromContext(
			ctx,
			'salesflare.campaigns.listCampaignMergeFields',
			input,
			'completed',
		);
		return response;
	};
