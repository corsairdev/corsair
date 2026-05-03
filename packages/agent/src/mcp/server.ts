import { createBaseMcpServer } from '@corsair-dev/mcp';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { AnyCorsairInstance } from 'corsair';
import { z } from 'zod';
import { createCorsairAgent } from '../agent.js';
import type { CorsairAgentOptions } from '../types.js';

/**
 * Start a stdio MCP server exposing both the core Corsair tools and the
 * `agent_chat` tool. Point any MCP client (Claude Code, Claude Desktop,
 * ChatGPT, etc.) at this process to interact with the agent.
 *
 * @example
 * // scripts/agent-mcp.ts
 * import { runAgentStdioMcpServer } from '@corsair-dev/agent';
 * import { corsair } from './corsair';
 * import { createAnthropic } from '@ai-sdk/anthropic';
 *
 * const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
 * await runAgentStdioMcpServer(corsair, {
 *   system1: anthropic('claude-haiku-4-5-20251001'),
 *   system2: anthropic('claude-sonnet-4-6'),
 * });
 */
export async function runAgentStdioMcpServer(
	corsair: AnyCorsairInstance,
	agentOptions: CorsairAgentOptions,
): Promise<void> {
	const agent = createCorsairAgent(corsair, agentOptions);
	await agent.start();

	const server = createBaseMcpServer({ corsair });

	for (const def of agent.mcpTools) {
		server.registerTool(
			def.name,
			{ description: def.description, inputSchema: z.object(def.shape) },
			def.handler as Parameters<typeof server.registerTool>[2],
		);
	}

	const transport = new StdioServerTransport();
	await server.connect(transport);
}
