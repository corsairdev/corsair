import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import type { Cta } from '@/components/gateway/gateway-ui';
import {
	Body,
	Card,
	CardGrid,
	EndCta,
	Faq,
	H3,
	JsonLd,
	PageHero,
	pageJsonLd,
	Section,
	textLink,
} from '@/components/gateway/gateway-ui';
import type { GatewayComparison } from '@/content/compare/gateway';
import {
	CHECKED,
	CHECKED_LABEL,
	COMPARISONS,
	compareLogo,
	comparisonBySlug,
	vsName,
} from '@/content/compare/gateway';
import { CLAIM_HREF } from '@/lib/site-links';
import { socialMetadata } from '@/lib/social-metadata';

/**
 * One "Corsair vs <product>" page for the MCP gateway (moved from
 * lug.dev/compare). The page under app/compare/<slug> passes its slug; the
 * facts live in content/compare/gateway.ts. compare/layout.tsx supplies the
 * menu and footer.
 */

export function comparisonMetadata(slug: string): Metadata {
	const x = mustFind(slug);
	const path = `/compare/${x.slug}`;
	return {
		title: x.metaTitle,
		description: x.metaDescription,
		alternates: { canonical: path },
		...socialMetadata({
			title: x.metaTitle,
			description: x.metaDescription,
			path,
		}),
	};
}

function mustFind(slug: string): GatewayComparison {
	const x = comparisonBySlug(slug);
	if (!x) throw new Error(`No comparison for /compare/${slug}`);
	return x;
}

const mono = 'font-[family-name:var(--landing-font-mono)]';

/** "Facts checked 20 November 2026": a pill with a green dot. */
export function CheckedBadge({ children }: { children: ReactNode }) {
	return (
		<p
			className={`mt-6 inline-flex items-center gap-2 rounded-full border border-[#1c1c1c1a] bg-white px-3 py-1.5 text-xs text-[#1c1c1c99] ${mono}`}
		>
			<span
				aria-hidden
				className="size-[7px] shrink-0 rounded-full bg-[#16a34a]"
			/>
			<span>{children}</span>
		</p>
	);
}

export function CompareLogo({
	src,
	size = 22,
}: {
	src: string;
	size?: number;
}) {
	// A 64 px favicon from public/compare-logos; next/image adds nothing.
	return (
		<img
			src={src}
			alt=""
			width={size}
			height={size}
			loading="lazy"
			decoding="async"
			className="shrink-0 rounded-md border border-[#1c1c1c14] bg-white object-contain p-0.5"
			style={{ width: size, height: size }}
		/>
	);
}

/** The pills linking to every other comparison, Nango included. */
export function OtherComparisons({ current }: { current?: string }) {
	const links = [
		...COMPARISONS.map((c) => ({
			href: `/compare/${c.slug}`,
			label: `Corsair vs ${vsName(c)}`,
			slug: c.slug,
		})),
		{ href: '/compare/nango', label: 'Corsair vs Nango', slug: 'nango' },
	].filter((l) => l.slug !== current);
	return (
		<nav aria-label="Other comparisons" className="mt-6 flex flex-wrap gap-2">
			{links.map((l) => (
				<a
					key={l.href}
					href={l.href}
					className="inline-flex h-9 items-center rounded-full border border-[#1c1c1c1a] bg-white px-4 text-sm text-[#1c1c1c] no-underline transition-colors hover:border-[#1c1c1c40]"
				>
					{l.label}
				</a>
			))}
		</nav>
	);
}

function CompareTable({ x }: { x: GatewayComparison }) {
	const cell = 'px-5 py-3.5 align-top';
	const stack = 'max-md:block max-md:w-auto max-md:px-0 max-md:py-1';
	const label =
		'max-md:before:block max-md:before:text-xs max-md:before:font-[family-name:var(--landing-font-mono)]';
	return (
		<div className="overflow-hidden border border-[#1c1c1c1a] bg-white">
			<table className="w-full border-collapse text-left text-[14.5px] leading-[1.55]">
				<thead className="max-md:hidden">
					<tr>
						<th scope="col" className={`${cell} w-[22%]`}>
							<span className="sr-only">What</span>
						</th>
						<th
							scope="col"
							className={`${cell} w-[39%] text-xs font-medium text-[#4a38f5] ${mono}`}
						>
							Corsair
						</th>
						<th
							scope="col"
							className={`${cell} w-[39%] text-xs font-medium text-[#1c1c1c99] ${mono}`}
						>
							<span className="inline-flex items-center gap-2">
								<CompareLogo src={compareLogo(x.slug)} size={18} />
								{x.name}
							</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{x.rows.map((r) => (
						<tr
							key={r.label}
							className="border-t border-[#1c1c1c1a] max-md:block max-md:px-4 max-md:py-3 max-md:first:border-t-0"
						>
							<th
								scope="row"
								className={`${cell} ${stack} font-medium text-[#1c1c1c]`}
							>
								{r.label}
							</th>
							<td
								className={`${cell} ${stack} ${label} text-[#1c1c1c] max-md:before:text-[#4a38f5] max-md:before:content-['Corsair']`}
							>
								{r.corsair}
							</td>
							<td
								data-them={x.name}
								className={`${cell} ${stack} ${label} text-[#1c1c1c99] max-md:before:content-[attr(data-them)]`}
							>
								{r.them}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function PickList({ items }: { items: readonly string[] }) {
	return (
		<ul className="flex list-disc flex-col gap-2 pl-5 text-[15px] leading-[1.6] text-[#1c1c1c99] marker:text-[#4a38f5]">
			{items.map((p) => (
				<li key={p}>{p}</li>
			))}
		</ul>
	);
}

export function SourcesList({
	sources,
}: {
	sources: readonly { label: string; url: string }[];
}) {
	const link =
		'text-[#1c1c1c99] underline decoration-[#1c1c1c40] underline-offset-[3px] hover:text-[#1c1c1c]';
	return (
		<ol className="mt-4 flex list-decimal flex-col gap-1.5 pl-5 text-sm text-[#1c1c1c99]">
			{sources.map((s) => (
				<li key={s.url}>
					<a
						href={s.url}
						target="_blank"
						rel="noopener noreferrer"
						className={link}
					>
						{s.label}
						<span className="sr-only"> (opens in a new tab)</span>
					</a>
				</li>
			))}
			<li>
				<a href="/pricing" className={link}>
					Corsair pricing
				</a>
			</li>
			<li>
				<a href="/llms.txt" className={link}>
					What Corsair does (llms.txt)
				</a>
			</li>
		</ol>
	);
}

export function GatewayComparisonPage({
	slug,
	heroNote,
	children,
	endCtas,
}: {
	slug: string;
	/** A line under the hero, such as a jump link to a later section. */
	heroNote?: ReactNode;
	/** Sections only this page has, shown after the note and before the questions. */
	children?: ReactNode;
	endCtas?: readonly Cta[];
}) {
	const x = mustFind(slug);
	const path = `/compare/${x.slug}`;
	const them = vsName(x);

	return (
		<main>
			<JsonLd
				data={pageJsonLd({
					path,
					title: x.metaTitle,
					description: x.metaDescription,
					crumbs: [
						{ name: 'Compare', path: '/compare' },
						{ name: `Corsair vs ${them}`, path },
					],
					faq: x.faq,
				})}
			/>

			<PageHero
				eyebrow={
					<>
						<a href="/compare" className="hover:text-[#1c1c1c]">
							Compare
						</a>{' '}
						/ Corsair vs {them}
					</>
				}
				title={
					<>
						Corsair <span className="text-[#1c1c1c66]">vs</span> {them}
					</>
				}
				lede={x.intro}
				ctas={[
					{ label: 'Try Corsair free', href: CLAIM_HREF },
					{ label: `${x.name}'s site`, href: x.url, external: true },
				]}
			>
				<div className="flex flex-col items-start gap-3">
					<CheckedBadge>
						Facts checked <time dateTime={CHECKED}>{CHECKED_LABEL}</time>,
						sources below
					</CheckedBadge>
					{heroNote}
				</div>
			</PageHero>

			<Section id="side-by-side" title="Side by side" width="wide">
				<CompareTable x={x} />
			</Section>

			<Section id="which" title="Which one to pick" width="wide">
				<CardGrid>
					<Card>
						<H3>Pick {x.name} if</H3>
						<PickList items={x.pickThem} />
					</Card>
					<Card highlight>
						<H3>Pick Corsair if</H3>
						<PickList items={x.pickCorsair} />
					</Card>
				</CardGrid>
			</Section>

			{x.note ? (
				<Section id="note" title={x.note.heading}>
					<div className="flex max-w-[70ch] flex-col gap-3">
						{x.note.body.map((p) => (
							<Body key={p}>{p}</Body>
						))}
					</div>
				</Section>
			) : null}

			{children}

			<Section id="questions" title="Questions">
				<Faq items={x.faq} />
			</Section>

			<Section id="sources" title="Sources">
				<Body>
					Checked {CHECKED_LABEL}. Prices and limits change; if something here
					is out of date, tell us at{' '}
					<a href="mailto:team@corsair.dev" className={textLink}>
						team@corsair.dev
					</a>{' '}
					and we&apos;ll fix it.
				</Body>
				<SourcesList sources={x.sources} />
				<OtherComparisons current={x.slug} />
			</Section>

			<EndCta
				title="One URL for every app and every agent."
				ctas={
					endCtas ?? [
						{ label: 'Claim your URL', href: CLAIM_HREF },
						{ label: 'All comparisons', href: '/compare' },
					]
				}
			/>
		</main>
	);
}
