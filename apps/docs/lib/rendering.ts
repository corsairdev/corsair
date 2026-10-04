import { source } from './source';

const PLUGIN_SEGMENT = '/plugins/';

export function getPrerenderedDocParams() {
	return source
		.getPages()
		.filter((page) => !page.path.includes(PLUGIN_SEGMENT))
		.map((page) => ({ slug: page.slugs }));
}
