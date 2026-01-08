import type { CorsairEndpoint, CorsairContext } from '../../../core';
import { makeSlackRequest } from '../client';

export const create = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ name: string; channels?: string; description?: string; handle?: string; include_count?: boolean; team_id?: string; token?: string }],
	Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('usergroups.create', token || input.token || '', {
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
	};
};

export const disable = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ usergroup: string; include_count?: boolean; team_id?: string; token?: string }],
	Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('usergroups.disable', token || input.token || '', {
			method: 'POST',
			body: {
				usergroup: input.usergroup,
				include_count: input.include_count,
				team_id: input.team_id,
			},
		});
	};
};

export const enable = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ usergroup: string; include_count?: boolean; team_id?: string; token?: string }],
	Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('usergroups.enable', token || input.token || '', {
			method: 'POST',
			body: {
				usergroup: input.usergroup,
				include_count: input.include_count,
				team_id: input.team_id,
			},
		});
	};
};

export const list = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ include_count?: boolean; include_disabled?: boolean; include_users?: boolean; team_id?: string; token?: string }],
	Promise<{ ok: boolean; usergroups?: Array<{ id: string; name?: string }>; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('usergroups.list', token || input.token || '', {
			method: 'GET',
			query: {
				include_count: input.include_count,
				include_disabled: input.include_disabled,
				include_users: input.include_users,
				team_id: input.team_id,
			},
		});
	};
};

export const update = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ usergroup: string; name?: string; channels?: string; description?: string; handle?: string; include_count?: boolean; team_id?: string; token?: string }],
	Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('usergroups.update', token || input.token || '', {
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
	};
};

