import { logEventFromContext } from 'corsair/core';
import type { BetterContactEndpoints } from '..';
import { makeBetterContactRequest } from '../client';
import type { BetterContactEndpointOutputs } from './types';

export const create: BetterContactEndpoints['leadFinderCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeBetterContactRequest<
		BetterContactEndpointOutputs['leadFinderCreate']
	>('lead_finder/async', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'bettercontact.leadFinder.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const getResults: BetterContactEndpoints['leadFinderGetResults'] =
	async (ctx, input) => {
		const response = await makeBetterContactRequest<
			BetterContactEndpointOutputs['leadFinderGetResults']
		>(`lead_finder/async/${input.request_id}`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'bettercontact.leadFinder.getResults',
			{ ...input },
			'completed',
		);
		return response;
	};
