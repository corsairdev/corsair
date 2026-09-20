export function parseTagSlugs(raw?: string): string[] {
	if (!raw?.trim()) return [];

	return [
		...new Set(
			raw
				.split(',')
				.map((slug) => slug.trim())
				.filter(Boolean),
		),
	];
}

export function buildOssHref({
	page = 1,
	q = '',
	tags = [],
}: {
	page?: number;
	q?: string;
	tags?: string[];
}) {
	const params = new URLSearchParams();

	if (q.trim()) params.set('q', q.trim());
	if (tags.length > 0) {
		params.set('tags', tags.join(','));
	}
	if (page > 1) params.set('page', String(page));

	const query = params.toString();
	return query ? `/oss?${query}` : '/oss';
}

export function buildOssIntegrationHref(slug: string, searchParams?: string) {
	const base = `/oss/${slug}`;
	return searchParams ? `${base}?${searchParams}` : base;
}

export function buildOssContributorHref(username: string) {
	return `/oss/u/${username.toLowerCase()}`;
}
