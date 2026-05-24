'use client';

import type { JSX } from 'react';
import type { IntegrationId } from '../data/companies-data';
import { INTEGRATION_BY_ID } from '../data/companies-data';
import { FaviconLogo } from '../app-preview/table-ui';
import {
	AssistantBubble,
	ToolCallRow,
	UserBubble,
} from '../terminal-trio/chat-ui';
import { CorsairInfrastructureLayer } from './corsair-infrastructure-layer';
import type { UseCaseId } from './use-cases-data';

function IntegrationChip({
	id,
	size = 32,
	label,
	className = '',
}: {
	id: IntegrationId;
	size?: number;
	label?: string;
	className?: string;
}) {
	const integration = INTEGRATION_BY_ID[id];

	return (
		<div
			className={`flex items-center gap-2 rounded-lg border border-[#1c1c1c12] bg-white px-2 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${className}`}
		>
			<FaviconLogo
				domain={integration.iconDomain}
				label={integration.label}
				size={size}
			/>
			{label ? (
				<span className="text-[11px] font-medium text-[#1c1c1c]">{label}</span>
			) : null}
		</div>
	);
}

function ConnectorLines({
	points,
	className = '',
}: {
	points: Array<{ x: number; y: number }>;
	className?: string;
}) {
	const path = points
		.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
		.join(' ');

	return (
		<svg
			className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
			aria-hidden
		>
			<path
				d={path}
				fill="none"
				stroke="#4a38f5"
				strokeWidth="0.35"
				strokeDasharray="1.5 1"
				className="landing-use-case-flow-line"
				opacity="0.45"
			/>
		</svg>
	);
}

function PersonalAssistantVisual({ integrations }: { integrations: IntegrationId[] }) {
	const positions = [
		{ x: '12%', y: '18%' },
		{ x: '78%', y: '14%' },
		{ x: '88%', y: '48%' },
		{ x: '72%', y: '72%' },
		{ x: '18%', y: '74%' },
		{ x: '6%', y: '46%' },
	];

	return (
		<div className="relative h-full w-full">
			<div
				className="pointer-events-none absolute inset-0 opacity-40"
				style={{
					backgroundImage:
						'radial-gradient(circle at 50% 42%, rgba(74,56,245,0.12) 0%, transparent 55%)',
				}}
			/>

			<ConnectorLines
				points={[
					{ x: 50, y: 42 },
					{ x: 18, y: 22 },
					{ x: 50, y: 42 },
					{ x: 82, y: 18 },
					{ x: 50, y: 42 },
					{ x: 90, y: 50 },
					{ x: 50, y: 42 },
					{ x: 78, y: 74 },
					{ x: 50, y: 42 },
					{ x: 22, y: 76 },
					{ x: 50, y: 42 },
					{ x: 10, y: 48 },
				]}
			/>

			<ConnectorLines
				className="opacity-60"
				points={[
					{ x: 18, y: 22 },
					{ x: 82, y: 18 },
					{ x: 90, y: 50 },
					{ x: 78, y: 74 },
					{ x: 22, y: 76 },
					{ x: 10, y: 48 },
					{ x: 18, y: 22 },
				]}
			/>

			<div className="absolute left-1/2 top-[38%] z-10 w-[min(240px,72%)] -translate-x-1/2 -translate-y-1/2">
				<div className="rounded-xl border border-[#4a38f533] bg-[#f0edff] px-3 py-2.5 text-center shadow-[0_4px_20px_rgba(74,56,245,0.15)]">
					<p className="mb-1 font-[family-name:var(--landing-font-mono)] text-[9px] font-medium uppercase tracking-[0.06em] text-[#4a38f5]">
						Your assistant
					</p>
					<p className="text-[12px] leading-snug text-[#1c1c1c]">
						&quot;Block Thursday, notify the team, and log it in HubSpot.&quot;
					</p>
				</div>
			</div>

			{integrations.map((id, index) => {
				const pos = positions[index % positions.length];
				return (
					<div
						key={id}
						className="landing-use-case-node absolute z-10"
						style={{ left: pos.x, top: pos.y, animationDelay: `${index * 120}ms` }}
					>
						<IntegrationChip id={id} size={24} />
					</div>
				);
			})}

			<div className="absolute left-[28%] top-[32%] z-[5] max-w-[120px] rounded-lg rounded-bl-sm bg-white px-2 py-1 text-[9px] leading-snug text-[#1c1c1c99] shadow-sm">
				GCal updated
			</div>
			<div className="absolute right-[24%] top-[58%] z-[5] max-w-[120px] rounded-lg rounded-br-sm bg-[#4a38f5] px-2 py-1 text-[9px] leading-snug text-white shadow-sm">
				Posted to #sales
			</div>
		</div>
	);
}

function WorkflowAutomationVisual({ integrations }: { integrations: IntegrationId[] }) {
	const steps = integrations.map((id, index) => ({
		id,
		label:
			index === 0
				? 'Trigger'
				: index === integrations.length - 1
					? 'Complete'
					: 'Action',
	}));

	return (
		<div className="relative flex h-full w-full flex-col items-center justify-center px-4 pb-2 pt-2">
			<div
				className="pointer-events-none absolute inset-0 opacity-30"
				style={{
					backgroundImage:
						'repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(74,56,245,0.08)_39px,rgba(74,56,245,0.08)_40px), repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(74,56,245,0.06)_39px,rgba(74,56,245,0.06)_40px)',
				}}
			/>

			<p className="relative z-10 mb-5 font-[family-name:var(--landing-font-mono)] text-[9px] font-medium uppercase tracking-[0.06em] text-[#1c1c1c66]">
				When a deal closes in Slack →
			</p>

			<div className="relative z-10 flex w-full max-w-[640px] flex-wrap items-center justify-center gap-2 md:flex-nowrap md:gap-0">
				{steps.map((step, index) => (
					<div key={step.id} className="flex items-center">
						<div
							className="landing-workflow-step flex flex-col items-center gap-1.5"
							style={{ animationDelay: `${index * 600}ms` }}
						>
							<IntegrationChip id={step.id} size={28} label={step.label} />
						</div>
						{index < steps.length - 1 ? (
							<div className="mx-1 hidden items-center md:flex">
								<svg
									width="28"
									height="12"
									viewBox="0 0 28 12"
									fill="none"
									aria-hidden
									className="landing-use-case-flow-line text-[#4a38f5]"
								>
									<path
										d="M0 6h20M20 6l-5-4M20 6l-5 4"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeDasharray="3 2"
									/>
								</svg>
							</div>
						) : null}
					</div>
				))}
			</div>

			<div className="relative z-10 mt-6 w-full max-w-[420px] rounded-lg border border-[#1c1c1c12] bg-white/90 px-3 py-2">
				<div className="flex items-center gap-2">
					<span className="size-2 shrink-0 rounded-full bg-[#4a38f5] landing-workflow-pulse-dot" />
					<p className="text-[11px] text-[#1c1c1c99]">
						<span className="font-medium text-[#1c1c1c]">Running workflow</span>
						{' · '}
						Step 3 of {steps.length}
					</p>
				</div>
			</div>
		</div>
	);
}

function KnowledgeBaseVisual({ integrations }: { integrations: IntegrationId[] }) {
	return (
		<div className="relative flex h-full w-full flex-col items-center px-4 pb-2 pt-4">
			<div className="relative z-10 flex w-full max-w-[520px] flex-wrap items-start justify-center gap-3">
				{integrations.map((id, index) => (
					<div
						key={id}
						className="landing-use-case-node flex flex-col items-center gap-1"
						style={{ animationDelay: `${index * 100}ms` }}
					>
						<IntegrationChip id={id} size={24} />
						<svg
							width="2"
							height="28"
							viewBox="0 0 2 28"
							fill="none"
							aria-hidden
							className="landing-knowledge-feed-line"
							style={{ animationDelay: `${index * 150}ms` }}
						>
							<line
								x1="1"
								y1="0"
								x2="1"
								y2="28"
								stroke="#4a38f5"
								strokeWidth="1.5"
								strokeDasharray="3 2"
							/>
						</svg>
					</div>
				))}
			</div>

			<div className="relative z-10 mt-1 w-full max-w-[360px] rounded-xl border border-[#1c1c1c12] bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
				<div className="mb-2 flex items-center gap-2 border-b border-[#1c1c1c0d] pb-2">
					<span className="flex size-6 items-center justify-center rounded-md bg-[#f0edff] text-[11px]">
						📚
					</span>
					<p className="text-[12px] font-medium text-[#1c1c1c]">
						Unified knowledge base
					</p>
				</div>
				<div className="mb-2 rounded-md border border-[#1c1c1c12] bg-[#fafafa] px-2.5 py-1.5 text-[11px] text-[#1c1c1c66]">
					Search across all connected sources…
				</div>
				<div className="flex flex-col gap-1.5">
					{[
						'Q4 roadmap — Notion',
						'Customer thread — Gmail',
						'#product-updates — Slack',
					].map((result) => (
						<div
							key={result}
							className="rounded-md border border-[#1c1c1c0d] bg-[#fafafa] px-2 py-1 text-[10px] text-[#1c1c1c99]"
						>
							{result}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function AgentChatbotVisual({ integrations }: { integrations: IntegrationId[] }) {
	const person = { name: 'Dev', tone: 'blue' };

	return (
		<div className="relative flex h-full w-full items-center justify-center px-4 pb-2 pt-3">
			<div className="relative z-10 flex h-[min(100%,280px)] w-full max-w-[340px] flex-col overflow-hidden rounded-xl border border-[#1c1c1c12] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
				<div className="flex items-center gap-2 border-b border-[#1c1c1c0d] px-3 py-2">
					<span className="flex size-5 items-center justify-center rounded-md bg-[#0d0f1a] text-[8px] font-bold text-white">
						AI
					</span>
					<p className="text-[11px] font-medium text-[#1c1c1c]">Agent chat</p>
					<span className="ml-auto flex items-center gap-0.5">
						{integrations.slice(0, 3).map((id) => {
							const linked = INTEGRATION_BY_ID[id];
							return (
								<FaviconLogo
									key={id}
									domain={linked.iconDomain}
									label={linked.label}
									size={14}
								/>
							);
						})}
					</span>
				</div>

				<div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-3">
					<UserBubble person={person}>
						Summarize yesterday&apos;s Airtable updates and post to Slack.
					</UserBubble>
					<AssistantBubble>
						On it — pulling from Airtable and drafting the Slack message.
					</AssistantBubble>
					<div className="flex flex-col gap-1.5">
						<ToolCallRow
							integrationId={integrations[0]}
							description="List updated records"
							status="done"
						/>
						<ToolCallRow
							integrationId={integrations[1]}
							description="Post summary to #team"
							status="running"
						/>
					</div>
				</div>

				<div className="border-t border-[#1c1c1c0d] px-3 py-2">
					<div className="rounded-lg border border-[#1c1c1c12] bg-[#fafafa] px-2.5 py-2 text-[11px] text-[#1c1c1c4d]">
						Ask your agent anything…
					</div>
				</div>
			</div>
		</div>
	);
}

const VISUALS: Record<
	UseCaseId,
	(props: { integrations: IntegrationId[] }) => JSX.Element
> = {
	'personal-assistant': PersonalAssistantVisual,
	'workflow-automation': WorkflowAutomationVisual,
	'knowledge-base': KnowledgeBaseVisual,
	'agent-chatbot': AgentChatbotVisual,
};

export function UseCasesVisual({
	useCaseId,
	integrations,
}: {
	useCaseId: UseCaseId;
	integrations: IntegrationId[];
}) {
	const Visual = VISUALS[useCaseId];

	return (
		<div className="relative h-[420px] overflow-hidden md:h-[460px]">
			<div
				key={useCaseId}
				className="landing-use-case-visual-enter absolute inset-0 bottom-[72px] overflow-hidden bg-[linear-gradient(180deg,#fafafa_0%,#f4f4f4_100%)]"
			>
				<Visual integrations={integrations} />

				<div className="pointer-events-none absolute inset-x-[8%] bottom-0 z-[15] flex justify-center">
					{integrations.map((id, index) => (
						<svg
							key={id}
							width="2"
							height="48"
							viewBox="0 0 2 48"
							fill="none"
							aria-hidden
							className="landing-use-case-downstream-line mx-3 md:mx-5"
							style={{ animationDelay: `${index * 80}ms` }}
						>
							<line
								x1="1"
								y1="0"
								x2="1"
								y2="48"
								stroke="#4a38f5"
								strokeWidth="1.5"
								strokeDasharray="4 3"
							/>
						</svg>
					))}
				</div>
			</div>

			<CorsairInfrastructureLayer />
		</div>
	);
}
