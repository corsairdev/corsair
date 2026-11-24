import type { Metadata } from 'next';

import {
	EndCta,
	GatewayLayout,
	JsonLd,
	Lede,
	PageHero,
	pageJsonLd,
	Section,
	SITE_URL,
	Steps,
} from '@/components/gateway/gateway-ui';
import { SkillGrid } from '@/components/skills/skill-card';
import { GATEWAY_SKILLS, SKILL_CATEGORIES } from '@/lib/gateway-skills';
import { CLAIM_HREF } from '@/lib/site-links';
import { socialMetadata } from '@/lib/social-metadata';

const PATH = '/skills';
const TITLE = 'Skills: jobs your agent can run with your apps';
const DESCRIPTION =
	'Ready-made skills for Claude, ChatGPT, Cursor and other agents: a morning brief, meeting follow-ups, a revenue digest and more. Connect apps, paste one prompt.';

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: PATH },
	...socialMetadata({ title: TITLE, description: DESCRIPTION, path: PATH }),
};

const HOW = [
	{
		title: 'Pick a skill',
		body: 'Each page lists the apps it needs and the ones that add to it.',
	},
	{
		title: 'Claim your URL and connect its apps',
		body: 'Corsair starts you on those apps. Sign in to each one once.',
	},
	{
		title: 'Paste one prompt into your agent',
		body: 'Corsair gives you the prompt. Your agent saves the skill, runs it once and, for daily jobs, sets the schedule.',
	},
] as const;

export default function SkillsPage() {
	const list = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		'@id': `${SITE_URL}${PATH}#skills`,
		itemListElement: GATEWAY_SKILLS.map((s, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: s.name,
			url: `${SITE_URL}/skills/${s.slug}`,
		})),
	};

	return (
		<GatewayLayout>
			<JsonLd
				data={pageJsonLd({
					path: PATH,
					title: TITLE,
					description: DESCRIPTION,
					crumbs: [{ name: 'Skills', path: PATH }],
				})}
			/>
			<JsonLd data={list} />

			<PageHero
				eyebrow="Skills"
				title="Jobs your agent can start on today"
				lede="A skill is a job your agent does with your apps, once or every morning. Pick one, connect the apps it needs, and paste the prompt Corsair gives you into Claude, ChatGPT, Cursor or Codex. Every agent on your URL can run it after that."
				width="wide"
			>
				<nav
					aria-label="Skill categories"
					className="mt-8 flex flex-wrap gap-2"
				>
					{SKILL_CATEGORIES.map((cat) => (
						<a
							key={cat.id}
							href={`#${cat.id}`}
							className="inline-flex h-9 items-center gap-2.5 rounded-full border border-[#1c1c1c1a] bg-white px-4 text-sm text-[#1c1c1c] no-underline transition-colors hover:border-[#1c1c1c40]"
						>
							{cat.name}
							<span className="font-[family-name:var(--landing-font-mono)] text-xs text-[#1c1c1c99]">
								{GATEWAY_SKILLS.filter((s) => s.category === cat.id).length}
							</span>
						</a>
					))}
				</nav>
			</PageHero>

			{SKILL_CATEGORIES.map((cat) => (
				<Section
					key={cat.id}
					id={cat.id}
					title={cat.name}
					lede={cat.blurb}
					width="wide"
				>
					<SkillGrid
						skills={GATEWAY_SKILLS.filter((s) => s.category === cat.id)}
					/>
				</Section>
			))}

			<Section id="how" title="How a skill gets set up" width="wide">
				<Steps steps={HOW} />
			</Section>

			<Section id="your-own" title="Or teach it your own">
				<Lede>
					Tell any agent on your URL &quot;save this as a skill&quot; and
					Corsair keeps it for every agent you connect. Change it later and the
					old versions stay in its history.
				</Lede>
			</Section>

			<EndCta
				title="Claim your URL and pick a job."
				ctas={[
					{ label: 'Claim your URL', href: CLAIM_HREF },
					{ label: 'Pricing', href: '/pricing' },
				]}
			/>
		</GatewayLayout>
	);
}
