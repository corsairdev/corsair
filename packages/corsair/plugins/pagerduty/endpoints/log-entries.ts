import { logEventFromContext } from '../../utils/events';
import type { PagerdutyEndpoints } from '..';
import { makePagerdutyRequest } from '../client';
import type { PagerdutyEndpointOutputs } from './types';

export const get: PagerdutyEndpoints['logEntriesGet'] = async (ctx, input) => {
	const result = await makePagerdutyRequest<PagerdutyEndpointOutputs['logEntriesGet']>(
		`log_entries/${input.id}`,
		ctx.key,
		{
			query: {
				...(input.include && { 'include[]': input.include.join(',') }),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'pagerduty.logEntries.get',
		{ id: input.id },
		'completed',
	);
	return result;
};

export const list: PagerdutyEndpoints['logEntriesList'] = async (ctx, input) => {
	const result = await makePagerdutyRequest<PagerdutyEndpointOutputs['logEntriesList']>(
		'log_entries',
		ctx.key,
		{
			query: {
				limit: input.limit,
				offset: input.offset,
				since: input.since,
				until: input.until,
				is_overview: input.is_overview,
				...(input.include && { 'include[]': input.include.join(',') }),
				...(input.team_ids && { 'team_ids[]': input.team_ids.join(',') }),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'pagerduty.logEntries.list',
		{ limit: input.limit, offset: input.offset },
		'completed',
	);
	return result;
};
