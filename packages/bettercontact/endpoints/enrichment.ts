import { logEventFromContext } from 'corsair/core';
import type { BetterContactEndpoints } from '..';
import { makeBetterContactRequest } from '../client';
import { BetterContactEndpointOutputSchemas } from './types';

export const enrich: BetterContactEndpoints['enrichmentEnrich'] = async (
	ctx,
	input,
) => {
	const raw = await makeBetterContactRequest<unknown>('async', ctx.key, {
		method: 'POST',
		body: input,
	});

	const response =
		BetterContactEndpointOutputSchemas.enrichmentEnrich.parse(raw);

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
		const raw = await makeBetterContactRequest<unknown>(
			`async/${input.request_id}`,
			ctx.key,
			{ method: 'GET' },
		);

		const response =
			BetterContactEndpointOutputSchemas.enrichmentGetResults.parse(raw);

		await logEventFromContext(
			ctx,
			'bettercontact.enrichment.getResults',
			{ ...input },
			'completed',
		);
		return response;
	};
