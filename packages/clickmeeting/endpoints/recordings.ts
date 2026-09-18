import { logEventFromContext } from 'corsair/core';
import { makeClickmeetingRequest } from '../client';
import type { ClickmeetingEndpoints } from '../index';

export const getSessionRecordings: ClickmeetingEndpoints['getSessionRecordings'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
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
		return res;
	};

export const getSessionRecordingDetails: ClickmeetingEndpoints['getSessionRecordingDetails'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/recordings/${encodeURIComponent(String(input.recordingId))}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.recordings.getSessionRecordingDetails',
			{ roomId: input.roomId, recordingId: input.recordingId },
			'completed',
		);
		return res;
	};

export const deleteRecording: ClickmeetingEndpoints['deleteRecording'] = async (
	ctx,
	input,
) => {
	const res = await makeClickmeetingRequest<any>(
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
	return res;
};

export const deleteRecordings: ClickmeetingEndpoints['deleteRecordings'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
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
		return res;
	};
