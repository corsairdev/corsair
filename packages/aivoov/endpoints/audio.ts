import { logEventFromContext } from 'corsair/core';
import { assertAivoovSuccess, makeAivoovRequest } from '../client';
import type { AivoovEndpoints } from '../index';
import type { CreateAudioInput, CreateAudioResponse } from './types';

/**
 * AiVOOV builds its parallel arrays from repeated `name[]` keys in a
 * form-encoded body, so each entry is appended under the same key in order.
 */
function buildCreateAudioForm(input: CreateAudioInput): URLSearchParams {
	const form = new URLSearchParams();

	for (const voiceId of input.voice_id) {
		form.append('voice_id[]', voiceId);
	}
	for (const text of input.transcribe_text) {
		form.append('transcribe_text[]', text);
	}

	const ssmlFields = [
		['transcribe_ssml_pitch_rate[]', input.transcribe_ssml_pitch_rate],
		['transcribe_ssml_spk_rate[]', input.transcribe_ssml_spk_rate],
		['transcribe_ssml_volume[]', input.transcribe_ssml_volume],
	] as const;

	for (const [key, values] of ssmlFields) {
		if (!values) continue;
		for (const value of values) {
			form.append(key, String(value));
		}
	}

	return form;
}

export const create: AivoovEndpoints['createAudio'] = async (ctx, input) => {
	const response = await makeAivoovRequest<CreateAudioResponse>(
		'/create',
		ctx.key,
		{ method: 'POST', form: buildCreateAudioForm(input) },
	);

	assertAivoovSuccess(response, 'audio.create');

	// The transcribed text and the Base64 audio are deliberately left out of the
	// event payload: the text is user content and the audio can be megabytes.
	await logEventFromContext(
		ctx,
		'aivoov.audio.create',
		{
			voice_ids: input.voice_id,
			segment_count: input.transcribe_text.length,
			character_count: input.transcribe_text.reduce(
				(total, text) => total + text.length,
				0,
			),
		},
		'completed',
	);

	return response;
};

export { buildCreateAudioForm };
