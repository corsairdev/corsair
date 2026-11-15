import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import {
	BuiltWithEndpointInputSchemas,
	BuiltWithEndpointOutputSchemas,
} from './types';

export const mcpApiLookup: BuiltWithEndpoints['mcpApiLookup'] = async (
	ctx,
	rawInput,
) => {
	const input = BuiltWithEndpointInputSchemas.mcpApiLookup.parse(rawInput);
	const response = await makeBuiltWithRequest(
		'mcp2/api.json',
		ctx.key,
		BuiltWithEndpointOutputSchemas.mcpApiLookup,
		{
			method: 'GET',
			query: {
				SEARCH: input.search,
				CATEGORY: input.category,
				OFFSET: input.offset,
			},
		},
	);

	if (ctx.db.mcpServers) {
		try {
			for (const server of response) {
				if (!server.Domain) continue;
				await ctx.db.mcpServers.upsertByEntityId(server.Domain, {
					id: server.Domain,
					domain: server.Domain,
					category: server.Category,
					description: server.Description,
					endpoints: server.Endpoints,
				});
			}
		} catch (error) {
			console.warn('Failed to save BuiltWith MCP servers to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'builtwith.mcp.api.lookup',
		{ ...input },
		'completed',
	);

	return response;
};
