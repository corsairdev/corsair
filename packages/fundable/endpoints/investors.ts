import { logEventFromContext } from 'corsair/core';
import type { FundableEndpoints } from '..';
import { makeFundableRequest } from '../client';
import type { FundableEndpointOutputs } from './types';
import {
	FundableEndpointInputSchemas,
	FundableEndpointOutputSchemas,
} from './types';

export const post: FundableEndpoints['investors']['post'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		FundableEndpointInputSchemas['investors.post'].parse(input);

	// Docs: POST /investors — https://docs.tryfundable.ai/api-reference/investors/list
	const response = await makeFundableRequest<
		FundableEndpointOutputs['investors.post']
	>('/investors', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});

	const parsed =
		FundableEndpointOutputSchemas['investors.post'].parse(response);

	await logEventFromContext(
		ctx,
		'fundable.investors.post',
		{ count: parsed.data.investors.length },
		'completed',
	);

	return parsed;
};

export const get: FundableEndpoints['investors']['get'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		FundableEndpointInputSchemas['investors.get'].parse(input);

	// Docs: GET /investor — https://docs.tryfundable.ai/api-reference/investors/get
	const response = await makeFundableRequest<
		FundableEndpointOutputs['investors.get']
	>('/investor', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});

	const parsed = FundableEndpointOutputSchemas['investors.get'].parse(response);

	await logEventFromContext(ctx, 'fundable.investors.get', {}, 'completed');

	return parsed;
};

export const deals: FundableEndpoints['investors']['deals'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		FundableEndpointInputSchemas['investors.deals'].parse(input);

	// Docs: GET /investor/deals — https://docs.tryfundable.ai/api-reference/investors/deals
	const response = await makeFundableRequest<
		FundableEndpointOutputs['investors.deals']
	>('/investor/deals', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});

	const parsed =
		FundableEndpointOutputSchemas['investors.deals'].parse(response);

	await logEventFromContext(
		ctx,
		'fundable.investors.deals',
		{ count: parsed.data.deals.length },
		'completed',
	);

	return parsed;
};

export const search: FundableEndpoints['investors']['search'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		FundableEndpointInputSchemas['investors.search'].parse(input);

	// Docs: GET /investor/search — https://docs.tryfundable.ai/api-reference/investors/search
	const response = await makeFundableRequest<
		FundableEndpointOutputs['investors.search']
	>('/investor/search', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});

	const parsed =
		FundableEndpointOutputSchemas['investors.search'].parse(response);

	await logEventFromContext(
		ctx,
		'fundable.investors.search',
		{ count: parsed.data.investors.length },
		'completed',
	);

	return parsed;
};
