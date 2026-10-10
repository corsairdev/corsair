import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { CoinbaseEndpoints } from '..';
import { makeCoinbaseRequest } from '../client';
import { CoinbasePrice } from '../schema';
import {
	DataGetExchangeRatesOutputSchema,
	DataGetTimeOutputSchema,
	DataListCurrenciesOutputSchema,
} from './types';

const DataEnvelope = <T extends z.ZodType>(data: T) => z.object({ data });

export const getSpot: CoinbaseEndpoints['pricesGetSpot'] = async (
	ctx,
	input,
) => {
	const envelope = await makeCoinbaseRequest(
		`/v2/prices/${encodeURIComponent(input.currency_pair)}/spot`,
		ctx.key,
		{
			schema: DataEnvelope(CoinbasePrice),
			query: { date: input.date },
		},
	);
	await logEventFromContext(ctx, 'coinbase.prices.getSpot', input, 'completed');
	return envelope.data;
};

export const getBuy: CoinbaseEndpoints['pricesGetBuy'] = async (ctx, input) => {
	const envelope = await makeCoinbaseRequest(
		`/v2/prices/${encodeURIComponent(input.currency_pair)}/buy`,
		ctx.key,
		{ schema: DataEnvelope(CoinbasePrice) },
	);
	await logEventFromContext(ctx, 'coinbase.prices.getBuy', input, 'completed');
	return envelope.data;
};

export const getSell: CoinbaseEndpoints['pricesGetSell'] = async (
	ctx,
	input,
) => {
	const envelope = await makeCoinbaseRequest(
		`/v2/prices/${encodeURIComponent(input.currency_pair)}/sell`,
		ctx.key,
		{ schema: DataEnvelope(CoinbasePrice) },
	);
	await logEventFromContext(ctx, 'coinbase.prices.getSell', input, 'completed');
	return envelope.data;
};

export const getExchangeRates: CoinbaseEndpoints['dataGetExchangeRates'] =
	async (ctx, input) => {
		const envelope = await makeCoinbaseRequest('/v2/exchange-rates', ctx.key, {
			schema: DataEnvelope(DataGetExchangeRatesOutputSchema),
			query: { currency: input.currency },
		});
		await logEventFromContext(
			ctx,
			'coinbase.data.getExchangeRates',
			input,
			'completed',
		);
		return envelope.data;
	};

export const listCurrencies: CoinbaseEndpoints['dataListCurrencies'] = async (
	ctx,
	input,
) => {
	const envelope = await makeCoinbaseRequest('/v2/currencies', ctx.key, {
		schema: DataListCurrenciesOutputSchema,
	});
	await logEventFromContext(
		ctx,
		'coinbase.data.listCurrencies',
		input,
		'completed',
	);
	return envelope;
};

export const getTime: CoinbaseEndpoints['dataGetTime'] = async (ctx, input) => {
	const envelope = await makeCoinbaseRequest('/v2/time', ctx.key, {
		schema: DataEnvelope(DataGetTimeOutputSchema),
	});
	await logEventFromContext(ctx, 'coinbase.data.getTime', input, 'completed');
	return envelope.data;
};
