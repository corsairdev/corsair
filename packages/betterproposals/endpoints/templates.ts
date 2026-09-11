import { logEventFromContext } from 'corsair/core';
import { makeBetterProposalsRequest } from '../client';
import type { BetterProposalsEndpoints } from '../index';
import type { BetterProposalsEndpointOutputs } from './types';

export const list: BetterProposalsEndpoints['templatesList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['templatesList']
	>('template', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'betterproposals.templates.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: BetterProposalsEndpoints['templatesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterProposalsRequest<
		BetterProposalsEndpointOutputs['templatesGet']
	>(`template/${input.template_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'betterproposals.templates.get',
		{ template_id: input.template_id },
		'completed',
	);
	return result;
};
