'use client';

import { Check, Copy } from '@phosphor-icons/react';
import { useCallback, useState } from 'react';

export const LANDING_CTA_BOX_CLASS =
	'inline-flex max-w-full items-center rounded-sm border border-[#1c1c1c14] bg-[#f4f4f4] px-2 py-0.5 font-[family-name:var(--landing-font-mono)] text-[12px] font-normal leading-none text-[#1c1c1c] no-underline transition-colors hover:border-[#1c1c1c33] hover:text-[#4a38f5] md:text-[13px]';

export function CopyableCodeSnippet({
	code,
	inline = false,
	cta = false,
	className = '',
}: {
	code: string;
	inline?: boolean;
	cta?: boolean;
	className?: string;
}) {
	const [copied, setCopied] = useState(false);

	const copy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	}, [code]);

	const iconClass = inline ? 'size-3.5' : 'size-4';

	if (cta) {
		return (
			<button
				type="button"
				onClick={() => {
					void copy();
				}}
				data-cursor="btn"
				className={`${LANDING_CTA_BOX_CLASS} cursor-pointer ${className}`}
				aria-label={copied ? 'Copied' : `Copy ${code}`}
			>
				{copied ? 'Copied!' : code}
			</button>
		);
	}

	return (
		<span
			className={
				inline
					? `inline-flex max-w-full items-center gap-1 rounded-sm border border-[#1c1c1c14] bg-[#f4f4f4] px-2 py-0.5 align-middle ${className}`
					: `flex w-full items-center gap-2 rounded-sm border border-[#1c1c1c1a] bg-[#fafafa] px-3 py-2.5 ${className}`
			}
		>
			<code
				className={
					inline
						? 'font-[family-name:var(--landing-font-mono)] text-[12px] font-normal leading-none text-[#1c1c1c] md:text-[13px]'
						: 'min-w-0 flex-1 truncate text-left font-[family-name:var(--landing-font-mono)] text-[13px] text-[#1c1c1c] md:text-sm'
				}
			>
				{code}
			</code>
			<button
				type="button"
				onClick={() => {
					void copy();
				}}
				className={
					inline
						? 'inline-flex shrink-0 items-center justify-center rounded-sm p-0.5 text-[#1c1c1c66] transition-colors hover:text-[#1c1c1c]'
						: 'inline-flex shrink-0 items-center justify-center rounded-sm p-1.5 text-[#1c1c1c99] transition-colors hover:bg-[#1c1c1c0d] hover:text-[#1c1c1c]'
				}
				aria-label={copied ? 'Copied' : `Copy ${code}`}
			>
				{copied ? (
					<Check className={`${iconClass} text-[#4a38f5]`} weight="bold" aria-hidden />
				) : (
					<Copy className={iconClass} aria-hidden />
				)}
			</button>
		</span>
	);
}
