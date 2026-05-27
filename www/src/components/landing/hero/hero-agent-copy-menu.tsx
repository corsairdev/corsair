'use client';

import { Copy } from '@phosphor-icons/react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { CopyFeedbackIcon } from '../copy-feedback-icon';
import { cn } from '@/lib/utils';

const LLMS_PROMPT = 'Set up Corsair. Use docs.corsair.dev/llms.txt';
const SKILLS_CMD = 'npx skills add corsairdev/corsair';

const COPY_OPTIONS = [
	{
		id: 'llms',
		label: 'Setup prompt',
		preview: LLMS_PROMPT,
		value: LLMS_PROMPT,
	},
	{
		id: 'skills',
		label: 'Agent skill',
		preview: SKILLS_CMD,
		value: SKILLS_CMD,
	},
] as const;

export function HeroAgentCopyMenu({
	variant = 'light',
}: {
	variant?: 'light' | 'dark';
}) {
	const menuId = useId();
	const containerRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const copyOption = useCallback(async (id: string, value: string) => {
		try {
			await navigator.clipboard.writeText(value);
			setCopiedId(id);
			window.setTimeout(() => setCopiedId(null), 2000);
		} catch {
			setCopiedId(null);
		}
	}, []);

	useEffect(() => {
		if (!open) return;

		const onPointerDown = (event: MouseEvent) => {
			if (!containerRef.current?.contains(event.target as Node)) {
				setOpen(false);
			}
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false);
		};

		document.addEventListener('pointerdown', onPointerDown);
		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('keydown', onKeyDown);
		};
	}, [open]);

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				className={cn(
					'inline-flex h-full items-center justify-center px-3 py-3 transition-colors duration-300 ease-out',
					variant === 'dark'
						? 'border-l border-white/15 text-white/70 hover:bg-white/10 hover:text-white'
						: 'text-[#1c1c1c]/70 hover:bg-white hover:text-[#1c1c1c]',
				)}
				aria-label="Copy for agents"
				aria-haspopup="menu"
				aria-expanded={open}
				aria-controls={menuId}
				onClick={() => setOpen((prev) => !prev)}
			>
				<Copy className="size-4" aria-hidden />
			</button>

			{open ? (
				<div
					id={menuId}
					role="menu"
					className="absolute left-1/2 top-[calc(100%+0.5rem)] z-20 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-lg border border-[#1c1c1c]/10 bg-white p-1 shadow-[0_8px_32px_rgba(0,0,0,0.08)] animate-[landing-modal-in_220ms_ease-out] motion-reduce:animate-none sm:left-auto sm:right-0 sm:translate-x-0"
				>
					{COPY_OPTIONS.map((option) => {
						const copied = copiedId === option.id;

						return (
							<button
								key={option.id}
								type="button"
								role="menuitem"
								className={cn(
									'flex w-full flex-col gap-1 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-[#1c1c1c]/[0.04]',
								)}
								onClick={() => {
									void copyOption(option.id, option.value);
								}}
							>
								<span className="flex items-center justify-between gap-2">
									<span className="text-sm font-medium text-[#1c1c1c] font-[family-name:var(--landing-font-sans)]">
										{option.label}
									</span>
									<CopyFeedbackIcon
										copied={copied}
										iconClassName="size-4"
										copyClassName="text-[#1c1c1c]/40"
									/>
								</span>
								<span className="font-[family-name:var(--landing-font-mono)] text-[11px] leading-snug text-[#1c1c1c]/60 sm:text-xs">
									{option.preview}
								</span>
							</button>
						);
					})}
				</div>
			) : null}
		</div>
	);
}
