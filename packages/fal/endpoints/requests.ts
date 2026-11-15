import { logEventFromContext } from 'corsair/core';
import { makeFalRequest } from '../client';
import type { FalEndpoints } from '../index';
import { FalEndpointInputSchemas, FalEndpointOutputSchemas } from './types';

export const list: FalEndpoints['requestsList'] = async (ctx, rawInput) => {
	const input = FalEndpointInputSchemas.requestsList.parse(rawInput);
	const response = FalEndpointOutputSchemas.requestsList.parse(
		await makeFalRequest('api', '/models/requests/by-endpoint', ctx.key, {
			method: 'GET',
			query: {
				endpoint_id: input.endpointIds,
				start: input.start,
				end: input.end,
				status: input.status,
				request_id: input.requestId,
				expand: input.includePayloads ? 'payloads' : undefined,
				sort_by: input.sortBy,
				limit: input.limit,
				cursor: input.cursor,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'fal.requests.list',
		{ endpointIds: input.endpointIds },
		'completed',
	);
	return response;
};

export const deletePayloads: FalEndpoints['requestsDeletePayloads'] = async (
	ctx,
	rawInput,
) => {
	const input = FalEndpointInputSchemas.requestsDeletePayloads.parse(rawInput);
	const response = FalEndpointOutputSchemas.requestsDeletePayloads.parse(
		await makeFalRequest(
			'api',
			`/models/requests/${encodeURIComponent(input.requestId)}/payloads`,
			ctx.key,
			{ method: 'DELETE' },
		),
	);
	await logEventFromContext(
		ctx,
		'fal.requests.deletePayloads',
		{ requestId: input.requestId },
		'completed',
	);
	return response;
};
