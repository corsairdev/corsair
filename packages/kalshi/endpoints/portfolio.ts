import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { KalshiEndpoints } from '..';
import { makeKalshiRequest } from '../client';
import {
	KalshiEndpointInputSchemas,
	KalshiEndpointOutputSchemas,
} from './types';

export const balance: KalshiEndpoints['portfolioBalance'] = async (
	ctx,
	input,
) => {
	const parsed = KalshiEndpointInputSchemas.portfolioBalance.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest('/portfolio/balance', ctx.key, {
		method: 'GET',
		query: parsed,
	});

	await logEventFromContext(
		ctx,
		'kalshi.portfolio.balance',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.portfolioBalance.parse(response);
};

export const positions: KalshiEndpoints['portfolioPositions'] = async (
	ctx,
	input,
) => {
	const parsed = KalshiEndpointInputSchemas.portfolioPositions.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest('/portfolio/positions', ctx.key, {
		method: 'GET',
		query: parsed,
	});

	await logEventFromContext(
		ctx,
		'kalshi.portfolio.positions',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.portfolioPositions.parse(response);
};

export const fills: KalshiEndpoints['portfolioFills'] = async (ctx, input) => {
	const parsed = KalshiEndpointInputSchemas.portfolioFills.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest('/portfolio/fills', ctx.key, {
		method: 'GET',
		query: parsed,
	});

	await logEventFromContext(
		ctx,
		'kalshi.portfolio.fills',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.portfolioFills.parse(response);
};

export const settlements: KalshiEndpoints['portfolioSettlements'] = async (
	ctx,
	input,
) => {
	const parsed = KalshiEndpointInputSchemas.portfolioSettlements.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest('/portfolio/settlements', ctx.key, {
		method: 'GET',
		query: parsed,
	});

	await logEventFromContext(
		ctx,
		'kalshi.portfolio.settlements',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.portfolioSettlements.parse(response);
};

export const Portfolio = {
	balance,
	positions,
	fills,
	settlements,
} as const;
