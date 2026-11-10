import { gongRequest } from '../client';
import type { GongFamilyContext } from './family-context';
import { gongCredentials } from './family-context';
import type { GongStatsInputs, GongStatsOutputs } from './stats-types';

type GongContext = GongFamilyContext;

async function postStats<K extends keyof GongStatsInputs>(
	ctx: GongContext,
	path: string,
	input: GongStatsInputs[K],
): Promise<GongStatsOutputs[K]> {
	const credentials = gongCredentials(ctx);
	return gongRequest<GongStatsOutputs[K]>({
		baseUrl: ctx.options.baseUrl,
		credentials,
		method: 'POST',
		path,
		body: input,
	});
}

export const listInteractionStats = (
	ctx: GongContext,
	input: GongStatsInputs['listInteractionStats'],
) => postStats<'listInteractionStats'>(ctx, '/v2/stats/interaction', input);

export const listAnsweredScorecards = (
	ctx: GongContext,
	input: GongStatsInputs['listAnsweredScorecards'],
) =>
	postStats<'listAnsweredScorecards'>(
		ctx,
		'/v2/stats/activity/scorecards',
		input,
	);

export const listMultipleUsersDayByDayActivity = (
	ctx: GongContext,
	input: GongStatsInputs['listMultipleUsersDayByDayActivity'],
) =>
	postStats<'listMultipleUsersDayByDayActivity'>(
		ctx,
		'/v2/stats/activity/day-by-day',
		input,
	);

export const listMultipleUsersAggregateActivity = (
	ctx: GongContext,
	input: GongStatsInputs['listMultipleUsersAggregateActivity'],
) =>
	postStats<'listMultipleUsersAggregateActivity'>(
		ctx,
		'/v2/stats/activity/aggregate',
		input,
	);

export const listMultipleUsersAggregateByPeriod = (
	ctx: GongContext,
	input: GongStatsInputs['listMultipleUsersAggregateByPeriod'],
) =>
	postStats<'listMultipleUsersAggregateByPeriod'>(
		ctx,
		'/v2/stats/activity/aggregate-by-period',
		input,
	);
