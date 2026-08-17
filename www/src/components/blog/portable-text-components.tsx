import type { PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import Image from 'next/image';

import { urlForImage } from '@/lib/sanity/client';

type SanityImageValue = {
	_type: 'image';
	asset?: {
		_ref?: string;
	};
	alt?: string;
	caption?: string;
};

export const portableTextComponents: PortableTextComponents = {
	block: {
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
		blockquote: ({ children }) => (
			<blockquote className="mb-5 border-l-2 border-[#4a38f5] pl-4 text-base italic leading-7 text-[#1c1c1c99]">
				{children}
			</blockquote>
		),
		normal: ({ children }) => (
			<p className="mb-5 text-base leading-7 text-[#1c1c1c99]">{children}</p>
		),
	},
	list: {
		bullet: ({ children }) => (
			<ul className="mb-5 list-disc space-y-2 pl-6 text-base leading-7 text-[#1c1c1c99]">
				{children}
			</ul>
		),
		number: ({ children }) => (
			<ol className="mb-5 list-decimal space-y-2 pl-6 text-base leading-7 text-[#1c1c1c99]">
				{children}
			</ol>
		),
	},
	marks: {
		strong: ({ children }) => (
			<strong className="font-semibold text-[#1c1c1c]">{children}</strong>
		),
		em: ({ children }) => <em>{children}</em>,
		code: ({ children }) => (
			<code className="rounded bg-[#1c1c1c0d] px-1.5 py-0.5 font-[family-name:var(--landing-font-mono)] text-[0.9em] text-[#1c1c1c]">
				{children}
			</code>
		),
		link: ({ children, value }) => {
			const href = typeof value?.href === 'string' ? value.href : '#';

			return (
				<a
					href={href}
					className="font-medium text-[#4a38f5] underline-offset-2 transition-colors hover:text-[#3b2dd4] hover:underline"
					rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
					target={href.startsWith('http') ? '_blank' : undefined}
				>
					{children}
				</a>
			);
		},
	},
	types: {
		image: ({ value }) => {
			const imageValue = value as SanityImageValue | undefined;

			if (!imageValue?.asset?._ref) {
				return null;
			}

			const imageUrl = urlForImage(imageValue).width(1200).auto('format').url();
			const alt = imageValue.alt ?? '';

			return (
				<figure className="my-8">
					<Image
						src={imageUrl}
						alt={alt}
						width={1200}
						height={675}
						className="h-auto w-full rounded-xl border border-[#1c1c1c1a] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
						sizes="(max-width: 768px) 100vw, 768px"
					/>
					{imageValue.caption ? (
						<figcaption className="mt-3 text-center text-sm text-[#1c1c1c66]">
							{imageValue.caption}
						</figcaption>
					) : alt ? (
						<figcaption className="mt-3 text-center text-sm text-[#1c1c1c66]">
							{alt}
						</figcaption>
					) : null}
				</figure>
			);
		},
	},
};

export type BlogPortableTextProps = {
	value: PortableTextBlock[];
};
