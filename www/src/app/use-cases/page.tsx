import type { Metadata } from 'next';
import Link from 'next/link';

import { UseCaseCard } from '@/components/use-cases/use-case-parts';
import { escapeJsonLd } from '@/lib/integration-seo';
import { socialMetadata } from '@/lib/social-metadata';
import { buildUseCaseHubJsonLd } from '@/lib/use-case-seo';
import { categorySlug, USE_CASES, useCasesByCategory } from '@/lib/use-cases';

const TITLE = 'AI Agent Use Cases for Slack, Gmail and GitHub';
const DESCRIPTION =
	'Prompts that work with Claude, ChatGPT and Cursor once your apps are connected in Corsair: Slack reminders, morning briefings, GitHub to Linear, sales call prep and more.';

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: '/use-cases' },
	...socialMetadata({
		title: TITLE,
		description: DESCRIPTION,
		path: '/use-cases',
	}),
};

export default function UseCasesPage() {
	const groups = useCasesByCategory();

	return (
		<main className="pb-20">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: escapeJsonLd(
						JSON.stringify(buildUseCaseHubJsonLd(USE_CASES)),
					),
				}}
			/>
			<section className="pt-10 pb-8 md:pt-14">
				<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
					<h1 className="max-w-3xl font-[family-name:var(--landing-font-serif)] text-[clamp(2rem,4.5vw,3rem)] font-light leading-[1.08] tracking-[-0.03em] text-[#1c1c1c]">
						What your agent can do with your apps
					</h1>
					<p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#1c1c1c99]">
						One page per job: the prompt to paste into Claude, ChatGPT or
						Cursor, the apps it uses, and the Corsair tools it calls. Prompts
						that say when to run become routines that Corsair runs for you.
					</p>
					<nav
						aria-label="Use case categories"
						className="mt-6 flex flex-wrap gap-2"
					>
						{groups.map(({ category }) => (
							<a
								key={category}
								href={`#${categorySlug(category)}`}
								className="rounded-full border border-[#1c1c1c]/10 bg-white px-3 py-1 text-[13px] font-medium text-[#1c1c1c99] no-underline transition-colors hover:border-[#1c1c1c]/25 hover:text-[#1c1c1c]"
							>
								{category}
							</a>
						))}
					</nav>
				</div>
			</section>

			{groups.map(({ category, useCases }) => (
				<section
					key={category}
					id={categorySlug(category)}
					className="scroll-mt-24 pt-6 pb-4"
				>
					<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
						<h2 className="border-b border-[#1c1c1c]/10 pb-3 font-[family-name:var(--landing-font-serif)] text-[clamp(1.35rem,2.6vw,1.75rem)] font-light tracking-[-0.02em] text-[#1c1c1c]">
							{category}
						</h2>
						<div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{useCases.map((useCase) => (
								<UseCaseCard key={useCase.slug} useCase={useCase} />
							))}
						</div>
					</div>
				</section>
			))}

			<section className="pt-10">
				<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
					<div className="rounded-lg border border-[#1c1c1c]/10 bg-white px-6 py-6 sm:px-8">
						<p className="text-lg font-medium text-[#1c1c1c]">
							Your job isn&apos;t here?
						</p>
						<p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-[#1c1c1c99]">
							Corsair connects 400+ apps. Describe the job to your agent in
							plain words, the same way these prompts do.{' '}
							<Link
								href="/integrations"
								className="font-medium text-[#4a38f5] no-underline hover:underline"
							>
								Browse integrations
							</Link>
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}
