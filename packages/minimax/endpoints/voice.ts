import { logEventFromContext } from 'corsair/core';
import type { MinimaxEndpoints } from '..';
import { makeMinimaxRequest } from '../client';
import type {
	VoiceCloneOutput,
	VoiceDeleteOutput,
	VoiceDesignOutput,
	VoiceListOutput,
} from './types';
import {
	MinimaxEndpointInputSchemas,
	MinimaxEndpointOutputSchemas,
} from './types';

export const list: MinimaxEndpoints['voiceList'] = async (ctx, input) => {
	const parsedInput = MinimaxEndpointInputSchemas.voiceList.parse(input);

	const response = await makeMinimaxRequest<VoiceListOutput>(
		'/v1/get_voice',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed = MinimaxEndpointOutputSchemas.voiceList.parse(response);

	const count =
		(parsed.system_voice?.length ?? 0) +
		(parsed.voice_cloning?.length ?? 0) +
		(parsed.voice_generation?.length ?? 0);

	await logEventFromContext(
		ctx,
		'minimax.voice.list',
		{ voiceType: parsedInput.voice_type, count },
		'completed',
	);

	return parsed;
};

export const clone: MinimaxEndpoints['voiceClone'] = async (ctx, input) => {
	const parsedInput = MinimaxEndpointInputSchemas.voiceClone.parse(input);

	const response = await makeMinimaxRequest<VoiceCloneOutput>(
		'/v1/voice_clone',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed = MinimaxEndpointOutputSchemas.voiceClone.parse(response);

	// Voice ids identify the caller's cloned voices, not people, and no audio
	// content is echoed back.
	await logEventFromContext(
		ctx,
		'minimax.voice.clone',
		{ voiceId: parsedInput.voice_id },
		'completed',
	);

	return parsed;
};

export const design: MinimaxEndpoints['voiceDesign'] = async (ctx, input) => {
	const parsedInput = MinimaxEndpointInputSchemas.voiceDesign.parse(input);

	const response = await makeMinimaxRequest<VoiceDesignOutput>(
		'/v1/voice_design',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed = MinimaxEndpointOutputSchemas.voiceDesign.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.voice.design',
		{ voiceId: parsed.voice_id },
		'completed',
	);

	return parsed;
};

export const remove: MinimaxEndpoints['voiceDelete'] = async (ctx, input) => {
	const parsedInput = MinimaxEndpointInputSchemas.voiceDelete.parse(input);

	const response = await makeMinimaxRequest<VoiceDeleteOutput>(
		'/v1/delete_voice',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed = MinimaxEndpointOutputSchemas.voiceDelete.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.voice.delete',
		{ voiceType: parsedInput.voice_type, voiceId: parsedInput.voice_id },
		'completed',
	);

	return parsed;
};
