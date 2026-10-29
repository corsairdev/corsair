import { logEventFromContext } from 'corsair/core';
import { makeHeygenRequest } from '../client';
import type { HeygenEndpoints } from '../index';
import type { HeygenEndpointOutputs } from './types';

// Migrated to HeyGen v3 API per developers.heygen.com. v3-only, no v1/v2 equivalent.

export const get: HeygenEndpoints['aiClippingGet'] = async (ctx, input) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['aiClippingGet']
	>(`/v3/ai-clipping/${input.job_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'heygen.aiClipping.get',
		{ jobId: input.job_id },
		'completed',
	);
	return result;
};

export const deleteAiClipping: HeygenEndpoints['aiClippingDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['aiClippingDelete']
	>(`/v3/ai-clipping/${input.job_id}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'heygen.aiClipping.delete',
		{ jobId: input.job_id },
		'completed',
	);
	return result;
};

export const list: HeygenEndpoints['aiClippingList'] = async (ctx, input) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['aiClippingList']
	>('/v3/ai-clipping', ctx.key, {
		method: 'GET',
		query: { limit: input.limit, token: input.token },
	});

	await logEventFromContext(ctx, 'heygen.aiClipping.list', {}, 'completed');
	return result;
};

export const create: HeygenEndpoints['aiClippingCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['aiClippingCreate']
	>('/v3/ai-clipping', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(ctx, 'heygen.aiClipping.create', {}, 'completed');
	return result;
};
