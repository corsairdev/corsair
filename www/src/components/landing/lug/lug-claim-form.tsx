'use client';

import { ArrowRight } from '@phosphor-icons/react';
import type { FormEvent } from 'react';
import { useEffect, useId, useState } from 'react';

import { readLugHandleAnswer } from '@/lib/lug-handle';
import { hubLugClaimUrl, LUG_URL, lugHandleProblem } from '@/lib/site-links';
import { cn } from '@/lib/utils';

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

/** Claim yourname.lug.dev, then sign in on Hub to finish. */
export function LugClaimForm({
	label = 'Claim your address',
	className,
}: {
	label?: string;
	className?: string;
}) {
	const inputId = useId();
	const hintId = useId();
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
		<form
			onSubmit={onSubmit}
			noValidate
			className={cn('min-w-0 text-left', className)}
		>
			<label
				htmlFor={inputId}
				className="text-[13px] font-medium text-[#1c1c1c99]"
			>
				{label}
			</label>
			<div
				className={cn(
					'mt-2 flex min-w-0 items-center rounded-lg border bg-[#fafafa] font-[family-name:var(--landing-font-mono)] text-[15px] transition-colors focus-within:border-[#4a38f5]/60 focus-within:bg-white sm:text-[17px]',
					tone === 'bad'
						? 'border-red-300'
						: tone === 'good'
							? 'border-emerald-400'
							: 'border-[#1c1c1c]/15',
				)}
			>
				<span className="hidden shrink-0 pl-4 text-[#1c1c1c66] sm:inline">
					https://
				</span>
				<input
					id={inputId}
					value={value}
					onChange={(event) => setValue(event.target.value.replace(/\s/g, '-'))}
					placeholder="yourname"
					autoComplete="off"
					autoCapitalize="none"
					spellCheck={false}
					maxLength={32}
					aria-invalid={tone === 'bad'}
					aria-describedby={hintId}
					className="min-w-0 flex-1 bg-transparent py-3.5 pl-4 text-[#1c1c1c] outline-none placeholder:text-[#1c1c1c40] sm:pl-0"
				/>
				<span className="shrink-0 pr-4 text-[#1c1c1c99]">.lug.dev</span>
			</div>
			<p
				id={hintId}
				aria-live="polite"
				className={cn(
					'mt-2 min-h-[1.25rem] text-[13px]',
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
							onClick={() => setValue(suggestion)}
							className="font-medium text-[#4a38f5] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5]"
						>
							Use {suggestion}
						</button>
					</>
				) : null}
			</p>
			<div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
				<button
					type="submit"
					className="inline-flex items-center gap-2 rounded-lg bg-[#4a38f5] px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#3d2ee0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5]"
				>
					{pendingHandle === handle ? 'Checking…' : 'Claim it'}
					<ArrowRight size={16} weight="bold" aria-hidden />
				</button>
				<a
					href={LUG_URL}
					target="_blank"
					rel="noopener noreferrer"
					className="text-[14px] font-medium text-[#4a38f5] no-underline hover:underline"
				>
					See how lug.dev works
				</a>
			</div>
		</form>
	);
}
