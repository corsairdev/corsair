import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { BugsnagOrganizationEntity } from '../schema/database';
import { deleteAndEvict } from './delete-flow';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { bugsnagCall, listParams, withQuery } from './shared';
import type { BugsnagEndpointOutputs } from './types';

const LABEL = 'organization';

/**
 * Organizations - the top of the hierarchy. Every project, collaborator and team
 * belongs to one.
 *
 * The list is reached through `/user/organizations` rather than `/organizations`,
 * because the API answers it relative to whoever owns the token: a personal auth
 * token sees the organizations that person belongs to. There is no way to list
 * organizations globally.
 */

/** Lists the organizations the token's owner belongs to. */
export const list: BugsnagEndpoints['organizationsList'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['organizationsList']>(
		ctx,
		withQuery('user/organizations', listParams(input)),
	);

	await cacheEntities(ctx.db.organizations, BugsnagOrganizationEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'bugsnag.organizations.list',
		auditPayload(input, ['per_page', 'offset']),
		'completed',
	);
	return result;
};

/**
 * Retrieves one organization by id.
 *
 * The response carries `api_key` and `billing_emails`, so only the id is logged.
 */
export const get: BugsnagEndpoints['organizationsGet'] = async (ctx, input) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['organizationsGet']>(
		ctx,
		`organizations/${input.organization_id}`,
	);

	await cacheEntity(ctx.db.organizations, BugsnagOrganizationEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'bugsnag.organizations.get',
		auditPayload(input, ['organization_id']),
		'completed',
	);
	return result;
};

/**
 * Deletes an organization.
 *
 * The most destructive operation in the API: it removes every project, error, event
 * and collaborator association the organization holds, irreversibly. Never exercised
 * against a live account - it is covered by mocked tests only, and the live suite is
 * read-only.
 *
 * The mirrored row is evicted as **required** rather than best-effort, unlike a
 * project. An organization record carries `billing_emails`, so a surviving row keeps
 * real email addresses queryable after the account they belong to has been deleted.
 * Reporting that as a plain success would be untrue in the way that matters.
 *
 * The ordering, the 404-as-absence handling and the reasons for both live in
 * `endpoints/delete-flow.ts`, shared with the collaborator delete.
 */
export const remove: BugsnagEndpoints['organizationsDelete'] = async (
	ctx,
	input,
) =>
	await deleteAndEvict(ctx, {
		path: `organizations/${input.organization_id}`,
		event: 'bugsnag.organizations.delete',
		input,
		identifierKeys: ['organization_id'],
		resultId: input.organization_id,
		mirror: {
			store: ctx.db.organizations,
			entityId: input.organization_id,
			label: LABEL,
			required: true,
		},
	});
