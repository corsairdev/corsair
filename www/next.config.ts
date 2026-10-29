import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io',
			},
		],
	},
	async redirects() {
		return [
			{
				source: '/oss/waitlist',
				destination: '/oss',
				permanent: true,
			},
			// The MCP vs CLI benchmark page was removed; other sites still link to it.
			{
				source: '/mcp-vs-cli',
				destination: '/',
				permanent: true,
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
