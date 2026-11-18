export function integrationDocsUrl(id: string): string {
	return `https://docs.corsair.dev/plugins/${id}/overview`;
}

export function integrationPageUrl(id: string): string {
	return `/integrations/${id}`;
}

// `v` changes the URL so browsers and the CDN drop cached icons. Icons are
// cached for a day and served stale for up to a week after, so bump it when
// many icons change at once (v=3: 116 icons replaced; v=4: SVG icons).
// Hub's PLUGIN_ICON_VERSION (corsairdev/hub explorer/src/plugin-icon-url.ts)
// follows this one.
export function integrationIconUrl(id: string): string {
	return `/plugin-icons/${id}?v=4`;
}
