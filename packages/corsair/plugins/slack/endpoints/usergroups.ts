import type { CorsairEndpoint, CorsairPluginContext } from '../../../core';
import type { SlackSchema } from '../schema';
import { makeSlackRequest } from '../client';

export const create = (token: string): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ name: string; channels?: string; description?: string; handle?: string; include_count?: boolean; team_id?: string; token?: string }],
	Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>('usergroups.create', token || input.token || '', {
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

		if (result.ok && result.usergroup && ctx.usergroups) {
			try {
				await ctx.usergroups.upsertByResourceId({
					resourceId: result.usergroup.id,
					data: {
						id: result.usergroup.id,
						name: result.usergroup.name,
						description: input.description,
						handle: input.handle,
						date_create: Date.now(),
					},
				});
			} catch (error) {
				console.warn('Failed to save usergroup to database:', error);
			}
		}

		return result;
	};
};

export const disable = (token: string): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ usergroup: string; include_count?: boolean; team_id?: string; token?: string }],
	Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>('usergroups.disable', token || input.token || '', {
			method: 'POST',
			body: {
				usergroup: input.usergroup,
				include_count: input.include_count,
				team_id: input.team_id,
			},
		});

		if (result.ok && result.usergroup && ctx.usergroups) {
			try {
				const existing = await ctx.usergroups.findByResourceId(input.usergroup);
				await ctx.usergroups.upsertByResourceId({
					resourceId: result.usergroup.id,
					data: {
						...(existing || { id: result.usergroup.id }),
						date_update: Date.now(),
					},
				});
			} catch (error) {
				console.warn('Failed to update usergroup in database:', error);
			}
		}

		return result;
	};
};

export const enable = (token: string): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ usergroup: string; include_count?: boolean; team_id?: string; token?: string }],
	Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>('usergroups.enable', token || input.token || '', {
			method: 'POST',
			body: {
				usergroup: input.usergroup,
				include_count: input.include_count,
				team_id: input.team_id,
			},
		});

		if (result.ok && result.usergroup && ctx.usergroups) {
			try {
				const existing = await ctx.usergroups.findByResourceId(input.usergroup);
				await ctx.usergroups.upsertByResourceId({
					resourceId: result.usergroup.id,
					data: {
						...(existing || { id: result.usergroup.id }),
						date_update: Date.now(),
					},
				});
			} catch (error) {
				console.warn('Failed to update usergroup in database:', error);
			}
		}

		return result;
	};
};

export const list = (token: string): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ include_count?: boolean; include_disabled?: boolean; include_users?: boolean; team_id?: string; token?: string }],
	Promise<{ ok: boolean; usergroups?: Array<{ id: string; name?: string }>; error?: string }>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{ ok: boolean; usergroups?: Array<{ id: string; name?: string }>; error?: string }>('usergroups.list', token || input.token || '', {
			method: 'GET',
			query: {
				include_count: input.include_count,
				include_disabled: input.include_disabled,
				include_users: input.include_users,
				team_id: input.team_id,
			},
		});

		if (result.ok && result.usergroups && ctx.usergroups) {
			try {
				for (const usergroup of result.usergroups) {
					if (usergroup.id) {
						await ctx.usergroups.upsertByResourceId({
							resourceId: usergroup.id,
							data: {
								id: usergroup.id,
								name: usergroup.name,
							},
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save usergroups to database:', error);
			}
		}

		return result;
	};
};

export const update = (token: string): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ usergroup: string; name?: string; channels?: string; description?: string; handle?: string; include_count?: boolean; team_id?: string; token?: string }],
	Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>('usergroups.update', token || input.token || '', {
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

		if (result.ok && result.usergroup && ctx.usergroups) {
			try {
				const existing = await ctx.usergroups.findByResourceId(input.usergroup);
				await ctx.usergroups.upsertByResourceId({
					resourceId: result.usergroup.id,
					data: {
						...(existing || { id: result.usergroup.id }),
						name: result.usergroup.name || input.name,
						description: input.description,
						handle: input.handle,
						date_update: Date.now(),
					},
				});
			} catch (error) {
				console.warn('Failed to update usergroup in database:', error);
			}
		}

		return result;
	};
};

