/**
 * @corsair-dev/app
 *
 * Client adapters for connecting to a hosted Corsair MCP instance from
 * Vercel AI SDK, Claude Agents SDK, and OpenAI Agents SDK.
 */

export type CorsairConfig = {
	/** MCP URL from your Corsair instance's MCP page */
	url: string;
	/** API key from your Corsair instance's MCP page */
	apiKey: string;
};

/** Returns the Authorization header for Corsair API key auth. */
export function getCorsairHeaders(
	config: CorsairConfig,
): Record<string, string> {
	return { Authorization: `Bearer ${config.apiKey}` };
}

/**
 * Returns a plain `{ url, headers }` object suitable for any SDK that accepts
 * a remote MCP server config (Claude Agents SDK, OpenAI Agents SDK, etc.).
 */
export function toCorsairMcpConfig(config: CorsairConfig): {
	url: string;
	headers: Record<string, string>;
} {
	return { url: config.url, headers: getCorsairHeaders(config) };
}

/**
 * Creates an MCP client for use with **Vercel AI SDK**.
 *
 * @example
 * ```ts
 * import { createVercelAiClient } from '@corsair-dev/app';
 * import { generateText } from 'ai';
 * import { anthropic } from '@ai-sdk/anthropic';
 *
 * const corsair = await createVercelAiClient({
 *   url: process.env.CORSAIR_MCP_URL!,
 *   apiKey: process.env.CORSAIR_API_KEY!,
 * });
 *
 * const { text } = await generateText({
 *   model: anthropic('claude-opus-4-5'),
 *   tools: await corsair.tools(),
 *   maxSteps: 5,
 *   prompt: 'What are my open GitHub issues?',
 * });
 *
 * console.log(text);
 * await corsair.close();
 * ```
 */
export async function createVercelAiClient(config: CorsairConfig) {
	const { experimental_createMCPClient } = await import(
		/* webpackIgnore: true */ /* turbopackIgnore: true */ '@ai-sdk/mcp'
	);
	return experimental_createMCPClient({
		transport: {
			type: 'http',
			url: config.url,
			headers: getCorsairHeaders(config),
		},
	});
}

/**
 * Returns an `McpHttpServerConfig` for use with the **Claude Agents SDK**.
 *
 * Pass the returned config as a value in the `mcpServers` map of the `query`
 * function's options. No async import needed — it's a plain config object.
 *
 * @example
 * ```ts
 * import { query } from '@anthropic-ai/claude-agent-sdk';
 * import { claudeMcpServerConfig } from '@corsair-dev/app';
 *
 * const stream = query({
 *   prompt: 'What are my open GitHub issues?',
 *   options: {
 *     model: 'claude-opus-4-5',
 *     mcpServers: {
 *       corsair: claudeMcpServerConfig({
 *         url: process.env.CORSAIR_MCP_URL!,
 *         apiKey: process.env.CORSAIR_API_KEY!,
 *       }),
 *     },
 *   },
 * });
 *
 * for await (const event of stream) {
 *   if ('result' in event) console.log(event.result);
 * }
 * ```
 */
export function claudeMcpServerConfig(config: CorsairConfig): {
	type: 'http';
	url: string;
	headers: Record<string, string>;
} {
	return {
		type: 'http',
		url: config.url,
		headers: getCorsairHeaders(config),
	};
}

/**
 * Creates an `MCPServerStreamableHttp` instance for use with the
 * **OpenAI Agents SDK**.
 *
 * @example
 * ```ts
 * import { Agent, run } from '@openai/agents';
 * import { createOpenAiMcpServer } from '@corsair-dev/app';
 *
 * const corsairServer = await createOpenAiMcpServer({
 *   url: process.env.CORSAIR_MCP_URL!,
 *   apiKey: process.env.CORSAIR_API_KEY!,
 * });
 *
 * const agent = new Agent({
 *   name: 'Corsair Agent',
 *   instructions: 'You are a helpful assistant with access to various integrations.',
 *   mcpServers: [corsairServer],
 * });
 *
 * const result = await run(agent, 'What are my open GitHub issues?');
 * console.log(result.finalOutput);
 * ```
 */
export async function createOpenAiMcpServer(config: CorsairConfig) {
	const { MCPServerStreamableHttp } = await import(
		/* webpackIgnore: true */ /* turbopackIgnore: true */ '@openai/agents'
	);
	return new MCPServerStreamableHttp({
		url: config.url,
		requestInit: { headers: getCorsairHeaders(config) },
	});
}
