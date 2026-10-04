import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';
import { getAllRedirects } from './lib/redirects';

const config: NextConfig = {
	reactStrictMode: true,
	experimental: {
		cpus: 2,
		optimizePackageImports: ['fumadocs-ui', 'fumadocs-core', 'lucide-react'],
		webpackMemoryOptimizations: true,
	},
	redirects: getAllRedirects,
};

const withMDX = createMDX();

export default withMDX(config);
