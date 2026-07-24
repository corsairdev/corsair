import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import { redactEventPayload } from '../event-payload';
import type { HashnodeEndpoints } from '../index';
import {
	HashnodeEndpointOutputSchemas,
	SERIES_LIST_QUERY,
	SERIES_QUERY,
} from './types';

export const getSeries: HashnodeEndpoints['getSeries'] = async (ctx, input) => {
	const response = await makeHashnodeRequest(
		SERIES_QUERY,
		ctx.key,
		{ slug: input.slug },
		HashnodeEndpointOutputSchemas.getSeries,
	);

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
	const variables: Record<string, unknown> = {
		host: input.host,
		first: input.first ?? 10,
	};
	if (input.after) {
		variables.after = input.after;
	}

	const response = await makeHashnodeRequest(
		SERIES_LIST_QUERY,
		ctx.key,
		variables,
		HashnodeEndpointOutputSchemas.listSeries,
	);

	await logEventFromContext(
		ctx,
		'hashnode.listSeries',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};
