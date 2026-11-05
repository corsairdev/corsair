import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverBinaryRequest, makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';
export const listOpportunityOffers: LeverEndpoints['listOpportunityOffers'] =
	async (ctx, input) => {
		const path = leverPathParameter(
			'/opportunities/{opportunityId}/offers',
			'opportunityId',
			input.opportunityId,
		);
		const response = await makeLeverRequest<
			LeverEndpointOutputs['listOpportunityOffers']
		>(ctx, path, { method: 'GET', query: { expand: input.expand } });
		await logEventFromContext(ctx, 'lever.offers.list', input, 'completed');
		return response;
	};

export const downloadOpportunityOffer: LeverEndpoints['downloadOpportunityOffer'] =
	async (ctx, input) => {
		let path = leverPathParameter(
			'/opportunities/{opportunityId}/offers',
			'opportunityId',
			input.opportunityId,
		);
		path = leverPathParameter(
			`${path}/{offerId}/download`,
			'offerId',
			input.offerId,
		);
		const response = await makeLeverBinaryRequest(ctx, path, {
			headers: { Accept: 'application/octet-stream' },
			query: { status: input.status },
		});
		await logEventFromContext(ctx, 'lever.offers.download', input, 'completed');
		return response;
	};
