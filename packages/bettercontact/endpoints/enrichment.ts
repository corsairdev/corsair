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
		{
			record_count: input.data.length,
			enrich_email_address: input.enrich_email_address,
			enrich_phone_number: input.enrich_phone_number,
			enrich_profile: input.enrich_profile,
			verify_catch_all: input.verify_catch_all,
		},
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
