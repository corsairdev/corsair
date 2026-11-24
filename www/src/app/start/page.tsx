import type { Metadata } from 'next';

import { SiteFooter } from '@/components/landing/footer/site-footer';
import { SiteMenu } from '@/components/landing/menu/site-menu';
import { StartFlow } from '@/components/start/start-flow';
import '@/components/landing/theme.css';
import { CAMPAIGN_INIT } from '@/lib/claim-campaign';
import { socialMetadata } from '@/lib/social-metadata';

import { loadStartApps } from './start-apps';

const PATH = '/start';
const TITLE = 'Set up your MCP URL';
const DESCRIPTION =
	'Name your MCP URL, pick the apps your agents should reach and the agents that will use it. Then sign in and connect each app with your own account.';

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: PATH },
	// A step-by-step flow, not a page to land on from search.
	robots: { index: false, follow: true },
	...socialMetadata({ title: TITLE, description: DESCRIPTION, path: PATH }),
};

export default async function StartPage() {
	const apps = await loadStartApps();
	return (
		<div className="landing min-h-screen overflow-x-clip bg-[#f4f4f4]">
			{/* Saves ?utm_* before the steps rewrite the query; the hand-off reads them back. */}
			<script dangerouslySetInnerHTML={{ __html: CAMPAIGN_INIT }} />
			<SiteMenu />
			<main>
				<StartFlow apps={apps} />
			</main>
			<SiteFooter />
		</div>
	);
}
