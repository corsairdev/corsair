import path from 'node:path';
import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';
import { getAllRedirects } from './lib/redirects';

// The content (docs/) and the plugin catalog (explorer/data) sit at the repo
// root, outside this app.
const repoRoot = path.resolve(process.cwd(), '../..');
const prerenderAll = process.env.DOCS_PRERENDER_ALL === '1';

const config: NextConfig = {
	reactStrictMode: true,
	outputFileTracingRoot: repoRoot,
	turbopack: { root: repoRoot },
	experimental: {
		optimizePackageImports: ['fumadocs-ui', 'fumadocs-core', 'lucide-react'],
		// Each static-generation worker loads the whole page index; two keep the
		// build well inside an 8 GB build machine and prerender ~110 pages in
		// seconds. DOCS_PRERENDER_ALL builds (CI) get more.
		cpus: prerenderAll ? 4 : 2,
		// Prerendering every page compiles ~2,500 plugin pages inside the
		// workers. Eight at a time per worker left heavy API pages queued past
		// the 60 s page limit on a 4-core CI runner.
		staticGenerationMaxConcurrency: prerenderAll ? 2 : 8,
	},
	staticPageGenerationTimeout: prerenderAll ? 300 : 60,
	redirects: async () => getAllRedirects(),
	// Read from disk at request time, which file tracing can't infer.
	outputFileTracingIncludes: {
		'/**': ['../../docs/docs.json', '../../explorer/data/plugins/*.json'],
		'/llms.mdx/[...slug]': ['../../docs/**/*.mdx'],
		'/llms-full.txt': ['../../docs/**/*.mdx'],
		'/mcp': ['../../docs/**/*.mdx'],
	},
	rewrites: async () => [
		{ source: '/:path*.md', destination: '/llms.mdx/:path*' },
		{ source: '/:path*.mdx', destination: '/llms.mdx/:path*' },
	],
};

const withMDX = createMDX();

export default withMDX(config);
