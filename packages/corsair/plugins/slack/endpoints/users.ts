import type { CorsairEndpoint, CorsairPluginContext } from '../../../core';
import { makeSlackRequest } from '../client';
import type { SlackSchema } from '../schema';

export const get = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ user: string; include_locale?: boolean; token?: string }],
	Promise<{ ok: boolean; user?: { id: string; name?: string }; error?: string }>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			user?: { id: string; name?: string };
			error?: string;
		}>('users.info', token || input.token || '', {
			method: 'GET',
			query: {
				user: input.user,
				include_locale: input.include_locale,
			},
		});

		if (result.ok && result.user && ctx.users) {
			try {
				await ctx.users.upsertByResourceId({
					resourceId: result.user.id,
					data: {
						id: result.user.id,
						name: result.user.name,
					},
				});
			} catch (error) {
				console.warn('Failed to save user to database:', error);
			}
		}

		return result;
	};
};

export const list = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[
		{
			include_locale?: boolean;
			team_id?: string;
			cursor?: string;
			limit?: number;
			token?: string;
		},
	],
	Promise<{
		ok: boolean;
		members?: Array<{ id: string; name?: string }>;
		cache_ts?: number;
		error?: string;
	}>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			members?: Array<{ id: string; name?: string }>;
			cache_ts?: number;
			error?: string;
		}>('users.list', token || input.token || '', {
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
						await ctx.users.upsertByResourceId({
							resourceId: member.id,
							data: {
								id: member.id,
								name: member.name,
							},
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save users to database:', error);
			}
		}

		return result;
	};
};

export const getProfile = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ user?: string; include_labels?: boolean; token?: string }],
	Promise<{
		ok: boolean;
		profile?: { avatar_hash?: string; real_name?: string };
		error?: string;
	}>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			profile?: { avatar_hash?: string; real_name?: string };
			error?: string;
		}>('users.profile.get', token || input.token || '', {
			method: 'GET',
			query: {
				user: input.user,
				include_labels: input.include_labels,
			},
		});

		if (result.ok && result.profile && input.user && ctx.users) {
			try {
				const existing = await ctx.users.findByResourceId(input.user);
				await ctx.users.upsertByResourceId({
					resourceId: input.user,
					data: {
						...(existing || { id: input.user }),
						profile: result.profile,
					},
				});
			} catch (error) {
				console.warn('Failed to update user profile in database:', error);
			}
		}

		return result;
	};
};

export const getPresence = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ user?: string; token?: string }],
	Promise<{ ok: boolean; presence?: string; online?: boolean; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest<{
			ok: boolean;
			presence?: string;
			online?: boolean;
			error?: string;
		}>('users.getPresence', token || input.token || '', {
			method: 'GET',
			query: {
				user: input.user,
			},
		});
	};
};

export const updateProfile = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[
		{
			profile?: Record<string, unknown>;
			user?: string;
			name?: string;
			value?: string;
			token?: string;
		},
	],
	Promise<{
		ok: boolean;
		profile?: { avatar_hash?: string; real_name?: string };
		error?: string;
	}>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			profile?: { avatar_hash?: string; real_name?: string };
			error?: string;
		}>('users.profile.set', token || input.token || '', {
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
				await ctx.users.upsertByResourceId({
					resourceId: input.user,
					data: {
						...(existing || { id: input.user }),
						profile: result.profile,
					},
				});
			} catch (error) {
				console.warn('Failed to update user profile in database:', error);
			}
		}

		return result;
	};
};
