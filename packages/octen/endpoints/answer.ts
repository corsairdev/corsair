import { logEventFromContext } from 'corsair/core';
import type { OctenEndpoints } from '..';
import { makeOctenRequest } from '../client';
import { OctenEndpointInputSchemas, OctenEndpointOutputSchemas } from './types';

export const answerCreate: OctenEndpoints['answerCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = OctenEndpointInputSchemas.answerCreate.parse(input);
	// `stream` is intentionally never exposed: this plugin only models the
	// non-streaming `chat.completion` response, so streaming is forced off.
	const response = await makeOctenRequest('/answer', ctx.key, {
		method: 'POST',
		body: { ...parsedInput, stream: false },
		envelope: false,
	});
	const parsed = OctenEndpointOutputSchemas.answerCreate.parse(response);

	// Message contents can hold user PII, so only the message count is logged.
	await logEventFromContext(
		ctx,
		'octen.answer.create',
		{ messageCount: parsedInput.messages.length },
		'completed',
	);

	return parsed;
};
