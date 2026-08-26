import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { auditPayload, countOf } from './logging';
import { bugsnagCall, listParams, withQuery } from './shared';
import type { BugsnagEndpointOutputs } from './types';

/**
 * Feature flags - the flags that were active when an error occurred, which is how a
 * regression gets traced back to a rollout.
 *
 * Not mirrored: a flag's activity is a rolling observation over a release stage, not a
 * record.
 *
 * **Provenance, stated plainly.** Both routes are confirmed live, and both required
 * parameters were established from real responses. The response *field names* were not:
 * the recon account has no feature flags, so the list returned an empty array. They come
 * from documentation, and the schemas are `.loose()` with only the key required so a real
 * response cannot fail to parse. See `schema/responses.ts`.
 *
 * The two collections are separate paths, which is worth spelling out because getting it
 * wrong produces a misleading error rather than a 404:
 *
 * ```
 * projects/{id}/feature_flags           - flags in a release stage
 * projects/{id}/feature_flag_summaries  - summaries
 * ```
 *
 * Recon had the second as `feature_flags/summaries`, which answered
 * `{"errors":["Must supply valid feature flag ID"]}` - because `summaries` was being
 * parsed as a flag id by `feature_flags/{id}`. A 400 complaining about a missing id, on a
 * path that has no id, is the signature of a wrong path rather than a wrong request.
 */

/**
 * Lists the feature flags seen on a project within a release stage.
 *
 * `release_stage_name` is **required**: a flag's activity only means anything inside a
 * stage, and the endpoint will not answer without one.
 */
export const list: BugsnagEndpoints['featureFlagsList'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['featureFlagsList']>(
		ctx,
		withQuery(`projects/${input.project_id}/feature_flags`, {
			...listParams(input),
			release_stage_name: input.release_stage_name,
			q: input.q,
			include_inactive: input.include_inactive,
			include_variant_summary: input.include_variant_summary,
			sort: input.sort,
			direction: input.direction,
		}),
	);

	await logEventFromContext(
		ctx,
		'bugsnag.featureFlags.list',
		{
			...auditPayload(input, [
				'project_id',
				'release_stage_name',
				'per_page',
				'offset',
			]),
			feature_flag_count: countOf(result),
		},
		'completed',
	);
	return result;
};

/**
 * Lists feature flag summaries for a project.
 *
 * Its own collection - `feature_flag_summaries` - and unlike the flag list it needs no
 * release stage.
 */
export const listSummaries: BugsnagEndpoints['featureFlagsListSummaries'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['featureFlagsListSummaries']
		>(
			ctx,
			withQuery(`projects/${input.project_id}/feature_flag_summaries`, {
				...listParams(input),
				q: input.q,
			}),
		);

		await logEventFromContext(
			ctx,
			'bugsnag.featureFlags.listSummaries',
			{
				...auditPayload(input, ['project_id', 'per_page', 'offset']),
				summary_count: countOf(result),
			},
			'completed',
		);
		return result;
	};
