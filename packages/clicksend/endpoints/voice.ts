import { logEventFromContext } from 'corsair/core';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendEndpoints } from '../index';
import { ClickSendEndpointOutputSchemas } from './types';

export const send: ClickSendEndpoints['voiceSend'] = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('voice/send', username, apiKey, {
		method: 'POST',
		body: { messages: input.messages },
		responseSchema: ClickSendEndpointOutputSchemas.voiceSend,
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

	const response = await makeClickSendRequest(
		'voice/history',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
			},
			responseSchema: ClickSendEndpointOutputSchemas.voiceHistory,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.voice.history',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};
