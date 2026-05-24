'use client';

import { TABLE } from './table-theme';

export function RecordViewbar() {
	return (
		<div
			className="flex w-full items-center justify-between border-b border-[#ebebeb] px-3 py-2"
			style={{ fontFamily: TABLE.font, background: TABLE.colors.bg }}
		>
			<div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden px-1">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#666"
					strokeWidth="1.6"
				>
					<line x1="8" y1="6" x2="21" y2="6" />
					<line x1="8" y1="12" x2="21" y2="12" />
					<line x1="8" y1="18" x2="21" y2="18" />
					<line x1="3" y1="6" x2="3.01" y2="6" />
					<line x1="3" y1="12" x2="3.01" y2="12" />
					<line x1="3" y1="18" x2="3.01" y2="18" />
				</svg>
				<span className="text-[13px] font-medium text-[#666]">
					All Companies
				</span>
				<span className="h-0.5 w-0.5 rounded-full bg-[#d1d1d1]" />
				<span className="text-[13px] font-medium text-[#ccc]">9</span>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#ccc"
					strokeWidth="1.6"
				>
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</div>
			<div className="hidden items-center gap-0.5 md:flex">
				{['Filter', 'Sort', 'Options'].map((action) => (
					<span
						key={action}
						className="rounded px-2 py-1 text-[13px] text-[#666]"
					>
						{action}
					</span>
				))}
			</div>
		</div>
	);
}
