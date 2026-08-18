import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import {
	BugsnagCollaboratorEntity,
	BugsnagProjectEntity,
} from '../schema/database';
import { deleteAndEvict } from './delete-flow';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { bugsnagCall, compactBody, listParams, withQuery } from './shared';
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
 * **Nothing beyond an id ever reaches the event log from this group**, including on the
 * invite operation, where the email address is the caller's own input rather than
 * something read back. `endpoints.test.ts` asserts that no name or address appears in
 * any serialised payload here.
 */

/** Lists the collaborators on an organization. */
export const list: BugsnagEndpoints['collaboratorsList'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['collaboratorsList']>(
		ctx,
		withQuery(
			`organizations/${input.organization_id}/collaborators`,
			listParams(input),
		),
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

/**
 * Invites a collaborator to an organization by email address.
 *
 * **Never exercised against a live account**, and that is a deliberate limit rather
 * than an oversight: the call sends an email to whatever address it is given, so a
 * live test would mean mailing a real person on every run. Covered by mocked tests.
 *
 * Re-inviting an address that already has access returns the existing collaborator
 * rather than failing, so this is safe to repeat - which is why it is *not* in the
 * non-idempotent set even though it is a POST.
 *
 * The invited address is the one piece of personal data the caller supplies directly,
 * and it is not logged. `auditPayload` records the field *names* supplied and the
 * organization id, so an operator can see that an invite happened and what it set,
 * without the log becoming a list of who was invited.
 */
export const invite: BugsnagEndpoints['collaboratorsInvite'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<
		BugsnagEndpointOutputs['collaboratorsInvite']
	>(ctx, `organizations/${input.organization_id}/collaborators`, {
		method: 'POST',
		body: compactBody({
			email: input.email,
			admin: input.admin,
			project_ids: input.project_ids,
			team_ids: input.team_ids,
		}),
	});

	await cacheEntity(ctx.db.collaborators, BugsnagCollaboratorEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'bugsnag.collaborators.invite',
		{
			...auditPayload(input, ['organization_id']),
			collaborator_id: result.id,
			admin: input.admin ?? false,
			project_count: input.project_ids?.length ?? 0,
		},
		'completed',
	);
	return result;
};

/**
 * Updates which projects a collaborator can reach, or makes them an admin.
 *
 * `project_ids` and `project_roles` are alternative expressions of the same change,
 * and the input schema rejects sending both rather than leaving the API to pick a
 * winner silently.
 *
 * Not exercised live: the recon account has a single collaborator who is also its only
 * admin, so any real call would alter the credentials the test suite itself depends on.
 */
export const updatePermissions: BugsnagEndpoints['collaboratorsUpdatePermissions'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['collaboratorsUpdatePermissions']
		>(
			ctx,
			`organizations/${input.organization_id}/collaborators/${input.collaborator_id}`,
			{
				method: 'PATCH',
				body: compactBody({
					admin: input.admin,
					project_ids: input.project_ids,
					project_roles: input.project_roles,
				}),
			},
		);

		await cacheEntity(ctx.db.collaborators, BugsnagCollaboratorEntity, result, {
			label: LABEL,
		});

		await logEventFromContext(
			ctx,
			'bugsnag.collaborators.updatePermissions',
			auditPayload(input, ['organization_id', 'collaborator_id']),
			'completed',
		);
		return result;
	};

/**
 * Removes a collaborator from an organization, revoking their access to every project
 * in it.
 *
 * The eviction is **required**, not best-effort, and this is the case that
 * `BugsnagMirrorEvictionError` exists for. The mirrored row holds the person's name
 * and email address. Reporting the removal as a plain success while that row survives
 * would tell the caller someone's access is gone when their details are still sitting
 * in a queryable local table - which is exactly the promise a deletion makes.
 *
 * The whole flow - including the reason a 404 must not abort before the eviction - lives
 * in `endpoints/delete-flow.ts`. That indirection is deliberate: the ordering here is
 * subtle enough that two call sites had drifted into slightly different versions of it,
 * and a privacy guarantee should not depend on each of them getting it right.
 *
 * Not exercised live - the only collaborator on the recon account is its own admin.
 */
export const remove: BugsnagEndpoints['collaboratorsDelete'] = async (
	ctx,
	input,
) =>
	await deleteAndEvict(ctx, {
		path: `organizations/${input.organization_id}/collaborators/${input.collaborator_id}`,
		event: 'bugsnag.collaborators.delete',
		input,
		identifierKeys: ['organization_id', 'collaborator_id'],
		resultId: input.collaborator_id,
		mirror: {
			store: ctx.db.collaborators,
			entityId: input.collaborator_id,
			label: LABEL,
			required: true,
		},
	});

/** Lists the collaborators who can reach a project. */
export const listOnProject: BugsnagEndpoints['collaboratorsListOnProject'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['collaboratorsListOnProject']
		>(
			ctx,
			withQuery(
				`projects/${input.project_id}/collaborators`,
				listParams(input),
			),
		);

		await cacheEntities(
			ctx.db.collaborators,
			BugsnagCollaboratorEntity,
			result,
			{ label: LABEL },
		);

		await logEventFromContext(
			ctx,
			'bugsnag.collaborators.listOnProject',
			auditPayload(input, ['project_id', 'per_page', 'offset']),
			'completed',
		);
		return result;
	};

/** Retrieves one collaborator in the context of a project. */
export const getOnProject: BugsnagEndpoints['collaboratorsGetOnProject'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['collaboratorsGetOnProject']
		>(
			ctx,
			`projects/${input.project_id}/collaborators/${input.collaborator_id}`,
		);

		await cacheEntity(ctx.db.collaborators, BugsnagCollaboratorEntity, result, {
			label: LABEL,
		});

		await logEventFromContext(
			ctx,
			'bugsnag.collaborators.getOnProject',
			auditPayload(input, ['project_id', 'collaborator_id']),
			'completed',
		);
		return result;
	};

/**
 * Lists the projects a collaborator can reach.
 *
 * Returns full project records, so the results are mirrored as projects rather than as
 * collaborators - the same rows the project list would have produced.
 */
export const listProjects: BugsnagEndpoints['collaboratorsListProjects'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['collaboratorsListProjects']
		>(
			ctx,
			withQuery(
				`organizations/${input.organization_id}/collaborators/${input.collaborator_id}/projects`,
				{ ...listParams(input), sort: input.sort, direction: input.direction },
			),
		);

		await cacheEntities(ctx.db.projects, BugsnagProjectEntity, result, {
			label: 'project',
		});

		await logEventFromContext(
			ctx,
			'bugsnag.collaborators.listProjects',
			auditPayload(input, ['organization_id', 'collaborator_id']),
			'completed',
		);
		return result;
	};

/**
 * Counts how many projects each of the named collaborators can reach.
 *
 * `collaborator_ids` is required and must arrive as an array. This is the operation
 * that exposed why the plugin builds its own query strings: the transport's serialiser
 * emits `collaborator_ids=<id>`, which the API rejects with
 * `{"errors":["Collaborator_ids must be an array"]}`, while `collaborator_ids[]=<id>`
 * answers 200. See `endpoints/shared.ts`.
 *
 * Not mirrored: a count is a derived figure, and the authoritative form of the same
 * information is the collaborator's `project_ids`.
 */
export const projectAccessCounts: BugsnagEndpoints['collaboratorsProjectAccessCounts'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['collaboratorsProjectAccessCounts']
		>(
			ctx,
			withQuery(
				`organizations/${input.organization_id}/collaborators/project_access_counts`,
				{ collaborator_ids: input.collaborator_ids },
			),
		);

		await logEventFromContext(
			ctx,
			'bugsnag.collaborators.projectAccessCounts',
			{
				...auditPayload(input, ['organization_id']),
				collaborator_count: input.collaborator_ids.length,
			},
			'completed',
		);
		return result;
	};

/**
 * Lists how a collaborator reaches each project, with the role that grants it.
 *
 * The path is `project_accesses`. Recon had this as `access_details`, which does not
 * exist - and the way it failed is worth recording, because the 404 was misleading:
 * `organizations/{id}/collaborators/access_details` returned
 * `{"errors":["User not found"]}`, the *resource*-missing envelope, because
 * `access_details` was being parsed as a collaborator id. A route-absent 404 would have
 * said the path was wrong; this one said the path was right and the record was missing,
 * which sent the search in the wrong direction.
 *
 * Three role fields, and the distinction between them is the point of the operation:
 * `project_role` is effective, `individual_project_role` was granted directly, and
 * `team_project_role` is inherited through a team. An audit that reads only the
 * effective role cannot say *why* someone has access.
 */
export const listProjectAccesses: BugsnagEndpoints['collaboratorsListProjectAccesses'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['collaboratorsListProjectAccesses']
		>(
			ctx,
			withQuery(
				`organizations/${input.organization_id}/collaborators/${input.collaborator_id}/project_accesses`,
				{ ...listParams(input), q: input.q, inaccessible: input.inaccessible },
			),
		);

		await logEventFromContext(
			ctx,
			'bugsnag.collaborators.listProjectAccesses',
			auditPayload(input, ['organization_id', 'collaborator_id']),
			'completed',
		);
		return result;
	};

/** Retrieves how one collaborator reaches one project. */
export const getProjectAccess: BugsnagEndpoints['collaboratorsGetProjectAccess'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['collaboratorsGetProjectAccess']
		>(
			ctx,
			`organizations/${input.organization_id}/collaborators/${input.collaborator_id}/project_accesses/${input.project_id}`,
		);

		await logEventFromContext(
			ctx,
			'bugsnag.collaborators.getProjectAccess',
			auditPayload(input, ['organization_id', 'collaborator_id', 'project_id']),
			'completed',
		);
		return result;
	};
