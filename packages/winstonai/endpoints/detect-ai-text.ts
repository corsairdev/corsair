import { logEventFromContext } from 'corsair/core';
import type { WinstonaiEndpoints } from '..';
import { makeWinstonaiRequest } from '../client';
import { WinstonaiEndpointOutputSchemas } from './types';

export const detectAiText: WinstonaiEndpoints['detectAiText'] = async (
	ctx,
	input,
) => {
	const response = await makeWinstonaiRequest(
		'/ai-content-detection',
		ctx.key,
		{
			schema: WinstonaiEndpointOutputSchemas.detectAiText,
			body: {
				text: input.text,
				file: input.file,
				website: input.website,
				version: input.version,
				sentences: input.sentences,
				language: input.language,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'winstonai.detect.aiText',
		{ ...input },
		'completed',
	);

	return response;
};
