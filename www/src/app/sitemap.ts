import type { MetadataRoute } from 'next';

import { getAllPosts } from '@/lib/blog';
import { getCatalogIntegrationIds } from '@/server/catalog-integration-cache';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [posts, integrationIds] = await Promise.all([
		getAllPosts(),
		getCatalogIntegrationIds(),
	]);

	return [
		{
			url: 'https://corsair.dev',
			changeFrequency: 'weekly',
			priority: 1.0,
		},
		{
			url: 'https://corsair.dev/blog',
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		{
			url: 'https://corsair.dev/privacy-policy',
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		{
			url: 'https://corsair.dev/compare/nango',
			changeFrequency: 'monthly',
			priority: 0.7,
		},
		{
			url: 'https://corsair.dev/integrations',
			changeFrequency: 'weekly',
			priority: 0.9,
		},
		...integrationIds.map((id) => ({
			url: `https://corsair.dev/integrations/${id}`,
			changeFrequency: 'weekly' as const,
			priority: 0.8,
		})),
		...posts.map((post) => ({
			url: `https://corsair.dev/blog/${post.slug}`,
			lastModified: post.publishedAt,
			changeFrequency: 'monthly' as const,
			priority: 0.6,
		})),
	];
}
