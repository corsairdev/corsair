'use client';

import { PaperPlaneTilt } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import type { ComboData, ComboKbTool } from '@/lib/combo-types';
import { cn } from '@/lib/utils';

const CHUNK = 2;
const TICK_MS = 16;
const ASK_MS = 180;
const GAP_MS = 620;
const RUN_MS = 980;
const ANSWER_PAUSE_MS = 280;

type Phase = 'idle' | 'tools' | 'answer' | 'done';
type ToolStatus = 'running' | 'done';

function Spinner() {
	return (
		<span
			className="size-3.5 shrink-0 animate-spin rounded-full border-[1.5px] border-[#4a38f522] border-t-[#4a38f5]"
			aria-hidden
		/>
	);
}

function CheckMark() {
	return (
		<span className="combo-agent-check" aria-hidden>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
				<circle cx="12" cy="12" r="10" stroke="#4a38f522" strokeWidth="1.5" />
				<path
					className="combo-agent-check-path"
					d="M7.5 12.5l3 3 6-7"
					stroke="#4a38f5"
					strokeWidth="1.75"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</span>
	);
}

function ToolRow({ tool, status }: { tool: ComboKbTool; status: ToolStatus }) {
	return (
		<li
			className={cn(
				'combo-agent-row relative flex items-center gap-3 px-3 py-2.5',
				status === 'running' && 'combo-agent-running',
			)}
		>
			<span
				className={cn(
					'absolute inset-y-0 left-0 w-[2px]',
					status === 'running' ? 'bg-[#4a38f5]' : 'bg-transparent',
				)}
				aria-hidden
			/>
			<span className="relative z-[1] flex shrink-0 items-center">
				{tool.apps.map((app, i) => (
					<span
						key={`${app.appId}-${app.appLabel}`}
						className={i === 0 ? undefined : '-ml-1.5'}
					>
						<IntegrationLogo
							id={app.appId}
							displayName={app.appLabel}
							size={18}
						/>
					</span>
				))}
			</span>
			<div className="relative z-[1] min-w-0 flex-1">
				<p
					className={cn(
						'truncate text-[13px] font-medium leading-tight tracking-[-0.01em]',
						status === 'running' ? 'text-[#1c1c1c]' : 'text-[#1c1c1c99]',
					)}
				>
					{status === 'running' ? `${tool.label}…` : tool.label}
				</p>
				<p
					className={cn(
						'mt-0.5 truncate leading-tight',
						status === 'done'
							? 'combo-agent-result text-[12px] text-[#1c1c1c80]'
							: 'font-[family-name:var(--landing-font-mono)] text-[10px] text-[#1c1c1c55]',
					)}
				>
					{status === 'done'
						? tool.result
						: tool.apps.length > 1
							? `${tool.apps.map((a) => a.appId).join(' + ')} · ${tool.op}`
							: `${tool.apps[0].appId}.${tool.op}`}
				</p>
			</div>
			<span className="relative z-[1] shrink-0">
				{status === 'running' ? <Spinner /> : <CheckMark />}
			</span>
		</li>
	);
}

export function KbDemo({ combo }: { combo: ComboData }) {
	const [phase, setPhase] = useState<Phase>('idle');
	const [shownTools, setShownTools] = useState(0);
	const [doneTools, setDoneTools] = useState(0);
	const [chars, setChars] = useState(0);
	const tick = useRef<ReturnType<typeof setInterval> | null>(null);
	const waits = useRef<ReturnType<typeof setTimeout>[]>([]);
	const busyRef = useRef(false);

	function clearTimers() {
		if (tick.current) {
			clearInterval(tick.current);
			tick.current = null;
		}
		for (const id of waits.current) clearTimeout(id);
		waits.current = [];
	}

	function later(ms: number, fn: () => void) {
		waits.current.push(setTimeout(fn, ms));
	}

	useEffect(() => {
		return () => {
			clearTimers();
		};
	}, []);

	function streamAnswer() {
		const total = combo.kb.answer.length;
		setPhase('answer');
		setChars(0);
		tick.current = setInterval(() => {
			let finished = false;
			setChars((c) => {
				const next = Math.min(c + CHUNK, total);
				if (next >= total) finished = true;
				return next;
			});
			if (finished) {
				if (tick.current) {
					clearInterval(tick.current);
					tick.current = null;
				}
				busyRef.current = false;
				setPhase('done');
			}
		}, TICK_MS);
	}

	function run() {
		if (busyRef.current) return;
		busyRef.current = true;
		clearTimers();
		const tools = combo.kb.tools;

		setChars(0);
		setShownTools(0);
		setDoneTools(0);
		setPhase('tools');

		for (let i = 0; i < tools.length; i += 1) {
			const appearAt = ASK_MS + i * GAP_MS;
			later(appearAt, () => {
				setShownTools(i + 1);
			});
			later(appearAt + RUN_MS, () => {
				setDoneTools(i + 1);
			});
		}

		later(
			ASK_MS + (tools.length - 1) * GAP_MS + RUN_MS + ANSWER_PAUSE_MS,
			streamAnswer,
		);
	}

	const busy = phase === 'tools' || phase === 'answer';
	const currentTool =
		phase === 'tools' && shownTools > 0
			? combo.kb.tools[shownTools - 1]
			: undefined;
	const liveTool = currentTool
		? doneTools < shownTools
			? `${currentTool.label}…`
			: currentTool.result
		: '';

	return (
		<section id="agent" className="py-10 md:py-12">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<h2 className="text-center font-[family-name:var(--landing-font-serif)] text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.03em] text-[#1c1c1c]">
					Agent
				</h2>
				<p className="mx-auto mt-2 max-w-xl text-center text-[15px] leading-relaxed text-[#1c1c1c99]">
					Use Corsair&apos;s MCP with your agent
				</p>

				<div className="mt-7 overflow-hidden rounded-md border border-[#1c1c1c]/10 bg-white shadow-[0_8px_32px_rgba(28,28,28,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]">
					<div className="border-b border-[#1c1c1c]/8 px-4 py-2.5 sm:px-5">
						<span className="truncate text-[11px] font-medium tracking-[0.01em] text-[#1c1c1c80]">
							{busy && currentTool
								? `${currentTool.label}…`
								: 'Corsair connected'}
						</span>
					</div>

					<div
						className="h-[320px] overflow-y-auto px-4 py-5 sm:h-[360px] sm:px-6 sm:py-6"
						aria-busy={busy}
					>
						{phase === 'idle' ? (
							<div className="flex h-full min-h-0 flex-col items-center justify-center gap-4 text-center">
								<span className="flex items-center" aria-hidden>
									<span className="combo-agent-idle-mark">
										<IntegrationLogo
											id={combo.slugA}
											displayName={combo.displayA}
											size={28}
										/>
									</span>
									<span className="combo-agent-idle-mark-delay -ml-2">
										<IntegrationLogo
											id={combo.slugB}
											displayName={combo.displayB}
											size={28}
										/>
									</span>
								</span>
								<p className="max-w-xs text-[13px] leading-relaxed text-[#1c1c1c66]">
									The agent searches both apps before it answers.
								</p>
							</div>
						) : (
							<div className="flex flex-col gap-5">
								<p className="combo-agent-row rounded-md bg-[#f0f0f0] px-3.5 py-3 text-[15px] leading-snug text-[#1c1c1c]">
									{combo.kb.query}
								</p>

								{shownTools > 0 ? (
									<ul className="divide-y divide-[#1c1c1c0c] overflow-hidden rounded-md border border-[#1c1c1c0f] bg-[#fafafa]/80">
										{combo.kb.tools.slice(0, shownTools).map((t, i) => (
											<ToolRow
												key={`${t.op}-${t.label}`}
												tool={t}
												status={i < doneTools ? 'done' : 'running'}
											/>
										))}
									</ul>
								) : null}

								<p aria-live="polite" className="sr-only">
									{liveTool}
								</p>

								{phase === 'answer' || phase === 'done' ? (
									<div className="combo-agent-row min-w-0">
										<p
											aria-hidden={phase !== 'done'}
											className="whitespace-pre-wrap text-[15px] leading-[1.7] text-[#1c1c1c]"
										>
											{combo.kb.answer.slice(0, chars)}
											{phase === 'answer' ? (
												<span className="combo-agent-caret" aria-hidden />
											) : null}
										</p>
										<p aria-live="polite" className="sr-only">
											{phase === 'done'
												? `Answer ready: ${combo.kb.answer}`
												: ''}
										</p>
										<div className="mt-3.5 flex flex-wrap gap-1.5">
											{combo.kb.sources.map((s, i) => (
												<Link
													key={`${s.appId}-${s.label}`}
													href={s.href}
													aria-label={`${s.appLabel} · ${s.label}`}
													style={{
														animationDelay:
															phase === 'done' ? `${i * 70}ms` : undefined,
													}}
													className={cn(
														'inline-flex items-center gap-2 rounded-full border border-[#1c1c1c]/10 bg-white py-1 pl-1 pr-2.5 text-[12px] font-medium text-[#1c1c1c] no-underline transition-[border-color,transform] hover:-translate-y-px hover:border-[#4a38f5]/35',
														phase === 'done' && 'combo-agent-row',
													)}
												>
													<IntegrationLogo
														id={s.appId}
														displayName={s.appLabel}
														size={20}
														className="rounded-full border-[#1c1c1c]/10"
													/>
													<span>{s.label}</span>
												</Link>
											))}
										</div>
									</div>
								) : null}
							</div>
						)}
					</div>

					<div className="border-t border-[#1c1c1c]/8 px-4 py-3.5 sm:px-5">
						<div
							className={cn(
								'flex items-end gap-2 rounded-md border bg-[#fafafa] p-2 transition-[border-color,box-shadow]',
								busy
									? 'combo-agent-composer-busy border-[#4a38f540] bg-white'
									: 'border-[#1c1c1c12]',
							)}
						>
							<p className="min-w-0 flex-1 px-2 py-1.5 text-[15px] leading-snug text-[#1c1c1c] sm:text-[16px]">
								{combo.kb.query}
							</p>
							<span className="relative flex size-11 shrink-0 items-center justify-center">
								{!busy ? (
									<span
										className="landing-send-cta-ring pointer-events-none absolute inset-0 rounded-full bg-[#4a38f5]"
										aria-hidden
									/>
								) : null}
								<button
									type="button"
									onClick={run}
									disabled={busy}
									aria-label={
										phase === 'idle'
											? 'Ask the agent'
											: phase === 'done'
												? 'Run the agent again'
												: 'Agent is searching'
									}
									className={cn(
										'relative z-10 flex size-11 touch-manipulation items-center justify-center rounded-full bg-[#4a38f5] text-white transition-[opacity,transform] hover:brightness-110 disabled:cursor-default disabled:opacity-55',
										!busy && 'landing-send-cta-pulse',
									)}
								>
									{busy ? (
										<Spinner />
									) : (
										<PaperPlaneTilt size={15} weight="fill" aria-hidden />
									)}
								</button>
							</span>
						</div>
					</div>
					<noscript>
						<p className="px-4 py-4 text-[15px] leading-[1.65] text-[#1c1c1c] sm:px-5">
							{combo.kb.answer}
						</p>
					</noscript>
				</div>
			</div>
		</section>
	);
}
