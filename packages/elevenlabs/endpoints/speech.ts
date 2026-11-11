import {
	base64ByteLength,
	contentOmission,
	contentTypeOfOutputFormat,
	ElevenLabsRequestError,
	elevenLabsBinary,
	elevenLabsJsonWithHeaders,
	logQuietly,
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
	await logQuietly(ctx, 'elevenlabs.textToSpeech.convert', {
		voiceId: input.voiceId,
		byteLength: response.byteLength,
		characterCost: response.characterCost,
		historyItemId: response.historyItemId,
	});
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
		if (typeof audio !== 'string' || !audio) {
			throw new ElevenLabsRequestError(
				'ElevenLabs answered textToSpeech.convertWithTimestamps with success but no audio_base64. It may have been billed, so check before sending it again.',
			);
		}
		const byteLength = base64ByteLength(audio);
		// The base64 is already here; the rule is the same as for raw bytes.
		const omission = contentOmission(byteLength, metadata.historyItemId, input);

		const response =
			ElevenLabsEndpointOutputSchemas.textToSpeechConvertWithTimestamps.parse({
				...rest,
				...metadata,
				contentType: contentTypeOfOutputFormat(input.outputFormat),
				byteLength,
				...(omission ?? { contentBase64: audio }),
			});
		await logQuietly(ctx, 'elevenlabs.textToSpeech.convertWithTimestamps', {
			voiceId: input.voiceId,
			byteLength,
			characterCost: response.characterCost,
			historyItemId: response.historyItemId,
		});
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
		await logQuietly(ctx, 'elevenlabs.textToDialogue.convert', {
			lines: input.inputs.length,
			byteLength: response.byteLength,
			characterCost: response.characterCost,
			historyItemId: response.historyItemId,
		});
		return response;
	};
