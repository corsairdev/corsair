import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const list: CeligoEndpoints['importsList'] = (ctx, input) =>
	callCeligo(
		ctx,
		'imports.list',
		In.importsList,
		Out.importsList,
		input,
		(i) => ({
			method: 'GET',
			path: ['imports'],
			query: {
				externalId: i.externalId,
				include: i.include,
				exclude: i.exclude,
			},
			empty: [],
		}),
	);

export const get: CeligoEndpoints['importsGet'] = (ctx, input) =>
	callCeligo(ctx, 'imports.get', In.importsGet, Out.importsGet, input, (i) => ({
		method: 'GET',
		path: ['imports', i.id],
	}));

export const create: CeligoEndpoints['importsCreate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'imports.create',
		In.importsCreate,
		Out.importsCreate,
		input,
		(i) => ({
			method: 'POST',
			path: ['imports'],
			body: i,
		}),
	);

export const update: CeligoEndpoints['importsUpdate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'imports.update',
		In.importsUpdate,
		Out.importsUpdate,
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: ['imports', id],
			body,
		}),
	);

export const patch: CeligoEndpoints['importsPatch'] = (ctx, input) =>
	callCeligo(
		ctx,
		'imports.patch',
		In.importsPatch,
		Out.importsPatch,
		input,
		(i) => ({
			method: 'PATCH',
			path: ['imports', i.id],
			body: i.operations,
			empty: { success: true },
		}),
	);

export const remove: CeligoEndpoints['importsDelete'] = (ctx, input) =>
	callCeligo(
		ctx,
		'imports.delete',
		In.importsDelete,
		Out.importsDelete,
		input,
		(i) => ({
			method: 'DELETE',
			path: ['imports', i.id],
			empty: { success: true },
		}),
	);

export const clone: CeligoEndpoints['importsClone'] = (ctx, input) =>
	callCeligo(
		ctx,
		'imports.clone',
		In.importsClone,
		Out.importsClone,
		input,
		({ id, ...body }) => ({
			method: 'POST',
			path: ['imports', id, 'clone'],
			body,
		}),
	);

export const getAudit: CeligoEndpoints['importsGetAudit'] = (ctx, input) =>
	callCeligo(
		ctx,
		'imports.getAudit',
		In.importsGetAudit,
		Out.importsGetAudit,
		input,
		(i) => ({
			method: 'GET',
			path: ['imports', i.id, 'audit'],
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

export const getDependencies: CeligoEndpoints['importsGetDependencies'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'imports.getDependencies',
		In.importsGetDependencies,
		Out.importsGetDependencies,
		input,
		(i) => ({
			method: 'GET',
			path: ['imports', i.id, 'dependencies'],
		}),
	);

export const invoke: CeligoEndpoints['importsInvoke'] = (ctx, input) =>
	callCeligo(
		ctx,
		'imports.invoke',
		In.importsInvoke,
		Out.importsInvoke,
		input,
		({ id, ...body }) => ({
			method: 'POST',
			path: ['imports', id, 'invoke'],
			body,
		}),
	);
