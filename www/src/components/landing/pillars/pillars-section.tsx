import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import {
	CONNECT_APPS,
	LINK_MODES,
	PILLARS,
	ROUTINE_EXAMPLE,
} from '@/lib/home-content';
import { cn } from '@/lib/utils';

function Visual({ id }: { id: (typeof PILLARS)[number]['id'] }): ReactNode {
	if (id === 'connect') {
		return (
			<ul className="flex flex-wrap gap-2" aria-label="Some of the apps">
				{CONNECT_APPS.map((app) => (
					<li
						key={app.id}
						className="flex items-center gap-1.5 rounded-md border border-[#1c1c1c]/10 bg-white px-2 py-1 text-[12px] font-medium text-[#1c1c1c]"
					>
						<IntegrationLogo
							id={app.id}
							displayName={app.name}
							size={16}
							className="rounded-[3px]"
						/>
						{app.name}
					</li>
				))}
				<li className="flex items-center rounded-md border border-dashed border-[#1c1c1c]/15 px-2 py-1 text-[12px] text-[#1c1c1c99]">
					+400 more
				</li>
			</ul>
		);
	}
	if (id === 'control') {
		return (
			<ul className="grid grid-cols-2 gap-2" aria-label="Link modes">
				{LINK_MODES.map((mode) => (
					<li
						key={mode.name}
						className={cn(
							'rounded-md border px-2.5 py-1.5 text-[12px]',
							'isDefault' in mode
								? 'border-[#4a38f5]/30 bg-[#4a38f5]/[0.06]'
								: 'border-[#1c1c1c]/10 bg-white',
						)}
					>
						<span className="block font-medium text-[#1c1c1c]">
							{mode.name}
							{'isDefault' in mode ? (
								<span className="ml-1 text-[#3d2ee0]">· default</span>
							) : null}
						</span>
						<span className="block text-[#1c1c1c99]">{mode.note}</span>
					</li>
				))}
			</ul>
		);
	}
	return (
		<div className="rounded-md border border-[#1c1c1c]/10 bg-white px-3 py-2.5">
			<p className="font-[family-name:var(--landing-font-mono)] text-[11px] uppercase tracking-[0.06em] text-[#1c1c1c66]">
				You say
			</p>
			<p className="mt-1 text-[13px] leading-snug text-[#1c1c1c]">
				{ROUTINE_EXAMPLE}
			</p>
			<p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-emerald-700">
				<span aria-hidden className="size-1.5 rounded-full bg-emerald-500" />
				Routine saved and tested
			</p>
		</div>
	);
}

/** Connect, control, automate: the three things a link gives an agent. */
export function PillarsSection() {
	return (
		<section
			id="how-it-works"
			aria-labelledby="pillars-heading"
			className="relative w-full scroll-mt-16 py-14 sm:py-20"
		>
			<div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-10">
				<div className="text-center">
					<h2
						id="pillars-heading"
						className="font-[family-name:var(--landing-font-serif)] text-[clamp(1.85rem,4vw,2.9rem)] font-light leading-[1.1] tracking-[-0.02em] text-[#1c1c1c]"
					>
						One link. Every app.{' '}
						<span className="text-[#4a38f5]">Your rules.</span>
					</h2>
				</div>
				<div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
					{PILLARS.map((pillar) => (
						<article
							key={pillar.id}
							className="flex flex-col rounded-xl border border-[#1c1c1c]/10 bg-[#fafafa] p-5 sm:p-6"
						>
							<p className="font-[family-name:var(--landing-font-mono)] text-[11px] font-medium uppercase tracking-[0.06em] text-[#4a38f5]">
								{pillar.eyebrow}
							</p>
							<h3 className="mt-2 text-[20px] font-medium leading-snug tracking-[-0.01em] text-[#1c1c1c]">
								{pillar.title}
							</h3>
							<p className="mt-2 text-[15px] leading-relaxed text-[#1c1c1c99]">
								{pillar.body}
							</p>
							<div className="mt-5 flex-1">
								<Visual id={pillar.id} />
							</div>
							<Link
								href={pillar.href}
								className="mt-5 inline-flex items-center gap-1 text-[14px] font-medium text-[#4a38f5] no-underline hover:underline"
							>
								{pillar.cta}
								<ArrowRight size={14} weight="bold" aria-hidden />
							</Link>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
