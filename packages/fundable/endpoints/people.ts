import { logEventFromContext } from 'corsair/core';
import type { FundableEndpoints } from '..';
import { makeFundableRequest } from '../client';
import type { FundableEndpointOutputs } from './types';
import {
	FundableEndpointInputSchemas,
	FundableEndpointOutputSchemas,
} from './types';

export const post: FundableEndpoints['people']['post'] = async (ctx, input) => {
	const parsedInput = FundableEndpointInputSchemas['people.post'].parse(input);

	// Docs: POST /people — https://docs.tryfundable.ai/api-reference/people/list
	const response = await makeFundableRequest<
		FundableEndpointOutputs['people.post']
	>('/people', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});

	const parsed = FundableEndpointOutputSchemas['people.post'].parse(response);

	await logEventFromContext(
		ctx,
		'fundable.people.post',
		{ count: parsed.data.people.length },
		'completed',
	);

	return parsed;
};

export const get: FundableEndpoints['people']['get'] = async (ctx, input) => {
	const parsedInput = FundableEndpointInputSchemas['people.get'].parse(input);

	// Docs: GET /person — https://docs.tryfundable.ai/api-reference/people/get
	const response = await makeFundableRequest<
		FundableEndpointOutputs['people.get']
	>('/person', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});

	const parsed = FundableEndpointOutputSchemas['people.get'].parse(response);

	await logEventFromContext(ctx, 'fundable.people.get', {}, 'completed');

	return parsed;
};

export const email: FundableEndpoints['people']['email'] = async (
	ctx,
	input,
) => {
	const parsedInput = FundableEndpointInputSchemas['people.email'].parse(input);

	// Docs: GET /person/email — https://docs.tryfundable.ai/api-reference/people/email
	const response = await makeFundableRequest<
		FundableEndpointOutputs['people.email']
	>('/person/email', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});

	const parsed = FundableEndpointOutputSchemas['people.email'].parse(response);

	// The address itself is PII — only the unlock outcome is logged.
	await logEventFromContext(
		ctx,
		'fundable.people.email',
		{ already_unlocked: parsed.data.already_unlocked },
		'completed',
	);

	return parsed;
};

export const phone: FundableEndpoints['people']['phone'] = async (
	ctx,
	input,
) => {
	const parsedInput = FundableEndpointInputSchemas['people.phone'].parse(input);

	// Docs: GET /person/phone — https://docs.tryfundable.ai/api-reference/people/phone
	const response = await makeFundableRequest<
		FundableEndpointOutputs['people.phone']
	>('/person/phone', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});

	const parsed = FundableEndpointOutputSchemas['people.phone'].parse(response);

	// The number itself is PII — only the unlock outcome is logged.
	await logEventFromContext(
		ctx,
		'fundable.people.phone',
		{ already_unlocked: parsed.data.already_unlocked },
		'completed',
	);

	return parsed;
};

export const deals: FundableEndpoints['people']['deals'] = async (
	ctx,
	input,
) => {
	const parsedInput = FundableEndpointInputSchemas['people.deals'].parse(input);

	// Docs: GET /person/deals — https://docs.tryfundable.ai/api-reference/people/deals
	const response = await makeFundableRequest<
		FundableEndpointOutputs['people.deals']
	>('/person/deals', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});

	const parsed = FundableEndpointOutputSchemas['people.deals'].parse(response);

	await logEventFromContext(
		ctx,
		'fundable.people.deals',
		{ count: parsed.data.deals.length },
		'completed',
	);

	return parsed;
};

export const search: FundableEndpoints['people']['search'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		FundableEndpointInputSchemas['people.search'].parse(input);

	// Docs: GET /person/search — https://docs.tryfundable.ai/api-reference/people/search
	const response = await makeFundableRequest<
		FundableEndpointOutputs['people.search']
	>('/person/search', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});

	const parsed = FundableEndpointOutputSchemas['people.search'].parse(response);

	await logEventFromContext(
		ctx,
		'fundable.people.search',
		{ count: parsed.data.people.length },
		'completed',
	);

	return parsed;
};
