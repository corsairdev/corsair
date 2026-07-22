import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import { redactEventPayload } from '../event-payload';
import type { HashnodeEndpoints } from '../index';
import type { HashnodeEndpointOutputs } from './types';
import { PUBLICATION_QUERY, PUBLICATIONS_QUERY } from './types';

export const get: HashnodeEndpoints['getPublication'] = async (ctx, input) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['getPublication']
	>(PUBLICATION_QUERY, ctx.key, { host: input.host });

	await logEventFromContext(
		ctx,
		'hashnode.getPublication',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};

export const list: HashnodeEndpoints['listPublications'] = async (
	ctx,
	input,
) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['listPublications']
	>(PUBLICATIONS_QUERY, ctx.key, {
		first: input?.first ?? 10,
		after: input?.after,
	});

	await logEventFromContext(
		ctx,
		'hashnode.listPublications',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};
