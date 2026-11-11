import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	// The icon route reads these by a computed path, which the build can't trace.
	outputFileTracingIncludes: {
		'/plugin-icons/[id]': [
			'../explorer/icons/**/*',
			'../explorer/data/icon-manifest.json',
		],
	},
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
