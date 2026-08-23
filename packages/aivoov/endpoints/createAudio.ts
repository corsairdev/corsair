import { logEventFromContext } from 'corsair/core';
import type { AivoovEndpoints } from '..';
import { makeAivoovRequest } from '../client';
import type { AivoovEndpointOutputs } from './types';

export const createAudio: AivoovEndpoints['createAudio'] = async (
	ctx,
	input,
) => {
	const response = await makeAivoovRequest<
		AivoovEndpointOutputs['createAudio']
	>('create', ctx.key, {
		method: 'POST',
		body: {
			'voice_id[]': input.voice_id,
			'transcribe_text[]': input.text,
		},
		formEncoded: true,
	});

	await logEventFromContext(
		ctx,
		'aivoov.create.audio',
		{ ...input },
		'completed',
	);

	return response;
};
