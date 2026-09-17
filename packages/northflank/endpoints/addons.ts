import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNorthflankRequest } from '../client';
import type { NorthflankContext } from '../index';
import type { AddonTypesListInput, AddonTypesListOutput } from './types';
import { AddonTypesListInputSchema, AddonTypesListOutputSchema } from './types';

export type NorthflankEndpoint<TInput, TOutput> = CorsairEndpoint<
	NorthflankContext,
	TInput,
	TOutput
>;

// GET /v1/addon-types — "List available addon types".
// Path corroborated by the Jentic Northflank OpenAPI index and the
// "Get Addon Types endpoint" cross-reference in the create-addon docs;
// no dedicated reference page exists, so the output envelope stays tolerant.
export const list: NorthflankEndpoint<
	AddonTypesListInput,
	AddonTypesListOutput
> = async (ctx, input = {}) => {
	const validatedInput = AddonTypesListInputSchema.parse(input);
	const query: { page?: number; per_page?: number; cursor?: string } = {};
	if (validatedInput?.page !== undefined) query.page = validatedInput.page;
	if (validatedInput?.per_page !== undefined)
		query.per_page = validatedInput.per_page;
	if (validatedInput?.cursor !== undefined)
		query.cursor = validatedInput.cursor;

	const res = await makeNorthflankRequest<AddonTypesListOutput>(
		'addon-types',
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(ctx, 'northflank.addonTypes.list', {}, 'completed');
	return AddonTypesListOutputSchema.parse(res);
};

export const AddonTypesEndpoints = {
	list,
} as const;
