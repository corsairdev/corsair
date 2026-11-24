import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
	Body,
	EndCta,
	GatewayLayout,
	JsonLd,
	PageHero,
	pageJsonLd,
	Section,
	SITE_URL,
	Steps,
} from '@/components/gateway/gateway-ui';
import { SkillAppIcon, SkillGrid } from '@/components/skills/skill-card';
import type { GatewaySkill } from '@/lib/gateway-skills';
import {
	appName,
	builtInNames,
	GATEWAY_SKILLS,
	listNames,
	SKILL_CATEGORIES,
	skillApps,
	skillBySlug,
	skillMeta,
} from '@/lib/gateway-skills';
import { claimHref, hubMeSkillUrl } from '@/lib/site-links';
import { socialMetadata } from '@/lib/social-metadata';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
	return GATEWAY_SKILLS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const skill = skillBySlug((await params).slug);
	if (!skill) return {};
	const path = `/skills/${skill.slug}`;
	const { title, description } = skillMeta(skill);
	return {
		title,
		description,
		alternates: { canonical: path },
		...socialMetadata({ title, description, path }),
	};
}

function setupSteps(skill: GatewaySkill): { title: string; body: string }[] {
	const { required, optional } = skill;
	const connect = required.length
		? `Connect ${listNames(required)}.${
				optional.length
					? ` ${listNames(optional)} ${optional.length > 1 ? 'add' : 'adds'} to it if you use ${optional.length > 1 ? 'them' : 'it'}.`
					: ''
			}`
		: `Connect the apps you use: ${listNames(optional)}.`;
	return [
		{
			title: 'Claim your URL',
			body: "Pick a handle and get yourname.lug.dev. It's free.",
		},
		{
			title: 'Connect its apps',
			body: `${connect} You sign in to each app once.`,
		},
		{
			title: 'Paste the prompt into your agent',
			body: skill.schedule
				? `Corsair gives you one prompt for Claude, ChatGPT, Cursor or Codex. The agent saves the skill, runs it once and schedules it: ${skill.schedule.toLowerCase()}.`
				: 'Corsair gives you one prompt for Claude, ChatGPT, Cursor or Codex. The agent saves the skill and runs it once. Ask for it again any time.',
		},
	];
}

const listHeading =
	'font-[family-name:var(--landing-font-mono)] text-xs tracking-[-0.02em] text-[#1c1c1c99]';

function AppRow({ id, note }: { id: string; note?: string }) {
	return (
		<li className="flex items-center gap-3 text-[15px] text-[#1c1c1c]">
			<SkillAppIcon id={id} size={28} />
			<span>{appName(id)}</span>
			{note ? (
				<span className="ml-auto text-xs text-[#1c1c1c99]">{note}</span>
			) : null}
		</li>
	);
}

function AppsPanel({ skill }: { skill: GatewaySkill }) {
	return (
		<aside className="flex flex-col gap-6 border border-[#1c1c1c1a] bg-white p-5 md:p-6">
			{skill.required.length ? (
				<div>
					<h3 className={listHeading}>Needs</h3>
					<ul className="mt-2.5 flex flex-col gap-2.5">
						{skill.required.map((id) => (
							<AppRow key={id} id={id} />
						))}
					</ul>
				</div>
			) : null}
			{skill.optional.length ? (
				<div>
					<h3 className={listHeading}>
						{skill.required.length ? 'Adds to it when connected' : 'Works with'}
					</h3>
					<ul className="mt-2.5 flex flex-col gap-2.5">
						{skill.optional.map((id) => (
							<AppRow key={id} id={id} note="optional" />
						))}
					</ul>
				</div>
			) : null}
			{skill.builtIn.length ? (
				<div>
					<h3 className={listHeading}>Built into Corsair</h3>
					<ul className="mt-2.5 flex flex-col gap-2.5">
						{builtInNames(skill).map((name) => (
							<li
								key={name}
								className="flex items-center gap-3 text-[15px] text-[#1c1c1c]"
							>
								<img
									src="/corsair-logo.png"
									alt=""
									width={28}
									height={28}
									className="size-7 rounded-sm border border-[#1c1c1c14] bg-white object-contain p-1"
								/>
								<span>{name}</span>
								<span className="ml-auto text-xs text-[#1c1c1c99]">
									{name === 'Postgres'
										? 'add a database URL'
										: 'nothing to connect'}
								</span>
							</li>
						))}
					</ul>
				</div>
			) : null}
		</aside>
	);
}

export default async function SkillPage({ params }: Params) {
	const skill = skillBySlug((await params).slug);
	if (!skill) notFound();
	const path = `/skills/${skill.slug}`;
	const category = SKILL_CATEGORIES.find((cat) => cat.id === skill.category);
	const related = GATEWAY_SKILLS.filter(
		(s) => s.category === skill.category && s.slug !== skill.slug,
	).slice(0, 3);
	const setup = claimHref({
		apps: skillApps(skill).slice(0, 8),
		skill: skill.slug,
	});
	const signIn = hubMeSkillUrl(skill.slug);
	const steps = setupSteps(skill);
	const howTo = {
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		'@id': `${SITE_URL}${path}#setup`,
		name: `Set up ${skill.name} with Corsair`,
		step: steps.map((s, i) => ({
			'@type': 'HowToStep',
			position: i + 1,
			name: s.title,
			text: s.body,
		})),
	};

	return (
		<GatewayLayout>
			<JsonLd
				data={pageJsonLd({
					path,
					title: skill.name,
					description: skill.summary,
					crumbs: [
						{ name: 'Skills', path: '/skills' },
						{ name: skill.name, path },
					],
				})}
			/>
			<JsonLd data={howTo} />

			<PageHero
				eyebrow={
					<>
						<a href="/skills" className="hover:text-[#1c1c1c]">
							Skills
						</a>
						{category ? (
							<>
								{' / '}
								<a
									href={`/skills#${category.id}`}
									className="hover:text-[#1c1c1c]"
								>
									{category.name}
								</a>
							</>
						) : null}
					</>
				}
				title={skill.name}
				lede={skill.summary}
				ctas={[
					{ label: `Set up ${skill.name}`, href: setup },
					{ label: 'Already have an MCP URL? Sign in', href: signIn },
				]}
			>
				<p className="mt-5 font-[family-name:var(--landing-font-mono)] text-[13px] text-[#1c1c1c99]">
					{skill.schedule
						? `Runs ${skill.schedule.toLowerCase()}`
						: 'Runs when you ask'}
				</p>
			</PageHero>

			<Section id="does" title="What it does" width="wide">
				<div className="grid items-start gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-16">
					<div>
						<ol className="flex list-decimal flex-col gap-2.5 pl-6 marker:font-[family-name:var(--landing-font-mono)] marker:text-[13px] marker:text-[#4a38f5]">
							{skill.steps.map((s) => (
								<li
									key={s}
									className="text-[15px] leading-[1.65] text-[#1c1c1c99] md:text-base"
								>
									{s}
								</li>
							))}
						</ol>
						<p className="mt-6 max-w-[62ch] border-l-2 border-[#4a38f5] bg-white px-4 py-3.5 text-base leading-[1.55] text-[#1c1c1c]">
							{skill.result}
						</p>
						{skill.notes?.length ? (
							<>
								<h3 className={`mt-7 ${listHeading}`}>Good to know</h3>
								<ul className="mt-2.5 flex max-w-[62ch] list-disc flex-col gap-2 pl-5 marker:text-[#4a38f5]">
									{skill.notes.map((n) => (
										<li key={n}>
											<Body>{n}</Body>
										</li>
									))}
								</ul>
							</>
						) : null}
					</div>
					<AppsPanel skill={skill} />
				</div>
			</Section>

			<Section id="setup" title="Set it up in three steps" width="wide">
				<Steps steps={steps} />
			</Section>

			{related.length && category ? (
				<Section
					id="more"
					title={`More in ${category.name.toLowerCase()}`}
					width="wide"
				>
					<SkillGrid skills={related} />
				</Section>
			) : null}

			<EndCta
				title={`Put ${skill.name.toLowerCase()} to work.`}
				ctas={[
					{ label: `Set up ${skill.name}`, href: setup },
					{ label: 'All skills', href: '/skills' },
				]}
			/>
		</GatewayLayout>
	);
}
