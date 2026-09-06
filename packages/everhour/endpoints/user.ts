import { makeEverhourRequest } from '../client';
import type { EverhourUser } from '../schema/database';

export const getUser = async (apiKey: string) => {
	return makeEverhourRequest<EverhourUser>('/users/me', apiKey);
};

export const listTeamUsers = async (
	apiKey: string,
	options: { query?: Record<string, any> } = {},
) => {
	return makeEverhourRequest<EverhourUser[]>('/team/users', apiKey, {
		method: 'GET',
		query: options.query,
	});
};
