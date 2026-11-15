import type { PortableTextBlock } from '@portabletext/types';
import type { BlogFaq } from '@/lib/blog-seo';
import { faqsFromJsonLd } from '@/lib/blog-seo';
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

export type BlogImage = {
	asset?: { _ref?: string };
	alt?: string;
};

export type BlogPost = BlogPostMeta & {
	body: PortableTextBlock[];
	updatedAt?: string;
	metaTitle?: string;
	metaDescription?: string;
	keywords: string[];
	coverImage?: BlogImage;
	socialShareImage?: BlogImage;
	faqs: BlogFaq[];
};

type SanityPostRecord = {
	slug: string | null;
	title: string | null;
	description: string | null;
	publishedAt: string | null;
	author: string | null;
	body?: PortableTextBlock[];
};

type SanityPostDetailRecord = SanityPostRecord & {
	updatedAt?: string | null;
	metaTitle?: string | null;
	metaDescription?: string | null;
	targetKeywords?: string[] | null;
	coverImage?: BlogImage | null;
	socialShareImage?: BlogImage | null;
	faqs?: Array<{
		_key?: string;
		question?: string | null;
		answer?: string | null;
	}> | null;
	jsonLd?: string | null;
};

function hasAsset(image: BlogImage | null | undefined): image is BlogImage {
	return Boolean(image?.asset?._ref);
}

function toFaqs(record: SanityPostDetailRecord): BlogFaq[] {
	const faqs = (record.faqs ?? []).flatMap((faq, index) => {
		const question = faq.question?.trim();
		const answer = faq.answer?.trim();
		return question && answer
			? [{ id: faq._key ?? `faq-${index}`, question, answer }]
			: [];
	});

	return faqs.length > 0 ? faqs : faqsFromJsonLd(record.jsonLd);
}

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

	const record = await sanityClient.fetch<SanityPostDetailRecord | null>(
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
		updatedAt: record.updatedAt ?? undefined,
		metaTitle: record.metaTitle?.trim() || undefined,
		metaDescription: record.metaDescription?.trim() || undefined,
		keywords: (record.targetKeywords ?? []).filter(Boolean),
		coverImage: hasAsset(record.coverImage) ? record.coverImage : undefined,
		socialShareImage: hasAsset(record.socialShareImage)
			? record.socialShareImage
			: undefined,
		faqs: toFaqs(record),
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
