import type { NextConfig } from 'next';
import { securityHeaders } from './src/lib/security-headers';

const nextConfig: NextConfig = {
	poweredByHeader: false,
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
		];
	},
	async headers() {
		return [{ source: '/:path*', headers: [...securityHeaders] }];
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
