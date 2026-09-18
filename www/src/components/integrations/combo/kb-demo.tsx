'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import type { ComboData } from '@/lib/combined-integrations';

const CHUNK = 3;
const TICK_MS = 18;

export function KbDemo({ combo }: { combo: ComboData }) {
	const [started, setStarted] = useState(false);
	const [done, setDone] = useState(false);
	const [chars, setChars] = useState(0);
	const timer = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		return () => {
			if (timer.current) clearInterval(timer.current);
		};
	}, []);

	function run() {
		if (timer.current) clearInterval(timer.current);
		const total = combo.kb.answer.length;
		const reduced =
			typeof window !== 'undefined' &&
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		setStarted(true);
		setDone(false);
		if (reduced) {
			setChars(total);
			setDone(true);
			return;
		}
		setChars(0);
		timer.current = setInterval(() => {
			let finished = false;
			setChars((c) => {
				const next = Math.min(c + CHUNK, total);
				if (next >= total) finished = true;
				return next;
			});
			if (finished) {
				if (timer.current) clearInterval(timer.current);
				timer.current = null;
				setDone(true);
			}
		}, TICK_MS);
	}

	return (
		<section id="agent" className="py-10 md:py-12">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<h2 className="text-center font-[family-name:var(--landing-font-serif)] text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.03em] text-[#1c1c1c]">
					Agent
				</h2>
				<p className="mx-auto mt-2 max-w-2xl text-center text-[15px] leading-relaxed text-[#1c1c1c99]">
					Ask across {combo.displayA} and {combo.displayB} at once. Press Search
					to see a sample answer with links back to each app.
				</p>

				<div className="mt-7 overflow-hidden rounded-md border border-[#1c1c1c]/10 bg-white">
					<div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5 sm:py-5">
						<input
							readOnly
							value={combo.kb.query}
							aria-label="Sample agent query"
							className="w-full flex-1 rounded-sm border border-[#1c1c1c]/12 bg-[#f7f7f7] px-3 py-2.5 font-[family-name:var(--landing-font-serif)] text-[17px] text-[#1c1c1c] italic"
						/>
						<button
							type="button"
							onClick={run}
							className="shrink-0 cursor-pointer rounded-sm bg-[#1c1c1c] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4a38f5]"
						>
							{started && !done ? 'Searching…' : 'Search'}
						</button>
					</div>

					<div
						className="min-h-[132px] border-t border-[#1c1c1c]/8 bg-[#f7f7f7] px-4 py-4 sm:px-5"
						aria-busy={started && !done}
					>
						{!started ? (
							<div className="flex items-center gap-2.5 text-[#1c1c1c55]">
								<IntegrationLogo
									id={combo.slugA}
									displayName={combo.displayA}
									size={18}
								/>
								<IntegrationLogo
									id={combo.slugB}
									displayName={combo.displayB}
									size={18}
								/>
								<p className="text-sm leading-relaxed">
									Press Search to type a sample answer from both apps.
								</p>
							</div>
						) : (
							<>
								<p
									aria-hidden={!done}
									className="text-[15px] leading-[1.65] text-[#1c1c1c]"
								>
									{combo.kb.answer.slice(0, chars)}
									{!done ? <span aria-hidden>▍</span> : null}
								</p>
								<p aria-live="polite" className="sr-only">
									{done ? `Answer ready: ${combo.kb.answer}` : ''}
								</p>
								{done ? (
									<div className="mt-4 flex flex-wrap gap-2">
										{combo.kb.sources.map((s) => (
											<Link
												key={s.label}
												href={s.href}
												className="inline-flex items-center gap-1.5 rounded-full border border-[#1c1c1c]/10 bg-white px-2.5 py-1.5 text-[12px] font-medium text-[#1c1c1c] no-underline hover:border-[#1c1c1c]/25"
											>
												<IntegrationLogo
													id={s.appId}
													displayName={s.appLabel}
													size={16}
												/>
												{s.label}
											</Link>
										))}
									</div>
								) : null}
							</>
						)}
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
