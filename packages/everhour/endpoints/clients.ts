import { makeEverhourRequest } from '../client';
import type { EverhourClient } from '../schema/database';

export const listClients = async (
	ctx: any,
	options: { query?: Record<string, string | number | boolean> } = {},
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

export const createClient = async (
	ctx: any,
	options: {
		name: string;
		projects?: string[];
		businessDetails?: string;
		email?: string[];
		status?: string;
	},
) => {
	const { name, projects, businessDetails, email, status } = options;
	return makeEverhourRequest<EverhourClient>('/clients', ctx.key, {
		method: 'POST',
		body: { name, projects, businessDetails, email, status },
	});
};

export const updateClient = async (
	ctx: any,
	options: {
		clientId: string;
		name?: string;
		projects?: string[];
		businessDetails?: string;
		email?: string[];
		status?: string;
	},
) => {
	const { clientId, ...body } = options;
	return makeEverhourRequest<EverhourClient>(`/clients/${clientId}`, ctx.key, {
		method: 'PUT',
		body,
	});
};

export const deleteClient = async (ctx: any, options: { clientId: string }) => {
	return makeEverhourRequest<void>(`/clients/${options.clientId}`, ctx.key, {
		method: 'DELETE',
	});
};
