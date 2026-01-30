/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverComponentsExternalPackages: ['pg', 'drizzle-orm'],
	},
	output: 'standalone',
};

export default nextConfig;
