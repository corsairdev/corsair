import { readFile } from 'node:fs/promises';
import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb';
import { structure } from 'fumadocs-core/mdx-plugins';
import type { Root } from 'fumadocs-core/page-tree';
import type { AdvancedIndex } from 'fumadocs-core/search/server';
import { createSearchAPI } from 'fumadocs-core/search/server';
import remarkMdx from 'remark-mdx';
import { pluginSearchIndex } from './search-index';
import { getPageTree, source } from './source';

function breadcrumbsOf(tree: Root, url: string): string[] {
	return getBreadcrumbItems(url, tree, { includeRoot: true })
		.map((item) => item.name)
		.filter((name): name is string => typeof name === 'string');
}

/**
 * Plugin pages compile on request (lib/plugin-pages.ts), so they carry no
 * structured data; the ones without a catalog entry (get-credentials) are
 * indexed from their MDX here, headings and text only.
 */
async function pluginPageStructure(file: string | undefined) {
	if (!file) return undefined;
	const raw = await readFile(file, 'utf8');
	return structure(raw.replace(/^---\n[\s\S]*?\n---\n/, ''), [remarkMdx]);
}

async function searchIndexes(): Promise<AdvancedIndex[]> {
	const tree = getPageTree();
	// Every page comes from getPages(), including the synthetic /plugins/<id>/api
	// nodes. Appending those separately duplicates their id, and zbsearch rejects
	// the whole index on the first collision.
	return Promise.all(
		source.getPages().map(async (page): Promise<AdvancedIndex> => {
			const lean = pluginSearchIndex(page.url);
			if (lean) return lean;

			const data =
				page.data.structuredData ??
				(await pluginPageStructure(page.absolutePath));
			return {
				id: page.url,
				url: page.url,
				title: page.data.title,
				description: page.data.description,
				breadcrumbs: breadcrumbsOf(tree, page.url),
				tag: page.url.startsWith('/plugins/') ? 'plugin' : undefined,
				structuredData:
					typeof data === 'function'
						? await data()
						: (data ?? { headings: [], contents: [] }),
			};
		}),
	);
}

// Thunk, so the index is built on the first query rather than at module load.
// Sorting is off: results rank by score, and the sort tables cost ~5MB.
// Shared by /api/search and the MCP server's search tool.
export const searchServer = createSearchAPI('advanced', {
	indexes: searchIndexes,
	sort: { enabled: false },
});
