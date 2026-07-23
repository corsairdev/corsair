import { logEventFromContext } from 'corsair/core';
import { makeHeygenRequest } from '../client';
import type { HeygenEndpoints } from '../index';
import type { HeygenEndpointOutputs } from './types';

// Migrated to HeyGen v3 API per developers.heygen.com. v3-only, no v1/v2 equivalent.

export const list: HeygenEndpoints['lipsyncList'] = async (ctx, input) => {
	const result = await makeHeygenRequest<HeygenEndpointOutputs['lipsyncList']>(
		'/v3/lipsyncs',
		ctx.key,
		{ method: 'GET', query: { limit: input.limit, token: input.token } },
	);

	await logEventFromContext(ctx, 'heygen.lipsync.list', {}, 'completed');
	return result;
};

export const create: HeygenEndpoints['lipsyncCreate'] = async (ctx, input) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['lipsyncCreate']
	>('/v3/lipsyncs', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(ctx, 'heygen.lipsync.create', {}, 'completed');
	return result;
};

export const get: HeygenEndpoints['lipsyncGet'] = async (ctx, input) => {
	const result = await makeHeygenRequest<HeygenEndpointOutputs['lipsyncGet']>(
		`/v3/lipsyncs/${input.lipsync_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'heygen.lipsync.get',
		{ lipsyncId: input.lipsync_id },
		'completed',
	);
	return result;
};

export const deleteLipsync: HeygenEndpoints['lipsyncDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['lipsyncDelete']
	>(`/v3/lipsyncs/${input.lipsync_id}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'heygen.lipsync.delete',
		{ lipsyncId: input.lipsync_id },
		'completed',
	);
	return result;
};

export const update: HeygenEndpoints['lipsyncUpdate'] = async (ctx, input) => {
	const { lipsync_id, ...body } = input;
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['lipsyncUpdate']
	>(`/v3/lipsyncs/${lipsync_id}`, ctx.key, { method: 'PATCH', body });

	await logEventFromContext(
		ctx,
		'heygen.lipsync.update',
		{ lipsyncId: lipsync_id },
		'completed',
	);
	return result;
};
