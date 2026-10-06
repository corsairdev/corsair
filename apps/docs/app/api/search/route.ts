import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb';
import type { Root } from 'fumadocs-core/page-tree';
import type { AdvancedIndex } from 'fumadocs-core/search/server';
import { createSearchAPI } from 'fumadocs-core/search/server';
import { pluginSearchIndex } from '@/lib/search-index';
import { source } from '@/lib/source';

function breadcrumbsOf(tree: Root, url: string): string[] {
	return getBreadcrumbItems(url, tree, { includeRoot: true })
		.map((item) => item.name)
		.filter((name): name is string => typeof name === 'string');
}

async function searchIndexes(): Promise<AdvancedIndex[]> {
	const tree = source.getPageTree();
	// Every page comes from getPages(), including the synthetic /plugins/<id>/api
	// nodes. Appending those separately duplicates their id, and zbsearch rejects
	// the whole index on the first collision.
	return Promise.all(
		source.getPages().map(async (page): Promise<AdvancedIndex> => {
			const lean = pluginSearchIndex(page.url);
			if (lean) return lean;

			const data = page.data.structuredData;
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
export const { GET } = createSearchAPI('advanced', {
	indexes: searchIndexes,
	sort: { enabled: false },
});
