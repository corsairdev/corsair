'use client';

import { Check, Copy } from '@phosphor-icons/react';
import { useCallback, useState } from 'react';

import { cn } from '@/lib/utils';

export function CopyableCommand({ command }: { command: string }) {
	const [copied, setCopied] = useState(false);

	const copy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(command);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	}, [command]);

	return (
		<div className="mt-2 flex items-start gap-2 rounded-lg border border-border/70 bg-muted/40 p-3">
			<code className="flex-1 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap">
				{command}
			</code>
			<button
				type="button"
				onClick={() => {
					void copy();
				}}
				className={cn(
					'inline-flex shrink-0 items-center justify-center rounded-md border border-border/70 bg-card p-1.5 transition-colors',
					'hover:bg-muted',
				)}
				aria-label={copied ? 'Copied' : 'Copy command'}
			>
				{copied ? (
					<Check size={14} weight="bold" aria-hidden />
				) : (
					<Copy size={14} aria-hidden />
				)}
			</button>
		</div>
	);
}
