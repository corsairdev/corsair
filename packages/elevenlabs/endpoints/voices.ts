import {
	appendFields,
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

export const list: ElevenLabsEndpoints['voicesList'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.voicesList.parse(rawInput ?? {});
	const response = ElevenLabsEndpointOutputSchemas.voicesList.parse(
		await elevenLabsJson('/v2/voices', ctx.key, {
			query: {
				next_page_token: input.nextPageToken,
				page_size: input.pageSize,
				search: input.search,
				sort: input.sort,
				sort_direction: input.sortDirection,
				voice_type: input.voiceType,
				category: input.category,
				voice_ids: input.voiceIds,
			},
		}),
	);
	await logQuietly(ctx, 'elevenlabs.voices.list', {
		count: response.voices.length,
	});
	return response;
};

export const get: ElevenLabsEndpoints['voicesGet'] = async (ctx, rawInput) => {
	const input = ElevenLabsEndpointInputSchemas.voicesGet.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.voicesGet.parse(
		await elevenLabsJson(`/v1/voices/${pathId(input.voiceId)}`, ctx.key),
	);
	await logQuietly(ctx, 'elevenlabs.voices.get', { voiceId: input.voiceId });
	return response;
};

export const searchLibrary: ElevenLabsEndpoints['voicesSearchLibrary'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.voicesSearchLibrary.parse(
		rawInput ?? {},
	);
	const response = ElevenLabsEndpointOutputSchemas.voicesSearchLibrary.parse(
		await elevenLabsJson('/v1/shared-voices', ctx.key, {
			query: {
				search: input.search,
				page: input.page,
				page_size: input.pageSize,
				category: input.category,
				gender: input.gender,
				age: input.age,
				accent: input.accent,
				language: input.language,
				locale: input.locale,
				use_cases: input.useCases,
				descriptives: input.descriptives,
				featured: input.featured,
				sort: input.sort,
			},
		}),
	);
	await logQuietly(ctx, 'elevenlabs.voices.searchLibrary', {
		count: response.voices.length,
	});
	return response;
};

export const addFromLibrary: ElevenLabsEndpoints['voicesAddFromLibrary'] =
	async (ctx, rawInput) => {
		const input =
			ElevenLabsEndpointInputSchemas.voicesAddFromLibrary.parse(rawInput);
		const response = ElevenLabsEndpointOutputSchemas.voicesAddFromLibrary.parse(
			await elevenLabsJson(
				`/v1/voices/add/${pathId(input.publicUserId)}/${pathId(input.voiceId)}`,
				ctx.key,
				{ method: 'POST', json: { new_name: input.newName } },
			),
		);
		await logQuietly(ctx, 'elevenlabs.voices.addFromLibrary', {
			voiceId: response.voice_id,
		});
		return response;
	};

export const edit: ElevenLabsEndpoints['voicesEdit'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.voicesEdit.parse(rawInput);
	const form = new FormData();
	appendFields(form, {
		name: input.name,
		description: input.description,
		labels: input.labels,
	});
	const response = ElevenLabsEndpointOutputSchemas.voicesEdit.parse(
		await elevenLabsJson(`/v1/voices/${pathId(input.voiceId)}/edit`, ctx.key, {
			method: 'POST',
			form,
		}),
	);
	await logQuietly(ctx, 'elevenlabs.voices.edit', { voiceId: input.voiceId });
	return response;
};

export const remove: ElevenLabsEndpoints['voicesDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.voicesDelete.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.voicesDelete.parse(
		await elevenLabsJson(`/v1/voices/${pathId(input.voiceId)}`, ctx.key, {
			method: 'DELETE',
		}),
	);
	await logQuietly(ctx, 'elevenlabs.voices.delete', { voiceId: input.voiceId });
	return response;
};

export const getSettings: ElevenLabsEndpoints['voicesGetSettings'] = async (
	ctx,
	rawInput,
) => {
	const input =
		ElevenLabsEndpointInputSchemas.voicesGetSettings.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.voicesGetSettings.parse(
		await elevenLabsJson(
			`/v1/voices/${pathId(input.voiceId)}/settings`,
			ctx.key,
		),
	);
	await logQuietly(ctx, 'elevenlabs.voices.getSettings', {
		voiceId: input.voiceId,
	});
	return response;
};

export const editSettings: ElevenLabsEndpoints['voicesEditSettings'] = async (
	ctx,
	rawInput,
) => {
	const input =
		ElevenLabsEndpointInputSchemas.voicesEditSettings.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.voicesEditSettings.parse(
		await elevenLabsJson(
			`/v1/voices/${pathId(input.voiceId)}/settings/edit`,
			ctx.key,
			{ method: 'POST', json: input.settings },
		),
	);
	await logQuietly(ctx, 'elevenlabs.voices.editSettings', {
		voiceId: input.voiceId,
	});
	return response;
};

export const defaultSettings: ElevenLabsEndpoints['voicesDefaultSettings'] =
	async (ctx, rawInput) => {
		ElevenLabsEndpointInputSchemas.voicesDefaultSettings.parse(rawInput ?? {});
		const response =
			ElevenLabsEndpointOutputSchemas.voicesDefaultSettings.parse(
				await elevenLabsJson('/v1/voices/settings/default', ctx.key),
			);
		await logQuietly(ctx, 'elevenlabs.voices.defaultSettings', {});
		return response;
	};

/**
 * Design and remix always ask for streaming previews. ElevenLabs only serves a
 * preview from its /stream endpoint when it was made that way (it answers 400
 * otherwise), so this is what lets voiceDesign.getPreview read any preview later,
 * with the usual size limits, instead of base64 for all three landing in a result
 * that paid for them and may be too big to return.
 */
function previewsResult<
	// unknown: the body before the schema parses it; only the previews are read here.
	T extends Record<string, unknown>,
>(body: T) {
	// A body with no previews list goes to the schema as it came, which refuses it.
	if (!Array.isArray(body.previews)) return body;
	const previews = body.previews as Array<Record<string, unknown>>;
	return {
		...body,
		previews: previews.map(({ audio_base_64: _audio, ...preview }) => preview),
		note: "Hear a preview with voiceDesign.getPreview({ generatedVoiceId }), which doesn't generate again. voiceDesign.create saves one as a voice.",
	};
}

export const design: ElevenLabsEndpoints['voiceDesignDesign'] = async (
	ctx,
	rawInput,
) => {
	const input =
		ElevenLabsEndpointInputSchemas.voiceDesignDesign.parse(rawInput);
	// unknown: the body before the schema parses it, in limitPreviews and below.
	const body = await elevenLabsJson<Record<string, unknown>>(
		'/v1/text-to-voice/design',
		ctx.key,
		{
			method: 'POST',
			query: { output_format: input.outputFormat },
			json: {
				voice_description: input.voiceDescription,
				model_id: input.modelId,
				text: input.text,
				auto_generate_text: input.autoGenerateText,
				loudness: input.loudness,
				seed: input.seed,
				guidance_scale: input.guidanceScale,
				should_enhance: input.shouldEnhance,
				stream_previews: true,
			},
			timeoutMs: TIMEOUTS_MS.shortGeneration,
		},
	);
	const response = ElevenLabsEndpointOutputSchemas.voiceDesignDesign.parse(
		previewsResult(body),
	);
	await logQuietly(ctx, 'elevenlabs.voiceDesign.design', {
		previews: response.previews.length,
	});
	return response;
};

export const getPreview: ElevenLabsEndpoints['voiceDesignGetPreview'] = async (
	ctx,
	rawInput,
) => {
	const input =
		ElevenLabsEndpointInputSchemas.voiceDesignGetPreview.parse(rawInput);
	const path = `/v1/text-to-voice/${pathId(input.generatedVoiceId)}/stream`;
	const response = ElevenLabsEndpointOutputSchemas.voiceDesignGetPreview.parse(
		toBinaryResult(
			await elevenLabsBinary(path, ctx.key, {
				timeoutMs: TIMEOUTS_MS.shortGeneration,
			}),
			{ ...input, refetchable: true, downloadPath: path },
		),
	);
	await logQuietly(ctx, 'elevenlabs.voiceDesign.getPreview', {
		generatedVoiceId: input.generatedVoiceId,
		byteLength: response.byteLength,
	});
	return response;
};

export const createDesigned: ElevenLabsEndpoints['voiceDesignCreate'] = async (
	ctx,
	rawInput,
) => {
	const input =
		ElevenLabsEndpointInputSchemas.voiceDesignCreate.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.voiceDesignCreate.parse(
		await elevenLabsJson('/v1/text-to-voice', ctx.key, {
			method: 'POST',
			json: {
				voice_name: input.voiceName,
				voice_description: input.voiceDescription,
				generated_voice_id: input.generatedVoiceId,
				labels: input.labels,
			},
		}),
	);
	await logQuietly(ctx, 'elevenlabs.voiceDesign.create', {
		voiceId: response.voice_id,
	});
	return response;
};

export const remix: ElevenLabsEndpoints['voiceDesignRemix'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.voiceDesignRemix.parse(rawInput);
	// unknown: the body before the schema parses it, in limitPreviews and below.
	const body = await elevenLabsJson<Record<string, unknown>>(
		`/v1/text-to-voice/${pathId(input.voiceId)}/remix`,
		ctx.key,
		{
			method: 'POST',
			query: { output_format: input.outputFormat },
			json: {
				voice_description: input.voiceDescription,
				text: input.text,
				auto_generate_text: input.autoGenerateText,
				loudness: input.loudness,
				seed: input.seed,
				guidance_scale: input.guidanceScale,
				prompt_strength: input.promptStrength,
				stream_previews: true,
			},
			timeoutMs: TIMEOUTS_MS.shortGeneration,
		},
	);
	const response = ElevenLabsEndpointOutputSchemas.voiceDesignRemix.parse(
		previewsResult(body),
	);
	await logQuietly(ctx, 'elevenlabs.voiceDesign.remix', {
		voiceId: input.voiceId,
		previews: response.previews.length,
	});
	return response;
};
