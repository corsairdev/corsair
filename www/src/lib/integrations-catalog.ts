export function integrationDocsUrl(id: string): string {
	return `https://docs.corsair.dev/plugins/${id}/overview`;
}

export function integrationPageUrl(id: string): string {
	return `/integrations/${id}`;
}

// `v` changes the URL so browsers and the CDN drop cached icons. Icons are
// cached for a day and served stale for up to a week after, so bump it when
// many icons change at once (v=3: 94 icons replaced, 11-07).
export function integrationIconUrl(id: string): string {
	return `/plugin-icons/${id}?v=3`;
}
