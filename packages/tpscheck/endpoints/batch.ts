import { logEventFromContext } from 'corsair/core';
import type { TpscheckEndpoints } from '..';
import { makeTpscheckRequest } from '../client';
import type { BatchResponse } from './types';
import {
	TpscheckEndpointInputSchemas,
	TpscheckEndpointOutputSchemas,
} from './types';

export const batch: TpscheckEndpoints['batch'] = async (ctx, input) => {
	const parsedInput = TpscheckEndpointInputSchemas.batch.parse(input);
	// Docs §6 defaults to the legacy v1 shape; `version=2` selects the
	// enriched v2 shape this schema models.
	const response = await makeTpscheckRequest<BatchResponse>('/batch', ctx.key, {
		method: 'POST',
		body: parsedInput,
		query: { version: '2' },
	});

	const parsed = TpscheckEndpointOutputSchemas.batch.parse(response);

	await logEventFromContext(
		ctx,
		'tpscheck.batch',
		{ count: parsedInput.phones.length },
		'completed',
	);

	return parsed;
};
