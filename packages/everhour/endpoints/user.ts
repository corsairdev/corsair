import { makeEverhourRequest } from '../client';
import type { EverhourEndpoints } from '../index';
import type { EverhourUser } from '../schema/database';

export const getUser: EverhourEndpoints['getUser'] = async (ctx) => {
	return makeEverhourRequest<EverhourUser>('/users/me', ctx.key);
};

export const listTeamUsers: EverhourEndpoints['listTeamUsers'] = async (
	ctx,
	options = {},
) => {
	return makeEverhourRequest<EverhourUser[]>('/team/users', ctx.key, {
		method: 'GET',
		query: {
			...options.query,
			...(options.limit !== undefined ? { limit: options.limit } : {}),
		},
	});
};

export const listTeams: EverhourEndpoints['listTeams'] = async (ctx) => {
	const me = await makeEverhourRequest<EverhourUser>('/users/me', ctx.key);
	return me.team != null ? [me.team] : [me];
};
