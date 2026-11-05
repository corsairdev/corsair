'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { CopyPromptButton } from '@/components/use-cases/copy-prompt-button';
import { AGENT_ROLES } from '@/lib/agent-roles';
import { cn } from '@/lib/utils';

import { AgentChatWindow, ClientMark } from './agent-chat-window';
import { AGENT_CLIENTS } from './agent-clients';

const ROTATE_MS = 9000;

/**
 * "Turn Claude into a sales rep": one role at a time, played as a chat in
 * Claude, Cursor, ChatGPT or Grok: the prompt, each Corsair call and what it
 * returned, then the answer. Rotates role and app until the visitor picks
 * either, and never with reduced motion; every role's content is in the page
 * for search engines.
 */
export function AgentRolesSection() {
	const [active, setActive] = useState(0);
	const [client, setClient] = useState(0);
	const [pinned, setPinned] = useState(false);
	// Hover and keyboard focus pause it separately, so moving the mouse away
	// never rotates a panel out from under a keyboard user.
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	// The chat replays only once the section is on screen, so a visitor who
	// scrolls down sees it play instead of the finished transcript.
	const [inView, setInView] = useState(false);
	const sectionRef = useRef<HTMLElement>(null);
	const paused = hovered || focused || !inView;
	const [reduceMotion, setReduceMotion] = useState(false);

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;
		const observer = new IntersectionObserver(
			([entry]) => setInView(entry.isIntersecting),
			{ threshold: 0.35 },
		);
		observer.observe(section);
		return () => observer.disconnect();
	}, []);

	// Follows the setting live, so turning on reduced motion stops rotation
	// without a reload.
	useEffect(() => {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => setReduceMotion(query.matches);
		update();
		query.addEventListener('change', update);
		return () => query.removeEventListener('change', update);
	}, []);

	useEffect(() => {
		if (pinned || paused || reduceMotion) return;
		const timer = window.setTimeout(() => {
			setActive((index) => (index + 1) % AGENT_ROLES.length);
			setClient((index) => (index + 1) % AGENT_CLIENTS.length);
		}, ROTATE_MS);
		return () => window.clearTimeout(timer);
	}, [active, pinned, paused, reduceMotion]);

	const role = AGENT_ROLES[active];
	const skin = AGENT_CLIENTS[client];

	const clientTabs = (
		<div role="group" aria-label="Show it in" className="flex min-w-0 gap-0.5">
			{AGENT_CLIENTS.map((item, index) => {
				const selected = index === client;
				return (
					<button
						key={item.id}
						type="button"
						aria-pressed={selected}
						aria-label={item.name}
						onClick={() => {
							setClient(index);
							setPinned(true);
						}}
						className="flex items-center gap-1.5 rounded-t-lg px-2.5 py-2 text-[12.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#4a38f5] sm:px-3.5"
						style={{
							background: selected ? skin.body : 'transparent',
							color: selected ? skin.text : skin.muted,
						}}
					>
						<ClientMark
							skin={item}
							size={14}
							color={selected ? item.brand : undefined}
						/>
						<span className="hidden sm:inline">{item.name}</span>
					</button>
				);
			})}
		</div>
	);

	return (
		<section
			ref={sectionRef}
			id="roles"
			data-inview={inView ? 'true' : 'false'}
			aria-labelledby="roles-heading"
			className="agent-roles relative w-full scroll-mt-16 py-14 sm:py-20"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onFocusCapture={() => setFocused(true)}
			onBlurCapture={(event) => {
				// Moving focus between two things inside the section keeps it paused.
				if (!event.currentTarget.contains(event.relatedTarget)) {
					setFocused(false);
				}
			}}
		>
			<noscript>
				<style>{'.agent-roles .agent-chat-in{animation:none!important}'}</style>
			</noscript>
			<div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-10">
				<div className="text-center">
					<h2
						id="roles-heading"
						className="font-[family-name:var(--landing-font-serif)] text-[clamp(1.85rem,4vw,2.9rem)] font-light leading-[1.1] tracking-[-0.02em] text-[#1c1c1c]"
					>
						Turn {skin.name} into{' '}
						<span className="text-[#4a38f5]">{role.title}</span>
					</h2>
					<p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-[#1c1c1c99]">
						Connect the apps a role uses once, and your agent does the work
						across them, asking you before anything risky. The same in any MCP
						client.
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
						className="mx-auto mt-6 max-w-[960px]"
					>
						<AgentChatWindow role={item} skin={skin} clientTabs={clientTabs} />
						<div className="mt-3 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
							<Link
								href="/integrations"
								className="text-[13px] text-[#1c1c1c99] no-underline hover:text-[#4a38f5]"
							>
								{item.apps.map((app) => app.name).join(', ')} and 400+ more apps
							</Link>
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
