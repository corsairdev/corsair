import Link from 'next/link';
import type { ReactNode } from 'react';

const linkClassName =
	'text-[#1c1c1c] underline decoration-[#1c1c1c33] underline-offset-2 transition-colors hover:decoration-[#1c1c1c]';

export function LegalDocument({
	title,
	lastUpdated,
	children,
	relatedLink,
}: {
	title: string;
	lastUpdated: string;
	children: ReactNode;
	relatedLink?: { href: string; label: string };
}) {
	return (
		<main className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
			<div className="mb-10">
				<p className="mb-2 font-[family-name:var(--landing-font-mono)] text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c66]">
					Legal
				</p>
				<h1 className="mb-3 text-3xl font-semibold tracking-tight text-[#1c1c1c] md:text-4xl">
					{title}
				</h1>
				<p className="text-sm text-[#1c1c1c66]">Last updated: {lastUpdated}</p>
			</div>

			<article className="space-y-10 text-base leading-relaxed text-[#1c1c1c99]">
				{children}
			</article>

			{relatedLink ? (
				<p className="mt-12 border-t border-[#1c1c1c0d] pt-8 text-sm text-[#1c1c1c66]">
					See also:{' '}
					<Link href={relatedLink.href} className={linkClassName}>
						{relatedLink.label}
					</Link>
				</p>
			) : null}
		</main>
	);
}

export function LegalSection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section className="space-y-4">
			<h2 className="text-xl font-semibold tracking-tight text-[#1c1c1c]">
				{title}
			</h2>
			{children}
		</section>
	);
}

export function LegalSubsection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-[#1c1c1c]">{title}</h3>
			{children}
		</div>
	);
}

export function LegalDivider() {
	return <hr className="border-[#1c1c1c1a]" />;
}

export const legalLinkClassName = linkClassName;
