import {
	appendFields,
	appendFile,
	elevenLabsJson,
	logQuietly,
	pathId,
	TIMEOUTS_MS,
} from '../client';
import type { ElevenLabsEndpoints } from '../index';
import {
	ElevenLabsEndpointInputSchemas,
	ElevenLabsEndpointOutputSchemas,
} from './types';

const DEFAULT_STT_MODEL = 'scribe_v2';

export const convert: ElevenLabsEndpoints['speechToTextConvert'] = async (
	ctx,
	rawInput,
) => {
	const input =
		ElevenLabsEndpointInputSchemas.speechToTextConvert.parse(rawInput);
	const form = new FormData();
	if (input.fileBase64) {
		appendFile(form, 'file', {
			fileBase64: input.fileBase64,
			fileName: input.fileName,
			contentType: input.contentType,
		});
	}
	appendFields(form, {
		model_id: input.modelId ?? DEFAULT_STT_MODEL,
		source_url: input.sourceUrl,
		language_code: input.languageCode,
		tag_audio_events: input.tagAudioEvents,
		num_speakers: input.numSpeakers,
		timestamps_granularity: input.timestampsGranularity,
		diarize: input.diarize,
		temperature: input.temperature,
		seed: input.seed,
		file_format: input.fileFormat,
		use_multi_channel: input.useMultiChannel,
		webhook: input.webhook,
		webhook_id: input.webhookId,
		webhook_metadata: input.webhookMetadata,
	});
	for (const term of input.keyterms ?? []) form.append('keyterms', term);

	const response = ElevenLabsEndpointOutputSchemas.speechToTextConvert.parse(
		await elevenLabsJson('/v1/speech-to-text', ctx.key, {
			method: 'POST',
			query: { enable_logging: input.enableLogging },
			form,
			timeoutMs: TIMEOUTS_MS.longGeneration,
		}),
	);
	await logQuietly(ctx, 'elevenlabs.speechToText.convert', {
		webhook: input.webhook ?? false,
		transcriptionId: response.transcription_id,
		requestId: response.request_id,
	});
	return response;
};

export const getTranscript: ElevenLabsEndpoints['speechToTextGetTranscript'] =
	async (ctx, rawInput) => {
		const input =
			ElevenLabsEndpointInputSchemas.speechToTextGetTranscript.parse(rawInput);
		const response =
			ElevenLabsEndpointOutputSchemas.speechToTextGetTranscript.parse(
				await elevenLabsJson(
					`/v1/speech-to-text/transcripts/${pathId(input.transcriptionId)}`,
					ctx.key,
				),
			);
		await logQuietly(ctx, 'elevenlabs.speechToText.getTranscript', {
			transcriptionId: input.transcriptionId,
		});
		return response;
	};

export const deleteTranscript: ElevenLabsEndpoints['speechToTextDeleteTranscript'] =
	async (ctx, rawInput) => {
		const input =
			ElevenLabsEndpointInputSchemas.speechToTextDeleteTranscript.parse(
				rawInput,
			);
		const response =
			ElevenLabsEndpointOutputSchemas.speechToTextDeleteTranscript.parse(
				await elevenLabsJson(
					`/v1/speech-to-text/transcripts/${pathId(input.transcriptionId)}`,
					ctx.key,
					{ method: 'DELETE' },
				),
			);
		await logQuietly(ctx, 'elevenlabs.speechToText.deleteTranscript', {
			transcriptionId: input.transcriptionId,
		});
		return response;
	};

export const align: ElevenLabsEndpoints['forcedAlignmentCreate'] = async (
	ctx,
	rawInput,
) => {
	const input =
		ElevenLabsEndpointInputSchemas.forcedAlignmentCreate.parse(rawInput);
	const form = new FormData();
	appendFile(form, 'file', input);
	appendFields(form, { text: input.text });
	const response = ElevenLabsEndpointOutputSchemas.forcedAlignmentCreate.parse(
		await elevenLabsJson('/v1/forced-alignment', ctx.key, {
			method: 'POST',
			form,
			timeoutMs: TIMEOUTS_MS.longGeneration,
		}),
	);
	await logQuietly(ctx, 'elevenlabs.forcedAlignment.create', {
		words: response.words?.length ?? 0,
	});
	return response;
};
