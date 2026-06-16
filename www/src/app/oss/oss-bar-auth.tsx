'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/badge';

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
	const pathname = usePathname();
	const hideSignIn = !session?.user && pathname.startsWith('/oss/waitlist');

	if (session?.user) {
		return (
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
		);
	}

	if (hideSignIn) {
		return null;
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
