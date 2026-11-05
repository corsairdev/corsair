import type { Metadata } from 'next';

import { LandingPage } from '@/components/landing/landing-page';
import { getGithubStarCount } from '@/server/github-stars';

// Set here, not in the root layout, so other pages don't inherit '/' as
// their canonical URL.
export const metadata: Metadata = {
	alternates: { canonical: '/' },
};

export default async function Home() {
	const starCount = await getGithubStarCount();
	return <LandingPage starCount={starCount} />;
}
