import { logEventFromContext } from 'corsair/core';
import { makeAivoovRequest } from '../client';
import type { AivoovEndpoints } from '../index';
import type { AivoovEndpointOutputs } from './types';

export const createAudio: AivoovEndpoints['createAudio'] = async (
	ctx,
	input,
) => {
	// Runtime guard: schema superRefine already validates this, but we
	// reject explicitly here too so a misconfigured caller gets a clear error
	// before any network request is sent.
	const n = input.transcribe_text.length;
	const ssmlFields = [
		'transcribe_ssml_pitch_rate',
		'transcribe_ssml_spk_rate',
		'transcribe_ssml_volume',
	] as const;

	if (input.voice_id.length !== n) {
		throw new Error(
			`voice_id length (${input.voice_id.length}) must match transcribe_text length (${n})`,
		);
	}
	for (const field of ssmlFields) {
		const arr = input[field];
		if (arr !== undefined && arr.length !== n) {
			throw new Error(
				`${field} length (${arr.length}) must match transcribe_text length (${n})`,
			);
		}
	}

	const params = new URLSearchParams();
	for (const id of input.voice_id) params.append('voice_id[]', id);
	for (const text of input.transcribe_text)
		params.append('transcribe_text[]', text);

	if (input.transcribe_ssml_pitch_rate) {
		for (const v of input.transcribe_ssml_pitch_rate) {
			params.append('transcribe_ssml_pitch_rate[]', String(v));
		}
	}
	if (input.transcribe_ssml_spk_rate) {
		for (const v of input.transcribe_ssml_spk_rate) {
			params.append('transcribe_ssml_spk_rate[]', String(v));
		}
	}
	if (input.transcribe_ssml_volume) {
		for (const v of input.transcribe_ssml_volume) {
			params.append('transcribe_ssml_volume[]', String(v));
		}
	}

	const response = await makeAivoovRequest<
		AivoovEndpointOutputs['createAudio']
	>('/create', ctx.key, {
		method: 'POST',
		form: Object.fromEntries(params) as Record<string, string>,
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
