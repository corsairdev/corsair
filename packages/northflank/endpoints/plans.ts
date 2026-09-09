import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNorthflankRequest } from '../client';
import type { NorthflankContext } from '../index';
import type { PlansListInput, PlansListOutput } from './types';
import { PlansListInputSchema, PlansListOutputSchema } from './types';

export type NorthflankEndpoint<TInput, TOutput> = CorsairEndpoint<
	NorthflankContext,
	TInput,
	TOutput
>;

export const list: NorthflankEndpoint<PlansListInput, PlansListOutput> = async (
	ctx,
	input = {},
) => {
	const validatedInput = PlansListInputSchema.parse(input);
	const query: Record<string, unknown> = {};
	if (validatedInput?.page !== undefined) query.page = validatedInput.page;
	if (validatedInput?.per_page !== undefined)
		query.per_page = validatedInput.per_page;
	if (validatedInput?.cursor !== undefined)
		query.cursor = validatedInput.cursor;

	const res = await makeNorthflankRequest<unknown>('plans', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(ctx, 'northflank.plans.list', {}, 'completed');
	return PlansListOutputSchema.parse(res);
};

export const PlansEndpoints = {
	list,
} as const;
