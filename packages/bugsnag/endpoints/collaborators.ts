import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import { BugsnagCollaboratorEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { bugsnagCall, listQuery } from './shared';
import type { BugsnagEndpointOutputs } from './types';

const LABEL = 'collaborator';

/**
 * Collaborators - the people with access to an organization.
 *
 * This is the entity that is mostly personal data: a name, an email address, and a
 * record of when they last used the account. It is mirrored because errors, comments
 * and audit trails reference a collaborator by id, and resolving that id to a person
 * is exactly the lookup a local copy is for.
 *
 * Nothing beyond the id reaches the event log.
 */

/** Lists the collaborators on an organization. */
export const list: BugsnagEndpoints['collaboratorsList'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['collaboratorsList']>(
		ctx,
		`organizations/${input.organization_id}/collaborators`,
		{ query: listQuery(input) },
	);

	await cacheEntities(ctx.db.collaborators, BugsnagCollaboratorEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'bugsnag.collaborators.list',
		auditPayload(input, ['organization_id', 'per_page', 'offset']),
		'completed',
	);
	return result;
};

/** Retrieves one collaborator by id. */
export const get: BugsnagEndpoints['collaboratorsGet'] = async (ctx, input) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['collaboratorsGet']>(
		ctx,
		`organizations/${input.organization_id}/collaborators/${input.collaborator_id}`,
	);

	await cacheEntity(ctx.db.collaborators, BugsnagCollaboratorEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'bugsnag.collaborators.get',
		auditPayload(input, ['organization_id', 'collaborator_id']),
		'completed',
	);
	return result;
};
