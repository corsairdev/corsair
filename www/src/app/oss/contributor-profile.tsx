import Link from 'next/link';

import type { IntegrationPhase } from '@/db/schema';
import { legacyStatusFromPhase } from '@/lib/integration-phases';

import { FramedPanel } from './framed-panel';
import { IntegrationRewardDisplay } from './integration-reward-display';
import { formatPoints } from './integration-reward';
import { IntegrationStatusBadge } from './integration-status-badge';
import { buildOssIntegrationHref } from './oss-url';

type ContributorProfileData = {
	name: string;
	githubUsername: string;
	discordUsername: string | null;
	avatarUrl: string | null;
	rank: number | null;
	completedPoints: number;
	pendingPoints: number;
	totalPoints: number;
	integrations: Array<{
		id: string;
		name: string;
		slug: string;
		points: number;
		phase: IntegrationPhase;
	}>;
	memberSince: string;
};

function StatBlock({
	label,
	value,
	subtitle,
}: {
	label: string;
	value: string;
	subtitle?: string;
}) {
	return (
		<div className="bg-white px-5 py-4 sm:px-6">
			<p className="font-[family-name:var(--font-landing-mono)] text-[26px] font-light leading-none tabular-nums text-[#1c1c1c]">
				{value}
			</p>
			<p className="mt-2 font-[family-name:var(--font-landing-mono)] text-[10px] font-medium tracking-[0.08em] text-[#1c1c1c99] uppercase">
				{label}
			</p>
			{subtitle ? (
				<p className="mt-1 font-[family-name:var(--font-landing-mono)] text-[10px] text-[#1c1c1c66]">
					{subtitle}
				</p>
			) : null}
		</div>
	);
}

function formatMemberSince(isoDate: string) {
	return new Intl.DateTimeFormat('en-US', {
		month: 'long',
		year: 'numeric',
	}).format(new Date(isoDate));
}

export function ContributorProfile({ profile }: { profile: ContributorProfileData }) {
	const finishedIntegrations = profile.integrations.filter(
		(integration) => integration.phase === 'finished',
	);
	const pendingIntegrations = profile.integrations.filter(
		(integration) => integration.phase !== 'finished',
	);

	return (
		<div className="pt-12 pb-16 sm:pt-16">
			<div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-start lg:gap-16">
				<div>
					<div className="flex items-start gap-4">
						{profile.avatarUrl ? (
							<img
								src={profile.avatarUrl}
								alt=""
								width={72}
								height={72}
								className="size-[72px] shrink-0 rounded-full ring-1 ring-[#1c1c1c1a]"
							/>
						) : (
							<span className="size-[72px] shrink-0 rounded-full border border-[#1c1c1c1a] bg-[#1c1c1c0d]" />
						)}
						<div className="min-w-0">
							<h1 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-[#1c1c1c]">
								{profile.name}
							</h1>
							<p className="mt-2 font-[family-name:var(--font-landing-mono)] text-[13px] text-[#1c1c1c99]">
								@{profile.githubUsername}
							</p>
							{profile.discordUsername ? (
								<p className="mt-1 font-[family-name:var(--font-landing-mono)] text-[12px] text-[#1c1c1c66]">
									Discord: {profile.discordUsername}
								</p>
							) : null}
							<p className="mt-2 font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c40]">
								Contributor since {formatMemberSince(profile.memberSince)}
							</p>
						</div>
					</div>

					<div className="mt-6 flex flex-wrap items-center gap-3">
						<a
							href={`https://github.com/${profile.githubUsername}`}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center justify-center rounded-lg border border-[#1c1c1c]/10 bg-white/50 px-4 py-2 text-sm font-medium text-[#1c1c1c] no-underline shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] active:translate-y-0"
						>
							View on GitHub
						</a>
					</div>
				</div>

				<FramedPanel>
					<div className="grid grid-cols-2 gap-px bg-[#1c1c1c1a] sm:grid-cols-3">
						<StatBlock
							label="Points earned"
							value={formatPoints(profile.completedPoints)}
							subtitle="merged integrations"
						/>
						<StatBlock
							label="Points pending"
							value={formatPoints(profile.pendingPoints)}
							subtitle="in progress"
						/>
						<StatBlock
							label="Rank"
							value={profile.rank ? `#${profile.rank}` : '—'}
							subtitle={
								profile.rank ? 'on the leaderboard' : 'not ranked yet'
							}
						/>
					</div>
				</FramedPanel>
			</div>

			<section className="mt-12">
				<h2 className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
					Integrations
				</h2>

				{profile.integrations.length === 0 ? (
					<div className="mt-4 border border-dashed border-[#1c1c1c33] px-6 py-12 text-center">
						<p className="text-sm text-[#1c1c1c66]">
							No integrations claimed yet.
						</p>
					</div>
				) : (
					<FramedPanel className="mt-4">
						<div className="divide-y divide-[#1c1c1c0d]">
							{pendingIntegrations.map((integration) => (
								<ContributorIntegrationRow
									key={integration.id}
									integration={integration}
								/>
							))}
							{finishedIntegrations.map((integration) => (
								<ContributorIntegrationRow
									key={integration.id}
									integration={integration}
								/>
							))}
						</div>
					</FramedPanel>
				)}
			</section>
		</div>
	);
}

function ContributorIntegrationRow({
	integration,
}: {
	integration: ContributorProfileData['integrations'][number];
}) {
	const status = legacyStatusFromPhase(integration.phase);

	return (
		<article className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:px-6">
			<div className="min-w-0">
				<div className="flex flex-wrap items-baseline gap-x-2.5">
					<Link
						href={buildOssIntegrationHref(integration.slug)}
						className="text-[15px] font-medium text-[#1c1c1c] no-underline underline-offset-2 hover:underline"
					>
						{integration.name}
					</Link>
					<span className="font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c66]">
						{integration.slug}
					</span>
				</div>
			</div>

			<div className="col-start-1 sm:col-start-auto">
				<IntegrationStatusBadge
					isClaimed
					phase={integration.phase}
					status={status}
				/>
			</div>

			<div className="col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto">
				<IntegrationRewardDisplay
					points={integration.points}
					amountClassName={
						integration.phase === 'finished'
							? 'text-[#1c1c1c]'
							: 'text-[#1c1c1c99]'
					}
				/>
			</div>
		</article>
	);
}
