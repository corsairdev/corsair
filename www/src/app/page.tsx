import { LandingPage } from '@/components/landing/landing-page';
import { getGithubStarCount } from '@/server/github-stars';

export default async function Home() {
	const starCount = await getGithubStarCount();
	return <LandingPage starCount={starCount} />;
}
