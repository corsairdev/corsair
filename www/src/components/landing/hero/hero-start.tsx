'use client';

import { ArrowUpRight, Check, Copy } from '@phosphor-icons/react';
import type { KeyboardEvent } from 'react';
import { useCallback, useId, useRef, useState } from 'react';

import { AGENT_SETUP_PROMPT } from '@/lib/home-content';
import { SKILL_URL } from '@/lib/site-links';
import { cn } from '@/lib/utils';
import { LugClaimForm } from '../lug/lug-claim-form';

const TABS = [
	{ id: 'human', label: 'For you' },
	{ id: 'agent', label: 'For your agent' },
] as const;

type TabId = (typeof TABS)[number]['id'];

function AgentPanel() {
	const [copied, setCopied] = useState(false);
	const copy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(AGENT_SETUP_PROMPT);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	}, []);

	return (
		<div className="text-left">
			<p className="text-[13px] font-medium text-[#1c1c1c99]">
				Give this to your agent
			</p>
			<div className="mt-2 flex min-w-0 items-stretch overflow-hidden rounded-lg border border-[#1c1c1c]/15 bg-[#fafafa]">
				<code className="min-w-0 flex-1 break-words px-4 py-3.5 font-[family-name:var(--landing-font-mono)] text-[14px] leading-snug text-[#1c1c1c] sm:text-[15px]">
					{AGENT_SETUP_PROMPT}
				</code>
				<button
					type="button"
					onClick={() => {
						void copy();
					}}
					aria-label={copied ? 'Copied' : 'Copy the setup prompt'}
					className="flex shrink-0 items-center gap-1.5 border-l border-[#1c1c1c]/10 bg-white px-4 text-[14px] font-medium text-[#1c1c1c] transition-colors hover:text-[#4a38f5] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#4a38f5]"
				>
					{copied ? (
						<Check size={16} weight="bold" aria-hidden />
					) : (
						<Copy size={16} aria-hidden />
					)}
					<span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
				</button>
			</div>
			<p className="mt-2 min-h-[1.25rem] text-[13px] text-[#1c1c1c66]">
				Paste it into Claude Code, Codex, Cursor or any agent that can read a
				link. It adds Corsair and asks you to sign in.
			</p>
			<a
				href={SKILL_URL}
				className="mt-3 inline-flex items-center gap-1 text-[14px] font-medium text-[#4a38f5] no-underline hover:underline"
			>
				Read skill.md
				<ArrowUpRight size={14} weight="bold" aria-hidden />
			</a>
		</div>
	);
}

/** The hero's two ways in: claim a lug.dev address, or hand your agent the skill. */
export function HeroStart() {
	const baseId = useId();
	const [tab, setTab] = useState<TabId>('human');
	const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
		human: null,
		agent: null,
	});

	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
		event.preventDefault();
		const next: TabId = tab === 'human' ? 'agent' : 'human';
		setTab(next);
		tabRefs.current[next]?.focus();
	};

	return (
		<div className="w-full max-w-[560px]">
			<div
				role="tablist"
				aria-label="Get started"
				onKeyDown={onKeyDown}
				className="mx-auto inline-flex rounded-full border border-[#1c1c1c]/10 bg-white p-1 shadow-[0_2px_8px_rgba(28,28,28,0.04)]"
			>
				{TABS.map((t) => (
					<button
						key={t.id}
						ref={(node) => {
							tabRefs.current[t.id] = node;
						}}
						type="button"
						role="tab"
						id={`${baseId}-${t.id}-tab`}
						aria-selected={tab === t.id}
						aria-controls={`${baseId}-${t.id}-panel`}
						tabIndex={tab === t.id ? 0 : -1}
						onClick={() => setTab(t.id)}
						className={cn(
							'rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5]',
							tab === t.id
								? 'bg-[#1c1c1c] text-white'
								: 'text-[#1c1c1c99] hover:text-[#1c1c1c]',
						)}
					>
						{t.label}
					</button>
				))}
			</div>

			<div className="mt-4 rounded-xl border border-[#1c1c1c]/10 bg-white px-5 py-5 shadow-[0_8px_32px_rgba(28,28,28,0.06)] sm:px-6">
				{TABS.map((t) => (
					<div
						key={t.id}
						role="tabpanel"
						id={`${baseId}-${t.id}-panel`}
						aria-labelledby={`${baseId}-${t.id}-tab`}
						hidden={tab !== t.id}
					>
						{t.id === 'human' ? (
							<LugClaimForm label="Claim your address, then connect your apps" />
						) : (
							<AgentPanel />
						)}
					</div>
				))}
			</div>
		</div>
	);
}
