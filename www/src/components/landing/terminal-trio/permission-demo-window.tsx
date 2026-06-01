'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TRIO_DEMO_PEOPLE } from '../data/companies-data';
import {
	ChatInputShell,
	ChatScrollArea,
	DemoLinkButton,
	StreamingAssistantBubble,
	SuccessBubble,
	ToolCallRow,
	TypingIndicator,
	UserBubble,
} from './chat-ui';
import { PermissionModalContent } from './corsair-demo-modal';
import { DraggableWindowShell } from './draggable-chat-window';
import { useTrioModal } from './trio-modal-context';
import { useDemoChatSend, useStreamText } from './use-demo-chat';

const PERSON = TRIO_DEMO_PEOPLE[1];

const USER_PROMPT =
	"Reply to Dev's email and tell him we'd like to start using Corsair this week and to send over the agreement.";

const FIRST_REPLY = "Let me find Dev's email";

const SECOND_REPLY_PREFIX =
	"Found it! Let me draft that email up. Looks like you'll need to grant permission to send. Use ";

export function PermissionDemoWindow({
	index,
	total,
}: {
	index: number;
	total: number;
}) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const { open, close } = useTrioModal();
	const [sent, setSent] = useState(false);
	const [showFindTool, setShowFindTool] = useState(false);
	const [findDone, setFindDone] = useState(false);
	const [secondActive, setSecondActive] = useState(false);

	const {
		phase,
		sentMessage,
		assistantText,
		assistantComplete,
		handleSend,
		showInput,
		hasSent,
	} = useDemoChatSend(USER_PROMPT, FIRST_REPLY);

	const secondText = useStreamText(SECOND_REPLY_PREFIX, secondActive);
	const secondComplete =
		secondActive && secondText.length >= SECOND_REPLY_PREFIX.length;

	const openPermissionModal = useCallback(() => {
		open(
			<PermissionModalContent
				integrationId="gmail"
				onClose={close}
				onDeny={close}
				onApprove={() => {
					close();
					setSent(true);
				}}
			/>,
		);
	}, [open, close]);

	useEffect(() => {
		if (!assistantComplete || phase !== 'done') return;
		const timer = window.setTimeout(() => setShowFindTool(true), 400);
		return () => window.clearTimeout(timer);
	}, [assistantComplete, phase]);

	useEffect(() => {
		if (!showFindTool) return;
		const timer = window.setTimeout(() => setFindDone(true), 1200);
		return () => window.clearTimeout(timer);
	}, [showFindTool]);

	useEffect(() => {
		if (!findDone) return;
		const timer = window.setTimeout(() => setSecondActive(true), 500);
		return () => window.clearTimeout(timer);
	}, [findDone]);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [
		phase,
		sentMessage,
		assistantText,
		secondText,
		showFindTool,
		findDone,
		sent,
		hasSent,
	]);

	return (
		<DraggableWindowShell
			id="trio-window-permission"
			index={index}
			total={total}
			person={PERSON}
		>
			<ChatScrollArea scrollRef={scrollRef}>
				{sentMessage ? (
					<UserBubble person={PERSON}>{sentMessage}</UserBubble>
				) : null}

				{phase === 'thinking' ? <TypingIndicator /> : null}

				{hasSent ? (
					<StreamingAssistantBubble
						text={assistantText}
						complete={assistantComplete}
					/>
				) : null}

				{showFindTool ? (
					<div className="ml-7 flex flex-col gap-1.5 pl-0.5">
						<ToolCallRow
							integrationId="gmail"
							description="Find Dev's latest email thread"
							status={findDone ? 'done' : 'running'}
						/>
					</div>
				) : null}

				{secondActive ? (
					<StreamingAssistantBubble
						text={secondText}
						complete={secondComplete}
						trailing={
							secondComplete && !sent ? (
								<>
									<DemoLinkButton onClick={openPermissionModal}>
										this URL
									</DemoLinkButton>
									.
								</>
							) : secondComplete && sent ? (
								'this URL.'
							) : null
						}
					/>
				) : null}

				{sent ? (
					<>
						<div className="ml-7 flex flex-col gap-1.5 pl-0.5">
							<ToolCallRow
								integrationId="gmail"
								description="Send to dev@corsair.dev"
								status="done"
							/>
						</div>
						<SuccessBubble>Sent!</SuccessBubble>
					</>
				) : null}
			</ChatScrollArea>

			<ChatInputShell
				integrations="Gmail, Notion"
				logoIds={['gmail', 'notion']}
				prompt={USER_PROMPT}
				showInput={showInput}
				onSend={handleSend}
			/>
		</DraggableWindowShell>
	);
}
