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
	const [profile, activeDeadlineClaim] = session
		? await Promise.all([
				getCurrentProfile(),
				(await getApi()).integrations.activeDeadlineClaim(),
			])
		: [null, null];
	const githubUsername = profile?.githubUsername ?? null;
	const githubAvatarUrl = githubUsername
		? await getGithubUserAvatar(githubUsername)
		: null;

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
