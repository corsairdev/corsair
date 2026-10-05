import type { Redirect } from 'next/dist/lib/load-custom-routes';

/** Pages that have moved. Every old URL has to keep resolving. */
const movedPages: Redirect[] = [
	{
		source: '/getting-started/introduction',
		destination: '/introduction',
		permanent: true,
	},
	{
		source: '/getting-started/quick-start',
		destination: '/quick-start',
		permanent: true,
	},
	{
		source: '/studio/overview',
		destination: '/introduction',
		permanent: true,
	},
	{
		source: '/getting-started/installation',
		destination: '/concepts/provisioning',
		permanent: true,
	},
	{
		source: '/app/home',
		destination: '/introduction',
		permanent: true,
	},
	{
		source: '/app/introduction',
		destination: '/introduction',
		permanent: true,
	},
	{
		source: '/app/agent-setup',
		destination: '/concepts/provisioning',
		permanent: true,
	},
	{
		source: '/app/installation',
		destination: '/concepts/provisioning',
		permanent: true,
	},
	{
		source: '/app/coding-agents',
		destination: '/mcp-adapters/coding-agents',
		permanent: true,
	},
	{
		source: '/app/coding-agents/cursor',
		destination: '/mcp-adapters/cursor',
		permanent: true,
	},
	{
		source: '/app/coding-agents/claude-code',
		destination: '/mcp-adapters/claude-code',
		permanent: true,
	},
	{
		source: '/app/coding-agents/codex',
		destination: '/mcp-adapters/coding-agents',
		permanent: true,
	},
	{
		source: '/app/coding-agents/antigravity',
		destination: '/mcp-adapters/coding-agents',
		permanent: true,
	},
	{
		source: '/app/coding-agents/custom-connector',
		destination: '/mcp-adapters/coding-agents',
		permanent: true,
	},
	{
		source: '/app/custom-connector',
		destination: '/mcp-adapters/coding-agents',
		permanent: true,
	},
	{
		source: '/app/agent-sdks',
		destination: '/mcp-adapters/mcp-adapters',
		permanent: true,
	},
	{
		source: '/app/vercel-ai',
		destination: '/mcp-adapters/vercel-ai',
		permanent: true,
	},
	{
		source: '/app/openai',
		destination: '/mcp-adapters/openai',
		permanent: true,
	},
	{
		source: '/app/claude',
		destination: '/mcp-adapters/claude-sdk',
		permanent: true,
	},
	{
		source: '/app/direct-execution',
		destination: '/concepts/api',
		permanent: true,
	},
	{
		source: '/app/instances-and-plugins',
		destination: '/concepts/integrations',
		permanent: true,
	},
	{
		source: '/app/tenants-and-auth',
		destination: '/concepts/multi-tenancy',
		permanent: true,
	},
	{
		source: '/app/types-and-errors',
		destination: '/concepts/typescript',
		permanent: true,
	},
	{
		source: '/hosted-sdk/overview',
		destination: '/introduction',
		permanent: true,
	},
	{
		source: '/hosted-sdk/quickstart',
		destination: '/concepts/provisioning',
		permanent: true,
	},
	{
		source: '/hosted-sdk/instances-and-plugins',
		destination: '/concepts/integrations',
		permanent: true,
	},
	{
		source: '/hosted-sdk/tenants-and-auth',
		destination: '/concepts/multi-tenancy',
		permanent: true,
	},
	{
		source: '/hosted-sdk/mcp-and-run',
		destination: '/mcp-adapters/mcp-adapters',
		permanent: true,
	},
	{
		source: '/hosted-sdk/types-and-errors',
		destination: '/concepts/typescript',
		permanent: true,
	},
	{
		source: '/hosted-mcp/overview',
		destination: '/mcp-adapters/mcp-adapters',
		permanent: true,
	},
	{
		source: '/hosted-mcp/vercel-ai',
		destination: '/mcp-adapters/vercel-ai',
		permanent: true,
	},
	{
		source: '/hosted-mcp/openai',
		destination: '/mcp-adapters/openai',
		permanent: true,
	},
	{
		source: '/hosted-mcp/claude',
		destination: '/mcp-adapters/claude-sdk',
		permanent: true,
	},
	{
		source: '/hosted-mcp/custom-connector',
		destination: '/mcp-adapters/coding-agents',
		permanent: true,
	},
	{
		source: '/app/mcp/vercel-ai',
		destination: '/mcp-adapters/vercel-ai',
		permanent: true,
	},
	{
		source: '/app/mcp/openai',
		destination: '/mcp-adapters/openai',
		permanent: true,
	},
	{
		source: '/app/mcp/claude',
		destination: '/mcp-adapters/claude-sdk',
		permanent: true,
	},
	{
		source: '/app/mcp/custom-connector',
		destination: '/mcp-adapters/coding-agents',
		permanent: true,
	},
	{
		source: '/app/sdk/installation',
		destination: '/concepts/provisioning',
		permanent: true,
	},
	{
		source: '/app/sdk/instances-and-plugins',
		destination: '/concepts/integrations',
		permanent: true,
	},
	{
		source: '/app/sdk/tenants-and-auth',
		destination: '/concepts/multi-tenancy',
		permanent: true,
	},
	{
		source: '/app/sdk/types-and-errors',
		destination: '/concepts/typescript',
		permanent: true,
	},
	{
		source: '/getting-started/setup',
		destination: '/concepts/provisioning',
		permanent: true,
	},
	{
		source: '/getting-started/comparison',
		destination: '/introduction',
		permanent: true,
	},
	{
		source: '/frameworks/nextjs',
		destination: '/adapters/handlers',
		permanent: true,
	},
	{
		source: '/frameworks/express',
		destination: '/adapters/handlers',
		permanent: true,
	},
	{
		source: '/frameworks/hono',
		destination: '/adapters/handlers',
		permanent: true,
	},
	{
		source: '/frameworks/web-standard',
		destination: '/adapters/handlers',
		permanent: true,
	},
	{
		source: '/management/client',
		destination: '/adapters/client',
		permanent: true,
	},
	{
		source: '/management/react',
		destination: '/adapters/react',
		permanent: true,
	},
	{
		source: '/production/tenant-provisioning',
		destination: '/concepts/provisioning',
		permanent: true,
	},
	{
		source: '/going-to-production/provisioning-cli',
		destination: '/concepts/provisioning',
		permanent: true,
	},
	{
		source: '/production/oauth-process',
		destination: '/concepts/oauth-process',
		permanent: true,
	},
	{
		source: '/mcp-adapters/openai-agents',
		destination: '/mcp-adapters/openai',
		permanent: true,
	},
];

export function getAllRedirects(): Redirect[] {
	return [
		// "/" is owned by the optional catch-all route, so the landing redirect
		// has to live here rather than as an app/page.tsx.
		{ source: '/', destination: '/introduction', permanent: false },
		{ source: '/landing', destination: '/introduction', permanent: true },
		{ source: '/docs/:path*', destination: '/:path*', permanent: true },
		{
			source: '/plugins/guides/:path*',
			destination: '/guides/:path*',
			permanent: true,
		},
		...movedPages,
	];
}
