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
	// The .md route reads MDX off disk at request time, which tracing can't infer.
	outputFileTracingIncludes: {
		'/api/md/[...slug]': ['./content/docs/**/*.mdx'],
	},
	rewrites: async () => [
		{ source: '/:slug(.*).md', destination: '/api/md/:slug' },
	],
};

const withMDX = createMDX();

export default withMDX(config);
