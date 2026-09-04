import Link from 'next/link';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import { IntegrationStats } from '@/components/integrations/integration-stats';
import type { IntegrationDetailData } from '@/lib/integration-page.types';

export function IntegrationDetailHero({
	integration,
}: {
	integration: Pick<
		IntegrationDetailData,
		'id' | 'displayName' | 'blurb' | 'counts'
	>;
}) {
	return (
		<section className="pb-10 pt-8 md:pb-12 md:pt-10">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<Link
					href="/integrations"
					className="mb-8 inline-flex items-center gap-1.5 font-[family-name:var(--landing-font-mono)] text-[11px] text-[#1c1c1c66] no-underline transition-colors hover:text-[#1c1c1c]"
				>
					← All integrations
				</Link>

				<div className="flex items-start gap-4 md:gap-5">
					<IntegrationLogo
						id={integration.id}
						displayName={integration.displayName}
						size={56}
						className="rounded-md"
					/>
					<div className="min-w-0 flex-1">
						<h1 className="text-[clamp(2rem,4vw,2.75rem)] font-light leading-[1.08] tracking-[-0.03em] text-[#1c1c1c]">
							<span className="font-[family-name:var(--landing-font-serif)]">
								{integration.displayName}
							</span>
						</h1>
						<div className="mt-2">
							<IntegrationStats counts={integration.counts} />
						</div>
						<p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#1c1c1c99]">
							{integration.blurb}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
