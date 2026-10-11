import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const list: CeligoEndpoints['errorsList'] = (ctx, input) =>
	callCeligo(ctx, 'errors.list', In.errorsList, Out.errorsList, input, (i) => ({
		method: 'GET',
		path: ['flows', i.id, i.stepId, 'errors'],
		query: {
			_flowJobId: i._flowJobId,
			occurredAt_gte: i.occurredAt_gte,
			occurredAt_lte: i.occurredAt_lte,
			tags: i.tags,
		},
	}));

export const listResolved: CeligoEndpoints['errorsListResolved'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'errors.listResolved',
		In.errorsListResolved,
		Out.errorsListResolved,
		input,
		(i) => ({
			method: 'GET',
			path: ['flows', i.id, i.stepId, 'resolved'],
			query: {
				_flowJobId: i._flowJobId,
				occurredAt_gte: i.occurredAt_gte,
				occurredAt_lte: i.occurredAt_lte,
				resolvedAt_gte: i.resolvedAt_gte,
				resolvedAt_lte: i.resolvedAt_lte,
				tags: i.tags,
				resolvedBy: i.resolvedBy,
			},
		}),
	);

export const resolve: CeligoEndpoints['errorsResolve'] = (ctx, input) =>
	callCeligo(
		ctx,
		'errors.resolve',
		In.errorsResolve,
		Out.errorsResolve,
		input,
		({ id, stepId, ...body }) => ({
			method: 'PUT',
			path: ['flows', id, stepId, 'resolved'],
			body,
			empty: { success: true },
		}),
	);

export const deleteResolved: CeligoEndpoints['errorsDeleteResolved'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'errors.deleteResolved',
		In.errorsDeleteResolved,
		Out.errorsDeleteResolved,
		input,
		({ id, stepId, ...body }) => ({
			method: 'DELETE',
			path: ['flows', id, stepId, 'resolved'],
			body,
			empty: { success: true },
		}),
	);

export const retry: CeligoEndpoints['errorsRetry'] = (ctx, input) =>
	callCeligo(
		ctx,
		'errors.retry',
		In.errorsRetry,
		Out.errorsRetry,
		input,
		({ id, stepId, ...body }) => ({
			method: 'POST',
			path: ['flows', id, stepId, 'retry'],
			body,
			empty: {},
		}),
	);

export const assign: CeligoEndpoints['errorsAssign'] = (ctx, input) =>
	callCeligo(
		ctx,
		'errors.assign',
		In.errorsAssign,
		Out.errorsAssign,
		input,
		({ id, stepId, ...body }) => ({
			method: 'PUT',
			path: ['flows', id, stepId, 'errors', 'assign'],
			body,
		}),
	);

export const updateTags: CeligoEndpoints['errorsUpdateTags'] = (ctx, input) =>
	callCeligo(
		ctx,
		'errors.updateTags',
		In.errorsUpdateTags,
		Out.errorsUpdateTags,
		input,
		({ id, stepId, ...body }) => ({
			method: 'PUT',
			path: ['flows', id, stepId, 'tags'],
			body,
		}),
	);
