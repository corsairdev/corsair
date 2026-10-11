import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const list: CeligoEndpoints['connectionsList'] = (ctx, input) =>
	callCeligo(
		ctx,
		'connections.list',
		In.connectionsList,
		Out.connectionsList,
		input,
		(i) => ({
			method: 'GET',
			path: ['connections'],
			query: {
				limit: i.limit,
				after: i.after,
				include: i.include,
				exclude: i.exclude,
				fetchQueueSize: i.fetchQueueSize,
				externalId: i.externalId,
			},
			empty: [],
		}),
	);

export const get: CeligoEndpoints['connectionsGet'] = (ctx, input) =>
	callCeligo(
		ctx,
		'connections.get',
		In.connectionsGet,
		Out.connectionsGet,
		input,
		(i) => ({
			method: 'GET',
			path: ['connections', i.id],
		}),
	);

export const create: CeligoEndpoints['connectionsCreate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'connections.create',
		In.connectionsCreate,
		Out.connectionsCreate,
		input,
		(i) => ({
			method: 'POST',
			path: ['connections'],
			body: i,
		}),
	);

export const update: CeligoEndpoints['connectionsUpdate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'connections.update',
		In.connectionsUpdate,
		Out.connectionsUpdate,
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: ['connections', id],
			body,
		}),
	);

export const patch: CeligoEndpoints['connectionsPatch'] = (ctx, input) =>
	callCeligo(
		ctx,
		'connections.patch',
		In.connectionsPatch,
		Out.connectionsPatch,
		input,
		(i) => ({
			method: 'PATCH',
			path: ['connections', i.id],
			body: i.operations,
			empty: { success: true },
		}),
	);

export const remove: CeligoEndpoints['connectionsDelete'] = (ctx, input) =>
	callCeligo(
		ctx,
		'connections.delete',
		In.connectionsDelete,
		Out.connectionsDelete,
		input,
		(i) => ({
			method: 'DELETE',
			path: ['connections', i.id],
			empty: { success: true },
		}),
	);

export const ping: CeligoEndpoints['connectionsPing'] = (ctx, input) =>
	callCeligo(
		ctx,
		'connections.ping',
		In.connectionsPing,
		Out.connectionsPing,
		input,
		(i) => ({
			method: 'GET',
			path: ['connections', i.id, 'ping'],
		}),
	);

export const testVirtual: CeligoEndpoints['connectionsTestVirtual'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'connections.testVirtual',
		In.connectionsTestVirtual,
		Out.connectionsTestVirtual,
		input,
		(i) => ({
			method: 'POST',
			path: ['connections', 'ping'],
			body: i,
		}),
	);

export const getDebugLogs: CeligoEndpoints['connectionsGetDebugLogs'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'connections.getDebugLogs',
		In.connectionsGetDebugLogs,
		Out.connectionsGetDebugLogs,
		input,
		(i) => ({
			method: 'GET',
			path: ['connections', i.id, 'debug'],
			wrap: 'logs',
		}),
	);

export const getDependencies: CeligoEndpoints['connectionsGetDependencies'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'connections.getDependencies',
		In.connectionsGetDependencies,
		Out.connectionsGetDependencies,
		input,
		(i) => ({
			method: 'GET',
			path: ['connections', i.id, 'dependencies'],
		}),
	);

export const getAudit: CeligoEndpoints['connectionsGetAudit'] = (ctx, input) =>
	callCeligo(
		ctx,
		'connections.getAudit',
		In.connectionsGetAudit,
		Out.connectionsGetAudit,
		input,
		(i) => ({
			method: 'GET',
			path: ['connections', i.id, 'audit'],
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

export const executeVirtualExport: CeligoEndpoints['connectionsExecuteVirtualExport'] =
	(ctx, input) =>
		callCeligo(
			ctx,
			'connections.executeVirtualExport',
			In.connectionsExecuteVirtualExport,
			Out.connectionsExecuteVirtualExport,
			input,
			(i) => ({
				method: 'POST',
				path: ['connections', i.id, 'export'],
				body: { export: i.export },
			}),
		);

export const executeVirtualExportPaged: CeligoEndpoints['connectionsExecuteVirtualExportPaged'] =
	(ctx, input) =>
		callCeligo(
			ctx,
			'connections.executeVirtualExportPaged',
			In.connectionsExecuteVirtualExportPaged,
			Out.connectionsExecuteVirtualExportPaged,
			input,
			(i) => ({
				method: 'POST',
				path: ['connections', i.id, 'export', 'pages'],
				body: { export: i.export, pagedExportState: i.pagedExportState },
			}),
		);

export const executeVirtualImport: CeligoEndpoints['connectionsExecuteVirtualImport'] =
	(ctx, input) =>
		callCeligo(
			ctx,
			'connections.executeVirtualImport',
			In.connectionsExecuteVirtualImport,
			Out.connectionsExecuteVirtualImport,
			input,
			(i) => ({
				method: 'POST',
				path: ['connections', i.id, 'import'],
				body: { import: i.import, data: i.data },
			}),
		);

export const evaluateVirtualImportMap: CeligoEndpoints['connectionsEvaluateVirtualImportMap'] =
	(ctx, input) =>
		callCeligo(
			ctx,
			'connections.evaluateVirtualImportMap',
			In.connectionsEvaluateVirtualImportMap,
			Out.connectionsEvaluateVirtualImportMap,
			input,
			(i) => ({
				method: 'POST',
				path: ['connections', i.id, 'import', 'map'],
				body: { import: i.import, data: i.data },
			}),
		);
