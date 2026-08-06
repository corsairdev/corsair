import type { PortableTextBlock } from '@portabletext/types';
import { getSanityClient } from '@/lib/sanity/client';
import {
	allPostSlugsQuery,
	allPostsQuery,
	postBySlugQuery,
} from '@/lib/sanity/queries';
import { sanityProjectId } from '../../sanity/env';

export type BlogPostMeta = {
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	author: string;
};

export type BlogPost = BlogPostMeta & {
	body: PortableTextBlock[];
};

type SanityPostRecord = {
	slug: string | null;
	title: string | null;
	description: string | null;
	publishedAt: string | null;
	author: string | null;
	body?: PortableTextBlock[];
};

const fetchOptions = { next: { tags: ['blog'] } };

function toPostMeta(record: SanityPostRecord): BlogPostMeta | null {
	if (!record.slug || !record.title || !record.publishedAt) {
		return null;
	}

	return {
		slug: record.slug,
		title: record.title,
		description: record.description ?? '',
		publishedAt: record.publishedAt,
		author: record.author ?? 'Corsair Team',
	};
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
	const sanityClient = getSanityClient();

	if (!sanityProjectId || !sanityClient) return [];

	const records = await sanityClient.fetch<SanityPostRecord[]>(
		allPostsQuery,
		{},
		fetchOptions,
	);

	return records
		.map(toPostMeta)
		.filter((post): post is BlogPostMeta => post !== null);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
	const sanityClient = getSanityClient();

	if (!sanityProjectId || !sanityClient) return null;

	const record = await sanityClient.fetch<SanityPostRecord | null>(
		postBySlugQuery,
		{ slug },
		fetchOptions,
	);

	const meta = record ? toPostMeta(record) : null;

	if (!meta || !record?.body) {
		return null;
	}

	return {
		...meta,
		body: record.body,
	};
}

export async function getAllSlugs(): Promise<string[]> {
	const sanityClient = getSanityClient();

	if (!sanityProjectId || !sanityClient) return [];

	const records = await sanityClient.fetch<Array<{ slug: string | null }>>(
		allPostSlugsQuery,
		{},
		fetchOptions,
	);

	return records
		.map((record) => record.slug)
		.filter((slug): slug is string => Boolean(slug));
}

export function formatPostDate(date: string) {
	return new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	}).format(new Date(date));
}
