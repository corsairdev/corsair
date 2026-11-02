import type { Metadata } from 'next';

import { DevelopersHero } from '@/components/landing/developers/developers-hero';
import { SiteFooter } from '@/components/landing/footer/site-footer';
import { LANDING_BACKGROUND } from '@/components/landing/landing-page';
import { SiteMenu } from '@/components/landing/menu/site-menu';
import { ProblemStatementSection } from '@/components/landing/problem-statement/problem-statement-section';
import { SolutionFramingSection } from '@/components/landing/solution-framing/solution-framing-section';
import { TerminalTrioSection } from '@/components/landing/terminal-trio/terminal-trio-section';
import { socialMetadata } from '@/lib/social-metadata';
import { getGithubStarCount } from '@/server/github-stars';

const TITLE = 'Corsair for developers';
const DESCRIPTION =
	'Add any integration to your product in minutes. Open-source TypeScript SDK for OAuth, token refresh, webhooks, per-user credentials and approvals, self-hosted or on Corsair Cloud.';

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: '/developers' },
	...socialMetadata({
		title: TITLE,
		description: DESCRIPTION,
		path: '/developers',
	}),
};

export default async function DevelopersPage() {
	const starCount = await getGithubStarCount();
	return (
		<div
			className="landing min-h-screen overflow-x-clip bg-[#f4f4f4]"
			style={LANDING_BACKGROUND}
		>
			<SiteMenu />
			<DevelopersHero starCount={starCount} />
			<TerminalTrioSection />
			<ProblemStatementSection />
			<SolutionFramingSection />
			<SiteFooter />
		</div>
	);
}
