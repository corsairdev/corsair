import type { ReactNode } from 'react';

import { ThemeScope } from '@/components/theme-scope';
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
		<ThemeScope>
			<div className="min-h-screen bg-[#f7f7f5] text-foreground dark:bg-background">
				<div className="mx-auto max-w-3xl">
					<OssIntegrationsBar
						session={session}
						githubUsername={githubUsername}
						githubAvatarUrl={githubAvatarUrl}
					/>
					{children}
				</div>
			</div>
		</ThemeScope>
	);
}
