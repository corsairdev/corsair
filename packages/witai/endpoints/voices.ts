import { logEventFromContext } from 'corsair/core';
import type { WitAiEndpoints } from '..';
import { makeWitAiRequest } from '../client';
import type { WitAiEndpointOutputs } from './types';

export const listVoices: WitAiEndpoints['voicesListVoices'] = async (
	ctx,
	_input,
) => {
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['voicesListVoices']
	>('voices', ctx.key, { method: 'GET' });
	await logEventFromContext(ctx, 'witai.voices.listVoices', {}, 'completed');
	return result;
};

export const getVoice: WitAiEndpoints['voicesGetVoice'] = async (
	ctx,
	input,
) => {
	const result = await makeWitAiRequest<WitAiEndpointOutputs['voicesGetVoice']>(
		`voices/${input.voice}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'witai.voices.getVoice',
		{ voice: input.voice },
		'completed',
	);
	return result;
};
