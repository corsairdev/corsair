// What the homepage says, in one place, so the page and its markdown copy
// at /index.md (the "machine" view) can't drift apart.

import { SKILL_URL } from './site-links';

export const HERO_TITLE_LEAD = 'Give your agent';
export const HERO_TITLE_REST = 'every app you use';
export const HERO_TITLE = `${HERO_TITLE_LEAD} ${HERO_TITLE_REST}`;
export const HERO_SUBTITLE =
	'One link for Claude, ChatGPT, Cursor and Codex. Your agent reads and acts in Gmail, Slack, GitHub, Notion and 400+ more apps, and every change follows the rules you set.';

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
		title: '400+ apps, one address',
		body: 'Sign in to each app once. Claude, ChatGPT, Cursor and Codex all use the same link, so you never set an app up twice.',
		href: '/integrations',
		cta: 'Browse integrations',
	},
	{
		id: 'control',
		eyebrow: 'Control',
		title: 'Your rules on every change',
		body: 'Each link has a mode. Corsair checks every action on its side, so a prompt hidden in an email can’t talk its way past it.',
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
