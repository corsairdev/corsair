'use client';

import { useState } from 'react';
import type { UseCaseId } from './use-cases-data';
import { USE_CASES } from './use-cases-data';
import { UseCasesVisual } from './use-cases-visual';

function PlusCorner() {
	return (
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
			<path d="M7 0v14M0 7h14" stroke="#4a38f5" strokeWidth="1" />
		</svg>
	);
}

export function UseCasesSection() {
	const [activeId, setActiveId] = useState<UseCaseId>('personal-assistant');
	const activeCase =
		USE_CASES.find((useCase) => useCase.id === activeId) ?? USE_CASES[0];

	return (
		<section
			id="use-cases"
			className="relative w-full scroll-mt-16 bg-[#f4f4f4] py-20 md:py-28 lg:py-32"
			aria-labelledby="use-cases-heading"
		>
			<div className="mx-auto max-w-[1440px] px-4 md:px-10">
				<div className="mx-auto mb-10 flex max-w-[820px] flex-col items-center gap-6 text-center md:mb-14 md:gap-8">
					<p className="font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.02em] text-[#1c1c1c99]">
						Use Corsair in more ways than chat
					</p>
					<h2
						id="use-cases-heading"
						className="w-full text-[clamp(1.75rem,3.8vw,2.75rem)] font-light leading-[1.12] tracking-[-0.02em] text-[#1c1c1c]"
					>
						<span className="font-[family-name:var(--landing-font-serif)]">
							Corsair provides the basic primitives of building a
							production-grade integration.
						</span>
					</h2>
					<p className="max-w-[640px] text-[15px] leading-[1.65] text-[#1c1c1c99] md:text-base md:leading-[1.7]">
						Build your product on top of Corsair.
					</p>
				</div>

				<div
					className="mb-8 flex flex-wrap justify-center gap-2 md:mb-10"
					role="tablist"
					aria-label="Corsair use cases"
				>
					{USE_CASES.map((useCase) => {
						const selected = useCase.id === activeId;

						return (
							<button
								key={useCase.id}
								type="button"
								role="tab"
								id={`use-case-tab-${useCase.id}`}
								aria-selected={selected}
								aria-controls="use-case-panel"
								onClick={() => setActiveId(useCase.id)}
								className={`rounded-sm border px-3.5 py-2 text-[13px] font-medium transition-all duration-200 md:px-4 md:py-2.5 md:text-sm ${
									selected
										? 'border-[#1c1c1c] bg-[#1c1c1c] text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]'
										: 'border-[#1c1c1c1a] bg-white text-[#1c1c1c99] hover:border-[#1c1c1c33] hover:text-[#1c1c1c]'
								}`}
							>
								{useCase.label}
							</button>
						);
					})}
				</div>

				<div className="relative mx-auto max-w-[960px] rounded-sm border border-[#1c1c1c1a] bg-white">
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

					<div
						id="use-case-panel"
						role="tabpanel"
						aria-labelledby={`use-case-tab-${activeId}`}
					>
						<UseCasesVisual
							useCaseId={activeCase.id}
							integrations={[...activeCase.integrations]}
						/>
					</div>

					<div className="border-t border-[#1c1c1c1a] px-5 py-6 md:px-8 md:py-8">
						<h3 className="mb-2 text-lg font-medium leading-snug tracking-[-0.01em] text-[#1c1c1c] md:text-[1.125rem]">
							{activeCase.headline}
						</h3>
						<p className="text-[15px] leading-[1.65] text-[#1c1c1c99] md:text-base md:leading-[1.7]">
							{activeCase.description}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
