import { logEventFromContext } from 'corsair/core';
import type { FormbricksEndpoints } from '../index';
import { FormbricksTeamEntity } from '../schema/database';
import { deleteAndEvict } from './delete-flow';
import { auditPayload, countOf } from './logging';
import { cacheEntities } from './persist';
import { formbricksCall, listParams, withQuery } from './shared';
import type { FormbricksEndpointOutputs } from './types';

const LABEL = 'team';

/**
 * Organization-level resources: teams, the workspace-team join, and roles.
 *
 * All **v2** - v1 has no organization surface at all. They are also the only operations addressed
 * by `organizationId` rather than `workspaceId`, and the two ids are different values: a caller
 * finds the organization id from `me.get`, which returns it alongside the workspace permissions.
 *
 * Teams are mirrored: configuration, small, and referenced by the workspace-team join. Roles are
 * not - there is nothing to key a row by.
 */

/** Lists the teams in an organization. */
export const listTeams: FormbricksEndpoints['teamsList'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<FormbricksEndpointOutputs['teamsList']>(
		ctx,
		'v2',
		withQuery(
			`organizations/${input.organizationId}/teams`,
			// `skip` on the wire, like every v2 list.
			listParams('skip', input),
		),
	);

	await cacheEntities(ctx.db.teams, FormbricksTeamEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'formbricks.teams.list',
		{
			...auditPayload(input, ['organizationId', 'limit', 'offset']),
			team_count: countOf(result),
		},
		'completed',
	);
	return result;
};

/**
 * Deletes a team.
 *
 * Marked `destructive` - it removes the grouping and with it whatever workspace access the team
 * granted, so members can lose access to a workspace as a side effect.
 *
 * Evicted best-effort: a team record carries a name and its organization and no personal data, so a
 * stale row is untidy rather than a disclosure. Contrast webhooks and attribute keys, where a
 * surviving row misrepresents the account's state.
 */
export const removeTeam: FormbricksEndpoints['teamsDelete'] = async (
	ctx,
	input,
) =>
	await deleteAndEvict(ctx, {
		version: 'v2',
		path: `organizations/${input.organizationId}/teams/${input.teamId}`,
		event: 'formbricks.teams.delete',
		input,
		identifierKeys: ['organizationId', 'teamId'],
		resultId: input.teamId,
		mirror: {
			store: ctx.db.teams,
			entityId: input.teamId,
			label: LABEL,
		},
	});

/**
 * Lists which teams have access to which workspace.
 *
 * The catalog calls this "organizations project teams"; the route is **`workspace-teams`**. That is
 * the same rename as `environmentId` to `workspaceId`, and it is why the catalog entry reads oddly.
 *
 * **Shape observed.** An earlier note here said it could not be, because the list came back empty
 * even with a team present. The missing step was creating the join itself: Formbricks exposes
 * `POST organizations/{id}/workspace-teams` with `{teamId, workspaceId, permission}`, and
 * `POST organizations/{id}/teams` to create the team - **neither of which appears in the catalog**,
 * which is why the first attempt concluded the join was unreachable rather than unseeded.
 *
 * Six fields, no `id`: the row is identified by its `{workspaceId, teamId}` pair.
 */
export const listWorkspaceTeams: FormbricksEndpoints['teamsListWorkspaceTeams'] =
	async (ctx, input) => {
		const result = await formbricksCall<
			FormbricksEndpointOutputs['teamsListWorkspaceTeams']
		>(
			ctx,
			'v2',
			withQuery(
				`organizations/${input.organizationId}/workspace-teams`,
				listParams('skip', input),
			),
		);

		await logEventFromContext(
			ctx,
			'formbricks.teams.listWorkspaceTeams',
			{
				...auditPayload(input, ['organizationId', 'limit', 'offset']),
				workspace_team_count: countOf(result),
			},
			'completed',
		);
		return result;
	};

/**
 * Lists the organization roles a member can hold.
 *
 * **Returns bare strings**, not objects: `["owner","manager","member","billing"]`. Worth stating
 * because an earlier reading of the recon output reported this endpoint as having "6 fields" - the
 * reporter had printed `'string'.length`. A plausible number from a broken measurement, and the
 * reason `FormbricksRole` is a string schema rather than an object.
 *
 * Not mirrored: four constants with nothing to key a row by.
 */
export const listRoles: FormbricksEndpoints['rolesList'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<FormbricksEndpointOutputs['rolesList']>(
		ctx,
		'v2',
		'roles',
	);

	await logEventFromContext(
		ctx,
		'formbricks.roles.list',
		{ role_count: countOf(result) },
		'completed',
	);
	return result;
};
