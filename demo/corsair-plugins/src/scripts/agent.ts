import 'dotenv/config';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { fileURLToPath } from 'url';

const mcpServerPath = fileURLToPath(
	new URL('./mcp-server.ts', import.meta.url),
);

const prompt = process.argv[2];
if (!prompt) {
	console.error('Usage: pnpm agent "<prompt>"');
	process.exit(1);
}

async function main() {
	for await (const event of query({
		prompt: prompt as string,
		options: {
			model: 'claude-sonnet-4-6',
			permissionMode: 'bypassPermissions',
			mcpServers: {
				corsair: {
					type: 'stdio',
					command: 'npx',
					args: ['tsx', mcpServerPath],
				},
			},
		},
	})) {
		if (event.type === 'assistant') {
			for (const block of event.message.content) {
				if (block.type === 'text' && block.text.trim()) {
					console.log(`[assistant] ${block.text.trim()}`);
				} else if (block.type === 'tool_use') {
					console.log(`[tool] ${block.name}(${JSON.stringify(block.input)})`);
				}
			}
		} else if (event.type === 'result') {
			if (event.subtype === 'success') {
				process.stdout.write(event.result + '\n');
			} else {
				console.error(`[error] ${event.subtype}`);
			}
		}
	}
}

main().catch(console.error);
