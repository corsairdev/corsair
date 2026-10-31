import Link from 'next/link';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import {
	CREDITS_PER_USD,
	creditsInUsd,
	MANAGED_TOOLS,
	MONTHLY_FREE_CREDITS,
	priceText,
} from '@/lib/managed-tools';

/** Pay per call for tools Corsair holds the key for. */
export function ManagedToolsSection() {
	if (MANAGED_TOOLS.length === 0) return null;

	return (
		<section
			id="pay-per-call"
			aria-labelledby="pay-per-call-heading"
			className="relative w-full scroll-mt-16 py-14 sm:py-20"
		>
			<div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 px-4 sm:px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
				<div className="min-w-0">
					<h2
						id="pay-per-call-heading"
						className="font-[family-name:var(--landing-font-serif)] text-[clamp(1.75rem,3.6vw,2.6rem)] font-light leading-[1.1] tracking-[-0.02em] text-[#1c1c1c]"
					>
						No account for every tool. Pay per call.
					</h2>
					<p className="mt-4 max-w-xl text-[16px] leading-relaxed text-[#1c1c1c99]">
						For tools like Firecrawl, Exa, Apollo and Reducto, Corsair holds the
						API key. Add one to your link and it&apos;s ready: no sign-up with
						the provider, no key to paste, no monthly plan. Each call costs
						Corsair credits, and a call that fails gets them back.
					</p>
					<ul className="mt-6 grid max-w-xl grid-cols-1 gap-2 text-[14px] text-[#1c1c1c] sm:grid-cols-3">
						<li className="rounded-md border border-[#1c1c1c]/10 bg-white px-3 py-2.5">
							<span className="block text-[18px] font-medium">
								{MONTHLY_FREE_CREDITS}
							</span>
							<span className="text-[#1c1c1c99]">free credits a month</span>
						</li>
						<li className="rounded-md border border-[#1c1c1c]/10 bg-white px-3 py-2.5">
							<span className="block text-[18px] font-medium">
								$1 = {CREDITS_PER_USD}
							</span>
							<span className="text-[#1c1c1c99]">credits after that</span>
						</li>
						<li className="rounded-md border border-[#1c1c1c]/10 bg-white px-3 py-2.5">
							<span className="block text-[18px] font-medium">Roll over</span>
							<span className="text-[#1c1c1c99]">paid credits carry over</span>
						</li>
					</ul>
				</div>

				<div className="min-w-0 overflow-hidden rounded-lg border border-[#1c1c1c]/10 bg-white shadow-[0_8px_32px_rgba(28,28,28,0.06)]">
					<div className="flex items-center justify-between border-b border-[#1c1c1c]/8 px-5 py-3">
						<span className="text-[13px] font-medium text-[#1c1c1c]">
							What a call costs
						</span>
						<span className="font-[family-name:var(--landing-font-mono)] text-[11px] text-[#1c1c1c66]">
							1 credit = {creditsInUsd(1)}
						</span>
					</div>
					<ul>
						{MANAGED_TOOLS.map((tool) => {
							// One headline call per provider keeps the card short.
							const call = tool.calls[0];
							return (
								<li
									key={tool.app}
									className="flex items-center justify-between gap-4 border-b border-[#1c1c1c]/6 px-5 py-3.5 last:border-b-0"
								>
									<Link
										href={`/integrations/${tool.app}`}
										className="flex min-w-0 items-center gap-3 text-[#1c1c1c] no-underline"
									>
										<IntegrationLogo
											id={tool.app}
											displayName={tool.name}
											size={28}
											className="rounded-md"
										/>
										<span className="min-w-0">
											<span className="flex items-center gap-2 text-[14px] font-medium hover:text-[#4a38f5]">
												{tool.name}
												{tool.live ? null : (
													<span className="rounded-full border border-[#1c1c1c]/12 bg-[#1c1c1c]/5 px-2 py-0.5 text-[11px] font-medium text-[#1c1c1c99]">
														Soon
													</span>
												)}
											</span>
											<span className="block text-[13px] text-[#1c1c1c99]">
												{call.label}
											</span>
										</span>
									</Link>
									{tool.live && call.price ? (
										<span className="shrink-0 text-right font-[family-name:var(--landing-font-mono)] text-[13px] text-[#1c1c1c]">
											{priceText(call.price).credits}
											<span className="block text-[11px] text-[#1c1c1c66]">
												{priceText(call.price).usd}
											</span>
										</span>
									) : null}
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</section>
	);
}
