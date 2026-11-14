import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import { makeHandwryttenRequest } from '../client';
import type { InsertsListResponse } from './types';
import {
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
} from './types';

export const list: HandwryttenEndpoints['inserts.list'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['inserts.list'].parse(input);
	const response = await makeHandwryttenRequest<InsertsListResponse>(
		'/inserts/list',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['inserts.list'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.inserts.list',
		{ count: parsed.inserts?.length ?? 0 },
		'completed',
	);
	return parsed;
};
