import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const list: CeligoEndpoints['exportsList'] = (ctx, input) =>
	callCeligo(
		ctx,
		'exports.list',
		In.exportsList,
		Out.exportsList,
		input,
		(i) => ({
			method: 'GET',
			save: 'exports',
			path: ['exports'],
			query: {
				externalId: i.externalId,
				limit: i.limit,
				after: i.after,
				include: i.include,
				exclude: i.exclude,
			},
			empty: [],
		}),
	);

export const get: CeligoEndpoints['exportsGet'] = (ctx, input) =>
	callCeligo(ctx, 'exports.get', In.exportsGet, Out.exportsGet, input, (i) => ({
		method: 'GET',
		save: 'exports',
		path: ['exports', i.id],
	}));

export const create: CeligoEndpoints['exportsCreate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'exports.create',
		In.exportsCreate,
		Out.exportsCreate,
		input,
		(i) => ({
			method: 'POST',
			save: 'exports',
			path: ['exports'],
			body: i,
		}),
	);

export const update: CeligoEndpoints['exportsUpdate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'exports.update',
		In.exportsUpdate,
		Out.exportsUpdate,
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			save: 'exports',
			path: ['exports', id],
			body,
		}),
	);

export const patch: CeligoEndpoints['exportsPatch'] = (ctx, input) =>
	callCeligo(
		ctx,
		'exports.patch',
		In.exportsPatch,
		Out.exportsPatch,
		input,
		(i) => ({
			method: 'PATCH',
			path: ['exports', i.id],
			body: i.operations,
			empty: { success: true },
		}),
	);

export const remove: CeligoEndpoints['exportsDelete'] = (ctx, input) =>
	callCeligo(
		ctx,
		'exports.delete',
		In.exportsDelete,
		Out.exportsDelete,
		input,
		(i) => ({
			method: 'DELETE',
			drop: 'exports',
			path: ['exports', i.id],
			empty: { success: true },
		}),
	);

export const clone: CeligoEndpoints['exportsClone'] = (ctx, input) =>
	callCeligo(
		ctx,
		'exports.clone',
		In.exportsClone,
		Out.exportsClone,
		input,
		({ id, ...body }) => ({
			method: 'POST',
			path: ['exports', id, 'clone'],
			body,
		}),
	);

export const getAudit: CeligoEndpoints['exportsGetAudit'] = (ctx, input) =>
	callCeligo(
		ctx,
		'exports.getAudit',
		In.exportsGetAudit,
		Out.exportsGetAudit,
		input,
		(i) => ({
			method: 'GET',
			path: ['exports', i.id, 'audit'],
			query: {
				limit: i.limit,
				after: i.after,
				from: i.from,
				to: i.to,
				action: i.action,
				source: i.source,
				_byUserId: i._byUserId,
			},
			empty: [],
		}),
	);
