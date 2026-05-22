import { PlusCorner } from '../icons';

const SUPPLEMENTAL_POINTS = [
	{
		lead: 'APIs are a moving target.',
		body: 'Auth flows rotate, routes deprecate, schemas change, and error handling varies wildly per provider. What works today breaks quietly in six months.',
	},
	{
		lead: 'Closed source tools hold you hostage.',
		body: "You're limited to whatever integrations they've built. If you need an integration they don't support, you're at the mercy of their roadmap.",
	},
] as const;

export function ProblemStatementSection() {
	return (
		<section
			id="problem"
			className="relative w-full scroll-mt-16 bg-[#f4f4f4] pt-10 pb-20 md:pt-12 md:pb-28 lg:pb-32"
			aria-labelledby="problem-heading"
		>
			<div className="mx-auto max-w-[1440px] px-4 md:px-10">
				<div className="mx-auto flex max-w-[720px] flex-col items-center gap-6 text-center md:max-w-[800px] md:gap-8">
					<p className="font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.02em] text-[#1c1c1c99]">
						The problem
					</p>

					<h2
						id="problem-heading"
						className="w-full text-[clamp(1.75rem,3.8vw,2.75rem)] font-light leading-[1.12] tracking-[-0.02em] text-[#1c1c1c]"
					>
						<span className="font-[family-name:var(--landing-font-serif)]">
							Every app your product talks to makes it exponentially more
							powerful.
						</span>
						<br />
						<span className="font-[family-name:var(--landing-font-sans)]">
							Building those connections is the hard part.
						</span>
					</h2>
				</div>

				<div className="relative mx-auto mt-14 max-w-[960px] border border-[#1c1c1c1a] bg-white md:mt-20">
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

					<div className="grid grid-cols-1 lg:grid-cols-2">
						{SUPPLEMENTAL_POINTS.map((point, index) => (
							<div
								key={point.lead}
								className={`px-6 py-8 md:px-10 md:py-10 ${
									index === 0
										? 'border-b border-[#1c1c1c1a] lg:border-b-0 lg:border-r'
										: ''
								}`}
							>
								<p className="text-[15px] leading-[1.65] text-[#1c1c1c99] md:text-base md:leading-[1.7]">
									<span className="font-medium text-[#1c1c1c]">
										{point.lead}
									</span>
									<br />
									{point.body}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
