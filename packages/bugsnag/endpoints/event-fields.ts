import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { deleteAndEvict } from './delete-flow';
import { auditPayload, countOf } from './logging';
import { bugsnagCall, listParams, withQuery } from './shared';
import type { BugsnagEndpointOutputs } from './types';

/**
 * Event fields - the names a project can filter and pivot on.
 *
 * This is filter metadata rather than data, so it is not mirrored. It is also the
 * lookup that makes filtering safe to use: because an unrecognised filter field is
 * silently ignored rather than rejected (see `endpoints/errors.ts`), this list is the
 * only reliable way for a caller to know which names actually work on a given project.
 * 39 built-in fields on the recon project, plus whatever custom ones the account has
 * defined.
 *
 * **One caveat on freshness.** This list is not read-your-writes consistent for custom
 * fields: a field created by {@link create} is missing from it while the reindex the
 * create reports is still running, even though the field exists and can be deleted. So
 * absence from this list does not prove a field was never created.
 */

/** Lists the event fields available on a project. */
export const list: BugsnagEndpoints['eventFieldsList'] = async (ctx, input) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['eventFieldsList']>(
		ctx,
		withQuery(`projects/${input.project_id}/event_fields`, listParams(input)),
	);

	await logEventFromContext(
		ctx,
		'bugsnag.eventFields.list',
		{
			...auditPayload(input, ['project_id', 'per_page', 'offset']),
			field_count: countOf(result),
		},
		'completed',
	);
	return result;
};

/**
 * Creates a custom event field, making a path inside `metaData` filterable.
 *
 * Three behaviours worth knowing, all confirmed live.
 *
 * **`filter_options` is required.** Without it the API answers
 * `{"errors":["Filter options can't be blank"]}`.
 *
 * **The API assigns `display_id` itself, from `path`, and ignores any `display_id` sent.**
 * This one is worth stating carefully, because the OSS catalog contradicts it: the catalog
 * documents `display_id` as a required input and gives an example where it differs from
 * the path (`display_id: "custom.user.accountId"` with
 * `path: "metaData.user.accountId"`). It does not work that way. Four creates were tried -
 * the catalog's own `custom.`-prefixed form, a plain dotted name, a hyphenated name, and
 * omitting the field entirely - and **all four returned 201 with `display_id` set to the
 * `path` value**. Omitting it is accepted, so it is not required either.
 *
 * That is why `display_id` is absent from this operation's input. Accepting a field the
 * API discards would invite a caller to delete the field later by the id they chose and
 * receive a 404 - which is not hypothetical: it happened during recon and left a field
 * behind on a live account. **The id to keep is the one in the response.**
 *
 * **A newly created field does not appear in {@link list} immediately.** The response
 * carries `reindex_in_progress` and `reindex_percentage`, and until that finishes
 * `GET /event_fields` omits the field while `DELETE` by its `display_id` still works. So
 * a caller must not treat absence from the list as proof the field was not created, and
 * cleanup logic must delete by the returned id rather than by listing first. That
 * mistake is how the field above survived: the cleanup listed, found nothing, and
 * reported success.
 *
 * The catalog notes custom event fields need a Preferred or Enterprise plan. On the
 * recon account - a free one - the create answered 201, so either the gate is applied
 * elsewhere or the note is out of date. Recorded as observed rather than asserted
 * either way.
 *
 * Non-idempotent: a replay would attempt a second field on the same path.
 */
export const create: BugsnagEndpoints['eventFieldsCreate'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['eventFieldsCreate']>(
		ctx,
		`projects/${input.project_id}/event_fields`,
		{
			method: 'POST',
			body: { path: input.path, filter_options: input.filter_options },
		},
	);

	await logEventFromContext(
		ctx,
		'bugsnag.eventFields.create',
		{
			...auditPayload(input, ['project_id', 'path']),
			// The id the API actually assigned, which is the one a caller needs in
			// order to delete this field later.
			display_id: result.display_id,
		},
		'completed',
	);
	return result;
};

/**
 * Deletes a custom event field.
 *
 * Only custom fields can be removed; the 39 built-ins cannot.
 *
 * `display_id` is a dotted path such as `metaData.user.accountId`, so it is
 * URL-encoded. This is not theoretical: a probe that deleted by the *requested*
 * display_id rather than the assigned one received
 * `{"errors":["Event field not found"]}` and left the field behind on the account.
 * Encoding and using the assigned id are both required.
 *
 * Answers 204. Nothing is evicted because event fields are not mirrored.
 */
export const remove: BugsnagEndpoints['eventFieldsDelete'] = async (
	ctx,
	input,
) =>
	await deleteAndEvict(ctx, {
		path: `projects/${input.project_id}/event_fields/${encodeURIComponent(input.display_id)}`,
		event: 'bugsnag.eventFields.delete',
		input,
		identifierKeys: ['project_id', 'display_id'],
		resultId: input.display_id,
		// No mirror: event fields are filter metadata, not data.
	});
