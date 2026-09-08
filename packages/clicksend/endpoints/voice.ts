import { logEventFromContext } from 'corsair/core';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendEndpoints } from '../index';
import type { ClickSendEndpointOutputs } from './types';

export const send: ClickSendEndpoints['voiceSend'] = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest<
		ClickSendEndpointOutputs['voiceSend']
	>('voice/send', username, apiKey, {
		method: 'POST',
		body: { messages: input.messages },
	});

	await logEventFromContext(
		ctx,
		'clicksend.voice.send',
		{ count: input.messages.length },
		'completed',
	);

	return response;
};

export const history: ClickSendEndpoints['voiceHistory'] = async (
	ctx,
	input,
) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest<
		ClickSendEndpointOutputs['voiceHistory']
	>('voice/history', username, apiKey, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'clicksend.voice.history',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};
