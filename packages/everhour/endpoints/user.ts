import { makeEverhourRequest } from '../client';
import type { EverhourUser } from '../schema/database';

export const getUser = async (ctx: any) => {
	return makeEverhourRequest<EverhourUser>('/users/me', ctx.key);
};

export const listTeamUsers = async (
	ctx: any,
	options: { query?: Record<string, any> } = {},
) => {
	return makeEverhourRequest<EverhourUser[]>('/team/users', ctx.key, {
		method: 'GET',
		query: options.query,
	});
};
