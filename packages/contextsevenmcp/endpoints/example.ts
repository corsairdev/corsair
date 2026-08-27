import { logEventFromContext } from 'corsair/core';
import type { ContextSevenMcpEndpoints } from '..';
import type { ContextSevenMcpEndpointOutputs } from './types';
import { makeContextSevenMcpRequest } from '../client';

export const get: ContextSevenMcpEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeContextSevenMcpRequest<ContextSevenMcpEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'contextsevenmcp.example.get', { ...input }, 'completed');
	return response;
};
