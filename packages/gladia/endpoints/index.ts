import { logEventFromContext } from 'corsair/core';
import { makeGladiaRequest, uploadGladiaFile } from '../client';
import type {
	GladiaContext,
	GladiaEndpoints as GladiaEndpointTypes,
} from '../index';
import type { GladiaEndpointOutputs } from './types';

const complete = async <T>(
	ctx: GladiaContext,
	operation: string,
	input: Record<string, unknown>,
	request: Promise<T>,
): Promise<T> => {
	const response = await request;
	await logEventFromContext(ctx, operation, input, 'completed');
	return response;
};

export const GladiaEndpoints: GladiaEndpointTypes = {
	uploadAudioVideoFile: (ctx, input) =>
		complete(
			ctx,
			'gladia.upload.audioVideoFile',
			input,
			uploadGladiaFile<GladiaEndpointOutputs['uploadAudioVideoFile']>(
				input.audio,
				ctx.key,
				input.filename,
			),
		),
	initiateLiveTranscriptionSession: (ctx, input) => {
		const { region, ...body } = input;
		return complete(
			ctx,
			'gladia.live.initiateTranscriptionSession',
			input,
			makeGladiaRequest<
				GladiaEndpointOutputs['initiateLiveTranscriptionSession']
			>('/v2/live', ctx.key, {
				method: 'POST',
				body,
				query: region ? { region } : undefined,
			}),
		);
	},
	listLiveTranscriptionJobs: (ctx, input) =>
		complete(
			ctx,
			'gladia.live.listTranscriptionJobs',
			input,
			makeGladiaRequest<GladiaEndpointOutputs['listLiveTranscriptionJobs']>(
				'/v2/live',
				ctx.key,
				{ query: input },
			),
		),
	getLiveTranscriptionResult: (ctx, input) =>
		complete(
			ctx,
			'gladia.live.getTranscriptionResult',
			input,
			makeGladiaRequest<GladiaEndpointOutputs['getLiveTranscriptionResult']>(
				`/v2/live/${encodeURIComponent(input.id)}`,
				ctx.key,
			),
		),
	deleteLiveSession: (ctx, input) =>
		complete(
			ctx,
			'gladia.live.deleteSession',
			input,
			makeGladiaRequest('/v2/live/' + encodeURIComponent(input.id), ctx.key, {
				method: 'DELETE',
			}),
		),
	initiatePreRecordedTranscription: (ctx, input) =>
		complete(
			ctx,
			'gladia.preRecorded.initiateTranscription',
			input,
			makeGladiaRequest<
				GladiaEndpointOutputs['initiatePreRecordedTranscription']
			>('/v2/pre-recorded', ctx.key, { method: 'POST', body: input }),
		),
	listPreRecordedJobs: (ctx, input) =>
		complete(
			ctx,
			'gladia.preRecorded.listJobs',
			input,
			makeGladiaRequest<GladiaEndpointOutputs['listPreRecordedJobs']>(
				'/v2/pre-recorded',
				ctx.key,
				{ query: input },
			),
		),
	getPreRecordedJob: (ctx, input) =>
		complete(
			ctx,
			'gladia.preRecorded.getJob',
			input,
			makeGladiaRequest<GladiaEndpointOutputs['getPreRecordedJob']>(
				`/v2/pre-recorded/${encodeURIComponent(input.id)}`,
				ctx.key,
			),
		),
	deletePreRecordedJob: (ctx, input) =>
		complete(
			ctx,
			'gladia.preRecorded.deleteJob',
			input,
			makeGladiaRequest(
				'/v2/pre-recorded/' + encodeURIComponent(input.id),
				ctx.key,
				{ method: 'DELETE' },
			),
		),
};

export type { GladiaEndpointInputs, GladiaEndpointOutputs } from './types';
