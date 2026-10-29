import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { auditPayload, countOf } from './logging';
import { bugsnagCall, listParams, withQuery } from './shared';
import type { BugsnagEndpointOutputs } from './types';

/**
 * Events - individual occurrences, as opposed to the grouped errors they belong to.
 *
 * **This is the most sensitive data the API exposes**, and the reason the audit payloads
 * in this plugin are as narrow as they are. A notifier can attach to every event:
 *
 * - `user` - a name, an email address and an id, confirmed live on a seeded event
 * - `request` - URL, headers, IP address
 * - `metaData` - whatever the application decided to send, entirely unconstrained
 * - `breadcrumbs` - a trail of what the user did before the error
 *
 * None of it is mirrored and none of it is logged. A read is recorded as a count, and
 * `endpoints.test.ts` asserts that no name, address or metadata value appears in a
 * serialised payload from this file.
 *
 * `full_reports` is the switch that widens an event from 11 fields to 20, and every
 * field it adds is in the list above. It is off unless the caller asks, so the wide
 * shape is always a deliberate request rather than a default.
 */

/** Lists the events on a project. */
export const list: BugsnagEndpoints['eventsList'] = async (ctx, input) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['eventsList']>(
		ctx,
		withQuery(
			`projects/${input.project_id}/events`,
			{
				...listParams(input),
				sort: input.sort,
				direction: input.direction,
				base: input.base,
				full_reports: input.full_reports,
			},
			input.filters,
		),
	);

	await logEventFromContext(
		ctx,
		'bugsnag.events.list',
		{
			...auditPayload(input, ['project_id', 'per_page', 'offset']),
			event_count: countOf(result),
			filtered_fields: Object.keys(input.filters ?? {}),
			// Recorded because it says whether personal data was requested, which is
			// exactly what an audit trail should be able to answer.
			full_reports: input.full_reports ?? false,
		},
		'completed',
	);
	return result;
};

/**
 * Lists the events belonging to one error.
 *
 * The usual way in: `errors.list` finds the group, then this retrieves the individual
 * occurrences with their stack traces. Verified live - 11 fields per event without
 * full reports.
 */
export const listForError: BugsnagEndpoints['eventsListForError'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<
		BugsnagEndpointOutputs['eventsListForError']
	>(
		ctx,
		withQuery(
			`projects/${input.project_id}/errors/${input.error_id}/events`,
			{
				...listParams(input),
				sort: input.sort,
				direction: input.direction,
				base: input.base,
				full_reports: input.full_reports,
			},
			input.filters,
		),
	);

	await logEventFromContext(
		ctx,
		'bugsnag.events.listForError',
		{
			...auditPayload(input, ['project_id', 'error_id', 'per_page', 'offset']),
			event_count: countOf(result),
			filtered_fields: Object.keys(input.filters ?? {}),
			full_reports: input.full_reports ?? false,
		},
		'completed',
	);
	return result;
};
