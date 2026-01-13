import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';
import type { SlackEndpointOutputs } from '../types';

export const get: SlackEndpoints['usersGet'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['usersGet']>(
		'users.info',
		ctx.options.botToken,
		{
			method: 'GET',
			query: {
				user: input.user,
				include_locale: input.include_locale,
			},
		},
	);

	if (result.ok && result.user && ctx.db.users) {
		try {
			await ctx.db.users.upsert(result.user.id, {
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
	const result = await makeSlackRequest<SlackEndpointOutputs['usersList']>(
		'users.list',
		ctx.options.botToken,
		{
			method: 'GET',
			query: {
				include_locale: input.include_locale,
				team_id: input.team_id,
				cursor: input.cursor,
				limit: input.limit,
			},
		},
	);

	if (result.ok && result.members && ctx.db.users) {
		try {
			for (const member of result.members) {
				if (member.id) {
					await ctx.db.users.upsert(member.id, {
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
	const result = await makeSlackRequest<
		SlackEndpointOutputs['usersGetProfile']
	>('users.profile.get', ctx.options.botToken, {
		method: 'GET',
		query: {
			user: input.user,
			include_labels: input.include_labels,
		},
	});

	if (result.ok && result.profile && input.user && ctx.db.users) {
		try {
			const existing = await ctx.db.users.findByResourceId(input.user);
			await ctx.db.users.upsert(input.user, {
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
	return makeSlackRequest<SlackEndpointOutputs['usersGetPresence']>(
		'users.getPresence',
		ctx.options.botToken,
		{
			method: 'GET',
			query: {
				user: input.user,
			},
		},
	);
};

export const updateProfile: SlackEndpoints['usersUpdateProfile'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['usersUpdateProfile']
	>('users.profile.set', ctx.options.botToken, {
		method: 'POST',
		body: {
			profile: input.profile,
			user: input.user,
			name: input.name,
			value: input.value,
		},
	});

	if (result.ok && result.profile && input.user && ctx.db.users) {
		try {
			const existing = await ctx.db.users.findByResourceId(input.user);
			await ctx.db.users.upsert(input.user, {
				...(existing?.data || { id: input.user }),
				profile: result.profile,
			});
		} catch (error) {
			console.warn('Failed to update user profile in database:', error);
		}
	}

	return result;
};
