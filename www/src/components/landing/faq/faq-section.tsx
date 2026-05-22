import { ChevronIcon, PlusCorner } from '../icons';

const FAQ_ITEMS = [
	{
		id: 'different-from-others',
		question: 'How is this different from existing integration products?',
		answer:
			"Most are closed source. If they're missing an integration, you wait for them to add it. Corsair is open source. Add any integration yourself.",
	},
	{
		id: 'vibe-code',
		question: 'Why not just vibe code integrations myself?',
		answer:
			'You can get 80% there fast. The other 20% (token refresh, webhook signature verification, API deprecations, rate limit handling, multi-tenant credential isolation) compounds into a maintenance burden that distracts from your actual product.',
	},
	{
		id: 'api-keys',
		question: 'Does my agent ever see my API keys?',
		answer:
			'No. Corsair resolves credentials internally at call time. Your agent sees method names and results only.',
	},
	{
		id: 'caching',
		question: 'How does caching work?',
		answer:
			'Data flowing through Corsair is stored and kept fresh via webhooks and polling, partitioned per tenant. This is useful if you need to query the same data repeatedly and are worried about rate limits. Reads hit the database, not the third-party API on every request.',
	},
	{
		id: 'without-agent',
		question: 'Can I use this without an AI agent?',
		answer:
			'Yes. Call it like any typed library. Add a "Sync from Airtable" button, a "Create calendar invite" action, a "Post to Slack" trigger. No agent required.',
	},
	{
		id: 'missing-integration',
		question: "What if I need an integration you don't have?",
		answer:
			"Open a PR, fork the repo, or scaffold a new plugin with one command and build it yourself. It's all open source TypeScript.",
	},
	{
		id: 'hosted-security',
		question: 'Is the hosted version secure?',
		answer:
			"Credentials use envelope encryption. A key you control wraps per-tenant encryption keys, which wrap the actual secrets. Nothing stored in plaintext. Both keys are stored in separate places and you can't decrypt credentials without both.",
	},
] as const;

export function FaqSection() {
	return (
		<section
			id="faq"
			className="relative w-full scroll-mt-16 bg-[#f4f4f4] py-20 md:py-28 lg:py-32"
			aria-labelledby="faq-heading"
		>
			<div className="mx-auto max-w-[1440px] px-4 md:px-10">
				<h2
					id="faq-heading"
					className="mb-14 text-center font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.02em] text-[#1c1c1c99] md:mb-20"
				>
					FAQ
				</h2>

				<div className="relative mx-auto max-w-[800px] border border-[#1c1c1c1a] bg-white">
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

					<div className="divide-y divide-[#1c1c1c1a]">
						{FAQ_ITEMS.map((item) => (
							<details key={item.id} className="group">
								<summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#1c1c1c05] md:px-8 md:py-6 [&::-webkit-details-marker]:hidden">
									<span className="text-[15px] font-medium leading-snug text-[#1c1c1c] md:text-base">
										{item.question}
									</span>
									<ChevronIcon />
								</summary>
								<div className="px-6 pb-5 md:px-8 md:pb-6">
									<p className="text-[15px] leading-[1.65] text-[#1c1c1c99] md:text-base md:leading-[1.7]">
										{item.answer}
									</p>
								</div>
							</details>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
