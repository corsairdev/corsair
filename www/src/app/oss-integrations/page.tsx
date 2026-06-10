import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { Badge } from '@/components/ui/badge';
import { getSession } from '@/lib/auth-server';
import { getApi } from '@/server/api/caller';

import { GithubUsernameCallout } from './github-username-callout';
import { IntegrationCard } from './integration-card';
import { IntegrationSearch } from './integration-search';
import { LeaderboardEntry } from './leaderboard-entry';
import type { OssIntegrationsView } from './view-tabs';
import { ViewTabs } from './view-tabs';

export const metadata: Metadata = {
	title: 'OSS Integrations',
	description: 'Open source integrations catalog.',
};

type PageProps = {
	searchParams: Promise<{ page?: string; q?: string; view?: string }>;
};

function parseView(view?: string): OssIntegrationsView {
	return view === 'leaderboard' ? 'leaderboard' : 'integrations';
}

function buildPageHref(page: number, q: string, view: OssIntegrationsView) {
	const params = new URLSearchParams();
	if (view === 'leaderboard') params.set('view', 'leaderboard');
	if (view === 'integrations' && q) params.set('q', q);
	if (page > 1) params.set('page', String(page));
	const query = params.toString();
	return query ? `/oss-integrations?${query}` : '/oss-integrations';
}

export default async function OssIntegrationsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const view = parseView(params.view);
	const page = Math.max(1, Number(params.page) || 1);
	const q = params.q?.trim() ?? '';
	const api = await getApi();
	const session = await getSession();
	const profile = session ? await api.account.getProfile() : null;
	const myIntegrations = session ? await api.integrations.listMine() : null;

	const integrationsData =
		view === 'integrations'
			? await api.integrations.list({ page, q: q || undefined })
			: null;
	const leaderboardData =
		view === 'leaderboard'
			? await api.integrations.leaderboard({ page })
			: null;

	const startIndex = (page - 1) * (integrationsData?.pageSize ?? 50);

	return (
		<main className="px-6 py-8">
			{session && !profile?.githubUsername ? <GithubUsernameCallout /> : null}

			<Link
				href="/"
				className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				← Corsair
			</Link>

			<div className="mb-8">
				<h1 className="text-3xl font-semibold tracking-tight text-foreground">
					OSS Integrations
				</h1>
				<p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
					Browse, claim, and contribute open-source integrations to the Corsair
					ecosystem.
				</p>
			</div>

			{myIntegrations && myIntegrations.items.length > 0 ? (
				<section className="mb-6 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
					<h2 className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
						Your integrations
					</h2>
					<ul className="flex flex-wrap gap-2">
						{myIntegrations.items.map((integration) => (
							<li key={integration.id}>
								<Link
									href={`/integrations/${integration.slug}`}
									className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-sm font-medium transition-colors hover:border-border hover:bg-muted"
								>
									<span>{integration.name}</span>
									<Badge variant="outline" className="font-mono text-[10px]">
										{integration.slug}
									</Badge>
								</Link>
							</li>
						))}
					</ul>
				</section>
			) : null}

			<div className="mb-4">
				<Suspense>
					<IntegrationSearch defaultValue={q} />
				</Suspense>
			</div>

			<div className="mb-6">
				<Suspense>
					<ViewTabs activeView={view} />
				</Suspense>
			</div>

			{view === 'integrations' && integrationsData ? (
				<>
					<div className="mb-6 flex flex-wrap items-center gap-2">
						<Badge variant="secondary">
							{integrationsData.total} integration
							{integrationsData.total === 1 ? '' : 's'}
						</Badge>
						{q ? (
							<>
								<Badge variant="accent">matching &ldquo;{q}&rdquo;</Badge>
								<Link
									href="/oss-integrations"
									className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
								>
									Clear search
								</Link>
							</>
						) : null}
					</div>

					{integrationsData.items.length === 0 ? (
						<div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 py-12 text-center">
							<p className="text-sm text-muted-foreground">
								No integrations found.
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{integrationsData.items.map((integration, index) => (
								<IntegrationCard
									key={integration.id}
									integration={integration}
									session={Boolean(session)}
									index={startIndex + index + 1}
								/>
							))}
						</div>
					)}

					{integrationsData.totalPages > 1 ? (
						<Pagination
							page={page}
							totalPages={integrationsData.totalPages}
							q={q}
							view={view}
						/>
					) : null}
				</>
			) : null}

			{view === 'leaderboard' && leaderboardData ? (
				<>
					<div className="mb-6">
						<Badge variant="secondary">
							{leaderboardData.total} contributor
							{leaderboardData.total === 1 ? '' : 's'}
						</Badge>
					</div>

					{leaderboardData.items.length === 0 ? (
						<div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 py-12 text-center">
							<p className="text-sm text-muted-foreground">
								No claimed integrations yet.
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{leaderboardData.items.map((entry) => (
								<LeaderboardEntry key={entry.userId} entry={entry} />
							))}
						</div>
					)}

					{leaderboardData.totalPages > 1 ? (
						<Pagination
							page={page}
							totalPages={leaderboardData.totalPages}
							q={q}
							view={view}
						/>
					) : null}
				</>
			) : null}
		</main>
	);
}

function Pagination({
	page,
	totalPages,
	q,
	view,
}: {
	page: number;
	totalPages: number;
	q: string;
	view: OssIntegrationsView;
}) {
	return (
		<nav
			className="mt-8 flex flex-wrap items-center justify-center gap-1 border-t border-border/60 pt-6"
			aria-label="Pagination"
		>
			{page > 1 ? (
				<Link
					href={buildPageHref(page - 1, q, view)}
					className="rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-muted"
				>
					Previous
				</Link>
			) : null}
			{Array.from({ length: totalPages }, (_, index) => {
				const pageNumber = index + 1;

				return pageNumber === page ? (
					<span
						key={pageNumber}
						className="inline-flex size-8 items-center justify-center rounded-lg bg-foreground text-xs font-medium text-background"
					>
						{pageNumber}
					</span>
				) : (
					<Link
						key={pageNumber}
						href={buildPageHref(pageNumber, q, view)}
						className="inline-flex size-8 items-center justify-center rounded-lg border border-border/70 bg-card text-xs font-medium transition-colors hover:bg-muted"
					>
						{pageNumber}
					</Link>
				);
			})}
			{page < totalPages ? (
				<Link
					href={buildPageHref(page + 1, q, view)}
					className="rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-muted"
				>
					Next
				</Link>
			) : null}
		</nav>
	);
}
