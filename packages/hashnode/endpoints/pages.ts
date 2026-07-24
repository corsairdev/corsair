import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import { redactEventPayload } from '../event-payload';
import type { HashnodeEndpoints } from '../index';
import {
	HashnodeEndpointOutputSchemas,
	PAGE_QUERY,
	PAGES_QUERY,
} from './types';

export const listPages: HashnodeEndpoints['listPages'] = async (ctx, input) => {
	const variables: Record<string, unknown> = {
		host: input.host,
		first: input.first ?? 10,
	};
	if (input.after) {
		variables.after = input.after;
	}

	const response = await makeHashnodeRequest(
		PAGES_QUERY,
		ctx.key,
		variables,
		HashnodeEndpointOutputSchemas.listPages,
	);

	await logEventFromContext(
		ctx,
		'hashnode.listPages',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};

export const getPage: HashnodeEndpoints['getPage'] = async (ctx, input) => {
	const response = await makeHashnodeRequest(
		PAGE_QUERY,
		ctx.key,
		{ host: input.host, slug: input.slug },
		HashnodeEndpointOutputSchemas.getPage,
	);

	await logEventFromContext(
		ctx,
		'hashnode.getPage',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};
