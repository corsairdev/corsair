import { logEventFromContext } from 'corsair/core';
import { makeBetterProposalsRequest } from '../client';
import type { BetterProposalsEndpoints } from '../index';
import type { BetterProposalsEndpointOutputs } from './types';

export const list: BetterProposalsEndpoints['quotesList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['quotesList']
	>('quote', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'betterproposals.quotes.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: BetterProposalsEndpoints['quotesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['quotesGet']
	>(`quote/${input.quote_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'betterproposals.quotes.get',
		{ quote_id: input.quote_id },
		'completed',
	);
	return result;
};
