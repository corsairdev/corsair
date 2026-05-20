'use client';

import { CORSAIR_HOME_NAV, CORSAIR_INSTANCE_NAV } from '../data/companies-data';
import { TABLE } from './table-theme';

function NavIcon({ type }: { type: string }) {
	const color = '#737373';
	const s = 14;
	const icons: Record<string, React.ReactNode> = {
		home: (
			<svg
				width={s}
				height={s}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth="1.6"
			>
				<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
			</svg>
		),
		sparkles: (
			<svg
				width={s}
				height={s}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth="1.6"
			>
				<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
				<path d="M5 19l.75 2.25L8 22l-2.25.75L5 25l-.75-2.25L2 22l2.25-.75L5 19z" />
			</svg>
		),
		key: (
			<svg
				width={s}
				height={s}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth="1.6"
			>
				<circle cx="8" cy="15" r="4" />
				<path d="M12 15h9M17 12v6" />
			</svg>
		),
		instance: (
			<svg
				width={s}
				height={s}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth="1.6"
			>
				<rect x="4" y="4" width="16" height="16" rx="2" />
				<path d="M9 9h6v6H9z" />
			</svg>
		),
		shield: (
			<svg
				width={s}
				height={s}
				viewBox="0 0 24 24"
				fill="none"
				stroke={color}
				strokeWidth="1.6"
			>
				<path d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
			</svg>
		),
	};
	return icons[type] ?? icons.instance;
}

function CorsairLogo() {
	return (
		<span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-[#0d0f1a] text-[11px] font-bold text-white">
			C
		</span>
	);
}

function NavSection({
	title,
	items,
}: {
	title: string;
	items: readonly {
		id: string;
		label: string;
		active: boolean;
		icon: string;
	}[];
}) {
	return (
		<div className="flex flex-col gap-0.5">
			<p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#a3a3a3]">
				{title}
			</p>
			{items.map((item) => (
				<button
					key={item.id}
					type="button"
					className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] ${
						item.active
							? 'bg-[#f4f4f5] font-medium text-[#1c1c1c]'
							: 'text-[#525252] hover:bg-[#fafafa]'
					}`}
				>
					<span className="flex h-4 w-4 shrink-0 items-center justify-center">
						<NavIcon type={item.icon} />
					</span>
					<span className="truncate">{item.label}</span>
				</button>
			))}
		</div>
	);
}

export function PreviewSidebar() {
	return (
		<aside
			className="grid w-[210px] shrink-0 grid-rows-[auto_1fr] gap-3 border-r border-[#ebebeb] bg-[#fafafa] p-3"
			style={{ fontFamily: TABLE.font }}
		>
			<div className="flex min-h-8 items-center gap-2 px-1">
				<CorsairLogo />
				<div className="min-w-0">
					<p className="truncate text-[13px] font-semibold text-[#1c1c1c]">
						Corsair
					</p>
					<p className="truncate text-[11px] text-[#737373]">Personal</p>
				</div>
			</div>

			<div className="flex min-h-0 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				<NavSection title="Home" items={CORSAIR_HOME_NAV} />
				<NavSection title="Instances" items={CORSAIR_INSTANCE_NAV} />
			</div>
		</aside>
	);
}
