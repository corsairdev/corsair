// What the homepage says, in one place, so the page and its markdown copy
// at /index.md (the "machine" view) can't drift apart.

import { SKILL_URL } from './site-links';

export const HERO_TITLE_LEAD = 'One MCP URL';
export const HERO_TITLE_REST = 'for every app and agent';
export const HERO_TITLE = `${HERO_TITLE_LEAD} ${HERO_TITLE_REST}`;
export const HERO_SUBTITLE =
	'Connect Gmail, Slack, GitHub, Notion and 700+ more apps once. Paste one URL into Claude, ChatGPT, Cursor or Codex, and every change follows the rules you set.';

// skill.md adds Corsair to the client the agent runs in, with the person signing
// in once. auth.md (an account with no one signed in) is for agents on their own.
export const AGENT_SETUP_PROMPT = `Read ${SKILL_URL} and set up Corsair for me`;

export const HERO_CLIENTS = [
	'Claude',
	'ChatGPT',
	'Cursor',
	'Codex',
	'VS Code',
	'Zed',
] as const;

export const CONNECT_APPS = [
	{ id: 'gmail', name: 'Gmail' },
	{ id: 'slack', name: 'Slack' },
	{ id: 'github', name: 'GitHub' },
	{ id: 'notion', name: 'Notion' },
	{ id: 'linear', name: 'Linear' },
	{ id: 'hubspot', name: 'HubSpot' },
	{ id: 'googlecalendar', name: 'Google Calendar' },
] as const;

export const LINK_MODES = [
	{ name: 'Read', note: 'reads only' },
	{ name: 'Cautious', note: 'asks before deletes', isDefault: true },
	{ name: 'Strict', note: 'asks before every change' },
	{ name: 'Open', note: 'never asks' },
] as const;

export const ROUTINE_EXAMPLE =
	'Every weekday at 9am New York time, post GitHub pull requests waiting on review for more than two days to #eng in Slack.';

export const PILLARS = [
	{
		id: 'connect',
		eyebrow: 'Connect',
		title: '700+ apps, one URL',
		body: 'Sign in to each app once. Claude, ChatGPT, Cursor and Codex all use the same URL, so you never set an app up twice.',
		href: '/integrations',
		cta: 'Browse integrations',
	},
	{
		id: 'control',
		eyebrow: 'Control',
		title: 'Your rules on every change',
		body: 'Paths such as /work and /personal give each agent its own apps, and each path has a mode. Corsair checks every action on its side, so a prompt hidden in an email can’t talk its way past it.',
		href: '/security',
		cta: 'How Corsair keeps it safe',
	},
	{
		id: 'automate',
		eyebrow: 'Automate',
		title: 'Routines that run without you',
		body: 'Describe a job in plain words. Corsair writes it, tests it, and runs it on a schedule or when something happens in an app.',
		href: '/use-cases',
		cta: 'See use cases',
	},
] as const;

export const DEVELOPER_POINTS = [
	'Your users connect their own accounts: OAuth, token refresh and API keys handled',
	'Typed calls, verified webhooks and synced data, per user',
	'The same approvals and modes, enforced in your app',
	'Open source. Self-host it, or run it on Corsair Cloud',
] as const;

// Apps that come with every MCP URL, so you skip a subscription (from lug.dev's home page).
export const BUILT_INS = [
	{
		id: 'issues',
		name: 'Issues',
		body: 'Projects and issues your agents file and update, instead of seats in Linear, Asana or Jira.',
	},
	{
		id: 'crm',
		name: 'CRM',
		body: 'Deals, contacts and companies your agents keep current, instead of seats in Attio, HubSpot or Salesforce.',
	},
	{
		id: 'files',
		name: 'Files',
		body: 'Files from any app land in one place, read and searchable. Private to your URL until you share.',
	},
	{
		id: 'postgres',
		name: 'Postgres',
		body: 'Add your own databases. Agents query them by name and never see the connection string.',
	},
] as const;
