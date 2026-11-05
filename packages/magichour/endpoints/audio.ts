import { logEventFromContext } from 'corsair/core';
import type { MagicHourEndpoints } from '..';
import { makeMagicHourRequest } from '../client';
import type { MagicHourEndpointOutputs } from './types';
import {
	MagicHourEndpointInputSchemas,
	MagicHourEndpointOutputSchemas,
} from './types';

// Both operations create an asynchronous audio project and return the new
// project id immediately; the caller polls `GET /v1/audio-projects/{id}`.
// Events log the id only, never the generation prompt or reference audio.

export const voiceGenerator: MagicHourEndpoints['audioVoiceGenerator'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.audioVoiceGenerator.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['audioVoiceGenerator']
	>('/v1/ai-voice-generator', ctx.key, { method: 'POST', body: parsedInput });

	const parsed =
		MagicHourEndpointOutputSchemas.audioVoiceGenerator.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.audio.voiceGenerator',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const voiceCloner: MagicHourEndpoints['audioVoiceCloner'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.audioVoiceCloner.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['audioVoiceCloner']
	>('/v1/ai-voice-cloner', ctx.key, { method: 'POST', body: parsedInput });

	const parsed =
		MagicHourEndpointOutputSchemas.audioVoiceCloner.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.audio.voiceCloner',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};
