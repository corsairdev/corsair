import { logEventFromContext } from 'corsair/core';
import type { BetterContactEndpoints } from '..';
import { makeBetterContactRequest } from '../client';
import type { BetterContactEndpointOutputs } from './types';

export const enrich: BetterContactEndpoints['enrichmentEnrich'] = async (
	ctx,
	input,
) => {
	const response = await makeBetterContactRequest<
		BetterContactEndpointOutputs['enrichmentEnrich']
	>('async', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'bettercontact.enrichment.enrich',
		{ ...input },
		'completed',
	);
	return response;
};

export const getResults: BetterContactEndpoints['enrichmentGetResults'] =
	async (ctx, input) => {
		const response = await makeBetterContactRequest<
			BetterContactEndpointOutputs['enrichmentGetResults']
		>(`async/${input.request_id}`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'bettercontact.enrichment.getResults',
			{ ...input },
			'completed',
		);
		return response;
	};
