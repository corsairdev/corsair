import { logEventFromContext } from 'corsair/core';
import type { LodgifyEndpoints } from '..';
import { makeLodgifyRequest } from '../client';
import {
	LodgifyEndpointInputSchemas,
	LodgifyEndpointOutputSchemas,
} from './types';

export const list: LodgifyEndpoints['messages.list'] = async (ctx, input) => {
	const parsedInput = LodgifyEndpointInputSchemas['messages.list'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.page !== undefined) query.page = parsedInput.page;
	if (parsedInput.size !== undefined) query.size = parsedInput.size;
	if (parsedInput.thread_id !== undefined)
		query.thread_id = parsedInput.thread_id;
	if (parsedInput.booking_id !== undefined)
		query.booking_id = parsedInput.booking_id;

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest('/v2/messages', ctx.key, {
		method: 'GET',
		query,
	});

	const parsed = LodgifyEndpointOutputSchemas['messages.list'].parse(response);

	await logEventFromContext(
		ctx,
		'lodgify.messages.list',
		{ count: parsed.items.length },
		'completed',
	);

	return parsed;
};

export const send: LodgifyEndpoints['messages.send'] = async (ctx, input) => {
	const parsedInput = LodgifyEndpointInputSchemas['messages.send'].parse(input);

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest('/v2/messages', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});

	const parsed = LodgifyEndpointOutputSchemas['messages.send'].parse(response);

	await logEventFromContext(
		ctx,
		'lodgify.messages.send',
		{ success: true },
		'completed',
	);

	return parsed;
};
