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
				source: '/integrations/:slug',
				destination: '/oss/:slug',
				permanent: true,
			},
			{
				source: '/oss/waitlist',
				destination: '/oss',
				permanent: true,
			},
		];
	},
};

export default nextConfig;
