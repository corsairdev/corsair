'use client';

import type { PointerEvent } from 'react';
import { TrafficLights } from '../icons/window-chrome';

export function MacWindowBar({
	title = 'Corsair',
	isDragging,
	onDragStart,
	draggable = true,
}: {
	title?: string;
	isDragging: boolean;
	onDragStart?: (event: PointerEvent<HTMLDivElement>) => void;
	draggable?: boolean;
}) {
	return (
		<div
			className="grid w-full shrink-0 select-none grid-cols-[auto_1fr_auto] items-center border-b border-black/5 bg-[#f7f7f7] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
			style={{ cursor: draggable ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
			onPointerDown={draggable ? onDragStart : undefined}
		>
			<TrafficLights />
			<span className="justify-self-center text-center font-[family-name:var(--landing-font-sans)] text-xs font-medium tracking-[0.1px] text-[rgba(40,36,30,0.62)]">
				{title}
			</span>
			<div className="w-[52px]" aria-hidden />
		</div>
	);
}
