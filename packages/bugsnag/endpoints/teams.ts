import { logEventFromContext } from 'corsair/core';
import type { BugsnagEndpoints } from '../index';
import {
	BugsnagCollaboratorEntity,
	BugsnagTeamEntity,
} from '../schema/database';
import { deleteAndEvict } from './delete-flow';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { bugsnagCall, compactBody, listParams, withQuery } from './shared';
import type { BugsnagEndpointOutputs } from './types';

const LABEL = 'team';

/**
 * Teams - named groups of collaborators, used to grant project access to several
 * people at once.
 *
 * A team record is unusually thin: `{id, name, collaborator_count, project_count}` and
 * nothing else, confirmed live. There is no members array, so the mirror cannot answer
 * "who is on this team" and does not pretend to - that lives on the collaborator, in
 * `team_ids`.
 *
 * Every operation here was verified live against a team created and deleted for the
 * purpose, which is how the membership paths were corrected: recon had them at
 * `memberships`, and the real path is `team_memberships`.
 */

/** Lists the teams in an organization. */
export const list: BugsnagEndpoints['teamsList'] = async (ctx, input) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['teamsList']>(
		ctx,
		withQuery(`organizations/${input.organization_id}/teams`, {
			...listParams(input),
			q: input.q,
		}),
	);

	await cacheEntities(ctx.db.teams, BugsnagTeamEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'bugsnag.teams.list',
		auditPayload(input, ['organization_id', 'per_page', 'offset']),
		'completed',
	);
	return result;
};

/**
 * Creates a team.
 *
 * Non-idempotent in the same way `projects.create` is: there is no idempotency key, and
 * a replay would create a second team rather than returning the first. Excluded from
 * retries accordingly.
 *
 * The name is required and must be unique within the organization.
 */
export const create: BugsnagEndpoints['teamsCreate'] = async (ctx, input) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['teamsCreate']>(
		ctx,
		`organizations/${input.organization_id}/teams`,
		{ method: 'POST', body: compactBody({ name: input.name }) },
	);

	await cacheEntity(ctx.db.teams, BugsnagTeamEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'bugsnag.teams.create',
		{ ...auditPayload(input, ['organization_id']), team_id: result.id },
		'completed',
	);
	return result;
};

/** Retrieves one team by id. */
export const get: BugsnagEndpoints['teamsGet'] = async (ctx, input) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['teamsGet']>(
		ctx,
		`organizations/${input.organization_id}/teams/${input.team_id}`,
	);

	await cacheEntity(ctx.db.teams, BugsnagTeamEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'bugsnag.teams.get',
		auditPayload(input, ['organization_id', 'team_id']),
		'completed',
	);
	return result;
};

/**
 * Deletes a team. Answers 204, confirmed live.
 *
 * Evicted best-effort rather than required. A team carries no personal data - a name
 * and two counts - so a stale row is untidy rather than a disclosure. The people who
 * were on it are unaffected; only the grouping is removed.
 */
export const remove: BugsnagEndpoints['teamsDelete'] = async (ctx, input) =>
	await deleteAndEvict(ctx, {
		path: `organizations/${input.organization_id}/teams/${input.team_id}`,
		event: 'bugsnag.teams.delete',
		input,
		identifierKeys: ['organization_id', 'team_id'],
		resultId: input.team_id,
		mirror: {
			store: ctx.db.teams,
			entityId: input.team_id,
			label: LABEL,
			// Best-effort: a team is a name and two counts, so a stale row is untidy
			// rather than a disclosure. The people who were on it are unaffected.
		},
	});

/**
 * Adds collaborators to a team.
 *
 * The API demands one of two mutually exclusive forms and says so plainly:
 * `{"errors":["Add all collaborators should be true if collaborator_ids is not
 * specified"]}`. The input schema enforces the choice, so the caller is told before a
 * round-trip rather than after.
 *
 * `add_all_collaborators` is worth treating with care: on a large organization it adds
 * everybody, which is a broad grant of project access. The audit payload therefore
 * records which form was used and how many ids were named, never who they were.
 */
export const addMembers: BugsnagEndpoints['teamsAddMembers'] = async (
	ctx,
	input,
) => {
	const result = await bugsnagCall<BugsnagEndpointOutputs['teamsAddMembers']>(
		ctx,
		`organizations/${input.organization_id}/teams/${input.team_id}/team_memberships`,
		{
			method: 'POST',
			body: compactBody({
				collaborator_ids: input.collaborator_ids,
				add_all_collaborators: input.add_all_collaborators,
			}),
		},
	);

	await cacheEntity(ctx.db.teams, BugsnagTeamEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'bugsnag.teams.addMembers',
		{
			...auditPayload(input, ['organization_id', 'team_id']),
			collaborator_count: input.collaborator_ids?.length ?? 0,
			add_all_collaborators: input.add_all_collaborators ?? false,
		},
		'completed',
	);
	return result;
};

/**
 * Adds a collaborator to teams - the same relationship from the other side.
 *
 * Mirrors the requirement above, with the mirrored error message:
 * `{"errors":["Team_ids must be supplied when add_all_teams is set to false"]}`.
 *
 * Returns the updated **collaborator**, not a team, so the collaborator mirror is
 * refreshed from it. That is also why the two membership operations cannot share an
 * implementation despite looking symmetrical.
 */
export const addCollaboratorMemberships: BugsnagEndpoints['teamsAddCollaboratorMemberships'] =
	async (ctx, input) => {
		const result = await bugsnagCall<
			BugsnagEndpointOutputs['teamsAddCollaboratorMemberships']
		>(
			ctx,
			`organizations/${input.organization_id}/collaborators/${input.collaborator_id}/team_memberships`,
			{
				method: 'POST',
				body: compactBody({
					team_ids: input.team_ids,
					add_all_teams: input.add_all_teams,
				}),
			},
		);

		await cacheEntity(ctx.db.collaborators, BugsnagCollaboratorEntity, result, {
			label: 'collaborator',
		});

		await logEventFromContext(
			ctx,
			'bugsnag.teams.addCollaboratorMemberships',
			{
				...auditPayload(input, ['organization_id', 'collaborator_id']),
				team_count: input.team_ids?.length ?? 0,
				add_all_teams: input.add_all_teams ?? false,
			},
			'completed',
		);
		return result;
	};
