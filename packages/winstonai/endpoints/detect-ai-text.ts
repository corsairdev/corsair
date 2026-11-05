import { logEventFromContext } from 'corsair/core';
import type { WinstonaiEndpoints } from '..';
import { makeWinstonaiRequest } from '../client';
import {
	toDetectEventPayload,
	WinstonaiEndpointInputSchemas,
	WinstonaiEndpointOutputSchemas,
} from './types';

export const detectAiText: WinstonaiEndpoints['detectAiText'] = async (
	ctx,
	input,
) => {
	const parsed = WinstonaiEndpointInputSchemas.detectAiText.parse(input);

	const response = await makeWinstonaiRequest(
		'/ai-content-detection',
		ctx.key,
		{
			schema: WinstonaiEndpointOutputSchemas.detectAiText,
			body: {
				text: parsed.text,
				file: parsed.file,
				website: parsed.website,
				version: parsed.version,
				sentences: parsed.sentences,
				language: parsed.language,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'winstonai.detect.aiText',
		toDetectEventPayload(parsed),
		'completed',
	);

	return response;
};
