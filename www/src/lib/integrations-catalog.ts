export function integrationDocsUrl(id: string): string {
	return `https://docs.corsair.dev/plugins/${id}/overview`;
}

export function integrationPageUrl(id: string): string {
	return `/integrations/${id}`;
}

// `v` changes the URL so browsers drop icons cached under the old year-long
// immutable header; bump it only if that header ever comes back.
export function integrationIconUrl(id: string): string {
	return `/plugin-icons/${id}?v=2`;
}
