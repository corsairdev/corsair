/**
 * Starter skills for the MCP gateway: corsair.dev/skills lists them. A skill
 * is a job an agent does with the apps on an MCP URL. It names the apps it
 * can't run without, the apps that add to it, and the built-in apps it uses.
 *
 * Copied from Corsair's hub repo, explorer/src/lug-skills.ts at 01b9a8d64
 * (2026-11-23), which also feeds Hub onboarding (the Hub keeps each skill's
 * instructions and the prompt people paste; this site doesn't show them).
 * Only the wording changed: "Lug issues/CRM/files" became Corsair's. When a
 * skill is added or changed there, change it here too; the slugs must match,
 * since "Set up" passes the slug on to the Hub.
 */

/** Apps every MCP URL has. Nothing to connect, except Postgres, which takes a database URL. */
export type BuiltInApp = 'pm' | 'crm' | 'files' | 'pg';

export const BUILT_IN_APPS: Record<BuiltInApp, string> = {
	pm: 'Issues',
	crm: 'CRM',
	files: 'Files',
	pg: 'Postgres',
};

export type SkillCategory =
	| 'everyday'
	| 'founders'
	| 'sales'
	| 'engineering'
	| 'research';

export const SKILL_CATEGORIES: readonly {
	id: SkillCategory;
	name: string;
	blurb: string;
}[] = [
	{
		id: 'everyday',
		name: 'Inbox and calendar',
		blurb: 'Mail, meetings and documents, handled before you get to them.',
	},
	{
		id: 'founders',
		name: 'Founders',
		blurb: 'The numbers you check every morning, sent to you instead.',
	},
	{
		id: 'sales',
		name: 'Sales and customers',
		blurb: 'Leads found, contacts kept up to date, customers checked on.',
	},
	{
		id: 'engineering',
		name: 'Engineering',
		blurb: 'Standups, release notes and bugs, written from what shipped.',
	},
	{
		id: 'research',
		name: 'Research',
		blurb: 'People, companies and competitors, looked up and written down.',
	},
];

export type GatewaySkill = {
	/** The page URL (corsair.dev/skills/<slug>) and the name the skill is saved under. */
	slug: string;
	name: string;
	/** One sentence: the card, the page's lede and its meta description. */
	summary: string;
	category: SkillCategory;
	/** Catalog app ids the skill can't run without. */
	required: readonly string[];
	/** Catalog app ids that add to it when connected. Each can be skipped. */
	optional: readonly string[];
	builtIn: readonly BuiltInApp[];
	/** What it does, in order. */
	steps: readonly string[];
	/** What the person ends up with. */
	result: string;
	/** The page's "Good to know" list: what it asks, where it saves, what it costs. */
	notes?: readonly string[];
	/** When it runs, as a person would say it. Absent: it runs when asked. */
	schedule?: string;
};

export const GATEWAY_SKILLS: readonly GatewaySkill[] = [
	{
		slug: 'morning-brief',
		name: 'Morning brief',
		summary:
			"One message each weekday morning with today's meetings, the emails waiting on you and what's overdue.",
		category: 'everyday',
		required: ['googlecalendar'],
		optional: ['gmail', 'outlook', 'slack', 'linear'],
		builtIn: ['pm'],
		steps: [
			"Reads today's events and who is in each one.",
			'Finds email threads where someone is waiting on your reply.',
			'Adds your open and overdue issues from Corsair or Linear.',
			'Sends one short brief to Slack or your inbox.',
		],
		result: 'A brief you can read in a minute before your first meeting.',
		schedule: 'Every weekday at 8:00',
	},
	{
		slug: 'meeting-follow-ups',
		name: 'Meeting follow-ups',
		summary:
			'After each recorded meeting, a drafted follow-up email and the action items filed as issues.',
		category: 'everyday',
		required: ['fireflies'],
		optional: ['zoom', 'gmail', 'outlook'],
		builtIn: ['pm'],
		steps: [
			'Reads the transcript of each meeting that ended since the last run.',
			'Pulls out decisions and action items, with who owns each one.',
			'Files your action items as issues in Corsair, with the meeting linked.',
			'Drafts a follow-up email to the attendees and leaves it in your drafts.',
		],
		result:
			'Nothing from the call gets lost, and the recap email is ready to send.',
		schedule: 'Every weekday at 17:30',
	},
	{
		slug: 'document-inbox',
		name: 'Document inbox',
		summary:
			'Every PDF, contract and deck that arrives by email, saved to your Corsair files and searchable.',
		category: 'everyday',
		required: ['gmail', 'reducto'],
		optional: ['googledrive'],
		builtIn: ['files'],
		steps: [
			'Finds new email attachments: PDFs, slides, contracts and invoices.',
			'Parses each one with Reducto so tables and scanned pages become text.',
			'Saves the file and its text to your Corsair files, in a folder per sender.',
			'Tells you what arrived, so you can ask about any of it later.',
		],
		result:
			'Ask your agent "what did the venue\'s contract say about deposits?" and get the answer.',
		schedule: 'Every day at 18:00',
	},
	{
		slug: 'inbox-cleanup',
		name: 'Inbox cleanup',
		summary:
			'Finds the senders you never open and archives their mail once you say yes.',
		category: 'everyday',
		required: ['gmail'],
		optional: [],
		builtIn: [],
		steps: [
			'Looks at the last 30 days of mail and which senders you open.',
			'Groups newsletters, receipts and notifications you never read.',
			'Shows you the list with a count per sender.',
			'Archives only the senders you approve.',
		],
		result: 'A shorter inbox, and nothing archived without your yes.',
	},
	{
		slug: 'daily-signups-report',
		name: 'Daily signups report',
		summary:
			"Yesterday's new users and the ones who went quiet, straight from your own database.",
		category: 'founders',
		required: [],
		optional: ['posthog', 'slack', 'gmail'],
		builtIn: ['pg'],
		steps: [
			'Queries your Postgres for users who signed up yesterday.',
			"Finds users who were active last week and haven't been back.",
			"Adds activity from PostHog when it's connected.",
			'Sends the numbers and the names to Slack or your inbox.',
		],
		result:
			'You know who joined and who left before standup, without writing SQL.',
		schedule: 'Every day at 9:00',
	},
	{
		slug: 'revenue-digest',
		name: 'Revenue digest',
		summary:
			'Each Monday: new subscriptions, cancellations, failed payments and how MRR moved.',
		category: 'founders',
		required: ['stripe'],
		optional: ['slack', 'gmail'],
		builtIn: [],
		steps: [
			"Reads last week's subscriptions, cancellations and refunds in Stripe.",
			"Lists failed payments that haven't recovered.",
			'Works out MRR now and a week ago.',
			'Posts the digest to Slack or emails it to you.',
		],
		result: "Monday's revenue numbers, with the names behind them.",
		schedule: 'Every Monday at 9:00',
	},
	{
		slug: 'churn-watch',
		name: 'Churn watch',
		summary:
			'Spots paying customers who are slipping away and drafts a check-in for each.',
		category: 'founders',
		required: ['stripe'],
		optional: ['posthog', 'gmail', 'intercom'],
		builtIn: ['crm'],
		steps: [
			'Lists paying customers from Stripe.',
			"Checks each one's recent product use in PostHog and support threads in Intercom.",
			'Flags customers whose use dropped or who have an open complaint.',
			"Drafts a short check-in email for each and notes it in Corsair's CRM.",
		],
		result: 'You talk to customers before they cancel, not after.',
		schedule: 'Every Monday at 10:00',
	},
	{
		slug: 'weekly-traffic-report',
		name: 'Weekly traffic report',
		summary:
			"Last week's visitors, top pages and where they came from, compared with the week before.",
		category: 'founders',
		required: ['googleanalytics'],
		optional: ['posthog', 'ahrefs', 'slack'],
		builtIn: [],
		steps: [
			"Pulls last week's sessions, top pages and sources from Google Analytics.",
			'Compares each with the week before.',
			'Adds new backlinks from Ahrefs and signups from PostHog when connected.',
			'Posts a short report with the biggest changes first.',
		],
		result: 'The few numbers that moved, and why, every Monday.',
		schedule: 'Every Monday at 9:00',
	},
	{
		slug: 'inbox-to-crm',
		name: 'Inbox to CRM',
		summary:
			'Everyone you email with, kept in your CRM with their company and when you last spoke.',
		category: 'sales',
		required: ['gmail'],
		optional: ['googlecalendar', 'hubspot'],
		builtIn: ['crm'],
		steps: [
			"Reads the day's sent and received mail and meetings.",
			"Adds new people and their companies to Corsair's CRM.",
			'Updates last contact and a one-line note on each thread.',
			"Copies the same updates to HubSpot when it's connected.",
		],
		result: 'A CRM that fills itself from the conversations you already have.',
		notes: [
			'It skips newsletters, notifications and people at your own company, so the CRM holds only real conversations.',
			"Each new contact gets a company from their email domain, created in Corsair's CRM if it isn't there yet.",
			"It reads your mail and writes only to your CRM. It doesn't send or answer anything.",
			"Corsair's CRM is built into every MCP URL, so there's nothing to connect for it. HubSpot is optional and gets the same updates.",
		],
		schedule: 'Every day at 19:00',
	},
	{
		slug: 'lead-list',
		name: 'Lead list',
		summary:
			'Describe the companies you sell to and get a sourced list of them, with people to contact.',
		category: 'sales',
		required: ['exa'],
		optional: ['apollo', 'hubspot'],
		builtIn: ['crm'],
		steps: [
			'Searches the web with Exa for companies that match your description.',
			"Checks each company's site so the match holds up.",
			"Finds the right people with Apollo when it's connected.",
			"Adds companies and people to Corsair's CRM with the source of each.",
		],
		result:
			'A list you can start emailing, where every row has a link that backs it up.',
		notes: [
			"It asks who you sell to before the first search if you haven't said: industry, size, location and anything that rules a company out.",
			"It looks for 25 companies a run and opens each company's site, dropping the ones that don't fit.",
			"Every company and person goes into Corsair's CRM with a note on why it matches and the link it came from.",
			"Exa and Apollo can run on Corsair's account, so you pay for searches with Corsair credits instead of a plan with each provider.",
		],
	},
	{
		slug: 'meeting-prep',
		name: 'Meeting prep',
		summary:
			"A one-page brief on everyone you're meeting today, from the web and your past emails.",
		category: 'research',
		required: ['googlecalendar', 'exa'],
		optional: ['gmail', 'firecrawl'],
		builtIn: ['crm'],
		steps: [
			"Finds today's meetings with people outside your company.",
			'Looks up each person and their company on the web.',
			'Reads your past emails with them, if Gmail is connected.',
			"Writes a brief per meeting with sources, and saves the people to Corsair's CRM.",
		],
		result:
			'You walk into each call knowing who they are and what you last said.',
		notes: [
			'It only prepares meetings that include people from outside your company.',
			'Each brief says who they are, what their company does, what you last discussed and two questions to ask, with a link for every source.',
			'With Gmail connected, it reads your last three threads with each person.',
			"New people are saved to Corsair's CRM. Exa and Firecrawl can run on Corsair's account, so web lookups cost Corsair credits instead of a plan with each provider.",
		],
		schedule: 'Every weekday at 7:30',
	},
	{
		slug: 'competitor-watch',
		name: 'Competitor watch',
		summary:
			"Checks your competitors' pricing, changelog and blog each week and tells you what changed.",
		category: 'research',
		required: ['firecrawl'],
		optional: ['exa', 'slack'],
		builtIn: ['files'],
		steps: [
			'Reads the competitor pages you name: pricing, changelog, blog.',
			"Compares each page with last week's copy in your Corsair files.",
			"Searches the news for each competitor with Exa when it's connected.",
			'Reports only what changed, with links.',
		],
		result: 'A price change or a launch reaches you the week it happens.',
		notes: [
			'The first time, it asks which competitors and which pages to watch, and remembers them in the skill.',
			"Each week's copy of a page is saved in your Corsair files under competitors/<name>/<page>.md, so you keep the history.",
			'It ignores changes to dates and layout and reports only what the page says differently.',
			"Firecrawl can run on Corsair's account, so each page it reads costs Corsair credits instead of a Firecrawl plan.",
		],
		schedule: 'Every Monday at 8:00',
	},
	{
		slug: 'team-standup',
		name: 'Team standup',
		summary:
			'What the team merged, reviewed and moved yesterday, posted to Slack before standup.',
		category: 'engineering',
		required: ['github'],
		optional: ['linear', 'jira', 'slack'],
		builtIn: [],
		steps: [
			"Reads yesterday's merged pull requests and open reviews in GitHub.",
			'Adds issues that moved in Linear or Jira.',
			'Groups everything by person.',
			"Posts one message to your team's Slack channel.",
		],
		result: 'Standup starts from what happened, not from what people remember.',
		notes: [
			'The first time, it asks which GitHub repos and which Slack channel to use, and remembers them in the skill.',
			'It lists pull requests merged yesterday and reviews still waiting, grouped by author, a few lines per person.',
			'Issues that changed status yesterday in Linear or Jira are added when either one is connected.',
			'Without Slack, it replies in the chat instead of posting.',
		],
		schedule: 'Every weekday at 9:30',
	},
	{
		slug: 'release-notes',
		name: 'Release notes',
		summary:
			'Turns the pull requests merged since your last release into notes your customers can read.',
		category: 'engineering',
		required: ['github'],
		optional: ['linear', 'notion'],
		builtIn: ['files'],
		steps: [
			'Finds pull requests merged since the last release tag.',
			'Drops internal changes like refactors and CI.',
			'Rewrites the rest for customers, grouped into new, improved and fixed.',
			'Saves a draft to Notion or your Corsair files for you to edit.',
		],
		result:
			'Release notes in minutes, written for the people who use the product.',
	},
	{
		slug: 'bug-triage',
		name: 'Bug triage',
		summary:
			'New errors grouped, ranked by how many users they hit, and filed as issues you can act on.',
		category: 'engineering',
		required: ['sentry'],
		optional: ['github', 'linear', 'slack'],
		builtIn: ['pm'],
		steps: [
			'Reads new and regressed Sentry issues since the last run.',
			'Groups duplicates and ranks them by users affected.',
			"Finds the likely commit in GitHub when it's connected.",
			'Files the top ones as issues and posts a summary.',
		],
		result: 'The bugs worth fixing today, already written up.',
		schedule: 'Every weekday at 9:00',
	},
];

/**
 * Display names for the catalog apps the skills use, as the Hub's catalog
 * names them. gateway-skills.test.ts fails when a skill uses an app missing
 * here.
 */
const APP_NAMES: Record<string, string> = {
	ahrefs: 'Ahrefs',
	apollo: 'Apollo',
	exa: 'Exa',
	firecrawl: 'Firecrawl',
	fireflies: 'Fireflies.ai',
	github: 'GitHub',
	gmail: 'Gmail',
	googleanalytics: 'Google Analytics',
	googlecalendar: 'Google Calendar',
	googledrive: 'Google Drive',
	hubspot: 'HubSpot',
	intercom: 'Intercom',
	jira: 'Jira',
	linear: 'Linear',
	notion: 'Notion',
	outlook: 'Outlook',
	posthog: 'PostHog',
	reducto: 'Reducto',
	sentry: 'Sentry',
	slack: 'Slack',
	stripe: 'Stripe',
	zoom: 'Zoom',
};

export function hasAppName(id: string): boolean {
	return id in APP_NAMES;
}

export function appName(id: string): string {
	return APP_NAMES[id] ?? id;
}

const bySlug = new Map(GATEWAY_SKILLS.map((s) => [s.slug, s]));

export function skillBySlug(slug: string): GatewaySkill | undefined {
	return bySlug.get(slug);
}

/** The apps to start a new URL with for this skill: required first, then optional. */
export function skillApps(skill: GatewaySkill): string[] {
	return Array.from(new Set([...skill.required, ...skill.optional]));
}

/** Title and meta description for a skill's page. */
export function skillMeta(skill: GatewaySkill): {
	title: string;
	description: string;
} {
	return {
		title: `${skill.name}: a skill for your AI agent`,
		description: `${skill.summary} Set it up on Corsair for Claude, ChatGPT, Cursor or Codex.`,
	};
}

/** "Every weekday at 8:00", or how a skill without a schedule runs. */
export function skillWhen(skill: GatewaySkill): string {
	return skill.schedule ?? 'When you ask';
}

export function builtInNames(skill: GatewaySkill): string[] {
	return skill.builtIn.map((b) => BUILT_IN_APPS[b]);
}

/** "Google Calendar and Exa" / "Gmail, Slack and Linear". */
export function listNames(ids: readonly string[]): string {
	const names = ids.map(appName);
	if (names.length <= 1) return names.join('');
	return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}
