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
	webpack: (config) => {
		// The filesystem cache holds the whole 1298-module MDX graph in the heap to
		// serialise it, which alone pushes the build past --max-old-space-size=8192.
		// Off: peak 4.9GB and compiles; on: OOM (exit 134) at ~429s. CI is cold anyway.
		config.cache = false;
		return config;
	},
};

const withMDX = createMDX();

export default withMDX(config);
