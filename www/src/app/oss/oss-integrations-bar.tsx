import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import type { getSession } from '@/lib/auth-server';

import { SignOutButton } from './sign-out-button';

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
		<header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border/60 bg-[#f7f7f5]/90 px-6 py-3 text-sm backdrop-blur-sm">
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
				{session?.user ? (
					<>
						<div className="hidden items-center gap-2 sm:flex">
							<Badge variant="outline" className="max-w-[200px] truncate">
								{session.user.email}
							</Badge>
							{githubUsername ? (
								<a
									href={`https://github.com/${githubUsername}`}
									className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium transition-colors hover:bg-muted/80"
									target="_blank"
								>
									@{githubUsername}
								</a>
							) : null}
						</div>
						{githubAvatarUrl ? (
							githubUsername ? (
								<a
									href={`https://github.com/${githubUsername}`}
									target="_blank"
									className="inline-flex shrink-0"
								>
									<img
										src={githubAvatarUrl}
										alt=""
										width={28}
										height={28}
										className="rounded-full ring-2 ring-border/60 transition-all hover:ring-border"
									/>
								</a>
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
				) : (
					<Link
						href="/oss/sign-in"
						className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-muted"
					>
						Sign in
					</Link>
				)}
			</div>
		</header>
	);
}
