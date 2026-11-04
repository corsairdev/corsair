'use client';

import { Check } from '@phosphor-icons/react';
import type { CSSProperties, ReactNode } from 'react';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import type { AgentRole, AgentRoleApp } from '@/lib/agent-roles';
import { cn } from '@/lib/utils';

import type { AgentClientSkin } from './agent-clients';

// Timing of the replay, in ms: the prompt, then the call header, then one call
// at a time, then the answer. Each call's result lands a beat after its row.
const HEADER_AT = 350;
const FIRST_STEP_AT = 650;
const STEP_GAP = 420;
const RESULT_LAG = 360;

function delay(ms: number): CSSProperties {
	return { '--agent-chat-delay': `${ms}ms` } as CSSProperties;
}

/** A client's mark, drawn in currentColor (or its brand colour). */
export function ClientMark({
	skin,
	size = 14,
	color,
}: {
	skin: AgentClientSkin;
	size?: number;
	color?: string;
}) {
	return (
		<span
			aria-hidden
			className="inline-block shrink-0"
			style={{
				width: size,
				height: size,
				backgroundColor: color ?? 'currentColor',
				maskImage: `url(${skin.logo})`,
				WebkitMaskImage: `url(${skin.logo})`,
				maskSize: 'contain',
				WebkitMaskSize: 'contain',
				maskRepeat: 'no-repeat',
				WebkitMaskRepeat: 'no-repeat',
				maskPosition: 'center',
				WebkitMaskPosition: 'center',
			}}
		/>
	);
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** The prompt with each app's name shown as a small logo chip. */
function PromptWithApps({
	prompt,
	apps,
}: {
	prompt: string;
	apps: AgentRoleApp[];
}) {
	const byName = new Map(apps.map((app) => [app.name, app]));
	const names = [...byName.keys()].sort((a, b) => b.length - a.length);
	const parts = prompt.split(
		new RegExp(`(${names.map(escapeRegExp).join('|')})`, 'g'),
	);
	return (
		<>
			{parts.map((part, index) => {
				const app = byName.get(part);
				if (!app) return part;
				return (
					<span
						key={index}
						className="inline-flex items-baseline gap-1 whitespace-nowrap font-medium"
					>
						<IntegrationLogo
							id={app.id}
							displayName={app.name}
							size={15}
							className="translate-y-[2px] self-center rounded-[4px]"
						/>
						{part}
					</span>
				);
			})}
		</>
	);
}

function capitalize(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

/** The calls the agent made through Corsair, one row per call. */
function ToolCalls({ role, skin }: { role: AgentRole; skin: AgentClientSkin }) {
	const appName = new Map(role.apps.map((app) => [app.id, app.name]));
	return (
		<div
			className="agent-chat-in rounded-xl border px-3 py-2.5 sm:px-3.5"
			style={{
				...delay(HEADER_AT),
				borderColor: skin.border,
				background: skin.dark
					? 'rgba(255,255,255,0.025)'
					: 'rgba(255,255,255,0.6)',
			}}
		>
			<p
				className="flex items-center gap-1.5 text-[12.5px]"
				style={{ color: skin.muted }}
			>
				<img
					src="/corsair-logo.png"
					alt=""
					width={14}
					height={14}
					className="rounded-[3px]"
				/>
				<span>
					{skin.toolLabel}
					<span className="font-[family-name:var(--landing-font-mono)]">
						{' '}
						· run_script
					</span>
				</span>
			</p>
			<ol className="mt-2 space-y-1.5">
				{role.steps.map((step, index) => {
					const at = FIRST_STEP_AT + index * STEP_GAP;
					return (
						<li
							key={`${step.app}.${step.tool}`}
							className="agent-chat-in flex items-center gap-2.5 text-[13px] leading-snug"
							style={delay(at)}
						>
							<IntegrationLogo
								id={step.app}
								displayName={appName.get(step.app) ?? step.app}
								size={18}
								className="rounded-[5px]"
							/>
							<span className="min-w-0 flex-1">
								<span className="block truncate" style={{ color: skin.text }}>
									{capitalize(step.text)}
								</span>
								<span
									className="hidden truncate font-[family-name:var(--landing-font-mono)] text-[11px] sm:block"
									style={{ color: skin.muted }}
								>
									{step.app}.{step.tool}
								</span>
							</span>
							<span
								className="agent-chat-in flex shrink-0 items-center gap-1.5 text-[12px]"
								style={{ ...delay(at + RESULT_LAG), color: skin.muted }}
							>
								{step.approved ? (
									<span
										className="rounded-full px-1.5 py-px text-[11px] font-medium"
										style={{
											background: skin.dark
												? 'rgba(245,180,60,0.16)'
												: 'rgba(214,140,20,0.12)',
											color: skin.dark ? '#F3C46B' : '#8A5A00',
										}}
									>
										you approved
									</span>
								) : null}
								<span className="hidden sm:inline">{step.result}</span>
								<Check
									size={13}
									weight="bold"
									aria-hidden
									className="text-emerald-500"
								/>
							</span>
						</li>
					);
				})}
			</ol>
		</div>
	);
}

function Transcript({
	role,
	skin,
}: {
	role: AgentRole;
	skin: AgentClientSkin;
}) {
	const answerAt =
		FIRST_STEP_AT + role.steps.length * STEP_GAP + RESULT_LAG + 120;
	const userBubble =
		skin.id === 'cursor'
			? 'w-full rounded-lg border px-3 py-2'
			: 'ml-auto max-w-[88%] px-4 py-2.5 sm:max-w-[80%]';
	const bubbleRadius =
		skin.id === 'chatgpt'
			? 18
			: skin.id === 'grok'
				? 22
				: skin.id === 'claude'
					? 14
					: 8;

	return (
		<div className="flex flex-col gap-3.5">
			<div
				className={cn('agent-chat-in text-[14px] leading-relaxed', userBubble)}
				style={{
					...delay(0),
					background: skin.bubble,
					color: skin.text,
					borderColor: skin.border,
					borderRadius: bubbleRadius,
				}}
			>
				<PromptWithApps prompt={role.prompt} apps={role.apps} />
			</div>
			<ToolCalls role={role} skin={skin} />
			<p
				className={cn(
					'agent-chat-in leading-relaxed',
					skin.serifAnswer
						? 'font-[family-name:var(--landing-font-serif)] text-[16.5px]'
						: 'text-[14.5px]',
				)}
				style={{ ...delay(answerAt), color: skin.text }}
			>
				{role.answer}
			</p>
		</div>
	);
}

function Composer({ skin }: { skin: AgentClientSkin }) {
	return (
		<div
			aria-hidden
			className="mt-auto border px-4 py-2.5 text-[13px]"
			style={{
				borderColor: skin.border,
				color: skin.muted,
				background: skin.dark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
				borderRadius: skin.id === 'chatgpt' || skin.id === 'grok' ? 999 : 14,
			}}
		>
			{skin.placeholder}
		</div>
	);
}

const EDITOR_LINES: ReadonlyArray<readonly [string, string, number]> = [
	['#C586C0', '38%', 0],
	['#9CDCFE', '62%', 14],
	['#DCDCAA', '48%', 14],
	['#6A9955', '70%', 0],
	['#9CDCFE', '34%', 14],
	['#CE9178', '56%', 28],
	['#C586C0', '44%', 14],
	['#9CDCFE', '52%', 0],
	['#DCDCAA', '40%', 14],
	['#CE9178', '60%', 28],
];

/**
 * Cursor's editor, sketched: file tree and code as bars. Only from `lg` up:
 * between `md` and `lg` it squeezes the chat column until the longer roles
 * outgrow the window's fixed height.
 */
function EditorSketch() {
	return (
		<div aria-hidden className="hidden min-w-0 border-r border-white/5 lg:flex">
			<div className="flex w-[30%] flex-col gap-2.5 border-r border-white/5 px-3 py-5">
				{['70%', '52%', '64%', '46%', '58%', '40%'].map((width, index) => (
					<span
						key={index}
						className="block h-[6px] rounded-full bg-white/10"
						style={{ width }}
					/>
				))}
			</div>
			<div className="flex flex-1 flex-col gap-2.5 px-4 py-5">
				{EDITOR_LINES.map(([color, width, indent], index) => (
					<span
						key={index}
						className="block h-[6px] rounded-full opacity-45"
						style={{ width, background: color, marginLeft: indent }}
					/>
				))}
			</div>
		</div>
	);
}

/**
 * A role's prompt played in a chat app: the message, the Corsair calls with
 * what each returned, and the answer. The chat replays whenever the role or
 * app changes; the title bar stays mounted, so a keyboard user who picks an
 * app keeps focus on its tab.
 */
export function AgentChatWindow({
	role,
	skin,
	clientTabs,
}: {
	role: AgentRole;
	skin: AgentClientSkin;
	/** The client switcher, drawn as tabs in the title bar. */
	clientTabs: ReactNode;
}) {
	// Tall enough for the longest role on desktop, so rotating roles and apps
	// never moves the page under the reader. The composer sits at the bottom.
	const chat = (
		<div
			key={`${role.id}-${skin.id}`}
			className={cn(
				'flex flex-1 flex-col gap-5 px-4 pt-5 pb-4 sm:px-6',
				// Cursor's "Agent" header takes 37px of the same height.
				skin.id === 'cursor' ? 'sm:min-h-[518px]' : 'sm:min-h-[555px]',
			)}
		>
			<Transcript role={role} skin={skin} />
			<Composer skin={skin} />
		</div>
	);

	return (
		<div
			className="overflow-hidden rounded-xl border shadow-[0_8px_32px_rgba(28,28,28,0.08)]"
			style={{
				background: skin.body,
				borderColor: skin.dark ? '#000' : 'rgba(28,28,28,0.1)',
			}}
		>
			<div
				className="flex items-end gap-3 px-3 pt-2"
				style={{ background: skin.bar }}
			>
				<span aria-hidden className="mb-3 flex shrink-0 gap-1.5 pl-1">
					<span className="size-[10px] rounded-full bg-[#FF5F57]" />
					<span className="size-[10px] rounded-full bg-[#FEBC2E]" />
					<span className="size-[10px] rounded-full bg-[#28C840]" />
				</span>
				{clientTabs}
			</div>
			{skin.id === 'cursor' ? (
				<div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
					<EditorSketch />
					<div className="flex min-w-0 flex-col bg-[#1F1F1F]">
						<p className="border-b border-white/5 px-4 py-2.5 text-[12px] text-white/60 sm:px-6">
							Agent
						</p>
						{chat}
					</div>
				</div>
			) : (
				<div className="mx-auto max-w-[680px]">{chat}</div>
			)}
		</div>
	);
}
