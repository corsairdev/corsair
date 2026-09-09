import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNorthflankRequest } from '../client';
import type { NorthflankContext } from '../index';
import type { PlansListInput, PlansListOutput } from './types';

export type NorthflankEndpoint<TInput, TOutput> = CorsairEndpoint<
	NorthflankContext,
	TInput,
	TOutput
>;

export const list: NorthflankEndpoint<PlansListInput, PlansListOutput> = async (
	ctx,
	input = {},
) => {
	const query: Record<string, unknown> = {};
	if (input?.page !== undefined) query.page = input.page;
	if (input?.per_page !== undefined) query.per_page = input.per_page;
	if (input?.cursor !== undefined) query.cursor = input.cursor;

	const res = await makeNorthflankRequest<PlansListOutput>('plans', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(ctx, 'northflank.plans.list', {}, 'completed');

	return res;
};

export const PlansEndpoints = {
	list,
} as const;
