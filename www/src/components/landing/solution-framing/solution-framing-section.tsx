import { PlusCorner } from '../icons';
import { OpenSourceVisual, PermissionVisual, SelfHostVisual } from './visuals';

const PILLAR_VISUALS = {
	permissions: PermissionVisual,
	'self-host': SelfHostVisual,
	'open-source': OpenSourceVisual,
} as const;

const SOLUTION_PILLARS = [
	{
		id: 'permissions',
		title: 'Permissions that protect you by default.',
		body: 'Set a permission mode per integration. Destructive actions require explicit approval before they execute. Your users get a review link, not a surprise.',
	},
	{
		id: 'self-host',
		title: 'Self-host for free. Cut your integration costs.',
		body: "Run the full SDK on your own infrastructure at no cost. No per-seat pricing, no data leaving your stack, no vendor markup on API calls you're already paying for.",
	},
	{
		id: 'open-source',
		title: "Open source means you're never blocked.",
		body: "Need an integration we don't have? Open a PR and we'll merge it. Or fork our repo and add exactly what you need. Thousands of eyes are on Corsair's infrastructure, so you're never trusting a black box.",
	},
] as const;

const CARD_CLASS =
	'relative flex min-h-[420px] w-full flex-col border border-[#1c1c1c1a] bg-white p-5 md:min-h-[480px] md:p-6 lg:h-[550px] lg:min-h-0';

function SolutionCard({
	pillar,
}: {
	pillar: (typeof SOLUTION_PILLARS)[number];
}) {
	const Visual = PILLAR_VISUALS[pillar.id];

	return (
		<li className={CARD_CLASS}>
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

			<Visual />

			<div className="flex min-h-0 flex-1 flex-col gap-3 pt-5 md:pt-6">
				<h3 className="text-lg font-medium leading-snug tracking-[-0.01em] text-[#1c1c1c] md:text-[1.125rem]">
					{pillar.title}
				</h3>
				<p className="text-[15px] leading-[1.65] text-[#1c1c1c99] md:text-base md:leading-[1.7]">
					{pillar.body}
				</p>
			</div>
		</li>
	);
}

export function SolutionFramingSection() {
	return (
		<section
			id="solution"
			className="relative w-full scroll-mt-16 bg-[#f4f4f4] py-20 md:py-28 lg:py-32"
			aria-labelledby="solution-heading"
		>
			<div className="mx-auto max-w-[1440px] px-4 md:px-10">
				<div className="mx-auto flex max-w-[720px] flex-col items-center gap-6 text-center md:max-w-[960px] md:gap-8">
					<p className="font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.02em] text-[#1c1c1c99]">
						The solution
					</p>

					<h2
						id="solution-heading"
						className="w-full text-[clamp(1.75rem,3.8vw,2.75rem)] font-light leading-[1.12] tracking-[-0.02em] text-[#1c1c1c]"
					>
						<span className="font-[family-name:var(--landing-font-serif)]">
							Corsair takes the integration layer off your plate.
						</span>
						<br />
						<span className="font-[family-name:var(--landing-font-sans)]">
							Production-grade, open source, and a product you&apos;ll
							confidently ship.
						</span>
					</h2>
				</div>

				<ul className="mt-14 grid grid-cols-1 gap-6 md:mt-20 lg:grid-cols-3 lg:gap-8">
					{SOLUTION_PILLARS.map((pillar) => (
						<SolutionCard key={pillar.id} pillar={pillar} />
					))}
				</ul>
			</div>
		</section>
	);
}
