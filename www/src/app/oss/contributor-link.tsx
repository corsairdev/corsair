import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { buildOssContributorHref } from './oss-url';

type ContributorLinkProps = {
	githubUsername: string;
	className?: string;
	children?: ReactNode;
};

export function ContributorLink({
	githubUsername,
	className,
	children,
}: ContributorLinkProps) {
	return (
		<Link
			href={buildOssContributorHref(githubUsername)}
			className={cn('no-underline hover:underline', className)}
		>
			{children ?? githubUsername}
		</Link>
	);
}
