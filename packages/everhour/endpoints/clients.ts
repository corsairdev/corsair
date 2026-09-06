import { makeEverhourRequest } from '../client';
import type { EverhourClient } from '../schema/database';

export const listClients = async (
	apiKey: string,
	options: { query?: Record<string, any> } = {},
) => {
	return makeEverhourRequest<EverhourClient[]>('/clients', apiKey, {
		method: 'GET',
		query: options.query,
	});
};

export const getClient = async (
	apiKey: string,
	options: { clientId: string },
) => {
	return makeEverhourRequest<EverhourClient>(
		`/clients/${options.clientId}`,
		apiKey,
	);
};
