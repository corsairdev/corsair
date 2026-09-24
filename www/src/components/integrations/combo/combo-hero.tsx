import Link from 'next/link';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import type { ComboData } from '@/lib/combo-types';

export function ComboHero({ combo }: { combo: ComboData }) {
	return (
		<section className="pb-4 pt-8 md:pb-5 md:pt-10">
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
						{combo.displayB}
					</span>
				</nav>

				<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-5">
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
							Create your own {combo.displayA} and {combo.displayB} integration
						</h1>
					</div>
				</div>
			</div>
		</section>
	);
}
