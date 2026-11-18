import { logEventFromContext } from 'corsair/core';
import type { FundableEndpoints } from '..';
import { makeFundableRequest } from '../client';
import type { FundableEndpointOutputs } from './types';
import {
	FundableEndpointInputSchemas,
	FundableEndpointOutputSchemas,
} from './types';

export const post: FundableEndpoints['companies']['post'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		FundableEndpointInputSchemas['companies.post'].parse(input);

	// Docs: POST /companies — https://docs.tryfundable.ai/api-reference/companies/list
	const response = await makeFundableRequest<
		FundableEndpointOutputs['companies.post']
	>('/companies', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});

	const parsed =
		FundableEndpointOutputSchemas['companies.post'].parse(response);

	await logEventFromContext(
		ctx,
		'fundable.companies.post',
		{ count: parsed.data.companies.length },
		'completed',
	);

	return parsed;
};

export const get: FundableEndpoints['companies']['get'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		FundableEndpointInputSchemas['companies.get'].parse(input);

	// Docs: GET /company — https://docs.tryfundable.ai/api-reference/companies/get
	const response = await makeFundableRequest<
		FundableEndpointOutputs['companies.get']
	>('/company', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});

	const parsed = FundableEndpointOutputSchemas['companies.get'].parse(response);

	await logEventFromContext(ctx, 'fundable.companies.get', {}, 'completed');

	return parsed;
};

export const deals: FundableEndpoints['companies']['deals'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		FundableEndpointInputSchemas['companies.deals'].parse(input);

	// Docs: GET /company/deals — https://docs.tryfundable.ai/api-reference/companies/deals
	const response = await makeFundableRequest<
		FundableEndpointOutputs['companies.deals']
	>('/company/deals', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});

	const parsed =
		FundableEndpointOutputSchemas['companies.deals'].parse(response);

	await logEventFromContext(
		ctx,
		'fundable.companies.deals',
		{ count: parsed.data.deals.length },
		'completed',
	);

	return parsed;
};

export const search: FundableEndpoints['companies']['search'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		FundableEndpointInputSchemas['companies.search'].parse(input);

	// Docs: GET /company/search — https://docs.tryfundable.ai/api-reference/companies/search
	const response = await makeFundableRequest<
		FundableEndpointOutputs['companies.search']
	>('/company/search', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});

	const parsed =
		FundableEndpointOutputSchemas['companies.search'].parse(response);

	await logEventFromContext(
		ctx,
		'fundable.companies.search',
		{ count: parsed.data.companies.length },
		'completed',
	);

	return parsed;
};
