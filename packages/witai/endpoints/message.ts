import { logEventFromContext } from 'corsair/core';
import type { WitAiEndpoints } from '..';
import { makeWitAiRequest } from '../client';
import type { WitAiEndpointOutputs } from './types';

export const getMessage: WitAiEndpoints['messageGetMessage'] = async (
	ctx,
	input,
) => {
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['messageGetMessage']
	>('message', ctx.key, {
		method: 'GET',
		query: {
			q: input.q,
			n: input.n,
			tag: input.tag,
			context: input.context,
		},
	});
	await logEventFromContext(
		ctx,
		'witai.message.getMessage',
		{ text: input.q },
		'completed',
	);
	return result;
};

export const detectLanguage: WitAiEndpoints['messageDetectLanguage'] = async (
	ctx,
	input,
) => {
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['messageDetectLanguage']
	>('language', ctx.key, {
		method: 'GET',
		query: {
			q: input.q,
			n: input.n,
		},
	});
	await logEventFromContext(
		ctx,
		'witai.message.detectLanguage',
		{ text: input.q },
		'completed',
	);
	return result;
};
