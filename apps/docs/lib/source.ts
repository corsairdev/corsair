import { loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { openapi } from './openapi';

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

export const source = loader({
	baseUrl: '/',
	source: docs.toFumadocsSource(),
	icon: resolveSidebarIcon,
	plugins: [openapi.loaderPlugin()],
});
