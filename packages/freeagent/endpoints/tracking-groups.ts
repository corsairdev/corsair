import type { FreeAgentEndpoints } from '..';
import { makeFreeAgentPaginatedRequest, makeFreeAgentRequest } from '../client';
import {
	FreeAgentEndpointInputSchemas,
	FreeAgentEndpointOutputSchemas,
} from './types';

export const list: FreeAgentEndpoints['trackingGroupsList'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.trackingGroupsList.parse(input);
	const response = await makeFreeAgentPaginatedRequest(
		'/v2/tracking_groups',
		ctx,
		parsed.query ?? {},
		FreeAgentEndpointOutputSchemas.trackingGroupsList.omit({
			pagination: true,
		}),
	);
	return FreeAgentEndpointOutputSchemas.trackingGroupsList.parse({
		...response.data,
		pagination: response.pagination,
	});
};

export const get: FreeAgentEndpoints['trackingGroupsGet'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.trackingGroupsGet.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/tracking_groups/${encodeURIComponent(parsed.id)}`,
		ctx,
	);
	return FreeAgentEndpointOutputSchemas.trackingGroupsGet.parse(response);
};
