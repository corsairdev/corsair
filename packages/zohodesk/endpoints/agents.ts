import type { ZohoDeskEndpoints } from '..';
import { csv, zohoDeskCall } from './call';
import {
	ZohoDeskEndpointInputSchemas,
	ZohoDeskEndpointOutputSchemas,
} from './types';

export const get: ZohoDeskEndpoints['agentsGet'] = (ctx, input) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.agents.get',
		input: ZohoDeskEndpointInputSchemas.agentsGet,
		output: ZohoDeskEndpointOutputSchemas.agentsGet,
		toRequest: ({ agentId, include }) => ({
			path: `/agents/${agentId}`,
			query: { include: csv(include) },
		}),
	});

export const getCount: ZohoDeskEndpoints['agentsGetCount'] = (ctx, input) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.agents.getCount',
		input: ZohoDeskEndpointInputSchemas.agentsGetCount,
		output: ZohoDeskEndpointOutputSchemas.agentsGetCount,
		toRequest: ({ status, isConfirmed, includeLightAgent }) => ({
			path: '/agents/count',
			query: { status, isConfirmed, includeLightAgent },
		}),
	});
