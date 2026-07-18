import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	RealtimeCreateCallResponse,
	RealtimeCreateClientSecretResponse,
	RealtimeCreateSessionResponse,
	RealtimeCreateTranscriptionSessionResponse,
} from '../schema/realtime';

export const createCall: OpenaiEndpoints['realtimeCreateCall'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<RealtimeCreateCallResponse>(
		'realtime/calls',
		ctx.key,
		{
			method: 'POST',
			body: {
				sdp: input.sdp,
				session: input.session,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.realtime.createCall',
		{ session: input.session },
		'completed',
	);
	return result;
};

export const createClientSecret: OpenaiEndpoints['realtimeCreateClientSecret'] =
	async (ctx, input) => {
		const result = await makeOpenaiRequest<RealtimeCreateClientSecretResponse>(
			'realtime/client_secrets',
			ctx.key,
			{
				method: 'POST',
				body: {
					session: input.session,
					expires_after: input.expiresAfter,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'openai.realtime.createClientSecret',
			{ session: input.session, expiresAfter: input.expiresAfter },
			'completed',
		);
		return result;
	};

export const createSession: OpenaiEndpoints['realtimeCreateSession'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<RealtimeCreateSessionResponse>(
		'realtime/sessions',
		ctx.key,
		{
			method: 'POST',
			body: {
				model: input.model,
				voice: input.voice,
				modalities: input.modalities,
				instructions: input.instructions,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.realtime.createSession',
		{ model: input.model, voice: input.voice },
		'completed',
	);
	return result;
};

export const createTranscriptionSession: OpenaiEndpoints['realtimeCreateTranscriptionSession'] =
	async (ctx, input) => {
		const result =
			await makeOpenaiRequest<RealtimeCreateTranscriptionSessionResponse>(
				'realtime/transcription_sessions',
				ctx.key,
				{
					method: 'POST',
					body: {
						input_audio_format: input.inputAudioFormat,
						input_audio_transcription: input.inputAudioTranscription,
					},
				},
			);

		await logEventFromContext(
			ctx,
			'openai.realtime.createTranscriptionSession',
			{ inputAudioFormat: input.inputAudioFormat },
			'completed',
		);
		return result;
	};
