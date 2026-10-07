import { source } from './source';

const PLUGIN_PREFIX = '/plugins/';

/**
 * Prerender everything except the ~1160 plugin pages, which are left to
 * on-demand ISR. Matches on `url`, not `path`: `path` is relative to the
 * content dir ("plugins/github/webhooks.mdx"), so a leading-slash test
 * against it silently matches nothing.
 */
export function getPrerenderedDocParams() {
	return source
		.getPages()
		.filter((page) => !page.url.startsWith(PLUGIN_PREFIX))
		.map((page) => ({ slug: page.slugs }));
}
