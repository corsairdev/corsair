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

export function HeroAppCta() {
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

		const onClickOutside = (event: MouseEvent) => {
			if (!containerRef.current?.contains(event.target as Node)) {
				setOpen(false);
			}
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false);
		};

		// Defer so the opening tap does not immediately close the menu on mobile.
		const timeoutId = window.setTimeout(() => {
			document.addEventListener('click', onClickOutside, true);
		}, 0);

		document.addEventListener('keydown', onKeyDown);
		return () => {
			window.clearTimeout(timeoutId);
			document.removeEventListener('click', onClickOutside, true);
			document.removeEventListener('keydown', onKeyDown);
		};
	}, [open]);

	return (
		<div
			ref={containerRef}
			className="group/app-cta relative flex w-full items-stretch overflow-visible rounded-lg border border-[#1c1c1c] bg-[#1c1c1c] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 ease-out hover:bg-[#2a2a2a] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-0 sm:inline-flex sm:w-auto"
		>
			<a
				href="https://app.corsair.dev"
				target="_blank"
				rel="noopener noreferrer"
				data-cursor="btn"
				className="inline-flex flex-1 touch-manipulation items-center justify-center gap-2 px-6 py-3 text-sm font-[family-name:var(--landing-font-sans)] font-medium text-white no-underline sm:flex-none"
			>
				Go to app
				<span className="transition-transform duration-300 ease-out group-hover/app-cta:translate-x-1">
					→
				</span>
			</a>

			<button
				type="button"
				data-cursor="btn"
				className="inline-flex shrink-0 touch-manipulation items-center justify-center border-l border-white/15 px-3 py-3 text-white/70 transition-colors duration-300 ease-out hover:bg-white/10 hover:text-white active:bg-white/15"
				aria-label="Copy for agents"
				aria-haspopup="menu"
				aria-expanded={open}
				aria-controls={menuId}
				onClick={(event) => {
					event.stopPropagation();
					setOpen((prev) => !prev);
				}}
			>
				<Copy className="size-4" aria-hidden />
			</button>

			{open ? (
				<div
					id={menuId}
					role="menu"
					className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-lg border border-[#1c1c1c]/10 bg-white p-1 shadow-[0_8px_32px_rgba(0,0,0,0.08)] animate-[landing-modal-in_220ms_ease-out] motion-reduce:animate-none sm:inset-x-auto sm:right-0 sm:w-80"
				>
					{COPY_OPTIONS.map((option) => {
						const copied = copiedId === option.id;

						return (
							<button
								key={option.id}
								type="button"
								role="menuitem"
								data-cursor="btn"
								className={cn(
									'flex w-full touch-manipulation flex-col gap-1 rounded-md px-3 py-3 text-left transition-colors active:bg-[#1c1c1c]/[0.08] sm:py-2.5 sm:hover:bg-[#1c1c1c]/[0.04]',
								)}
								onClick={(event) => {
									event.stopPropagation();
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
