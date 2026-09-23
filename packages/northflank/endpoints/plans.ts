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

// GET /v1/plans
// Docs: /docs/v1/api/miscellaneous/list-plans
export const list: NorthflankEndpoint<PlansListInput, PlansListOutput> = async (
	ctx,
	input = {},
) => {
	const validatedInput = PlansListInputSchema.parse(input);
	const query: { page?: number; per_page?: number; cursor?: string } = {};
	if (validatedInput?.page !== undefined) query.page = validatedInput.page;
	if (validatedInput?.per_page !== undefined)
		query.per_page = validatedInput.per_page;
	if (validatedInput?.cursor !== undefined)
		query.cursor = validatedInput.cursor;

	const res = await makeNorthflankRequest<PlansListOutput>('plans', ctx.key, {
		method: 'GET',
		query,
	});

	const parsedPlans = PlansListOutputSchema.parse(res);
	await logEventFromContext(ctx, 'northflank.plans.list', {}, 'completed');
	return parsedPlans;
};

export const PlansEndpoints = {
	list,
} as const;
