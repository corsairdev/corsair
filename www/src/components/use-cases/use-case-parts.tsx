import Link from 'next/link';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import { CopyPromptButton } from '@/components/use-cases/copy-prompt-button';
import type { UseCase } from '@/lib/use-cases';
import { useCaseAppName } from '@/lib/use-cases';
import { cn } from '@/lib/utils';

export function UseCaseAppIcons({
	apps,
	size = 22,
}: {
	apps: string[];
	size?: number;
}) {
	return (
		<span className="inline-flex items-center gap-1.5">
			{apps.map((app) => (
				<IntegrationLogo
					key={app}
					id={app}
					displayName={useCaseAppName(app)}
					size={size}
					className="rounded-[4px]"
				/>
			))}
			<span className="sr-only">
				{apps.map((app) => useCaseAppName(app)).join(', ')}
			</span>
		</span>
	);
}

export function UseCaseRuns({ runs }: { runs: string }) {
	return (
		<span className="inline-flex items-center rounded-full border border-[#4a38f5]/20 bg-[#4a38f5]/[0.06] px-2.5 py-0.5 text-[12px] font-medium text-[#3d2ee0]">
			Runs on its own: {runs.charAt(0).toLowerCase()}
			{runs.slice(1)}
		</span>
	);
}

/** The prompt as the reader will paste it, with a copy button. */
export function UseCasePromptBox({
	useCase,
	className,
}: {
	useCase: Pick<UseCase, 'prompt' | 'runs'>;
	className?: string;
}) {
	return (
		<div
			className={cn(
				'rounded-lg border border-[#1c1c1c]/10 bg-white shadow-[0_8px_32px_rgba(28,28,28,0.05)]',
				className,
			)}
		>
			<p className="px-5 pt-5 text-[16px] leading-relaxed text-[#1c1c1c] sm:px-6 sm:pt-6">
				{useCase.prompt}
			</p>
			<div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#1c1c1c]/8 px-5 py-3 sm:px-6">
				{useCase.runs ? (
					<UseCaseRuns runs={useCase.runs} />
				) : (
					<span className="text-[12px] text-[#1c1c1c99]">
						Runs once, when you ask
					</span>
				)}
				<CopyPromptButton prompt={useCase.prompt} />
			</div>
		</div>
	);
}

/** A use case in a list: name, summary, apps, and a link to its page. */
export function UseCaseCard({
	useCase,
	showPrompt = false,
}: {
	useCase: UseCase;
	showPrompt?: boolean;
}) {
	return (
		<article className="flex h-full min-w-0 flex-col rounded-md border border-[#1c1c1c]/10 bg-white transition-colors hover:border-[#1c1c1c]/22">
			<div className="flex flex-1 flex-col px-4 pt-4 pb-3 sm:px-5">
				<div className="flex items-center justify-between gap-3">
					<UseCaseAppIcons apps={useCase.apps} />
					{useCase.runs ? (
						<span className="text-[12px] text-[#1c1c1c66]">{useCase.runs}</span>
					) : null}
				</div>
				<h3 className="mt-3 text-[15px] font-semibold leading-snug text-[#1c1c1c]">
					<Link
						href={`/use-cases/${useCase.slug}`}
						className="text-[#1c1c1c] no-underline hover:text-[#4a38f5]"
					>
						{useCase.name}
					</Link>
				</h3>
				{showPrompt ? (
					<p className="mt-2 line-clamp-4 text-[14px] leading-relaxed text-[#1c1c1c99]">
						&ldquo;{useCase.prompt}&rdquo;
					</p>
				) : (
					<p className="mt-1.5 text-[13px] leading-relaxed text-[#1c1c1c99]">
						{useCase.summary}
					</p>
				)}
			</div>
			<div className="flex items-center justify-between gap-3 border-t border-[#1c1c1c]/8 px-4 py-2.5 sm:px-5">
				<Link
					href={`/use-cases/${useCase.slug}`}
					className="text-[13px] font-medium text-[#4a38f5] no-underline hover:underline"
				>
					How it works
				</Link>
				{showPrompt ? <CopyPromptButton prompt={useCase.prompt} /> : null}
			</div>
		</article>
	);
}
