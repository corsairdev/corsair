'use client';

import { Check, Copy } from '@phosphor-icons/react';
import { useCallback, useState } from 'react';

export function BlogCodeBlock({
	code,
	filename,
	language,
}: {
	code: string;
	filename?: string;
	language?: string;
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

	return (
		<figure className="my-6 overflow-hidden rounded-lg border border-[#1c1c1c1a] bg-[#fafafa]">
			<div className="flex items-center justify-between gap-3 border-b border-[#1c1c1c14] px-4 py-2">
				<figcaption className="min-w-0 truncate font-[family-name:var(--landing-font-mono)] text-xs text-[#1c1c1c99]">
					{filename || language}
				</figcaption>
				<button
					type="button"
					onClick={() => {
						void copy();
					}}
					className="inline-flex shrink-0 items-center gap-1 rounded-sm px-1.5 py-1 text-xs text-[#1c1c1c99] transition-colors hover:bg-[#1c1c1c0d] hover:text-[#1c1c1c]"
					aria-label={copied ? 'Copied' : 'Copy code'}
				>
					{copied ? (
						<Check className="size-3.5 text-[#4a38f5]" weight="bold" />
					) : (
						<Copy className="size-3.5" />
					)}
					{copied ? 'Copied' : 'Copy'}
				</button>
			</div>
			<pre className="overflow-x-auto px-4 py-3 font-[family-name:var(--landing-font-mono)] text-[13px] leading-relaxed text-[#1c1c1c]">
				<code>{code}</code>
			</pre>
		</figure>
	);
}
