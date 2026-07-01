import type { MetadataRoute } from 'next';

import { getAllPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await getAllPosts();

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
		...posts.map((post) => ({
			url: `https://corsair.dev/blog/${post.slug}`,
			lastModified: post.publishedAt,
			changeFrequency: 'monthly' as const,
			priority: 0.6,
		})),
	];
}
