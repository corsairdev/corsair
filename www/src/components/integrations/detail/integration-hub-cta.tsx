import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

import { hubWwwPluginLoginUrl } from '@/lib/site-links';

export function IntegrationHubCta({
	pluginId,
	displayName,
}: {
	pluginId: string;
	displayName: string;
}) {
	const href = hubWwwPluginLoginUrl(pluginId);

	return (
		<section className="pb-4 md:pb-5">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<a
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					className="group flex flex-col gap-4 rounded-lg border border-[#1c1c1c]/10 bg-white px-6 py-6 no-underline shadow-[0_8px_32px_rgba(28,28,28,0.06)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[#4a38f5]/25 hover:shadow-[0_12px_40px_rgba(74,56,245,0.12)] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-7"
				>
					<div className="min-w-0">
						<p className="text-xl font-medium tracking-[-0.02em] text-[#1c1c1c] sm:text-2xl">
							Get started with {displayName} on Corsair Hub
						</p>
						<p className="mt-2 text-base leading-relaxed text-[#1c1c1c99]">
							Complete your first operation in {'<1 min'}
						</p>
					</div>
					<span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#4a38f5] px-6 py-3.5 text-sm font-medium text-white transition-colors group-hover:bg-[#3d2ee0] sm:px-7 sm:py-4 sm:text-base">
						Get started
						<ArrowRight size={18} weight="bold" aria-hidden />
					</span>
				</a>
			</div>
		</section>
	);
}
