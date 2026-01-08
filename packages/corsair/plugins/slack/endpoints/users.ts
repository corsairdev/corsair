import type { CorsairEndpoint, CorsairContext } from '../../../core';
import { makeSlackRequest } from '../client';

export const get = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ user: string; include_locale?: boolean; token?: string }],
	Promise<{ ok: boolean; user?: { id: string; name?: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('users.info', token || input.token || '', {
			method: 'GET',
			query: {
				user: input.user,
				include_locale: input.include_locale,
			},
		});
	};
};

export const list = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ include_locale?: boolean; team_id?: string; cursor?: string; limit?: number; token?: string }],
	Promise<{ ok: boolean; members?: Array<{ id: string; name?: string }>; cache_ts?: number; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('users.list', token || input.token || '', {
			method: 'GET',
			query: {
				include_locale: input.include_locale,
				team_id: input.team_id,
				cursor: input.cursor,
				limit: input.limit,
			},
		});
	};
};

export const getProfile = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ user?: string; include_labels?: boolean; token?: string }],
	Promise<{ ok: boolean; profile?: { avatar_hash?: string; real_name?: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('users.profile.get', token || input.token || '', {
			method: 'GET',
			query: {
				user: input.user,
				include_labels: input.include_labels,
			},
		});
	};
};

export const getPresence = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ user?: string; token?: string }],
	Promise<{ ok: boolean; presence?: string; online?: boolean; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('users.getPresence', token || input.token || '', {
			method: 'GET',
			query: {
				user: input.user,
			},
		});
	};
};

export const updateProfile = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ profile?: Record<string, unknown>; user?: string; name?: string; value?: string; token?: string }],
	Promise<{ ok: boolean; profile?: { avatar_hash?: string; real_name?: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('users.profile.set', token || input.token || '', {
			method: 'POST',
			body: {
				profile: input.profile,
				user: input.user,
				name: input.name,
				value: input.value,
			},
		});
	};
};

