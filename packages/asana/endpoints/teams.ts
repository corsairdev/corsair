import { logEventFromContext } from 'corsair/core';
import type { AsanaEndpoints } from '..';
import { makeAsanaRequest } from '../client';
import type { AsanaEndpointOutputs } from './types';

export const get: AsanaEndpoints['teamsGet'] = async (ctx, input) => {
	const { team_gid, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['teamsGet']>(
		`teams/${team_gid}`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.data?.gid && ctx.db.teams) {
		try {
			await ctx.db.teams.upsertByEntityId(result.data.gid, { ...result.data });
		} catch (error) {
			console.warn('Failed to save team to database:', error);
		}
	}

	await logEventFromContext(ctx, 'asana.teams.get', { team_gid }, 'completed');
	return result;
};

export const listForUser: AsanaEndpoints['teamsListForUser'] = async (
	ctx,
	input,
) => {
	const { user_gid, organization, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = {
		organization,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['teamsListForUser']
	>(`users/${user_gid}/teams`, ctx.key, { method: 'GET', query });

	if (result.data?.length && ctx.db.teams) {
		try {
			for (const team of result.data) {
				if (team.gid) {
					await ctx.db.teams.upsertByEntityId(team.gid, { ...team });
				}
			}
		} catch (error) {
			console.warn('Failed to save user teams to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.teams.listForUser',
		{ user_gid },
		'completed',
	);
	return result;
};

export const listForWorkspace: AsanaEndpoints['teamsListForWorkspace'] = async (
	ctx,
	input,
) => {
	const { workspace_gid, limit, offset, opt_fields, opt_pretty } = input;
	const query: Record<string, string | number | boolean | undefined> = {
		limit,
		offset,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['teamsListForWorkspace']
	>(`workspaces/${workspace_gid}/teams`, ctx.key, { method: 'GET', query });

	if (result.data?.length && ctx.db.teams) {
		try {
			for (const team of result.data) {
				if (team.gid) {
					await ctx.db.teams.upsertByEntityId(team.gid, { ...team });
				}
			}
		} catch (error) {
			console.warn('Failed to save workspace teams to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.teams.listForWorkspace',
		{ workspace_gid },
		'completed',
	);
	return result;
};

export const create: AsanaEndpoints['teamsCreate'] = async (ctx, input) => {
	const { workspace_gid, data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['teamsCreate']>(
		`workspaces/${workspace_gid}/teams`,
		ctx.key,
		{ method: 'POST', body: { data }, query },
	);

	if (result.data?.gid && ctx.db.teams) {
		try {
			await ctx.db.teams.upsertByEntityId(result.data.gid, { ...result.data });
		} catch (error) {
			console.warn('Failed to save team to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.teams.create',
		{ workspace_gid, name: data.name },
		'completed',
	);
	return result;
};

export const update: AsanaEndpoints['teamsUpdate'] = async (ctx, input) => {
	const { team_gid, data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['teamsUpdate']>(
		`teams/${team_gid}`,
		ctx.key,
		{ method: 'PUT', body: { data }, query },
	);

	if (result.data?.gid && ctx.db.teams) {
		try {
			await ctx.db.teams.upsertByEntityId(result.data.gid, { ...result.data });
		} catch (error) {
			console.warn('Failed to update team in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.teams.update',
		{ team_gid },
		'completed',
	);
	return result;
};

export const addUser: AsanaEndpoints['teamsAddUser'] = async (ctx, input) => {
	const { team_gid, user, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['teamsAddUser']>(
		`teams/${team_gid}/addUser`,
		ctx.key,
		{ method: 'POST', body: { data: { user } }, query },
	);

	await logEventFromContext(
		ctx,
		'asana.teams.addUser',
		{ team_gid, user },
		'completed',
	);
	return result;
};

export const removeUser: AsanaEndpoints['teamsRemoveUser'] = async (
	ctx,
	input,
) => {
	const { team_gid, user, opt_pretty } = input;
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['teamsRemoveUser']
	>(`teams/${team_gid}/removeUser`, ctx.key, {
		method: 'POST',
		body: { data: { user } },
		query: { opt_pretty },
	});

	await logEventFromContext(
		ctx,
		'asana.teams.removeUser',
		{ team_gid, user },
		'completed',
	);
	return result;
};

export const membershipsList: AsanaEndpoints['teamMembershipsList'] = async (
	ctx,
	input,
) => {
	const { opt_fields, opt_pretty, ...rest } = input;
	const query: Record<string, string | number | boolean | undefined> = {
		...rest,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['teamMembershipsList']
	>('team_memberships', ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'asana.teams.membershipsList',
		{ ...rest },
		'completed',
	);
	return result;
};

export const membershipsGet: AsanaEndpoints['teamMembershipsGet'] = async (
	ctx,
	input,
) => {
	const { team_membership_gid, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['teamMembershipsGet']
	>(`team_memberships/${team_membership_gid}`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'asana.teams.membershipsGet',
		{ team_membership_gid },
		'completed',
	);
	return result;
};

export const membershipsListForTeam: AsanaEndpoints['teamMembershipsListForTeam'] =
	async (ctx, input) => {
		const { team_gid, limit, offset, opt_fields, opt_pretty } = input;
		const query: Record<string, string | number | boolean | undefined> = {
			limit,
			offset,
			opt_pretty,
		};
		if (opt_fields?.length) {
			query.opt_fields = opt_fields.join(',');
		}
		const result = await makeAsanaRequest<
			AsanaEndpointOutputs['teamMembershipsListForTeam']
		>(`teams/${team_gid}/team_memberships`, ctx.key, { method: 'GET', query });

		await logEventFromContext(
			ctx,
			'asana.teams.membershipsListForTeam',
			{ team_gid },
			'completed',
		);
		return result;
	};

export const membershipsListForUser: AsanaEndpoints['teamMembershipsListForUser'] =
	async (ctx, input) => {
		const { user_gid, workspace, limit, offset, opt_fields, opt_pretty } =
			input;
		const query: Record<string, string | number | boolean | undefined> = {
			workspace,
			limit,
			offset,
			opt_pretty,
		};
		if (opt_fields?.length) {
			query.opt_fields = opt_fields.join(',');
		}
		const result = await makeAsanaRequest<
			AsanaEndpointOutputs['teamMembershipsListForUser']
		>(`users/${user_gid}/team_memberships`, ctx.key, { method: 'GET', query });

		await logEventFromContext(
			ctx,
			'asana.teams.membershipsListForUser',
			{ user_gid },
			'completed',
		);
		return result;
	};
