/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverComponentsExternalPackages: ['pg', 'drizzle-orm'],
	},
};

export default nextConfig;
