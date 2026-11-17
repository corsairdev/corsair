import type { MistralAiEndpoints } from '../index';
import { callMistralAi, decodeBase64 } from './shared';
import {
	MistralAiEndpointInputSchemas,
	MistralAiEndpointOutputSchemas,
} from './types';

export const speech: MistralAiEndpoints['audioSpeech'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.audioSpeech.parse(rawInput);
	// Malformed base64 is refused before anything is sent; a data: URL prefix
	// or URL-safe alphabet goes out as plain standard base64, as Mistral expects.
	const ref_audio = input.ref_audio
		? Buffer.from(decodeBase64(input.ref_audio, 'ref_audio')).toString('base64')
		: undefined;
	// With stream off Mistral answers JSON: { audio_data } in base64.
	return callMistralAi(ctx, '/v1/audio/speech', {
		method: 'POST',
		body: { ...input, ...(ref_audio ? { ref_audio } : {}), stream: false },
		output: MistralAiEndpointOutputSchemas.audioSpeech,
		event: 'audio.speech',
		logged: {
			model: input.model,
			voice_id: input.voice_id,
			response_format: input.response_format,
		},
	});
};

/** Transcribes audio sent as base64, a URL or an uploaded file id (exactly one), as a multipart request. */
export const transcribe: MistralAiEndpoints['audioTranscribe'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.audioTranscribe.parse(rawInput);

	const formData = new FormData();
	formData.append('model', input.model);
	if (input.content_base64) {
		const bytes = decodeBase64(input.content_base64, 'content_base64');
		formData.append('file', new Blob([bytes]), input.filename);
	}
	if (input.file_url) formData.append('file_url', input.file_url);
	if (input.file_id) formData.append('file_id', input.file_id);
	if (input.language) formData.append('language', input.language);
	if (input.temperature !== undefined) {
		formData.append('temperature', String(input.temperature));
	}
	if (input.diarize !== undefined) {
		formData.append('diarize', String(input.diarize));
	}
	for (const term of input.context_bias ?? []) {
		formData.append('context_bias', term);
	}
	for (const granularity of input.timestamp_granularities ?? []) {
		formData.append('timestamp_granularities', granularity);
	}
	// Corsair returns one JSON result, so streaming stays off.
	formData.append('stream', 'false');

	return callMistralAi(ctx, '/v1/audio/transcriptions', {
		method: 'POST',
		formData,
		output: MistralAiEndpointOutputSchemas.audioTranscribe,
		event: 'audio.transcribe',
		logged: {
			model: input.model,
			file_id: input.file_id,
		},
	});
};
