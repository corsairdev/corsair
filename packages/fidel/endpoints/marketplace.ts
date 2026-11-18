import { logEventFromContext } from 'corsair/core';
import type { FidelEndpoints } from '..';
import { makeFidelRequest } from '../client';
import { fidelPathParameter } from './path';
import type { FidelEndpointOutputs } from './types';

export const listMarketplaceOffers: FidelEndpoints['listMarketplaceOffers'] =
	async (ctx, input) => {
		const response = await makeFidelRequest<
			FidelEndpointOutputs['listMarketplaceOffers']
		>(ctx, '/v1/marketplace-offers', { method: 'GET', query: input });
		await logEventFromContext(
			ctx,
			'fidel.marketplace.listMarketplaceOffers',
			input,
			'completed',
		);
		return response;
	};

export const createOfferFromMarketplaceOffer: FidelEndpoints['createOfferFromMarketplaceOffer'] =
	async (ctx, input) => {
		const { marketplaceOfferId, ...rest } = input;
		const response = await makeFidelRequest<
			FidelEndpointOutputs['createOfferFromMarketplaceOffer']
		>(
			ctx,
			fidelPathParameter(
				'/v1/marketplace-offers/{marketplaceOfferId}/offers',
				'marketplaceOfferId',
				input.marketplaceOfferId,
			),
			{ method: 'POST', body: rest },
		);
		await logEventFromContext(
			ctx,
			'fidel.marketplace.createOfferFromMarketplaceOffer',
			input,
			'completed',
		);
		return response;
	};
