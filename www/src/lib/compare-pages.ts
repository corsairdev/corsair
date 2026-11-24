/**
 * Slugs of the pages under /compare. Each one has a folder in
 * src/app/compare/<slug>. The sitemap lists every slug here, and
 * compare-pages.test.ts fails when a compare page is missing from this list.
 */
export const COMPARE_SLUGS = [
	'composio',
	'gbrain',
	'monid',
	'nango',
	'pipedream-mcp',
	'smithery',
	'treg',
	'zapier-mcp',
] as const;
