import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { auditPayload, countOf } from './logging';
import { bugsnagCall, listParams, withQuery } from './shared';
import type { BugsnagEndpointOutputs } from './types';

/**
 * Pivots - how events distribute across the values of a field.
 *
 * Not mirrored: a pivot value is an aggregate over a window, so caching one stores a
 * proportion that was true at the moment it was read.
 *
 * A privacy note that is easy to miss. A pivot is a *grouping*, so the values it
 * returns are the raw values of the field being grouped on - and the pivotable fields
 * include `user.id`, `user.email` and `user.name`. A pivot on `user.email` therefore
 * returns a list of end-user email addresses with counts. Confirmed live: pivoting on
 * `user.id` returned `event_field_value: "user-1"`. Nothing from a response is logged.
 */

/**
 * Lists the pivot definitions available on a project.
 *
 * A pivot has **no `id` field**. It is identified by `event_field_display_id`, and
 * getting that wrong is how the values path was mis-mapped during recon: passing the
 * human-readable `name` ("Events") returned `{"errors":["Pivot Value not found"]}` -
 * the resource-missing envelope, which says the path was right and looked like a
 * missing record rather than a wrong key.
 */
export const list: BugsnagEndpoints['pivotsList'] = async (ctx, input) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['pivotsList']>(
		ctx,
		withQuery(
			`projects/${input.project_id}/pivots`,
			{
				...listParams(input),
				pivots: input.pivots,
				summary_size: input.summary_size,
			},
			input.filters,
		),
	);

	await logEventFromContext(
		ctx,
		'bugsnag.pivots.list',
		{
			...auditPayload(input, ['project_id', 'per_page', 'offset']),
			pivot_count: countOf(result),
			filtered_fields: Object.keys(input.filters ?? {}),
		},
		'completed',
	);
	return result;
};

/**
 * Lists the values of one pivot, with each value's share of events.
 *
 * Addressed by `event_field_display_id` - see above.
 *
 * **Not every pivot has values.** Confirmed live: `pivots/error/values` and
 * `pivots/user.id/values` returned rows while `pivots/event/values` returned the
 * resource-missing 404, on the same project at the same moment. So a 404 here is an
 * ordinary outcome for a pivot with nothing to report, not necessarily a bad request -
 * which is why `NOT_FOUND_ERROR` distinguishes the two envelopes rather than reporting
 * both as "not found".
 *
 * The field display id is recorded in the audit payload but the returned values are
 * not: on a pivot over `user.email` those values are personal data.
 */
export const values: BugsnagEndpoints['pivotsValues'] = async (ctx, input) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['pivotsValues']>(
		ctx,
		withQuery(
			`projects/${input.project_id}/pivots/${encodeURIComponent(input.event_field_display_id)}/values`,
			{ ...listParams(input), base: input.base, sort: input.sort },
			input.filters,
		),
	);

	await logEventFromContext(
		ctx,
		'bugsnag.pivots.values',
		{
			...auditPayload(input, [
				'project_id',
				'event_field_display_id',
				'per_page',
				'offset',
			]),
			value_count: countOf(result),
			filtered_fields: Object.keys(input.filters ?? {}),
		},
		'completed',
	);
	return result;
};
