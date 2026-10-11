import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const list: CeligoEndpoints['iClientsList'] = (ctx, input) =>
	callCeligo(
		ctx,
		'iClients.list',
		In.iClientsList,
		Out.iClientsList,
		input,
		(i) => ({
			method: 'GET',
			path: ['iclients'],
			query: { limit: i.limit, after: i.after },
			empty: [],
		}),
	);

export const get: CeligoEndpoints['iClientsGet'] = (ctx, input) =>
	callCeligo(
		ctx,
		'iClients.get',
		In.iClientsGet,
		Out.iClientsGet,
		input,
		(i) => ({
			method: 'GET',
			path: ['iclients', i.id],
		}),
	);

export const create: CeligoEndpoints['iClientsCreate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'iClients.create',
		In.iClientsCreate,
		Out.iClientsCreate,
		input,
		(i) => ({
			method: 'POST',
			path: ['iclients'],
			body: i,
		}),
	);

export const update: CeligoEndpoints['iClientsUpdate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'iClients.update',
		In.iClientsUpdate,
		Out.iClientsUpdate,
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: ['iclients', id],
			body,
		}),
	);

export const patch: CeligoEndpoints['iClientsPatch'] = (ctx, input) =>
	callCeligo(
		ctx,
		'iClients.patch',
		In.iClientsPatch,
		Out.iClientsPatch,
		input,
		(i) => ({
			method: 'PATCH',
			path: ['iclients', i.id],
			body: i.operations,
			empty: { success: true },
		}),
	);

export const remove: CeligoEndpoints['iClientsDelete'] = (ctx, input) =>
	callCeligo(
		ctx,
		'iClients.delete',
		In.iClientsDelete,
		Out.iClientsDelete,
		input,
		(i) => ({
			method: 'DELETE',
			path: ['iclients', i.id],
			empty: { success: true },
		}),
	);
