import { CorsairToolProvider } from '@corsair-dev/mastra';
import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { corsair, TENANT } from '../../corsair.js';
import { model } from '../../llm.js';

// The one thing this demo tests: Corsair's Mastra ToolProvider. It turns every
// Corsair plugin into a Mastra toolkit and every operation into a tool, backed
// by managed OAuth with credentials in our own database.
const provider = new CorsairToolProvider({ corsair, tenantId: TENANT });

export const slackAgent = new Agent({
	id: 'slack-agent',
	name: 'Slack Agent',
	instructions:
		'You operate the connected Slack workspace with the Corsair tools. Be concise.',
	model,
	// Every operation Corsair exposes across all registered plugins: list the
	// slugs, then resolve them into executable tools.
	tools: async () => {
		const { data } = await provider.listTools();
		return provider.resolveTools(data.map((t) => t.slug));
	},
});

export const mastra = new Mastra({ agents: { slackAgent } });
