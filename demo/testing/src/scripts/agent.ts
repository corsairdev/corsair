/**
 * Corsair Agent — CLI + MCP Server
 *
 * One-shot:   pnpm agent "create a job that posts GitHub PRs to Slack"
 * MCP server: pnpm agent          (no args — expose via stdio for Claude Code / ChatGPT)
 *
 * Claude Code config (~/.claude.json):
 *   "mcpServers": {
 *     "corsair-agent": {
 *       "type": "stdio",
 *       "command": "pnpm",
 *       "args": ["--filter", "@corsair/demo-plugins", "agent"],
 *       "cwd": "<path-to-repo>"
 *     }
 *   }
 */

import 'dotenv/config';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createCorsairAgent, runAgentStdioMcpServer } from '@corsair-dev/agent';
import { corsair } from '@/server/corsair';

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
	process.stderr.write('Error: ANTHROPIC_API_KEY is required in .env\n');
	process.exit(1);
}

const anthropic = createAnthropic({ apiKey });
const agentOptions = {
	system1: anthropic('claude-haiku-4-5-20251001'),
	system2: anthropic('claude-sonnet-4-6'),
};

const prompt = process.argv[2];

if (prompt) {
	// One-shot: chat with the agent and print the result.
	const agent = createCorsairAgent(corsair, agentOptions);
	await agent.start();
	const result = await agent.chat(prompt);
	switch (result.type) {
		case 'job_created':
			console.log(`Created: ${result.message}`);
			console.log(`  ID: ${result.job.id}`);
			break;
		case 'job_updated':
			console.log(`Updated: ${result.message}`);
			break;
		case 'job_deleted':
			console.log(`Deleted: ${result.message}`);
			break;
		case 'message':
			console.log(result.text);
			break;
	}
	agent.stop();
} else {
	// MCP server mode: expose agent_chat + corsair tools via stdio.
	await runAgentStdioMcpServer(corsair, agentOptions);
}
