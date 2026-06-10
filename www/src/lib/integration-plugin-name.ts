export function integrationToPluginName(name: string, slug: string): string {
	const fromName = name
		.replace(/[^a-zA-Z0-9\s-]/g, '')
		.split(/[\s-]+/)
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join('');

	if (fromName.length >= 2) {
		return fromName;
	}

	return slug
		.split('-')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
}
