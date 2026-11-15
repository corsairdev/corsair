'use client';

import { ArrowRight } from '@phosphor-icons/react';
import type { FormEvent } from 'react';
import { useEffect, useId, useRef, useState } from 'react';

import { readLugHandleAnswer } from '@/lib/lug-handle';
import { hubLugClaimUrl, LUG_URL, lugHandleProblem } from '@/lib/site-links';
import { cn } from '@/lib/utils';

import { ClientMark } from '../agent-roles/agent-chat-window';
import { AGENT_CLIENTS } from '../agent-roles/agent-clients';
import { TypewriterPlaceholder } from './typewriter-placeholder';

function problemText(handle: string): string | null {
	if (!handle) return null;
	const problem = lugHandleProblem(handle);
	if (problem === 'reserved') return 'That name is reserved. Try another.';
	if (problem === 'format') {
		return 'Use lowercase letters, numbers and single hyphens, up to 32 characters.';
	}
	return null;
}

type Check =
	| { handle: string; state: 'checking' | 'free' | 'error' }
	| {
			handle: string;
			state: 'taken' | 'reserved' | 'blocked';
			suggestion?: string;
	  };

const CHECK_DELAY_MS = 400;

/** "Introducing lug.dev": claim yourname.lug.dev, then sign in on Hub. */
export function LugIntroSection() {
	const inputId = useId();
	const hintId = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const [value, setValue] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [check, setCheck] = useState<Check | null>(null);
	// The name Claim was pressed for, while its check is still running.
	const [pendingHandle, setPendingHandle] = useState<string | null>(null);
	const handle = value.trim().toLowerCase();
	const problem = problemText(handle);
	const showProblem = Boolean(problem) && (submitted || handle.length > 2);
	const current = check?.handle === handle ? check : null;
	const unavailable =
		current?.state === 'taken' ||
		current?.state === 'reserved' ||
		current?.state === 'blocked';

	// Same check lug.dev runs before it hands off, so nobody signs up for a
	// name that is already taken.
	useEffect(() => {
		if (!handle || lugHandleProblem(handle)) {
			setCheck(null);
			return;
		}
		setCheck({ handle, state: 'checking' });
		const controller = new AbortController();
		const timer = window.setTimeout(async () => {
			try {
				const res = await fetch(
					`/api/lug-handle?${new URLSearchParams({ handle })}`,
					{ signal: controller.signal },
				);
				const answer = res.ok
					? readLugHandleAnswer(await res.json().catch(() => null))
					: null;
				if (!answer) setCheck({ handle, state: 'error' });
				else if (answer.available) setCheck({ handle, state: 'free' });
				else
					setCheck({
						handle,
						state: answer.reason === 'format' ? 'blocked' : answer.reason,
						suggestion: answer.suggestion,
					});
			} catch {
				if (!controller.signal.aborted) setCheck({ handle, state: 'error' });
			}
		}, CHECK_DELAY_MS);
		return () => {
			window.clearTimeout(timer);
			controller.abort();
		};
	}, [handle]);

	// Hand off once the check for the submitted name answers. Editing the name
	// cancels the claim, so nobody is sent to sign up for a name they didn't
	// submit. If the check itself fails, Hub still checks on /me.
	useEffect(() => {
		if (!pendingHandle) return;
		if (pendingHandle !== handle) {
			setPendingHandle(null);
			return;
		}
		if (!current || current.state === 'checking') return;
		setPendingHandle(null);
		if (current.state === 'free' || current.state === 'error') {
			window.location.assign(hubLugClaimUrl(pendingHandle));
		}
	}, [pendingHandle, handle, current]);

	const focusAtEnd = () => {
		const input = inputRef.current;
		if (!input) return;
		input.focus({ preventScroll: true });
		input.setSelectionRange(input.value.length, input.value.length);
	};

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitted(true);
		if (!handle || problem || unavailable) return;
		setPendingHandle(handle);
	};

	const hint = showProblem
		? problem
		: current?.state === 'taken'
			? `${handle}.lug.dev is taken.`
			: current?.state === 'reserved'
				? 'That name is reserved. Try another.'
				: current?.state === 'blocked'
					? "That name isn't available. Try another."
					: current?.state === 'free'
						? `${handle}.lug.dev is free.`
						: current?.state === 'checking'
							? 'Checking…'
							: current?.state === 'error'
								? "Couldn't check right now. Corsair checks again after you sign in."
								: 'Sign in next to claim it.';
	const tone =
		showProblem || unavailable
			? 'bad'
			: current?.state === 'free'
				? 'good'
				: 'neutral';
	const suggestion =
		current?.state === 'taken' ? current.suggestion : undefined;

	return (
		<section
			id="lug"
			aria-labelledby="lug-heading"
			className="relative w-full scroll-mt-16 py-14 sm:py-20"
		>
			<div className="mx-auto max-w-[760px] px-4 text-center sm:px-6">
				<span className="inline-flex rounded-full border border-[#4a38f5]/20 bg-[#4a38f5]/[0.06] px-2.5 py-0.5 text-[12px] font-medium text-[#3d2ee0]">
					New
				</span>
				<h2
					id="lug-heading"
					className="mt-3 font-[family-name:var(--landing-font-serif)] text-[clamp(1.85rem,4vw,2.9rem)] font-light leading-[1.1] tracking-[-0.02em] text-balance text-[#1c1c1c]"
				>
					Introducing lug.dev, your own MCP address
				</h2>
				<p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-[#1c1c1c99]">
					Claim yourname.lug.dev, connect your apps once, and add the one
					address to every AI tool you use. Nothing to install.
				</p>

				<form
					onSubmit={onSubmit}
					noValidate
					className="mx-auto mt-8 max-w-[640px] text-left"
				>
					<label htmlFor={inputId} className="sr-only">
						Claim your address
					</label>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
						{/* One address: the suffix follows whatever is typed (or the
						    typewriter), like the field on lug.dev. */}
						<div
							onMouseDown={(event) => {
								if (event.target === inputRef.current) return;
								event.preventDefault();
								focusAtEnd();
							}}
							className={cn(
								'lug-claim-field flex min-w-0 flex-1 cursor-text items-baseline overflow-hidden rounded-[14px] border bg-white px-4 py-3 font-[family-name:var(--landing-font-mono)] text-[clamp(1.25rem,4.4vw,1.85rem)] leading-snug tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(28,28,28,0.05)] transition-[border-color,box-shadow] duration-150',
								tone === 'bad'
									? 'border-red-300'
									: tone === 'good'
										? 'border-emerald-400'
										: 'border-[#1c1c1c]/14 hover:border-[#1c1c1c]/25',
							)}
						>
							<span className="relative min-w-[1ch] overflow-hidden whitespace-pre pr-[2px]">
								{value ? (
									<span aria-hidden className="invisible">
										{value}
									</span>
								) : (
									<span aria-hidden className="pointer-events-none">
										<TypewriterPlaceholder />
									</span>
								)}
								{'\u200b'}
								<input
									ref={inputRef}
									id={inputId}
									value={value}
									onChange={(event) =>
										setValue(event.target.value.replace(/\s/g, '-'))
									}
									size={1}
									autoComplete="off"
									autoCapitalize="none"
									autoCorrect="off"
									spellCheck={false}
									enterKeyHint="go"
									maxLength={32}
									aria-invalid={tone === 'bad'}
									aria-describedby={hintId}
									className="absolute inset-0 size-full bg-transparent p-0 text-[#4a38f5] caret-[#4a38f5] outline-none selection:bg-[#4a38f5]/15"
								/>
							</span>
							<span
								aria-hidden
								className="flex-none select-none whitespace-nowrap text-[#1c1c1c66]"
							>
								.lug.dev
							</span>
						</div>
						<button
							type="submit"
							className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#1c1c1c] px-6 py-3 text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_6px_14px_-8px_rgba(28,28,28,0.6)] transition-colors hover:bg-[#333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5]"
						>
							{pendingHandle === handle && handle ? 'Checking…' : 'Claim it'}
							<ArrowRight size={16} weight="bold" aria-hidden />
						</button>
					</div>
					<p
						id={hintId}
						aria-live="polite"
						className={cn(
							'mt-2.5 min-h-[1.25rem] px-1 text-[13px]',
							tone === 'bad'
								? 'text-red-700'
								: tone === 'good'
									? 'text-emerald-700'
									: 'text-[#1c1c1c66]',
						)}
					>
						{hint}
						{suggestion ? (
							<>
								{' '}
								<button
									type="button"
									onClick={() => {
										setValue(suggestion);
										inputRef.current?.focus();
									}}
									className="font-medium text-[#4a38f5] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5]"
								>
									Use {suggestion}
								</button>
							</>
						) : null}
					</p>
				</form>

				<p className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-[#1c1c1c99]">
					<span className="flex items-center gap-1.5 text-[#1c1c1c]">
						{AGENT_CLIENTS.map((client) => (
							<ClientMark
								key={client.id}
								skin={client}
								size={14}
								color={client.brand}
							/>
						))}
					</span>
					<span>Works in Claude, ChatGPT, Cursor and any MCP client</span>
					<span aria-hidden>·</span>
					<span>400+ apps</span>
					<span aria-hidden>·</span>
					<span>Approvals before anything risky</span>
				</p>
				<p className="mt-4 text-[14px]">
					<a
						href={LUG_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium text-[#4a38f5] no-underline hover:underline"
					>
						See how lug.dev works
					</a>
				</p>
			</div>
		</section>
	);
}
