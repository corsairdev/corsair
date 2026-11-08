import { logEventFromContext } from 'corsair/core';
import {
	elevenLabsBinary,
	elevenLabsJson,
	pathId,
	TIMEOUTS_MS,
	toBinaryResult,
} from '../client';
import type { ElevenLabsEndpoints } from '../index';
import {
	ElevenLabsEndpointInputSchemas,
	ElevenLabsEndpointOutputSchemas,
} from './types';

export const list: ElevenLabsEndpoints['historyList'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.historyList.parse(
		rawInput ?? {},
	);
	const response = ElevenLabsEndpointOutputSchemas.historyList.parse(
		await elevenLabsJson('/v1/history', ctx.key, {
			query: {
				page_size: input.pageSize,
				start_after_history_item_id: input.startAfterHistoryItemId,
				voice_id: input.voiceId,
				model_id: input.modelId,
				date_before_unix: input.dateBeforeUnix,
				date_after_unix: input.dateAfterUnix,
				sort_direction: input.sortDirection,
				search: input.search,
				source: input.source,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'elevenlabs.history.list',
		{ count: response.history.length },
		'completed',
	);
	return response;
};

export const get: ElevenLabsEndpoints['historyGet'] = async (ctx, rawInput) => {
	const input = ElevenLabsEndpointInputSchemas.historyGet.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.historyGet.parse(
		await elevenLabsJson(`/v1/history/${pathId(input.historyItemId)}`, ctx.key),
	);
	await logEventFromContext(
		ctx,
		'elevenlabs.history.get',
		{ historyItemId: input.historyItemId },
		'completed',
	);
	return response;
};

export const getAudio: ElevenLabsEndpoints['historyGetAudio'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.historyGetAudio.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.historyGetAudio.parse(
		toBinaryResult(
			{
				...(await elevenLabsBinary(
					`/v1/history/${pathId(input.historyItemId)}/audio`,
					ctx.key,
					{ timeoutMs: TIMEOUTS_MS.shortGeneration },
				)),
				historyItemId: input.historyItemId,
			},
			{ ...input, refetchable: true },
		),
	);
	await logEventFromContext(
		ctx,
		'elevenlabs.history.getAudio',
		{ historyItemId: input.historyItemId, byteLength: response.byteLength },
		'completed',
	);
	return response;
};

export const remove: ElevenLabsEndpoints['historyDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = ElevenLabsEndpointInputSchemas.historyDelete.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.historyDelete.parse(
		await elevenLabsJson(
			`/v1/history/${pathId(input.historyItemId)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		),
	);
	await logEventFromContext(
		ctx,
		'elevenlabs.history.delete',
		{ historyItemId: input.historyItemId },
		'completed',
	);
	return response;
};
