import { logEventFromContext } from 'corsair/core';
import { makeBetterProposalsRequest } from '../client';
import type { BetterProposalsEndpoints } from '../index';
import type { BetterProposalsEndpointOutputs } from './types';

export const list: BetterProposalsEndpoints['documentTypesList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['documentTypesList']
	>('doctype', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'betterproposals.documentTypes.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: BetterProposalsEndpoints['documentTypesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['documentTypesCreate']
	>('doctype/create', ctx.key, {
		method: 'POST',
		body: input as Record<string, unknown>,
	});

	await logEventFromContext(
		ctx,
		'betterproposals.documentTypes.create',
		{ TypeName: input.TypeName },
		'completed',
	);
	return result;
};
