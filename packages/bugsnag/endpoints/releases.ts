import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { auditPayload, countOf } from './logging';
import { bugsnagCall, listParams, withQuery } from './shared';
import type { BugsnagEndpointOutputs } from './types';

/**
 * Releases - the deployed versions of an application, and the groups they fall into.
 *
 * Not mirrored. A release is an append-only historical record, but its counters
 * (`sessions_count_in_last_24h`, `accumulative_daily_users_seen`,
 * `errors_seen_count`) keep moving after it is created, so a cached row would be a
 * snapshot presenting itself as a record. Both were verified live against seeded
 * release data.
 *
 * The catalog notes releases need a paid subscription. On the recon account - a free
 * one - both operations answered 200 with real rows, so the note may be out of date or
 * apply to a different capability. Recorded as observed.
 */

/** Lists the releases of a project. */
export const list: BugsnagEndpoints['releasesList'] = async (ctx, input) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['releasesList']>(
		ctx,
		withQuery(`projects/${input.project_id}/releases`, {
			...listParams(input),
			release_stage: input.release_stage,
			base: input.base,
			sort: input.sort,
		}),
	);

	await logEventFromContext(
		ctx,
		'bugsnag.releases.list',
		{
			...auditPayload(input, ['project_id', 'per_page', 'offset']),
			release_count: countOf(result),
		},
		'completed',
	);
	return result;
};

/**
 * Lists the release groups of a project - releases sharing an app version within one
 * release stage.
 *
 * `release_stage_name` is **required**, which is the asymmetry to remember: the release
 * list takes an optional `release_stage`, while this one refuses to answer without a
 * stage name at all. Verified live -
 * `{"errors":["release_stage_name can't be blank"]}` without it, 200 with it. The input
 * schema requires it rather than spending a round-trip to be told, and it is also the
 * error the `VALIDATION_ERROR` handler's comment cites as an example.
 */
export const listGroups: BugsnagEndpoints['releasesListGroups'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<
		BugsnagEndpointOutputs['releasesListGroups']
	>(
		ctx,
		withQuery(`projects/${input.project_id}/release_groups`, {
			...listParams(input),
			release_stage_name: input.release_stage_name,
			sort: input.sort,
			top_only: input.top_only,
		}),
	);

	await logEventFromContext(
		ctx,
		'bugsnag.releases.listGroups',
		{
			...auditPayload(input, [
				'project_id',
				'release_stage_name',
				'per_page',
				'offset',
			]),
			release_group_count: countOf(result),
		},
		'completed',
	);
	return result;
};
