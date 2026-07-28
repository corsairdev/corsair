import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import { redactEventPayload } from '../event-payload';
import type { HashnodeEndpoints } from '../index';
import {
	HashnodeEndpointOutputSchemas,
	PUBLICATION_QUERY,
	PUBLICATIONS_QUERY,
} from './types';

export const get: HashnodeEndpoints['getPublication'] = async (ctx, input) => {
	const response = await makeHashnodeRequest(
		PUBLICATION_QUERY,
		ctx.key,
		{ host: input.host },
		HashnodeEndpointOutputSchemas.getPublication,
	);

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
	const response = await makeHashnodeRequest(
		PUBLICATIONS_QUERY,
		ctx.key,
		{
			first: input?.first ?? 10,
			after: input?.after,
		},
		HashnodeEndpointOutputSchemas.listPublications,
	);

	await logEventFromContext(
		ctx,
		'hashnode.listPublications',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};
