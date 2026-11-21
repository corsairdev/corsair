import { logEventFromContext } from 'corsair/core';
import type { LodgifyEndpoints } from '..';
import { makeLodgifyRequest } from '../client';
import {
	LodgifyEndpointInputSchemas,
	LodgifyEndpointOutputSchemas,
} from './types';

export const list: LodgifyEndpoints['messages.list'] = async (ctx, input) => {
	const parsedInput = LodgifyEndpointInputSchemas['messages.list'].parse(input);

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest(
		`/v2/messaging/${encodeURIComponent(parsedInput.threadGuid)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = LodgifyEndpointOutputSchemas['messages.list'].parse(response);

	await logEventFromContext(
		ctx,
		'lodgify.messages.list',
		{ count: parsed.length },
		'completed',
	);

	return parsed;
};

export const send: LodgifyEndpoints['messages.send'] = async (ctx, input) => {
	const parsedInput = LodgifyEndpointInputSchemas['messages.send'].parse(input);
	const { inboxType, id, ...message } = parsedInput;
	const path = `/v1/reservation/${inboxType}/${encodeURIComponent(String(id))}/messages`;

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest(path, ctx.key, {
		method: 'POST',
		body: [message],
	});

	const parsed = LodgifyEndpointOutputSchemas['messages.send'].parse(response);

	await logEventFromContext(
		ctx,
		'lodgify.messages.send',
		{ inboxType, reservationId: id },
		'completed',
	);

	return parsed;
};
