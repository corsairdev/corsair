import { source } from './source';

/**
 * What the build prerenders. The ~110 written pages are built ahead; the
 * ~2,500 generated plugin pages (API, overview, database, webhooks,
 * credentials) render on first request and are cached for an hour, which
 * keeps each deploy small (prerendering all of them is ~2 GB of HTML). Set DOCS_PRERENDER_ALL=1 to
 * build every page, as the CI check does, so a page that fails to render
 * fails the build rather than a visitor's request.
 */
const prerenderAll = process.env.DOCS_PRERENDER_ALL === '1';

export function getPrerenderedDocParams() {
	return source
		.getPages()
		.filter((page) => prerenderAll || !page.url.startsWith('/plugins/'))
		.map((page) => ({ slug: page.slugs }));
}
