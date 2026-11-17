import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { KalshiEndpoints } from '..';
import { makeKalshiRequest } from '../client';
import {
	KalshiEndpointInputSchemas,
	KalshiEndpointOutputSchemas,
} from './types';

export const status: KalshiEndpoints['exchangeStatus'] = async (ctx, input) => {
	const parsed = KalshiEndpointInputSchemas.exchangeStatus.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest('/exchange/status', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'kalshi.exchange.status',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.exchangeStatus.parse(response);
};

export const schedule: KalshiEndpoints['exchangeSchedule'] = async (
	ctx,
	input,
) => {
	const parsed = KalshiEndpointInputSchemas.exchangeSchedule.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest('/exchange/schedule', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'kalshi.exchange.schedule',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.exchangeSchedule.parse(response);
};

export const Exchange = {
	status,
	schedule,
} as const;
