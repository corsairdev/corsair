import { logEventFromContext } from 'corsair/core';
import type { AsanaEndpoints } from '..';
import { makeAsanaRequest } from '../client';
import type { AsanaEndpointOutputs } from './types';

export const get: AsanaEndpoints['usersGet'] = async (ctx, input) => {
	const { user_gid, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['usersGet']>(
		`users/${user_gid}`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.data?.gid && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(result.data.gid, { ...result.data });
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(ctx, 'asana.users.get', { user_gid }, 'completed');
	return result;
};

export const list: AsanaEndpoints['usersList'] = async (ctx, input) => {
	const { opt_fields, opt_pretty, ...rest } = input;
	const query: Record<string, string | number | boolean | undefined> = {
		...rest,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['usersList']>(
		'users',
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.data?.length && ctx.db.users) {
		try {
			for (const user of result.data) {
				if (user.gid) {
					await ctx.db.users.upsertByEntityId(user.gid, { ...user });
				}
			}
		} catch (error) {
			console.warn('Failed to save users to database:', error);
		}
	}

	await logEventFromContext(ctx, 'asana.users.list', { ...rest }, 'completed');
	return result;
};

export const getCurrent: AsanaEndpoints['usersGetCurrent'] = async (
	ctx,
	input,
) => {
	const { opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['usersGetCurrent']
	>('users/me', ctx.key, { method: 'GET', query });

	if (result.data?.gid && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(result.data.gid, { ...result.data });
		} catch (error) {
			console.warn('Failed to save current user to database:', error);
		}
	}

	await logEventFromContext(ctx, 'asana.users.getCurrent', {}, 'completed');
	return result;
};

export const listForWorkspace: AsanaEndpoints['usersListForWorkspace'] = async (
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
		AsanaEndpointOutputs['usersListForWorkspace']
	>(`workspaces/${workspace_gid}/users`, ctx.key, { method: 'GET', query });

	if (result.data?.length && ctx.db.users) {
		try {
			for (const user of result.data) {
				if (user.gid) {
					await ctx.db.users.upsertByEntityId(user.gid, { ...user });
				}
			}
		} catch (error) {
			console.warn('Failed to save workspace users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.users.listForWorkspace',
		{ workspace_gid },
		'completed',
	);
	return result;
};

export const listForTeam: AsanaEndpoints['usersListForTeam'] = async (
	ctx,
	input,
) => {
	const { team_gid, offset, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = {
		offset,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['usersListForTeam']
	>(`teams/${team_gid}/users`, ctx.key, { method: 'GET', query });

	if (result.data?.length && ctx.db.users) {
		try {
			for (const user of result.data) {
				if (user.gid) {
					await ctx.db.users.upsertByEntityId(user.gid, { ...user });
				}
			}
		} catch (error) {
			console.warn('Failed to save team users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.users.listForTeam',
		{ team_gid },
		'completed',
	);
	return result;
};

export const getTaskList: AsanaEndpoints['usersGetTaskList'] = async (
	ctx,
	input,
) => {
	const { user_gid, workspace, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = {
		workspace,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['usersGetTaskList']
	>(`users/${user_gid}/user_task_list`, ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'asana.users.getTaskList',
		{ user_gid },
		'completed',
	);
	return result;
};

export const getUserTaskList: AsanaEndpoints['usersGetUserTaskList'] = async (
	ctx,
	input,
) => {
	const { user_task_list_gid, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['usersGetUserTaskList']
	>(`user_task_lists/${user_task_list_gid}`, ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'asana.users.getUserTaskList',
		{ user_task_list_gid },
		'completed',
	);
	return result;
};

export const getFavorites: AsanaEndpoints['usersGetFavorites'] = async (
	ctx,
	input,
) => {
	const { user_gid, resource_type, workspace, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = {
		resource_type,
		workspace,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['usersGetFavorites']
	>(`users/${user_gid}/favorites`, ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'asana.users.getFavorites',
		{ user_gid },
		'completed',
	);
	return result;
};
