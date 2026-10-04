import { source } from './source';

/** Edge-cache doc pages for one hour after first render. */
export const DOCS_REVALIDATE_SECONDS = 3600;

const PLUGIN_SEGMENT = '/plugins/';

export function getPrerenderedDocParams() {
	return source
		.getPages()
		.filter((page) => !page.path.includes(PLUGIN_SEGMENT))
		.map((page) => ({ slug: page.slugs }));
}
