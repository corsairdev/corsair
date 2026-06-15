export type OssIntegrationsView = 'integrations' | 'leaderboard';

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
	view = 'integrations',
}: {
	page?: number;
	q?: string;
	tags?: string[];
	view?: OssIntegrationsView;
}) {
	const params = new URLSearchParams();

	if (view === 'leaderboard') params.set('view', 'leaderboard');
	if (view === 'integrations' && q.trim()) params.set('q', q.trim());
	if (view === 'integrations' && tags.length > 0) {
		params.set('tags', tags.join(','));
	}
	if (page > 1) params.set('page', String(page));

	const query = params.toString();
	return query ? `/oss?${query}` : '/oss';
}
