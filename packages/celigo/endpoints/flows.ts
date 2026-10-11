import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const list: CeligoEndpoints['flowsList'] = (ctx, input) =>
	callCeligo(ctx, 'flows.list', In.flowsList, Out.flowsList, input, (i) => ({
		method: 'GET',
		path: ['flows'],
		query: {
			_abstractFlowId: i._abstractFlowId,
			externalId: i.externalId,
			name: i.name,
			disabled: i.disabled,
			_integrationId: i._integrationId,
			sort_by: i.sort_by,
			includeInstances: i.includeInstances,
			limit: i.limit,
			after: i.after,
			include: i.include,
			exclude: i.exclude,
		},
		empty: [],
	}));

export const get: CeligoEndpoints['flowsGet'] = (ctx, input) =>
	callCeligo(ctx, 'flows.get', In.flowsGet, Out.flowsGet, input, (i) => ({
		method: 'GET',
		path: ['flows', i.id],
		query: { mergeInstance: i.mergeInstance },
	}));

export const create: CeligoEndpoints['flowsCreate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'flows.create',
		In.flowsCreate,
		Out.flowsCreate,
		input,
		(i) => ({
			method: 'POST',
			path: ['flows'],
			body: i,
		}),
	);

export const update: CeligoEndpoints['flowsUpdate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'flows.update',
		In.flowsUpdate,
		Out.flowsUpdate,
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: ['flows', id],
			body,
		}),
	);

export const patch: CeligoEndpoints['flowsPatch'] = (ctx, input) =>
	callCeligo(ctx, 'flows.patch', In.flowsPatch, Out.flowsPatch, input, (i) => ({
		method: 'PATCH',
		path: ['flows', i.id],
		body: i.operations,
		empty: { success: true },
	}));

export const remove: CeligoEndpoints['flowsDelete'] = (ctx, input) =>
	callCeligo(
		ctx,
		'flows.delete',
		In.flowsDelete,
		Out.flowsDelete,
		input,
		(i) => ({
			method: 'DELETE',
			path: ['flows', i.id],
			empty: { success: true },
		}),
	);

export const clone: CeligoEndpoints['flowsClone'] = (ctx, input) =>
	callCeligo(
		ctx,
		'flows.clone',
		In.flowsClone,
		Out.flowsClone,
		input,
		({ id, ...body }) => ({
			method: 'POST',
			path: ['flows', id, 'clone'],
			body,
		}),
	);

export const getAudit: CeligoEndpoints['flowsGetAudit'] = (ctx, input) =>
	callCeligo(
		ctx,
		'flows.getAudit',
		In.flowsGetAudit,
		Out.flowsGetAudit,
		input,
		(i) => ({
			method: 'GET',
			path: ['flows', i.id, 'audit'],
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

export const getDependencies: CeligoEndpoints['flowsGetDependencies'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'flows.getDependencies',
		In.flowsGetDependencies,
		Out.flowsGetDependencies,
		input,
		(i) => ({
			method: 'GET',
			path: ['flows', i.id, 'dependencies'],
		}),
	);

export const getDescendants: CeligoEndpoints['flowsGetDescendants'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'flows.getDescendants',
		In.flowsGetDescendants,
		Out.flowsGetDescendants,
		input,
		(i) => ({
			method: 'GET',
			path: ['flows', i.id, 'descendants'],
		}),
	);

export const getLastExportDateTime: CeligoEndpoints['flowsGetLastExportDateTime'] =
	(ctx, input) =>
		callCeligo(
			ctx,
			'flows.getLastExportDateTime',
			In.flowsGetLastExportDateTime,
			Out.flowsGetLastExportDateTime,
			input,
			(i) => ({
				method: 'GET',
				path: ['flows', i.id, 'lastExportDateTime'],
			}),
		);

export const getLatestJobs: CeligoEndpoints['flowsGetLatestJobs'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'flows.getLatestJobs',
		In.flowsGetLatestJobs,
		Out.flowsGetLatestJobs,
		input,
		(i) => ({
			method: 'GET',
			path: ['flows', i.id, 'jobs', 'latest'],
			query: { include: i.include, exclude: i.exclude },
			empty: [],
		}),
	);

export const getTemplate: CeligoEndpoints['flowsGetTemplate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'flows.getTemplate',
		In.flowsGetTemplate,
		Out.flowsGetTemplate,
		input,
		(i) => ({
			method: 'GET',
			path: ['flows', i.id, 'template'],
		}),
	);
