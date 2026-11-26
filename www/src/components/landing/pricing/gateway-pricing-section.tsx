import Link from 'next/link';

import { PlanGrid } from '@/components/gateway/plan-grid';

/** The gateway plans on the homepage; /pricing has the questions, /developers the SDK plans. */
export function GatewayPricingSection() {
	return (
		<section
			id="pricing"
			className="relative w-full scroll-mt-16 bg-[#f4f4f4] py-16 sm:py-20 md:py-28"
			aria-labelledby="pricing-heading"
		>
			<div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10">
				<div className="mx-auto flex max-w-[720px] flex-col items-center gap-4 text-center">
					<p className="font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.02em] text-[#1c1c1c99]">
						Pricing
					</p>
					<h2
						id="pricing-heading"
						className="text-[clamp(1.75rem,3.8vw,2.75rem)] font-light leading-[1.12] tracking-[-0.02em] text-[#1c1c1c]"
					>
						<span className="font-[family-name:var(--landing-font-serif)]">
							Every MCP URL starts free
						</span>
					</h2>
				</div>
				<div className="mx-auto max-w-[1100px] [&>div]:mt-8 [&_fieldset]:mx-auto [&_fieldset]:flex [&_fieldset]:w-fit">
					<PlanGrid />
				</div>
				<p className="mx-auto mt-8 max-w-[1100px] text-center text-sm text-[#1c1c1c99]">
					<Link
						href="/pricing"
						className="font-medium text-[#4a38f5] no-underline hover:underline"
					>
						All plans and questions →
					</Link>
					<span className="mx-3 text-[#1c1c1c33]">·</span>
					Building on the SDK?{' '}
					<Link
						href="/developers#pricing"
						className="font-medium text-[#4a38f5] no-underline hover:underline"
					>
						SDK plans →
					</Link>
				</p>
			</div>
		</section>
	);
}
