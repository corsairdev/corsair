import { makeEverhourRequest } from '../client';
import type { EverhourClient } from '../schema/database';

export const listClients = async (
	ctx: any,
	options: { query?: Record<string, any> } = {},
) => {
	return makeEverhourRequest<EverhourClient[]>('/clients', ctx.key, {
		method: 'GET',
		query: options.query,
	});
};

export const getClient = async (ctx: any, options: { clientId: string }) => {
	return makeEverhourRequest<EverhourClient>(
		`/clients/${options.clientId}`,
		ctx.key,
	);
};
