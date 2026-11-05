import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { auditPayload, countOf } from './logging';
import { bugsnagCall, withQuery } from './shared';
import type { BugsnagEndpointOutputs } from './types';

/**
 * Trends - event counts split into time buckets.
 *
 * Not mirrored, and this is the clearest case of the four: a trend is not a record at
 * all. It is a computation over a window, and the same request answered a minute later
 * returns different numbers. Caching one would store an arithmetic result as though it
 * were data.
 *
 * `buckets_count` is **required** - the endpoint answers 400 rather than picking a
 * default - and is bounded above in the input schema so a single call cannot ask for an
 * unbounded series. Verified live: `buckets_count=3` returned three
 * `{from, to, events_count}` buckets.
 *
 * A related response worth knowing about even though it is not a catalog operation:
 * `projects/{id}/stability_trend` answers **204 with no body at all**. So a caller
 * cannot assume every 2xx from this API carries JSON.
 */

/** Retrieves the event-count trend for a project, split into buckets. */
export const projectBuckets: BugsnagEndpoints['trendsProjectBuckets'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<
		BugsnagEndpointOutputs['trendsProjectBuckets']
	>(
		ctx,
		withQuery(
			`projects/${input.project_id}/trend`,
			{ buckets_count: input.buckets_count },
			input.filters,
		),
	);

	await logEventFromContext(
		ctx,
		'bugsnag.trends.projectBuckets',
		{
			...auditPayload(input, ['project_id', 'buckets_count']),
			bucket_count: countOf(result),
			filtered_fields: Object.keys(input.filters ?? {}),
		},
		'completed',
	);
	return result;
};
