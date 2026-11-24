'use client';

import { useId, useRef } from 'react';

import { HANDLE_MAX_LENGTH } from '@/lib/claim-handle';
import type { StartSkill } from '@/lib/claim-skills';
import { skillBySlug } from '@/lib/gateway-skills';
import { cn } from '@/lib/utils';

import { PrimaryButton } from './primary-button';
import type { PassageApi } from './use-passage';

type Tone = 'note' | 'bad' | 'good';

const TONE_CLASS: Record<Tone, string> = {
	note: 'text-[#1c1c1c66]',
	bad: 'text-red-700',
	good: 'text-emerald-700',
};

function formatHint(handle: string): string {
	if (/[^a-z0-9-]/.test(handle)) {
		return 'Use only lowercase letters, numbers and hyphens.';
	}
	if (handle.startsWith('-') || handle.endsWith('-')) {
		return "It can't start or end with a hyphen.";
	}
	return "It can't have two hyphens there.";
}

function status(
	api: PassageApi,
	skills: readonly StartSkill[],
): { text: string; tone: Tone } {
	const { p, problem, checkFailed, claimReady } = api;
	const skill = p.skill ? skillBySlug(skills, p.skill) : undefined;
	if (!p.handle) {
		return {
			text: skill
				? `Pick a name, then you'll set up ${skill.name}.`
				: 'Lowercase letters, numbers and hyphens, up to 32.',
			tone: 'note',
		};
	}
	if (problem === 'checking') return { text: 'Checking…', tone: 'note' };
	if (problem === 'taken')
		return { text: `${p.handle}.lug.dev is taken.`, tone: 'bad' };
	if (problem === 'reserved') {
		return { text: 'That name is reserved. Try another.', tone: 'bad' };
	}
	if (problem === 'blocked') {
		return { text: "That name isn't available. Try another.", tone: 'bad' };
	}
	if (problem === 'format') return { text: formatHint(p.handle), tone: 'bad' };
	if (checkFailed) {
		return {
			text: "Couldn't check right now. Corsair checks again before you sign in.",
			tone: 'note',
		};
	}
	if (claimReady) return { text: `${p.handle}.lug.dev is free.`, tone: 'good' };
	return { text: '', tone: 'note' };
}

/** Step 1: the name in yourname.lug.dev, checked with Hub as it's typed. */
export function NameStep({
	api,
	skills,
}: {
	api: PassageApi;
	skills: readonly StartSkill[];
}) {
	const { p, send, claimReady, suggestion } = api;
	const id = useId();
	const input = useRef<HTMLInputElement>(null);
	const { text, tone } = status(api, skills);
	const chars = Math.max(1, p.handle.length || 'yourname'.length);

	return (
		<div className="px-5 py-5 sm:px-6">
			<label htmlFor={id} className="text-[15px] font-medium text-[#1c1c1c]">
				Choose a name for your URL
			</label>
			<div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
				{/* The whole bar is the field: a press anywhere off the input puts the caret at the end. */}
				<div
					onMouseDown={(e) => {
						if (e.target === input.current) return;
						e.preventDefault();
						const el = input.current;
						el?.focus({ preventScroll: true });
						el?.setSelectionRange(el.value.length, el.value.length);
					}}
					className={cn(
						'flex min-w-0 flex-1 cursor-text items-center rounded-lg border px-4 bg-[#fafafa] font-[family-name:var(--landing-font-mono)] text-[16px] transition-colors focus-within:border-[#4a38f5]/60 focus-within:bg-white sm:text-[18px]',
						tone === 'bad'
							? 'border-red-300'
							: tone === 'good'
								? 'border-emerald-400'
								: 'border-[#1c1c1c]/15',
					)}
				>
					<span
						aria-hidden
						className="hidden shrink-0 text-[#1c1c1c66] sm:inline"
					>
						https://
					</span>
					<input
						ref={input}
						id={id}
						autoFocus
						value={p.handle}
						onChange={(e) => send({ type: 'typeHandle', raw: e.target.value })}
						placeholder="yourname"
						maxLength={HANDLE_MAX_LENGTH}
						autoComplete="off"
						autoCapitalize="none"
						autoCorrect="off"
						spellCheck={false}
						enterKeyHint="go"
						aria-invalid={tone === 'bad' || undefined}
						aria-describedby={`${id}-status`}
						style={{ width: `calc(${chars}ch + 2px)` }}
						className="ph-no-capture min-w-0 max-w-full shrink bg-transparent py-3.5 text-[#1c1c1c] outline-none placeholder:text-[#1c1c1c40]"
					/>
					<span aria-hidden className="shrink-0 text-[#1c1c1c99]">
						.lug.dev
					</span>
				</div>
				<PrimaryButton disabled={!claimReady}>Continue</PrimaryButton>
			</div>
			<p
				id={`${id}-status`}
				aria-live="polite"
				className={cn(
					'ph-no-capture mt-2 min-h-5 text-[13px]',
					TONE_CLASS[tone],
				)}
			>
				{text}
				{suggestion ? (
					<>
						{' '}
						<button
							type="button"
							onClick={() => {
								send({ type: 'typeHandle', raw: suggestion });
								input.current?.focus();
							}}
							className="font-medium text-[#4a38f5] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5]"
						>
							Use {suggestion}
						</button>
					</>
				) : null}
			</p>
		</div>
	);
}
