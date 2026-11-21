import { logEventFromContext } from 'corsair/core';
import type { FingertipEndpoints } from '..';
import { makeFingertipPingRequest } from '../client';
import {
	FingertipEndpointInputSchemas,
	FingertipEndpointOutputSchemas,
} from './types';

export const get: FingertipEndpoints['pingGet'] = async (ctx, input) => {
	FingertipEndpointInputSchemas.pingGet.parse(input);

	// Use unknown because the provider payload is untrusted until the output schema validates it.
	const response: unknown = await makeFingertipPingRequest(ctx.key);
	const parsed = FingertipEndpointOutputSchemas.pingGet.parse(response);

	await logEventFromContext(ctx, 'fingertip.ping', {}, 'completed');

	return parsed;
};
