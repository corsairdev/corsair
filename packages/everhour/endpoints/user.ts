import { makeEverhourRequest } from '../client';
import type { EverhourUser } from '../schema/database';

export const getUser = async (ctx: any) => {
	return makeEverhourRequest<EverhourUser>('/users/me', ctx.key);
};

export const listTeamUsers = async (
	ctx: any,
	options: { query?: Record<string, any>; limit?: number } = {},
) => {
	return makeEverhourRequest<EverhourUser[]>('/team/users', ctx.key, {
		method: 'GET',
		query: {
			...options.query,
			...(options.limit !== undefined ? { limit: options.limit } : {}),
		},
	});
};

export const listTeams = async (ctx: any) => {
	const me = await makeEverhourRequest<EverhourUser>('/users/me', ctx.key);
	return me.team != null ? [me.team] : [me];
};
