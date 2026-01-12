import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';

export const get: SlackEndpoints['usersGet'] = async (ctx, input) => {
	const result = await makeSlackRequest<{
		ok: boolean;
		user?: { id: string; name?: string };
		error?: string;
	}>('users.info', ctx.options.botToken, {
		method: 'GET',
		query: {
			user: input.user,
			include_locale: input.include_locale,
		},
	});

	if (result.ok && result.user && ctx.users) {
		try {
			await ctx.users.upsert(result.user.id, {
				id: result.user.id,
				name: result.user.name,
			});
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	return result;
};

export const list: SlackEndpoints['usersList'] = async (ctx, input) => {
	const result = await makeSlackRequest<{
		ok: boolean;
		members?: Array<{ id: string; name?: string }>;
		cache_ts?: number;
		error?: string;
	}>('users.list', ctx.options.botToken, {
		method: 'GET',
		query: {
			include_locale: input.include_locale,
			team_id: input.team_id,
			cursor: input.cursor,
			limit: input.limit,
		},
	});

	if (result.ok && result.members && ctx.users) {
		try {
			for (const member of result.members) {
				if (member.id) {
					await ctx.users.upsert(member.id, {
						id: member.id,
						name: member.name,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save users to database:', error);
		}
	}

	return result;
};

export const getProfile: SlackEndpoints['usersGetProfile'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<{
		ok: boolean;
		profile?: { avatar_hash?: string; real_name?: string };
		error?: string;
	}>('users.profile.get', ctx.options.botToken, {
		method: 'GET',
		query: {
			user: input.user,
			include_labels: input.include_labels,
		},
	});

	if (result.ok && result.profile && input.user && ctx.users) {
		try {
			const existing = await ctx.users.findByResourceId(input.user);
			await ctx.users.upsert(input.user, {
				...(existing?.data || { id: input.user }),
				profile: result.profile,
			});
		} catch (error) {
			console.warn('Failed to update user profile in database:', error);
		}
	}

	return result;
};

export const getPresence: SlackEndpoints['usersGetPresence'] = async (
	ctx,
	input,
) => {
	return makeSlackRequest<{
		ok: boolean;
		presence?: string;
		online?: boolean;
		error?: string;
	}>('users.getPresence', ctx.options.botToken, {
		method: 'GET',
		query: {
			user: input.user,
		},
	});
};

export const updateProfile: SlackEndpoints['usersUpdateProfile'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<{
		ok: boolean;
		profile?: { avatar_hash?: string; real_name?: string };
		error?: string;
	}>('users.profile.set', ctx.options.botToken, {
		method: 'POST',
		body: {
			profile: input.profile,
			user: input.user,
			name: input.name,
			value: input.value,
		},
	});

	if (result.ok && result.profile && input.user && ctx.users) {
		try {
			const existing = await ctx.users.findByResourceId(input.user);
			await ctx.users.upsert(input.user, {
				...(existing?.data || { id: input.user }),
				profile: result.profile,
			});
		} catch (error) {
			console.warn('Failed to update user profile in database:', error);
		}
	}

	return result;
};
