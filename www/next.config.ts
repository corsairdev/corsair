import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				source: '/integrations/:slug',
				destination: '/oss/:slug',
				permanent: true,
			},
		];
	},
};

export default nextConfig;
