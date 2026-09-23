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

	// Never log the raw number: phone numbers are PII, so the event
	// carries only the fact that one check completed (batch logs a count).
	await logEventFromContext(ctx, 'tpscheck.check', { count: 1 }, 'completed');

	return parsed;
};
