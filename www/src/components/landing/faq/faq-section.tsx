import { FAQ_ITEMS } from '@/lib/home-faq';
import { ChevronIcon, PlusCorner } from '../icons';

export function FaqSection() {
	return (
		<section
			id="faq"
			className="relative w-full scroll-mt-16 bg-[#f4f4f4] py-16 sm:py-20 md:py-28 lg:py-32"
			aria-labelledby="faq-heading"
		>
			<div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10">
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
								<summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-[#1c1c1c05] sm:gap-4 sm:px-6 sm:py-5 md:px-8 md:py-6 [&::-webkit-details-marker]:hidden">
									<span className="text-[15px] font-medium leading-snug text-[#1c1c1c] md:text-base">
										{item.question}
									</span>
									<ChevronIcon />
								</summary>
								<div className="px-4 pb-4 sm:px-6 sm:pb-5 md:px-8 md:pb-6">
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
