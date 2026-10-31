'use client';

import { Check, Copy } from '@phosphor-icons/react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

export function CopyPromptButton({
	prompt,
	className,
}: {
	prompt: string;
	className?: string;
}) {
	const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(prompt);
			setState('copied');
		} catch {
			setState('failed');
		}
		window.setTimeout(() => setState('idle'), 2000);
	};

	return (
		<button
			type="button"
			onClick={() => {
				void copy();
			}}
			className={cn(
				'inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#1c1c1c] px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5]',
				className,
			)}
		>
			{state === 'copied' ? (
				<Check size={14} weight="bold" aria-hidden />
			) : (
				<Copy size={14} aria-hidden />
			)}
			<span aria-live="polite">
				{state === 'copied'
					? 'Copied'
					: state === 'failed'
						? 'Select and copy it'
						: 'Copy prompt'}
			</span>
		</button>
	);
}
