import Link from 'next/link';

const steps = [
	{
		title: 'Claim',
		description: 'Pick an unclaimed integration. It locks under your name.',
	},
	{
		title: 'Build',
		description: 'Open an issue, ship the plugin PR following the guide.',
	},
	{
		title: 'Earn',
		description:
			'Once your PR is merged, mark it finished and collect your points.',
	},
];

export function HowItWorks({ signedIn }: { signedIn: boolean }) {
	return (
		<section>
			<h2 className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
				How it works
			</h2>
			<ol className="mt-4 space-y-3.5">
				{steps.map((step, index) => (
					<li key={step.title} className="flex gap-3 text-[13px] leading-snug">
						<span className="font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c40]">
							0{index + 1}
						</span>
						<p className="text-[#1c1c1c99]">
							<span className="font-medium text-[#1c1c1c]">{step.title}.</span>{' '}
							{step.description}
						</p>
					</li>
				))}
			</ol>
			<p className="mt-4 rounded-lg border border-[#4a38f5]/20 bg-[#4a38f508] px-3 py-2.5 text-[13px] leading-snug text-[#1c1c1c99]">
				<span className="font-medium text-[#1c1c1c]">Community rewards.</span>{' '}
				Points recognize your contribution to the open catalog. Redeem them for
				AI credits when your plugin ships.
			</p>
			{!signedIn ? (
				<Link
					href="/oss/sign-in"
					className="mt-4 inline-block text-[13px] font-medium text-[#1c1c1c] underline underline-offset-2 hover:text-[#4a38f5]"
				>
					Sign in to get started
				</Link>
			) : null}
		</section>
	);
}
