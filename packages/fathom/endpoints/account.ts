import { logEventFromContext } from 'corsair/core';
import type { FathomEndpoints } from '..';
import { makeFathomRequest } from '../client';
import type { FathomEndpointOutputs } from './types';
import {
	FathomEndpointInputSchemas,
	FathomEndpointOutputSchemas,
} from './types';

export const get: FathomEndpoints['account.get'] = async (ctx, input) => {
	FathomEndpointInputSchemas['account.get'].parse(input);

	const response = await makeFathomRequest<
		FathomEndpointOutputs['account.get']
	>('/account', ctx.key, { method: 'GET' });

	const parsedResponse =
		FathomEndpointOutputSchemas['account.get'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.account.get',
		{ has_account: Boolean(parsedResponse.id) },
		'completed',
	);

	return parsedResponse;
};

export const getToken: FathomEndpoints['account.getToken'] = async (
	ctx,
	input,
) => {
	FathomEndpointInputSchemas['account.getToken'].parse(input);

	const response = await makeFathomRequest<
		FathomEndpointOutputs['account.getToken']
	>('/token', ctx.key, { method: 'GET' });

	const parsedResponse =
		FathomEndpointOutputSchemas['account.getToken'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.account.getToken',
		{ token_name: parsedResponse.name },
		'completed',
	);

	return parsedResponse;
};
