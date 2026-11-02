'use client';

import { Check, Copy } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

type View = 'human' | 'machine';

const HASH = '#machine';

function Toggle({
	view,
	onChange,
	className,
}: {
	view: View;
	onChange: (view: View) => void;
	className?: string;
}) {
	return (
		<div
			role="group"
			aria-label="Show this page for"
			className={cn(
				'inline-flex rounded-full border border-[#1c1c1c]/10 bg-white p-0.5 font-[family-name:var(--landing-font-mono)] text-[12px]',
				className,
			)}
		>
			{(['human', 'machine'] as const).map((option) => (
				<button
					key={option}
					type="button"
					aria-pressed={view === option}
					onClick={() => onChange(option)}
					className={cn(
						'rounded-full px-3 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5]',
						view === option
							? 'bg-[#4a38f5]/10 text-[#3d2ee0]'
							: 'text-[#1c1c1c99] hover:text-[#1c1c1c]',
					)}
				>
					{option}
				</button>
			))}
		</div>
	);
}

function MachineView({
	markdown,
	onChange,
}: {
	markdown: string;
	onChange: (view: View) => void;
}) {
	const [copied, setCopied] = useState(false);
	const copy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(markdown);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	}, [markdown]);

	return (
		<main className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<Toggle view="machine" onChange={onChange} />
				<div className="flex items-center gap-4 text-[13px]">
					<a
						href="/index.md"
						className="font-medium text-[#4a38f5] no-underline hover:underline"
					>
						index.md
					</a>
					<a
						href="/skill.md"
						className="font-medium text-[#4a38f5] no-underline hover:underline"
					>
						skill.md
					</a>
					<button
						type="button"
						onClick={() => {
							void copy();
						}}
						className="inline-flex items-center gap-1.5 font-medium text-[#1c1c1c] hover:text-[#4a38f5]"
					>
						{copied ? (
							<Check size={14} weight="bold" aria-hidden />
						) : (
							<Copy size={14} aria-hidden />
						)}
						{copied ? 'Copied' : 'Copy'}
					</button>
				</div>
			</div>
			<pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-[#1c1c1c]/10 bg-white p-5 font-[family-name:var(--landing-font-mono)] text-[13px] leading-relaxed text-[#1c1c1c] sm:p-6">
				{markdown}
			</pre>
		</main>
	);
}

/**
 * The homepage for people, or the same page as markdown for agents
 * (okibi.ai's human/machine switch). `#machine` opens the markdown view.
 */
export function ViewSwitch({
	children,
	footer,
	markdown,
}: {
	children: ReactNode;
	/** Shown in both views, above the switch. */
	footer: ReactNode;
	markdown: string;
}) {
	const [view, setView] = useState<View>('human');

	useEffect(() => {
		const sync = () =>
			setView(window.location.hash === HASH ? 'machine' : 'human');
		sync();
		window.addEventListener('hashchange', sync);
		return () => window.removeEventListener('hashchange', sync);
	}, []);

	const change = useCallback((next: View) => {
		setView(next);
		const url = `${window.location.pathname}${window.location.search}${next === 'machine' ? HASH : ''}`;
		window.history.replaceState(null, '', url);
		window.scrollTo({ top: 0 });
	}, []);

	return (
		<>
			{view === 'machine' ? (
				<MachineView markdown={markdown} onChange={change} />
			) : (
				children
			)}
			{footer}
			<div className="flex justify-center pb-8">
				<Toggle view={view} onChange={change} />
			</div>
		</>
	);
}
