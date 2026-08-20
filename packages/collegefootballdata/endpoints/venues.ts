import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { cacheVenue } from './persist';
import { collegeFootballDataCall } from './shared';
import type { CollegeFootballDataVenue } from './types';

/** Lists venues with metadata (capacity, location, surface, roof). */
export const list: CollegeFootballDataEndpoints['venuesList'] = async (ctx) => {
	const result = await collegeFootballDataCall<CollegeFootballDataVenue[]>(
		ctx,
		'/venues',
	);

	await Promise.all(
		(result ?? []).map((venue) => cacheVenue(ctx.db?.venues, venue)),
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.venues.list',
		{},
		'completed',
	);
	return result ?? [];
};
