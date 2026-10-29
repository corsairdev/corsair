import { makeEverhourRequest } from '../client';
import type { EverhourEndpoints } from '../index';
import type { EverhourClient } from '../schema/database';

export const listClients: EverhourEndpoints['listClients'] = async (
	ctx,
	options = {},
) => {
	return makeEverhourRequest<EverhourClient[]>('/clients', ctx.key, {
		method: 'GET',
		query: options.query,
	});
};

export const getClient: EverhourEndpoints['getClient'] = async (
	ctx,
	options,
) => {
	return makeEverhourRequest<EverhourClient>(
		`/clients/${options.clientId}`,
		ctx.key,
	);
};

export const createClient: EverhourEndpoints['createClient'] = async (
	ctx,
	options,
) => {
	const { name, projects, businessDetails, email, status } = options;
	return makeEverhourRequest<EverhourClient>('/clients', ctx.key, {
		method: 'POST',
		body: { name, projects, businessDetails, email, status },
	});
};

export const updateClient: EverhourEndpoints['updateClient'] = async (
	ctx,
	options,
) => {
	const { clientId, ...body } = options;
	return makeEverhourRequest<EverhourClient>(`/clients/${clientId}`, ctx.key, {
		method: 'PUT',
		body,
	});
};

export const deleteClient: EverhourEndpoints['deleteClient'] = async (
	ctx,
	options,
) => {
	return makeEverhourRequest<void>(`/clients/${options.clientId}`, ctx.key, {
		method: 'DELETE',
	});
};
