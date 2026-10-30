import { logEventFromContext } from 'corsair/core';
import type { WitAiEndpoints } from '..';
import { makeWitAiRequest } from '../client';
import type { WitAiEndpointOutputs } from './types';

export const listIntents: WitAiEndpoints['intentsListIntents'] = async (
	ctx,
	_input,
) => {
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['intentsListIntents']
	>('intents', ctx.key, { method: 'GET' });
	await logEventFromContext(ctx, 'witai.intents.listIntents', {}, 'completed');
	return result;
};

export const getIntent: WitAiEndpoints['intentsGetIntent'] = async (
	ctx,
	input,
) => {
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['intentsGetIntent']
	>(`intents/${input.intent}`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'witai.intents.getIntent',
		{ intent: input.intent },
		'completed',
	);
	return result;
};

export const createIntent: WitAiEndpoints['intentsCreateIntent'] = async (
	ctx,
	input,
) => {
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['intentsCreateIntent']
	>('intents', ctx.key, {
		method: 'POST',
		body: { name: input.name },
	});
	await logEventFromContext(
		ctx,
		'witai.intents.createIntent',
		{ name: input.name },
		'completed',
	);
	return result;
};

export const deleteIntent: WitAiEndpoints['intentsDeleteIntent'] = async (
	ctx,
	input,
) => {
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['intentsDeleteIntent']
	>(`intents/${input.intent}`, ctx.key, { method: 'DELETE' });
	await logEventFromContext(
		ctx,
		'witai.intents.deleteIntent',
		{ intent: input.intent },
		'completed',
	);
	return result;
};
