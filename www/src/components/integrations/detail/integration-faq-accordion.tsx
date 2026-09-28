'use client';

import { useState } from 'react';
import { TextWithInlineCode } from '@/components/integrations/detail/text-with-inline-code';
import { ChevronIcon, PlusCorner } from '@/components/landing/icons';
import type { IntegrationDetailData } from '@/lib/integration-page.types';
import { cn } from '@/lib/utils';

function FaqItem({
	item,
	open,
	onToggle,
}: {
	item: IntegrationDetailData['faqs'][number];
	open: boolean;
	onToggle: () => void;
}) {
	const buttonId = `faq-button-${item.id}`;
	const panelId = `faq-panel-${item.id}`;
	return (
		<div className="border-b border-[#1c1c1c1a] last:border-b-0">
			<button
				type="button"
				id={buttonId}
				onClick={onToggle}
				aria-expanded={open}
				aria-controls={panelId}
				className="flex w-full cursor-pointer items-start justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-[#1c1c1c05] sm:gap-4 sm:px-6 sm:py-5 md:px-8 md:py-6"
			>
				<span className="text-[15px] font-medium leading-snug text-[#1c1c1c] md:text-base">
					{item.question}
				</span>
				<span
					className={cn(
						'mt-0.5 shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none',
						open && 'rotate-180',
					)}
				>
					<ChevronIcon />
				</span>
			</button>

			<div
				id={panelId}
				role="region"
				aria-labelledby={buttonId}
				className={cn(
					'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
					open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
				)}
			>
				<div className="overflow-hidden">
					<div className="px-4 pb-4 sm:px-6 sm:pb-5 md:px-8 md:pb-6">
						<p
							className={cn(
								'text-[15px] leading-[1.65] text-[#1c1c1c99] transition-opacity duration-300 ease-out motion-reduce:transition-none md:text-base md:leading-[1.7]',
								open ? 'opacity-100' : 'opacity-0',
							)}
						>
							<TextWithInlineCode text={item.answer} />
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export function IntegrationFaqAccordion({
	faqs,
	heading = 'FAQ',
	variant = 'catalog',
}: {
	faqs: IntegrationDetailData['faqs'];
	heading?: string;
	variant?: 'catalog' | 'combo';
}) {
	const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
	const isCombo = variant === 'combo';

	const toggle = (id: string) => {
		setOpenIds((current) => {
			const next = new Set(current);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	return (
		<section
			className={
				isCombo
					? 'py-10 md:py-12'
					: 'border-t border-[#1c1c1c]/10 py-16 md:py-20'
			}
		>
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<h2
					className={
						isCombo
							? 'text-center font-[family-name:var(--landing-font-serif)] text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.03em] text-[#1c1c1c]'
							: 'mb-10 text-center font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.06em] text-[#1c1c1c66]'
					}
				>
					{heading}
				</h2>

				<div
					className={cn(
						'relative border bg-white',
						isCombo
							? 'mt-7 overflow-hidden rounded-md border-[#1c1c1c]/10'
							: 'border-[#1c1c1c1a]',
					)}
				>
					{isCombo ? null : (
						<>
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
						</>
					)}

					<div>
						{faqs.map((item) => (
							<FaqItem
								key={item.id}
								item={item}
								open={openIds.has(item.id)}
								onToggle={() => toggle(item.id)}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
