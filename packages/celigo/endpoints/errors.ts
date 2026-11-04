import type { CeligoEndpoints } from '../index';
import type { CeligoRoute } from './call';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

// The response's nextPageURL is body-paginated and may carry an /api prefix.
// Only its path and query are reused, so the host never changes, and the path
// must be a flow step errors or resolved listing.
function nextPageRoute(
	nextPageURL: string,
	leaf: 'errors' | 'resolved',
): Pick<CeligoRoute, 'path' | 'query'> {
	const url = new URL(nextPageURL, 'https://api.integrator.io');
	const segments = url.pathname
		.split('/')
		.filter(Boolean)
		.map(decodeURIComponent);
	if (segments[0] === 'api') segments.shift();
	if (segments[0] === 'v1') segments.shift();
	if (
		segments.length !== 4 ||
		segments[0] !== 'flows' ||
		segments[3] !== leaf
	) {
		throw new Error(`nextPageURL is not a flow step ${leaf} page`);
	}
	const query: Record<string, string | string[]> = {};
	for (const [key, value] of url.searchParams) {
		const seen = query[key];
		if (seen === undefined) query[key] = value;
		else query[key] = [...(Array.isArray(seen) ? seen : [seen]), value];
	}
	return { path: segments, query };
}

export const list: CeligoEndpoints['errorsList'] = (ctx, input) =>
	callCeligo(ctx, 'errors.list', In.errorsList, Out.errorsList, input, (i) =>
		i.nextPageURL
			? { method: 'GET', ...nextPageRoute(i.nextPageURL, 'errors') }
			: {
					method: 'GET',
					path: ['flows', i.id, i.stepId, 'errors'],
					query: {
						_flowJobId: i._flowJobId,
						occurredAt_gte: i.occurredAt_gte,
						occurredAt_lte: i.occurredAt_lte,
						tags: i.tags,
					},
				},
	);

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
		(i) =>
			i.nextPageURL
				? { method: 'GET', ...nextPageRoute(i.nextPageURL, 'resolved') }
				: {
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
					},
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
