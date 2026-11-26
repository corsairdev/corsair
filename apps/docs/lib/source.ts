import type * as PageTree from 'fumadocs-core/page-tree';
import { loader } from 'fumadocs-core/source';
import { pageSchema } from 'fumadocs-core/source/schema';
import { defineDocs } from 'fumadocs-mdx/macro';
import { z } from 'zod';
import { buildPageTree, sidebarIcon } from './nav';
import { pluginPageFiles } from './plugin-pages';

/**
 * The content is docs/ at the repo root, the tree Mintlify publishes, read in
 * place. `async` keeps each page's compiled MDX in its own chunk, loaded when
 * the page renders. The ~2,500 plugin pages are compiled on request instead
 * (lib/plugin-pages.ts).
 */
const docs = defineDocs({
	dir: '../../docs',
	docs: {
		files: ['**/*.mdx', '!plugins/**', '!snippets/**'],
		async: true,
		schema: pageSchema.extend({
			sidebarTitle: z.string().optional(),
			mode: z.string().optional(),
			rss: z.boolean().optional(),
		}),
	},
	meta: { files: [] },
});

const mdx = docs.toFumadocsSource();
type DocsFile = (typeof mdx.files)[number];

export const source = loader({
	baseUrl: '/',
	source: {
		files: [...mdx.files, ...(pluginPageFiles() as unknown as DocsFile[])],
	},
	icon: sidebarIcon,
});

let tree: PageTree.Root | undefined;

/** The sidebar, from docs.json (see lib/nav.ts). */
export function getPageTree(): PageTree.Root {
	tree ??= buildPageTree((slugPath) => {
		const page = source.getPage(slugPath.split('/'));
		if (!page) return undefined;
		const data = page.data as {
			title: string;
			sidebarTitle?: string;
			icon?: string;
		};
		return {
			url: page.url,
			title: data.sidebarTitle ?? data.title,
			icon: data.icon,
		};
	});
	return tree;
}

export type DocsPage = NonNullable<ReturnType<typeof source.getPage>>;
