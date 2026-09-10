import { logEventFromContext } from 'corsair/core';
import type { BetterContactEndpoints } from '..';
import { makeBetterContactRequest } from '../client';
import { BetterContactEndpointOutputSchemas } from './types';

export const create: BetterContactEndpoints['leadFinderCreate'] = async (
	ctx,
	input,
) => {
	const raw = await makeBetterContactRequest<unknown>(
		'lead_finder/async',
		ctx.key,
		{ method: 'POST', body: input },
	);

	const response =
		BetterContactEndpointOutputSchemas.leadFinderCreate.parse(raw);

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
		const raw = await makeBetterContactRequest<unknown>(
			`lead_finder/async/${input.request_id}`,
			ctx.key,
			{ method: 'GET' },
		);

		const response =
			BetterContactEndpointOutputSchemas.leadFinderGetResults.parse(raw);

		await logEventFromContext(
			ctx,
			'bettercontact.leadFinder.getResults',
			{ ...input },
			'completed',
		);
		return response;
	};
