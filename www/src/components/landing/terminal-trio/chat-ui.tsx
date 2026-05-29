'use client';

import type { ReactNode, RefObject } from 'react';
import { INTEGRATION_BY_ID } from '../data/companies-data';
import type { IntegrationId } from '../data/companies-data';
import { FaviconLogo, PersonAvatar } from '../app-preview/table-ui';

type ChatPerson = {
	name: string;
	tone?: string;
	avatar?: string;
};

export function TypingIndicator() {
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

export function UserBubble({
	person,
	children,
}: {
	person: ChatPerson;
	children: ReactNode;
}) {
	return (
		<div className="flex items-end justify-end gap-1.5">
			<div className="max-w-[92%] rounded-2xl rounded-br-md bg-[#4a38f5] px-2.5 py-2 text-[12px] leading-snug text-white">
				{children}
			</div>
			<PersonAvatar person={person} size={20} />
		</div>
	);
}

export function AssistantBubble({ children }: { children: ReactNode }) {
	return (
		<div className="flex items-start gap-1.5">
			<span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-[#0d0f1a] text-[9px] font-bold text-white">
				AI
			</span>
			<div className="max-w-[92%] rounded-2xl rounded-bl-md bg-[#1c1c1c0d] px-2.5 py-2 text-[12px] leading-snug text-[#1c1c1c]">
				{children}
			</div>
		</div>
	);
}

export function StreamingAssistantBubble({
	text,
	complete,
	trailing,
	inlineLink,
}: {
	text: string;
	complete: boolean;
	trailing?: ReactNode;
	inlineLink?: {
		before: string;
		linkText: string;
		onClick: () => void;
		active?: boolean;
	};
}) {
	if (!text.length && !complete) return null;

	const renderContent = () => {
		if (!inlineLink) return text;

		const { before, linkText, onClick, active = true } = inlineLink;
		const linkStart = before.length;
		const linkEnd = linkStart + linkText.length;

		if (text.length <= linkStart) return text;

		const linkPortion = text.slice(linkStart, Math.min(text.length, linkEnd));
		const suffix = text.length > linkEnd ? text.slice(linkEnd) : '';

		return (
			<>
				{before}
				{linkPortion.length === linkText.length && active ? (
					<DemoLinkButton onClick={onClick}>{linkText}</DemoLinkButton>
				) : (
					linkPortion
				)}
				{suffix}
			</>
		);
	};

	return (
		<AssistantBubble>
			{renderContent()}
			{!complete ? (
				<span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-[#1c1c1c66] align-middle" />
			) : null}
			{complete ? trailing : null}
		</AssistantBubble>
	);
}

export function StreamingSuccessBubble({
	text,
	complete,
}: {
	text: string;
	complete: boolean;
}) {
	if (!text.length) return null;

	return (
		<SuccessBubble>
			{text}
			{!complete ? (
				<span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-[#145c3666] align-middle" />
			) : null}
		</SuccessBubble>
	);
}

export function SuccessBubble({ children }: { children: ReactNode }) {
	return (
		<div className="flex items-start gap-1.5">
			<span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-[#0d0f1a] text-[9px] font-bold text-white">
				AI
			</span>
			<div className="max-w-[92%] rounded-2xl rounded-bl-md border border-[#1a7f4b33] bg-[#e8f5ee] px-2.5 py-2 text-[12px] leading-snug text-[#145c36]">
				{children}
			</div>
		</div>
	);
}

export function DemoLinkButton({
	children,
	onClick,
}: {
	children: ReactNode;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="font-medium text-[#4a38f5] underline decoration-[#4a38f566] underline-offset-2 transition-colors hover:text-[#3d2ee0]"
		>
			{children}
		</button>
	);
}

export function ToolCallRow({
	integrationId,
	description,
	status = 'done',
}: {
	integrationId: IntegrationId;
	description: string;
	status?: 'running' | 'done';
}) {
	const linked = INTEGRATION_BY_ID[integrationId];

	return (
		<div className="flex items-center gap-2 rounded-lg border border-[#1c1c1c12] bg-[#fafafa] px-2 py-1.5">
			<FaviconLogo domain={linked.iconDomain} label={linked.label} size={16} />
			<div className="min-w-0 flex-1">
				<p className="truncate text-[11px] font-medium text-[#1c1c1c]">
					{linked.label}
				</p>
				<p className="truncate text-[10px] leading-tight text-[#1c1c1c80]">
					{description}
				</p>
			</div>
			{status === 'running' ? (
				<span className="size-3 animate-spin rounded-full border-2 border-[#1c1c1c1a] border-t-[#4a38f5]" />
			) : (
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
					<circle cx="12" cy="12" r="10" fill="#e8f5ee" />
					<path
						d="M8 12.5l2.5 2.5L16 9"
						stroke="#1a7f4b"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			)}
		</div>
	);
}

export function TriggerToolRow({
	integrations,
	description,
	status = 'done',
}: {
	integrations: Array<IntegrationId | { domain: string; label: string }>;
	description: string;
	status?: 'running' | 'done';
}) {
	return (
		<div className="flex items-center gap-2 rounded-lg border border-[#1c1c1c12] bg-[#fafafa] px-2 py-1.5">
			<span className="flex shrink-0 items-center gap-0.5">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden>
					<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z" />
				</svg>
				{integrations.map((item) => {
					const linked =
						typeof item === 'string'
							? INTEGRATION_BY_ID[item]
							: { iconDomain: item.domain, label: item.label };
					return (
						<FaviconLogo
							key={linked.iconDomain}
							domain={linked.iconDomain}
							label={linked.label}
							size={14}
						/>
					);
				})}
			</span>
			<div className="min-w-0 flex-1">
				<p className="truncate text-[11px] font-medium text-[#1c1c1c]">Trigger</p>
				<p className="truncate text-[10px] leading-tight text-[#1c1c1c80]">
					{description}
				</p>
			</div>
			{status === 'running' ? (
				<span className="size-3 animate-spin rounded-full border-2 border-[#1c1c1c1a] border-t-[#4a38f5]" />
			) : (
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
					<circle cx="12" cy="12" r="10" fill="#e8f5ee" />
					<path
						d="M8 12.5l2.5 2.5L16 9"
						stroke="#1a7f4b"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			)}
		</div>
	);
}

export function ChatScrollArea({
	scrollRef,
	children,
}: {
	scrollRef?: RefObject<HTMLDivElement | null>;
	children: ReactNode;
}) {
	return (
		<div
			ref={scrollRef}
			className="relative flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain pr-0.5"
		>
			{children}
		</div>
	);
}

export function ChatInputShell({
	integrations,
	logoIds,
	prompt,
	showInput = false,
	onSend,
}: {
	integrations: string;
	logoIds?: IntegrationId[];
	prompt?: string;
	showInput?: boolean;
	onSend?: () => void;
}) {
	return (
		<div className="mt-auto shrink-0">
			<div className="mb-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 px-0.5">
				<span className="size-1.5 shrink-0 rounded-full bg-[#1a7f4b]" />
				<span className="text-[10px] font-medium text-[#1c1c1c80]">
					Corsair connected
				</span>
				{logoIds && logoIds.length > 0 ? (
					<span className="flex items-center gap-0.5">
						{logoIds.map((id) => {
							const linked = INTEGRATION_BY_ID[id];
							return (
								<FaviconLogo
									key={id}
									domain={linked.iconDomain}
									label={linked.label}
									size={12}
								/>
							);
						})}
					</span>
				) : null}
				<span className="hidden text-[10px] text-[#1c1c1c4d] sm:inline">·</span>
				<span className="text-[10px] leading-snug text-[#1c1c1c66] sm:truncate">
					{integrations}
				</span>
			</div>
			<div
				className={`flex min-h-[88px] flex-col justify-between rounded-2xl border p-2.5 transition-colors ${
					showInput
						? 'border-[#4a38f533] bg-white'
						: 'border-[#1c1c1c1a] bg-[#fafafa]'
				}`}
			>
				{showInput && prompt ? (
					<p className="text-[12px] leading-snug text-[#1c1c1c]">{prompt}</p>
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
						<span className="relative flex size-6 items-center justify-center">
							{showInput ? (
								<span
									className="landing-send-cta-ring pointer-events-none absolute inset-0 rounded-full bg-[#4a38f5]"
									aria-hidden
								/>
							) : null}
							<button
								type="button"
								onClick={onSend}
								disabled={!showInput}
								data-cursor={showInput ? 'btn' : undefined}
								className={`relative z-10 flex size-6 items-center justify-center rounded-full bg-[#4a38f5] text-white transition-[opacity,transform,box-shadow] hover:brightness-110 disabled:cursor-default disabled:opacity-40 ${
									showInput ? 'landing-send-cta-pulse cursor-pointer' : ''
								}`}
								aria-label="Send message"
							>
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									aria-hidden
								>
									<line x1="12" y1="19" x2="12" y2="5" />
									<polyline points="5 12 12 5 19 12" />
								</svg>
							</button>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
