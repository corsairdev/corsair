import { logEventFromContext } from 'corsair/core';
import { makeAivoovRequest } from '../client';
import type { AivoovEndpoints } from '../index';
import type { AivoovEndpointOutputs, CreateAudioInput } from './types';

export const getVoices: AivoovEndpoints['getVoices'] = async (ctx, input) => {
	const response = await makeAivoovRequest<AivoovEndpointOutputs['getVoices']>(
		'/voices',
		ctx.key,
		{
			method: 'GET',
			query: {
				language_code: input.language_code,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'aivoov.voices.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const createAudio: AivoovEndpoints['createAudio'] = async (
	ctx,
	input,
) => {
	const form: Record<string, string | string[] | undefined> = {
		'voice_id[]': input.voice_id,
		'transcribe_text[]': input.transcribe_text,
		'transcribe_ssml_pitch_rate[]':
			input.transcribe_ssml_pitch_rate?.map(String),
		'transcribe_ssml_spk_rate[]': input.transcribe_ssml_spk_rate?.map(String),
		'transcribe_ssml_volume[]': input.transcribe_ssml_volume?.map(String),
	};

	const response = await makeAivoovRequest<
		AivoovEndpointOutputs['createAudio']
	>('/create', ctx.key, {
		method: 'POST',
		form,
	});

	await logEventFromContext(
		ctx,
		'aivoov.audio.create',
		{
			voice_count: input.voice_id.length,
			text_count: input.transcribe_text.length,
		},
		'completed',
	);

	return response;
};
