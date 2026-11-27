import { defineConfig } from 'fumadocs-mdx/config';
import { remarkMintlify } from './lib/remark-mintlify';

// Collections are declared with the macro API in lib/source.ts; this file only
// holds the MDX options they share.
export default defineConfig({
	mdxOptions: {
		// First, so remarkCodeTab sees the tab metas it writes.
		remarkPlugins: (plugins) => [remarkMintlify, ...plugins],
		rehypeCodeOptions: {
			themes: { light: 'github-light', dark: 'github-dark' },
			// Unknown languages in generated pages (e.g. `env`) render as text
			// instead of failing the build.
			fallbackLanguage: 'text',
		},
	},
});
