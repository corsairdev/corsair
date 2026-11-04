import { logEventFromContext } from 'corsair/core';
import type { OctenEndpoints } from '..';
import { makeOctenRequest } from '../client';
import { OctenEndpointInputSchemas, OctenEndpointOutputSchemas } from './types';

export const embeddingCreate: OctenEndpoints['embeddingCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = OctenEndpointInputSchemas.embeddingCreate.parse(input);
	const response = await makeOctenRequest('/embedding', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});
	const parsed = OctenEndpointOutputSchemas.embeddingCreate.parse(response);

	await logEventFromContext(
		ctx,
		'octen.embedding.create',
		{ inputCount: parsedInput.input.length },
		'completed',
	);

	return parsed;
};
