import Anthropic from '@anthropic-ai/sdk';
import { AnthropicProvider } from '@corsair-dev/mcp';
import { corsair } from '../corsair';

const provider = new AnthropicProvider();
const tools = provider.build({ corsair });
const client = new Anthropic();

const message = await client.beta.messages.toolRunner({
	model: 'claude-sonnet-4-6',
	max_tokens: 4096,
	tools,
	messages: [
		{ role: 'user', content: 'list all slack channels, send test message to sdk-test channel' },
	],
});

for (const block of message.content) {
	if (block.type === 'text') process.stdout.write(block.text);
}
