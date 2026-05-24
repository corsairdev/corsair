'use client';

import type { ReactNode } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { PersonAvatar } from '../app-preview/table-ui';
import { useWindowOrder } from '../hooks/use-window-order';
import { useWindowPointerInteractions } from '../hooks/use-window-pointer-interactions';
import type { WindowPosition, WindowSize } from '../hooks/window-geometry';
import { TrafficLights } from '../icons/window-chrome';

export const DESKTOP_WIDTH = 340;
export const DESKTOP_HEIGHT = 420;
const MOBILE_BREAKPOINT = 768;
const WINDOW_GAP = 20;
const MIN_WIDTH = 280;
const MIN_HEIGHT = 320;

export type ChatPerson = {
	name: string;
	tone?: string;
	avatar?: string;
};

function computeLayout(
	bounds: DOMRect,
	index: number,
	total: number,
): { position: WindowPosition; size: WindowSize } {
	const isMobile = bounds.width < MOBILE_BREAKPOINT;

	if (isMobile) {
		const width = bounds.width;
		const height = Math.min(
			DESKTOP_HEIGHT,
			Math.max(MIN_HEIGHT, bounds.height / total - WINDOW_GAP),
		);
		const top = index * (height + WINDOW_GAP);
		return {
			position: { left: 0, top },
			size: { width, height },
		};
	}

	const maxWidth = Math.floor(
		(bounds.width - WINDOW_GAP * (total - 1)) / total,
	);
	const width = Math.min(DESKTOP_WIDTH, Math.max(MIN_WIDTH, maxWidth));
	const height = Math.min(DESKTOP_HEIGHT, bounds.height);
	const rowWidth = total * width + WINDOW_GAP * (total - 1);
	const startLeft = Math.max(0, (bounds.width - rowWidth) / 2);
	const left = startLeft + index * (width + WINDOW_GAP);
	const top = Math.max(0, (bounds.height - height) / 2);

	return {
		position: { left, top },
		size: { width, height },
	};
}

export function DraggableWindowShell({
	id,
	index,
	total,
	person,
	children,
}: {
	id: string;
	index: number;
	total: number;
	person: ChatPerson;
	children: ReactNode;
}) {
	const shellRef = useRef<HTMLDivElement>(null);
	const interactingRef = useRef(false);
	const [isMobile, setIsMobile] = useState(false);
	const [position, setPosition] = useState<WindowPosition | null>(null);
	const [size, setSize] = useState<WindowSize>({
		width: DESKTOP_WIDTH,
		height: DESKTOP_HEIGHT,
	});
	const { activate, zIndex } = useWindowOrder(id);

	const getParentBounds = useCallback(() => {
		const parent = shellRef.current?.parentElement;
		return parent?.getBoundingClientRect() ?? null;
	}, []);

	const recalcLayout = useCallback(() => {
		const bounds = getParentBounds();
		if (!bounds) return;

		const mobile = bounds.width < MOBILE_BREAKPOINT;
		setIsMobile(mobile);

		const next = computeLayout(bounds, index, total);
		setSize(next.size);
		setPosition(next.position);
	}, [getParentBounds, index, total]);

	useLayoutEffect(() => {
		recalcLayout();
		const parent = shellRef.current?.parentElement;
		if (!parent) return;

		const observer = new ResizeObserver(() => {
			if (!interactingRef.current) recalcLayout();
		});
		observer.observe(parent);
		return () => observer.disconnect();
	}, [recalcLayout]);

	const {
		handleDragStart: onDragStart,
		isDragging,
		isResizing,
		latestPositionRef,
		latestSizeRef,
	} = useWindowPointerInteractions({
		activate,
		blockedDragTargetSelector: 'button',
		edgeGap: 0,
		getBounds: getParentBounds,
		minSize: { width: MIN_WIDTH, height: MIN_HEIGHT },
		position,
		setPosition,
		setSize,
		shellRef,
		size,
	});

	const handleDragStart = isMobile ? undefined : onDragStart;
	const isInteracting = isDragging || isResizing;
	interactingRef.current = isInteracting;
	const renderPosition = isInteracting
		? (latestPositionRef.current ?? position)
		: position;
	const renderSize = isInteracting ? (latestSizeRef.current ?? size) : size;
	const isReady = position !== null;

	return (
		<div
			ref={shellRef}
			onPointerDown={activate}
			className={`absolute left-0 top-0 flex flex-col overflow-hidden rounded-[20px] border border-[#1c1c1c1a] bg-white transition-[box-shadow,opacity] duration-200 will-change-[transform,width,height] ${
				isMobile ? 'max-md:rounded-2xl' : 'touch-none'
			}`}
			style={{
				opacity: isReady ? 1 : 0,
				height: `${renderSize.height}px`,
				width: `${renderSize.width}px`,
				transform: renderPosition
					? `translate3d(${renderPosition.left}px, ${renderPosition.top}px, 0)`
					: 'translate3d(0, 0, 0)',
				zIndex,
				boxShadow:
					isDragging || isResizing
						? 'var(--landing-shadow-elevated)'
						: 'var(--landing-shadow-resting)',
			}}
		>
			<div
				className="grid h-12 w-full shrink-0 select-none grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-[#1c1c1c1a] px-3 touch-none"
				style={{
					cursor: isMobile ? 'default' : isDragging ? 'grabbing' : 'grab',
				}}
				onPointerDown={handleDragStart}
			>
				<TrafficLights />
				<div className="flex min-w-0 items-center justify-center gap-1.5">
					<PersonAvatar person={person} size={18} />
					<span className="truncate text-[13px] font-semibold text-[#1c1c1c]">
						{person.name}
					</span>
				</div>
				<div className="w-[52px]" />
			</div>

			<div className="relative flex min-h-0 flex-1 touch-auto flex-col gap-2 p-3 pt-2">
				{children}
			</div>
		</div>
	);
}

export function getTrioContainerHeight(windowCount: number, isMobile: boolean) {
	if (isMobile) {
		return windowCount * DESKTOP_HEIGHT + (windowCount - 1) * WINDOW_GAP;
	}
	return DESKTOP_HEIGHT + 48;
}
