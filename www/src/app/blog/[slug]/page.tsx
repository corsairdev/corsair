import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BlogProse } from '@/components/blog/blog-prose';
import type { BlogPost } from '@/lib/blog';
import { formatPostDate, getAllSlugs, getPostBySlug } from '@/lib/blog';
import {
	buildBlogPostJsonLd,
	faqsVisibleInBody,
	serializeJsonLd,
} from '@/lib/blog-seo';
import { urlForImage } from '@/lib/sanity/client';

type PageProps = {
	params: Promise<{ slug: string }>;
};

const DEFAULT_SHARE_IMAGE = '/og-image.png';

function shareImageUrl(post: BlogPost) {
	const image = post.socialShareImage ?? post.coverImage;
	if (!image) return undefined;

	return urlForImage(image)
		.width(1200)
		.height(630)
		.fit('crop')
		.auto('format')
		.url();
}

export async function generateStaticParams() {
	const slugs = await getAllSlugs();

	return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) {
		return { title: 'Article not found' };
	}

	const title = post.metaTitle ?? post.title;
	const description = post.metaDescription ?? post.description;
	const image = shareImageUrl(post) ?? DEFAULT_SHARE_IMAGE;

	return {
		title,
		description,
		alternates: {
			canonical: `/blog/${post.slug}`,
		},
		openGraph: {
			title,
			description,
			type: 'article',
			url: `/blog/${post.slug}`,
			publishedTime: post.publishedAt,
			modifiedTime: post.updatedAt,
			authors: [post.author],
			images: [{ url: image, width: 1200, height: 630 }],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [image],
		},
	};
}

export default async function BlogArticlePage({ params }: PageProps) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const jsonLd = buildBlogPostJsonLd({
		slug: post.slug,
		title: post.title,
		description: post.metaDescription ?? post.description,
		author: post.author,
		publishedAt: post.publishedAt,
		updatedAt: post.updatedAt,
		keywords: post.keywords,
		faqs: faqsVisibleInBody(post.faqs, post.body),
		imageUrl: shareImageUrl(post),
	});

	return (
		<main className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
			/>
			<Link
				href="/blog"
				className="mb-8 inline-flex items-center gap-1.5 text-sm text-[#1c1c1c66] no-underline transition-colors hover:text-[#1c1c1c]"
			>
				← All articles
			</Link>

			<header className="mb-10 border-b border-[#1c1c1c1a] pb-8">
				<div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#1c1c1c66]">
					<time dateTime={post.publishedAt}>
						{formatPostDate(post.publishedAt)}
					</time>
					<span aria-hidden="true">·</span>
					<span>{post.author}</span>
				</div>
				<h1 className="text-3xl font-semibold tracking-tight text-[#1c1c1c] md:text-4xl">
					{post.title}
				</h1>
				<p className="mt-4 text-base leading-relaxed text-[#1c1c1c99]">
					{post.description}
				</p>
			</header>

			<BlogProse value={post.body} />
		</main>
	);
}
