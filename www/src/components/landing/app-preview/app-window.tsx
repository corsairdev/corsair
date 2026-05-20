'use client';

import {
	useLayoutEffect,
	useRef,
	useState,
	type PointerEvent,
	type ReactNode,
} from 'react';
import { useWindowOrder } from '../hooks/use-window-order';
import { useWindowPointerInteractions } from '../hooks/use-window-pointer-interactions';
import type { WindowPosition, WindowSize } from '../hooks/window-geometry';
import { MacWindowBar } from './mac-window-bar';

const WINDOW_ID = 'landing-app-window';
const MIN_WIDTH = 640;
const MIN_HEIGHT = 420;
const INITIAL_MAX_WIDTH = 1040;
const INITIAL_ASPECT_RATIO = 1280 / 832;
const MOBILE_PARENT_BREAKPOINT = 640;

export function AppWindow({ children }: { children: ReactNode }) {
	const shellRef = useRef<HTMLDivElement>(null);
	const interactingRef = useRef(false);
	const [position, setPosition] = useState<WindowPosition | null>(null);
	const [size, setSize] = useState<WindowSize | null>(null);
	const { activate, zIndex } = useWindowOrder(WINDOW_ID);

	const recalcLayout = () => {
		const shell = shellRef.current;
		const parent = shell?.parentElement;
		if (!parent) return;
		const parentRect = parent.getBoundingClientRect();

		if (parentRect.width < MOBILE_PARENT_BREAKPOINT) {
			const mobileWidth = parentRect.width;
			const mobileHeight = Math.min(
				parentRect.height,
				mobileWidth / INITIAL_ASPECT_RATIO,
			);
			setSize({ width: mobileWidth, height: mobileHeight });
			setPosition({ left: 0, top: 0 });
			return;
		}

		const newWidth = Math.min(parentRect.width, INITIAL_MAX_WIDTH);
		const newHeight = Math.min(
			parentRect.height,
			newWidth / INITIAL_ASPECT_RATIO,
		);
		setSize({ width: newWidth, height: newHeight });
		setPosition({
			left: Math.max(0, (parentRect.width - newWidth) / 2),
			top: 0,
		});
	};

	useLayoutEffect(() => {
		recalcLayout();
		const parent = shellRef.current?.parentElement;
		if (!parent) return;
		const observer = new ResizeObserver(() => {
			if (!interactingRef.current) recalcLayout();
		});
		observer.observe(parent);
		return () => observer.disconnect();
	}, []);

	const getParentRect = () =>
		shellRef.current?.parentElement?.getBoundingClientRect() ?? null;

	const {
		handleDragStart,
		isDragging,
		isResizing,
		latestPositionRef,
		latestSizeRef,
		startResize,
	} = useWindowPointerInteractions({
		activate,
		blockedDragTargetSelector:
			'button, a, input, textarea, select, [role="button"]',
		edgeGap: 0,
		getBounds: getParentRect,
		minSize: { width: MIN_WIDTH, height: MIN_HEIGHT },
		position,
		setPosition,
		setSize,
		shellRef,
		size,
	});

	const isReady = position !== null && size !== null;
	const isInteracting = isDragging || isResizing;
	interactingRef.current = isInteracting;
	const renderPosition = isInteracting
		? (latestPositionRef.current ?? position)
		: position;
	const renderSize = isInteracting ? (latestSizeRef.current ?? size) : size;

	const resizeHandle = (handle: Parameters<typeof startResize>[0]) =>
		startResize(handle);

	return (
		<div
			ref={shellRef}
			onPointerDown={activate}
			className="absolute left-0 top-0 flex touch-none flex-col overflow-hidden rounded-[20px] border border-[#1c1c1c1a] bg-white transition-[box-shadow,opacity] duration-200 will-change-[transform,width,height]"
			style={{
				opacity: isReady ? 1 : 0,
				height: renderSize ? `${renderSize.height}px` : undefined,
				width: renderSize ? `${renderSize.width}px` : '100%',
				transform: renderPosition
					? `translate3d(${renderPosition.left}px, ${renderPosition.top}px, 0)`
					: 'translate3d(0, 0, 0)',
				zIndex,
				boxShadow:
					zIndex > 2
						? 'var(--landing-shadow-elevated)'
						: 'var(--landing-shadow-resting)',
			}}
		>
			<ResizeHandle edge="top" onStart={resizeHandle('top')} />
			<ResizeHandle edge="right" onStart={resizeHandle('right')} />
			<ResizeHandle edge="bottom" onStart={resizeHandle('bottom')} />
			<ResizeHandle edge="left" onStart={resizeHandle('left')} />
			<MacWindowBar isDragging={isDragging} onDragStart={handleDragStart} />
			<div className="flex min-h-0 w-full flex-1">{children}</div>
		</div>
	);
}

function ResizeHandle({
	edge,
	onStart,
}: {
	edge: 'top' | 'right' | 'bottom' | 'left';
	onStart: (e: PointerEvent<HTMLDivElement>) => void;
}) {
	const styles: Record<string, string> = {
		top: 'top-[-3px] left-10 right-10 h-1.5 cursor-ns-resize',
		bottom: 'bottom-[-3px] left-10 right-10 h-1.5 cursor-ns-resize',
		left: 'left-[-3px] top-4 bottom-4 w-1.5 cursor-ew-resize',
		right: 'right-[-3px] top-4 bottom-4 w-1.5 cursor-ew-resize',
	};
	return (
		<div
			className={`absolute z-[4] ${styles[edge]}`}
			onPointerDown={onStart}
			aria-hidden
		/>
	);
}
