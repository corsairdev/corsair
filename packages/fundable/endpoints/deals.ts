import { logEventFromContext } from 'corsair/core';
import type { FundableEndpoints } from '..';
import { makeFundableRequest } from '../client';
import type { FundableEndpointOutputs } from './types';
import {
	FundableEndpointInputSchemas,
	FundableEndpointOutputSchemas,
} from './types';

export const post: FundableEndpoints['deals']['post'] = async (ctx, input) => {
	const parsedInput = FundableEndpointInputSchemas['deals.post'].parse(input);

	// Docs: POST /deals — https://docs.tryfundable.ai/api-reference/deals/list
	const response = await makeFundableRequest<
		FundableEndpointOutputs['deals.post']
	>('/deals', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});

	const parsed = FundableEndpointOutputSchemas['deals.post'].parse(response);

	await logEventFromContext(
		ctx,
		'fundable.deals.post',
		{ count: parsed.data.deals.length },
		'completed',
	);

	return parsed;
};

export const get: FundableEndpoints['deals']['get'] = async (ctx, input) => {
	const parsedInput = FundableEndpointInputSchemas['deals.get'].parse(input);

	// Docs: GET /deals/{id} — https://docs.tryfundable.ai/api-reference/deals/get
	const response = await makeFundableRequest<
		FundableEndpointOutputs['deals.get']
	>(`/deals/${parsedInput.id}`, ctx.key, {
		method: 'GET',
	});

	const parsed = FundableEndpointOutputSchemas['deals.get'].parse(response);

	await logEventFromContext(ctx, 'fundable.deals.get', {}, 'completed');

	return parsed;
};

export const investors: FundableEndpoints['deals']['investors'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		FundableEndpointInputSchemas['deals.investors'].parse(input);

	// Docs: GET /deals/{id}/investors — https://docs.tryfundable.ai/api-reference/deals/investors
	const response = await makeFundableRequest<
		FundableEndpointOutputs['deals.investors']
	>(`/deals/${parsedInput.id}/investors`, ctx.key, {
		method: 'GET',
	});

	const parsed =
		FundableEndpointOutputSchemas['deals.investors'].parse(response);

	await logEventFromContext(
		ctx,
		'fundable.deals.investors',
		{
			investor_count: parsed.data.investors.length,
			angel_count: parsed.data.angel_investors.length,
		},
		'completed',
	);

	return parsed;
};
