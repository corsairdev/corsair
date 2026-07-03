import type { ReactNode } from 'react';
import type { IntegrationPhase } from '@/db/schema';

import { IntegrationStatusBadge } from '../integration-status-badge';
import { ContributorLink } from '../contributor-link';
import { IntegrationRewardDisplay } from '../integration-reward-display';
import { UnclaimIntegrationButton } from '../unclaim-integration-button';
import { ClaimTimeline } from './claim-timeline';
import { IntegrationUrlsSection } from './integration-urls-section';

type TimelineEvent = {
	id: string;
	phase: IntegrationPhase;
	createdAt: string;
	githubUsername: string | null;
	avatarUrl: string | null;
	releaseReason?: string | null;
};

type IntegrationDetailSidebarProps = {
	integration: {
		id: string;
		slug: string;
		name: string;
		points: number;
		isClaimed: boolean;
		phase: IntegrationPhase | null;
		status: 'in_progress' | 'finished' | null;
		claimedByCurrentUser: boolean;
		claimerGithubUsername: string | null;
		claimerAvatarUrl: string | null;
		operationCount: number;
		triggerCount: number;
		authSchemeCount: number;
		tags: Array<{
			slug: string;
			name: string;
			color: string;
		}>;
		urls: {
			issueUrl: string | null;
			prUrl: string | null;
			docsUrl: string | null;
		};
		timeline: TimelineEvent[];
	};
	session: boolean;
};

function SidebarSection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section>
			<h2 className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
				{title}
			</h2>
			<div className="mt-4">{children}</div>
		</section>
	);
}

export function IntegrationDetailSidebar({
	integration,
	session,
}: IntegrationDetailSidebarProps) {
	return (
		<aside className="space-y-10 lg:sticky lg:top-20 lg:self-start">
			<SidebarSection title="Overview">
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						<IntegrationStatusBadge
							isClaimed={integration.isClaimed}
							phase={integration.phase}
							status={integration.status}
						/>
						<IntegrationRewardDisplay
							points={integration.points}
							className="items-start"
							amountClassName="text-[12px] text-[#1c1c1c]"
						/>
					</div>

					{integration.isClaimed && integration.claimerGithubUsername ? (
						<div className="flex items-center gap-2">
							{integration.claimerAvatarUrl ? (
								<img
									src={integration.claimerAvatarUrl}
									alt=""
									width={20}
									height={20}
									className="size-5 rounded-full"
								/>
							) : null}
							<span className="font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c66]">
								Maintained by
							</span>
							<ContributorLink
								githubUsername={integration.claimerGithubUsername}
								className="font-[family-name:var(--font-landing-mono)] text-[12px] text-[#1c1c1c] hover:text-[#4a38f5]"
							>
								@{integration.claimerGithubUsername}
							</ContributorLink>
						</div>
					) : null}

					{session && integration.claimedByCurrentUser ? (
						<div className="flex flex-wrap items-center gap-2 pt-1">
							<UnclaimIntegrationButton integrationId={integration.id} />
						</div>
					) : null}
				</div>
			</SidebarSection>

			{!(session && integration.claimedByCurrentUser) ? (
				<IntegrationUrlsSection
					integrationId={integration.id}
					urls={integration.urls}
					canEdit={false}
					phase={integration.phase}
					variant="sidebar"
				/>
			) : null}

			<SidebarSection title="Claim history">
				<ClaimTimeline events={integration.timeline} />
			</SidebarSection>
		</aside>
	);
}
