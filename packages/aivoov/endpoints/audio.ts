import { logEventFromContext } from 'corsair/core';
import { makeAivoovRequest } from '../client';
import type { AivoovEndpoints } from '../index';
import type { AivoovEndpointOutputs } from './types';

export const createAudio: AivoovEndpoints['createAudio'] = async (
	ctx,
	input,
) => {
	const form: Record<string, string | string[] | undefined> = {
		'voice_id[]': input.voice_id,
		'transcribe_text[]': input.transcribe_text,
		'transcribe_ssml_pitch_rate[]': input.transcribe_ssml_pitch_rate?.map(
			(v) => (typeof v === 'number' ? String(v) : v),
		),
		'transcribe_ssml_spk_rate[]': input.transcribe_ssml_spk_rate?.map((v) =>
			typeof v === 'number' ? String(v) : v,
		),
		'transcribe_ssml_volume[]': input.transcribe_ssml_volume?.map((v) =>
			typeof v === 'number' ? String(v) : v,
		),
	};

	// Remove undefined entries to keep the form payload clean
	for (const key of Object.keys(form)) {
		if (form[key] === undefined) {
			delete form[key];
		}
	}

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
