'use client';

import type { PointerEvent } from 'react';
import { TrafficLights } from '../icons/twenty-logo';

export function MacWindowBar({
	title = 'Corsair',
	isDragging,
	onDragStart,
}: {
	title?: string;
	isDragging: boolean;
	onDragStart: (event: PointerEvent<HTMLDivElement>) => void;
}) {
	return (
		<div
			className="grid w-full shrink-0 select-none grid-cols-[auto_1fr_auto] items-center border-b border-black/5 bg-[#f7f7f7] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
			style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
			onPointerDown={onDragStart}
		>
			<TrafficLights />
			<span className="justify-self-center text-center font-[family-name:var(--twenty-font-sans)] text-xs font-medium tracking-[0.1px] text-[rgba(40,36,30,0.62)]">
				{title}
			</span>
			<div className="w-[52px]" aria-hidden />
		</div>
	);
}
