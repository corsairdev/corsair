'use client';

import { Check, Copy } from '@phosphor-icons/react';

import { cn } from '@/lib/utils';

export function CopyFeedbackIcon({
	copied,
	className,
	iconClassName = 'size-4',
	copyClassName,
	checkClassName,
}: {
	copied: boolean;
	className?: string;
	iconClassName?: string;
	copyClassName?: string;
	checkClassName?: string;
}) {
	return (
		<span
			className={cn(
				'landing-copy-feedback-icon relative inline-flex shrink-0 items-center justify-center',
				iconClassName,
				className,
			)}
			aria-hidden
		>
			<span
				className={cn(
					'absolute inset-0 rounded-full bg-[#4a38f5]/12 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none',
					copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
				)}
			/>
			<Copy
				className={cn(
					'absolute inset-0 m-auto transition-[transform,opacity] duration-200 ease-in motion-reduce:transition-none',
					iconClassName,
					copyClassName,
					copied ? 'scale-[0.45] opacity-0 -rotate-[14deg]' : 'scale-100 opacity-100 rotate-0',
				)}
			/>
			<Check
				weight="bold"
				className={cn(
					'absolute inset-0 m-auto text-[#4a38f5] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none',
					iconClassName,
					checkClassName,
					copied
						? 'scale-100 opacity-100 rotate-0 delay-75'
						: 'pointer-events-none scale-[0.5] opacity-0 rotate-[12deg] delay-0',
				)}
			/>
		</span>
	);
}
