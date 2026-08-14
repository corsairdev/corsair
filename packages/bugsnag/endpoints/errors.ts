import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { deleteAndEvict } from './delete-flow';
import { auditPayload, countOf } from './logging';
import { bugsnagCall, compactBody, listParams, withQuery } from './shared';
import type { BugsnagEndpointOutputs } from './types';

/**
 * Errors - grouped occurrences, which is the unit the BugSnag dashboard is built
 * around.
 *
 * **Not mirrored, deliberately.** An error's counters (`events`, `users`, `last_seen`)
 * move continuously as new occurrences arrive, so a cached row is a number that was
 * true once. The whole premise of the product is a live stream, and a local copy of it
 * would be stale before it was read.
 *
 * **Nothing from a response is logged.** `message` and `context` routinely contain
 * application input - a failed query, a rejected value, a user's own text - and
 * `assigned_collaborator_id` identifies a person. Reads are logged as a count.
 */

/**
 * Lists the errors on a project.
 *
 * There is **no status parameter** on this endpoint, which the catalog is explicit
 * about: open/fixed/ignored has to be expressed through `filters`, or filtered
 * client-side from each row's `status`.
 *
 * A warning about `filters`, verified live and easy to be caught by: **a field name the
 * project does not define is silently ignored rather than rejected.** Filtering on
 * `error.severity` - which is not a field; the real one is `event.severity` - returned
 * every row with a 200, and so did a wholly invented name. Only a valid field filters.
 * So a typo does not fail, it quietly returns unfiltered data. Valid names for a
 * project come from `eventFields.list`.
 */
export const list: BugsnagEndpoints['errorsList'] = async (ctx, input) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['errorsList']>(
		ctx,
		withQuery(
			`projects/${input.project_id}/errors`,
			{
				...listParams(input),
				sort: input.sort,
				direction: input.direction,
				base: input.base,
			},
			input.filters,
		),
	);

	await logEventFromContext(
		ctx,
		'bugsnag.errors.list',
		{
			...auditPayload(input, ['project_id', 'per_page', 'offset']),
			// The count, never the rows.
			error_count: countOf(result),
			// Which fields were filtered on, not the values - a filter value can be an
			// end-user's email address.
			filtered_fields: Object.keys(input.filters ?? {}),
		},
		'completed',
	);
	return result;
};

/**
 * Applies one operation to many errors at once.
 *
 * Two things about the request shape, both confirmed live and both easy to get wrong:
 *
 * - **`error_ids` is a query parameter** while `operation` goes in the body. The
 *   asymmetry is the API's.
 * - Without `operation` it answers
 *   `{"errors":["Operation must not be blank","Operation is not included in the list"]}`.
 *
 * `operation` is an enum in the input schema rather than a free string. This is the one
 *  place where a typo is destructive at scale: the operation is applied to every id
 * given, so a misspelled `discard` that the API happened to accept would act on the
 * whole batch. Rejecting it locally is cheaper than finding out.
 *
 * The response does **not** report per-error results. The catalog notes that the live
 * API returns only the operation name, unlike its own specification, and a live call
 * agrees. A caller needing per-error outcomes has to re-read the errors - so this
 * returns what actually arrives rather than a shape that would imply more.
 *
 * Marked destructive because `delete` and `discard` are among the operations, and
 * excluded from retries: a replay would reapply the operation to the same batch.
 */
export const bulkUpdate: BugsnagEndpoints['errorsBulkUpdate'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['errorsBulkUpdate']>(
		ctx,
		withQuery(`projects/${input.project_id}/errors`, {
			error_ids: input.error_ids,
		}),
		{
			method: 'PATCH',
			body: compactBody({
				operation: input.operation,
				severity: input.severity,
				assigned_collaborator_id: input.assigned_collaborator_id,
				assigned_team_id: input.assigned_team_id,
				issue_url: input.issue_url,
				issue_title: input.issue_title,
				reopen_rules: input.reopen_rules,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'bugsnag.errors.bulkUpdate',
		{
			...auditPayload(input, ['project_id']),
			operation: input.operation,
			// How many were affected matters for an audit trail; which ones does not,
			// and a list of ids would be unbounded.
			error_count: input.error_ids.length,
		},
		'completed',
	);
	return result;
};

/**
 * Permanently deletes every error and event in a project.
 *
 * Irreversible, and the most destructive operation short of deleting the project or
 * the organization. Answers 204, verified live against a throwaway project that had no
 * errors in it - never against a project holding real data.
 *
 * Nothing is evicted, because nothing was mirrored: errors and events are not cached.
 * The project row survives and remains correct - the project still exists, it is simply
 * empty - although its `open_error_count` is now stale until the next project read.
 *
 * Excluded from retries. A replay is harmless in effect, since a second deletion of
 * nothing is still nothing, but there is no reason to repeat a destructive call whose
 * first attempt may well have succeeded.
 */
export const deleteAll: BugsnagEndpoints['errorsDeleteAll'] = async (
	ctx,
	input,
) =>
	await deleteAndEvict(ctx, {
		path: `projects/${input.project_id}/errors`,
		event: 'bugsnag.errors.deleteAll',
		input,
		identifierKeys: ['project_id'],
		resultId: input.project_id,
		// No mirror: errors and events are never cached, so there is nothing to evict.
		// The project row survives and stays correct - the project still exists, it is
		// simply empty - though its open_error_count is stale until the next read.
	});
