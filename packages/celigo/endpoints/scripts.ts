import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const get: CeligoEndpoints['scriptsGet'] = (ctx, input) =>
	callCeligo(ctx, 'scripts.get', In.scriptsGet, Out.scriptsGet, input, (i) => ({
		method: 'GET',
		save: 'scripts',
		path: ['scripts', i.id],
	}));

export const create: CeligoEndpoints['scriptsCreate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'scripts.create',
		In.scriptsCreate,
		Out.scriptsCreate,
		input,
		(i) => ({
			method: 'POST',
			save: 'scripts',
			path: ['scripts'],
			body: i,
		}),
	);

export const update: CeligoEndpoints['scriptsUpdate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'scripts.update',
		In.scriptsUpdate,
		Out.scriptsUpdate,
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			save: 'scripts',
			path: ['scripts', id],
			body,
		}),
	);

export const remove: CeligoEndpoints['scriptsDelete'] = (ctx, input) =>
	callCeligo(
		ctx,
		'scripts.delete',
		In.scriptsDelete,
		Out.scriptsDelete,
		input,
		(i) => ({
			method: 'DELETE',
			drop: 'scripts',
			path: ['scripts', i.id],
			empty: { success: true },
		}),
	);

export const getLogs: CeligoEndpoints['scriptsGetLogs'] = (ctx, input) =>
	callCeligo(
		ctx,
		'scripts.getLogs',
		In.scriptsGetLogs,
		Out.scriptsGetLogs,
		input,
		(i) => ({
			method: 'GET',
			path: ['scripts', i.id, 'logs'],
			query: {
				time_lte: i.time_lte,
				time_gt: i.time_gt,
				_flowId: i._flowId,
				_resourceId: i._resourceId,
				functionType: i.functionType,
			},
		}),
	);
