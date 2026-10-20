import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const list: CeligoEndpoints['integrationsList'] = (ctx, input) =>
	callCeligo(
		ctx,
		'integrations.list',
		In.integrationsList,
		Out.integrationsList,
		input,
		(i) => ({
			method: 'GET',
			save: 'integrations',
			path: ['integrations'],
			query: { include: i.include, exclude: i.exclude, limit: i.limit },
			empty: [],
		}),
	);

export const get: CeligoEndpoints['integrationsGet'] = (ctx, input) =>
	callCeligo(
		ctx,
		'integrations.get',
		In.integrationsGet,
		Out.integrationsGet,
		input,
		(i) => ({
			method: 'GET',
			save: 'integrations',
			path: ['integrations', i.id],
		}),
	);

export const create: CeligoEndpoints['integrationsCreate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'integrations.create',
		In.integrationsCreate,
		Out.integrationsCreate,
		input,
		(i) => ({
			method: 'POST',
			save: 'integrations',
			path: ['integrations'],
			body: i,
		}),
	);

export const update: CeligoEndpoints['integrationsUpdate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'integrations.update',
		In.integrationsUpdate,
		Out.integrationsUpdate,
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			save: 'integrations',
			path: ['integrations', id],
			body,
		}),
	);

export const patch: CeligoEndpoints['integrationsPatch'] = (ctx, input) =>
	callCeligo(
		ctx,
		'integrations.patch',
		In.integrationsPatch,
		Out.integrationsPatch,
		input,
		(i) => ({
			method: 'PATCH',
			path: ['integrations', i.id],
			body: i.operations,
			empty: { success: true },
		}),
	);

export const remove: CeligoEndpoints['integrationsDelete'] = (ctx, input) =>
	callCeligo(
		ctx,
		'integrations.delete',
		In.integrationsDelete,
		Out.integrationsDelete,
		input,
		(i) => ({
			method: 'DELETE',
			drop: 'integrations',
			path: ['integrations', i.id],
			empty: { success: true },
		}),
	);

export const clone: CeligoEndpoints['integrationsClone'] = (ctx, input) =>
	callCeligo(
		ctx,
		'integrations.clone',
		In.integrationsClone,
		Out.integrationsClone,
		input,
		({ id, ...body }) => ({
			method: 'POST',
			path: ['integrations', id, 'clone'],
			body,
		}),
	);

export const getAudit: CeligoEndpoints['integrationsGetAudit'] = (ctx, input) =>
	callCeligo(
		ctx,
		'integrations.getAudit',
		In.integrationsGetAudit,
		Out.integrationsGetAudit,
		input,
		(i) => ({
			method: 'GET',
			path: ['integrations', i.id, 'audit'],
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

export const getDependencies: CeligoEndpoints['integrationsGetDependencies'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'integrations.getDependencies',
		In.integrationsGetDependencies,
		Out.integrationsGetDependencies,
		input,
		(i) => ({
			method: 'GET',
			path: ['integrations', i.id, 'dependencies'],
		}),
	);

export const listFlows: CeligoEndpoints['integrationsListFlows'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'integrations.listFlows',
		In.integrationsListFlows,
		Out.integrationsListFlows,
		input,
		(i) => ({
			method: 'GET',
			save: 'flows',
			path: ['integrations', i.id, 'flows'],
			query: { limit: i.limit, includeInstances: i.includeInstances },
			empty: [],
		}),
	);

export const listExports: CeligoEndpoints['integrationsListExports'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'integrations.listExports',
		In.integrationsListExports,
		Out.integrationsListExports,
		input,
		(i) => ({
			method: 'GET',
			save: 'exports',
			path: ['integrations', i.id, 'exports'],
			query: { limit: i.limit },
			empty: [],
		}),
	);

export const listImports: CeligoEndpoints['integrationsListImports'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'integrations.listImports',
		In.integrationsListImports,
		Out.integrationsListImports,
		input,
		(i) => ({
			method: 'GET',
			save: 'imports',
			path: ['integrations', i.id, 'imports'],
			query: { limit: i.limit },
			empty: [],
		}),
	);

export const listConnections: CeligoEndpoints['integrationsListConnections'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'integrations.listConnections',
		In.integrationsListConnections,
		Out.integrationsListConnections,
		input,
		(i) => ({
			method: 'GET',
			save: 'connections',
			path: ['integrations', i.id, 'connections'],
			query: { limit: i.limit },
			empty: [],
		}),
	);

export const listUsers: CeligoEndpoints['integrationsListUsers'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'integrations.listUsers',
		In.integrationsListUsers,
		Out.integrationsListUsers,
		input,
		(i) => ({
			method: 'GET',
			path: ['integrations', i.id, 'ashares'],
			empty: [],
		}),
	);

export const listErrors: CeligoEndpoints['integrationsListErrors'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'integrations.listErrors',
		In.integrationsListErrors,
		Out.integrationsListErrors,
		input,
		(i) => ({
			method: 'GET',
			path: ['integrations', i.id, 'errors'],
			empty: [],
		}),
	);

export const getTemplate: CeligoEndpoints['integrationsGetTemplate'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'integrations.getTemplate',
		In.integrationsGetTemplate,
		Out.integrationsGetTemplate,
		input,
		(i) => ({
			method: 'GET',
			path: ['integrations', i.id, 'template'],
		}),
	);

export const createRevision: CeligoEndpoints['integrationsCreateRevision'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'integrations.createRevision',
		In.integrationsCreateRevision,
		Out.integrationsCreateRevision,
		input,
		({ id, ...body }) => ({
			method: 'POST',
			path: ['integrations', id, 'revisions', 'create'],
			body,
		}),
	);

export const registerConnection: CeligoEndpoints['integrationsRegisterConnection'] =
	(ctx, input) =>
		callCeligo(
			ctx,
			'integrations.registerConnection',
			In.integrationsRegisterConnection,
			Out.integrationsRegisterConnection,
			input,
			(i) => ({
				method: 'PUT',
				path: ['integrations', i.id, 'connections', i.connectionId, 'register'],
				empty: { success: true },
			}),
		);

export const registerConnections: CeligoEndpoints['integrationsRegisterConnections'] =
	(ctx, input) =>
		callCeligo(
			ctx,
			'integrations.registerConnections',
			In.integrationsRegisterConnections,
			Out.integrationsRegisterConnections,
			input,
			({ id, ...body }) => ({
				method: 'PUT',
				path: ['integrations', id, 'connections', 'register'],
				body,
				empty: { success: true },
			}),
		);

export const unregisterConnection: CeligoEndpoints['integrationsUnregisterConnection'] =
	(ctx, input) =>
		callCeligo(
			ctx,
			'integrations.unregisterConnection',
			In.integrationsUnregisterConnection,
			Out.integrationsUnregisterConnection,
			input,
			(i) => ({
				method: 'DELETE',
				path: ['integrations', i.id, 'connections', i.connectionId, 'register'],
				empty: { success: true },
			}),
		);
