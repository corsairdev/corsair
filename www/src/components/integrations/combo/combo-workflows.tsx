import type { ComboData } from '@/lib/combo-types';
import { hubWwwPluginsLoginUrl } from '@/lib/site-links';
import { cn } from '@/lib/utils';
import { WorkflowNodePair } from './workflow-nodes';

export function ComboWorkflows({ combo }: { combo: ComboData }) {
	const tryItHref = hubWwwPluginsLoginUrl([combo.slugA, combo.slugB]);

	return (
		<section id="workflows" className="py-10 md:py-12">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<h2 className="text-center font-[family-name:var(--landing-font-serif)] text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.03em] text-[#1c1c1c]">
					Popular {combo.displayA} and {combo.displayB} workflows
				</h2>
				<p className="mx-auto mt-2 max-w-2xl text-center text-[15px] leading-relaxed text-[#1c1c1c99]">
					When this happens in one app, do this in the other. Try it on Hub to
					connect both apps and run the pair.
				</p>
				<div className="mt-7 grid gap-3 md:grid-cols-2 md:items-stretch">
					{combo.workflows.map((w, i) => (
						<article
							key={w.id}
							id={w.id}
							className="flex h-full scroll-mt-24 flex-col overflow-hidden rounded-md border border-[#1c1c1c]/10 bg-white transition-colors hover:border-[#1c1c1c]/22"
						>
							<p
								className={cn(
									'px-4 pt-3 font-[family-name:var(--landing-font-mono)] text-[11px] font-medium uppercase tracking-[0.06em] text-[#4a38f5] sm:px-5',
									i !== 0 && 'invisible',
								)}
								aria-hidden={i !== 0}
							>
								Most popular
							</p>
							<div className="px-4 sm:px-5">
								<h3 className="min-h-[2.5rem] text-[15px] font-semibold leading-snug text-[#1c1c1c]">
									{w.title}
								</h3>
								<p className="mt-1 min-h-[2.6rem] text-[13px] leading-relaxed text-[#1c1c1c66]">
									{w.description}
								</p>
							</div>
							<div className="mt-auto border-y border-[#1c1c1c]/8">
								<WorkflowNodePair
									compact
									trigger={w.trigger}
									action={w.action}
								/>
							</div>
							<div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
								<span className="min-w-0 text-[13px] font-medium text-[#1c1c1c66]">
									{w.trigger.appLabel} + {w.action.appLabel}
								</span>
								<a
									href={tryItHref}
									target="_blank"
									rel="noopener noreferrer"
									className="-my-1 shrink-0 touch-manipulation py-2 text-[13px] font-medium text-[#4a38f5] no-underline hover:underline"
								>
									Try it →
								</a>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
