import { logEventFromContext } from 'corsair/core';
import {
	base64ByteLength,
	contentTypeOfOutputFormat,
	DEFAULT_MAX_CONTENT_BYTES,
	elevenLabsBinary,
	elevenLabsJsonWithHeaders,
	pathId,
	TIMEOUTS_MS,
	toBinaryResult,
} from '../client';
import type { ElevenLabsEndpoints } from '../index';
import type { TextToSpeechConvertInput } from './types';
import {
	ElevenLabsEndpointInputSchemas,
	ElevenLabsEndpointOutputSchemas,
} from './types';

const speechQuery = (input: {
	outputFormat?: string;
	enableLogging?: boolean;
}) => ({
	output_format: input.outputFormat,
	enable_logging: input.enableLogging,
});

const speechBody = (input: TextToSpeechConvertInput) => ({
	text: input.text,
	model_id: input.modelId,
	language_code: input.languageCode,
	voice_settings: input.voiceSettings,
	pronunciation_dictionary_locators: input.pronunciationDictionaryLocators,
	seed: input.seed,
	previous_text: input.previousText,
	next_text: input.nextText,
	previous_request_ids: input.previousRequestIds,
	next_request_ids: input.nextRequestIds,
	apply_text_normalization: input.applyTextNormalization,
	apply_language_text_normalization: input.applyLanguageTextNormalization,
});

export const convert: ElevenLabsEndpoints['textToSpeechConvert'] = async (
	ctx,
	rawInput,
) => {
	const input =
		ElevenLabsEndpointInputSchemas.textToSpeechConvert.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.textToSpeechConvert.parse(
		toBinaryResult(
			await elevenLabsBinary(
				`/v1/text-to-speech/${pathId(input.voiceId)}`,
				ctx.key,
				{
					method: 'POST',
					query: speechQuery(input),
					json: speechBody(input),
					timeoutMs: TIMEOUTS_MS.shortGeneration,
				},
			),
			input,
		),
	);
	await logEventFromContext(
		ctx,
		'elevenlabs.textToSpeech.convert',
		{
			voiceId: input.voiceId,
			byteLength: response.byteLength,
			characterCost: response.characterCost,
			historyItemId: response.historyItemId,
		},
		'completed',
	);
	return response;
};

export const convertWithTimestamps: ElevenLabsEndpoints['textToSpeechConvertWithTimestamps'] =
	async (ctx, rawInput) => {
		const input =
			ElevenLabsEndpointInputSchemas.textToSpeechConvertWithTimestamps.parse(
				rawInput,
			);
		// unknown: the body before the schema parses it; only the audio field is read here.
		const { body, metadata } = await elevenLabsJsonWithHeaders<
			Record<string, unknown>
		>(`/v1/text-to-speech/${pathId(input.voiceId)}/with-timestamps`, ctx.key, {
			method: 'POST',
			query: speechQuery(input),
			json: speechBody(input),
			timeoutMs: TIMEOUTS_MS.shortGeneration,
		});

		const { audio_base64: audio, ...rest } = body;
		const audioBase64 = typeof audio === 'string' ? audio : '';
		const byteLength = base64ByteLength(audioBase64);
		// The base64 is already here, so the rule is the same as toBinaryResult's:
		// left out only when the history item can bring it back.
		const canDrop = Boolean(metadata.historyItemId);
		const omitted =
			canDrop && input.includeContent === false
				? ('not_requested' as const)
				: canDrop && byteLength > (input.maxBytes ?? DEFAULT_MAX_CONTENT_BYTES)
					? ('over_limit' as const)
					: undefined;

		const response =
			ElevenLabsEndpointOutputSchemas.textToSpeechConvertWithTimestamps.parse({
				...rest,
				...metadata,
				contentType: contentTypeOfOutputFormat(input.outputFormat),
				byteLength,
				...(omitted
					? {
							contentOmitted: omitted,
							note: `Left out of the result (${byteLength} bytes). Read it with history.getAudio({ historyItemId: '${metadata.historyItemId}', maxBytes: ${byteLength} }).`,
						}
					: { contentBase64: audioBase64 }),
			});
		await logEventFromContext(
			ctx,
			'elevenlabs.textToSpeech.convertWithTimestamps',
			{
				voiceId: input.voiceId,
				byteLength,
				characterCost: response.characterCost,
				historyItemId: response.historyItemId,
			},
			'completed',
		);
		return response;
	};

export const convertDialogue: ElevenLabsEndpoints['textToDialogueConvert'] =
	async (ctx, rawInput) => {
		const input =
			ElevenLabsEndpointInputSchemas.textToDialogueConvert.parse(rawInput);
		const response =
			ElevenLabsEndpointOutputSchemas.textToDialogueConvert.parse(
				toBinaryResult(
					await elevenLabsBinary('/v1/text-to-dialogue', ctx.key, {
						method: 'POST',
						query: speechQuery(input),
						json: {
							inputs: input.inputs.map((line) => ({
								text: line.text,
								voice_id: line.voiceId,
							})),
							model_id: input.modelId,
							language_code: input.languageCode,
							settings: input.settings,
							seed: input.seed,
							previous_text: input.previousText,
							future_text: input.futureText,
							pronunciation_dictionary_locators:
								input.pronunciationDictionaryLocators,
							apply_text_normalization: input.applyTextNormalization,
						},
						timeoutMs: TIMEOUTS_MS.shortGeneration,
					}),
					input,
				),
			);
		await logEventFromContext(
			ctx,
			'elevenlabs.textToDialogue.convert',
			{
				lines: input.inputs.length,
				byteLength: response.byteLength,
				characterCost: response.characterCost,
				historyItemId: response.historyItemId,
			},
			'completed',
		);
		return response;
	};
