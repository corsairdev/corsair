'use client';

import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLatestRef } from './use-latest-ref';
import type {
	WindowBounds,
	WindowDragState,
	WindowPosition,
	WindowResizeHandle,
	WindowResizeState,
	WindowSize,
} from './window-geometry';
import {
	clampWindowPosition,
	resizeWindowFromPointer,
} from './window-geometry';

type Options = {
	activate: () => void;
	blockedDragTargetSelector?: string;
	edgeGap: number;
	getBounds: () => WindowBounds | null;
	minSize: WindowSize;
	position: WindowPosition | null;
	setPosition: (position: WindowPosition) => void;
	setSize: (size: WindowSize) => void;
	shellRef: RefObject<HTMLElement | null>;
	size: WindowSize | null;
};

const isPrimaryPointer = (event: ReactPointerEvent<HTMLElement>) =>
	event.pointerType !== 'mouse' || event.button === 0;

const isBlockedDragTarget = (
	target: EventTarget | null,
	selector: string | undefined,
) =>
	selector !== undefined &&
	target instanceof HTMLElement &&
	target.closest(selector) !== null;

export function useWindowPointerInteractions({
	activate,
	blockedDragTargetSelector,
	edgeGap,
	getBounds,
	minSize,
	position,
	setPosition,
	setSize,
	shellRef,
	size,
}: Options) {
	const dragStateRef = useRef<WindowDragState | null>(null);
	const resizeStateRef = useRef<WindowResizeState | null>(null);
	const latestPositionRef = useLatestRef(position);
	const latestSizeRef = useLatestRef(size);
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false);

	const handleDragStart = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			if (!isPrimaryPointer(event)) return;
			if (isBlockedDragTarget(event.target, blockedDragTargetSelector)) return;
			if (position === null) return;

			event.preventDefault();
			activate();

			shellRef.current?.setPointerCapture?.(event.pointerId);
			dragStateRef.current = {
				pointerId: event.pointerId,
				originX: event.clientX,
				originY: event.clientY,
				startLeft: position.left,
				startTop: position.top,
			};
			setIsDragging(true);
		},
		[activate, blockedDragTargetSelector, position, shellRef],
	);

	useEffect(() => {
		if (!isDragging) return;

		const handleMove = (event: PointerEvent) => {
			const state = dragStateRef.current;
			const activeSize = latestSizeRef.current;
			if (!state || state.pointerId !== event.pointerId || activeSize === null)
				return;

			const bounds = getBounds();
			if (bounds === null) return;

			const nextPosition = clampWindowPosition({
				bounds,
				candidate: {
					left: state.startLeft + (event.clientX - state.originX),
					top: state.startTop + (event.clientY - state.originY),
				},
				edgeGap,
				size: activeSize,
			});

			latestPositionRef.current = nextPosition;
			const shell = shellRef.current;
			if (shell) {
				shell.style.transform = `translate3d(${nextPosition.left}px, ${nextPosition.top}px, 0)`;
			}
		};

		const stopDragging = (event: PointerEvent) => {
			const state = dragStateRef.current;
			if (!state || state.pointerId !== event.pointerId) return;

			dragStateRef.current = null;
			setIsDragging(false);

			const committed = latestPositionRef.current;
			if (committed !== null) setPosition(committed);

			shellRef.current?.releasePointerCapture?.(event.pointerId);
		};

		window.addEventListener('pointermove', handleMove);
		window.addEventListener('pointerup', stopDragging);
		window.addEventListener('pointercancel', stopDragging);
		return () => {
			window.removeEventListener('pointermove', handleMove);
			window.removeEventListener('pointerup', stopDragging);
			window.removeEventListener('pointercancel', stopDragging);
		};
	}, [
		edgeGap,
		getBounds,
		isDragging,
		latestPositionRef,
		latestSizeRef,
		setPosition,
		shellRef,
	]);

	const startResize = useCallback(
		(handle: WindowResizeHandle) => (event: ReactPointerEvent<HTMLElement>) => {
			if (!isPrimaryPointer(event) || position === null || size === null)
				return;

			event.preventDefault();
			event.stopPropagation();
			activate();

			shellRef.current?.setPointerCapture?.(event.pointerId);
			resizeStateRef.current = {
				pointerId: event.pointerId,
				originX: event.clientX,
				originY: event.clientY,
				startWidth: size.width,
				startHeight: size.height,
				startLeft: position.left,
				startTop: position.top,
				handle,
			};
			setIsResizing(true);
		},
		[activate, position, shellRef, size],
	);

	useEffect(() => {
		if (!isResizing) return;

		const handleMove = (event: PointerEvent) => {
			const state = resizeStateRef.current;
			if (!state || state.pointerId !== event.pointerId) return;

			const bounds = getBounds();
			if (bounds === null) return;

			const { position: nextPosition, size: nextSize } =
				resizeWindowFromPointer({
					bounds,
					edgeGap,
					minSize,
					pointerX: event.clientX,
					pointerY: event.clientY,
					state,
				});

			latestSizeRef.current = nextSize;
			latestPositionRef.current = nextPosition;
			const shell = shellRef.current;
			if (shell) {
				shell.style.width = `${nextSize.width}px`;
				shell.style.height = `${nextSize.height}px`;
				shell.style.transform = `translate3d(${nextPosition.left}px, ${nextPosition.top}px, 0)`;
			}
		};

		const stopResizing = (event: PointerEvent) => {
			const state = resizeStateRef.current;
			if (!state || state.pointerId !== event.pointerId) return;

			resizeStateRef.current = null;
			setIsResizing(false);

			const committedSize = latestSizeRef.current;
			const committedPosition = latestPositionRef.current;
			if (committedSize !== null) setSize(committedSize);
			if (committedPosition !== null) setPosition(committedPosition);

			shellRef.current?.releasePointerCapture?.(event.pointerId);
		};

		window.addEventListener('pointermove', handleMove);
		window.addEventListener('pointerup', stopResizing);
		window.addEventListener('pointercancel', stopResizing);
		return () => {
			window.removeEventListener('pointermove', handleMove);
			window.removeEventListener('pointerup', stopResizing);
			window.removeEventListener('pointercancel', stopResizing);
		};
	}, [
		edgeGap,
		getBounds,
		isResizing,
		latestPositionRef,
		latestSizeRef,
		minSize,
		setPosition,
		setSize,
		shellRef,
	]);

	return {
		handleDragStart,
		isDragging,
		isResizing,
		latestPositionRef,
		latestSizeRef,
		startResize,
	};
}
