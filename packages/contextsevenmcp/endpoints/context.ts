import { logEventFromContext } from 'corsair/core';
import type { ContextSevenMcpEndpoints } from '..';
import { makeContextSevenMcpRequest } from '../client';
import {
	ContextSevenMcpEndpointInputSchemas,
	ContextSevenMcpEndpointOutputSchemas,
} from './types';

export const contextGet: ContextSevenMcpEndpoints['contextGet'] = async (
	ctx,
	input,
) => {
	const parsed = ContextSevenMcpEndpointInputSchemas.contextGet.parse(input);
	const response = await makeContextSevenMcpRequest<unknown>(
		'/v2/context',
		ctx.key,
		{
			method: 'GET',
			query: {
				libraryId: parsed.libraryId,
				query: parsed.query,
				type: parsed.type ?? 'json',
				fast: parsed.fast,
			},
		},
	);
	const output = ContextSevenMcpEndpointOutputSchemas.contextGet.parse(
		response ?? {},
	);
	await logEventFromContext(
		ctx,
		'contextsevenmcp.context.get',
		{ libraryId: parsed.libraryId },
		'completed',
	);
	return output;
};
