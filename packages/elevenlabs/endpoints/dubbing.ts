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

export const create: ElevenLabsEndpoints['dubbingCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.dubbingCreate.parse(rawInput);
	const form = new FormData();
	if (input.fileBase64) {
		appendFile(form, 'file', {
			fileBase64: input.fileBase64,
			fileName: input.fileName,
			contentType: input.contentType,
		});
	}
	appendFields(form, {
		source_url: input.sourceUrl,
		target_lang: input.targetLang,
		source_lang: input.sourceLang,
		name: input.name,
		num_speakers: input.numSpeakers,
		watermark: input.watermark,
		start_time: input.startTime,
		end_time: input.endTime,
		highest_resolution: input.highestResolution,
		drop_background_audio: input.dropBackgroundAudio,
		use_profanity_filter: input.useProfanityFilter,
		disable_voice_cloning: input.disableVoiceCloning,
	});
	const response = ElevenLabsEndpointOutputSchemas.dubbingCreate.parse(
		await elevenLabsJson('/v1/dubbing', ctx.key, {
			method: 'POST',
			form,
			timeoutMs: TIMEOUTS_MS.shortGeneration,
		}),
	);
	await logQuietly(ctx, 'elevenlabs.dubbing.create', {
		dubbingId: response.dubbing_id,
		targetLang: input.targetLang,
	});
	return response;
};

export const get: ElevenLabsEndpoints['dubbingGet'] = async (ctx, rawInput) => {
	const input = ElevenLabsEndpointInputSchemas.dubbingGet.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.dubbingGet.parse(
		await elevenLabsJson(`/v1/dubbing/${pathId(input.dubbingId)}`, ctx.key),
	);
	await logQuietly(ctx, 'elevenlabs.dubbing.get', {
		dubbingId: input.dubbingId,
		status: response.status,
	});
	return response;
};

export const list: ElevenLabsEndpoints['dubbingList'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.dubbingList.parse(
		rawInput ?? {},
	);
	const response = ElevenLabsEndpointOutputSchemas.dubbingList.parse(
		await elevenLabsJson('/v1/dubbing', ctx.key, {
			query: {
				cursor: input.cursor,
				page_size: input.pageSize,
				dubbing_status: input.dubbingStatus,
				filter_by_creator: input.filterByCreator,
				order_by: input.orderBy,
				order_direction: input.orderDirection,
			},
		}),
	);
	await logQuietly(ctx, 'elevenlabs.dubbing.list', {
		count: response.dubs.length,
	});
	return response;
};

export const remove: ElevenLabsEndpoints['dubbingDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.dubbingDelete.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.dubbingDelete.parse(
		await elevenLabsJson(`/v1/dubbing/${pathId(input.dubbingId)}`, ctx.key, {
			method: 'DELETE',
		}),
	);
	await logQuietly(ctx, 'elevenlabs.dubbing.delete', {
		dubbingId: input.dubbingId,
	});
	return response;
};

export const getAudio: ElevenLabsEndpoints['dubbingGetAudio'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.dubbingGetAudio.parse(rawInput);
	const path = `/v1/dubbing/${pathId(input.dubbingId)}/audio/${pathId(input.languageCode)}`;
	const response = ElevenLabsEndpointOutputSchemas.dubbingGetAudio.parse(
		toBinaryResult(
			await elevenLabsBinary(path, ctx.key, {
				timeoutMs: TIMEOUTS_MS.shortGeneration,
			}),
			{ ...input, refetchable: true, downloadPath: path },
		),
	);
	await logQuietly(ctx, 'elevenlabs.dubbing.getAudio', {
		dubbingId: input.dubbingId,
		byteLength: response.byteLength,
	});
	return response;
};

export const getTranscript: ElevenLabsEndpoints['dubbingGetTranscript'] =
	async (ctx, rawInput) => {
		const input =
			ElevenLabsEndpointInputSchemas.dubbingGetTranscript.parse(rawInput);
		const response = ElevenLabsEndpointOutputSchemas.dubbingGetTranscript.parse(
			await elevenLabsJson(
				`/v1/dubbing/${pathId(input.dubbingId)}/transcripts/${pathId(input.languageCode)}/format/${input.formatType ?? 'srt'}`,
				ctx.key,
			),
		);
		await logQuietly(ctx, 'elevenlabs.dubbing.getTranscript', {
			dubbingId: input.dubbingId,
		});
		return response;
	};
