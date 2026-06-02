export type VercelAiMcpClientOptions = {
	url: string;
	headers?: Record<string, string>;
};

export async function createVercelAiMcpClient(
	options: VercelAiMcpClientOptions,
) {
	const { createMCPClient } = await import(
		/* webpackIgnore: true */ /* turbopackIgnore: true */ '@ai-sdk/mcp'
	);
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
