import type { Metadata } from 'next';
import Link from 'next/link';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import type { BuiltWithProject } from '@/lib/built-with';
import {
	BUILT_WITH_REPO,
	BUILT_WITH_SUBMIT,
	builtWithAppName,
	builtWithApps,
	builtWithByCategory,
	builtWithCategorySlug,
	builtWithMoreApps,
	getBuiltWith,
} from '@/lib/built-with';
import { escapeJsonLd } from '@/lib/integration-seo';
import { socialMetadata } from '@/lib/social-metadata';

// Same window as the fetch in lib/built-with.ts (BUILT_WITH_REVALIDATE); Next needs a literal here.
export const revalidate = 3600;

const PATH = '/built-with';
const TITLE = 'Built with Corsair: apps and agents people made';

export async function generateMetadata(): Promise<Metadata> {
	const data = await getBuiltWith();
	const count = data?.projects.length;
	const description = `${count ? `${count} apps` : 'Apps'}, agents and tools built on Corsair by developers outside the team: Gmail and Calendar assistants, workspaces and team automation, each with its code.`;
	return {
		title: TITLE,
		description,
		alternates: { canonical: PATH },
		...socialMetadata({ title: TITLE, description, path: PATH }),
	};
}

function ProjectCard({ project }: { project: BuiltWithProject }) {
	const apps = builtWithApps(project);
	const shown = apps.slice(0, 5);
	const more = apps.length - shown.length + builtWithMoreApps(project);
	const repoUrl = `https://github.com/${project.repo}`;
	const isRepo = project.url.replace(/\/$/, '') === repoUrl;
	return (
		<article className="flex flex-col gap-3 rounded-lg border border-[#1c1c1c]/10 bg-white p-5">
			<div className="flex items-center justify-between gap-3">
				<span className="inline-flex items-center gap-1.5">
					{shown.map((id) => (
						<IntegrationLogo
							key={id}
							id={id}
							displayName={builtWithAppName(id)}
							size={20}
							className="rounded-[4px]"
						/>
					))}
					{more > 0 ? (
						<span className="text-[12px] text-[#1c1c1c66]">+{more}</span>
					) : null}
					<span className="sr-only">
						Uses {apps.map(builtWithAppName).join(', ')}
					</span>
				</span>
				<span className="font-[family-name:var(--landing-font-mono)] text-[11px] uppercase tracking-wider text-[#1c1c1c66]">
					{project.hosted ? 'Live app' : 'Open source'}
				</span>
			</div>
			<h3 className="text-[17px] font-medium tracking-[-0.01em] text-[#1c1c1c]">
				<a
					href={project.url}
					target="_blank"
					rel="ugc noopener noreferrer"
					className="text-[#1c1c1c] no-underline hover:underline"
				>
					{project.name}
					<span className="sr-only"> (opens in a new tab)</span>
				</a>
			</h3>
			<p className="flex-1 text-[14px] leading-relaxed text-[#1c1c1c99]">
				{project.description}
			</p>
			<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-[#1c1c1c80]">
				<span>{project.author}</span>
				{project.event ? (
					<span className="rounded-full border border-[#4a38f5]/20 bg-[#4a38f5]/[0.06] px-2 py-0.5 text-[#3d2ee0]">
						{project.event}
					</span>
				) : null}
				{isRepo ? null : (
					<a
						href={repoUrl}
						target="_blank"
						rel="ugc noopener noreferrer"
						className="ml-auto font-medium text-[#4a38f5] no-underline hover:underline"
					>
						Code
						<span className="sr-only">
							{' '}
							for {project.name} (opens in a new tab)
						</span>
					</a>
				)}
			</div>
		</article>
	);
}

export default async function BuiltWithPage() {
	const data = await getBuiltWith();
	const groups = data ? builtWithByCategory(data) : [];
	const live = data?.projects.filter((p) => p.hosted).length ?? 0;

	const jsonLd = data && {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Built with Corsair',
		url: `https://corsair.dev${PATH}`,
		isPartOf: {
			'@type': 'WebSite',
			name: 'Corsair',
			url: 'https://corsair.dev',
		},
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: data.projects.length,
			itemListElement: data.projects.map((p, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'SoftwareSourceCode',
					name: p.name,
					description: p.description,
					url: p.url,
					codeRepository: `https://github.com/${p.repo}`,
				},
			})),
		},
	};

	return (
		<main className="pb-20">
			{jsonLd ? (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: escapeJsonLd(JSON.stringify(jsonLd)),
					}}
				/>
			) : null}
			<section className="pt-10 pb-8 md:pt-14">
				<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
					<h1 className="max-w-3xl font-[family-name:var(--landing-font-serif)] text-[clamp(2rem,4.5vw,3rem)] font-light leading-[1.08] tracking-[-0.03em] text-[#1c1c1c]">
						Built with Corsair
					</h1>
					<p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#1c1c1c99]">
						Apps, agents and tools that developers outside the Corsair team
						built on Corsair. Each one links to its code, so you can see how it
						connects Gmail, Calendar, Slack, GitHub and the rest. Many came out
						of ChaiCode&apos;s Corsair hackathon in June 2026.
					</p>
					{data ? (
						<p className="mt-4 font-[family-name:var(--landing-font-mono)] text-[13px] text-[#1c1c1c80]">
							{data.projects.length} projects · {live} live apps ·{' '}
							<a
								href={BUILT_WITH_REPO}
								target="_blank"
								rel="noopener noreferrer"
								className="text-[#4a38f5] no-underline hover:underline"
							>
								the list on GitHub
							</a>
						</p>
					) : null}
					{groups.length > 1 ? (
						<nav
							aria-label="Project categories"
							className="mt-6 flex flex-wrap gap-2"
						>
							{groups.map(({ category, projects }) => (
								<a
									key={category.id}
									href={`#${builtWithCategorySlug(category.id)}`}
									className="rounded-full border border-[#1c1c1c]/10 bg-white px-3 py-1 text-[13px] font-medium text-[#1c1c1c99] no-underline transition-colors hover:border-[#1c1c1c]/25 hover:text-[#1c1c1c]"
								>
									{category.title}{' '}
									<span className="text-[#1c1c1c66]">{projects.length}</span>
								</a>
							))}
						</nav>
					) : null}
				</div>
			</section>

			{data ? (
				groups.map(({ category, projects }) => (
					<section
						key={category.id}
						id={builtWithCategorySlug(category.id)}
						className="scroll-mt-24 pt-6 pb-4"
					>
						<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
							<div className="border-b border-[#1c1c1c]/10 pb-3">
								<h2 className="font-[family-name:var(--landing-font-serif)] text-[clamp(1.35rem,2.6vw,1.75rem)] font-light tracking-[-0.02em] text-[#1c1c1c]">
									{category.title}
								</h2>
								{category.blurb ? (
									<p className="mt-1 text-[14px] text-[#1c1c1c80]">
										{category.blurb}
									</p>
								) : null}
							</div>
							<div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{projects.map((project) => (
									<ProjectCard key={project.id} project={project} />
								))}
							</div>
						</div>
					</section>
				))
			) : (
				<section className="pt-4">
					<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
						<p className="text-[15px] text-[#1c1c1c99]">
							The list couldn&apos;t load just now. It&apos;s on GitHub at{' '}
							<a href={BUILT_WITH_REPO} className="font-medium text-[#4a38f5]">
								corsairdev/awesome-corsair
							</a>
							.
						</p>
					</div>
				</section>
			)}

			<section className="pt-10">
				<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
					<div className="rounded-lg border border-[#1c1c1c]/10 bg-white px-6 py-6 sm:px-8">
						<p className="text-lg font-medium text-[#1c1c1c]">
							Built something on Corsair?
						</p>
						<p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-[#1c1c1c99]">
							Add it with one pull request to the list on GitHub. A bot also
							looks for new projects every three days, and a person checks each
							one before it goes up.{' '}
							<a
								href={BUILT_WITH_SUBMIT}
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium text-[#4a38f5] no-underline hover:underline"
							>
								How to submit
							</a>
							{' · '}
							<Link
								href="/use-cases"
								className="font-medium text-[#4a38f5] no-underline hover:underline"
							>
								Ideas for what to build
							</Link>
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}
