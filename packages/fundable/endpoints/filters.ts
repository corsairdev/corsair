import { logEventFromContext } from 'corsair/core';
import type { FundableEndpoints } from '..';
import { makeFundableRequest } from '../client';
import type { FundableEndpointOutputs } from './types';
import {
	FundableEndpointInputSchemas,
	FundableEndpointOutputSchemas,
} from './types';

export const locations: FundableEndpoints['filters']['locations'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		FundableEndpointInputSchemas['filters.locations'].parse(input);

	// Docs: GET /location/search — https://docs.tryfundable.ai/api-reference/locations/search
	const response = await makeFundableRequest<
		FundableEndpointOutputs['filters.locations']
	>('/location/search', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});

	const parsed =
		FundableEndpointOutputSchemas['filters.locations'].parse(response);

	await logEventFromContext(
		ctx,
		'fundable.filters.locations',
		{ count: parsed.data.locations.length },
		'completed',
	);

	return parsed;
};

export const industries: FundableEndpoints['filters']['industries'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		FundableEndpointInputSchemas['filters.industries'].parse(input);

	// Docs: GET /industry/search — https://docs.tryfundable.ai/api-reference/industries/search
	const response = await makeFundableRequest<
		FundableEndpointOutputs['filters.industries']
	>('/industry/search', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});

	const parsed =
		FundableEndpointOutputSchemas['filters.industries'].parse(response);

	await logEventFromContext(
		ctx,
		'fundable.filters.industries',
		{ count: parsed.data.industries.length },
		'completed',
	);

	return parsed;
};
