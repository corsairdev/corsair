import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TRPCError } from '@trpc/server';

import { ContributorProfile } from '../../contributor-profile';
import { getCachedContributorProfile } from '@/server/oss-public-cache';

type PageProps = {
	params: Promise<{ username: string }>;
};

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { username } = await params;

	try {
		const profile = await getCachedContributorProfile(username.toLowerCase());
		return {
			title: `${profile.name} (@${profile.githubUsername})`,
			description: `OSS contributor profile for ${profile.name}. ${profile.integrations.length} integration${profile.integrations.length === 1 ? '' : 's'} claimed.`,
		};
	} catch {
		return { title: 'Contributor not found' };
	}
}

export default async function ContributorProfilePage({ params }: PageProps) {
	const { username } = await params;

	let profile;
	try {
		profile = await getCachedContributorProfile(username.toLowerCase());
	} catch (error) {
		if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
			notFound();
		}
		throw error;
	}

	return (
		<main>
			<Link
				href="/oss"
				className="mb-4 inline-flex items-center gap-1.5 font-[family-name:var(--font-landing-mono)] text-[12px] text-[#1c1c1c66] no-underline transition-colors hover:text-[#1c1c1c]"
			>
				← All integrations
			</Link>
			<ContributorProfile profile={profile} />
		</main>
	);
}
