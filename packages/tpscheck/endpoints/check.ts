import { logEventFromContext } from 'corsair/core';
import type { TpscheckEndpoints } from '..';
import { makeTpscheckRequest } from '../client';
import type { CheckResponse } from './types';
import {
	TpscheckEndpointInputSchemas,
	TpscheckEndpointOutputSchemas,
} from './types';

export const check: TpscheckEndpoints['check'] = async (ctx, input) => {
	const parsedInput = TpscheckEndpointInputSchemas.check.parse(input);
	// Docs §5 defaults to the legacy v1 shape; `version=2` selects the
	// enriched v2 shape this schema models.
	const response = await makeTpscheckRequest<CheckResponse>('/check', ctx.key, {
		method: 'POST',
		body: parsedInput,
		query: { version: '2' },
	});

	const parsed = TpscheckEndpointOutputSchemas.check.parse(response);

	await logEventFromContext(
		ctx,
		'tpscheck.check',
		{ phone: parsedInput.phone },
		'completed',
	);

	return parsed;
};
