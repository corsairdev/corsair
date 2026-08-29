import { logEventFromContext } from 'corsair/core';
import type { CapsuleCrmEndpoints } from '..';
import type { CapsuleCrmEndpointOutputs } from './types';
import { makeCapsuleCrmRequest } from '../client';

export const partyGet: CapsuleCrmEndpoints['partyGet'] = async (
	ctx,
	input,
) => {
	const response = await makeCapsuleCrmRequest<
		CapsuleCrmEndpointOutputs['partyGet']
	>(`parties/${input.id}`, ctx.key);

	await logEventFromContext(
		ctx,
		'capsulecrm.party.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const opportunityGet: CapsuleCrmEndpoints['opportunityGet'] =
	async (ctx, input) => {
		const response = await makeCapsuleCrmRequest<
			CapsuleCrmEndpointOutputs['opportunityGet']
		>(`opportunities/${input.id}`, ctx.key);

		await logEventFromContext(
			ctx,
			'capsulecrm.opportunity.get',
			{ ...input },
			'completed',
		);

		return response;
	};

export const projectGet: CapsuleCrmEndpoints['projectGet'] = async (
	ctx,
	input,
) => {
	const response = await makeCapsuleCrmRequest<
		CapsuleCrmEndpointOutputs['projectGet']
	>(`kases/${input.id}`, ctx.key);

	await logEventFromContext(
		ctx,
		'capsulecrm.project.get',
		{ ...input },
		'completed',
	);

	return response;
};