import { logEventFromContext } from 'corsair/core';
import type { WinstonaiEndpoints } from '..';
import { makeWinstonaiRequest } from '../client';
import { WinstonaiEndpointOutputSchemas } from './types';

export const detectAiImage: WinstonaiEndpoints['detectAiImage'] = async (
	ctx,
	input,
) => {
	const response = await makeWinstonaiRequest('/image-detection', ctx.key, {
		schema: WinstonaiEndpointOutputSchemas.detectAiImage,
		body: {
			url: input.url,
			version: input.version,
		},
	});

	await logEventFromContext(
		ctx,
		'winstonai.detect.aiImage',
		{ ...input },
		'completed',
	);

	return response;
};
