import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import { redactEventPayload } from '../event-payload';
import type { HashnodeEndpoints } from '../index';
import { HashnodeEndpointOutputSchemas, TAG_QUERY } from './types';

export const getTag: HashnodeEndpoints['getTag'] = async (ctx, input) => {
	const response = await makeHashnodeRequest(
		TAG_QUERY,
		ctx.key,
		{ slug: input.slug },
		HashnodeEndpointOutputSchemas.getTag,
	);

	await logEventFromContext(
		ctx,
		'hashnode.getTag',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};
