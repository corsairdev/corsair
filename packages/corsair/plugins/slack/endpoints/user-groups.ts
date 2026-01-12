import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';

export const create: SlackEndpoints['userGroupsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<{
		ok: boolean;
		usergroup?: { id: string; name?: string };
		error?: string;
	}>('userGroups.create', ctx.options.botToken, {
		method: 'POST',
		body: {
			name: input.name,
			channels: input.channels,
			description: input.description,
			handle: input.handle,
			include_count: input.include_count,
			team_id: input.team_id,
		},
	});

	if (result.ok && result.usergroup && ctx.userGroups) {
		try {
			await ctx.userGroups.upsert(result.usergroup.id, {
				id: result.usergroup.id,
				name: result.usergroup.name,
				description: input.description,
				handle: input.handle,
				date_create: Date.now(),
			});
		} catch (error) {
			console.warn('Failed to save usergroup to database:', error);
		}
	}

	return result;
};

export const disable: SlackEndpoints['userGroupsDisable'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<{
		ok: boolean;
		usergroup?: { id: string; name?: string };
		error?: string;
	}>('userGroups.disable', ctx.options.botToken, {
		method: 'POST',
		body: {
			usergroup: input.usergroup,
			include_count: input.include_count,
			team_id: input.team_id,
		},
	});

	if (result.ok && result.usergroup && ctx.userGroups) {
		try {
			const existing = await ctx.userGroups.findByResourceId(input.usergroup);
			await ctx.userGroups.upsert(result.usergroup.id, {
				...(existing?.data || { id: result.usergroup.id }),
				date_update: Date.now(),
			});
		} catch (error) {
			console.warn('Failed to update usergroup in database:', error);
		}
	}

	return result;
};

export const enable: SlackEndpoints['userGroupsEnable'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<{
		ok: boolean;
		usergroup?: { id: string; name?: string };
		error?: string;
	}>('userGroups.enable', ctx.options.botToken, {
		method: 'POST',
		body: {
			usergroup: input.usergroup,
			include_count: input.include_count,
			team_id: input.team_id,
		},
	});

	if (result.ok && result.usergroup && ctx.userGroups) {
		try {
			const existing = await ctx.userGroups.findByResourceId(input.usergroup);
			await ctx.userGroups.upsert(result.usergroup.id, {
				...(existing?.data || { id: result.usergroup.id }),
				date_update: Date.now(),
			});
		} catch (error) {
			console.warn('Failed to update usergroup in database:', error);
		}
	}

	return result;
};

export const list: SlackEndpoints['userGroupsList'] = async (ctx, input) => {
	const result = await makeSlackRequest<{
		ok: boolean;
		userGroups?: Array<{ id: string; name?: string }>;
		error?: string;
	}>('userGroups.list', ctx.options.botToken, {
		method: 'GET',
		query: {
			include_count: input.include_count,
			include_disabled: input.include_disabled,
			include_users: input.include_users,
			team_id: input.team_id,
		},
	});

	if (result.ok && result.userGroups && ctx.userGroups) {
		try {
			for (const usergroup of result.userGroups) {
				if (usergroup.id) {
					await ctx.userGroups.upsert(usergroup.id, {
						id: usergroup.id,
						name: usergroup.name,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save userGroups to database:', error);
		}
	}

	return result;
};

export const update: SlackEndpoints['userGroupsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<{
		ok: boolean;
		usergroup?: { id: string; name?: string };
		error?: string;
	}>('userGroups.update', ctx.options.botToken, {
		method: 'POST',
		body: {
			usergroup: input.usergroup,
			name: input.name,
			channels: input.channels,
			description: input.description,
			handle: input.handle,
			include_count: input.include_count,
			team_id: input.team_id,
		},
	});

	if (result.ok && result.usergroup && ctx.userGroups) {
		try {
			const existing = await ctx.userGroups.findByResourceId(input.usergroup);
			await ctx.userGroups.upsert(result.usergroup.id, {
				...(existing?.data || { id: result.usergroup.id }),
				name: result.usergroup.name || input.name,
				description: input.description,
				handle: input.handle,
				date_update: Date.now(),
			});
		} catch (error) {
			console.warn('Failed to update usergroup in database:', error);
		}
	}

	return result;
};
