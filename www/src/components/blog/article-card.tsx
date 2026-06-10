import Link from 'next/link';

import { formatPostDate, type BlogPostMeta } from '@/lib/blog';

export function ArticleCard({ post }: { post: BlogPostMeta }) {
	return (
		<article className="group rounded-xl border border-[#1c1c1c1a] bg-white/70 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-sm transition-all duration-200 hover:border-[#1c1c1c33] hover:bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
			<div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#1c1c1c66]">
				<time dateTime={post.publishedAt}>
					{formatPostDate(post.publishedAt)}
				</time>
				<span aria-hidden="true">·</span>
				<span>{post.author}</span>
			</div>
			<h2 className="mb-2 text-xl font-semibold tracking-tight text-[#1c1c1c]">
				<Link
					href={`/blog/${post.slug}`}
					className="no-underline transition-colors group-hover:text-[#4a38f5]"
				>
					{post.title}
				</Link>
			</h2>
			<p className="mb-4 text-sm leading-relaxed text-[#1c1c1c99]">
				{post.description}
			</p>
			<Link
				href={`/blog/${post.slug}`}
				className="inline-flex items-center gap-1 text-sm font-medium text-[#4a38f5] no-underline transition-colors hover:text-[#3b2dd4]"
			>
				Read article
				<span aria-hidden="true">→</span>
			</Link>
		</article>
	);
}
