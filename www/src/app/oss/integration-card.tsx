import Link from 'next/link';

import type { ClaimBlockReason } from '@/lib/integration-claim-limits';
import type { IntegrationPhase } from '@/db/schema';
import { cn } from '@/lib/utils';
import { ClaimIntegrationButton } from './claim-integration-button';
import { ContributorLink } from './contributor-link';
import { IntegrationRewardDisplay } from './integration-reward-display';
import { buildOssIntegrationHref } from './oss-url';
import { UnclaimIntegrationButton } from './unclaim-integration-button';

type IntegrationCardProps = {
	integration: {
		id: string;
		slug: string;
		name: string;
		points: number;
		operationCount: number;
		triggerCount: number;
		authSchemeCount: number;
		isClaimed: boolean;
		phase: IntegrationPhase | null;
		status: 'in_progress' | 'finished' | null;
		userCanClaim?: boolean;
		claimedByCurrentUser: boolean;
		claimerGithubUsername: string | null;
		claimerAvatarUrl: string | null;
		tags: Array<{
			slug: string;
			name: string;
			color: string;
		}>;
		urls: {
			issueUrl: string | null;
			prUrl: string | null;
		};
	};
	session: boolean;
	index?: number;
	activeSlug?: string;
	wipIntegrationName?: string | null;
	claimBlockReason?: ClaimBlockReason | null;
};

function StatusLabel({
	isClaimed,
	phase,
	status,
}: {
	isClaimed: boolean;
	phase: IntegrationPhase | null;
	status: 'in_progress' | 'finished' | null;
}) {
	if (!isClaimed) {
		return <span className="text-[#1c1c1c66]">available</span>;
	}

	if (phase === 'finished' || status === 'finished') {
		return <span className="font-medium text-[#1c1c1c]">shipped</span>;
	}

	if (phase === 'ready_to_review') {
		return <span className="font-medium text-[#4a38f5]">ready to review</span>;
	}

	if (phase === 'awaiting_issue' || phase === 'awaiting_pr') {
		return <span className="font-medium text-[#4a38f5]">awaiting links</span>;
	}

	return <span className="font-medium text-[#4a38f5]">in progress</span>;
}

export function IntegrationCard({
	integration,
	session,
	index,
	activeSlug,
	wipIntegrationName,
	claimBlockReason,
}: IntegrationCardProps) {
	const isActive = activeSlug === integration.slug;

	return (
		<article
			className={cn(
				'group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 px-4 py-3 transition-colors sm:grid-cols-[2.5rem_minmax(0,5fr)_minmax(0,4fr)_auto] sm:items-center sm:px-6',
				isActive ? 'bg-[#1c1c1c]/[0.04]' : 'hover:bg-[#1c1c1c]/[0.02]',
			)}
		>
			<span className="hidden font-[family-name:var(--font-landing-mono)] text-[11px] tabular-nums text-[#1c1c1c40] sm:block">
				{index !== undefined ? String(index).padStart(2, '0') : ''}
			</span>

			<div className="min-w-0">
				<div className="flex flex-wrap items-baseline gap-x-2.5">
					<Link
						href={buildOssIntegrationHref(integration.slug)}
						prefetch={false}
						className={cn(
							'text-[15px] font-medium no-underline underline-offset-2 hover:underline',
							isActive ? 'text-[#4a38f5]' : 'text-[#1c1c1c]',
						)}
					>
						{integration.name}
					</Link>
					<span className="font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c66]">
						{integration.slug}
					</span>
				</div>
				{integration.tags.length > 0 ? (
					<p className="mt-0.5 truncate font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c66]">
						{integration.tags
							.slice(0, 3)
							.map((tag) => tag.name)
							.join(' · ')}
					</p>
				) : null}
			</div>

			<div className="col-start-1 flex min-w-0 flex-wrap items-center gap-x-3 font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c66] sm:col-start-auto">
				<span className="whitespace-nowrap">
					{integration.operationCount} ops · {integration.triggerCount} trig ·{' '}
					{integration.authSchemeCount} auth
				</span>
				<StatusLabel
					isClaimed={integration.isClaimed}
					phase={integration.phase}
					status={integration.status}
				/>
				{integration.isClaimed && integration.claimerGithubUsername ? (
					<ContributorLink
						githubUsername={integration.claimerGithubUsername}
						className="inline-flex items-center gap-1.5 whitespace-nowrap text-[#1c1c1c99] hover:text-[#1c1c1c]"
					>
						{integration.claimerAvatarUrl ? (
							<img
								src={integration.claimerAvatarUrl}
								alt=""
								width={14}
								height={14}
								className="size-3.5 rounded-full"
							/>
						) : null}
						@{integration.claimerGithubUsername}
					</ContributorLink>
				) : null}
			</div>

			<div className="col-start-2 row-start-1 flex items-center justify-end gap-3 sm:col-start-auto sm:row-start-auto">
				<IntegrationRewardDisplay
					points={integration.points}
					amountClassName={
						integration.isClaimed ? 'text-[#1c1c1c40]' : 'text-[#1c1c1c]'
					}
					labelClassName={
						integration.isClaimed ? 'text-[#1c1c1c33]' : 'text-[#1c1c1c66]'
					}
				/>
				{session && integration.claimedByCurrentUser ? (
					<UnclaimIntegrationButton integrationId={integration.id} />
				) : null}
				{session && !integration.isClaimed ? (
					<ClaimIntegrationButton
						integrationId={integration.id}
						integrationSlug={integration.slug}
						disabled={integration.userCanClaim === false}
						wipIntegrationName={wipIntegrationName}
						claimBlockReason={claimBlockReason}
					/>
				) : null}
			</div>
		</article>
	);
}
