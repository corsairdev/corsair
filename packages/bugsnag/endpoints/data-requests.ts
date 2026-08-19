import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { auditPayload } from './logging';
import { bugsnagCall } from './shared';
import type { BugsnagEndpointOutputs } from './types';

/**
 * Event data requests - asynchronous exports of event data, used to answer a data
 * subject access request under GDPR or CCPA.
 *
 * Available at both organization and project scope, with identical shapes. The typical
 * filter is on `user.email`, which is what makes this family what it is: **the input is
 * an instruction to gather everything the account holds about one identified person, and
 * the output is a URL that hands it over.**
 *
 * That shapes three decisions here:
 *
 * - **`filters` is required.** The API insists -
 *   `{"errors":["filters must be provided"]}` for an empty body - and it is the right
 *   default: an unfiltered export would address the whole account.
 * - **Nothing is mirrored.** A request record's `url` is a download link for personal
 *   data.
 * - **Neither the filter values nor the `url` are ever logged.** The audit payload
 *   records that an export was requested, at what scope, and which *fields* it filtered
 *   on - never the email address being searched for, and never the link. An audit trail
 *   should show that someone exported data about a person without itself becoming a copy
 *   of that data.
 *
 * The routes are confirmed live by their validation response. No request was actually
 * created: doing so would export real event data and produce a downloadable URL for it.
 * So the response *shape* is documented rather than observed - see
 * `schema/responses.ts`.
 *
 * The creates are excluded from retries. A replay would start a second export of the
 * same person's data, which is not harmless even though it is not destructive.
 */

/** Requests an export of event data across an organization. */
export const createForOrganization: BugsnagEndpoints['dataRequestsCreateForOrganization'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['dataRequestsCreateForOrganization']
		>(ctx, `organizations/${input.organization_id}/event_data_requests`, {
			method: 'POST',
			body: {
				filters: input.filters,
				...(input.report_type === undefined
					? {}
					: { report_type: input.report_type }),
			},
		});

		await logEventFromContext(
			ctx,
			'bugsnag.dataRequests.createForOrganization',
			{
				...auditPayload(input, ['organization_id']),
				request_id: result.id,
				status: result.status,
				// Field names only. A filter value here identifies a person.
				filtered_fields: Object.keys(input.filters ?? {}),
				report_type: input.report_type ?? null,
			},
			'completed',
		);
		return result;
	};

/**
 * Checks the status of an organization-scoped export.
 *
 * The response carries `url` once complete. It is returned to the caller, because that
 * is the point of the operation, and not logged.
 */
export const getForOrganization: BugsnagEndpoints['dataRequestsGetForOrganization'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['dataRequestsGetForOrganization']
		>(
			ctx,
			`organizations/${input.organization_id}/event_data_requests/${input.request_id}`,
		);

		await logEventFromContext(
			ctx,
			'bugsnag.dataRequests.getForOrganization',
			{
				...auditPayload(input, ['organization_id', 'request_id']),
				status: result.status,
			},
			'completed',
		);
		return result;
	};

/** Requests an export of event data within a single project. */
export const createForProject: BugsnagEndpoints['dataRequestsCreateForProject'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['dataRequestsCreateForProject']
		>(ctx, `projects/${input.project_id}/event_data_requests`, {
			method: 'POST',
			body: {
				filters: input.filters,
				...(input.report_type === undefined
					? {}
					: { report_type: input.report_type }),
			},
		});

		await logEventFromContext(
			ctx,
			'bugsnag.dataRequests.createForProject',
			{
				...auditPayload(input, ['project_id']),
				request_id: result.id,
				status: result.status,
				filtered_fields: Object.keys(input.filters ?? {}),
				report_type: input.report_type ?? null,
			},
			'completed',
		);
		return result;
	};

/** Checks the status of a project-scoped export. */
export const getForProject: BugsnagEndpoints['dataRequestsGetForProject'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['dataRequestsGetForProject']
		>(
			ctx,
			`projects/${input.project_id}/event_data_requests/${input.request_id}`,
		);

		await logEventFromContext(
			ctx,
			'bugsnag.dataRequests.getForProject',
			{
				...auditPayload(input, ['project_id', 'request_id']),
				status: result.status,
			},
			'completed',
		);
		return result;
	};
