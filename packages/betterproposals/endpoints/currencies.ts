import { logEventFromContext } from 'corsair/core';
import { makeBetterProposalsRequest } from '../client';
import type { BetterProposalsEndpoints } from '../index';
import type { BetterProposalsEndpointOutputs } from './types';

export const list: BetterProposalsEndpoints['currenciesList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['currenciesList']
	>('currency', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'betterproposals.currencies.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: BetterProposalsEndpoints['currenciesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['currenciesGet']
	>(`currency/${input.currency_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'betterproposals.currencies.get',
		{ currency_id: input.currency_id },
		'completed',
	);
	return result;
};
