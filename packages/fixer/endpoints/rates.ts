import { logEventFromContext } from 'corsair/core';
import type { FixerEndpoints } from '..';
import { makeFixerRequest } from '../client';
import type { FixerEndpointOutputs } from './types';

export const latest: FixerEndpoints['ratesLatest'] = async (ctx, input) => {
	const response = await makeFixerRequest<FixerEndpointOutputs['ratesLatest']>(
		'latest',
		ctx.key,
		{
			method: 'GET',
			query: {
				base: input.base,
				symbols: input.symbols?.join(','),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'fixer.rates.latest',
		{
			base: input.base ?? 'EUR',
			symbols: input.symbols,
		},
		'completed',
	);

	return response;
};

export const convert: FixerEndpoints['ratesConvert'] = async (ctx, input) => {
	const response = await makeFixerRequest<FixerEndpointOutputs['ratesConvert']>(
		'convert',
		ctx.key,
		{
			method: 'GET',
			query: {
				from: input.from,
				to: input.to,
				amount: input.amount,
				date: input.date,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'fixer.rates.convert',
		{
			from: input.from,
			to: input.to,
			amount: input.amount,
		},
		'completed',
	);

	return response;
};

export const historical: FixerEndpoints['ratesHistorical'] = async (
	ctx,
	input,
) => {
	const response = await makeFixerRequest<
		FixerEndpointOutputs['ratesHistorical']
	>(input.date, ctx.key, {
		method: 'GET',
		query: {
			base: input.base,
			symbols: input.symbols?.join(','),
		},
	});

	await logEventFromContext(
		ctx,
		'fixer.rates.historical',
		{
			date: input.date,
			base: input.base ?? 'EUR',
			symbols: input.symbols,
		},
		'completed',
	);

	return response;
};
