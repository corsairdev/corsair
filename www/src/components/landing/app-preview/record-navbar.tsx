'use client';

import { CORSAIR_INSTANCE_NAV } from '../data/companies-data';
import { TABLE } from './table-theme';

const activeInstance =
	CORSAIR_INSTANCE_NAV.find((item) => item.active) ?? CORSAIR_INSTANCE_NAV[0];

export function RecordNavbar() {
	return (
		<div
			className="flex w-full shrink-0 flex-col gap-2 border-b border-[#ebebeb] px-4 py-3"
			style={{ fontFamily: TABLE.font, background: TABLE.colors.bg }}
		>
			<div className="flex items-center gap-1 text-[11px] text-[#737373]">
				<span>Dashboard</span>
				<span aria-hidden>›</span>
				<span className="text-[#525252]">{activeInstance.label}</span>
			</div>

			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<h2 className="truncate text-lg font-semibold tracking-[-0.02em] text-[#1c1c1c] md:text-[22px]">
						{activeInstance.label}
					</h2>
					<p className="mt-0.5 text-[12px] text-[#737373]">
						Customer configuration by integration.
					</p>
				</div>

				<div className="hidden shrink-0 items-center gap-1 sm:flex">
					<button
						type="button"
						className="inline-flex h-7 items-center gap-1 rounded px-2 text-[12px] font-medium text-[#1c1c1c] underline decoration-[#1c1c1c33] underline-offset-4"
					>
						<svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<line x1="12" y1="5" x2="12" y2="19" />
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
						New User
					</button>
					<button
						type="button"
						className="inline-flex h-7 items-center gap-1 rounded px-2 text-[12px] font-medium text-[#1c1c1c] underline decoration-[#1c1c1c33] underline-offset-4"
					>
						<svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<line x1="12" y1="5" x2="12" y2="19" />
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
						Add Plugin
					</button>
				</div>
			</div>
		</div>
	);
}
