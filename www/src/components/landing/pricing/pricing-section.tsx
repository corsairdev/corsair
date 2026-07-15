import { APP_URL, ENTERPRISE_CONTACT_URL } from '@/lib/site-links';
import { PlusCorner } from '../icons';
import { FeatureInfoPopover } from './feature-info-popover';
import { PRICING_FEATURE_INFO } from './pricing-feature-info';

type TierId = 'hobby' | 'pro' | 'enterprise';

const TIERS = [
	{
		id: 'hobby' as const,
		name: 'Hobby',
		price: '$0',
		priceSuffix: '/mo',
		description: 'For getting started',
		cta: { label: 'Get started', href: APP_URL, external: true },
		highlighted: false,
	},
	{
		id: 'pro' as const,
		name: 'Pro',
		price: '$200',
		priceSuffix: '/mo',
		description: 'For teams in production',
		cta: { label: 'Get started', href: APP_URL, external: true },
		highlighted: true,
	},
	{
		id: 'enterprise' as const,
		name: 'Enterprise',
		price: 'Custom',
		priceSuffix: null,
		description: 'For custom needs',
		cta: { label: 'Contact us', href: ENTERPRISE_CONTACT_URL, external: false },
		highlighted: false,
	},
] as const;

type FeatureRow = {
	id: string;
	label: string;
	values: Record<TierId, string>;
};

const FEATURE_ROWS: FeatureRow[] = [
	{
		id: 'tool-calls',
		label: 'Tool calls',
		values: {
			hobby: 'Unlimited',
			pro: 'Unlimited',
			enterprise: 'Unlimited',
		},
	},
	{
		id: 'connections',
		label: 'Connections',
		values: {
			hobby: '50',
			pro: 'Unlimited',
			enterprise: 'Custom',
		},
	},
	{
		id: 'webhooks',
		label: 'Webhooks',
		values: {
			hobby: '100k events',
			pro: 'Unlimited',
			enterprise: 'Custom',
		},
	},
	{
		id: 'permissions',
		label: 'Managed Permissions / Auth pages',
		values: {
			hobby: 'Unlimited',
			pro: 'Unlimited',
			enterprise: 'Custom',
		},
	},
	{
		id: 'team-members',
		label: 'Team members',
		values: {
			hobby: 'Up to 3',
			pro: 'Unlimited',
			enterprise: 'Custom',
		},
	},
	{
		id: 'consent-screen',
		label: 'Consent screen',
		values: {
			hobby: 'Corsair branding',
			pro: 'Custom branding',
			enterprise: 'Custom',
		},
	},
	{
		id: 'support',
		label: 'Support',
		values: {
			hobby: 'Discord community',
			pro: 'Slack',
			enterprise: 'Custom',
		},
	},
	{
		id: 'custom-integrations',
		label: 'Custom Integrations',
		values: {
			hobby: 'Community',
			pro: 'Corsair team',
			enterprise: 'Custom',
		},
	},
];

const GRID_COLS =
	'grid grid-cols-[minmax(9rem,1.15fr)_repeat(3,minmax(7rem,1fr))]';

function tierCellClass(tierId: TierId, highlighted: boolean) {
	return highlighted ? 'border-x border-[#4a38f5]/25 bg-[#4a38f5]/[0.04]' : '';
}

function PricingCta({
	label,
	href,
	external,
}: {
	label: string;
	href: string;
	external: boolean;
}) {
	const className =
		'inline-flex w-full max-w-[140px] items-center justify-center rounded-full border border-[#1c1c1c] bg-white px-4 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[#1c1c1c] no-underline transition-colors hover:bg-[#1c1c1c] hover:text-white font-[family-name:var(--landing-font-sans)]';

	if (!href) {
		return (
			<span
				className={`${className} cursor-default opacity-50`}
				aria-disabled="true"
			>
				{label}
			</span>
		);
	}

	return (
		<a
			href={href}
			{...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
			className={className}
		>
			{label}
		</a>
	);
}

function FeatureValue({ value }: { value: string }) {
	const isEmpty = value === '—' || value === '-';

	return (
		<span
			className={
				isEmpty
					? 'text-[#1c1c1c33]'
					: 'text-sm font-medium text-[#1c1c1c] md:text-[15px]'
			}
		>
			{value}
		</span>
	);
}

export function PricingSection() {
	return (
		<section
			id="pricing"
			className="relative w-full scroll-mt-16 bg-[#f4f4f4] py-16 sm:py-20 md:py-28 lg:py-32"
			aria-labelledby="pricing-heading"
		>
			<div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10">
				<div className="mx-auto mb-10 flex max-w-[720px] flex-col items-center gap-6 text-center md:mb-14 md:max-w-[960px] md:gap-8">
					<p className="font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.02em] text-[#1c1c1c99]">
						Pricing
					</p>
					<h2
						id="pricing-heading"
						className="w-full text-[clamp(1.75rem,3.8vw,2.75rem)] font-light leading-[1.12] tracking-[-0.02em] text-[#1c1c1c]"
					>
						<span className="font-[family-name:var(--landing-font-serif)]">
							Try for free. No credit card required.
						</span>
					</h2>
				</div>

				<div className="relative mx-auto max-w-[1100px] border border-[#1c1c1c1a] bg-white">
					<span className="pointer-events-none absolute -left-[7px] -top-[7px]">
						<PlusCorner />
					</span>
					<span className="pointer-events-none absolute -right-[7px] -top-[7px]">
						<PlusCorner />
					</span>
					<span className="pointer-events-none absolute -bottom-[7px] -left-[7px]">
						<PlusCorner />
					</span>
					<span className="pointer-events-none absolute -bottom-[7px] -right-[7px]">
						<PlusCorner />
					</span>

					<div className="overflow-x-auto">
						<div className="min-w-[640px]">
							{/* Plan headers */}
							<div className={`${GRID_COLS} border-b border-[#1c1c1c1a]`}>
								<div className="border-r border-[#1c1c1c1a] p-4 md:p-5" />

								{TIERS.map((tier) => (
									<div
										key={tier.id}
										className={`flex flex-col gap-3 border-r border-[#1c1c1c1a] p-4 last:border-r-0 md:gap-4 md:p-5 ${tierCellClass(tier.id, tier.highlighted)} ${tier.highlighted ? 'border-t-2 border-t-[#4a38f5]' : ''}`}
									>
										{tier.highlighted ? (
											<span className="font-[family-name:var(--landing-font-mono)] text-[10px] font-medium uppercase tracking-[0.06em] text-[#4a38f5]">
												Most popular
											</span>
										) : (
											<span className="h-[15px]" aria-hidden />
										)}

										<div className="flex flex-col gap-1">
											<h3 className="text-base font-medium text-[#1c1c1c] md:text-lg">
												{tier.name}
											</h3>
											<div className="flex items-baseline gap-0.5">
												<span className="font-[family-name:var(--landing-font-serif)] text-2xl font-light tracking-[-0.02em] text-[#1c1c1c] md:text-[1.75rem]">
													{tier.price}
												</span>
												{tier.priceSuffix ? (
													<span className="text-sm text-[#1c1c1c99]">
														{tier.priceSuffix}
													</span>
												) : null}
											</div>
											<p className="text-xs text-[#1c1c1c99] md:text-sm">
												{tier.description}
											</p>
										</div>

										<PricingCta
											label={tier.cta.label}
											href={tier.cta.href}
											external={tier.cta.external}
										/>
									</div>
								))}
							</div>

							{FEATURE_ROWS.map((row, rowIndex) => (
								<div
									key={row.id}
									className={`${GRID_COLS} ${rowIndex < FEATURE_ROWS.length - 1 ? 'border-b border-[#1c1c1c1a]' : ''}`}
								>
									<div className="flex items-center justify-between gap-2 border-r border-[#1c1c1c1a] px-4 py-3.5 md:px-5 md:py-4">
										<span className="text-sm text-[#1c1c1c99] md:text-[15px]">
											{row.label}
										</span>
										<FeatureInfoPopover
											label={row.label}
											content={PRICING_FEATURE_INFO[row.id]}
										/>
									</div>

									{TIERS.map((tier) => (
										<div
											key={tier.id}
											className={`flex items-center border-r border-[#1c1c1c1a] px-4 py-3.5 last:border-r-0 md:px-5 md:py-4 ${tierCellClass(tier.id, tier.highlighted)}`}
										>
											<FeatureValue value={row.values[tier.id]} />
										</div>
									))}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
