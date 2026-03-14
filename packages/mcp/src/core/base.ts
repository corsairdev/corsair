import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { BaseMcpOptions } from './adapters.js';
import { buildCorsairToolDefs } from './tools.js';

export function createBaseMcpServer(options: BaseMcpOptions): McpServer {
	const server = new McpServer({
		name: 'corsair',
		version: '1.0.0',
		description:
			'Use this to interact with the Corsair API. Corsair helps you integrate with dozens of tools and services.',
	});

	for (const def of buildCorsairToolDefs(options)) {
		server.registerTool(
			def.name,
			{ description: def.description, inputSchema: z.object(def.shape) },
			def.handler as Parameters<typeof server.registerTool>[2],
		);
	}

	return server;
}
