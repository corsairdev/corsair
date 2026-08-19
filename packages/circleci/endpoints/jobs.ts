import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { auditPayload } from './logging';
import { circleCIV1Call, jobByNumberPath } from './shared';
import type { CircleCIEndpointOutputs } from './types';

/**
 * The three "by job number" operations, all on the legacy v1.1 API - the only
 * transport that resolves a job by its plain number rather than a v2/v3 UUID.
 * See `client.ts` and `types.ts` for why.
 *
 * **The raw v1.1 response carries `all_commit_details[].author_email`** - the
 * triggering commit author's real email address, confirmed live on this
 * account's own job history. `getDetails` below deletes that field explicitly
 * before returning.
 *
 * This is not something `JobDetailsSchema`'s narrower declaration achieves on
 * its own, and an earlier version of this file wrongly assumed it did: every
 * entity in this plugin is `.loose()` by house convention, so an undeclared
 * field is **not stripped** by parsing - it passes straight through. A test
 * asserting the email never reaches the caller caught this: the schema
 * documents the shape this plugin relies on, but only code can guarantee a
 * field is actually removed.
 */

/** Fetches a job's status, timing and executor by its number. */
export const getDetails: CircleCIEndpoints['jobsGetDetails'] = async (
	ctx,
	input,
) => {
	const raw = await circleCIV1Call<Record<string, unknown>>(
		ctx,
		jobByNumberPath(input),
	);
	// Destructured out rather than deleted: this produces a genuinely new
	// object with the key absent, not merely set to `undefined` on the
	// original - a stronger guarantee for a field this sensitive.
	const { all_commit_details: _omitted, ...rest } = raw;
	const result = rest as CircleCIEndpointOutputs['jobsGetDetails'];

	await logEventFromContext(
		ctx,
		'circleci.jobs.getDetails',
		auditPayload(input, ['vcsType', 'username', 'project', 'buildNumber']),
		'completed',
	);
	return result;
};

/** Lists a job's stored artifacts, with their download URLs. */
export const getArtifacts: CircleCIEndpoints['jobsGetArtifacts'] = async (
	ctx,
	input,
) => {
	const result = await circleCIV1Call<
		CircleCIEndpointOutputs['jobsGetArtifacts']
	>(ctx, `${jobByNumberPath(input)}/artifacts`);

	await logEventFromContext(
		ctx,
		'circleci.jobs.getArtifacts',
		{
			...auditPayload(input, ['vcsType', 'username', 'project', 'buildNumber']),
			returned: result.length,
		},
		'completed',
	);
	return result;
};

/** Fetches a job's stored test results. */
export const getTestMetadata: CircleCIEndpoints['jobsGetTestMetadata'] = async (
	ctx,
	input,
) => {
	const result = await circleCIV1Call<{
		tests: CircleCIEndpointOutputs['jobsGetTestMetadata'];
	}>(ctx, `${jobByNumberPath(input)}/tests`);

	await logEventFromContext(
		ctx,
		'circleci.jobs.getTestMetadata',
		{
			...auditPayload(input, ['vcsType', 'username', 'project', 'buildNumber']),
			returned: result.tests.length,
		},
		'completed',
	);
	return result.tests;
};
