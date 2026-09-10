import { logEventFromContext } from 'corsair/core';
import type { ContextSevenMcpEndpoints } from '..';
import { makeContextSevenMcpRequest } from '../client';
import {
	ContextSevenMcpEndpointInputSchemas,
	ContextSevenMcpEndpointOutputSchemas,
} from './types';

export const librarySearch: ContextSevenMcpEndpoints['librarySearch'] = async (
	ctx,
	input,
) => {
	const parsed = ContextSevenMcpEndpointInputSchemas.librarySearch.parse(input);
	const response = await makeContextSevenMcpRequest<unknown>(
		'/v2/libs/search',
		ctx.key,
		{
			method: 'GET',
			query: {
				libraryName: parsed.libraryName,
				query: parsed.query,
				fast: parsed.fast,
			},
		},
	);
	const output = ContextSevenMcpEndpointOutputSchemas.librarySearch.parse(
		response ?? {},
	);
	await logEventFromContext(
		ctx,
		'contextsevenmcp.library.search',
		{ libraryName: parsed.libraryName },
		'completed',
	);
	return output;
};
