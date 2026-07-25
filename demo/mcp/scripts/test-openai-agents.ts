import { OpenAIAgentsProvider } from '@corsair-dev/mcp';
import { Agent, tool } from '@openai/agents';
import { corsair } from '../corsair';
import { createLlmRunner, getChatModel } from '../llm';

const provider = new OpenAIAgentsProvider();
const tools = provider.build({
	corsair: corsair.withTenant('dev'),
	tool,
	runOptions: {
		readonly: true,
	},
});

const agent = new Agent({
	name: 'corsair-agent',
	model: getChatModel(),
	instructions: 'You are a helpful assistant with access to the Corsair MCP.',
	tools,
});

const runner = createLlmRunner();
const result = await runner.run(
	agent,
	'list all slack channels and send test message to sdk-test channel',
);
console.log(result.finalOutput);
