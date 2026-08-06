import type { Metadata } from 'next';

import { ArticleCard } from '@/components/blog/article-card';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
	title: 'Blog',
	description:
		'Articles on building AI integrations, multi-tenant OAuth, and the Corsair open-source ecosystem.',
	alternates: {
		canonical: '/blog',
	},
};

export default async function BlogPage() {
	const posts = await getAllPosts();

	return (
		<main className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
			<div className="mb-10">
				<p className="mb-2 font-[family-name:var(--landing-font-mono)] text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c66]">
					Blog
				</p>
				<h1 className="mb-3 text-3xl font-semibold tracking-tight text-[#1c1c1c] md:text-4xl">
					Articles
				</h1>
				<p className="max-w-2xl text-base leading-relaxed text-[#1c1c1c99]">
					Thoughts on building integrations for AI agents, shipping multi-tenant
					OAuth, and growing the Corsair open-source ecosystem.
				</p>
			</div>

			{posts.length === 0 ? (
				<div className="rounded-xl border border-dashed border-[#1c1c1c1a] bg-white/50 px-6 py-12 text-center">
					<p className="text-sm text-[#1c1c1c99]">No articles yet.</p>
				</div>
			) : (
				<div className="space-y-4">
					{posts.map((post) => (
						<ArticleCard key={post.slug} post={post} />
					))}
				</div>
			)}
		</main>
	);
}
