import { logEventFromContext } from 'corsair/core';
import type { OctenEndpoints } from '..';
import { makeOctenRequest } from '../client';
import { OctenEndpointInputSchemas, OctenEndpointOutputSchemas } from './types';

export const vlEmbeddingCreate: OctenEndpoints['vlEmbeddingCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = OctenEndpointInputSchemas.vlEmbeddingCreate.parse(input);
	const response = await makeOctenRequest('/vl-embedding', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});
	const parsed = OctenEndpointOutputSchemas.vlEmbeddingCreate.parse(response);

	await logEventFromContext(
		ctx,
		'octen.vlEmbedding.create',
		{ contentCount: parsedInput.input.contents.length },
		'completed',
	);

	return parsed;
};
