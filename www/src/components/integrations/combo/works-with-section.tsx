import Link from 'next/link';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import { getWorksWith } from '@/lib/combined-integrations';

export function WorksWithSection({
	integrationId,
	displayName,
}: {
	integrationId: string;
	displayName: string;
}) {
	const items = getWorksWith(integrationId);

	if (items.length === 0) return null;

	return (
		<section className="py-10 md:py-12">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<h2 className="font-[family-name:var(--landing-font-serif)] text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.03em] text-[#1c1c1c]">
					{displayName} works with
				</h2>
				<div className="mt-6 grid gap-3 sm:grid-cols-2">
					{items.map((item) => (
						<Link
							key={item.id}
							href={item.href}
							className="flex items-center gap-3 rounded-md border border-[#1c1c1c]/10 bg-white px-4 py-4 no-underline transition-colors hover:border-[#1c1c1c]/25"
						>
							<IntegrationLogo
								id={item.id}
								displayName={item.displayName}
								size={44}
								className="rounded-md"
							/>
							<span>
								<span className="block text-[15px] font-semibold text-[#1c1c1c]">
									{item.displayName}
								</span>
								<span className="mt-0.5 block text-[13px] leading-relaxed text-[#1c1c1c66]">
									{item.blurb}
								</span>
							</span>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
