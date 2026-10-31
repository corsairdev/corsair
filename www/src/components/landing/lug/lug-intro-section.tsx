'use client';

import { ArrowRight } from '@phosphor-icons/react';
import type { FormEvent } from 'react';
import { useId, useState } from 'react';

import { hubLugClaimUrl, LUG_URL, lugHandleProblem } from '@/lib/site-links';
import { cn } from '@/lib/utils';

const FACTS = [
	'Works in Claude, ChatGPT, Cursor and any MCP client',
	'Pick which of 400+ apps it can use',
	'Approvals before anything risky',
];

function problemText(handle: string): string | null {
	if (!handle) return null;
	const problem = lugHandleProblem(handle);
	if (problem === 'reserved') return 'That name is reserved. Try another.';
	if (problem === 'format') {
		return 'Use lowercase letters, numbers and single hyphens, up to 32 characters.';
	}
	return null;
}

/** "Introducing lug.dev": claim yourname.lug.dev, then sign in on Hub. */
export function LugIntroSection() {
	const inputId = useId();
	const hintId = useId();
	const [value, setValue] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const handle = value.trim().toLowerCase();
	const problem = problemText(handle);
	const showProblem = Boolean(problem) && (submitted || handle.length > 2);

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitted(true);
		if (!handle || problem) return;
		window.location.assign(hubLugClaimUrl(handle));
	};

	return (
		<section
			id="lug"
			aria-labelledby="lug-heading"
			className="relative w-full scroll-mt-16 py-12 sm:py-16"
		>
			<div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-10">
				<div className="grid grid-cols-1 gap-8 rounded-xl border border-[#1c1c1c]/10 bg-white px-6 py-8 shadow-[0_8px_32px_rgba(28,28,28,0.06)] sm:px-10 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12">
					<div className="min-w-0">
						<span className="inline-flex rounded-full border border-[#4a38f5]/20 bg-[#4a38f5]/[0.06] px-2.5 py-0.5 text-[12px] font-medium text-[#3d2ee0]">
							New
						</span>
						<h2
							id="lug-heading"
							className="mt-3 font-[family-name:var(--landing-font-serif)] text-[clamp(1.75rem,3.4vw,2.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-[#1c1c1c]"
						>
							Introducing lug.dev, your own MCP address
						</h2>
						<p className="mt-3 max-w-xl text-[16px] leading-relaxed text-[#1c1c1c99]">
							Claim yourname.lug.dev, connect your apps once, and add the one
							address to every AI tool you use. Nothing to install.
						</p>
						<ul className="mt-5 space-y-2">
							{FACTS.map((fact) => (
								<li
									key={fact}
									className="flex items-start gap-2.5 text-[14px] leading-snug text-[#1c1c1c]"
								>
									<span
										aria-hidden
										className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[#4a38f5]"
									/>
									{fact}
								</li>
							))}
						</ul>
					</div>

					<form onSubmit={onSubmit} noValidate className="min-w-0">
						<label
							htmlFor={inputId}
							className="text-[13px] font-medium text-[#1c1c1c99]"
						>
							Claim your address
						</label>
						<div
							className={cn(
								'mt-2 flex min-w-0 items-center rounded-lg border bg-[#fafafa] font-[family-name:var(--landing-font-mono)] text-[15px] transition-colors focus-within:border-[#4a38f5]/60 focus-within:bg-white sm:text-[17px]',
								showProblem ? 'border-red-300' : 'border-[#1c1c1c]/15',
							)}
						>
							<span className="hidden shrink-0 pl-4 text-[#1c1c1c66] sm:inline">
								https://
							</span>
							<input
								id={inputId}
								value={value}
								onChange={(event) =>
									setValue(event.target.value.replace(/\s/g, '-'))
								}
								placeholder="yourname"
								autoComplete="off"
								autoCapitalize="none"
								spellCheck={false}
								maxLength={32}
								aria-invalid={showProblem}
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
								showProblem ? 'text-red-700' : 'text-[#1c1c1c66]',
							)}
						>
							{showProblem
								? problem
								: 'You sign in next, and Corsair checks that the name is free.'}
						</p>
						<div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
							<button
								type="submit"
								className="inline-flex items-center gap-2 rounded-lg bg-[#4a38f5] px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#3d2ee0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5]"
							>
								Claim it
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
				</div>
			</div>
		</section>
	);
}
