import { logEventFromContext } from 'corsair/core';
import type { LodgifyEndpoints } from '..';
import { makeLodgifyRequest } from '../client';
import {
	LodgifyEndpointInputSchemas,
	LodgifyEndpointOutputSchemas,
} from './types';

export const countriesList: LodgifyEndpoints['countries.list'] = async (
	ctx,
	input,
) => {
	LodgifyEndpointInputSchemas['countries.list'].parse(input);
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest('/v1/countries', ctx.key, {
		method: 'GET',
	});
	const parsed = LodgifyEndpointOutputSchemas['countries.list'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.countries.list',
		{ count: parsed.length },
		'completed',
	);
	return parsed;
};

export const countryGet: LodgifyEndpoints['countries.get'] = async (
	ctx,
	input,
) => {
	const parsedInput = LodgifyEndpointInputSchemas['countries.get'].parse(input);
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		`/v1/countries/${encodeURIComponent(parsedInput.code)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = LodgifyEndpointOutputSchemas['countries.get'].parse(response);
	await logEventFromContext(ctx, 'lodgify.countries.get', {}, 'completed');
	return parsed;
};

export const currenciesList: LodgifyEndpoints['currencies.list'] = async (
	ctx,
	input,
) => {
	LodgifyEndpointInputSchemas['currencies.list'].parse(input);
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		'/v1/currencies',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		LodgifyEndpointOutputSchemas['currencies.list'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.currencies.list',
		{ count: parsed.length },
		'completed',
	);
	return parsed;
};

export const currencyGet: LodgifyEndpoints['currencies.get'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['currencies.get'].parse(input);
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		`/v1/currencies/${encodeURIComponent(parsedInput.code)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = LodgifyEndpointOutputSchemas['currencies.get'].parse(response);
	await logEventFromContext(ctx, 'lodgify.currencies.get', {}, 'completed');
	return parsed;
};
