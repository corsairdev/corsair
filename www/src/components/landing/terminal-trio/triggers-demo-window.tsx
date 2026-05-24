'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TRIO_DEMO_PEOPLE } from '../data/companies-data';
import {
	ChatInputShell,
	ChatScrollArea,
	DemoLinkButton,
	StreamingAssistantBubble,
	TriggerToolRow,
	TypingIndicator,
	UserBubble,
} from './chat-ui';
import type { TriggerListItem } from './corsair-demo-modal';
import { TriggersModalContent } from './corsair-demo-modal';
import { DraggableWindowShell } from './draggable-chat-window';
import { useTrioModal } from './trio-modal-context';
import { useDemoChatSend, useStreamText } from './use-demo-chat';

const PERSON = TRIO_DEMO_PEOPLE[2];

const USER_PROMPT =
	'Message me in Slack when Dev finally uploads the Q4 financials to Drive.';

const ASSISTANT_REPLY = "Sure thing! I'll set up a trigger to do that.";

const FOLLOWUP_PREFIX = 'Trigger is live.';

const TRIGGER_ITEMS: TriggerListItem[] = [
	{
		id: 'drive-slack',
		kind: 'trigger',
		integrations: [
			{ domain: 'drive.google.com', label: 'Drive' },
			{ domain: 'slack.com', label: 'Slack' },
		],
		title: 'Q4 financials uploaded',
		description: 'When Dev uploads to Drive → DM you in Slack',
		highlight: true,
	},
	{
		id: 'hubspot-cron',
		kind: 'cron',
		integrations: [
			{ domain: 'hubspot.com', label: 'HubSpot' },
			{ domain: 'slack.com', label: 'Slack' },
		],
		title: 'Weekly pipeline summary',
		description: 'Mon 9:00 AM · Post HubSpot deals to #sales',
	},
	{
		id: 'linear-notion',
		kind: 'webhook',
		integrations: [
			{ domain: 'linear.app', label: 'Linear' },
			{ domain: 'notion.so', label: 'Notion' },
		],
		title: 'Issue closed',
		description: 'When Linear issue closes → update Notion doc',
	},
	{
		id: 'stripe-slack',
		kind: 'webhook',
		integrations: [
			{ domain: 'stripe.com', label: 'Stripe' },
			{ domain: 'slack.com', label: 'Slack' },
		],
		title: 'Large payment received',
		description: 'When charge over $10k → notify #finance',
	},
];

export function TriggersDemoWindow({
	index,
	total,
}: {
	index: number;
	total: number;
}) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const { open, close } = useTrioModal();
	const [showTools, setShowTools] = useState(false);
	const [triggerReady, setTriggerReady] = useState(false);
	const [followupActive, setFollowupActive] = useState(false);

	const {
		phase,
		sentMessage,
		assistantText,
		assistantComplete,
		handleSend,
		showInput,
		hasSent,
	} = useDemoChatSend(USER_PROMPT, ASSISTANT_REPLY);

	const followupText = useStreamText(FOLLOWUP_PREFIX, followupActive);
	const followupComplete =
		followupActive && followupText.length >= FOLLOWUP_PREFIX.length;

	const openTriggersModal = useCallback(() => {
		open(<TriggersModalContent items={TRIGGER_ITEMS} onClose={close} />);
	}, [open, close]);

	useEffect(() => {
		if (!assistantComplete || phase !== 'done') return;
		const showTimer = window.setTimeout(() => setShowTools(true), 400);
		return () => window.clearTimeout(showTimer);
	}, [assistantComplete, phase]);

	useEffect(() => {
		if (!showTools) return;
		const readyTimer = window.setTimeout(() => setTriggerReady(true), 1400);
		return () => window.clearTimeout(readyTimer);
	}, [showTools]);

	useEffect(() => {
		if (!triggerReady) return;
		const followupTimer = window.setTimeout(() => setFollowupActive(true), 500);
		return () => window.clearTimeout(followupTimer);
	}, [triggerReady]);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [
		phase,
		sentMessage,
		assistantText,
		showTools,
		triggerReady,
		followupText,
		hasSent,
	]);

	return (
		<DraggableWindowShell
			id="trio-window-triggers"
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

				{showTools ? (
					<div className="ml-7 flex flex-col gap-1.5 pl-0.5">
						<TriggerToolRow
							integrations={[
								{ domain: 'drive.google.com', label: 'Drive' },
								'slack',
							]}
							description="When Dev uploads Q4 financials to Drive → DM you in Slack"
							status={triggerReady ? 'done' : 'running'}
						/>
					</div>
				) : null}

				{followupActive ? (
					<StreamingAssistantBubble
						text={followupText}
						complete={followupComplete}
						trailing={
							followupComplete ? (
								<>
									{' '}
									<DemoLinkButton onClick={openTriggersModal}>
										View all your reminders &amp; triggers
									</DemoLinkButton>
									.
								</>
							) : null
						}
					/>
				) : null}
			</ChatScrollArea>

			<ChatInputShell
				integrations="Slack, Drive, HubSpot, Linear"
				logoIds={['slack', 'hubspot', 'linear']}
				prompt={USER_PROMPT}
				showInput={showInput}
				onSend={handleSend}
			/>
		</DraggableWindowShell>
	);
}
