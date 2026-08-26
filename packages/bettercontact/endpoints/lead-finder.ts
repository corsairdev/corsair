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
		{
			limit: input.limit,
			offset: input.offset,
			max_leads: input.max_leads,
			enrich_email_address: input.enrich_email_address,
			enrich_phone_number: input.enrich_phone_number,
			has_filters: Boolean(
				input.filters && Object.keys(input.filters).length > 0,
			),
		},
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
