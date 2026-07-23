import { logEventFromContext } from 'corsair/core';
import { makeHeygenRequest } from '../client';
import type { HeygenEndpoints } from '../index';
import type { HeygenEndpointOutputs } from './types';

// Migrated to HeyGen v3 API per developers.heygen.com. Note: a "stream word timestamps"
// operation does not exist in HeyGen's v3 API (confirmed against the live docs) and was
// dropped rather than invented.

export const createSession: HeygenEndpoints['avatarRealtimeCreateSession'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['avatarRealtimeCreateSession']
		>('/v3/avatar-realtime', ctx.key, { method: 'POST', body: input });

		await logEventFromContext(
			ctx,
			'heygen.avatarRealtime.createSession',
			{ type: input.type },
			'completed',
		);
		return result;
	};

export const getSession: HeygenEndpoints['avatarRealtimeGetSession'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarRealtimeGetSession']
	>(`/v3/avatar-realtime/${input.stream_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'heygen.avatarRealtime.getSession',
		{ streamId: input.stream_id },
		'completed',
	);
	return result;
};

export const appendText: HeygenEndpoints['avatarRealtimeAppendText'] = async (
	ctx,
	input,
) => {
	const { stream_id, ...body } = input;
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarRealtimeAppendText']
	>(`/v3/avatar-realtime/${stream_id}/text`, ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'heygen.avatarRealtime.appendText',
		{ streamId: stream_id },
		'completed',
	);
	return result;
};

export const cancelSession: HeygenEndpoints['avatarRealtimeCancelSession'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['avatarRealtimeCancelSession']
		>(`/v3/avatar-realtime/${input.stream_id}/cancel`, ctx.key, {
			method: 'POST',
			body: {},
		});

		await logEventFromContext(
			ctx,
			'heygen.avatarRealtime.cancelSession',
			{ streamId: input.stream_id },
			'completed',
		);
		return result;
	};
