import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { BaseMcpOptions } from './adapters.js';
import { createBaseMcpServer } from './base.js';

export async function runStdioMcpServer(options: BaseMcpOptions): Promise<void> {
	const server = createBaseMcpServer(options);
	const transport = new StdioServerTransport();
	await server.connect(transport);
}
