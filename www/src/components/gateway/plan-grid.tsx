'use client';

import { useState } from 'react';
import type { Billing } from '@/lib/gateway-plans';
import { GATEWAY_PLANS, PRO_YEARLY_SAVING } from '@/lib/gateway-plans';

/** The three plans with a Monthly / Yearly switch; only Pro has a yearly price. Monthly is what the server renders. */
export function PlanGrid() {
	const [billing, setBilling] = useState<Billing>('month');
	return (
		<div className="mt-10">
			<fieldset className="mb-6 inline-flex border border-[#1c1c1c1a] bg-white p-1">
				<legend className="sr-only">Billing period</legend>
				{(['month', 'year'] as const).map((b) => (
					<button
						key={b}
						type="button"
						aria-pressed={billing === b}
						onClick={() => setBilling(b)}
						className={`touch-manipulation px-4 py-1.5 text-sm font-medium transition-colors ${
							billing === b
								? 'bg-[#1c1c1c] text-white'
								: 'text-[#1c1c1c99] hover:text-[#1c1c1c]'
						}`}
					>
						{b === 'month' ? 'Monthly' : 'Yearly'}
						{b === 'year' ? (
							<span
								className={`ml-2 font-[family-name:var(--landing-font-mono)] text-[11px] ${
									billing === b ? 'text-white/70' : 'text-[#4a38f5]'
								}`}
							>
								Save {PRO_YEARLY_SAVING}
							</span>
						) : null}
					</button>
				))}
			</fieldset>

			<div className="grid gap-4 md:grid-cols-3">
				{GATEWAY_PLANS.map((plan) => {
					const yearly = billing === 'year' && plan.yearPrice;
					const pro = plan.id === 'pro';
					return (
						<article
							key={plan.id}
							aria-labelledby={`plan-${plan.id}`}
							className={`flex flex-col border bg-white p-6 ${pro ? 'border-[#4a38f5]' : 'border-[#1c1c1c1a]'}`}
						>
							<h2
								id={`plan-${plan.id}`}
								className="font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.06em] text-[#4a38f5]"
							>
								{plan.name}
							</h2>
							<p className="mt-3 flex items-baseline gap-1">
								<span className="font-[family-name:var(--landing-font-serif)] text-4xl font-light tracking-[-0.02em] text-[#1c1c1c]">
									{yearly ? plan.yearPrice : plan.price}
								</span>
								{plan.per ? (
									<span className="text-sm text-[#1c1c1c66]">{plan.per}</span>
								) : null}
							</p>
							<p className="mt-2 min-h-[3rem] text-sm leading-relaxed text-[#1c1c1c99]">
								{yearly && plan.yearNote ? (
									<>
										{plan.yearNote}.<br />
									</>
								) : null}
								{plan.blurb}
							</p>
							<a
								href={plan.cta.href}
								className={`mt-5 inline-flex touch-manipulation items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium no-underline transition-colors ${
									pro
										? 'bg-[#4a38f5] text-white hover:bg-[#3d2ee0]'
										: 'border border-[#1c1c1c1a] bg-white text-[#1c1c1c] hover:bg-[#f4f4f4]'
								}`}
								{...(plan.cta.external
									? { target: '_blank', rel: 'noopener noreferrer' }
									: {})}
							>
								{plan.cta.label}
								{plan.cta.external ? (
									<span className="sr-only"> (opens in a new tab)</span>
								) : null}
							</a>
							<ul className="mt-6 flex flex-col gap-2.5 border-t border-[#1c1c1c1a] pt-5">
								{plan.features.map((f) => (
									<li
										key={f}
										className="flex gap-2 text-sm leading-snug text-[#1c1c1c]"
									>
										<span aria-hidden className="text-[#4a38f5]">
											✓
										</span>
										{f}
									</li>
								))}
							</ul>
						</article>
					);
				})}
			</div>
		</div>
	);
}
