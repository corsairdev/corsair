import Link from 'next/link';

import type { UserIntegrationStatus } from '@/db/schema';
import { cn } from '@/lib/utils';
import { buildOssIntegrationHref } from './oss-url';
import { ClaimIntegrationButton } from './claim-integration-button';
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
		status: UserIntegrationStatus | null;
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
};

function StatusLabel({
	isClaimed,
	status,
}: {
	isClaimed: boolean;
	status: UserIntegrationStatus | null;
}) {
	if (!isClaimed) {
		return <span className="text-[#1c1c1c66]">available</span>;
	}

	if (status === 'finished') {
		return <span className="font-medium text-[#1c1c1c]">shipped</span>;
	}

	return <span className="font-medium text-[#4a38f5]">in progress</span>;
}

export function IntegrationCard({
	integration,
	session,
	index,
	activeSlug,
}: IntegrationCardProps) {
	const isActive = activeSlug === integration.slug;

	return (
		<article
			className={cn(
				'group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 px-4 py-3 transition-colors sm:grid-cols-[2.5rem_minmax(0,5fr)_minmax(0,4fr)_auto] sm:items-center sm:px-6',
				isActive
					? 'bg-[#1c1c1c]/[0.04]'
					: 'hover:bg-[#1c1c1c]/[0.02]',
			)}
		>
			<span className="hidden font-[family-name:var(--font-landing-mono)] text-[11px] tabular-nums text-[#1c1c1c40] sm:block">
				{index !== undefined ? String(index).padStart(2, '0') : ''}
			</span>

			<div className="min-w-0">
				<div className="flex flex-wrap items-baseline gap-x-2.5">
					<Link
						href={buildOssIntegrationHref(integration.slug)}
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
					status={integration.status}
				/>
				{integration.isClaimed && integration.claimerGithubUsername ? (
					<a
						href={`https://github.com/${integration.claimerGithubUsername}`}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-1.5 whitespace-nowrap text-[#1c1c1c99] no-underline hover:text-[#1c1c1c] hover:underline"
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
					</a>
				) : null}
			</div>

			<div className="col-start-2 row-start-1 flex items-center justify-end gap-3 sm:col-start-auto sm:row-start-auto">
				<span
					className={cn(
						'font-[family-name:var(--font-landing-mono)] text-[13px] font-medium tabular-nums',
						integration.isClaimed ? 'text-[#1c1c1c40]' : 'text-[#1c1c1c]',
					)}
				>
					{integration.points}
					<span className="ml-1 text-[10px] font-normal text-[#1c1c1c66]">
						pts
					</span>
				</span>
				{session && integration.claimedByCurrentUser ? (
					<UnclaimIntegrationButton integrationId={integration.id} />
				) : null}
				{session && !integration.isClaimed ? (
					<ClaimIntegrationButton
						integrationId={integration.id}
						integrationSlug={integration.slug}
					/>
				) : null}
			</div>
		</article>
	);
}
