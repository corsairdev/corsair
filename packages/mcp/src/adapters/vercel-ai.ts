import { createMCPClient } from '@ai-sdk/mcp';

export type VercelAiMcpClientOptions = {
	url: string;
	headers?: Record<string, string>;
};

export async function createVercelAiMcpClient(
	options: VercelAiMcpClientOptions,
) {
	const { url, headers } = options;
	const client = await createMCPClient({
		transport: {
			type: 'http',
			url,
			headers,
		},
	});
	return client;
}
