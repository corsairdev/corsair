import { CopyableCodeSnippet } from '../copyable-code-snippet';

const SDK_INSTALL_COMMAND = 'npm install corsair';

function PlusCorner() {
	return (
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
			<path d="M7 0v14M0 7h14" stroke="#4a38f5" strokeWidth="1" />
		</svg>
	);
}

const ENGINEER_OPTIONS = [
	{
		id: 'sdk',
		title: 'The SDK',
		installCommand: SDK_INSTALL_COMMAND,
		body: 'Strongly typed. One credential model. One webhook pattern. Deeply integrated and custom-built to your stack.',
		bestFor: 'teams who want to own the stack',
	},
	{
		id: 'hosted',
		title: 'The hosted version',
		body: 'Drop in a Corsair MCP URL and any agent has access to Corsair immediately. Permission gates, approval flows, and secure auth links out of the box.',
		bestFor: 'teams who want to be live in minutes',
	},
	{
		id: 'cloud-sdk',
		title: 'The Cloud SDK',
		body: 'Use hosted and stay code-first. Provision instances, create tenants, configure plugins, and set permissions programmatically via API.',
		bestFor: 'teams building multi-tenant products',
	},
] as const;

const CARD_CLASS =
	'relative flex h-[550px] w-full flex-col rounded-sm border border-[#1c1c1c1a] bg-white p-5 md:p-6';

const INNER_BOX_CLASS =
	'relative h-[320px] w-full shrink-0 rounded-sm border border-[#1c1c1c1a] bg-[#fafafa]';

function AnimationPlaceholder({ label }: { label: string }) {
	return <div className={INNER_BOX_CLASS} aria-label={label} />;
}

function EngineerCard({
	option,
}: {
	option: (typeof ENGINEER_OPTIONS)[number];
}) {
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

			<AnimationPlaceholder label={`${option.title} animation`} />

			<div className="flex min-h-0 flex-1 flex-col gap-3 pt-5 md:pt-6">
				<h3 className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-lg font-medium leading-snug tracking-[-0.01em] text-[#1c1c1c] md:text-[1.125rem]">
					<span>{option.title}</span>
					{'installCommand' in option ? (
						<>
							<span className="font-normal text-[#1c1c1c40]" aria-hidden>
								—
							</span>
							<CopyableCodeSnippet inline code={option.installCommand} />
						</>
					) : null}
				</h3>
				<p className="text-[15px] leading-[1.65] text-[#1c1c1c99] md:text-base md:leading-[1.7]">
					{option.body}
				</p>
				<p className="mt-auto text-[15px] leading-[1.65] text-[#1c1c1c99] md:text-base md:leading-[1.7]">
					<span className="font-medium text-[#1c1c1c]">Best for: </span>
					{option.bestFor}
				</p>
			</div>
		</li>
	);
}

export function EngineersSection() {
	return (
		<section
			id="engineers"
			className="relative w-full scroll-mt-16 bg-[#f4f4f4] py-20 md:py-28 lg:py-32"
			aria-labelledby="engineers-heading"
		>
			<div className="mx-auto max-w-[1440px] px-4 md:px-10">
				<div className="mx-auto mb-14 flex max-w-[720px] flex-col items-center gap-6 text-center md:mb-20 md:max-w-[800px] md:gap-8">
					<p className="font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.02em] text-[#1c1c1c99]">
						For engineers
					</p>
					<h2
						id="engineers-heading"
						className="w-full text-[clamp(1.75rem,3.8vw,2.75rem)] font-light leading-[1.12] tracking-[-0.02em] text-[#1c1c1c]"
					>
						<span className="font-[family-name:var(--landing-font-serif)]">
							Why your team
						</span>{' '}
						<span className="font-[family-name:var(--landing-font-sans)]">
							will love it
						</span>
					</h2>
				</div>

				<ul className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6 lg:gap-8">
					{ENGINEER_OPTIONS.map((option) => (
						<EngineerCard key={option.id} option={option} />
					))}
				</ul>
			</div>
		</section>
	);
}
