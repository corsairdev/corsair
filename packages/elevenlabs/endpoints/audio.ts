import {
	appendFields,
	appendFile,
	elevenLabsBinary,
	elevenLabsJson,
	logQuietly,
	pathId,
	TIMEOUTS_MS,
	toBinaryResult,
} from '../client';
import type { ElevenLabsEndpoints } from '../index';
import {
	ElevenLabsEndpointInputSchemas,
	ElevenLabsEndpointOutputSchemas,
} from './types';

// The API's own defaults for these are the deprecated eleven_text_to_sound_v2
// and music_v1, removed in 2027, so the plugin always names a model.
const DEFAULT_SOUND_MODEL = 'eleven_text_to_sound_v3';
const DEFAULT_MUSIC_MODEL = 'music_v2_5';

export const generateSound: ElevenLabsEndpoints['soundEffectsGenerate'] =
	async (ctx, rawInput) => {
		const input =
			ElevenLabsEndpointInputSchemas.soundEffectsGenerate.parse(rawInput);
		const response = ElevenLabsEndpointOutputSchemas.soundEffectsGenerate.parse(
			toBinaryResult(
				await elevenLabsBinary('/v1/sound-generation', ctx.key, {
					method: 'POST',
					query: { output_format: input.outputFormat },
					json: {
						text: input.text,
						duration_seconds: input.durationSeconds,
						loop: input.loop,
						prompt_influence: input.promptInfluence,
						model_id: input.modelId ?? DEFAULT_SOUND_MODEL,
					},
					timeoutMs: TIMEOUTS_MS.shortGeneration,
				}),
			),
		);
		await logQuietly(ctx, 'elevenlabs.soundEffects.generate', {
			byteLength: response.byteLength,
			characterCost: response.characterCost,
		});
		return response;
	};

export const composeMusic: ElevenLabsEndpoints['musicCompose'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.musicCompose.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.musicCompose.parse(
		toBinaryResult(
			await elevenLabsBinary('/v1/music', ctx.key, {
				method: 'POST',
				query: { output_format: input.outputFormat },
				json: {
					prompt: input.prompt,
					composition_plan: input.compositionPlan,
					music_length_ms: input.musicLengthMs,
					lyrics_text: input.lyricsText,
					generation_mode: input.generationMode,
					model_id: input.modelId ?? DEFAULT_MUSIC_MODEL,
					seed: input.seed,
					force_instrumental: input.forceInstrumental,
				},
				timeoutMs: TIMEOUTS_MS.longGeneration,
			}),
		),
	);
	await logQuietly(ctx, 'elevenlabs.music.compose', {
		byteLength: response.byteLength,
		characterCost: response.characterCost,
		songId: response.songId,
	});
	return response;
};

export const planMusic: ElevenLabsEndpoints['musicPlan'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.musicPlan.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.musicPlan.parse(
		await elevenLabsJson('/v1/music/plan', ctx.key, {
			method: 'POST',
			json: {
				prompt: input.prompt,
				music_length_ms: input.musicLengthMs,
				source_composition_plan: input.sourceCompositionPlan,
				model_id: input.modelId ?? DEFAULT_MUSIC_MODEL,
			},
			timeoutMs: TIMEOUTS_MS.shortGeneration,
		}),
	);
	await logQuietly(ctx, 'elevenlabs.music.plan', {
		parts: (response.chunks ?? response.sections)?.length ?? 0,
	});
	return response;
};

export const separateStems: ElevenLabsEndpoints['musicSeparateStems'] = async (
	ctx,
	rawInput,
) => {
	const input =
		ElevenLabsEndpointInputSchemas.musicSeparateStems.parse(rawInput);
	const form = new FormData();
	appendFile(form, 'file', input);
	appendFields(form, { stem_variation_id: input.stemVariationId });
	const response = ElevenLabsEndpointOutputSchemas.musicSeparateStems.parse(
		toBinaryResult(
			await elevenLabsBinary('/v1/music/stem-separation', ctx.key, {
				method: 'POST',
				query: { output_format: input.outputFormat },
				form,
				timeoutMs: TIMEOUTS_MS.longGeneration,
			}),
		),
	);
	await logQuietly(ctx, 'elevenlabs.music.separateStems', {
		byteLength: response.byteLength,
		characterCost: response.characterCost,
	});
	return response;
};

export const isolate: ElevenLabsEndpoints['audioIsolationIsolate'] = async (
	ctx,
	rawInput,
) => {
	const input =
		ElevenLabsEndpointInputSchemas.audioIsolationIsolate.parse(rawInput);
	const form = new FormData();
	appendFile(form, 'audio', input);
	appendFields(form, { file_format: input.fileFormat });
	const response = ElevenLabsEndpointOutputSchemas.audioIsolationIsolate.parse(
		toBinaryResult(
			await elevenLabsBinary('/v1/audio-isolation', ctx.key, {
				method: 'POST',
				form,
				timeoutMs: TIMEOUTS_MS.longGeneration,
			}),
		),
	);
	await logQuietly(ctx, 'elevenlabs.audioIsolation.isolate', {
		byteLength: response.byteLength,
		characterCost: response.characterCost,
	});
	return response;
};

export const changeVoice: ElevenLabsEndpoints['voiceChangerConvert'] = async (
	ctx,
	rawInput,
) => {
	const input =
		ElevenLabsEndpointInputSchemas.voiceChangerConvert.parse(rawInput);
	const form = new FormData();
	appendFile(form, 'audio', input);
	appendFields(form, {
		model_id: input.modelId,
		voice_settings: input.voiceSettings,
		seed: input.seed,
		remove_background_noise: input.removeBackgroundNoise,
		file_format: input.fileFormat,
	});
	const response = ElevenLabsEndpointOutputSchemas.voiceChangerConvert.parse(
		toBinaryResult(
			await elevenLabsBinary(
				`/v1/voice-changer/${pathId(input.voiceId)}`,
				ctx.key,
				{
					method: 'POST',
					query: {
						output_format: input.outputFormat,
						enable_logging: input.enableLogging,
					},
					form,
					timeoutMs: TIMEOUTS_MS.longGeneration,
				},
			),
			input,
		),
	);
	await logQuietly(ctx, 'elevenlabs.voiceChanger.convert', {
		voiceId: input.voiceId,
		byteLength: response.byteLength,
		characterCost: response.characterCost,
		historyItemId: response.historyItemId,
	});
	return response;
};
