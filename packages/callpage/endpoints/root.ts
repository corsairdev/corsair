import { logEventFromContext } from 'corsair/core';
import { makeCallPageRequest } from '../client';
import type { CallPageEndpoints } from '../index';
import type { CallPageEndpointOutputs } from './types';
import { CallPageEndpointOutputSchemas } from './types';

// The greeting is the envelope's `message` (its `data` is empty), so skip unwrapping.
export const get: CallPageEndpoints['rootGet'] = async (ctx, input) => {
	const result = await makeCallPageRequest<CallPageEndpointOutputs['rootGet']>(
		'/api/v1/external/',
		ctx.key,
		{ unwrap: false, schema: CallPageEndpointOutputSchemas.rootGet },
	);
	await logEventFromContext(ctx, 'callpage.root.get', input, 'completed');
	return result;
};
