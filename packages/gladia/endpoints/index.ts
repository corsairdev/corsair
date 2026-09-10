import { logEventFromContext } from 'corsair/core';
import { makeGladiaRequest, uploadGladiaFile } from '../client';
import type {
	GladiaContext,
	GladiaEndpoints as GladiaEndpointTypes,
} from '../index';
import type { GladiaEndpointInputs, GladiaEndpointOutputs } from './types';
import {
	GladiaEndpointInputSchemas,
	GladiaEndpointOutputSchemas,
} from './types';

class GladiaValidationError extends Error {
	constructor(
		public readonly kind: 'input' | 'output',
		public readonly operation: string,
		// unknown is necessary because Zod issue arrays are provider-agnostic; a closed issue union is infeasible because paths and codes vary by schema
		public readonly issues: unknown,
	) {
		super(`[gladia] ${kind} validation failed for ${operation}: ${issues}`);
		this.name = 'GladiaValidationError';
	}
}

const complete = async <T>(
	ctx: GladiaContext,
	operation: string,
	// unknown is necessary because event payloads record the raw caller input; a closed input union is infeasible because nine operations share this logger
	input: Record<string, unknown>,
	request: Promise<T>,
): Promise<T> => {
	const response = await request;
	await logEventFromContext(ctx, operation, input, 'completed');
	return response;
};

function parseInput<K extends keyof GladiaEndpointInputs>(
	operation: K,
	input: GladiaEndpointInputs[K],
): GladiaEndpointInputs[K] {
	const schema = GladiaEndpointInputSchemas[operation];
	const parsed = schema.safeParse(input);
	if (!parsed.success) {
		throw new GladiaValidationError('input', String(operation), parsed.error);
	}
	return parsed.data as GladiaEndpointInputs[K];
}

function parseOutput<K extends keyof GladiaEndpointOutputs>(
	operation: K,
	response: GladiaEndpointOutputs[K],
): GladiaEndpointOutputs[K] {
	const schema = GladiaEndpointOutputSchemas[operation];
	const parsed = schema.safeParse(response);
	if (!parsed.success) {
		throw new GladiaValidationError('output', String(operation), parsed.error);
	}
	return parsed.data as GladiaEndpointOutputs[K];
}

export const GladiaEndpoints: GladiaEndpointTypes = {
	uploadAudioVideoFile: (ctx, input) => {
		const parsed = parseInput('uploadAudioVideoFile', input);
		return complete(
			ctx,
			'gladia.upload.audioVideoFile',
			input,
			uploadGladiaFile<GladiaEndpointOutputs['uploadAudioVideoFile']>(
				parsed.audio,
				ctx.key,
				parsed.filename,
			).then((response) => parseOutput('uploadAudioVideoFile', response)),
		);
	},
	initiateLiveTranscriptionSession: (ctx, input) => {
		const parsed = parseInput('initiateLiveTranscriptionSession', input);
		const { region, ...body } = parsed;
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
			}).then((response) =>
				parseOutput('initiateLiveTranscriptionSession', response),
			),
		);
	},
	listLiveTranscriptionJobs: (ctx, input) => {
		const parsed = parseInput('listLiveTranscriptionJobs', input);
		return complete(
			ctx,
			'gladia.live.listTranscriptionJobs',
			input,
			makeGladiaRequest<GladiaEndpointOutputs['listLiveTranscriptionJobs']>(
				'/v2/live',
				ctx.key,
				{ query: parsed },
			).then((response) => parseOutput('listLiveTranscriptionJobs', response)),
		);
	},
	getLiveTranscriptionResult: (ctx, input) => {
		const parsed = parseInput('getLiveTranscriptionResult', input);
		return complete(
			ctx,
			'gladia.live.getTranscriptionResult',
			input,
			makeGladiaRequest<GladiaEndpointOutputs['getLiveTranscriptionResult']>(
				`/v2/live/${encodeURIComponent(parsed.id)}`,
				ctx.key,
			).then((response) => parseOutput('getLiveTranscriptionResult', response)),
		);
	},
	deleteLiveSession: (ctx, input) => {
		const parsed = parseInput('deleteLiveSession', input);
		return complete(
			ctx,
			'gladia.live.deleteSession',
			input,
			makeGladiaRequest<GladiaEndpointOutputs['deleteLiveSession']>(
				'/v2/live/' + encodeURIComponent(parsed.id),
				ctx.key,
				{ method: 'DELETE' },
			).then((response) => parseOutput('deleteLiveSession', response)),
		);
	},
	initiatePreRecordedTranscription: (ctx, input) => {
		const parsed = parseInput('initiatePreRecordedTranscription', input);
		return complete(
			ctx,
			'gladia.preRecorded.initiateTranscription',
			input,
			makeGladiaRequest<
				GladiaEndpointOutputs['initiatePreRecordedTranscription']
			>('/v2/pre-recorded', ctx.key, { method: 'POST', body: parsed }).then(
				(response) => parseOutput('initiatePreRecordedTranscription', response),
			),
		);
	},
	listPreRecordedJobs: (ctx, input) => {
		const parsed = parseInput('listPreRecordedJobs', input);
		return complete(
			ctx,
			'gladia.preRecorded.listJobs',
			input,
			makeGladiaRequest<GladiaEndpointOutputs['listPreRecordedJobs']>(
				'/v2/pre-recorded',
				ctx.key,
				{ query: parsed },
			).then((response) => parseOutput('listPreRecordedJobs', response)),
		);
	},
	getPreRecordedJob: (ctx, input) => {
		const parsed = parseInput('getPreRecordedJob', input);
		return complete(
			ctx,
			'gladia.preRecorded.getJob',
			input,
			makeGladiaRequest<GladiaEndpointOutputs['getPreRecordedJob']>(
				`/v2/pre-recorded/${encodeURIComponent(parsed.id)}`,
				ctx.key,
			).then((response) => parseOutput('getPreRecordedJob', response)),
		);
	},
	deletePreRecordedJob: (ctx, input) => {
		const parsed = parseInput('deletePreRecordedJob', input);
		return complete(
			ctx,
			'gladia.preRecorded.deleteJob',
			input,
			makeGladiaRequest<GladiaEndpointOutputs['deletePreRecordedJob']>(
				'/v2/pre-recorded/' + encodeURIComponent(parsed.id),
				ctx.key,
				{ method: 'DELETE' },
			).then((response) => parseOutput('deletePreRecordedJob', response)),
		);
	},
};

export type { GladiaEndpointInputs, GladiaEndpointOutputs } from './types';
