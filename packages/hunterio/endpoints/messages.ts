import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['messagesList'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.messagesList.parse(input);
	const { status, ...rest } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['messagesList']
	>('/messages', ctx.key, {
		method: 'GET',
		query: {
			...rest,
			status: Array.isArray(status) ? status.join(',') : status,
		},
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.messagesList.parse(response);

	await logEventFromContext(ctx, 'hunterio.messages.list', {}, 'completed');

	return parsedResponse;
};

export const send: HunterioEndpoints['messagesSend'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.messagesSend.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['messagesSend']
	>('/messages', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.messagesSend.parse(response);

	// Recipient addresses and message bodies are deliberately not logged.
	await logEventFromContext(ctx, 'hunterio.messages.send', {}, 'completed');

	return parsedResponse;
};
