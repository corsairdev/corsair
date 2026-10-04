import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { source } from '@/lib/source';

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
	return source.getPages().map((page) => ({
		url: new URL(page.url, SITE_URL).toString(),
		changeFrequency: 'weekly',
	}));
}
