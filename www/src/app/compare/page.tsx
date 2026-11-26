import type { Metadata } from 'next';

import {
	CheckedBadge,
	CompareLogo,
} from '@/components/compare/gateway-comparison';
import {
	Body,
	EndCta,
	JsonLd,
	PageHero,
	pageJsonLd,
	Section,
	SITE_URL,
	textLink,
} from '@/components/gateway/gateway-ui';
import composioSdk from '@/content/compare/composio.json';
import type { CompareGroup } from '@/content/compare/gateway';
import {
	CHECKED,
	CHECKED_LABEL,
	COMPARISONS,
	compareLogo,
	vsName,
} from '@/content/compare/gateway';
import nango from '@/content/compare/nango.json';
import { CLAIM_HREF } from '@/lib/site-links';
import { socialMetadata } from '@/lib/social-metadata';

const PATH = '/compare';
const TITLE = 'How Corsair compares: Composio, Zapier MCP, Pipedream and more';
const DESCRIPTION =
	'Corsair next to Composio (formerly Rube), Zapier MCP, Pipedream, Smithery, Monid, treg, GBrain and Nango, with sources and when each is the better pick.';

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: PATH },
	...socialMetadata({ title: TITLE, description: DESCRIPTION, path: PATH }),
};

type Group = { id: CompareGroup | 'sdk'; title: string; blurb: string };

const GROUPS: readonly Group[] = [
	{
		id: 'one-url',
		title: 'One URL for your apps',
		blurb:
			"The same job as Corsair's MCP gateway: one MCP address that reaches the apps you sign in to.",
	},
	{
		id: 'paid-data',
		title: 'Paid tools per call',
		blurb:
			'Data and APIs your agent pays for per call, rather than your own accounts.',
	},
	{
		id: 'memory',
		title: 'Team memory and skills',
		blurb: 'A shared memory and ready-made jobs on top of your apps.',
	},
	{
		id: 'sdk',
		title: 'Building on the SDK',
		blurb:
			'For developers adding integrations to their own product with the open-source Corsair SDK.',
	},
];

type Item = {
	href: string;
	name: string;
	logo: string;
	card: string;
	group: Group['id'];
};

const ITEMS: readonly Item[] = [
	...COMPARISONS.map((c) => ({
		href: `/compare/${c.slug}`,
		name: vsName(c),
		logo: compareLogo(c.slug),
		card: c.card,
		group: c.group,
	})),
	{
		href: '/compare/composio#sdk',
		name: 'Composio',
		logo: compareLogo('composio'),
		card: composioSdk.hero.description,
		group: 'sdk',
	},
	{
		href: '/compare/nango',
		name: 'Nango',
		logo: compareLogo('nango'),
		card: nango.hero.description,
		group: 'sdk',
	},
];

function ComparisonCard({ item }: { item: Item }) {
	return (
		<a
			href={item.href}
			className="flex flex-col gap-3 border border-[#1c1c1c1a] bg-white p-5 no-underline transition-colors hover:border-[#4a38f5] md:p-6"
		>
			<span className="flex items-center gap-2 text-base font-medium text-[#1c1c1c]">
				<CompareLogo src="/corsair-logo.png" />
				Corsair <span className="text-sm font-normal text-[#1c1c1c99]">vs</span>
				<CompareLogo src={item.logo} />
				{item.name}
			</span>
			<span className="flex-1 text-[15px] leading-[1.55] text-[#1c1c1c99]">
				{item.card}
			</span>
			<span className="font-[family-name:var(--landing-font-mono)] text-xs text-[#4a38f5]">
				Read the comparison →
			</span>
		</a>
	);
}

export default function ComparePage() {
	const list = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		'@id': `${SITE_URL}${PATH}#comparisons`,
		itemListElement: [
			...COMPARISONS.map((c) => ({
				name: `Corsair vs ${vsName(c)}`,
				url: `${SITE_URL}/compare/${c.slug}`,
			})),
			{ name: 'Corsair vs Nango', url: `${SITE_URL}/compare/nango` },
		].map((x, i) => ({ '@type': 'ListItem', position: i + 1, ...x })),
	};

	return (
		<main>
			<JsonLd
				data={pageJsonLd({
					path: PATH,
					title: TITLE,
					description: DESCRIPTION,
					crumbs: [{ name: 'Compare', path: PATH }],
				})}
			/>
			<JsonLd data={list} />

			<PageHero
				eyebrow="Compare"
				title="How Corsair compares"
				lede="Corsair next to the products people weigh it against. Each page puts the facts side by side, links its sources, and says plainly where the other product is the better choice."
				ctas={[
					{ label: 'Claim your URL', href: CLAIM_HREF },
					{ label: 'Pricing', href: '/pricing' },
				]}
			>
				<CheckedBadge>
					Gateway comparisons checked{' '}
					<time dateTime={CHECKED}>{CHECKED_LABEL}</time>
				</CheckedBadge>
			</PageHero>

			{GROUPS.map((g) => {
				const items = ITEMS.filter((x) => x.group === g.id);
				if (!items.length) return null;
				return (
					<Section
						key={g.id}
						id={g.id}
						title={g.title}
						lede={g.blurb}
						width="wide"
					>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{items.map((item) => (
								<ComparisonCard key={item.href} item={item} />
							))}
						</div>
					</Section>
				);
			})}

			<Section id="self-hosted" title="Running a gateway yourself?">
				<Body>
					Self-hosted gateways from Microsoft and Docker, and enterprise ones
					from Kong and others, are covered on{' '}
					<a href="/mcp-gateway#kinds" className={textLink}>
						the MCP gateway page
					</a>
					.
				</Body>
			</Section>

			<EndCta
				title="Try Corsair free. One URL, every app."
				ctas={[
					{ label: 'Claim your URL', href: CLAIM_HREF },
					{ label: 'See what it can do', href: '/skills' },
				]}
			/>
		</main>
	);
}
