import { TRPCError } from '@trpc/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { getSession } from '@/lib/auth-server';
import { getCurrentProfile } from '@/lib/current-user-server';
import {
	getIntegrationCapabilitiesForPage,
	getIntegrationSummaryForPage,
} from '@/server/integration-cache';

import { IntegrationTagList } from '../integration-tag-badge';
import { Pulse } from '../oss-skeletons';
import { ClaimExpiredCallout } from './claim-expired-callout';
import { ContributorWorkflowSteps } from './contributor-workflow-steps';
import { IntegrationCapabilities } from './integration-capabilities';
import { IntegrationClaimCallout } from './integration-claim-callout';
import { IntegrationDetailSidebar } from './integration-detail-sidebar';
import { IntegrationTitleStats } from './integration-title-stats';

type IntegrationHeaderSectionProps = {
	slug: string;
	capabilitiesSlot: ReactNode;
};

export async function IntegrationHeaderSection({
	slug,
	capabilitiesSlot,
}: IntegrationHeaderSectionProps) {
	const session = await getSession();

	let integration: Awaited<ReturnType<typeof getIntegrationSummaryForPage>>;
	try {
		integration = await getIntegrationSummaryForPage(slug, session?.user.id);
	} catch (error) {
		if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
			notFound();
		}
		throw error;
	}

	const profile =
		session && integration.claimedByCurrentUser
			? await getCurrentProfile()
			: null;

	return (
		<div className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,3fr)]">
			<div className="min-w-0">
				<div className="mb-8 space-y-3">
					<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
						<h1 className="text-[28px] font-medium tracking-[-0.02em] text-[#1c1c1c]">
							{integration.name}
						</h1>
						<span className="font-[family-name:var(--font-landing-mono)] text-[13px] text-[#1c1c1c66]">
							{integration.slug}
						</span>
					</div>

					<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
						<IntegrationTitleStats
							operationCount={integration.operationCount}
							triggerCount={integration.triggerCount}
							authSchemeCount={integration.authSchemeCount}
						/>
					</div>

					{integration.tags.length > 0 ? (
						<IntegrationTagList tags={integration.tags} />
					) : null}

					{integration.description ? (
						<p className="max-w-2xl text-[15px] leading-relaxed text-[#1c1c1c99]">
							{integration.description}
						</p>
					) : null}
				</div>

				{integration.claimExpiredForCurrentUser ? (
					<ClaimExpiredCallout
						integrationName={integration.name}
						reason={integration.claimExpiredForCurrentUser.reason}
						expiredAt={integration.claimExpiredForCurrentUser.expiredAt}
					/>
				) : null}

				{!integration.isClaimed ? (
					<IntegrationClaimCallout
						integrationId={integration.id}
						integrationSlug={integration.slug}
						integrationName={integration.name}
						points={integration.points}
						session={Boolean(session)}
						canClaimAnother={integration.canClaimAnother}
						wipIntegrationName={integration.wipIntegrationName}
						claimBlockReason={integration.claimBlockReason}
					/>
				) : null}

				{session && integration.claimedByCurrentUser ? (
					<ContributorWorkflowSteps
						integrationId={integration.id}
						integrationName={integration.name}
						integrationSlug={integration.slug}
						githubUsername={profile?.githubUsername ?? null}
						phase={integration.phase}
						issueDeadlineAt={integration.issueDeadlineAt}
						prDeadlineAt={integration.prDeadlineAt}
						urls={integration.urls}
					/>
				) : null}

				{capabilitiesSlot}
			</div>

			<IntegrationDetailSidebar
				integration={integration}
				session={Boolean(session)}
			/>
		</div>
	);
}

type IntegrationCapabilitiesSectionProps = {
	slug: string;
};

export async function IntegrationCapabilitiesSection({
	slug,
}: IntegrationCapabilitiesSectionProps) {
	let capabilities: Awaited<
		ReturnType<typeof getIntegrationCapabilitiesForPage>
	>;
	try {
		capabilities = await getIntegrationCapabilitiesForPage(slug);
	} catch (error) {
		if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
			notFound();
		}
		throw error;
	}

	return (
		<IntegrationCapabilities
			operations={capabilities.operations}
			triggers={capabilities.triggers}
			authSchemes={capabilities.authSchemes}
			operationCount={capabilities.operationCount}
			triggerCount={capabilities.triggerCount}
			authSchemeCount={capabilities.authSchemeCount}
		/>
	);
}

export function IntegrationHeaderSkeleton() {
	return (
		<div
			className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,3fr)]"
			aria-busy="true"
		>
			<div className="min-w-0">
				<div className="mb-8 space-y-3">
					<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
						<Pulse className="h-8 w-48" />
						<Pulse className="h-4 w-24" />
					</div>
					<div className="flex flex-wrap gap-3">
						<Pulse className="h-4 w-20" />
						<Pulse className="h-4 w-20" />
						<Pulse className="h-4 w-20" />
					</div>
					<div className="flex flex-wrap gap-2">
						<Pulse className="h-6 w-16 rounded-full" />
						<Pulse className="h-6 w-20 rounded-full" />
					</div>
					<Pulse className="h-12 max-w-2xl" />
				</div>
				<Pulse className="h-32 w-full" />
			</div>
			<aside className="space-y-4">
				<Pulse className="h-24 w-full" />
				<Pulse className="h-32 w-full" />
			</aside>
		</div>
	);
}

export function IntegrationCapabilitiesSkeleton() {
	return (
		<div className="mt-10 space-y-6" aria-busy="true">
			<Pulse className="h-4 w-32" />
			<div className="space-y-2">
				{Array.from({ length: 6 }, (_, i) => (
					<Pulse key={i} className="h-14 w-full border border-[#1c1c1c1a]" />
				))}
			</div>
		</div>
	);
}
