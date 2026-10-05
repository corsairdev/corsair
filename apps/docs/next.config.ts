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
		// The filesystem cache serialises the whole MDX module graph through the
		// heap, which alone pushes the build past --max-old-space-size=8192.
		// Off: peak ~4.9GB and compiles; on: OOM (exit 134). CI builds cold anyway.
		config.cache = false;
		return config;
	},
};

const withMDX = createMDX();

export default withMDX(config);
