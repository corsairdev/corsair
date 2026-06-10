import { TRPCError } from '@trpc/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { getSession } from '@/lib/auth-server';
import { getApi } from '@/server/api/caller';

import { ClaimIntegrationButton } from '../../oss-integrations/claim-integration-button';
import { IntegrationLinkLabels } from '../../oss-integrations/integration-link-labels';
import { UnclaimIntegrationButton } from '../../oss-integrations/unclaim-integration-button';
import { ClaimTimeline } from './claim-timeline';
import { ContributorGettingStartedCallout } from './contributor-getting-started-callout';
import { IntegrationCapabilities } from './integration-capabilities';
import { IntegrationTitleStats } from './integration-title-stats';
import { IntegrationUrlsSection } from './integration-urls-section';

type PageProps = {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ gettingStarted?: string }>;
};

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const api = await getApi();

	try {
		const integration = await api.integrations.getBySlug({ slug });
		return {
			title: integration.name,
		};
	} catch {
		return { title: 'Integration not found' };
	}
}

export default async function IntegrationPage({
	params,
	searchParams,
}: PageProps) {
	const { slug } = await params;
	const { gettingStarted } = await searchParams;
	const api = await getApi();
	const session = await getSession();
	const profile = session ? await api.account.getProfile() : null;

	let integration: Awaited<ReturnType<typeof api.integrations.getBySlug>>;
	try {
		integration = await api.integrations.getBySlug({ slug });
	} catch (error) {
		if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
			notFound();
		}
		throw error;
	}

	return (
		<main className="px-6 py-8">
			<Link
				href="/oss-integrations"
				className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				← OSS Integrations
			</Link>

			<div className="mb-6 rounded-xl border border-border/70 bg-card p-5 shadow-sm">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div className="space-y-3">
						<div className="flex flex-wrap items-center gap-2">
							<h1 className="text-2xl font-semibold tracking-tight">
								{integration.name}
							</h1>
							<Badge variant="outline" className="font-mono text-xs">
								{integration.slug}
							</Badge>
							{integration.isClaimed ? (
								<Badge variant="success">Claimed</Badge>
							) : (
								<Badge variant="muted">Available</Badge>
							)}
						</div>
						<IntegrationTitleStats
							operationCount={integration.operationCount}
							triggerCount={integration.triggerCount}
						/>
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

				<div className="mt-4 flex flex-wrap items-center gap-2">
					<IntegrationLinkLabels urls={integration.urls} />
					{integration.isClaimed && integration.claimerGithubUsername ? (
						<div className="flex items-center gap-2">
							{integration.claimerAvatarUrl ? (
								<img
									src={integration.claimerAvatarUrl}
									alt=""
									width={20}
									height={20}
									className="rounded-full ring-1 ring-border"
								/>
							) : null}
							<span className="text-xs text-muted-foreground">
								Maintained by
							</span>
							<a
								href={`https://github.com/${integration.claimerGithubUsername}`}
								className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium transition-colors hover:bg-muted/80"
								target="_blank"
							>
								@{integration.claimerGithubUsername}
							</a>
						</div>
					) : null}
				</div>
			</div>

			{session && integration.claimedByCurrentUser ? (
				<ContributorGettingStartedCallout
					integrationName={integration.name}
					integrationSlug={integration.slug}
					githubUsername={profile?.githubUsername ?? null}
					defaultOpen={gettingStarted === '1'}
				/>
			) : null}

			<IntegrationUrlsSection
				integrationId={integration.id}
				urls={integration.urls}
				canEdit={Boolean(session && integration.claimedByCurrentUser)}
			/>

			<IntegrationCapabilities
				operations={integration.operations}
				triggers={integration.triggers}
				operationCount={integration.operationCount}
				triggerCount={integration.triggerCount}
			/>

			<section className="mt-8">
				<h2 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
					Claim history
				</h2>
				<ClaimTimeline events={integration.timeline} />
			</section>
		</main>
	);
}
