import { logEventFromContext } from 'corsair/core';
import { makeHeygenRequest } from '../client';
import type { HeygenEndpoints } from '../index';
import type { HeygenEndpointOutputs } from './types';

// HeyGen's v3 docs mention an "Avatar Realtime" endpoint (`POST /v3/avatar-realtime`) for
// low-latency streaming, but it has no documented request/response shape yet and doesn't map
// cleanly onto the operations below, so this file stays on its confirmed v1 paths per
// developers.heygen.com/endpoint-version-comparison.

// Full-config session bootstrap (avatar/voice/knowledge base). Hits the same confirmed
// `/v1/streaming.new` endpoint as `new` below, but with a richer request scope — HeyGen's
// issue tracker lists both as distinct operations.
export const newSession: HeygenEndpoints['streamingNewSession'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['streamingNewSession']
	>('/v1/streaming.new', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'heygen.streaming.newSession',
		{ avatarId: input.avatar_id, knowledgeBaseId: input.knowledge_base_id },
		'completed',
	);
	return result;
};

export const createToken: HeygenEndpoints['streamingCreateToken'] = async (
	ctx,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['streamingCreateToken']
	>('/v1/streaming.create_token', ctx.key, { method: 'POST', body: {} });

	await logEventFromContext(
		ctx,
		'heygen.streaming.createToken',
		{},
		'completed',
	);
	return result;
};

export const start: HeygenEndpoints['streamingStart'] = async (ctx, input) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['streamingStart']
	>('/v1/streaming.start', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'heygen.streaming.start',
		{ sessionId: input.session_id },
		'completed',
	);
	return result;
};

export const stop: HeygenEndpoints['streamingStop'] = async (ctx, input) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['streamingStop']
	>('/v1/streaming.stop', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'heygen.streaming.stop',
		{ sessionId: input.session_id },
		'completed',
	);
	return result;
};

export const interrupt: HeygenEndpoints['streamingInterrupt'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['streamingInterrupt']
	>('/v1/streaming.interrupt', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'heygen.streaming.interrupt',
		{ sessionId: input.session_id },
		'completed',
	);
	return result;
};

// [B] Path inferred as `/v1/streaming.keep_alive`; see endpoints/types.ts for details.
export const keepAlive: HeygenEndpoints['streamingKeepAlive'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['streamingKeepAlive']
	>('/v1/streaming.keep_alive', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'heygen.streaming.keepAlive',
		{ sessionId: input.session_id },
		'completed',
	);
	return result;
};

export const task: HeygenEndpoints['streamingTask'] = async (ctx, input) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['streamingTask']
	>('/v1/streaming.task', ctx.key, { method: 'POST', body: input });

	// Never log `text` (the spoken content) — only the session identifier.
	await logEventFromContext(
		ctx,
		'heygen.streaming.task',
		{ sessionId: input.session_id },
		'completed',
	);
	return result;
};

export const ice: HeygenEndpoints['streamingIce'] = async (ctx, input) => {
	const result = await makeHeygenRequest<HeygenEndpointOutputs['streamingIce']>(
		'/v1/streaming.ice',
		ctx.key,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(
		ctx,
		'heygen.streaming.ice',
		{ sessionId: input.session_id },
		'completed',
	);
	return result;
};

// Minimal quality-only session bootstrap (per the confirmed OpenAPI spec example body).
// Hits the same `/v1/streaming.new` endpoint as `newSession` above.
export const streamingNew: HeygenEndpoints['streamingNew'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<HeygenEndpointOutputs['streamingNew']>(
		'/v1/streaming.new',
		ctx.key,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(ctx, 'heygen.streaming.new', {}, 'completed');
	return result;
};

export const list: HeygenEndpoints['streamingList'] = async (ctx) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['streamingList']
	>('/v1/streaming.list', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'heygen.streaming.list', {}, 'completed');
	return result;
};

export const listAvatars: HeygenEndpoints['streamingListAvatars'] = async (
	ctx,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['streamingListAvatars']
	>('/v1/streaming/avatar.list', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'heygen.streaming.listAvatars',
		{},
		'completed',
	);
	return result;
};

// [B] Path inferred as `/v1/streaming.history`; see endpoints/types.ts for details.
export const listSessionHistory: HeygenEndpoints['streamingListSessionHistory'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['streamingListSessionHistory']
		>('/v1/streaming.history', ctx.key, {
			method: 'GET',
			query: { page: input.page, limit: input.limit },
		});

		await logEventFromContext(
			ctx,
			'heygen.streaming.listSessionHistory',
			{},
			'completed',
		);
		return result;
	};
