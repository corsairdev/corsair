import { loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { openapi } from './openapi';
import { pluginIds } from './plugin-catalog';

function resolveSidebarIcon(icon: string | undefined): ReactNode {
	if (!icon) return undefined;
	return createElement('img', {
		src: icon,
		alt: '',
		className: 'framework-icon size-4 shrink-0',
	});
}

const docs = defineDocs({
	dir: 'content/docs',
	docs: {
		async: true,
	},
});

/**
 * `/plugins/<id>/api` is a route over the catalog, not a file. Without a node
 * here the sidebar cannot tell which section the page belongs to and falls
 * back to the root tree.
 */
const mdx = docs.toFumadocsSource();
type DocsFile = (typeof mdx.files)[number];

const pluginApiPages = pluginIds().map(
	(id) =>
		({
			type: 'page',
			path: `plugins/${id}/api.mdx`,
			data: { title: 'API' },
		}) as unknown as DocsFile,
);

export const source = loader({
	baseUrl: '/',
	source: { files: [...mdx.files, ...pluginApiPages] },
	icon: resolveSidebarIcon,
	plugins: [openapi.loaderPlugin()],
});
