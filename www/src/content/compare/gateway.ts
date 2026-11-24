/**
 * Corsair's MCP gateway next to the products people weigh it against
 * (corsair.dev/compare). Moved from lug.dev/compare: Corsair's hub repo,
 * apps/lug/src/data/compare.ts at 01b9a8d64 (2026-11-23). Only the naming
 * changed (Lug became Corsair) and the app count is stated the way the rest
 * of corsair.dev states it (700+). Every claim about another product comes
 * from its own public pages, checked on CHECKED; the links are in each
 * page's `sources`. Each page says plainly where the other product is the
 * better choice. Fact sheets with every source: corsair-brain
 * kits/compare/<slug>.json.
 */

import type { FaqItem } from '@/components/gateway/gateway-ui';

export const CHECKED = '2026-11-20';
export const CHECKED_LABEL = '20 November 2026';

/** How many apps the gateway connects, rounded down as on the rest of corsair.dev. */
export const APP_COUNT = '700+';

export type CompareGroup = 'one-url' | 'paid-data' | 'memory';

export type CompareRow = { label: string; corsair: string; them: string };

export type GatewayComparison = {
	slug: string;
	name: string;
	/** Shown as "Corsair vs <vsName>"; defaults to name. */
	vsName?: string;
	url: string;
	group: CompareGroup;
	/** The card line on /compare. */
	card: string;
	metaTitle: string;
	metaDescription: string;
	/** What the other product is, in a paragraph, and who should pick which. */
	intro: string;
	rows: CompareRow[];
	pickThem: string[];
	pickCorsair: string[];
	/** A section only this page needs, such as what happened to Rube. */
	note?: { heading: string; body: string[] };
	faq: FaqItem[];
	sources: { label: string; url: string }[];
};

/** Corsair's side of every table, so each page states it the same way. */
const CORSAIR = {
	what: 'One MCP URL, such as yourname.lug.dev/work, for the apps you sign in to, with built-in issues, CRM and files.',
	connect:
		"Paste the URL into any MCP client; it signs in with OAuth, or sends the path's key in a header. At most 19 tools however many apps are connected.",
	apps: `${APP_COUNT} apps you sign in to, several accounts per app.`,
	paid: "Exa, Firecrawl and other pay-per-call APIs on Corsair's accounts, paid from credits ($5 per 1,000).",
	free: 'Free: 10 connections, 100 credits a month, 5 GB of files.',
	paidPlans:
		'Pro $20 a month: 30 connections, 10,000 credits a month. Enterprise: custom.',
	builtIns:
		'Issues, a CRM, files and Postgres, plus synced knowledge bases you search in one go.',
	skills:
		'Saved skills every agent on the URL can load; routines that run on a schedule or when something happens.',
	approvals:
		'A mode per path: Read, Cautious (the default: deletes wait for your approval), Strict (every write waits) or Open.',
	open: "Runs on the Corsair SDK, open source under Apache 2.0; the hosted service is Corsair's.",
};

export const COMPARISONS: GatewayComparison[] = [
	{
		slug: 'composio',
		name: 'Composio For You',
		vsName: 'Composio',
		url: 'https://composio.dev/for-you',
		group: 'one-url',
		card: 'More apps and a free team plan. No built-in issues, CRM or files, and no routines; replaced Rube in May 2026.',
		metaTitle: 'Corsair vs Composio: Rube alternative and SDK compared',
		metaDescription:
			"Corsair's MCP gateway vs Composio For You, which replaced Rube: apps, pricing, CRM, routines and approvals, with sources. Then the two SDKs.",
		intro:
			"Composio For You is Composio's MCP server and CLI for people working in their own accounts, and it's where Rube's users were pointed when Rube shut down on 16 May 2026. Like Corsair it is one URL your agents share. It lists more apps and lets a small team start free. Corsair comes with its own issues, CRM and files, runs routines, and holds deletes for your approval on every plan.",
		rows: [
			{
				label: 'What it is',
				corsair: CORSAIR.what,
				them: "Composio's MCP and CLI for personal automation with your own accounts, separate from its developer platform.",
			},
			{
				label: 'How an agent connects',
				corsair: CORSAIR.connect,
				them: 'One shared URL (connect.composio.dev/mcp) with OAuth, or the Composio CLI for coding agents. Seven meta-tools, including a Python workbench and a bash tool.',
			},
			{
				label: 'Your apps',
				corsair: CORSAIR.apps,
				them: '1,700+ apps on its marketing pages (its docs say 1,500+). Up to 10 accounts per app.',
			},
			{
				label: 'Paid tools per call',
				corsair: CORSAIR.paid,
				them: "Instant tools: 89 apps and 2,900 tools on Composio's accounts, priced per tool, for example Exa search at $0.007.",
			},
			{
				label: 'Free plan',
				corsair: CORSAIR.free,
				them: 'Up to 3 members, 10,000 app tool calls a month, $2 of credits once, up to 3 of your own MCP servers.',
			},
			{
				label: 'Paid plans',
				corsair: CORSAIR.paidPlans,
				them: 'Standard $18 per seat a month, marked coming soon. Enterprise custom. Extra tool calls $0.005 each.',
			},
			{
				label: 'Built-in apps',
				corsair: CORSAIR.builtIns,
				them: 'None listed: no CRM, issue tracker, file store or database.',
			},
			{
				label: 'Skills and routines',
				corsair: CORSAIR.skills,
				them: 'Team skills (25 shared on Free). No scheduled routines or triggers: its docs send those to the developer platform.',
			},
			{
				label: 'Approvals and controls',
				corsair: CORSAIR.approvals,
				them: 'Firewall: plain-English policies that block calls and scrub secrets, on Standard and Enterprise only.',
			},
			{
				label: 'Open source',
				corsair: CORSAIR.open,
				them: "The SDK is open source (MIT); the hosted service isn't. Enterprise can run in your own cloud.",
			},
		],
		pickThem: [
			`You need an app Corsair doesn't have: Composio lists 1,700+ against Corsair's ${APP_COUNT}.`,
			'A team of up to 3 wants to start free, with 10,000 tool calls a month and its own MCP servers next to the catalog.',
			"You want SOC 2 Type II and ISO 27001 on paper today. Corsair's pages describe its encryption but state no certification.",
			"You need Enterprise options Corsair doesn't publish: your own cloud, SCIM, streaming logs to a SIEM.",
		],
		pickCorsair: [
			'You want issues, a CRM, files and Postgres in the same place as your apps, without another subscription.',
			'Something should run on its own every morning, or when an email arrives. For You has no routines.',
			"Deletes should wait for your yes on every plan. Composio's Firewall needs Standard or Enterprise.",
			"Work and personal should stay apart: each path on your URL has its own apps, so one agent can't reach the other's accounts.",
			'One search should cover all your apps: Corsair syncs them into knowledge bases.',
		],
		note: {
			heading: 'What happened to Rube',
			body: [
				"Rube was Composio's MCP app for everyday users. New signups stopped on 9 April 2026, Rube Chat closed on 20 April, and Rube shut down on 16 May 2026 with payments refunded.",
				"Accounts were not moved to For You. Rube's notice says recipes and chat history were deleted, and users were asked to reconnect their apps and start fresh.",
				"If you're starting fresh anyway, Corsair is the other one-URL option to try: claim a free URL, connect the same apps, and paste one address into your agent.",
			],
		},
		faq: [
			{
				q: 'Is Corsair a Rube alternative?',
				a: "Yes. Corsair's MCP gateway does what Rube did, one MCP URL for your apps in Claude, ChatGPT, Cursor and other agents, and adds built-in issues, CRM and files, routines and approvals. Rube shut down on 16 May 2026.",
			},
			{
				q: 'Did Rube accounts move to Composio For You?',
				a: "No. Rube's shutdown notice says accounts were not migrated and recipes and chat history were deleted. Users reconnect their apps from scratch, on For You or anywhere else.",
			},
			{
				q: 'Which has more apps?',
				a: `Composio lists 1,700+ apps; Corsair connects ${APP_COUNT}. Both cover Gmail, Slack, GitHub, Google Calendar, Linear and Notion.`,
			},
		],
		sources: [
			{ label: 'Composio For You', url: 'https://composio.dev/for-you' },
			{
				label: 'Composio For You pricing',
				url: 'https://composio.dev/pricing/for-you',
			},
			{
				label: 'Instant tools rates',
				url: 'https://composio.dev/pricing/for-you/instant-tools',
			},
			{
				label: 'Composio Connect docs',
				url: 'https://docs.composio.dev/docs/composio-connect',
			},
			{
				label: 'Composio approvals (developer platform)',
				url: 'https://docs.composio.dev/docs/governance/approvals',
			},
			{ label: 'Rube shutdown notice', url: 'https://www.rube.app/' },
		],
	},
	{
		slug: 'zapier-mcp',
		name: 'Zapier MCP',
		url: 'https://zapier.com/mcp',
		group: 'one-url',
		card: '9,000+ apps and Zaps behind it, but every tool call uses tasks: 50 calls a month on Free.',
		metaTitle: 'Zapier MCP alternative: Corsair vs Zapier MCP',
		metaDescription:
			'Corsair and Zapier MCP side by side: apps, how calls are billed, built-in issues and CRM, skills, routines and approvals, with sources.',
		intro:
			"Zapier MCP puts Zapier's 9,000+ apps behind one MCP server, inside every Zapier plan, and lets a chat turn into a Zap. Every successful tool call uses 2 of your Zapier tasks, so the Free plan's 100 tasks come to 50 calls a month. Corsair charges by connected accounts, not by call, and comes with its own issues, CRM and files.",
		rows: [
			{
				label: 'What it is',
				corsair: CORSAIR.what,
				them: "An MCP server in front of Zapier's apps and actions, part of every Zapier plan.",
			},
			{
				label: 'How an agent connects',
				corsair: CORSAIR.connect,
				them: 'One hosted endpoint per server with OAuth, or a connection token. Agentic mode gives the client 16 meta-tools.',
			},
			{
				label: 'Your apps',
				corsair: CORSAIR.apps,
				them: '9,000+ apps; several accounts per app, picked per call.',
			},
			{
				label: 'How calls are billed',
				corsair:
					"Calls to your own apps aren't metered. Plans limit connections; credits pay only for pay-per-call APIs.",
				them: 'Each successful tool call uses 2 tasks from the same pool as your Zaps. Failed calls use none.',
			},
			{
				label: 'Free plan',
				corsair: CORSAIR.free,
				them: '100 tasks a month, so 50 MCP calls, 1 seat.',
			},
			{
				label: 'Paid plans',
				corsair: CORSAIR.paidPlans,
				them: 'Professional from $19.99 a month, Team from $69 a month, Enterprise on request.',
			},
			{
				label: 'Built-in apps',
				corsair: CORSAIR.builtIns,
				them: 'Zapier Tables and Forms. No CRM, issue tracker or synced search across your apps.',
			},
			{
				label: 'Skills and routines',
				corsair: CORSAIR.skills,
				them: 'Saved Markdown skills, shareable across clients. Chat work can become Zaps with triggers and run history.',
			},
			{
				label: 'Approvals and controls',
				corsair: CORSAIR.approvals,
				them: 'You choose which apps and actions the agent can use; Enterprise adds app and action restrictions. Every action is logged in History.',
			},
			{
				label: 'Open source',
				corsair: CORSAIR.open,
				them: 'No; only the client plugin files are public (MIT).',
			},
		],
		pickThem: [
			'Your team already runs on Zapier: MCP is in the plan you pay for, with the same app connections.',
			"You need one of the 9,000+ apps that Corsair doesn't connect.",
			"The agent's work should become a full automation with triggers, filters, paths and run history.",
			'You need SOC 2 Type II, SAML SSO and SCIM today.',
		],
		pickCorsair: [
			"Your agent makes a lot of calls: Corsair doesn't meter calls to your own apps, while Zapier Free stops at 50 calls a month.",
			'You want issues, a CRM, files and Postgres built in.',
			'Deletes should wait for your approval by default, path by path.',
			'You want your apps synced so one search covers all of them.',
		],
		faq: [
			{
				q: 'Is Zapier MCP free?',
				a: "It's included in every Zapier plan, including Free, but each successful tool call uses 2 tasks. Free has 100 tasks a month, which is 50 calls.",
			},
			{
				q: 'Does Corsair charge per call?',
				a: "Not for your own apps. Corsair's plans limit how many accounts you connect; credits pay only for pay-per-call APIs such as Exa and Firecrawl that run on Corsair's accounts.",
			},
		],
		sources: [
			{ label: 'Zapier MCP', url: 'https://zapier.com/mcp' },
			{
				label: 'How Zapier MCP uses tasks',
				url: 'https://docs.zapier.com/mcp/overview/usage',
			},
			{ label: 'Zapier pricing', url: 'https://zapier.com/pricing' },
		],
	},
	{
		slug: 'pipedream-mcp',
		name: 'Pipedream MCP',
		url: 'https://mcp.pipedream.com',
		group: 'one-url',
		card: "Free, with 3,000+ APIs. Each app's actions load as separate tools, and there are no approvals, skills or built-ins.",
		metaTitle: 'Corsair vs Pipedream MCP',
		metaDescription:
			"Corsair and Pipedream's free MCP server side by side: apps, tool count, approvals, skills, routines and built-in apps, with sources.",
		intro:
			"Pipedream MCP is a free MCP URL for 3,000+ APIs, where you sign in and pick the apps to turn on. It is the cheapest way to reach a long list of apps. Corsair keeps the agent's tool list to 19 however many apps are connected, holds deletes for approval, and adds skills, routines and its own issues, CRM and files.",
		rows: [
			{
				label: 'What it is',
				corsair: CORSAIR.what,
				them: "A free MCP server for people, separate from Pipedream's developer product Connect.",
			},
			{
				label: 'How an agent connects',
				corsair: CORSAIR.connect,
				them: "One URL (mcp.pipedream.net/v2) with sign-in; each enabled app's actions are listed as tools (24 for Gmail).",
			},
			{
				label: 'Your apps',
				corsair: CORSAIR.apps,
				them: '3,000+ APIs and 10,000+ tools.',
			},
			{
				label: 'Price',
				corsair: `${CORSAIR.free} ${CORSAIR.paidPlans}`,
				them: 'Free for end users; no limits are published.',
			},
			{
				label: 'Built-in apps',
				corsair: CORSAIR.builtIns,
				them: 'None published for end users.',
			},
			{
				label: 'Skills and routines',
				corsair: CORSAIR.skills,
				them: 'None published for the end-user MCP.',
			},
			{
				label: 'Approvals and controls',
				corsair: CORSAIR.approvals,
				them: 'You choose which apps are on. No approval step is published; Conduit, its gateway for companies, adds policies.',
			},
			{
				label: 'Open source',
				corsair: CORSAIR.open,
				them: "Source available: every tool's code is on GitHub under Pipedream's Source Available License.",
			},
		],
		pickThem: [
			'You want it free, with no plan to outgrow.',
			"You need one of the 3,000+ APIs Corsair doesn't connect.",
			'You want to read the source of every tool you call.',
		],
		pickCorsair: [
			'Your agent should see a short tool list: Corsair shows at most 19 tools however many apps you connect.',
			'Deletes, or every write, should wait for your approval.',
			'You want skills and routines shared by every agent on your URL.',
			'You want issues, a CRM, files and Postgres built in.',
		],
		faq: [
			{
				q: 'Is Pipedream MCP still free?',
				a: "Yes, for end users, as of 20 November 2026. Pipedream's paid plans are for developers building on Connect.",
			},
		],
		sources: [
			{ label: 'Pipedream MCP', url: 'https://mcp.pipedream.com' },
			{
				label: 'Pipedream MCP for users',
				url: 'https://pipedream.com/docs/connect/mcp/users',
			},
			{
				label: 'Pipedream Connect pricing',
				url: 'https://pipedream.com/pricing',
			},
		],
	},
	{
		slug: 'smithery',
		name: 'Smithery',
		url: 'https://smithery.ai',
		group: 'one-url',
		card: 'Now a free directory run by Arcade. It stopped hosting and proxying MCP servers on 31 October 2026.',
		metaTitle: 'Smithery alternative: a hosted MCP URL for your apps',
		metaDescription:
			'Smithery stopped hosting MCP servers on 31 October 2026 and is now a directory. How Corsair compares: one hosted URL for your apps, with sources.',
		intro:
			"Smithery used to host and proxy MCP servers. Its proxy, accounts, API keys, CLI and SDKs shut down on 31 October 2026, and it is now a free directory run by Arcade that links to each vendor's own server. If you used Smithery to reach several apps from one place, Corsair's MCP gateway is a hosted URL that does that: one address, many apps, one sign-in each.",
		rows: [
			{
				label: 'What it is',
				corsair: CORSAIR.what,
				them: 'A directory of MCP servers, run by Arcade since late 2026, that links to each vendor.',
			},
			{
				label: 'How an agent connects',
				corsair: CORSAIR.connect,
				them: "To each vendor's own server, one URL per server; Gmail and Slack tools go through Arcade.",
			},
			{
				label: 'Your apps',
				corsair: CORSAIR.apps,
				them: "215 servers listed, 86 of them Arcade's.",
			},
			{
				label: 'Price',
				corsair: `${CORSAIR.free} ${CORSAIR.paidPlans}`,
				them: "Browsing is free. Arcade's tools: Free gives 2,000 tool calls a month; Team is $25 plus $0.01 a call.",
			},
			{
				label: 'Hosting',
				corsair: 'Hosted by Corsair; nothing to run.',
				them: 'None since 31 October 2026; paid plans ended with refunds.',
			},
		],
		pickThem: [
			"You want to browse what MCP servers exist and connect to each vendor's own.",
			"You're already on Arcade for your tools.",
		],
		pickCorsair: [
			'You want one hosted URL for many apps instead of a server per vendor.',
			'You want approvals, skills, routines and built-in issues, CRM and files on that URL.',
		],
		faq: [
			{
				q: 'Does Smithery still host MCP servers?',
				a: "No. Smithery's proxy, accounts, API keys, CLI and SDKs shut down on 31 October 2026, and it no longer hosts or proxies servers.",
			},
		],
		sources: [
			{ label: 'Smithery', url: 'https://smithery.ai' },
			{
				label: 'Smithery on what changed',
				url: 'https://www.smithery.ai/future',
			},
			{ label: 'Smithery pricing', url: 'https://www.smithery.ai/pricing' },
			{ label: 'Arcade pricing', url: 'https://www.arcade.dev/pricing' },
		],
	},
	{
		slug: 'monid',
		name: 'Monid',
		url: 'https://monid.ai',
		group: 'paid-data',
		card: "3,472 paid tools on one balance. It doesn't act in your own apps; it says that isn't its job.",
		metaTitle: 'Corsair vs Monid',
		metaDescription:
			'Corsair and Monid side by side: your own apps vs paid data tools per call, pricing, built-in apps, skills and routines, with sources.',
		intro:
			"Monid sells data and tools per call from one prepaid balance: 3,472 tools across 107 providers, with the price in every response. It doesn't connect your own Gmail, Slack or CRM; its own comparison says that's not its job. Corsair is the other half: your own apps on one URL, with a smaller set of pay-per-call APIs. Some teams use both.",
		rows: [
			{
				label: 'What it is',
				corsair: CORSAIR.what,
				them: 'Paid tools and data per call for agents, from one balance.',
			},
			{
				label: 'How an agent connects',
				corsair: CORSAIR.connect,
				them: 'MCP (mcp.monid.ai/v1), a SKILL.md, a CLI or the HTTP API; or pay a single run in USDC with no account.',
			},
			{
				label: 'Your own apps',
				corsair: CORSAIR.apps,
				them: 'None: acting in your Gmail, Slack or CRM is "not Monid\'s job".',
			},
			{
				label: 'Paid tools per call',
				corsair: CORSAIR.paid,
				them: '3,472 tools across 107 providers; 98% at no markup. Example: Exa search $0.007.',
			},
			{
				label: 'Price',
				corsair: `${CORSAIR.free} ${CORSAIR.paidPlans}`,
				them: '$1 free, then pay per call. No subscriptions.',
			},
			{
				label: 'Built-in apps',
				corsair: CORSAIR.builtIns,
				them: 'An email inbox, phone number, machine and file system for the agent, billed as resources.',
			},
			{
				label: 'Skills and routines',
				corsair: CORSAIR.skills,
				them: "Monid ships as a skill; saved skills and routines aren't published.",
			},
			{
				label: 'Controls',
				corsair: CORSAIR.approvals,
				them: 'Spending controls: budget windows, per-run caps and a wallet gate.',
			},
		],
		pickThem: [
			'Your agent needs paid data at scale: 3,472 tools, with the price shown before each call.',
			'You want no plan at all, or to pay a run in USDC.',
			'The agent needs its own inbox, phone number or machine.',
		],
		pickCorsair: [
			`Your agent should work in your own Gmail, Slack, GitHub, Linear and the rest: Corsair connects ${APP_COUNT} apps.`,
			'You want issues, a CRM, files and Postgres for your own records.',
			'Jobs should run on a schedule or when something happens.',
		],
		faq: [
			{
				q: 'Can I use Corsair and Monid together?',
				a: 'Yes. They do different jobs: Corsair reaches your own apps, Monid sells outside data per call. An agent can have both URLs.',
			},
		],
		sources: [
			{ label: 'Monid', url: 'https://monid.ai' },
			{
				label: "Monid's own comparison",
				url: 'https://monid.ai/compare/monid-vs-composio',
			},
			{ label: 'Monid pricing', url: 'https://monid.ai/docs/guide/pricing' },
		],
	},
	{
		slug: 'treg',
		name: 'treg',
		url: 'https://treg.io',
		group: 'paid-data',
		card: "4,200+ data endpoints at the provider's own rate. About 17 of your own accounts, and no routines.",
		metaTitle: 'Corsair vs treg',
		metaDescription:
			'Corsair and treg side by side: your own apps vs paid data endpoints at cost, pricing, built-in apps, routines and controls, with sources.',
		intro: `treg routes an agent to 4,200+ paid data endpoints across 136 providers at the provider's own rate, with 0% markup written into its terms. It connects about 17 of your own ad, analytics and social accounts and has no triggers or schedules. Corsair connects ${APP_COUNT} of your own apps and runs routines; for SEO, ad and enrichment data at scale, treg goes deeper.`,
		rows: [
			{
				label: 'What it is',
				corsair: CORSAIR.what,
				them: "One token for 4,200+ paid data endpoints, billed at the provider's rate.",
			},
			{
				label: 'How an agent connects',
				corsair: CORSAIR.connect,
				them: 'MCP (treg.to/mcp) with OAuth or a token, a CLI and skill for coding agents, or an HTTP API.',
			},
			{
				label: 'Your own apps',
				corsair: CORSAIR.apps,
				them: 'About 17: Google Analytics, Search Console, Google Ads, Meta Ads, Slack, LinkedIn and others.',
			},
			{
				label: 'Paid tools per call',
				corsair: CORSAIR.paid,
				them: '4,200+ endpoints across 136 providers at 0% markup; your own provider keys are never metered.',
			},
			{
				label: 'Price',
				corsair: `${CORSAIR.free} ${CORSAIR.paidPlans}`,
				them: '$1 free, then a prepaid balance. No plans or seats.',
			},
			{
				label: 'Built-in apps',
				corsair: CORSAIR.builtIns,
				them: 'A team registry for keys, CLIs and skills; no CRM, issues or files.',
			},
			{
				label: 'Skills and routines',
				corsair: CORSAIR.skills,
				them: 'Skills install into each agent. "No triggers or scheduled workflows."',
			},
			{
				label: 'Controls',
				corsair: CORSAIR.approvals,
				them: 'Spend caps per team, call and member; roles; an audit log of every call.',
			},
			{
				label: 'Open source',
				corsair: CORSAIR.open,
				them: 'Apache 2.0 with added terms: self-host for your own team, not as a service for others.',
			},
		],
		pickThem: [
			'Your agent does SEO, ads, social or enrichment research and needs the data at cost.',
			'You want to bring your own provider keys and never be metered on them.',
			'You want to self-host for your own team.',
		],
		pickCorsair: [
			'Your agent should work in Gmail, GitHub, Linear, Notion and the rest of your own apps.',
			'Jobs should run on a schedule or when something happens.',
			'You want issues, a CRM and files built in.',
		],
		faq: [
			{
				q: 'Is treg open source?',
				a: "Its code is on GitHub under Apache 2.0 with added terms: you can self-host it for your own team, but offering it as a service to others needs treg's written permission.",
			},
		],
		sources: [
			{ label: 'treg', url: 'https://treg.io' },
			{ label: 'treg pricing', url: 'https://treg.io/pricing' },
			{
				label: 'treg compares itself to Composio',
				url: 'https://treg.io/compare/treg-vs-composio',
			},
			{
				label: 'treg on GitHub',
				url: 'https://github.com/superdesigndev/treg',
			},
		],
	},
	{
		slug: 'gbrain',
		name: 'GBrain',
		url: 'https://gbrain.io',
		group: 'memory',
		card: 'A shared written memory and skill packs, from $19 a month. Corsair has a free plan and more apps.',
		metaTitle: 'Corsair vs GBrain',
		metaDescription:
			'Corsair and GBrain side by side: apps, team memory, skills, permissions and pricing, with sources.',
		intro:
			'GBrain gives a team one MCP address for its apps plus a shared memory: markdown pages about people, companies and meetings that every AI reads and writes, and ready-made skill packs. It has no free plan; Tools starts at $19 a month. Corsair starts free, connects more apps, and comes with issues, a CRM and files.',
		rows: [
			{
				label: 'What it is',
				corsair: CORSAIR.what,
				them: 'Apps, a shared memory and skills for a team, in every AI the team uses.',
			},
			{
				label: 'How an agent connects',
				corsair: CORSAIR.connect,
				them: 'One MCP address (gbrain.io/mcp), or the gbrainio CLI for coding agents.',
			},
			{
				label: 'Your apps',
				corsair: CORSAIR.apps,
				them: '470 connectors listed; any MCP server can be added by address.',
			},
			{
				label: 'Free plan',
				corsair: CORSAIR.free,
				them: 'None; a 7-day trial of Tools.',
			},
			{
				label: 'Paid plans',
				corsair: CORSAIR.paidPlans,
				them: 'Tools $19 a month per person, Personal $49, Team $199 a month per workspace, Enterprise custom.',
			},
			{
				label: 'Built-in apps',
				corsair: CORSAIR.builtIns,
				them: "A shared memory as markdown pages with semantic search; GBrain's own AI chat on Team.",
			},
			{
				label: 'Skills and routines',
				corsair: CORSAIR.skills,
				them: 'A directory of ready-made skills and packs with one-click setup; schedules in its cloud on Team.',
			},
			{
				label: 'Approvals and controls',
				corsair: CORSAIR.approvals,
				them: 'Permission levels per app and per AI (Gmail: Off, Read, Draft, Manage, Read & Write), plus a daily limit on every tool.',
			},
			{
				label: 'Open source',
				corsair: CORSAIR.open,
				them: "The memory and skills are open source (MIT); the hosted connectors aren't described as open source.",
			},
		],
		pickThem: [
			'Your team wants a written memory every AI reads and writes, about people, companies and decisions.',
			'You want ready-made business skill packs with a setup call.',
			'You want finer controls per app, such as Gmail on Draft for one AI and Read for another.',
			'A whole team on one flat $199 a month suits you.',
		],
		pickCorsair: [
			"You want to start free: Corsair's Free plan is $0, GBrain's cheapest plan is $19 a month after a trial.",
			'Pro at $20 a month against GBrain Personal at $49.',
			`You need more apps: Corsair connects ${APP_COUNT}, GBrain lists 470.`,
			'You want issues, a CRM, files and Postgres built in.',
		],
		faq: [
			{
				q: 'Does GBrain have a free plan?',
				a: 'No. Its cheapest option is Tools at $19 a month per person, after a 7-day trial.',
			},
		],
		sources: [
			{ label: 'GBrain pricing', url: 'https://gbrain.io/pricing' },
			{ label: 'GBrain connectors', url: 'https://gbrain.io/applications' },
			{
				label: 'GBrain permission levels',
				url: 'https://gbrain.io/tools/features/permission-levels',
			},
			{ label: 'GBrain skills', url: 'https://gbrain.io/skills' },
		],
	},
];

export function comparisonBySlug(slug: string): GatewayComparison | undefined {
	return COMPARISONS.find((c) => c.slug === slug);
}

/** The other product's name in "Corsair vs <name>". */
export function vsName(c: Pick<GatewayComparison, 'name' | 'vsName'>): string {
	return c.vsName ?? c.name;
}

/** Each product's favicon, saved once in public/compare-logos so the page makes no third-party request. */
export function compareLogo(slug: string): string {
	return `/compare-logos/${slug}.png`;
}
