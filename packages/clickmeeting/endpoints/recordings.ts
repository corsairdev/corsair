import { logEventFromContext } from 'corsair/core';
import { makeClickmeetingRequest } from '../client';
import type { ClickmeetingEndpoints } from '../index';
import { ClickmeetingEndpointOutputSchemas } from './types';

export const getSessionRecordings: ClickmeetingEndpoints['getSessionRecordings'] =
	async (ctx, input) => {
		// unknown: provider JSON shape is untyped before Zod parsing
		const res = await makeClickmeetingRequest<unknown>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/recordings`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.recordings.getSessionRecordings',
			{ roomId: input.roomId },
			'completed',
		);
		return ClickmeetingEndpointOutputSchemas.getSessionRecordings.parse(res);
	};

export const deleteRecording: ClickmeetingEndpoints['deleteRecording'] = async (
	ctx,
	input,
) => {
	// unknown: provider JSON shape is untyped before Zod parsing
	const res = await makeClickmeetingRequest<unknown>(
		`/conferences/${encodeURIComponent(String(input.roomId))}/recordings/${encodeURIComponent(String(input.recordingId))}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	await logEventFromContext(
		ctx,
		'clickmeeting.recordings.deleteRecording',
		{ roomId: input.roomId, recordingId: input.recordingId },
		'completed',
	);
	return ClickmeetingEndpointOutputSchemas.deleteRecording.parse(res);
};

export const deleteRecordings: ClickmeetingEndpoints['deleteRecordings'] =
	async (ctx, input) => {
		// unknown: provider JSON shape is untyped before Zod parsing
		const res = await makeClickmeetingRequest<unknown>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/recordings`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.recordings.deleteRecordings',
			{ roomId: input.roomId },
			'completed',
		);
		return ClickmeetingEndpointOutputSchemas.deleteRecordings.parse(res);
	};
