import { CorsairToolProvider } from '@corsair-dev/mastra';
import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { corsair, TENANT } from '../../corsair.js';
import { model } from '../../llm.js';

const provider = new CorsairToolProvider({ corsair, tenantId: TENANT });

export const slackAgent = new Agent({
	id: 'slack-agent',
	name: 'Slack Agent',
	instructions:
		'You operate the connected Slack workspace with the Corsair tools. Be concise.',
	model,
	tools: async () => {
		const { data } = await provider.listTools();
		return provider.resolveTools(data.map((t) => t.slug));
	},
});

export const mastra = new Mastra({ agents: { slackAgent } });
