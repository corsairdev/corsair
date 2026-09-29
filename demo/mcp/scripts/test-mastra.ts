import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { CorsairToolProvider } from '@corsair-dev/mcp/mastra';
import { Agent } from '@mastra/core/agent';
import { corsair } from '../corsair';
import { getChatModel, getLlmApiKey } from '../llm';

const provider = new CorsairToolProvider({ corsair, tenantId: 'dev' });
const { data } = await provider.listTools({ toolkit: 'slack' });
const tools = await provider.resolveTools(data.map((t) => t.slug));

const litellm = createOpenAICompatible({
	name: 'corsair-litellm',
	// Pinned to Corsair's gateway so the API key can't be pointed at another host.
	baseURL: 'https://llm.corsair.dev/v1',
	apiKey: getLlmApiKey(),
});

const agent = new Agent({
	id: 'corsair-mastra-agent',
	name: 'corsair-mastra-agent',
	instructions: 'You are a helpful assistant with access to the Corsair MCP.',
	model: litellm(getChatModel()),
	tools,
});

const result = await agent.generate(
	'List all Slack channels and return their names.',
);
console.log(result.text);
