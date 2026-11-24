import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/landing/footer/site-footer';
import { ChevronIcon, PlusCorner } from '@/components/landing/icons';
import { SiteMenu } from '@/components/landing/menu/site-menu';
import '@/components/landing/theme.css';

/**
 * Building blocks for the MCP gateway pages (/pricing, /mcp-gateway, /connect,
 * /skills, /compare), which moved here from lug.dev. They use the same menu,
 * footer, fonts and colours as the rest of corsair.dev.
 */

export const SITE_URL = 'https://corsair.dev';

const WIDTH = {
	text: 'max-w-[880px]',
	wide: '',
} as const;

type Width = keyof typeof WIDTH;

export function GatewayLayout({ children }: { children: ReactNode }) {
	return (
		<div className="landing min-h-screen overflow-x-clip bg-[#f4f4f4]">
			<SiteMenu />
			<main>{children}</main>
			<SiteFooter />
		</div>
	);
}

function Container({
	width = 'text',
	children,
}: {
	width?: Width;
	children: ReactNode;
}) {
	return (
		<div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10">
			{/* One left edge for every section; text sections are just narrower. */}
			<div className="mx-auto max-w-[1120px]">
				<div className={WIDTH[width]}>{children}</div>
			</div>
		</div>
	);
}

export type Cta = { label: string; href: string; external?: boolean };

const primaryButton =
	'inline-flex touch-manipulation items-center justify-center rounded-lg bg-[#4a38f5] px-6 py-3 text-sm font-medium text-white no-underline transition-colors hover:bg-[#3d2ee0]';
const secondaryButton =
	'inline-flex touch-manipulation items-center justify-center rounded-lg border border-[#1c1c1c1a] bg-white px-6 py-3 text-sm font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-[#f4f4f4]';
export const textLink =
	'font-medium text-[#4a38f5] underline-offset-4 hover:underline';

function CtaLink({ cta, primary }: { cta: Cta; primary: boolean }) {
	return (
		<a
			href={cta.href}
			className={primary ? primaryButton : secondaryButton}
			{...(cta.external
				? { target: '_blank', rel: 'noopener noreferrer' }
				: {})}
		>
			{cta.label}
			{cta.external ? (
				<span className="sr-only"> (opens in a new tab)</span>
			) : null}
		</a>
	);
}

export function Ctas({ ctas }: { ctas: readonly Cta[] }) {
	return (
		<div className="mt-8 flex flex-col gap-3 sm:flex-row">
			{ctas.map((cta, i) => (
				<CtaLink key={cta.href + cta.label} cta={cta} primary={i === 0} />
			))}
		</div>
	);
}

export function Eyebrow({ children }: { children: ReactNode }) {
	return (
		<p className="mb-4 font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.02em] text-[#1c1c1c99]">
			{children}
		</p>
	);
}

export function PageHero({
	eyebrow,
	title,
	lede,
	ctas,
	width = 'text',
	children,
}: {
	eyebrow?: ReactNode;
	title: ReactNode;
	lede?: ReactNode;
	ctas?: readonly Cta[];
	width?: Width;
	children?: ReactNode;
}) {
	return (
		<section className="relative w-full border-b border-[#1c1c1c1a] pt-10 pb-14 md:pt-14 md:pb-20">
			<Container width={width}>
				{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
				<h1 className="mb-5 text-balance font-[family-name:var(--landing-font-serif)] text-[clamp(2rem,4.5vw,3.25rem)] font-light leading-[1.08] tracking-[-0.03em] text-[#1c1c1c]">
					{title}
				</h1>
				{lede ? <Lede>{lede}</Lede> : null}
				{ctas?.length ? <Ctas ctas={ctas} /> : null}
				{children}
			</Container>
		</section>
	);
}

export function Lede({ children }: { children: ReactNode }) {
	return (
		<p className="max-w-[680px] text-lg leading-relaxed text-[#1c1c1c99] md:text-xl md:leading-[1.65]">
			{children}
		</p>
	);
}

export function Section({
	id,
	title,
	lede,
	width = 'text',
	children,
}: {
	id?: string;
	title?: ReactNode;
	lede?: ReactNode;
	width?: Width;
	children?: ReactNode;
}) {
	const headingId = id ? `${id}-heading` : undefined;
	return (
		<section
			id={id}
			aria-labelledby={title ? headingId : undefined}
			className="scroll-mt-24 border-b border-[#1c1c1c1a] py-14 md:py-20"
		>
			<Container width={width}>
				{title ? (
					<h2
						id={headingId}
						className="mb-4 text-balance text-2xl font-medium tracking-[-0.02em] text-[#1c1c1c] md:text-3xl"
					>
						{title}
					</h2>
				) : null}
				{lede ? (
					<p className="mb-8 max-w-[680px] text-base leading-relaxed text-[#1c1c1c99] md:text-lg">
						{lede}
					</p>
				) : null}
				{children}
			</Container>
		</section>
	);
}

export function H3({ children }: { children: ReactNode }) {
	return (
		<h3 className="text-base font-medium tracking-[-0.01em] text-[#1c1c1c] md:text-lg">
			{children}
		</h3>
	);
}

export function Body({
	children,
	className = '',
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<p
			className={`text-[15px] leading-[1.65] text-[#1c1c1c99] md:text-base ${className}`}
		>
			{children}
		</p>
	);
}

export function Card({
	children,
	id,
	highlight = false,
}: {
	children: ReactNode;
	id?: string;
	highlight?: boolean;
}) {
	return (
		<article
			id={id}
			className={`relative flex scroll-mt-24 flex-col gap-3 border bg-white p-5 md:p-6 ${
				highlight ? 'border-[#4a38f5]' : 'border-[#1c1c1c1a]'
			}`}
		>
			{children}
		</article>
	);
}

export function CardGrid({
	children,
	columns = 2,
}: {
	children: ReactNode;
	columns?: 2 | 3;
}) {
	return (
		<div
			className={`grid gap-4 ${columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}
		>
			{children}
		</div>
	);
}

/** Title + body rows separated by rules, for "what it does" lists. */
export function Rows({
	rows,
}: {
	rows: readonly { title: string; body: ReactNode }[];
}) {
	return (
		<div className="divide-y divide-[#1c1c1c1a] border-y border-[#1c1c1c1a]">
			{rows.map((row) => (
				<div
					key={row.title}
					className="grid gap-2 py-5 md:grid-cols-[240px_1fr] md:gap-8"
				>
					<H3>{row.title}</H3>
					<Body>{row.body}</Body>
				</div>
			))}
		</div>
	);
}

export function Steps({
	steps,
}: {
	steps: readonly { title: string; body: ReactNode }[];
}) {
	return (
		<ol className="grid gap-4 md:grid-cols-3">
			{steps.map((step, i) => (
				<li
					key={step.title}
					className="flex flex-col gap-2 border border-[#1c1c1c1a] bg-white p-5"
				>
					<span className="font-[family-name:var(--landing-font-mono)] text-xs font-medium text-[#4a38f5]">
						{String(i + 1).padStart(2, '0')}
					</span>
					<H3>{step.title}</H3>
					<Body>{step.body}</Body>
				</li>
			))}
		</ol>
	);
}

export function CodeWindow({
	title,
	code,
	wrap = false,
}: {
	title: string;
	code: string;
	/** Wrap long lines (prose) instead of scrolling (config files). */
	wrap?: boolean;
}) {
	return (
		<figure className="m-0 min-w-0 overflow-hidden border border-[#1c1c1c1a] bg-[#1c1c1c]">
			<figcaption className="border-b border-white/10 px-4 py-2 font-[family-name:var(--landing-font-mono)] text-[11px] text-white/60">
				{title}
			</figcaption>
			<pre
				className={`m-0 p-4 font-[family-name:var(--landing-font-mono)] text-[12.5px] leading-[1.6] text-[#f4f4f4] ${
					wrap ? 'whitespace-pre-wrap break-words' : 'overflow-x-auto'
				}`}
			>
				<code>{code}</code>
			</pre>
		</figure>
	);
}

/** Text with `code` spans, the way the client guides write them. */
export function Inline({ text }: { text: string }) {
	return (
		<>
			{text.split('`').map((part, i) =>
				i % 2 ? (
					<code
						key={i}
						className="rounded bg-[#1c1c1c0d] px-1 py-0.5 font-[family-name:var(--landing-font-mono)] text-[0.9em] text-[#1c1c1c]"
					>
						{part}
					</code>
				) : (
					<span key={i}>{part}</span>
				),
			)}
		</>
	);
}

export type FaqItem = { q: string; a: string };

export function Faq({ items }: { items: readonly FaqItem[] }) {
	return (
		<div className="relative border border-[#1c1c1c1a] bg-white">
			{(
				[
					'-left-[7px] -top-[7px]',
					'-right-[7px] -top-[7px]',
					'-bottom-[7px] -left-[7px]',
					'-bottom-[7px] -right-[7px]',
				] as const
			).map((pos) => (
				<span key={pos} className={`pointer-events-none absolute ${pos}`}>
					<PlusCorner />
				</span>
			))}
			<div className="divide-y divide-[#1c1c1c1a]">
				{items.map((item) => (
					<details key={item.q} className="group">
						<summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-[#1c1c1c05] sm:gap-4 sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
							<span className="text-[15px] font-medium leading-snug text-[#1c1c1c] md:text-base">
								{item.q}
							</span>
							<ChevronIcon />
						</summary>
						<div className="px-4 pb-4 sm:px-6 sm:pb-5">
							<Body>{item.a}</Body>
						</div>
					</details>
				))}
			</div>
		</div>
	);
}

export function EndCta({
	title,
	body,
	ctas,
}: {
	title: string;
	body?: string;
	ctas: readonly Cta[];
}) {
	return (
		<section className="bg-white py-16 md:py-20">
			<div className="mx-auto flex max-w-[640px] flex-col items-center px-4 text-center sm:px-6 md:px-10">
				<h2 className="mb-4 text-balance text-2xl font-medium tracking-[-0.02em] text-[#1c1c1c] md:text-3xl">
					{title}
				</h2>
				{body ? (
					<p className="text-base leading-relaxed text-[#1c1c1c99]">{body}</p>
				) : null}
				<Ctas ctas={ctas} />
			</div>
		</section>
	);
}

export function JsonLd({ data }: { data: unknown }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}

/** WebPage + breadcrumb (+ FAQPage) for one gateway page. */
export function pageJsonLd({
	path,
	title,
	description,
	crumbs,
	faq,
}: {
	path: string;
	title: string;
	description: string;
	crumbs: readonly { name: string; path: string }[];
	faq?: readonly FaqItem[];
}) {
	const url = `${SITE_URL}${path}`;
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebPage',
				'@id': `${url}#webpage`,
				url,
				name: title,
				description,
				isPartOf: { '@type': 'WebSite', name: 'Corsair', url: SITE_URL },
				breadcrumb: { '@id': `${url}#breadcrumb` },
			},
			{
				'@type': 'BreadcrumbList',
				'@id': `${url}#breadcrumb`,
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Corsair', item: SITE_URL },
					...crumbs.map((c, i) => ({
						'@type': 'ListItem',
						position: i + 2,
						name: c.name,
						item: `${SITE_URL}${c.path}`,
					})),
				],
			},
			...(faq?.length
				? [
						{
							'@type': 'FAQPage',
							'@id': `${url}#faq`,
							mainEntity: faq.map((f) => ({
								'@type': 'Question',
								name: f.q,
								acceptedAnswer: { '@type': 'Answer', text: f.a },
							})),
						},
					]
				: []),
		],
	};
}
