import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { auditPayload } from './logging';
import { bugsnagCall } from './shared';
import type { BugsnagEndpointOutputs } from './types';

/**
 * Event data deletions - asynchronous, irreversible erasure of event data, used to
 * answer an erasure request under GDPR or CCPA.
 *
 * The same shape as `dataRequests` at both organization and project scope, and the same
 * privacy handling - filter values and identifiers are never logged. What differs is the
 * consequence: these destroy data rather than copy it, so every one of them is marked
 * `destructive` and none is retried.
 *
 * **The two-step workflow is the thing to understand.** A deletion is created in status
 * `AWAITING_CONFIRMATION` and does nothing at all until confirmed. The documented
 * statuses are `PREPARING`, `AWAITING_CONFIRMATION`, `ACCEPTED`, `IN_PROGRESS`,
 * `COMPLETED` and `EXPIRED`. That design exists so a caller can create a deletion, read
 * back how many events it matched, and only then decide - which is why
 * {@link confirmForProject} is a separate operation rather than a flag on the create, and
 * why the created status is recorded in the audit log.
 *
 * Routes confirmed live by their validation response only:
 * `{"errors":["filters must be provided"]}` for an empty body proves the route and names
 * the required field. **No deletion was ever created against a real account** - a
 * confirmed one destroys real event data - so the response shapes are documented rather
 * than observed. See `schema/responses.ts`.
 */

/** Creates a deletion request covering an organization. Requires confirmation. */
export const createForOrganization: BugsnagEndpoints['dataDeletionsCreateForOrganization'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['dataDeletionsCreateForOrganization']
		>(ctx, `organizations/${input.organization_id}/event_data_deletions`, {
			method: 'POST',
			body: { filters: input.filters },
		});

		await logEventFromContext(
			ctx,
			'bugsnag.dataDeletions.createForOrganization',
			{
				...auditPayload(input, ['organization_id']),
				deletion_id: result.id,
				// Recorded because it distinguishes "a deletion was prepared" from "a
				// deletion happened" - the two are days apart in an audit trail.
				status: result.status,
				filtered_fields: Object.keys(input.filters ?? {}),
			},
			'completed',
		);
		return result;
	};

/** Checks the status of an organization-scoped deletion. */
export const getForOrganization: BugsnagEndpoints['dataDeletionsGetForOrganization'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['dataDeletionsGetForOrganization']
		>(
			ctx,
			`organizations/${input.organization_id}/event_data_deletions/${input.deletion_id}`,
		);

		await logEventFromContext(
			ctx,
			'bugsnag.dataDeletions.getForOrganization',
			{
				...auditPayload(input, ['organization_id', 'deletion_id']),
				status: result.status,
			},
			'completed',
		);
		return result;
	};

/** Creates a deletion request covering one project. Requires confirmation. */
export const createForProject: BugsnagEndpoints['dataDeletionsCreateForProject'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['dataDeletionsCreateForProject']
		>(ctx, `projects/${input.project_id}/event_data_deletions`, {
			method: 'POST',
			body: { filters: input.filters },
		});

		await logEventFromContext(
			ctx,
			'bugsnag.dataDeletions.createForProject',
			{
				...auditPayload(input, ['project_id']),
				deletion_id: result.id,
				status: result.status,
				filtered_fields: Object.keys(input.filters ?? {}),
			},
			'completed',
		);
		return result;
	};

/** Checks the status of a project-scoped deletion. */
export const getForProject: BugsnagEndpoints['dataDeletionsGetForProject'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['dataDeletionsGetForProject']
		>(
			ctx,
			`projects/${input.project_id}/event_data_deletions/${input.deletion_id}`,
		);

		await logEventFromContext(
			ctx,
			'bugsnag.dataDeletions.getForProject',
			{
				...auditPayload(input, ['project_id', 'deletion_id']),
				status: result.status,
			},
			'completed',
		);
		return result;
	};

/**
 * Confirms a project deletion request, which is the step that actually destroys the
 * data.
 *
 * **This is the single most consequential call in the plugin.** Everything before it is
 * reversible; this is not. The deletion must be in `AWAITING_CONFIRMATION` to be
 * confirmable.
 *
 * Excluded from every retry path, and deliberately not for the usual reason. A replay
 * would probably be harmless - a second confirmation of an already-confirmed deletion
 * should fail rather than delete twice - but "probably harmless" is not a good enough
 * basis for automatically repeating an irreversible destruction of someone's data. A
 * caller who needs to know whether it applied can read it back with
 * {@link getForProject}, which is safe.
 */
export const confirmForProject: BugsnagEndpoints['dataDeletionsConfirmForProject'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['dataDeletionsConfirmForProject']
		>(
			ctx,
			`projects/${input.project_id}/event_data_deletions/${input.deletion_id}/confirm`,
			{ method: 'POST' },
		);

		await logEventFromContext(
			ctx,
			'bugsnag.dataDeletions.confirmForProject',
			{
				...auditPayload(input, ['project_id', 'deletion_id']),
				status: result.status,
			},
			'completed',
		);
		return result;
	};
