'use client';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { isOssAdminEmail } from '@/lib/oss-admin';

import { buildOssContributorHref } from './oss-url';
import { SignOutButton } from './sign-out-button';

type Session = {
	user: {
		email: string;
	};
} | null;

export function OssBarAuth({
	session,
	githubUsername,
	githubAvatarUrl,
}: {
	session: Session;
	githubUsername: string | null;
	githubAvatarUrl: string | null;
}) {
	if (session?.user) {
		const showAdminLink = isOssAdminEmail(session.user.email);

		return (
			<>
				<div className="hidden items-center gap-2 sm:flex">
					<Badge variant="outline" className="max-w-[200px] truncate">
						{session.user.email}
					</Badge>
					{githubUsername ? (
						<Link
							href={buildOssContributorHref(githubUsername)}
							className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium transition-colors hover:bg-muted/80 no-underline"
						>
							@{githubUsername}
						</Link>
					) : null}
				</div>
				{showAdminLink ? (
					<Link
						href="/oss/admin"
						className="inline-flex items-center rounded-lg border border-[#4a38f5]/20 bg-[#4a38f508] px-3 py-1.5 text-xs font-medium text-[#4a38f5] no-underline transition-colors hover:bg-[#4a38f512]"
					>
						Admin
					</Link>
				) : null}
				{githubAvatarUrl ? (
					githubUsername ? (
						<Link
							href={buildOssContributorHref(githubUsername)}
							className="inline-flex shrink-0"
						>
							<img
								src={githubAvatarUrl}
								alt=""
								width={28}
								height={28}
								className="rounded-full ring-2 ring-border/60 transition-all hover:ring-border"
							/>
						</Link>
					) : (
						<img
							src={githubAvatarUrl}
							alt=""
							width={28}
							height={28}
							className="rounded-full ring-2 ring-border/60"
						/>
					)
				) : null}
				<SignOutButton />
			</>
		);
	}

	return (
		<Link
			href="/oss/sign-in"
			className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-muted"
		>
			Sign in
		</Link>
	);
}
