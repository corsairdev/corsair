import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

import type { ComboData } from '@/lib/combo-types';
import { hubWwwPluginsLoginUrl } from '@/lib/site-links';

export function ComboHubCta({ combo }: { combo: ComboData }) {
	const href = hubWwwPluginsLoginUrl([combo.slugA, combo.slugB]);
	const label = `${combo.displayA} and ${combo.displayB}`;

	return (
		<section className="pb-4 pt-2 md:pb-5 md:pt-3">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<a
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-col gap-4 rounded-lg border border-[#1c1c1c]/10 bg-white px-6 py-6 no-underline shadow-[0_8px_32px_rgba(28,28,28,0.06)] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-7"
				>
					<div className="min-w-0">
						<p className="text-xl font-medium tracking-[-0.02em] text-[#1c1c1c] sm:text-2xl">
							Get started with {label} on Corsair Hub
						</p>
						<p className="mt-2 text-base leading-relaxed text-[#1c1c1c99]">
							Complete your first operation in {'<1 min'}
						</p>
					</div>
					<span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#4a38f5] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#3d2ee0] sm:px-7 sm:py-4 sm:text-base">
						Get started
						<ArrowRight size={18} weight="bold" aria-hidden />
					</span>
				</a>
			</div>
		</section>
	);
}
