import type { Metadata } from 'next';
import type { FaqItem } from '@/components/gateway/gateway-ui';
import {
	Body,
	Card,
	CardGrid,
	CodeWindow,
	EndCta,
	Faq,
	GatewayLayout,
	H3,
	JsonLd,
	PageHero,
	pageJsonLd,
	Rows,
	Section,
	Steps,
	textLink,
} from '@/components/gateway/gateway-ui';
import {
	CHATGPT_LISTING_URL,
	CLAIM_HREF,
	CURSOR_DIRECTORY_URL,
	DOCS_URL,
} from '@/lib/site-links';
import { socialMetadata } from '@/lib/social-metadata';

const PATH = '/mcp-gateway';
const TITLE = 'MCP gateway: one URL for every app and agent';
const DESCRIPTION =
	"Corsair's hosted MCP gateway: connect 700+ apps once, then give Claude, ChatGPT, Cursor and Codex one URL, with approvals and a 19-tool cap. Nothing to run.";

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: PATH },
	...socialMetadata({ title: TITLE, description: DESCRIPTION, path: PATH }),
};

// What a client's config looks like with one MCP server per app, and with the gateway. Same shape as Cursor's ~/.cursor/mcp.json.
const BEFORE = `{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_…" }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": { "SLACK_BOT_TOKEN": "xoxb-…", "SLACK_TEAM_ID": "T…" }
    },
    "linear": { "url": "https://mcp.linear.app/mcp" },
    "notion": { "url": "https://mcp.notion.com/mcp" }
  }
}`;

const AFTER = `{
  "mcpServers": {
    "corsair": {
      "url": "https://maya.lug.dev/work"
    }
  }
}`;

const DOES = [
	{
		title: 'One address for every app',
		body: 'Agents connect to one URL. Add or remove an app in the gateway and every agent on that URL sees the change, with no config to edit on each machine or in each client.',
	},
	{
		title: 'Sign-in in one place',
		body: 'OAuth tokens and API keys stay in the gateway instead of in plain-text config files. Corsair encrypts them with a key per connected account and the agent never sees them. Revoke one app and keep the rest.',
	},
	{
		title: 'Rules for each agent',
		body: "Paths give each agent its own apps: /work for Claude, /personal for ChatGPT, and the work agent can't reach your personal calendar. Each path has a mode: Read, Cautious (deletes wait for your approval), Strict (every write waits) or Open.",
	},
	{
		title: 'A short tool list',
		body: "An agent that loads every server's tools fills its context window before it starts. Through Corsair it sees at most 19 tools however many apps are connected, and looks up an app's operations only when it needs them.",
	},
	{
		title: '700+ apps, nothing to install',
		body: 'Gmail, Slack, GitHub, Linear, Notion, HubSpot and the rest connect with a sign-in on Corsair Hub. There is no server to install, update or keep running.',
	},
] as const;

const STEPS = [
	{
		title: 'Claim your URL',
		body: 'Pick a name and get yourname.lug.dev.',
	},
	{
		title: 'Connect your apps',
		body: 'Sign in to each app once. Group them into paths such as /work and /personal.',
	},
	{
		title: 'Paste the URL into each agent',
		body: 'Claude, ChatGPT, Cursor, Codex, OpenCode, VS Code, Windsurf, Zed, or any client that accepts a remote MCP URL.',
	},
] as const;

// Each client's steps match the Hub's setup guide (hub explorer/src/mcp-clients.ts) and the clients' own docs, checked 2026-11-23.
// The ChatGPT and cursor.directory listings install https://mcp.corsair.dev/mcp (agent-plugins), whose sign-in asks which path to use.
const ADD: {
	client: string;
	steps: string[];
	listing?: { label: string; href: string };
	note?: string;
}[] = [
	{
		client: 'Claude',
		steps: [
			'Open Plugins, select Add, then Add custom connector.',
			'Name it Corsair, paste your URL, such as https://yourname.lug.dev/work, and select Continue.',
			'Keep the settings Claude detects and select Add. Claude sends you to Corsair to sign in and allow that one path.',
		],
		note: 'On a Team or Enterprise plan, an owner adds connectors under Organization settings.',
	},
	{
		client: 'ChatGPT',
		steps: [
			"Open the corsair.dev plugin in ChatGPT's plugin directory and install it.",
			'Connect it. Corsair asks you to sign in and pick which path ChatGPT uses.',
			'Or add your path yourself: Plugins, +, Add custom MCP server, paste the URL and choose OAuth.',
		],
		listing: { label: 'corsair.dev in ChatGPT', href: CHATGPT_LISTING_URL },
	},
	{
		client: 'Cursor',
		steps: [
			'Install Corsair from cursor.directory, or select Add to Cursor on Corsair Hub for your own path.',
			'Or put the URL in ~/.cursor/mcp.json as shown above.',
			'The first time Cursor connects, it opens Corsair in your browser to sign in. From cursor.directory, the sign-in also asks which path Cursor uses.',
		],
		listing: {
			label: 'Corsair on cursor.directory',
			href: CURSOR_DIRECTORY_URL,
		},
	},
];

// Screenshots of our listings, taken 2026-11-23 (public/listings). Retake when a listing changes.
const LISTINGS = [
	{
		src: '/listings/chatgpt-corsair-dev.webp',
		alt: "The corsair.dev plugin page in ChatGPT's plugin directory: By Corsair Dev, Projects, CRM and routines, with example prompts.",
		caption: "corsair.dev in ChatGPT's plugin directory",
		href: CHATGPT_LISTING_URL,
	},
	{
		src: '/listings/cursor-directory-corsair.webp',
		alt: 'The Corsair plugin on cursor.directory, with Add to Cursor and the config it installs: https://mcp.corsair.dev/mcp.',
		caption: 'Corsair on cursor.directory',
		href: CURSOR_DIRECTORY_URL,
	},
] as const;

const KINDS = [
	{
		name: 'Corsair',
		body: 'Hosted by Corsair. Claim a URL and connect apps that are already wired up; nothing to deploy. Made for people and small teams who use several agents.',
	},
	{
		name: 'Self-hosted gateways',
		body: "Open-source gateways such as Microsoft's MCP Gateway (on Kubernetes) and Docker's MCP Gateway (in Docker Desktop or its CLI). You run them, bring your own MCP servers and credentials, and keep everything on your own machines.",
	},
	{
		name: 'Enterprise gateways',
		body: 'Platforms such as Kong, TrueFoundry and Traefik, for platform teams putting many internal MCP servers behind single sign-on, audit logs and company-wide policies.',
	},
] as const;

const FAQ: FaqItem[] = [
	{
		q: 'What is an MCP gateway?',
		a: 'A single endpoint that sits between AI agents and the MCP servers or apps they use. The agent connects to the gateway, and the gateway handles sign-in, decides which tools the agent may use and routes each call to the right app.',
	},
	{
		q: 'Do I need an MCP gateway?',
		a: "Not for one agent and one server. Once you use several MCP servers, or the same ones in more than one agent, a gateway saves you a config block per app in every client, keeps tokens out of those files and keeps the agent's tool list short.",
	},
	{
		q: 'What is the difference between an MCP gateway and an MCP server?',
		a: 'An MCP server exposes the tools of one app or system. A gateway sits in front of many of them and adds one address, one place to sign in, access rules and routing.',
	},
	{
		q: 'Is an MCP gateway the same as an API gateway?',
		a: 'No. An API gateway fronts REST APIs for apps and services. An MCP gateway speaks the Model Context Protocol to agents and decides which tools each agent sees and what it may do with them.',
	},
	{
		q: "Is Corsair's MCP gateway self-hosted?",
		a: 'No, Corsair hosts it. It runs on the Corsair SDK, which is open source under Apache 2.0, if you need to run the same thing in your own infrastructure.',
	},
	{
		q: 'Should I use Corsair or run my own MCP gateway?',
		a: "Run your own, such as Microsoft's or Docker's open-source gateway, if your MCP servers and credentials have to stay on machines you control, or you mostly connect internal servers. You then run the gateway, the MCP servers behind it and the credentials yourself. Use Corsair if you want the apps already wired up, nothing to deploy and the same URL in every agent. Corsair runs it, keeps each token encrypted with a key per connected account in AWS Key Management Service, and checks every action against the path's mode. The middle ground is running the open-source Corsair SDK, which the gateway is built on, in your own infrastructure.",
	},
	{
		q: 'How many tools does my agent see through Corsair?',
		a: "At most 19, such as search, list_operations and run_script, however many apps you connect. The agent asks for an app's operations when it needs them, so connected apps don't fill its context window.",
	},
	{
		q: 'How do I add my MCP URL to Claude?',
		a: 'In Claude, open Plugins, select Add, then Add custom connector. Name it Corsair, paste your URL, such as https://yourname.lug.dev/work, select Continue and keep the settings Claude detects. Claude sends you to Corsair to sign in and allow that one path; there is no API key to paste. Cursor, ChatGPT, Codex and the rest take the same URL in their own MCP settings, and ChatGPT and Cursor can also install Corsair from their directories.',
	},
	{
		q: 'Is it safe to connect my Gmail and Slack to Corsair?',
		a: "Corsair encrypts every token and synced record with a key per connected account, and the keys that unlock them are held in AWS Key Management Service. Agents never see a token, and each path's mode decides which actions need your approval. The details are on corsair.dev/security.",
	},
	{
		q: 'What does it cost?',
		a: "It's free for 10 connected accounts and 100 credits a month. Pro is $20 a month for 30 connections and 10,000 credits a month. Apps that run on Corsair's own account, such as Exa and Firecrawl, cost credits per call, and $5 buys 1,000 more. The plans are on corsair.dev/pricing.",
	},
];

export default function McpGatewayPage() {
	return (
		<GatewayLayout>
			<JsonLd
				data={pageJsonLd({
					path: PATH,
					title: TITLE,
					description: DESCRIPTION,
					crumbs: [{ name: 'MCP gateway', path: PATH }],
					faq: FAQ,
				})}
			/>

			<PageHero
				eyebrow="MCP gateway"
				title="An MCP gateway you don't have to run"
				lede="An MCP gateway sits between your agents and the apps they use. Each agent connects to one address instead of one MCP server per app, and the gateway handles sign-in, permissions and which tools the agent sees. Corsair hosts one for you: claim yourname.lug.dev, connect your apps, and paste the URL into Claude, ChatGPT, Cursor or Codex."
				ctas={[
					{ label: 'Claim your URL', href: CLAIM_HREF },
					{ label: 'How it works', href: '#how' },
				]}
			/>

			<Section
				id="config"
				title="Four servers, or one URL"
				lede="Without a gateway, every client keeps its own copy of the first file, tokens included. With Corsair, every client gets the second one."
				width="wide"
			>
				<div className="grid gap-4 md:grid-cols-2">
					<CodeWindow
						title="~/.cursor/mcp.json, one server per app"
						code={BEFORE}
					/>
					<CodeWindow title="~/.cursor/mcp.json, with Corsair" code={AFTER} />
				</div>
			</Section>

			<Section id="what-it-does" title="What an MCP gateway does">
				<Rows rows={DOES} />
			</Section>

			<Section id="how" title="How it works" width="wide">
				<Steps steps={STEPS} />
			</Section>

			<Section
				id="add"
				title="Add your MCP URL to Claude, ChatGPT and Cursor"
				lede="Your URL is https://yourname.lug.dev/work. A new URL starts with the path /work; rename it or add more, such as /claude or /personal. There is no API key to paste: each one sends you to Corsair to sign in. ChatGPT and Cursor can also install Corsair from their directories, and then the sign-in asks which path to use."
				width="wide"
			>
				<CardGrid columns={3}>
					{ADD.map((a) => (
						<Card key={a.client}>
							<H3>{a.client}</H3>
							<ol className="flex list-decimal flex-col gap-2 pl-5">
								{a.steps.map((step) => (
									<li
										key={step}
										className="text-[15px] leading-[1.6] text-[#1c1c1c99]"
									>
										{step}
									</li>
								))}
							</ol>
							{a.listing ? (
								<a
									href={a.listing.href}
									target="_blank"
									rel="noopener noreferrer"
									className={`text-[15px] ${textLink}`}
								>
									{a.listing.label}
									<span className="sr-only"> (opens in a new tab)</span>
								</a>
							) : null}
							{a.note ? (
								<Body className="text-sm md:text-sm">{a.note}</Body>
							) : null}
						</Card>
					))}
				</CardGrid>
				<Body className="mt-6">
					Using Claude Code, VS Code, Codex, Hermes, OpenClaw, Windsurf or
					another agent?{' '}
					<a href="/connect" className={textLink}>
						Setup for every client
					</a>
					, with the exact config for each.
				</Body>
				<div className="mt-8 grid gap-4 md:grid-cols-2">
					{LISTINGS.map((l) => (
						<figure key={l.src} className="m-0">
							<a
								href={l.href}
								target="_blank"
								rel="noopener noreferrer"
								className="block border border-[#1c1c1c1a] bg-white"
							>
								<img
									src={l.src}
									width={1200}
									height={690}
									alt={l.alt}
									loading="lazy"
									decoding="async"
									className="h-auto w-full"
								/>
								<span className="sr-only"> (opens in a new tab)</span>
							</a>
							<figcaption className="mt-2 font-[family-name:var(--landing-font-mono)] text-xs text-[#1c1c1c99]">
								{l.caption}
							</figcaption>
						</figure>
					))}
				</div>
			</Section>

			<Section
				id="kinds"
				title="Corsair or a gateway you run yourself"
				width="wide"
			>
				<CardGrid columns={3}>
					{KINDS.map((k) => (
						<Card key={k.name}>
							<H3>{k.name}</H3>
							<Body>{k.body}</Body>
						</Card>
					))}
				</CardGrid>
			</Section>

			<Section id="questions" title="Questions">
				<Faq items={FAQ} />
			</Section>

			<EndCta
				title="One URL for every app and every agent."
				ctas={[
					{ label: 'Claim your URL', href: CLAIM_HREF },
					{
						label: 'Read the docs',
						href: `${DOCS_URL}/cloud/mcp`,
						external: true,
					},
				]}
			/>
		</GatewayLayout>
	);
}
