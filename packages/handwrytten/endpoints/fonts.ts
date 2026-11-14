import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import { makeHandwryttenRequest } from '../client';
import type { FontsListResponse } from './types';
import {
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
} from './types';

export const list: HandwryttenEndpoints['fonts.list'] = async (ctx, input) => {
	HandwryttenEndpointInputSchemas['fonts.list'].parse(input);
	const response = await makeHandwryttenRequest<FontsListResponse>(
		'/fonts/list',
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = HandwryttenEndpointOutputSchemas['fonts.list'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.fonts.list',
		{ count: parsed.fonts?.length ?? 0 },
		'completed',
	);
	return parsed;
};
