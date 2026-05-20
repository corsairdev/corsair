'use client';

import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { INTEGRATION_BY_ID } from '../data/companies-data';
import type { IntegrationId } from '../data/companies-data';
import { useChatDemoSync } from '../hooks/use-chat-demo-sync';
import { useWindowOrder } from '../hooks/use-window-order';
import { useWindowPointerInteractions } from '../hooks/use-window-pointer-interactions';
import type { WindowPosition, WindowSize } from '../hooks/window-geometry';
import { TrafficLights } from '../icons/twenty-logo';
import { FaviconLogo, PersonAvatar } from './table-ui';

const TERMINAL_ID = 'terminal-window';
const INITIAL_WIDTH = 420;
const INITIAL_HEIGHT = 400;
const INITIAL_BOTTOM_OFFSET = 72;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 280;

const CHAT_PERSON = {
	name: 'Patrick Collison',
	tone: 'purple',
	avatar: '/twenty/avatars/patrick-collison.webp',
} as const;

const MEETING_WITH = 'Garry Tan';

const USER_PROMPT = `Send a calendar invite and email to ${MEETING_WITH} for Thursday morning for the sales call. Prep the sales team too and see who can join.`;

const ASSISTANT_REPLY = `I'll use Corsair to check when you're free Thursday morning and book a time with ${MEETING_WITH}. I'll pull context and add who's free from the sales team as optional attendees.`;

type DemoToolCall =
	| {
			kind: 'integration';
			integrationId: IntegrationId;
			description: string;
			permissionAuthorized?: boolean;
	  }
	| {
			kind: 'trigger';
			integrationId: IntegrationId;
			description: string;
	  }
	| {
			kind: 'cron';
			integrationId: IntegrationId;
			description: string;
			schedule: string;
	  };

function pulseIdForTool(tool: DemoToolCall): IntegrationId {
	return tool.integrationId;
}

const MAIN_TOOL_CALLS: DemoToolCall[] = [
	{
		kind: 'integration',
		integrationId: 'granola',
		description: `Pull meeting notes from past calls with ${MEETING_WITH}`,
	},
	{
		kind: 'integration',
		integrationId: 'hubspot',
		description: `Check deal status for the ${MEETING_WITH} opportunity`,
	},
	{
		kind: 'integration',
		integrationId: 'notion',
		description: 'Find status-update docs for this sale',
	},
	{
		kind: 'integration',
		integrationId: 'gcal',
		description: 'Check your free slots Thursday morning',
	},
	{
		kind: 'integration',
		integrationId: 'gcal',
		description: `Create "Sales call — ${MEETING_WITH}" · Thu 10:00 AM`,
		permissionAuthorized: true,
	},
	{
		kind: 'integration',
		integrationId: 'gmail',
		description: `Email ${MEETING_WITH} the invite and agenda`,
		permissionAuthorized: true,
	},
	{
		kind: 'integration',
		integrationId: 'slack',
		description: 'Post call brief and context to #sales',
	},
	{
		kind: 'integration',
		integrationId: 'slack',
		description: "See who's free on sales Thursday 10am",
	},
	{
		kind: 'integration',
		integrationId: 'gcal',
		description: 'Add 3 teammates as optional attendees',
	},
];

const FOLLOWUP_TOOL_CALLS: DemoToolCall[] = [
	{
		kind: 'trigger',
		integrationId: 'gcal',
		description: 'Notify you when someone accepts the invite',
	},
	{
		kind: 'cron',
		integrationId: 'slack',
		schedule: 'Thu 9:00 AM',
		description: 'Send Summary',
	},
];

const DONE_MESSAGE_PRIMARY = `Everything's ready — ${MEETING_WITH} is on your calendar for Thursday at 10:00 AM, the email is out, and I posted in #sales so the team knows. Maya, James, and Priya are optional on the invite.`;

const DONE_MESSAGE_FOLLOWUP = `I'll let you know who accepts, and I'll send you a summary Slack message on Thursday an hour before your meeting so you're prepped.`;

const CHAR_MS = 18;
const ASSISTANT_DELAY_MS = 2000;
const toolRand = (min: number, max: number) =>
	Math.round(min + Math.random() * (max - min));

type ChatPhase =
	| 'input'
	| 'thinking'
	| 'assistant'
	| 'tools'
	| 'done'
	| 'followup-tools';

function runToolOrchestrator(
	tools: DemoToolCall[],
	handlers: {
		onStart: () => void;
		onReveal: (index: number, tool: DemoToolCall) => void;
		onComplete: (index: number, tool: DemoToolCall) => void;
		onAllComplete: () => void;
	},
) {
	const timeouts: number[] = [];
	const schedule = (fn: () => void, ms: number) => {
		timeouts.push(window.setTimeout(fn, ms));
	};

	handlers.onStart();

	let revealAt = toolRand(180, 380);
	let latestDoneAt = 0;

	tools.forEach((tool, index) => {
		const revealDelay = revealAt;

		schedule(() => handlers.onReveal(index, tool), revealDelay);

		const runMs = toolRand(1100, 2200);
		const doneAt = revealDelay + runMs;
		latestDoneAt = Math.max(latestDoneAt, doneAt);

		schedule(() => handlers.onComplete(index, tool), doneAt);

		revealAt += toolRand(320, 720);
	});

	schedule(handlers.onAllComplete, latestDoneAt + toolRand(350, 650));

	return () => {
		for (const id of timeouts) window.clearTimeout(id);
	};
}

function useStreamText(text: string, active: boolean, charMs = CHAR_MS) {
	const [visible, setVisible] = useState('');
	const indexRef = useRef(0);

	useEffect(() => {
		if (!active) return;

		if (indexRef.current >= text.length) {
			setVisible(text);
			return;
		}

		const tick = () => {
			indexRef.current = Math.min(indexRef.current + 1, text.length);
			setVisible(text.slice(0, indexRef.current));
		};

		tick();
		const id = window.setInterval(tick, charMs);
		return () => window.clearInterval(id);
	}, [active, text, charMs]);

	return visible;
}

function LightningIcon({ size = 16 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="#f59e0b" aria-hidden>
			<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z" />
		</svg>
	);
}

function ClockIcon({ size = 16 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="#666"
			strokeWidth="2"
			aria-hidden
		>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 7v5l3 2" strokeLinecap="round" />
		</svg>
	);
}

function ToolStatusIcon({ status }: { status: 'pending' | 'running' | 'done' }) {
	if (status === 'running') {
		return (
			<span className="size-3 animate-spin rounded-full border-2 border-[#1c1c1c1a] border-t-[#4a38f5]" />
		);
	}
	if (status === 'done') {
		return (
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
				<circle cx="12" cy="12" r="10" fill="#e8f5ee" />
				<path
					d="M8 12.5l2.5 2.5L16 9"
					stroke="#1a7f4b"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		);
	}
	return null;
}

function ToolCallRow({
	tool,
	status,
}: {
	tool: DemoToolCall;
	status: 'pending' | 'running' | 'done';
}) {
	const linked = INTEGRATION_BY_ID[tool.integrationId];

	if (tool.kind === 'integration') {
		return (
			<div
				className="flex items-center gap-2 rounded-lg border border-[#1c1c1c12] bg-[#fafafa] px-2 py-1.5 transition-[opacity,transform] duration-200 ease-out"
				style={{
					opacity: status === 'pending' ? 0 : 1,
					transform: status === 'pending' ? 'translateY(6px)' : 'translateY(0)',
				}}
			>
				<FaviconLogo
					domain={linked.iconDomain}
					label={linked.label}
					size={16}
				/>
				<div className="min-w-0 flex-1">
					<p className="truncate text-[11px] font-medium">
						<span className="text-[#1c1c1c]">{linked.label}</span>
						{tool.permissionAuthorized ? (
							<span className="text-[#1a7f4b]"> — Permission Authorized</span>
						) : null}
					</p>
					<p className="truncate text-[10px] leading-tight text-[#1c1c1c80]">
						{tool.description}
					</p>
				</div>
				<span className="flex size-4 shrink-0 items-center justify-center" aria-hidden>
					<ToolStatusIcon status={status} />
				</span>
			</div>
		);
	}

	const title = tool.kind === 'trigger' ? 'Trigger' : 'Cron';
	const subtitle =
		tool.kind === 'cron'
			? `${tool.schedule} · ${tool.description}`
			: tool.description;

	return (
		<div
			className="flex items-center gap-2 rounded-lg border border-[#1c1c1c12] bg-[#fafafa] px-2 py-1.5 transition-[opacity,transform] duration-200 ease-out"
			style={{
				opacity: status === 'pending' ? 0 : 1,
				transform: status === 'pending' ? 'translateY(6px)' : 'translateY(0)',
			}}
		>
			<span className="flex shrink-0 items-center gap-0.5">
				{tool.kind === 'trigger' ? <LightningIcon /> : <ClockIcon />}
				<FaviconLogo
					domain={linked.iconDomain}
					label={linked.label}
					size={14}
				/>
			</span>
			<div className="min-w-0 flex-1">
				<p className="truncate text-[11px] font-medium text-[#1c1c1c]">{title}</p>
				<p className="truncate text-[10px] leading-tight text-[#1c1c1c80]">
					{subtitle}
				</p>
			</div>
			<span className="flex size-4 shrink-0 items-center justify-center" aria-hidden>
				<ToolStatusIcon status={status} />
			</span>
		</div>
	);
}


function TypingIndicator() {
	return (
		<div className="flex items-start gap-1.5">
			<span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-[#0d0f1a] text-[9px] font-bold text-white">
				AI
			</span>
			<div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[#1c1c1c0d] px-3 py-2.5">
				<span className="size-1.5 animate-bounce rounded-full bg-[#1c1c1c66] [animation-delay:0ms]" />
				<span className="size-1.5 animate-bounce rounded-full bg-[#1c1c1c66] [animation-delay:150ms]" />
				<span className="size-1.5 animate-bounce rounded-full bg-[#1c1c1c66] [animation-delay:300ms]" />
			</div>
		</div>
	);
}

function ChatMessages({
	scrollRef,
	sentMessage,
	isThinking,
	assistantText,
	visibleMainTools,
	mainToolStatuses,
	visibleFollowupTools,
	followupToolStatuses,
	donePrimaryText,
	doneFollowupText,
	assistantComplete,
	donePrimaryComplete,
	doneFollowupComplete,
}: {
	scrollRef: React.RefObject<HTMLDivElement | null>;
	sentMessage: string | null;
	isThinking: boolean;
	assistantText: string;
	visibleMainTools: number;
	mainToolStatuses: Array<'pending' | 'running' | 'done'>;
	visibleFollowupTools: number;
	followupToolStatuses: Array<'pending' | 'running' | 'done'>;
	donePrimaryText: string;
	doneFollowupText: string;
	assistantComplete: boolean;
	donePrimaryComplete: boolean;
	doneFollowupComplete: boolean;
}) {
	const showAssistant = assistantText.length > 0;
	const showMainTools = visibleMainTools > 0;
	const showDone = donePrimaryText.length > 0;
	const showFollowupTools = visibleFollowupTools > 0;

	return (
		<div
			ref={scrollRef}
			className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain pr-0.5"
		>
			{sentMessage ? (
				<div className="flex items-end justify-end gap-1.5">
					<div className="max-w-[92%] rounded-2xl rounded-br-md bg-[#4a38f5] px-2.5 py-2 text-[12px] leading-snug text-white">
						{sentMessage}
					</div>
					<PersonAvatar person={CHAT_PERSON} size={20} />
				</div>
			) : null}

			{isThinking ? <TypingIndicator /> : null}

			{showAssistant ? (
				<div className="flex items-start gap-1.5">
					<span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-[#0d0f1a] text-[9px] font-bold text-white">
						AI
					</span>
					<div className="max-w-[92%] rounded-2xl rounded-bl-md bg-[#1c1c1c0d] px-2.5 py-2 text-[12px] leading-snug text-[#1c1c1c]">
						{assistantText}
						{!assistantComplete ? (
							<span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-[#1c1c1c66] align-middle" />
						) : null}
					</div>
				</div>
			) : null}

			{showMainTools ? (
				<div className="ml-7 flex flex-col gap-1.5 pl-0.5">
					{MAIN_TOOL_CALLS.slice(0, visibleMainTools).map((tool, i) => (
						<ToolCallRow
							key={`main-${tool.kind}-${tool.integrationId}-${i}`}
							tool={tool}
							status={mainToolStatuses[i] ?? 'pending'}
						/>
					))}
				</div>
			) : null}

			{showDone ? (
				<div className="flex items-start gap-1.5">
					<span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-[#0d0f1a] text-[9px] font-bold text-white">
						AI
					</span>
					<div className="max-w-[92%] rounded-2xl rounded-bl-md border border-[#1a7f4b33] bg-[#e8f5ee] px-2.5 py-2 text-[12px] leading-snug text-[#145c36]">
						<p>
							{donePrimaryText}
							{!donePrimaryComplete ? (
								<span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-[#145c3666] align-middle" />
							) : null}
						</p>
						{donePrimaryComplete || doneFollowupText.length > 0 ? (
							<p className="mt-2">
								{doneFollowupText}
								{donePrimaryComplete && !doneFollowupComplete ? (
									<span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-[#145c3666] align-middle" />
								) : null}
							</p>
						) : null}
					</div>
				</div>
			) : null}

			{showFollowupTools ? (
				<div className="ml-7 flex flex-col gap-1.5 pl-0.5">
					{FOLLOWUP_TOOL_CALLS.slice(0, visibleFollowupTools).map((tool, i) => (
						<ToolCallRow
							key={`followup-${tool.kind}-${tool.integrationId}-${i}`}
							tool={tool}
							status={followupToolStatuses[i] ?? 'pending'}
						/>
					))}
				</div>
			) : null}
		</div>
	);
}

export function TerminalWindow() {
	const shellRef = useRef<HTMLDivElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState<WindowPosition | null>(null);
	const [size, setSize] = useState<WindowSize>({
		width: INITIAL_WIDTH,
		height: INITIAL_HEIGHT,
	});
	const { activate, zIndex } = useWindowOrder(TERMINAL_ID);
	const { pulseIntegration, unpulseIntegration, clearPulses } =
		useChatDemoSync();
	const mainToolsOrchestratorRef = useRef(false);
	const followupToolsOrchestratorRef = useRef(false);

	const [phase, setPhase] = useState<ChatPhase>('input');
	const [sentMessage, setSentMessage] = useState<string | null>(null);
	const [visibleMainTools, setVisibleMainTools] = useState(0);
	const [mainToolStatuses, setMainToolStatuses] = useState<
		Array<'pending' | 'running' | 'done'>
	>([]);
	const [visibleFollowupTools, setVisibleFollowupTools] = useState(0);
	const [followupToolStatuses, setFollowupToolStatuses] = useState<
		Array<'pending' | 'running' | 'done'>
	>([]);

	const assistantText = useStreamText(ASSISTANT_REPLY, phase === 'assistant');
	const donePrimaryText = useStreamText(DONE_MESSAGE_PRIMARY, phase === 'done');
	const donePrimaryComplete =
		(phase === 'done' || phase === 'followup-tools') &&
		donePrimaryText.length >= DONE_MESSAGE_PRIMARY.length;
	const doneFollowupText = useStreamText(
		DONE_MESSAGE_FOLLOWUP,
		(phase === 'done' || phase === 'followup-tools') && donePrimaryComplete,
	);

	const assistantComplete =
		phase !== 'assistant' || assistantText.length >= ASSISTANT_REPLY.length;
	const doneFollowupComplete =
		(phase === 'done' || phase === 'followup-tools') &&
		doneFollowupText.length >= DONE_MESSAGE_FOLLOWUP.length;

	const handleSend = useCallback(() => {
		if (phase !== 'input' || sentMessage !== null) return;
		setSentMessage(USER_PROMPT);
		setPhase('thinking');
	}, [phase, sentMessage]);

	useEffect(() => {
		if (phase !== 'thinking') return;
		const start = window.setTimeout(
			() => setPhase('assistant'),
			ASSISTANT_DELAY_MS,
		);
		return () => window.clearTimeout(start);
	}, [phase]);

	const getParentBounds = useCallback(() => {
		const parent = shellRef.current?.parentElement;
		return parent?.getBoundingClientRect() ?? null;
	}, []);

	useLayoutEffect(() => {
		const bounds = getParentBounds();
		if (!bounds) return;
		const w = Math.min(INITIAL_WIDTH, bounds.width);
		const h = Math.min(INITIAL_HEIGHT, bounds.height);
		setSize({ width: w, height: h });
		setPosition({
			left: Math.max(0, bounds.width - w),
			top: Math.max(0, bounds.height - h - INITIAL_BOTTOM_OFFSET),
		});
	}, [getParentBounds]);

	useEffect(() => {
		if (phase !== 'assistant' || !assistantComplete) return;
		const next = window.setTimeout(() => setPhase('tools'), toolRand(280, 520));
		return () => window.clearTimeout(next);
	}, [phase, assistantComplete]);

	useEffect(() => {
		if (phase !== 'tools') {
			mainToolsOrchestratorRef.current = false;
			if (phase === 'input' || phase === 'thinking' || phase === 'assistant') {
				clearPulses();
			}
			return;
		}
		if (mainToolsOrchestratorRef.current) return;
		mainToolsOrchestratorRef.current = true;

		const stop = runToolOrchestrator(MAIN_TOOL_CALLS, {
			onStart: () => {
				setVisibleMainTools(0);
				setMainToolStatuses(MAIN_TOOL_CALLS.map(() => 'pending'));
				clearPulses();
			},
			onReveal: (index, tool) => {
				setVisibleMainTools(index + 1);
				setMainToolStatuses((prev) => {
					const next = [...prev];
					next[index] = 'running';
					return next;
				});
				pulseIntegration(pulseIdForTool(tool));
			},
			onComplete: (index, tool) => {
				setMainToolStatuses((prev) => {
					const next = [...prev];
					next[index] = 'done';
					return next;
				});
				unpulseIntegration(pulseIdForTool(tool));
			},
			onAllComplete: () => setPhase('done'),
		});

		return () => {
			mainToolsOrchestratorRef.current = false;
			stop();
		};
	}, [phase, clearPulses, pulseIntegration, unpulseIntegration]);

	useEffect(() => {
		if (phase !== 'done' || !doneFollowupComplete) return;
		const next = window.setTimeout(
			() => setPhase('followup-tools'),
			toolRand(300, 500),
		);
		return () => window.clearTimeout(next);
	}, [phase, doneFollowupComplete]);

	useEffect(() => {
		if (phase !== 'followup-tools') {
			followupToolsOrchestratorRef.current = false;
			return;
		}
		if (followupToolsOrchestratorRef.current) return;
		followupToolsOrchestratorRef.current = true;

		const stop = runToolOrchestrator(FOLLOWUP_TOOL_CALLS, {
			onStart: () => {
				setVisibleFollowupTools(0);
				setFollowupToolStatuses(FOLLOWUP_TOOL_CALLS.map(() => 'pending'));
			},
			onReveal: (index, tool) => {
				setVisibleFollowupTools(index + 1);
				setFollowupToolStatuses((prev) => {
					const next = [...prev];
					next[index] = 'running';
					return next;
				});
				pulseIntegration(pulseIdForTool(tool));
			},
			onComplete: (index, tool) => {
				setFollowupToolStatuses((prev) => {
					const next = [...prev];
					next[index] = 'done';
					return next;
				});
				unpulseIntegration(pulseIdForTool(tool));
			},
			onAllComplete: () => {},
		});

		return () => {
			followupToolsOrchestratorRef.current = false;
			stop();
		};
	}, [phase, pulseIntegration, unpulseIntegration]);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [
		sentMessage,
		assistantText,
		visibleMainTools,
		mainToolStatuses,
		donePrimaryText,
		doneFollowupText,
		visibleFollowupTools,
		followupToolStatuses,
		phase,
	]);

	const {
		handleDragStart,
		isDragging,
		isResizing,
		latestPositionRef,
		latestSizeRef,
	} = useWindowPointerInteractions({
		activate,
		blockedDragTargetSelector: 'button',
		edgeGap: 0,
		getBounds: getParentBounds,
		minSize: { width: MIN_WIDTH, height: MIN_HEIGHT },
		position,
		setPosition,
		setSize,
		shellRef,
		size,
	});

	const isInteracting = isDragging || isResizing;
	const renderPosition = isInteracting
		? (latestPositionRef.current ?? position)
		: position;
	const renderSize = isInteracting ? (latestSizeRef.current ?? size) : size;
	const isReady = position !== null;
	const showInput = phase === 'input';

	return (
		<div
			ref={shellRef}
			onPointerDown={activate}
			className="absolute left-0 top-0 flex touch-none flex-col overflow-hidden rounded-[20px] border border-[#1c1c1c1a] bg-white transition-[box-shadow,opacity] duration-200 will-change-[transform,width,height]"
			style={{
				opacity: isReady ? 1 : 0,
				height: `${renderSize.height}px`,
				width: `${renderSize.width}px`,
				transform: renderPosition
					? `translate3d(${renderPosition.left}px, ${renderPosition.top}px, 0)`
					: 'translate3d(0, 0, 0)',
				zIndex,
				boxShadow:
					isDragging || isResizing
						? 'var(--twenty-shadow-elevated)'
						: 'var(--twenty-shadow-resting)',
			}}
		>
			<div
				className="grid h-12 w-full shrink-0 select-none grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-[#1c1c1c1a] px-3"
				style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
				onPointerDown={handleDragStart}
			>
				<TrafficLights />
				<div className="flex min-w-0 items-center justify-center gap-1.5">
					<PersonAvatar person={CHAT_PERSON} size={18} />
					<span className="truncate text-[13px] font-semibold text-[#1c1c1c]">
						{CHAT_PERSON.name}
					</span>
				</div>
				<div className="w-[52px]" />
			</div>

			<div className="flex min-h-0 flex-1 flex-col gap-2 p-3 pt-2">
				<ChatMessages
					scrollRef={scrollRef}
					sentMessage={sentMessage}
					isThinking={phase === 'thinking'}
					assistantText={assistantText}
					visibleMainTools={visibleMainTools}
					mainToolStatuses={mainToolStatuses}
					visibleFollowupTools={visibleFollowupTools}
					followupToolStatuses={followupToolStatuses}
					donePrimaryText={donePrimaryText}
					doneFollowupText={doneFollowupText}
					assistantComplete={assistantComplete}
					donePrimaryComplete={donePrimaryComplete}
					doneFollowupComplete={doneFollowupComplete}
				/>

				<div className="mt-auto shrink-0">
					<div className="mb-1.5 flex items-center gap-1.5 px-0.5">
						<span className="size-1.5 rounded-full bg-[#1a7f4b]" />
						<span className="text-[10px] font-medium text-[#1c1c1c80]">
							Corsair connected
						</span>
						<span className="text-[10px] text-[#1c1c1c4d]">·</span>
						<span className="truncate text-[10px] text-[#1c1c1c66]">
							Granola, HubSpot, Notion, GCal, Gmail, Slack
						</span>
					</div>
					<div
						className={`flex min-h-[88px] flex-col justify-between rounded-2xl border p-2.5 transition-colors ${
							showInput
								? 'border-[#4a38f533] bg-white'
								: 'border-[#1c1c1c1a] bg-[#fafafa]'
						}`}
					>
						{showInput ? (
							<p className="text-[12px] leading-snug text-[#1c1c1c]">
								{USER_PROMPT}
							</p>
						) : (
							<span className="text-[12px] text-[#1c1c1c4d]">
								Ask your agent anything…
							</span>
						)}
						<div className="flex items-center justify-between">
							<span className="text-[#1c1c1c40]">📎</span>
							<div className="flex items-center gap-1">
								<span className="rounded-md border border-[#1c1c1c1a] bg-white px-2 py-0.5 text-[10px] text-[#1c1c1c99]">
									Claude Sonnet
								</span>
								<button
									type="button"
									onClick={handleSend}
									disabled={!showInput}
									className="flex size-6 items-center justify-center rounded-full bg-[#4a38f5] text-white transition-opacity disabled:cursor-default disabled:opacity-40"
									aria-label="Send message"
								>
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<line x1="12" y1="19" x2="12" y2="5" />
										<polyline points="5 12 12 5 19 12" />
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
