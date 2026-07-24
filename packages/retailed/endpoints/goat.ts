import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';

import type { RetailedContext } from '..';
import { makeRetailedRequest } from '../client';
import type {
	GoatPricesInput,
	GoatPricesResponse,
	RetailedEndpointOutputs,
} from './types';
import { RetailedEndpointOutputSchemas } from './types';

export const goatPrices: CorsairEndpoint<
	RetailedContext,
	GoatPricesInput,
	GoatPricesResponse
> = async (ctx, input) => {
	const query: Record<string, string> = {
		query: input.query,
	};

	if (input.country) {
		query.country = input.country;
	}

	const response = await makeRetailedRequest<
		RetailedEndpointOutputs['goatPrices']
	>('scraper/goat/prices', ctx.key, {
		method: 'GET',
		query,
	});

	const parsed = RetailedEndpointOutputSchemas.goatPrices.parse(response);

	await logEventFromContext(ctx, 'retailed.goat.prices', {}, 'completed');

	return parsed;
};
