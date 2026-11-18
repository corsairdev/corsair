import { logEventFromContext } from 'corsair/core';
import type { TypeSafeEndpoints } from '..';
import { makeTypeSafeRequest } from '../client';
import {
	TypeSafeEndpointInputSchemas,
	TypeSafeEndpointOutputSchemas,
} from './types';

// TypeSafe gates images and long context behind opt-in headers.
const IMAGES_HEADER = 'TypeSafe-Danger-Zone-Images';
const LONG_CONTEXT_HEADER = 'TypeSafe-Danger-Zone-Long-Context';

export const ask: TypeSafeEndpoints['systemOneAsk'] = async (ctx, input) => {
	const { longContext, ...body } =
		TypeSafeEndpointInputSchemas.systemOneAsk.parse(input);

	// A request with image assets or a box question is an image request, so
	// the caller has already opted in by sending one.
	const headers: Record<string, string> = {};
	if (
		body.assets !== undefined ||
		Object.values(body.questions).some((question) => question.type === 'box')
	) {
		headers[IMAGES_HEADER] = 'true';
	}
	if (longContext) headers[LONG_CONTEXT_HEADER] = 'true';

	const raw = await makeTypeSafeRequest(ctx.key, {
		method: 'POST',
		path: '/v1/systemone',
		body,
		headers,
	});
	const result = TypeSafeEndpointOutputSchemas.systemOneAsk.parse(raw);

	// The state and questions can hold private data, so only counts are logged.
	await logEventFromContext(
		ctx,
		'typesafe.systemOne.ask',
		{
			model: result.model,
			questions: Object.keys(body.questions).length,
			inputTokens: result.usage.input_tokens,
		},
		'completed',
	);
	return result;
};
