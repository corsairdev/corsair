import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

// A create saves the request as queued. After that only a final status is
// saved: it never changes, so overlapping polls can't move a request backwards.
const FINAL_STATUSES = new Set([
	'success',
	'failed',
	'error',
	'cancelled',
	'canceled',
]);

export const create: GmicloudEndpoints['mediaRequestsCreate'] = async (
	ctx,
	input,
) => {
	const body = GmicloudEndpointInputSchemas.mediaRequestsCreate.parse(input);
	const result = GmicloudEndpointOutputSchemas.mediaRequestsCreate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/ie/requestqueue/apikey/requests',
			body,
		}),
	);

	if (ctx.db.mediaRequests) {
		try {
			await ctx.db.mediaRequests.upsertByEntityId(result.request_id, {
				requestId: result.request_id,
				model: result.model,
				status: result.status,
				payload: body.payload,
				createdAt: result.created_at ?? undefined,
				updatedAt: result.updated_at ?? undefined,
			});
		} catch (error) {
			console.warn('Failed to save GMI Cloud media request:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gmicloud.mediaRequests.create',
		{ requestId: result.request_id, model: result.model },
		'completed',
	);
	return result;
};

export const get: GmicloudEndpoints['mediaRequestsGet'] = async (
	ctx,
	input,
) => {
	const { request_id } =
		GmicloudEndpointInputSchemas.mediaRequestsGet.parse(input);
	const result = GmicloudEndpointOutputSchemas.mediaRequestsGet.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/ie/requestqueue/apikey/requests/{request_id}',
			path: { request_id },
		}),
	);

	if (ctx.db.mediaRequests && FINAL_STATUSES.has(result.status)) {
		try {
			const cached = await ctx.db.mediaRequests.findByEntityId(request_id);
			await ctx.db.mediaRequests.upsertByEntityId(request_id, {
				...cached?.data,
				requestId: request_id,
				model: result.model,
				status: result.status,
				payload: result.payload ?? cached?.data.payload,
				outcome: result.outcome ?? undefined,
				createdAt: result.created_at ?? undefined,
				updatedAt: result.updated_at ?? undefined,
			});
		} catch (error) {
			console.warn('Failed to save GMI Cloud media request:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gmicloud.mediaRequests.get',
		{ requestId: request_id, status: result.status },
		'completed',
	);
	return result;
};
