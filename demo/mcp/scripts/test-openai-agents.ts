import { OpenAIAgentsProvider } from '@corsair-dev/mcp';
import { Agent, tool } from '@openai/agents';
import { corsair } from '../corsair';
import { createLlmRunner, getChatModel } from '../llm';

const provider = new OpenAIAgentsProvider();
const tools = provider.build({ corsair, tool });

const agent = new Agent({
	name: 'corsair-agent',
	model: getChatModel(),
	instructions:
		'You are a helpful assistant with access to Corsair tools. Use list_operations to discover available APIs, get_schema to understand required arguments, and run_script to execute them. When referencing resources (like channels), always use their ID, not their name. If a tool call fails, use get_schema to check the expected arguments and retry.',
	tools,
});

const runner = createLlmRunner();
const result = await runner.run(
	agent,
	'list all slack channels and send test message to sdk-test channel',
);
console.log(result.finalOutput);
