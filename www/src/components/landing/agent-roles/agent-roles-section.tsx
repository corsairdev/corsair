'use client';

import { Check } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import { CopyPromptButton } from '@/components/use-cases/copy-prompt-button';
import { AGENT_ROLES } from '@/lib/agent-roles';
import { cn } from '@/lib/utils';

const ROTATE_MS = 7000;

/**
 * "Turn Claude into a sales rep": one role at a time, the steps an agent runs
 * and the apps it uses. Rotates until the visitor picks a role, and never with
 * reduced motion; every role's content is in the page for search engines.
 */
export function AgentRolesSection() {
	const [active, setActive] = useState(0);
	const [pinned, setPinned] = useState(false);
	const [paused, setPaused] = useState(false);
	const reduceMotion = useRef(false);

	useEffect(() => {
		reduceMotion.current = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		).matches;
	}, []);

	useEffect(() => {
		if (pinned || paused || reduceMotion.current) return;
		const timer = window.setTimeout(
			() => setActive((index) => (index + 1) % AGENT_ROLES.length),
			ROTATE_MS,
		);
		return () => window.clearTimeout(timer);
	}, [active, pinned, paused]);

	const role = AGENT_ROLES[active];

	return (
		<section
			id="roles"
			aria-labelledby="roles-heading"
			className="relative w-full scroll-mt-16 py-14 sm:py-20"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocusCapture={() => setPaused(true)}
			onBlurCapture={() => setPaused(false)}
		>
			<div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-10">
				<div className="text-center">
					<h2
						id="roles-heading"
						className="font-[family-name:var(--landing-font-serif)] text-[clamp(1.85rem,4vw,2.9rem)] font-light leading-[1.1] tracking-[-0.02em] text-[#1c1c1c]"
					>
						Turn Claude into{' '}
						<span className="text-[#4a38f5]">{role.title}</span>
					</h2>
					<p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-[#1c1c1c99]">
						Connect the apps a role uses once, and your agent does the work
						across them. The same in ChatGPT, Cursor or any MCP client.
					</p>
				</div>

				<div
					role="tablist"
					aria-label="Roles"
					className="mt-7 flex flex-wrap justify-center gap-2"
				>
					{AGENT_ROLES.map((item, index) => (
						<button
							key={item.id}
							type="button"
							role="tab"
							id={`role-tab-${item.id}`}
							aria-selected={active === index}
							aria-controls={`role-panel-${item.id}`}
							onClick={() => {
								setActive(index);
								setPinned(true);
							}}
							className={cn(
								'rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5]',
								active === index
									? 'border-[#1c1c1c] bg-[#1c1c1c] text-white'
									: 'border-[#1c1c1c]/12 bg-white text-[#1c1c1c99] hover:border-[#1c1c1c]/30 hover:text-[#1c1c1c]',
							)}
						>
							{item.title.replace(/^an? /, '')}
						</button>
					))}
				</div>

				{AGENT_ROLES.map((item, index) => (
					<div
						key={item.id}
						role="tabpanel"
						id={`role-panel-${item.id}`}
						aria-labelledby={`role-tab-${item.id}`}
						hidden={active !== index}
						className="mt-6 overflow-hidden rounded-xl border border-[#1c1c1c]/10 bg-white shadow-[0_8px_32px_rgba(28,28,28,0.06)]"
					>
						<div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
							<div className="min-w-0 border-b border-[#1c1c1c]/8 px-5 py-6 sm:px-7 lg:border-r lg:border-b-0">
								<p className="text-[13px] font-medium text-[#1c1c1c99]">
									What your agent does
								</p>
								<ol className="mt-3 space-y-3">
									{item.steps.map((step) => (
										<li key={step.text} className="flex gap-3">
											<span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#4a38f5]/10 text-[#4a38f5]">
												<Check size={12} weight="bold" aria-hidden />
											</span>
											<span className="min-w-0">
												<span className="block text-[15px] leading-snug text-[#1c1c1c]">
													{step.text.charAt(0).toUpperCase()}
													{step.text.slice(1)}
												</span>
												<span className="font-[family-name:var(--landing-font-mono)] text-[11px] text-[#1c1c1c66] [overflow-wrap:anywhere]">
													corsair.{step.app}.api.{step.tool}
												</span>
											</span>
										</li>
									))}
								</ol>
							</div>
							<div className="min-w-0 px-5 py-6 sm:px-7">
								<p className="text-[13px] font-medium text-[#1c1c1c99]">
									Apps it uses
								</p>
								<ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
									{item.apps.map((app) => (
										<li key={app.id}>
											<Link
												href={`/integrations/${app.id}`}
												className="flex min-w-0 items-center gap-2 rounded-md border border-[#1c1c1c]/10 px-2.5 py-2 text-[13px] font-medium text-[#1c1c1c] no-underline transition-colors hover:border-[#4a38f5]/35"
											>
												<IntegrationLogo
													id={app.id}
													displayName={app.name}
													size={22}
													className="rounded-[4px]"
												/>
												<span className="min-w-0 leading-tight">
													{app.name}
												</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="flex flex-col gap-3 border-t border-[#1c1c1c]/8 bg-[#fafafa] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
							<p className="min-w-0 text-[14px] leading-relaxed text-[#1c1c1c]">
								&ldquo;{item.prompt}&rdquo;
							</p>
							<div className="flex shrink-0 items-center gap-4">
								{item.useCase ? (
									<Link
										href={`/use-cases/${item.useCase}`}
										className="text-[13px] font-medium text-[#4a38f5] no-underline hover:underline"
									>
										Related use case
									</Link>
								) : null}
								<CopyPromptButton prompt={item.prompt} />
							</div>
						</div>
					</div>
				))}

				<p className="mt-5 text-center text-[14px]">
					<Link
						href="/use-cases"
						className="font-medium text-[#4a38f5] no-underline hover:underline"
					>
						See every use case
					</Link>
				</p>
			</div>
		</section>
	);
}
