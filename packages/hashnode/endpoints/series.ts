import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import { redactEventPayload } from '../event-payload';
import type { HashnodeEndpoints } from '../index';
import type { HashnodeEndpointOutputs } from './types';
import { SERIES_LIST_QUERY, SERIES_QUERY } from './types';

export const getSeries: HashnodeEndpoints['getSeries'] = async (ctx, input) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['getSeries']
	>(SERIES_QUERY, ctx.key, { slug: input.slug });

	await logEventFromContext(
		ctx,
		'hashnode.getSeries',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};

export const listSeries: HashnodeEndpoints['listSeries'] = async (
	ctx,
	input,
) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['listSeries']
	>(SERIES_LIST_QUERY, ctx.key, { host: input.host });

	await logEventFromContext(
		ctx,
		'hashnode.listSeries',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};
