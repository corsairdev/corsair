import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { BugsnagOrganizationEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { bugsnagCall, listQuery } from './shared';
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
		'user/organizations',
		{ query: listQuery(input) },
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
