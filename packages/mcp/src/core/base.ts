import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { BaseMcpOptions } from './adapters.js';
import type { CorsairToolDef } from './tools.js';
import { buildCorsairToolDefs } from './tools.js';

export function createBaseMcpServer(
	options: BaseMcpOptions & {
		// Which tools to register. Defaults to the full local set (with run_script);
		// the hosted runtime passes buildHostedToolDefs (no eval).
		toolDefs?: (options: BaseMcpOptions) => CorsairToolDef[];
	},
): McpServer {
	const server = new McpServer({
		name: 'corsair',
		version: '1.0.0',
		description:
			'Use this to interact with the Corsair API. Corsair helps you integrate with dozens of tools and services.',
	});

	const build = options.toolDefs ?? buildCorsairToolDefs;
	for (const def of build(options)) {
		server.registerTool(
			def.name,
			{ description: def.description, inputSchema: z.object(def.shape) },
			def.handler as Parameters<typeof server.registerTool>[2],
		);
	}

	return server;
}
