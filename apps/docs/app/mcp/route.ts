import { createMcpHandler, McpServer } from '@modelcontextprotocol/server';
import { registerSearchTool, registerSourceTools } from 'fumadocs-core/mcp';
import { docsLlms } from '@/lib/llms';
import { searchServer } from '@/lib/search';
import { source } from '@/lib/source';

/**
 * The docs MCP server, at the URL Mintlify served it (docs.corsair.dev/mcp):
 * tools to search, list and read pages.
 */
const handler = createMcpHandler(() => {
	const mcp = new McpServer(
		{ name: 'corsair-docs', version: '1.0.0' },
		// The tools never change; a stream to watch them would hold a function open.
		{ capabilities: { tools: { listChanged: false } } },
	);
	registerSourceTools(mcp, source, docsLlms);
	registerSearchTool(mcp, searchServer);
	return mcp;
});

const handle = (request: Request) => handler.fetch(request);
export { handle as DELETE, handle as GET, handle as POST };
