import { logEventFromContext } from 'corsair/core';
import { makeBetterProposalsRequest } from '../client';
import type { BetterProposalsEndpoints } from '../index';
import type { BetterProposalsEndpointOutputs } from './types';

export const list: BetterProposalsEndpoints['companiesList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['companiesList']
	>('company', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'betterproposals.companies.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: BetterProposalsEndpoints['companiesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['companiesGet']
	>(`company/${input.company_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'betterproposals.companies.get',
		{ company_id: input.company_id },
		'completed',
	);
	return result;
};

export const create: BetterProposalsEndpoints['companiesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['companiesCreate']
	>('company/create', ctx.key, {
		method: 'POST',
		body: input as Record<string, unknown>,
	});

	await logEventFromContext(
		ctx,
		'betterproposals.companies.create',
		{ CompanyName: input.CompanyName },
		'completed',
	);
	return result;
};
