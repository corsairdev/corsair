import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { ClaimIntegrationButton } from './claim-integration-button';
import { IntegrationLinkLabels } from './integration-link-labels';
import { UnclaimIntegrationButton } from './unclaim-integration-button';
import { IntegrationTitleStats } from '../integrations/[slug]/integration-title-stats';

type IntegrationCardProps = {
	integration: {
		id: string;
		slug: string;
		name: string;
		description: string | null;
		operationCount: number;
		triggerCount: number;
		isClaimed: boolean;
		claimedByCurrentUser: boolean;
		claimerGithubUsername: string | null;
		claimerAvatarUrl: string | null;
		urls: {
			issueUrl: string | null;
			prUrl: string | null;
		};
	};
	session: boolean;
	index?: number;
};

export function IntegrationCard({
	integration,
	session,
	index,
}: IntegrationCardProps) {
	return (
		<article
			className={cn(
				'group rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-all',
				'hover:border-border hover:bg-muted/20 hover:shadow-md',
			)}
		>
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="min-w-0 flex-1 space-y-2">
					<div className="flex flex-wrap items-center gap-2">
						{index !== undefined ? (
							<Badge variant="muted" className="font-mono text-[10px]">
								#{index}
							</Badge>
						) : null}
						<Link
							href={`/integrations/${integration.slug}`}
							className="text-base font-semibold text-foreground transition-colors hover:text-foreground/80"
						>
							{integration.name}
						</Link>
						<Badge variant="outline" className="font-mono text-[11px]">
							{integration.slug}
						</Badge>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<IntegrationTitleStats
							operationCount={integration.operationCount}
							triggerCount={integration.triggerCount}
						/>
						{integration.isClaimed ? (
							<Badge variant="success">Claimed</Badge>
						) : (
							<Badge variant="muted">Available</Badge>
						)}
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2">
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
			</div>

			{integration.isClaimed && integration.claimerGithubUsername ? (
				<div className="mt-3 flex items-center gap-2">
					{integration.claimerAvatarUrl ? (
						<img
							src={integration.claimerAvatarUrl}
							alt=""
							width={20}
							height={20}
							className="rounded-full ring-1 ring-border"
						/>
					) : null}
					<span className="text-sm text-muted-foreground">Maintained by</span>
					<a
						href={`https://github.com/${integration.claimerGithubUsername}`}
						className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/80"
						target="_blank"
					>
						@{integration.claimerGithubUsername}
					</a>
				</div>
			) : null}

			{integration.description ? (
				<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
					{integration.description}
				</p>
			) : null}

			<IntegrationLinkLabels urls={integration.urls} layout="stacked" />
		</article>
	);
}
