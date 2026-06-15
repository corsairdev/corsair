import Image from 'next/image';
import Link from 'next/link';

import type { getSession } from '@/lib/auth-server';

import { OssBarAuth } from './oss-bar-auth';

type Session = Awaited<ReturnType<typeof getSession>>;

export function OssIntegrationsBar({
	session,
	githubUsername,
	githubAvatarUrl,
}: {
	session: Session;
	githubUsername: string | null;
	githubAvatarUrl: string | null;
}) {
	return (
		<header className="sticky top-0 z-10 border-b border-border/60 bg-[#f4f4f4]/90 text-sm backdrop-blur-sm">
			<div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
				<Link
					href="/"
					aria-label="Corsair home"
					className="inline-flex shrink-0 items-center gap-2 no-underline transition-opacity hover:opacity-80"
				>
					<Image
						src="/corsair-logo.png"
						alt=""
						width={32}
						height={32}
						className="size-7 rounded-sm"
					/>
					<span className="text-base font-semibold tracking-tight text-foreground">
						Corsair
					</span>
				</Link>
				<div className="flex items-center gap-3">
					<OssBarAuth
						session={session}
						githubUsername={githubUsername}
						githubAvatarUrl={githubAvatarUrl}
					/>
				</div>
			</div>
		</header>
	);
}
