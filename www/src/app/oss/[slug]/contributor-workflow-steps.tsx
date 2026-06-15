'use client';

import type { IntegrationPhase } from '@/db/schema';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { integrationToPluginName } from '@/lib/integration-plugin-name';
import {
	DISCORD_URL,
	DOCS_URL,
	GITHUB_ISSUES_URL,
	GITHUB_URL,
} from '@/lib/site-links';
import { cn } from '@/lib/utils';

import {
	MarkReadyToReviewButton,
	ReadyToReviewStatusCallout,
} from '../mark-finished-button';
import { CopyableCommand } from './copyable-command';
import { DeadlineCountdown } from './deadline-countdown';
import { IntegrationUrlFieldForm } from './integration-url-field-form';

const workflowSteps = [
	{ phase: 'awaiting_issue' as const, label: 'Link issue' },
	{ phase: 'awaiting_pr' as const, label: 'Link PR' },
	{ phase: 'building' as const, label: 'Build plugin' },
	{ phase: 'ready_to_review' as const, label: 'Ready to review' },
];

type StepStatus = 'complete' | 'current' | 'upcoming';

function phaseToStepIndex(phase: IntegrationPhase | null) {
	if (!phase || phase === 'released' || phase === 'finished') {
		return -1;
	}
	return workflowSteps.findIndex((step) => step.phase === phase);
}

function getStepStatus(stepIndex: number, phase: IntegrationPhase | null): StepStatus {
	const currentIndex = phaseToStepIndex(phase);

	if (phase === 'ready_to_review') {
		if (stepIndex < 3) return 'complete';
		return 'current';
	}

	if (currentIndex === -1) return 'upcoming';
	if (stepIndex < currentIndex) return 'complete';
	if (stepIndex === currentIndex) return 'current';
	return 'upcoming';
}

function WorkflowStepper({
	phase,
	selectedStep,
	onSelectStep,
}: {
	phase: IntegrationPhase | null;
	selectedStep: number;
	onSelectStep: (index: number) => void;
}) {
	const currentIndex = phaseToStepIndex(phase);

	return (
		<ol className="flex flex-col gap-2 sm:flex-row sm:items-center">
			{workflowSteps.map((step, index) => {
				const status = getStepStatus(index, phase);
				const isSelected = selectedStep === index;
				const isLast = index === workflowSteps.length - 1;

				return (
					<li key={step.phase} className="flex min-w-0 flex-1 items-center gap-2">
						<button
							type="button"
							onClick={() => onSelectStep(index)}
							aria-current={isSelected ? 'step' : undefined}
							className={cn(
								'flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors',
								isSelected &&
									'border-[#1c1c1c]/30 bg-[#1c1c1c]/[0.06] ring-1 ring-[#1c1c1c]/10',
								!isSelected && status === 'current' &&
									'border-[#1c1c1c]/20 bg-[#1c1c1c]/[0.04] hover:bg-[#1c1c1c]/[0.06]',
								!isSelected && status === 'complete' &&
									'border-[#1c1c1c]/10 bg-[#1c1c1c]/[0.02] text-[#1c1c1c66] hover:bg-[#1c1c1c]/[0.04]',
								!isSelected && status === 'upcoming' &&
									'border-[#1c1c1c]/10 text-[#1c1c1c40] hover:bg-[#1c1c1c]/[0.03] hover:text-[#1c1c1c66]',
							)}
						>
							<span
								className={cn(
									'flex size-5 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-landing-mono)] text-[10px]',
									status === 'current' && 'bg-[#1c1c1c] text-white',
									status === 'complete' && 'bg-[#1c1c1c]/10 text-[#1c1c1c]',
									status === 'upcoming' && 'bg-[#1c1c1c]/5 text-[#1c1c1c66]',
								)}
							>
								{status === 'complete' ? '✓' : index + 1}
							</span>
							<span
								className={cn(
									'truncate text-sm',
									(status === 'current' || isSelected) && 'font-medium text-[#1c1c1c]',
								)}
							>
								{step.label}
							</span>
						</button>
						{!isLast ? (
							<span
								className={cn(
									'hidden h-px w-3 shrink-0 sm:block',
									index < currentIndex || phase === 'ready_to_review'
										? 'bg-[#1c1c1c]/20'
										: 'bg-[#1c1c1c]/10',
								)}
								aria-hidden
							/>
						) : null}
					</li>
				);
			})}
		</ol>
	);
}

function WorkflowStepPanel({ children }: { children: ReactNode }) {
	return (
		<div className="rounded-xl border border-[#1c1c1c]/15 bg-white px-4 py-4 text-[14px] leading-relaxed text-[#1c1c1c99] sm:px-5 sm:py-5">
			{children}
		</div>
	);
}

export function ContributorWorkflowSteps({
	integrationId,
	integrationName,
	integrationSlug,
	githubUsername,
	phase,
	issueDeadlineAt,
	prDeadlineAt,
	urls,
}: {
	integrationId: string;
	integrationName: string;
	integrationSlug: string;
	githubUsername: string | null;
	phase: IntegrationPhase | null;
	issueDeadlineAt: string | null;
	prDeadlineAt: string | null;
	urls: {
		issueUrl: string | null;
		prUrl: string | null;
		docsUrl: string | null;
	};
}) {
	const currentStepIndex = phaseToStepIndex(phase);
	const [selectedStep, setSelectedStep] = useState(
		currentStepIndex >= 0 ? currentStepIndex : 0,
	);

	useEffect(() => {
		if (currentStepIndex >= 0) {
			setSelectedStep(currentStepIndex);
		}
	}, [currentStepIndex]);

	if (!phase || phase === 'released' || phase === 'finished') {
		return null;
	}

	const pluginName = integrationToPluginName(integrationName, integrationSlug);
	const cloneCommand = githubUsername
		? `git clone https://github.com/${githubUsername}/corsair.git
cd corsair
pnpm install`
		: `git clone https://github.com/<your-username>/corsair.git
cd corsair
pnpm install`;
	const branchCommand = `git checkout -b feat/${integrationSlug}-plugin`;
	const generateCommand = `pnpm run generate:plugin ${pluginName}`;
	const testCommand = `cd demo/testing
pnpm test`;

	const selectedStatus = getStepStatus(selectedStep, phase);

	return (
		<section className="mb-10 space-y-4">
			{phase === 'awaiting_issue' && issueDeadlineAt ? (
				<DeadlineCountdown
					deadlineIso={issueDeadlineAt}
					label="Time left to link your issue"
				/>
			) : null}

			{phase === 'awaiting_pr' && prDeadlineAt ? (
				<DeadlineCountdown
					deadlineIso={prDeadlineAt}
					label="Time left to link your PR"
				/>
			) : null}

			<div className="space-y-3">
				<h2 className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
					Your progress
				</h2>
				<WorkflowStepper
					phase={phase}
					selectedStep={selectedStep}
					onSelectStep={setSelectedStep}
				/>
			</div>

			<WorkflowStepPanel>
				{selectedStep === 0 ? (
					<>
						<p>
							<strong className="font-medium text-[#1c1c1c]">
								Open an issue first.
							</strong>{' '}
							Search{' '}
							<a
								href={GITHUB_ISSUES_URL}
								className="font-medium text-[#1c1c1c] underline-offset-2 hover:underline"
							>
								existing issues
							</a>{' '}
							and file an integration request if needed. Include API docs,
							endpoints, webhook needs, and auth constraints.
						</p>
						<IntegrationUrlFieldForm
							integrationId={integrationId}
							urls={urls}
							field="issueUrl"
							disabled={selectedStatus === 'upcoming'}
						/>
					</>
				) : null}

				{selectedStep === 1 ? (
					<>
						<ol className="m-0 list-decimal space-y-4 pl-5">
							<li>
								<strong className="font-medium text-[#1c1c1c]">
									Fork and clone the repo.
								</strong>{' '}
								<a
									href={`${GITHUB_URL}/fork`}
									className="font-medium text-[#1c1c1c] underline-offset-2 hover:underline"
									target="_blank"
									rel="noreferrer"
								>
									Fork corsair on GitHub
								</a>
								, then clone your fork and install dependencies:
								<CopyableCommand command={cloneCommand} />
							</li>
							<li>
								<strong className="font-medium text-[#1c1c1c]">
									Create a branch.
								</strong>
								<CopyableCommand command={branchCommand} />
							</li>
							<li>
								<strong className="font-medium text-[#1c1c1c]">
									Generate the plugin scaffold.
								</strong>{' '}
								From the repo root, run the generator with PascalCase plugin name{' '}
								<code className="rounded-md bg-[#1c1c1c]/5 px-1.5 py-0.5 font-mono text-xs">
									{pluginName}
								</code>
								:
								<CopyableCommand command={generateCommand} />
								See the{' '}
								<a
									href={`${DOCS_URL}/guides/create-your-own-plugin`}
									className="font-medium text-[#1c1c1c] underline-offset-2 hover:underline"
									target="_blank"
									rel="noreferrer"
								>
									Create Your Own Plugin
								</a>{' '}
								guide for details.
							</li>
						</ol>
						<IntegrationUrlFieldForm
							integrationId={integrationId}
							urls={urls}
							field="prUrl"
							disabled={selectedStatus === 'upcoming'}
						/>
					</>
				) : null}

				{selectedStep === 2 ? (
					<>
						<ol className="m-0 list-decimal space-y-4 pl-5">
							<li>
								<strong className="font-medium text-[#1c1c1c]">
									Implement the integration.
								</strong>{' '}
								Add endpoints, auth, schemas, and webhooks where the provider
								supports them.
							</li>
							<li>
								<strong className="font-medium text-[#1c1c1c]">
									Test in demo/testing.
								</strong>{' '}
								Register the plugin in{' '}
								<code className="rounded-md bg-[#1c1c1c]/5 px-1.5 py-0.5 font-mono text-xs">
									demo/testing/src/server/corsair.ts
								</code>
								, exercise it from{' '}
								<code className="rounded-md bg-[#1c1c1c]/5 px-1.5 py-0.5 font-mono text-xs">
									demo/testing/src/scripts/test-script.ts
								</code>
								, then run:
								<CopyableCommand command={testCommand} />
							</li>
						</ol>
						<IntegrationUrlFieldForm
							integrationId={integrationId}
							urls={urls}
							field="docsUrl"
							disabled={selectedStatus === 'upcoming'}
						/>
					</>
				) : null}

				{selectedStep === 3 ? (
					phase === 'ready_to_review' ? (
						<ReadyToReviewStatusCallout variant="workflow" />
					) : (
						<>
							<p>
								<strong className="font-medium text-[#1c1c1c]">
									Mark ready to review.
								</strong>{' '}
								Once your issue and PR links are saved and the plugin is
								implemented, mark this integration ready to review. You can then
								claim another integration while we review your work.
							</p>
							<MarkReadyToReviewButton
								integrationId={integrationId}
								hasRequiredUrls={Boolean(urls.issueUrl && urls.prUrl)}
								phase={phase}
								variant="workflow"
							/>
						</>
					)
				) : null}
			</WorkflowStepPanel>

			<p className="text-xs text-[#1c1c1c66]">
				Stuck? Open an issue or ask on{' '}
				<a
					href={DISCORD_URL}
					className="font-medium text-[#1c1c1c] underline-offset-2 hover:underline"
					target="_blank"
					rel="noreferrer"
				>
					Discord
				</a>
				.
			</p>
		</section>
	);
}
