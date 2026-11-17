import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import { makeHandwryttenRequest } from '../client';
import type { GiftCardsListResponse } from './types';
import {
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
} from './types';

export const list: HandwryttenEndpoints['giftCards.list'] = async (
	ctx,
	input,
) => {
	HandwryttenEndpointInputSchemas['giftCards.list'].parse(input);
	const response = await makeHandwryttenRequest<GiftCardsListResponse>(
		'/giftCards/list',
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['giftCards.list'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.giftCards.list',
		{ count: parsed.gcards?.length ?? 0 },
		'completed',
	);
	return parsed;
};
