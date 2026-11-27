import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	// The icon route reads these by a computed path, which the build can't trace.
	outputFileTracingIncludes: {
		'/plugin-icons/[id]': [
			'../explorer/icons/**/*',
			'../explorer/data/icon-manifest.json',
		],
		// /start's app list when there's no database (previews, local runs).
		'/start': ['../explorer/data/catalog.json'],
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io',
			},
			// corsair.dev/built-with: each project's screenshot, kept in the awesome-corsair repo.
			{
				protocol: 'https',
				hostname: 'raw.githubusercontent.com',
				pathname: '/corsairdev/awesome-corsair/main/data/shots/**',
			},
		],
	},
	async headers() {
		return [
			{
				source: '/',
				headers: [
					{
						key: 'Link',
						value: '<https://corsair.dev/agent.txt>; rel="agent"',
					},
				],
			},
		];
	},
	async redirects() {
		return [
			{
				source: '/oss/waitlist',
				destination: '/oss',
				permanent: true,
			},
			// The MCP vs CLI benchmark page was removed; other sites still link to it.
			// The MCP vs API post covers the same comparison.
			{
				source: '/mcp-vs-cli',
				destination: '/blog/mcp-vs-api',
				permanent: true,
			},
			// The docs live on docs.corsair.dev. Some npm package homepages and
			// older links still point at corsair.dev/docs.
			{
				source: '/docs',
				destination: 'https://docs.corsair.dev',
				permanent: true,
			},
			{
				source: '/docs/:path*',
				destination: 'https://docs.corsair.dev/:path*',
				permanent: true,
			},
			// Lug, the MCP gateway, is one of Corsair's products (Products menu).
			// /mcp-gateway stays its page, so search keeps one address for it.
			{
				source: '/lug',
				destination: '/mcp-gateway',
				permanent: true,
			},
			// Agents look for auth.md on the company's domain too; hub serves it.
			{
				source: '/auth.md',
				destination: 'https://hub.corsair.dev/auth.md',
				permanent: false,
			},
			// Old slug of this post, still linked from other pages.
			{
				source:
					'/blog/connecting-notion-jira-github-and-slack-to-your-ai-agent-without-separate-integrations',
				destination: '/blog/connect-notion-jira-github-slack-ai-agent-mcp',
				permanent: true,
			},
		];
	},
	// PostHog reverse proxy (US region): assets served from us-assets, everything
	// else (ingest, flags, recordings) from us.i. Specific rules must precede the
	// catch-all — first match wins.
	async rewrites() {
		return [
			// Agents are told to read SKILL.md as often as skill.md.
			{
				source: '/SKILL.md',
				destination: '/skill.md',
			},
			// The agent skills index (`npx skills add https://corsair.dev`) is served by
			// the gateway app on lug.dev, so there is one copy of it. lug.dev keeps
			// serving /.well-known after its pages move here.
			{
				source: '/.well-known/skills/:path*',
				destination: 'https://lug.dev/.well-known/skills/:path*',
			},
			{
				source: '/.well-known/agent-skills/:path*',
				destination: 'https://lug.dev/.well-known/agent-skills/:path*',
			},
			{
				source: '/ingest/static/:path*',
				destination: 'https://us-assets.i.posthog.com/static/:path*',
			},
			{
				source: '/ingest/array/:path*',
				destination: 'https://us-assets.i.posthog.com/array/:path*',
			},
			{
				source: '/ingest/:path*',
				destination: 'https://us.i.posthog.com/:path*',
			},
		];
	},
};

export default nextConfig;
