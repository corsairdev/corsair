import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNorthflankRequest } from '../client';
import type { NorthflankContext } from '../index';
import type { RegionsListInput, RegionsListOutput } from './types';

export type NorthflankEndpoint<TInput, TOutput> = CorsairEndpoint<
	NorthflankContext,
	TInput,
	TOutput
>;

export const list: NorthflankEndpoint<
	RegionsListInput,
	RegionsListOutput
> = async (ctx) => {
	const res = await makeNorthflankRequest<RegionsListOutput>(
		'regions',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'northflank.regions.list', {}, 'completed');

	return res;
};

export const RegionsEndpoints = {
	list,
} as const;
