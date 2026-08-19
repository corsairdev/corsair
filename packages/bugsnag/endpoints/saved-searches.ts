import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { deleteAndEvict } from './delete-flow';
import { auditPayload, countOf } from './logging';
import { bugsnagCall, compactBody, listParams, withQuery } from './shared';
import type { BugsnagEndpointOutputs } from './types';

/**
 * Saved searches - stored filter configurations, called "filtersets" internally.
 *
 * **The paths are asymmetric, and this is the group where recon went most wrong.** Only
 * the list is per-project; create, read, delete and the usage summary are all
 * **top-level**:
 *
 * ```
 * GET    projects/{project_id}/saved_searches
 * POST   saved_searches                          <- project_id in the body
 * GET    saved_searches/{id}
 * DELETE saved_searches/{id}
 * GET    saved_searches/{id}/usage_summary
 * ```
 *
 * Recon had all of them nested under the project, which meant six candidate paths all
 * answering route-absent 404 and the usage summary being written off as enterprise-only.
 * It is not enterprise-only; it was the wrong path. Every route above was then confirmed
 * with a create/read/usage/delete round trip on a live account.
 *
 * **Not mirrored.** `filters` can contain end-user identifiers - searching for one
 * customer's email address is an ordinary support workflow - so a local copy would be a
 * copy of personal data for no lookup benefit. Nothing from a response is logged beyond
 * ids and counts, and filter *values* are never logged.
 */

/** Lists the saved searches on a project. */
export const list: BugsnagEndpoints['savedSearchesList'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['savedSearchesList']>(
		ctx,
		withQuery(`projects/${input.project_id}/saved_searches`, {
			...listParams(input),
			shared: input.shared,
		}),
	);

	await logEventFromContext(
		ctx,
		'bugsnag.savedSearches.list',
		{
			...auditPayload(input, ['project_id', 'per_page', 'offset']),
			saved_search_count: countOf(result),
		},
		'completed',
	);
	return result;
};

/**
 * Creates a saved search.
 *
 * Top-level path, so `project_id` travels in the **body**. Answers 201 with the created
 * filterset, verified live.
 *
 * Non-idempotent: names are not unique, so a replay creates a second identical search
 * rather than returning the first.
 *
 * `filters` is required, and its values are the reason nothing but the name's presence
 * is logged - see the note at the top of this file.
 */
export const create: BugsnagEndpoints['savedSearchesCreate'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<
		BugsnagEndpointOutputs['savedSearchesCreate']
	>(ctx, 'saved_searches', {
		method: 'POST',
		body: compactBody({
			project_id: input.project_id,
			name: input.name,
			filters: input.filters,
			shared: input.shared,
			project_default: input.project_default,
			sort: input.sort,
		}),
	});

	await logEventFromContext(
		ctx,
		'bugsnag.savedSearches.create',
		{
			...auditPayload(input, ['project_id']),
			saved_search_id: result.id,
			// Which fields the search filters on, never the values it matches.
			filtered_fields: Object.keys(input.filters ?? {}),
			shared: input.shared ?? false,
		},
		'completed',
	);
	return result;
};

/** Retrieves one saved search by id. */
export const get: BugsnagEndpoints['savedSearchesGet'] = async (ctx, input) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['savedSearchesGet']>(
		ctx,
		`saved_searches/${input.saved_search_id}`,
	);

	await logEventFromContext(
		ctx,
		'bugsnag.savedSearches.get',
		auditPayload(input, ['saved_search_id']),
		'completed',
	);
	return result;
};

/**
 * Deletes a saved search. Answers 204, verified live.
 *
 * Nothing is evicted because saved searches are not mirrored. Worth checking
 * {@link usageSummary} first - a search that other notifications depend on is not
 * obviously safe to remove.
 */
export const remove: BugsnagEndpoints['savedSearchesDelete'] = async (
	ctx,
	input,
) =>
	await deleteAndEvict(ctx, {
		path: `saved_searches/${input.saved_search_id}`,
		event: 'bugsnag.savedSearches.delete',
		input,
		identifierKeys: ['saved_search_id'],
		resultId: input.saved_search_id,
		// No mirror: a saved search's filters can hold end-user identifiers, so it is
		// deliberately never cached.
	});

/**
 * Reports how widely a saved search is relied upon - project notifications,
 * collaborator email notifications and performance monitors that reference it.
 *
 * The operation to call before deleting one, which is what the catalog says it is for.
 * Verified live: 200 with four counts, on a free account.
 *
 * This is the operation that had been recorded as enterprise-only. It was not; the path
 * was wrong. Worth keeping as a reminder that "the plan does not allow it" is a
 * conclusion needing more evidence than a single 404.
 */
export const usageSummary: BugsnagEndpoints['savedSearchesUsageSummary'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['savedSearchesUsageSummary']
		>(ctx, `saved_searches/${input.saved_search_id}/usage_summary`);

		await logEventFromContext(
			ctx,
			'bugsnag.savedSearches.usageSummary',
			auditPayload(input, ['saved_search_id']),
			'completed',
		);
		return result;
	};
