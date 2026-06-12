import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BlogProse } from '@/components/blog/blog-prose';
import {
	formatPostDate,
	getAllSlugs,
	getPostBySlug,
} from '@/lib/blog';

type PageProps = {
	params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
	return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) {
		return { title: 'Article not found' };
	}

	return {
		title: post.title,
		description: post.description,
		alternates: {
			canonical: `/blog/${post.slug}`,
		},
		openGraph: {
			title: post.title,
			description: post.description,
			type: 'article',
			publishedTime: post.publishedAt,
			authors: [post.author],
		},
	};
}

export default async function BlogArticlePage({ params }: PageProps) {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	return (
		<main className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
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

			<BlogProse content={post.content} />
		</main>
	);
}
