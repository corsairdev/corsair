'use client';

import { Check, Copy } from '@phosphor-icons/react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';

const INSTALL_CMD = 'npm i corsair';

export function CopyInstallCommand() {
	const [copied, setCopied] = useState(false);

	const copy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(INSTALL_CMD);
			setCopied(true);
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		} catch {
			setCopied(false);
		}
	}, []);

	return (
		<div className="flex w-full max-w-full items-center gap-1 rounded-none border border-border bg-muted/40 px-3 py-2.5 font-mono text-sm text-foreground ring-1 ring-foreground/10">
			<code className="min-w-0 flex-1 truncate text-left">{INSTALL_CMD}</code>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				className="shrink-0"
				onClick={() => {
					void copy();
				}}
				aria-label={copied ? 'Copied' : 'Copy install command'}
			>
				{copied ? (
					<Check className="size-4 text-primary" weight="bold" />
				) : (
					<Copy className="size-4" />
				)}
			</Button>
		</div>
	);
}
