import { logEventFromContext } from 'corsair/core';
import { makeAlchemyPricesRequest } from '../client';
import type { AlchemyEndpoints } from '../index';
import type { AlchemyEndpointOutputs } from './types';

export const getHistoricalPrices: AlchemyEndpoints['pricesGetHistoricalPrices'] =
	async (ctx, input) => {
		const body: Record<string, unknown> = {
			startTime: input.startTime,
			endTime: input.endTime,
			interval: input.interval,
			withMarketData: input.withMarketData,
		};
		if (input.symbol) {
			body.symbol = input.symbol;
		} else {
			body.network = input.network;
			body.address = input.address;
		}

		const response = await makeAlchemyPricesRequest<
			AlchemyEndpointOutputs['pricesGetHistoricalPrices']
		>(ctx.key, '/tokens/historical', { method: 'POST', body });

		await logEventFromContext(
			ctx,
			'alchemy.prices.getHistoricalPrices',
			{
				symbol: input.symbol,
				network: input.network,
				address: input.address,
			},
			'completed',
		);
		return response;
	};

export const getTokenPricesByAddress: AlchemyEndpoints['pricesGetTokenPricesByAddress'] =
	async (ctx, input) => {
		const response = await makeAlchemyPricesRequest<
			AlchemyEndpointOutputs['pricesGetTokenPricesByAddress']
		>(ctx.key, '/tokens/by-address', {
			method: 'POST',
			body: { addresses: input.addresses },
		});

		await logEventFromContext(
			ctx,
			'alchemy.prices.getTokenPricesByAddress',
			{ count: input.addresses.length },
			'completed',
		);
		return response;
	};

export const getPricesBySymbol: AlchemyEndpoints['pricesGetPricesBySymbol'] =
	async (ctx, input) => {
		const response = await makeAlchemyPricesRequest<
			AlchemyEndpointOutputs['pricesGetPricesBySymbol']
		>(ctx.key, '/tokens/by-symbol', {
			method: 'GET',
			query: { symbols: input.symbols },
		});

		await logEventFromContext(
			ctx,
			'alchemy.prices.getPricesBySymbol',
			{ symbols: input.symbols },
			'completed',
		);
		return response;
	};
