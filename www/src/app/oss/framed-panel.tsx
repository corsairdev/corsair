import type { ReactNode } from 'react';

import { PlusCorner } from '@/components/landing/icons';
import { cn } from '@/lib/utils';

/**
 * White panel with hairline border and crosshair corner marks —
 * the drafting-table motif from the landing page.
 */
export function FramedPanel({
	children,
	className,
	corners = true,
}: {
	children: ReactNode;
	className?: string;
	corners?: boolean;
}) {
	return (
		<div
			className={cn('relative border border-[#1c1c1c1a] bg-white', className)}
		>
			{corners ? (
				<>
					<span className="pointer-events-none absolute -top-[7px] -left-[7px]">
						<PlusCorner />
					</span>
					<span className="pointer-events-none absolute -top-[7px] -right-[7px]">
						<PlusCorner />
					</span>
					<span className="pointer-events-none absolute -bottom-[7px] -left-[7px]">
						<PlusCorner />
					</span>
					<span className="pointer-events-none absolute -right-[7px] -bottom-[7px]">
						<PlusCorner />
					</span>
				</>
			) : null}
			{children}
		</div>
	);
}
