import { logEventFromContext } from 'corsair/core';
import { makeHeygenRequest } from '../client';
import type { HeygenEndpoints } from '../index';
import type { HeygenEndpointOutputs } from './types';

// Migrated to HeyGen v3 API per developers.heygen.com. Video Agent is a v3-only,
// prompt-driven video generation surface with no v1/v2 equivalent.

export const listSessions: HeygenEndpoints['videoAgentsListSessions'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videoAgentsListSessions']
	>('/v3/video-agents', ctx.key, {
		method: 'GET',
		query: { limit: input.limit, token: input.token },
	});

	await logEventFromContext(
		ctx,
		'heygen.videoAgents.listSessions',
		{},
		'completed',
	);
	return result;
};

export const createSession: HeygenEndpoints['videoAgentsCreateSession'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['videoAgentsCreateSession']
		>('/v3/video-agents', ctx.key, { method: 'POST', body: input });

		await logEventFromContext(
			ctx,
			'heygen.videoAgents.createSession',
			{ mode: input.mode },
			'completed',
		);
		return result;
	};

export const listStyles: HeygenEndpoints['videoAgentsListStyles'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videoAgentsListStyles']
	>('/v3/video-agents/styles', ctx.key, {
		method: 'GET',
		query: { tag: input.tag, limit: input.limit, token: input.token },
	});

	await logEventFromContext(
		ctx,
		'heygen.videoAgents.listStyles',
		{},
		'completed',
	);
	return result;
};

export const getSession: HeygenEndpoints['videoAgentsGetSession'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videoAgentsGetSession']
	>(`/v3/video-agents/${input.session_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'heygen.videoAgents.getSession',
		{ sessionId: input.session_id },
		'completed',
	);
	return result;
};

export const sendMessage: HeygenEndpoints['videoAgentsSendMessage'] = async (
	ctx,
	input,
) => {
	const { session_id, ...body } = input;
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videoAgentsSendMessage']
	>(`/v3/video-agents/${session_id}`, ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'heygen.videoAgents.sendMessage',
		{ sessionId: session_id },
		'completed',
	);
	return result;
};

export const getResource: HeygenEndpoints['videoAgentsGetResource'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videoAgentsGetResource']
	>(
		`/v3/video-agents/${input.session_id}/resources/${input.resource_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'heygen.videoAgents.getResource',
		{ sessionId: input.session_id, resourceId: input.resource_id },
		'completed',
	);
	return result;
};

export const listVideos: HeygenEndpoints['videoAgentsListVideos'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videoAgentsListVideos']
	>(`/v3/video-agents/${input.session_id}/videos`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'heygen.videoAgents.listVideos',
		{ sessionId: input.session_id },
		'completed',
	);
	return result;
};

export const stopSession: HeygenEndpoints['videoAgentsStopSession'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videoAgentsStopSession']
	>(`/v3/video-agents/${input.session_id}/stop`, ctx.key, {
		method: 'POST',
		body: {},
	});

	await logEventFromContext(
		ctx,
		'heygen.videoAgents.stopSession',
		{ sessionId: input.session_id },
		'completed',
	);
	return result;
};
