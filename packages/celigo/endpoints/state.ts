import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const list: CeligoEndpoints['stateList'] = (ctx, input) =>
	callCeligo(ctx, 'state.list', In.stateList, Out.stateList, input, () => ({
		method: 'GET',
		path: ['state'],
		empty: { keys: [] },
	}));

export const get: CeligoEndpoints['stateGet'] = (ctx, input) =>
	callCeligo(ctx, 'state.get', In.stateGet, Out.stateGet, input, (i) => ({
		method: 'GET',
		path: ['state', i.key],
	}));

export const set: CeligoEndpoints['stateSet'] = (ctx, input) =>
	callCeligo(ctx, 'state.set', In.stateSet, Out.stateSet, input, (i) => ({
		method: 'PUT',
		path: ['state', i.key],
		body: i.value,
		wrap: 'result',
	}));

export const remove: CeligoEndpoints['stateDelete'] = (ctx, input) =>
	callCeligo(
		ctx,
		'state.delete',
		In.stateDelete,
		Out.stateDelete,
		input,
		(i) => ({
			method: 'DELETE',
			path: ['state', i.key],
			empty: { success: true },
		}),
	);

export const deleteAll: CeligoEndpoints['stateDeleteAll'] = (ctx, input) =>
	callCeligo(
		ctx,
		'state.deleteAll',
		In.stateDeleteAll,
		Out.stateDeleteAll,
		input,
		() => ({
			method: 'DELETE',
			path: ['state'],
			empty: { success: true },
		}),
	);

export const listForResource: CeligoEndpoints['stateListForResource'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'state.listForResource',
		In.stateListForResource,
		Out.stateListForResource,
		input,
		(i) => ({
			method: 'GET',
			path: [i.resourceType, i.resourceId, 'state'],
			empty: { keys: [] },
		}),
	);

export const getForResource: CeligoEndpoints['stateGetForResource'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'state.getForResource',
		In.stateGetForResource,
		Out.stateGetForResource,
		input,
		(i) => ({
			method: 'GET',
			path: [i.resourceType, i.resourceId, 'state', i.key],
		}),
	);

export const setForResource: CeligoEndpoints['stateSetForResource'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'state.setForResource',
		In.stateSetForResource,
		Out.stateSetForResource,
		input,
		(i) => ({
			method: 'PUT',
			path: [i.resourceType, i.resourceId, 'state', i.key],
			body: i.value,
			wrap: 'result',
		}),
	);

export const deleteForResource: CeligoEndpoints['stateDeleteForResource'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'state.deleteForResource',
		In.stateDeleteForResource,
		Out.stateDeleteForResource,
		input,
		(i) => ({
			method: 'DELETE',
			path: [i.resourceType, i.resourceId, 'state', i.key],
			empty: { success: true },
		}),
	);

export const deleteAllForResource: CeligoEndpoints['stateDeleteAllForResource'] =
	(ctx, input) =>
		callCeligo(
			ctx,
			'state.deleteAllForResource',
			In.stateDeleteAllForResource,
			Out.stateDeleteAllForResource,
			input,
			(i) => ({
				method: 'DELETE',
				path: [i.resourceType, i.resourceId, 'state'],
				empty: { success: true },
			}),
		);
