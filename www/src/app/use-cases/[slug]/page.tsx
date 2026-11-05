import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { IntegrationFaqAccordion } from '@/components/integrations/detail/integration-faq-accordion';
import { IntegrationRiskChip } from '@/components/integrations/detail/integration-risk-chip';
import { IntegrationLogo } from '@/components/integrations/integration-logo';
import { CopyableCodeSnippet } from '@/components/landing/copyable-code-snippet';
import {
	UseCaseCard,
	UseCasePromptBox,
} from '@/components/use-cases/use-case-parts';
import type { IntegrationCapabilityAction } from '@/lib/integration-page.types';
import { escapeJsonLd } from '@/lib/integration-seo';
import { hubMcpConnectUrl, MCP_URL } from '@/lib/site-links';
import { socialMetadata } from '@/lib/social-metadata';
import { buildUseCaseJsonLd } from '@/lib/use-case-seo';
import type { UseCase } from '@/lib/use-cases';
import {
	categorySlug,
	getUseCase,
	USE_CASES,
	useCaseAppName,
} from '@/lib/use-cases';
import { getCatalogIntegrationById } from '@/server/catalog-integration-cache';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
	return USE_CASES.map((useCase) => ({ slug: useCase.slug }));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const useCase = getUseCase(slug);
	if (!useCase) return { title: 'Use case not found' };

	return {
		title: useCase.metaTitle,
		description: useCase.summary,
		alternates: { canonical: `/use-cases/${slug}` },
		...socialMetadata({
			title: `${useCase.metaTitle} | Corsair`,
			description: useCase.summary,
			path: `/use-cases/${slug}`,
		}),
	};
}

/** Catalog rows for the tools a use case calls, keyed "app:id". */
async function catalogActions(useCase: UseCase) {
	const entries = await Promise.all(
		useCase.apps.map(
			async (app) => [app, await getCatalogIntegrationById(app)] as const,
		),
	);
	const actions = new Map<string, IntegrationCapabilityAction>();
	for (const [app, integration] of entries) {
		for (const group of integration?.operations ?? []) {
			for (const action of group.actions)
				actions.set(`${app}:${action.id}`, action);
		}
	}
	return actions;
}

/** "A", "A and B", "A, B and C". */
function listJoin(items: string[]): string {
	if (items.length <= 1) return items.join('');
	return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
}

function relatedUseCases(useCase: UseCase): UseCase[] {
	return USE_CASES.filter(
		(other) =>
			other.slug !== useCase.slug &&
			other.apps.some((app) => useCase.apps.includes(app)),
	).slice(0, 3);
}

function SectionHeading({ children }: { children: ReactNode }) {
	return (
		<h2 className="font-[family-name:var(--landing-font-serif)] text-[clamp(1.4rem,2.8vw,1.85rem)] font-light tracking-[-0.03em] text-[#1c1c1c]">
			{children}
		</h2>
	);
}

function Step({
	number,
	title,
	children,
}: {
	number: number;
	title: string;
	children: ReactNode;
}) {
	return (
		<li className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3">
			<span className="mt-0.5 flex size-7 items-center justify-center rounded-full border border-[#1c1c1c1a] bg-white font-[family-name:var(--landing-font-mono)] text-xs text-[#1c1c1c99]">
				{number}
			</span>
			<div className="min-w-0">
				<h3 className="text-base font-medium text-[#1c1c1c]">{title}</h3>
				<div className="mt-1.5 text-[15px] leading-relaxed text-[#1c1c1c99]">
					{children}
				</div>
			</div>
		</li>
	);
}

export default async function UseCaseRoute({ params }: PageProps) {
	const { slug } = await params;
	const useCase = getUseCase(slug);
	if (!useCase) notFound();

	const actions = await catalogActions(useCase);
	const related = relatedUseCases(useCase);
	const appNames = useCase.apps.map(useCaseAppName);
	// ChatGPT personal plans only get a custom server's read tools, so say so
	// when the prompt writes or sets up a routine (update_routine is a write).
	// A tool missing from the catalog counts as a write, as the runtime does.
	const needsWrites =
		Boolean(useCase.runs) ||
		useCase.operations.some(
			(operation) =>
				(actions.get(`${operation.app}:${operation.id}`)?.riskLevel ??
					'write') !== 'read',
		);

	return (
		<main className="pb-16">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: escapeJsonLd(JSON.stringify(buildUseCaseJsonLd(useCase))),
				}}
			/>

			<section className="pt-8 pb-8 md:pt-10">
				<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
					<nav
						aria-label="Breadcrumb"
						className="mb-8 flex flex-wrap items-center gap-1.5 font-[family-name:var(--landing-font-mono)] text-[11px] text-[#1c1c1c66]"
					>
						<Link
							href="/use-cases"
							className="text-[#1c1c1c66] no-underline hover:text-[#1c1c1c]"
						>
							Use cases
						</Link>
						<span aria-hidden>/</span>
						<Link
							href={`/use-cases#${categorySlug(useCase.category)}`}
							className="text-[#1c1c1c66] no-underline hover:text-[#1c1c1c]"
						>
							{useCase.category}
						</Link>
					</nav>

					<h1 className="max-w-3xl font-[family-name:var(--landing-font-serif)] text-[clamp(1.9rem,4vw,2.75rem)] font-light leading-[1.1] tracking-[-0.03em] text-[#1c1c1c]">
						{useCase.title}
					</h1>
					<p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#1c1c1c99]">
						{useCase.summary}
					</p>
					<ul className="mt-5 flex flex-wrap gap-2">
						{useCase.apps.map((app) => (
							<li key={app}>
								<Link
									href={`/integrations/${app}`}
									className="inline-flex items-center gap-2 rounded-full border border-[#1c1c1c]/10 bg-white py-1 pr-3 pl-1.5 text-[13px] font-medium text-[#1c1c1c] no-underline transition-colors hover:border-[#1c1c1c]/25"
								>
									<IntegrationLogo
										id={app}
										displayName={useCaseAppName(app)}
										size={20}
										className="rounded-full"
									/>
									{useCaseAppName(app)}
								</Link>
							</li>
						))}
					</ul>

					<UseCasePromptBox useCase={useCase} className="mt-8" />
				</div>
			</section>

			<section className="pt-6 pb-4">
				<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
					<SectionHeading>How to run it</SectionHeading>
					<ol className="mt-6 space-y-7">
						<Step number={1} title={`Connect ${listJoin(appNames)} in Corsair`}>
							<p>
								Sign in to each app once. Corsair keeps the credentials and
								makes the calls, so your agent never sees a password or key.
							</p>
							<div className="mt-3 flex flex-wrap gap-2">
								{useCase.apps.map((app) => (
									<a
										key={app}
										href={hubMcpConnectUrl(app)}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 rounded-md border border-[#1c1c1c]/12 bg-white px-3 py-1.5 text-[13px] font-medium text-[#1c1c1c] no-underline transition-colors hover:border-[#4a38f5]/40 hover:text-[#4a38f5]"
									>
										<IntegrationLogo
											id={app}
											displayName={useCaseAppName(app)}
											size={16}
											className="rounded-[3px]"
										/>
										Connect {useCaseAppName(app)}
									</a>
								))}
							</div>
						</Step>
						<Step number={2} title="Add Corsair's MCP server to your agent">
							<p>
								Claude, ChatGPT, Cursor and Claude Code use the same address:
							</p>
							<CopyableCodeSnippet code={MCP_URL} className="mt-2 max-w-md" />
							<p className="mt-2 text-sm">
								<Link
									href={`/integrations/${useCase.apps[0]}#connect`}
									className="font-medium text-[#4a38f5] no-underline hover:underline"
								>
									Steps for each client
								</Link>
							</p>
							{needsWrites ? (
								<p className="mt-2 text-sm">
									ChatGPT personal plans get read tools only, and this prompt{' '}
									{useCase.runs
										? 'sets up a routine'
										: 'changes things in your apps'}
									. On those plans, use Claude, Cursor or Claude Code instead.
								</p>
							) : null}
						</Step>
						<Step number={3} title="Paste the prompt">
							<p>
								{useCase.runs
									? `Your agent hands it to Corsair as a routine. Corsair builds and tests it, then runs it on its own: ${useCase.runs.charAt(0).toLowerCase()}${useCase.runs.slice(1)}.`
									: 'Your agent runs it right away and tells you what it did.'}{' '}
								Change the names in it (channels, repos, teams, time zone) to
								your own.
							</p>
						</Step>
					</ol>
				</div>
			</section>

			<section className="pt-10 pb-4">
				<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
					<SectionHeading>Why the prompt is written this way</SectionHeading>
					<div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
						{useCase.notes.map((note) => (
							<div
								key={note.title}
								className="rounded-md border border-[#1c1c1c]/10 bg-white px-4 py-4"
							>
								<h3 className="text-[15px] font-medium text-[#1c1c1c]">
									{note.title}
								</h3>
								<p className="mt-1.5 text-[14px] leading-relaxed text-[#1c1c1c99]">
									{note.body}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="pt-10 pb-4">
				<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
					<SectionHeading>Tools it calls</SectionHeading>
					<p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#1c1c1c99]">
						The Corsair tools your agent uses for this job. Writes follow your
						link&apos;s mode: on a Strict link, each one waits for your
						approval.
					</p>
					<div className="mt-5 overflow-x-auto rounded-md border border-[#1c1c1c]/10 bg-white">
						<table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
							<thead>
								<tr className="border-b border-[#1c1c1c]/10 text-[12px] text-[#1c1c1c99]">
									<th scope="col" className="px-4 py-2.5 font-medium">
										App
									</th>
									<th scope="col" className="px-4 py-2.5 font-medium">
										Tool
									</th>
									<th scope="col" className="px-4 py-2.5 font-medium">
										Used to
									</th>
									<th scope="col" className="px-4 py-2.5 font-medium">
										Access
									</th>
								</tr>
							</thead>
							<tbody>
								{useCase.operations.map((operation) => {
									const action = actions.get(
										`${operation.app}:${operation.id}`,
									);
									return (
										<tr
											key={`${operation.app}:${operation.id}`}
											className="border-b border-[#1c1c1c]/8 last:border-b-0"
										>
											<td className="px-4 py-3 align-top whitespace-nowrap text-[#1c1c1c]">
												<Link
													href={`/integrations/${operation.app}`}
													className="text-[#1c1c1c] no-underline hover:text-[#4a38f5]"
												>
													{useCaseAppName(operation.app)}
												</Link>
											</td>
											<td className="px-4 py-3 align-top">
												<span className="block text-[#1c1c1c]">
													{action?.label ?? operation.id}
												</span>
												<span className="font-[family-name:var(--landing-font-mono)] text-[11px] text-[#1c1c1c66]">
													{operation.id}
												</span>
											</td>
											<td className="px-4 py-3 align-top text-[#1c1c1c99]">
												{operation.why}
											</td>
											<td className="px-4 py-3 align-top">
												{action?.riskLevel ? (
													<IntegrationRiskChip riskLevel={action.riskLevel} />
												) : null}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			<section className="pt-10 pb-4">
				<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
					<SectionHeading>Good to know</SectionHeading>
					<ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[#1c1c1c99] marker:text-[#1c1c1c40]">
						{useCase.limits.map((limit) => (
							<li key={limit}>{limit}</li>
						))}
					</ul>
				</div>
			</section>

			{related.length > 0 ? (
				<section className="pt-10 pb-6">
					<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
						<SectionHeading>More use cases</SectionHeading>
						<div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{related.map((other) => (
								<UseCaseCard key={other.slug} useCase={other} />
							))}
						</div>
					</div>
				</section>
			) : null}

			<div className="mt-6">
				<IntegrationFaqAccordion faqs={useCase.faqs} heading="Questions" />
			</div>
		</main>
	);
}
