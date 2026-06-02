import {
	CopyableCodeSnippet,
	LANDING_CTA_BOX_CLASS,
} from '../copyable-code-snippet';

const SDK_INSTALL_COMMAND = 'npm install corsair';
const APP_URL = 'https://app.corsair.dev';
const DOCS_URL = 'https://docs.corsair.dev';

const PATH_CTAS = {
	sdk: { type: 'install', command: SDK_INSTALL_COMMAND },
	hosted: { type: 'link', href: APP_URL, label: 'app.corsair.dev' },
	'cloud-sdk': { type: 'link', href: DOCS_URL, label: 'docs.corsair.dev' },
} as const;

function PathCta({ optionId }: { optionId: keyof typeof PATH_CTAS }) {
	const cta = PATH_CTAS[optionId];

	if (cta.type === 'install') {
		return <CopyableCodeSnippet cta code={cta.command} />;
	}

	return (
		<a
			href={cta.href}
			target="_blank"
			rel="noopener noreferrer"
			className={LANDING_CTA_BOX_CLASS}
		>
			{cta.label}
		</a>
	);
}

function PlusCorner() {
	return (
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
			<path d="M7 0v14M0 7h14" stroke="#4a38f5" strokeWidth="1" />
		</svg>
	);
}

const PATH_OPTIONS = [
	{
		id: 'sdk',
		title: 'The SDK',
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
	'relative flex w-full flex-col rounded-sm border border-[#1c1c1c1a] bg-white p-4 sm:p-5 md:p-6';

function PathCard({ option }: { option: (typeof PATH_OPTIONS)[number] }) {
	const headingId = `choose-your-path-${option.id}-title`;

	return (
		<li className="flex flex-col gap-4 md:gap-5">
			<div className="flex flex-col items-center gap-2 text-center">
				<h3
					id={headingId}
					className="text-lg font-medium leading-snug tracking-[-0.01em] text-[#1c1c1c] md:text-[1.125rem]"
				>
					{option.title}
				</h3>
				<PathCta optionId={option.id} />
			</div>

			<div className={CARD_CLASS} aria-labelledby={headingId}>
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

				<div className="flex flex-col gap-3">
					<p className="text-[15px] leading-[1.65] text-[#1c1c1c99] md:text-base md:leading-[1.7]">
						{option.body}
					</p>
					<p className="text-[15px] leading-[1.65] text-[#1c1c1c99] md:text-base md:leading-[1.7]">
						<span className="font-medium text-[#1c1c1c]">Best for: </span>
						{option.bestFor}
					</p>
				</div>
			</div>
		</li>
	);
}

export function ChooseYourPathSection() {
	return (
		<section
			id="choose-your-path"
			className="relative w-full scroll-mt-16 bg-[#f4f4f4] py-16 sm:py-20 md:py-28 lg:py-32"
			aria-labelledby="choose-your-path-heading"
		>
			<div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10">
				<div className="mx-auto mb-14 flex max-w-[720px] flex-col items-center gap-6 text-center md:mb-20 md:max-w-[800px] md:gap-8">
					<p className="font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.02em] text-[#1c1c1c99]">
						Choose your path
					</p>
					<h2
						id="choose-your-path-heading"
						className="w-full text-[clamp(1.75rem,3.8vw,2.75rem)] font-light leading-[1.12] tracking-[-0.02em] text-[#1c1c1c]"
					>
						<span className="font-[family-name:var(--landing-font-serif)]">
							Ready any way you work.
						</span>
					</h2>
				</div>

				<ul className="grid grid-cols-1 gap-6 md:grid-cols-2 md:[&>li:nth-child(3)]:col-span-2 lg:grid-cols-3 lg:gap-8 lg:[&>li:nth-child(3)]:col-span-1">
					{PATH_OPTIONS.map((option) => (
						<PathCard key={option.id} option={option} />
					))}
				</ul>
			</div>
		</section>
	);
}
