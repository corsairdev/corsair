import { logEventFromContext } from 'corsair/core';
import { makeApipieRequest } from '../client';
import type { ApipieEndpoints } from '../index';
import type { ApipieEndpointOutputs } from './types';
import { ApipieEndpointOutputSchemas } from './types';

export const generate: ApipieEndpoints['imagesGenerate'] = async (
	ctx,
	input,
) => {
	const response = await makeApipieRequest<
		ApipieEndpointOutputs['imagesGenerate']
	>(`/v1/images/generations`, ctx.key, {
		schema: ApipieEndpointOutputSchemas.imagesGenerate,
		method: 'POST',
		body: {
			model: input.model,
			prompt: input.prompt,
			n: input.n,
			size: input.size,
			quality: input.quality,
			style: input.style,
			response_format: input.responseFormat,
			user: input.user,
		},
	});

	await logEventFromContext(
		ctx,
		'apipie.api.images.generate',
		{ model: input.model, imageCount: response.data.length },
		'completed',
	);

	return response;
};
