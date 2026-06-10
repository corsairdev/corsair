import type { ReactNode } from 'react';

import { getSession } from '@/lib/auth-server';
import { getApi } from '@/server/api/caller';
import { getGithubUserAvatar } from '@/server/github-users';

import { OssIntegrationsBar } from '../oss-integrations/oss-integrations-bar';

export default async function IntegrationsLayout({
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
		<div className="min-h-screen bg-[#f7f7f5] text-foreground">
			<div className="mx-auto max-w-3xl">
				<OssIntegrationsBar
					session={session}
					githubUsername={githubUsername}
					githubAvatarUrl={githubAvatarUrl}
				/>
				{children}
			</div>
		</div>
	);
}
