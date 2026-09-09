import Link from 'next/link';

import { PlusCorner } from '@/components/landing/icons';

export function CompareHero({
	competitor,
	eyebrow,
	title,
	description,
}: {
	competitor: string;
	eyebrow?: string;
	title: string;
	description: string;
}) {
	return (
		<section className="relative w-full border-b border-[#1c1c1c1a] bg-[#f4f4f4] pt-10 pb-14 md:pt-14 md:pb-20">
			<div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10">
				<div className="mx-auto max-w-[880px]">
					<p className="mb-4 font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.02em] text-[#1c1c1c99]">
						Compare
					</p>

					<h1 className="mb-5 text-[clamp(2rem,4.5vw,3.25rem)] font-light leading-[1.08] tracking-[-0.03em] text-[#1c1c1c]">
						<span className="font-[family-name:var(--landing-font-serif)]">
							Corsair
						</span>{' '}
						<span className="font-[family-name:var(--landing-font-sans)] text-[#1c1c1c66]">
							vs
						</span>{' '}
						<span className="font-[family-name:var(--landing-font-sans)]">
							{competitor}
						</span>
					</h1>

					<p className="max-w-[640px] text-lg leading-relaxed text-[#1c1c1c99] md:text-xl md:leading-[1.65]">
						{description}
					</p>

					{eyebrow ? (
						<div className="relative mt-10 border border-[#1c1c1c1a] bg-white px-5 py-4 sm:px-6 md:px-8">
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

							<p className="font-[family-name:var(--landing-font-mono)] text-[11px] font-semibold uppercase tracking-wider text-[#4a38f5]">
								{eyebrow}
							</p>
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
}
