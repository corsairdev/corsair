'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TRIO_DEMO_PEOPLE } from '../data/companies-data';
import {
	ChatInputShell,
	ChatScrollArea,
	StreamingAssistantBubble,
	StreamingSuccessBubble,
	ToolCallRow,
	TypingIndicator,
	UserBubble,
} from './chat-ui';
import { OAuthModalContent } from './corsair-demo-modal';
import { DraggableWindowShell } from './draggable-chat-window';
import { useTrioModal } from './trio-modal-context';
import { useDemoChatSend, useStreamText } from './use-demo-chat';

const PERSON = TRIO_DEMO_PEOPLE[0];

const USER_PROMPT = "Pull all orders that haven't been shipped from Airtable.";

const ASSISTANT_BEFORE = "Looks like you haven't signed into Airtable! Use ";
const ASSISTANT_LINK = 'this temporary generated link';
const ASSISTANT_AFTER = " to log in. Then I'll pull those orders.";
const ASSISTANT_REPLY = ASSISTANT_BEFORE + ASSISTANT_LINK + ASSISTANT_AFTER;

const SUCCESS_REPLY =
	'I found 14 unshipped orders. Want me to export them to Sheets or Slack the ops team?';

const POST_CONNECT_THINKING_MS = 3000;
const POST_CONNECT_TOOL_MS = 1200;

type PostConnectPhase = 'idle' | 'thinking' | 'tools' | 'success';

export function OAuthDemoWindow({
	index,
	total,
}: {
	index: number;
	total: number;
}) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const { open, close } = useTrioModal();
	const [postConnectPhase, setPostConnectPhase] =
		useState<PostConnectPhase>('idle');
	const connected = postConnectPhase !== 'idle';
	const {
		phase,
		sentMessage,
		assistantText,
		assistantComplete,
		handleSend,
		showInput,
		hasSent,
	} = useDemoChatSend(USER_PROMPT, ASSISTANT_REPLY);

	const successText = useStreamText(
		SUCCESS_REPLY,
		postConnectPhase === 'success',
	);
	const successComplete =
		postConnectPhase === 'success' &&
		successText.length >= SUCCESS_REPLY.length;

	const openOAuthModal = useCallback(() => {
		open(
			<OAuthModalContent
				integrationId="airtable"
				onClose={close}
				onConnect={() => {
					close();
					setPostConnectPhase('thinking');
				}}
			/>,
		);
	}, [open, close]);

	useEffect(() => {
		if (postConnectPhase !== 'thinking') return;
		const timer = window.setTimeout(
			() => setPostConnectPhase('tools'),
			POST_CONNECT_THINKING_MS,
		);
		return () => window.clearTimeout(timer);
	}, [postConnectPhase]);

	useEffect(() => {
		if (postConnectPhase !== 'tools') return;
		const timer = window.setTimeout(
			() => setPostConnectPhase('success'),
			POST_CONNECT_TOOL_MS,
		);
		return () => window.clearTimeout(timer);
	}, [postConnectPhase]);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [
		phase,
		sentMessage,
		assistantText,
		postConnectPhase,
		successText,
		hasSent,
	]);

	return (
		<DraggableWindowShell
			id="trio-window-oauth"
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
						inlineLink={
							!connected
								? {
										before: ASSISTANT_BEFORE,
										linkText: ASSISTANT_LINK,
										onClick: openOAuthModal,
									}
								: undefined
						}
					/>
				) : null}

				{postConnectPhase === 'thinking' ? <TypingIndicator /> : null}

				{postConnectPhase === 'tools' || postConnectPhase === 'success' ? (
					<>
						<div className="ml-7 flex flex-col gap-1.5 pl-0.5">
							<ToolCallRow
								integrationId="airtable"
								description="List unshipped orders from Fulfillment base"
								status={postConnectPhase === 'success' ? 'done' : 'running'}
							/>
						</div>
						{postConnectPhase === 'success' ? (
							<StreamingSuccessBubble
								text={successText}
								complete={successComplete}
							/>
						) : null}
					</>
				) : null}
			</ChatScrollArea>

			<ChatInputShell
				integrations="Airtable, Sheets, Slack"
				logoIds={['airtable', 'gsheets', 'slack']}
				prompt={USER_PROMPT}
				showInput={showInput}
				onSend={handleSend}
			/>
		</DraggableWindowShell>
	);
}
