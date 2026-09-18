import { LightningIcon, PlugsIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import type { ComboData } from '@/lib/combined-integrations';

function AppCounts({
	name,
	api,
	webhooks,
}: {
	name: string;
	api: number;
	webhooks: number;
}) {
	return (
		<span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 font-[family-name:var(--landing-font-mono)] text-[11px] text-[#1c1c1c66]">
			<span className="font-semibold text-[#1c1c1c]">{name}</span>
			<span className="inline-flex items-center gap-1">
				<PlugsIcon size={12} aria-hidden />
				{api} {api === 1 ? 'operation' : 'operations'}
			</span>
			<span className="inline-flex items-center gap-1">
				<LightningIcon size={12} aria-hidden />
				{webhooks} {webhooks === 1 ? 'webhook' : 'webhooks'}
			</span>
		</span>
	);
}

export function ComboHero({ combo }: { combo: ComboData }) {
	const countsA =
		combo.slugA === 'slack'
			? { api: combo.counts.slackOps, webhooks: combo.counts.slackTriggers }
			: { api: combo.counts.linearOps, webhooks: combo.counts.linearTriggers };
	const countsB =
		combo.slugB === 'slack'
			? { api: combo.counts.slackOps, webhooks: combo.counts.slackTriggers }
			: { api: combo.counts.linearOps, webhooks: combo.counts.linearTriggers };

	return (
		<section className="pb-8 pt-8 md:pb-10 md:pt-10">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<nav
					aria-label="Breadcrumb"
					className="mb-8 flex flex-wrap items-center gap-1.5 font-[family-name:var(--landing-font-mono)] text-[11px] text-[#1c1c1c66]"
				>
					<Link
						href="/integrations"
						className="no-underline transition-colors hover:text-[#1c1c1c]"
					>
						Integrations
					</Link>
					<span aria-hidden>/</span>
					<Link
						href={`/integrations/${combo.slugA}`}
						className="no-underline transition-colors hover:text-[#1c1c1c]"
					>
						{combo.displayA}
					</Link>
					<span aria-hidden>/</span>
					<span aria-current="page" className="text-[#1c1c1c]">
						{combo.title}
					</span>
				</nav>

				<div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-5">
					<div className="flex shrink-0 items-center gap-4" aria-hidden>
						<IntegrationLogo
							id={combo.slugA}
							displayName={combo.displayA}
							size={64}
							className="rounded-md shadow-[0_1px_2px_rgba(28,28,28,0.06)]"
						/>
						<IntegrationLogo
							id={combo.slugB}
							displayName={combo.displayB}
							size={64}
							className="rounded-md shadow-[0_1px_2px_rgba(28,28,28,0.06)]"
						/>
					</div>
					<div className="min-w-0 flex-1">
						<h1 className="font-[family-name:var(--landing-font-serif)] text-[clamp(2rem,4vw,2.75rem)] font-light leading-[1.08] tracking-[-0.03em] text-[#1c1c1c]">
							{combo.title}
						</h1>
						<div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
							<AppCounts
								name={combo.displayA}
								api={countsA.api}
								webhooks={countsA.webhooks}
							/>
							<AppCounts
								name={combo.displayB}
								api={countsB.api}
								webhooks={countsB.webhooks}
							/>
						</div>
						<p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#1c1c1c99]">
							{combo.introA}
						</p>
						<p className="mt-3 max-w-2xl text-lg leading-relaxed text-[#1c1c1c99]">
							{combo.introB}
						</p>
						<div className="mt-6 flex flex-wrap gap-3">
							<a
								href="#builder"
								className="rounded-sm bg-[#1c1c1c] px-4 py-2 text-sm font-medium text-white no-underline transition-colors hover:bg-[#4a38f5]"
							>
								Build a workflow
							</a>
							<a
								href="#workflows"
								className="rounded-sm border border-[#1c1c1c]/15 bg-white px-4 py-2 text-sm font-medium text-[#1c1c1c] no-underline transition-colors hover:border-[#1c1c1c]/30"
							>
								See popular workflows
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
