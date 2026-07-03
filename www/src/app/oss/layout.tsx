import type { ReactNode } from 'react';

import { getSession } from '@/lib/auth-server';
import { getCurrentProfile } from '@/lib/current-user-server';
import { getApi } from '@/server/api/caller';
import { getGithubUserAvatar } from '@/server/github-users';

import { ActiveClaimDeadlineBanner } from './active-claim-deadline-banner';
import { OssIntegrationsBar } from './oss-integrations-bar';

export default async function OssIntegrationsLayout({
	children,
}: {
	children: ReactNode;
}) {
	const session = await getSession();

	let profile: Awaited<ReturnType<typeof getCurrentProfile>> = null;
	let activeDeadlineClaim: Awaited<
		ReturnType<
			Awaited<ReturnType<typeof getApi>>['integrations']['activeDeadlineClaim']
		>
	> = null;

	if (session) {
		try {
			const api = await getApi();
			[profile, activeDeadlineClaim] = await Promise.all([
				getCurrentProfile(),
				api.integrations.activeDeadlineClaim(),
			]);
		} catch (error) {
			console.error('[oss layout] signed-in header data failed', error);
		}
	}

	const githubUsername = profile?.githubUsername ?? null;
	let githubAvatarUrl: string | null = null;
	if (githubUsername) {
		try {
			githubAvatarUrl = await getGithubUserAvatar(githubUsername);
		} catch (error) {
			console.error('[oss layout] avatar lookup failed', error);
		}
	}

	return (
		<div className="min-h-screen bg-[#f4f4f4] font-[family-name:var(--font-landing-sans)] text-[#1c1c1c]">
			<OssIntegrationsBar
				session={session}
				githubUsername={githubUsername}
				githubAvatarUrl={githubAvatarUrl}
			/>
			{activeDeadlineClaim ? (
				<ActiveClaimDeadlineBanner claim={activeDeadlineClaim} />
			) : null}
			<div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
				{children}
			</div>
		</div>
	);
}
