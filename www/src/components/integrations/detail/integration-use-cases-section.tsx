import Link from 'next/link';

import { UseCaseCard } from '@/components/use-cases/use-case-parts';
import { useCasesForApp } from '@/lib/use-cases';

const MAX_SHOWN = 4;

/** "Try these with <App>": the use cases that involve this app, as prompts. */
export function IntegrationUseCasesSection({
	integrationId,
	displayName,
}: {
	integrationId: string;
	displayName: string;
}) {
	const useCases = useCasesForApp(integrationId).slice(0, MAX_SHOWN);
	if (useCases.length === 0) return null;

	return (
		<section id="use-cases" className="scroll-mt-24 pt-8 pb-2 md:pt-10">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
					<h2 className="font-[family-name:var(--landing-font-serif)] text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.03em] text-[#1c1c1c]">
						Try these with {displayName}
					</h2>
					<Link
						href="/use-cases"
						className="text-[14px] font-medium text-[#4a38f5] no-underline hover:underline"
					>
						All use cases
					</Link>
				</div>
				<p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#1c1c1c99]">
					Connect {displayName}, then paste a prompt into Claude, ChatGPT or
					Cursor. A prompt that says when to run becomes a routine Corsair runs
					for you.
				</p>
				<div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
					{useCases.map((useCase) => (
						<UseCaseCard key={useCase.slug} useCase={useCase} showPrompt />
					))}
				</div>
			</div>
		</section>
	);
}
