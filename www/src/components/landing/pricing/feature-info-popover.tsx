'use client';

import { Info } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export function FeatureInfoPopover({
	label,
	content,
}: {
	label: string;
	content: ReactNode;
}) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = useId();
	const [open, setOpen] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });

	const updatePosition = useCallback(() => {
		const button = buttonRef.current;
		if (!button) return;

		const rect = button.getBoundingClientRect();
		const popoverWidth = 300;
		const padding = 16;
		const left = Math.min(
			Math.max(padding, rect.right - popoverWidth),
			window.innerWidth - popoverWidth - padding,
		);

		setPosition({
			top: rect.bottom + 8,
			left,
		});
	}, []);

	useEffect(() => {
		if (!open) return;

		updatePosition();

		const onScroll = () => updatePosition();
		const onResize = () => updatePosition();

		window.addEventListener('scroll', onScroll, true);
		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('scroll', onScroll, true);
			window.removeEventListener('resize', onResize);
		};
	}, [open, updatePosition]);

	useEffect(() => {
		if (!open) return;

		const onPointerDown = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				buttonRef.current?.contains(target) ||
				popoverRef.current?.contains(target)
			) {
				return;
			}
			setOpen(false);
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false);
		};

		document.addEventListener('mousedown', onPointerDown, true);
		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.removeEventListener('mousedown', onPointerDown, true);
			document.removeEventListener('keydown', onKeyDown);
		};
	}, [open]);

	return (
		<>
			<button
				ref={buttonRef}
				type="button"
				className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[#1c1c1c]/35 transition-colors hover:text-[#1c1c1c]/70"
				aria-label={`More information about ${label}`}
				aria-expanded={open}
				aria-controls={popoverId}
				onClick={() => {
					setOpen((prev) => {
						const next = !prev;
						if (next) updatePosition();
						return next;
					});
				}}
			>
				<Info size={14} weight="fill" aria-hidden />
			</button>

			{open
				? createPortal(
						<div
							ref={popoverRef}
							id={popoverId}
							role="tooltip"
							className="fixed z-[100] w-[300px] rounded-md border border-[#1c1c1c1a] bg-white p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
							style={{ top: position.top, left: position.left }}
						>
							<div className="flex flex-col gap-2.5 text-[13px] leading-[1.6] text-[#1c1c1c99]">
								{content}
							</div>
						</div>,
						document.body,
					)
				: null}
		</>
	);
}
