import { logEventFromContext } from 'corsair/core';
import {
	appendFields,
	base64ByteLength,
	DEFAULT_MAX_CONTENT_BYTES,
	elevenLabsJson,
	pathId,
	TIMEOUTS_MS,
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
	await logEventFromContext(
		ctx,
		'elevenlabs.voices.list',
		{ count: response.voices.length },
		'completed',
	);
	return response;
};

export const get: ElevenLabsEndpoints['voicesGet'] = async (ctx, rawInput) => {
	const input = ElevenLabsEndpointInputSchemas.voicesGet.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.voicesGet.parse(
		await elevenLabsJson(`/v1/voices/${pathId(input.voiceId)}`, ctx.key),
	);
	await logEventFromContext(
		ctx,
		'elevenlabs.voices.get',
		{ voiceId: input.voiceId },
		'completed',
	);
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
	await logEventFromContext(
		ctx,
		'elevenlabs.voices.searchLibrary',
		{ count: response.voices.length },
		'completed',
	);
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
		await logEventFromContext(
			ctx,
			'elevenlabs.voices.addFromLibrary',
			{ voiceId: response.voice_id },
			'completed',
		);
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
	await logEventFromContext(
		ctx,
		'elevenlabs.voices.edit',
		{ voiceId: input.voiceId },
		'completed',
	);
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
	await logEventFromContext(
		ctx,
		'elevenlabs.voices.delete',
		{ voiceId: input.voiceId },
		'completed',
	);
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
	await logEventFromContext(
		ctx,
		'elevenlabs.voices.getSettings',
		{ voiceId: input.voiceId },
		'completed',
	);
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
	await logEventFromContext(
		ctx,
		'elevenlabs.voices.editSettings',
		{ voiceId: input.voiceId },
		'completed',
	);
	return response;
};

export const defaultSettings: ElevenLabsEndpoints['voicesDefaultSettings'] =
	async (ctx, rawInput) => {
		ElevenLabsEndpointInputSchemas.voicesDefaultSettings.parse(rawInput ?? {});
		const response =
			ElevenLabsEndpointOutputSchemas.voicesDefaultSettings.parse(
				await elevenLabsJson('/v1/voices/settings/default', ctx.key),
			);
		await logEventFromContext(
			ctx,
			'elevenlabs.voices.defaultSettings',
			{},
			'completed',
		);
		return response;
	};

/**
 * Previews come back as base64 inside the JSON. They can't be read again
 * through this plugin, but the generated_voice_id that creates the voice stays
 * in the result either way.
 */
function limitPreviews<
	// unknown: the body before the schema parses it; only the previews are read here.
	T extends Record<string, unknown>,
>(body: T, input: { includeAudio?: boolean; maxBytes?: number }) {
	const previews = Array.isArray(body.previews)
		? (body.previews as Array<Record<string, unknown>>)
		: [];
	const total = previews.reduce(
		(sum, preview) =>
			sum +
			(typeof preview.audio_base_64 === 'string'
				? base64ByteLength(preview.audio_base_64)
				: 0),
		0,
	);
	const omitted =
		input.includeAudio === false
			? ('not_requested' as const)
			: total > (input.maxBytes ?? DEFAULT_MAX_CONTENT_BYTES)
				? ('over_limit' as const)
				: undefined;
	if (!omitted) return body;
	return {
		...body,
		previews: previews.map(({ audio_base_64: _audio, ...preview }) => preview),
		contentOmitted: omitted,
		note:
			omitted === 'over_limit'
				? `The previews total ${total} bytes, over the limit for a result. Ask again with a larger maxBytes or a lower outputFormat to hear them; generated_voice_id still creates the voice.`
				: 'Preview audio left out as asked; generated_voice_id still creates the voice.',
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
			},
			timeoutMs: TIMEOUTS_MS.shortGeneration,
		},
	);
	const response = ElevenLabsEndpointOutputSchemas.voiceDesignDesign.parse(
		limitPreviews(body, input),
	);
	await logEventFromContext(
		ctx,
		'elevenlabs.voiceDesign.design',
		{ previews: response.previews.length },
		'completed',
	);
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
	await logEventFromContext(
		ctx,
		'elevenlabs.voiceDesign.create',
		{ voiceId: response.voice_id },
		'completed',
	);
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
			},
			timeoutMs: TIMEOUTS_MS.shortGeneration,
		},
	);
	const response = ElevenLabsEndpointOutputSchemas.voiceDesignRemix.parse(
		limitPreviews(body, input),
	);
	await logEventFromContext(
		ctx,
		'elevenlabs.voiceDesign.remix',
		{ voiceId: input.voiceId, previews: response.previews.length },
		'completed',
	);
	return response;
};
