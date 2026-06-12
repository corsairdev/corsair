import type { ReactNode } from 'react';

import { getSession } from '@/lib/auth-server';
import { getApi } from '@/server/api/caller';
import { getGithubUserAvatar } from '@/server/github-users';

import { OssIntegrationsBar } from './oss-integrations-bar';

export default async function OssIntegrationsLayout({
	children,
}: {
	children: ReactNode;
}) {
	const session = await getSession();
	const profile = session ? await (await getApi()).account.getProfile() : null;
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
			<div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
				{children}
			</div>
		</div>
	);
}
