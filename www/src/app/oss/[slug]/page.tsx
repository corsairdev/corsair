import { TRPCError } from '@trpc/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getSession } from '@/lib/auth-server';
import { getApi } from '@/server/api/caller';

import { ContributorGettingStartedCallout } from './contributor-getting-started-callout';
import { IntegrationCapabilities } from './integration-capabilities';
import { IntegrationClaimCallout } from './integration-claim-callout';
import { IntegrationDetailSidebar } from './integration-detail-sidebar';
import { IntegrationTitleStats } from './integration-title-stats';
import { IntegrationTagList } from '../integration-tag-badge';

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

export default async function OssIntegrationPage({
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
		<main className="pb-16">
			<div className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,3fr)]">
				<div className="min-w-0">
					<Link
						href="/oss"
						className="mb-4 inline-flex items-center gap-1.5 font-[family-name:var(--font-landing-mono)] text-[12px] text-[#1c1c1c66] no-underline transition-colors hover:text-[#1c1c1c]"
					>
						← All integrations
					</Link>

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

					{!integration.isClaimed ? (
						<IntegrationClaimCallout
							integrationId={integration.id}
							integrationSlug={integration.slug}
							integrationName={integration.name}
							points={integration.points}
							session={Boolean(session)}
						/>
					) : null}

					{session && integration.claimedByCurrentUser ? (
						<ContributorGettingStartedCallout
							integrationName={integration.name}
							integrationSlug={integration.slug}
							githubUsername={profile?.githubUsername ?? null}
							defaultOpen={gettingStarted === '1'}
						/>
					) : null}

					<IntegrationCapabilities
						operations={integration.operations}
						triggers={integration.triggers}
						authSchemes={integration.authSchemes}
						operationCount={integration.operationCount}
						triggerCount={integration.triggerCount}
						authSchemeCount={integration.authSchemeCount}
					/>
				</div>

				<IntegrationDetailSidebar
					integration={integration}
					session={Boolean(session)}
				/>
			</div>
		</main>
	);
}
