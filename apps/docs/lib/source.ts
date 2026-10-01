import { loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';
import { openapi } from './openapi';

const docs = defineDocs({
	dir: 'content/docs',
});

export const source = loader({
	baseUrl: '/docs',
	source: docs.toFumadocsSource(),
	plugins: [openapi.loaderPlugin()],
});
