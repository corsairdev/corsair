import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import { redactEventPayload } from '../event-payload';
import type { HashnodeEndpoints } from '../index';
import type { HashnodeEndpointOutputs } from './types';
import { FEED_QUERY } from './types';

export const feed: HashnodeEndpoints['feed'] = async (ctx, input) => {
	const variables: Record<string, unknown> = {
		first: input.first ?? 10,
	};
	if (input.after) {
		variables.after = input.after;
	}
	if (input.filter) {
		variables.filter = input.filter;
	}

	const response = await makeHashnodeRequest<HashnodeEndpointOutputs['feed']>(
		FEED_QUERY,
		ctx.key,
		variables,
	);

	await logEventFromContext(
		ctx,
		'hashnode.feed',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};
