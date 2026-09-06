import type { ReactNode } from 'react';

import { PlusCorner } from '@/components/landing/icons';

export function CompareReasonSection({
	index,
	title,
	description,
	children,
	reversed = false,
}: {
	index: number;
	title: string;
	description: ReactNode;
	children?: ReactNode;
	reversed?: boolean;
}) {
	return (
		<section className="py-14 md:py-20">
			<div
				className={`grid grid-cols-1 items-center gap-10 ${
					children ? 'lg:grid-cols-2 lg:gap-16' : 'max-w-[640px]'
				} ${reversed && children ? 'lg:[&>div:first-child]:order-2' : ''}`}
			>
				<div className="flex flex-col gap-5">
					<div className="flex items-center gap-3">
						<span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#1c1c1c1a] bg-white font-[family-name:var(--landing-font-mono)] text-xs font-semibold text-[#4a38f5]">
							{String(index).padStart(2, '0')}
						</span>
						<div className="h-px flex-1 bg-[#1c1c1c1a]" />
					</div>

					<h2 className="text-2xl font-medium leading-snug tracking-[-0.02em] text-[#1c1c1c] md:text-[1.75rem]">
						{title}
					</h2>

					<div className="space-y-4 text-[15px] leading-[1.7] text-[#1c1c1c99] md:text-base">
						{description}
					</div>
				</div>

				{children ? (
					<div className="relative border border-[#1c1c1c1a] bg-white p-5 sm:p-6 md:p-8">
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
						{children}
					</div>
				) : null}
			</div>
		</section>
	);
}
