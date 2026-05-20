import type { ReactNode } from 'react';
import type { PreviewAlign } from './feature-scene';
import { WINDOW_SLICE_FRAME } from './feature-scene';
import { TrafficLights } from '../../icons/twenty-logo';

export function MiniWindowChrome({
	title,
	hoverTitle,
	showTrafficLights = true,
	slice,
	children,
	className = '',
}: {
	title: string;
	hoverTitle?: string;
	showTrafficLights?: boolean;
	slice?: PreviewAlign;
	children: ReactNode;
	className?: string;
}) {
	const frameClass = slice
		? WINDOW_SLICE_FRAME[slice].default
		: 'rounded-[6px] border border-[#ebebeb]';

	return (
		<div
			className={`flex h-full w-full flex-col overflow-hidden bg-white ${frameClass} ${className}`}
		>
			<div className="flex items-center gap-2 border-b border-[#f1f1f1] bg-[#f7f7f7] px-3 py-2">
				{showTrafficLights ? <TrafficLights /> : null}
				<span className="relative flex-1 truncate text-center text-[12px] font-medium tracking-[0.02em]">
					<span
						className={`block truncate text-[#1c1c1c66] transition-opacity duration-200 ${hoverTitle ? 'group-hover/scene:opacity-0' : ''}`}
					>
						{title}
					</span>
					{hoverTitle ? (
						<span className="absolute inset-x-0 top-0 truncate text-[#1c1c1c] opacity-0 transition-opacity duration-200 group-hover/scene:opacity-100">
							{hoverTitle}
						</span>
					) : null}
				</span>
				{showTrafficLights ? <span className="w-[52px]" aria-hidden /> : null}
			</div>
			{children}
		</div>
	);
}
