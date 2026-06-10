import type { Components } from 'react-markdown';
import Markdown from 'react-markdown';

const components: Components = {
	h1: ({ children }) => (
		<h1 className="mb-6 mt-10 text-3xl font-semibold tracking-tight text-[#1c1c1c] first:mt-0">
			{children}
		</h1>
	),
	h2: ({ children }) => (
		<h2 className="mb-4 mt-10 text-2xl font-semibold tracking-tight text-[#1c1c1c]">
			{children}
		</h2>
	),
	h3: ({ children }) => (
		<h3 className="mb-3 mt-8 text-xl font-medium tracking-tight text-[#1c1c1c]">
			{children}
		</h3>
	),
	p: ({ children, node }) => {
		const hasOnlyImage =
			node?.children.length === 1 &&
			(node.children[0] as { tagName?: string }).tagName === 'img';

		if (hasOnlyImage) {
			return <>{children}</>;
		}

		return (
			<p className="mb-5 text-base leading-7 text-[#1c1c1c99]">{children}</p>
		);
	},
	ul: ({ children }) => (
		<ul className="mb-5 list-disc space-y-2 pl-6 text-base leading-7 text-[#1c1c1c99]">
			{children}
		</ul>
	),
	ol: ({ children }) => (
		<ol className="mb-5 list-decimal space-y-2 pl-6 text-base leading-7 text-[#1c1c1c99]">
			{children}
		</ol>
	),
	li: ({ children }) => <li>{children}</li>,
	a: ({ href, children }) => (
		<a
			href={href}
			className="font-medium text-[#4a38f5] underline-offset-2 transition-colors hover:text-[#3b2dd4] hover:underline"
		>
			{children}
		</a>
	),
	strong: ({ children }) => (
		<strong className="font-semibold text-[#1c1c1c]">{children}</strong>
	),
	code: ({ children }) => (
		<code className="rounded bg-[#1c1c1c0d] px-1.5 py-0.5 font-[family-name:var(--landing-font-mono)] text-[0.9em] text-[#1c1c1c]">
			{children}
		</code>
	),
	blockquote: ({ children }) => (
		<blockquote className="mb-5 border-l-2 border-[#4a38f5] pl-4 text-base italic leading-7 text-[#1c1c1c99]">
			{children}
		</blockquote>
	),
	hr: () => <hr className="my-10 border-[#1c1c1c1a]" />,
	img: ({ src, alt }) => (
		<figure className="my-8">
			<img
				src={src}
				alt={alt ?? ''}
				className="w-full rounded-xl border border-[#1c1c1c1a] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
			/>
			{alt ? (
				<figcaption className="mt-3 text-center text-sm text-[#1c1c1c66]">
					{alt}
				</figcaption>
			) : null}
		</figure>
	),
};

export function BlogProse({ content }: { content: string }) {
	return (
		<div className="blog-prose">
			<Markdown components={components}>{content}</Markdown>
		</div>
	);
}
