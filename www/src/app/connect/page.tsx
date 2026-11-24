import type { Metadata } from 'next';

import {
	Body,
	Card,
	CardGrid,
	EndCta,
	GatewayLayout,
	H3,
	Inline,
	JsonLd,
	PageHero,
	pageJsonLd,
	Section,
	textLink,
} from '@/components/gateway/gateway-ui';
import type { ClientGuide, ClientLink, McpClient } from '@/lib/mcp-clients';
import { FEATURED_CLIENTS, MCP_CLIENTS } from '@/lib/mcp-clients';
import {
	APP_URL,
	CHATGPT_LISTING_URL,
	CLAIM_HREF,
	CURSOR_DIRECTORY_URL,
	hubMeSignInUrl,
} from '@/lib/site-links';
import { socialMetadata } from '@/lib/social-metadata';

const PATH = '/connect';
const TITLE = 'Connect your MCP URL to Claude, ChatGPT, Cursor and 25+ agents';
const DESCRIPTION =
	'Setup for every MCP client: install Corsair from ChatGPT, Cursor, Hermes or OpenClaw, or paste your MCP URL into Claude Code, VS Code, Codex and more.';

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: PATH },
	...socialMetadata({ title: TITLE, description: DESCRIPTION, path: PATH }),
};

// What Hub fills in after signup, shown as placeholders here. The guides are Hub's own
// (copied into lib/mcp-clients.ts), so this page and Hub's setup screens say the same thing.
const PLACEHOLDER: ClientLink = {
	shortUrl: 'https://yourname.lug.dev/work',
	secretUrl: '<your secret URL, from Corsair Hub>',
	apiKey: null,
};

// Code that uses Corsair rather than an app that connects to it.
const FRAMEWORKS = new Set(['ai-sdk', 'openai-agents', 'mastra']);

const ordered: McpClient[] = [
	...FEATURED_CLIENTS.flatMap((id) => MCP_CLIENTS.filter((m) => m.id === id)),
	...MCP_CLIENTS.filter((m) => !FEATURED_CLIENTS.includes(m.id)),
];
const AGENTS = ordered.filter((m) => !FRAMEWORKS.has(m.id));
const CODE = ordered.filter((m) => FRAMEWORKS.has(m.id));

const AUTH: Record<McpClient['auth'], string> = {
	'sign-in': 'Signs in with Corsair',
	key: 'API key in a header',
	both: 'Sign-in or API key',
	'secret-url': 'Secret URL',
};

// Installs that come from a client's own directory or plugin system. Each one installs
// https://mcp.corsair.dev/mcp, whose sign-in asks which path to use. Commands from
// corsairdev/agent-plugins' README; listings checked 2026-11-23.
const DIRECTORIES: {
	name: string;
	domain?: string;
	icon?: string;
	code?: string;
	steps: string[];
	href: string;
	label: string;
}[] = [
	{
		name: 'ChatGPT',
		domain: 'chatgpt.com',
		steps: [
			"Open corsair.dev in ChatGPT's plugin directory and install it.",
			'Connect it. Corsair asks you to sign in and pick which path ChatGPT uses.',
		],
		href: CHATGPT_LISTING_URL,
		label: 'corsair.dev in ChatGPT',
	},
	{
		name: 'Cursor',
		domain: 'cursor.com',
		steps: [
			'Open Corsair on cursor.directory and select Add to Cursor.',
			'The first time Cursor connects, it opens Corsair to sign in and pick a path.',
		],
		href: CURSOR_DIRECTORY_URL,
		label: 'Corsair on cursor.directory',
	},
	{
		name: 'Claude Code',
		domain: 'claude.com',
		code: 'claude plugin marketplace add corsairdev/agent-plugins\nclaude plugin install corsair@corsair',
		steps: [
			"Run `/mcp` in Claude Code to sign in and pick a path. The plugin also adds Corsair's skills.",
		],
		href: 'https://github.com/corsairdev/agent-plugins',
		label: 'corsairdev/agent-plugins',
	},
	{
		name: 'Hermes Agent',
		domain: 'nousresearch.com',
		code: 'hermes plugins install corsair\nhermes plugins enable corsair',
		steps: [
			"Then sign in: the plugin's README shows the `auth: oauth` entry and `hermes mcp login corsair`.",
		],
		href: 'https://hermes-agent.nousresearch.com/marketplace/corsair',
		label: 'Corsair in the Hermes plugin catalog',
	},
	{
		name: 'OpenClaw',
		icon: '/clients/openclaw.svg',
		code: 'openclaw plugins install clawhub:@corsairdev/corsair\nopenclaw plugins enable corsair',
		steps: ['Then open Settings → Plugins → corsair → Sign in.'],
		href: 'https://clawhub.ai/plugins/@corsairdev/corsair',
		label: 'Corsair on ClawHub',
	},
	{
		name: 'Gemini CLI',
		domain: 'gemini.google.com',
		code: 'gemini extensions install https://github.com/corsairdev/agent-plugins',
		steps: ['Run `/mcp auth corsair` in Gemini CLI to sign in.'],
		href: 'https://github.com/corsairdev/agent-plugins',
		label: 'corsairdev/agent-plugins',
	},
];

function Mark({ domain, icon }: { domain?: string; icon?: string }) {
	const src = icon ?? (domain ? `${APP_URL}/icon/${domain}` : null);
	if (!src) return null;
	return (
		<img
			src={src}
			alt=""
			width={22}
			height={22}
			loading="lazy"
			className="h-[22px] w-[22px] shrink-0 rounded-[4px]"
		/>
	);
}

function Command({ code, label }: { code: string; label?: string }) {
	return (
		<figure className="m-0 min-w-0 overflow-hidden border border-[#1c1c1c1a] bg-[#1c1c1c]">
			{label ? (
				<figcaption className="border-b border-white/10 px-3 py-1.5 font-[family-name:var(--landing-font-mono)] text-[11px] text-white/60">
					{label}
				</figcaption>
			) : null}
			<pre className="m-0 overflow-x-auto p-3 font-[family-name:var(--landing-font-mono)] text-[12px] leading-[1.6] text-[#f4f4f4]">
				<code>{code}</code>
			</pre>
		</figure>
	);
}

function CardHead({
	name,
	domain,
	icon,
	badge,
}: {
	name: string;
	domain?: string;
	icon?: string;
	badge?: string;
}) {
	return (
		<div className="flex items-center gap-2.5">
			<Mark domain={domain} icon={icon} />
			<H3>{name}</H3>
			{badge ? (
				<span className="ml-auto shrink-0 font-[family-name:var(--landing-font-mono)] text-[10px] uppercase tracking-[0.04em] text-[#1c1c1c66]">
					{badge}
				</span>
			) : null}
		</div>
	);
}

const stepText = 'text-[15px] leading-[1.6] text-[#1c1c1c99]';

function Guide({ client, guide }: { client: McpClient; guide: ClientGuide }) {
	return (
		<Card id={client.id}>
			<CardHead
				name={client.name}
				domain={client.domain}
				badge={AUTH[client.auth]}
			/>
			{guide.snippet ? (
				<Command
					code={guide.snippet.code}
					// Hub's install button (a deep link with the person's URL) isn't shown here, so drop the "Or" that follows it.
					label={guide.snippet.label.replace(/^Or (\w)/, (_, ch: string) =>
						ch.toUpperCase(),
					)}
				/>
			) : null}
			{guide.or ? (
				<p className={stepText}>
					Or <Inline text={guide.or} />
				</p>
			) : null}
			{guide.steps.length ? (
				<ol className="flex list-decimal flex-col gap-2 pl-5">
					{guide.steps.map((s) => (
						<li key={s.text} className={stepText}>
							<Inline text={s.text} />
							{s.copy?.map((v) => (
								<span key={v.label} className="mt-1 block break-all">
									{v.label}:{' '}
									<code className="font-[family-name:var(--landing-font-mono)] text-[0.9em] text-[#1c1c1c]">
										{v.value}
									</code>
								</span>
							))}
							{s.or ? (
								<>
									{' '}
									Or <Inline text={s.or} />
								</>
							) : null}
						</li>
					))}
				</ol>
			) : null}
			{guide.note ? (
				<Body className="text-sm md:text-sm">{guide.note}</Body>
			) : null}
		</Card>
	);
}

export default function ConnectPage() {
	return (
		<GatewayLayout>
			<JsonLd
				data={pageJsonLd({
					path: PATH,
					title: TITLE,
					description: DESCRIPTION,
					crumbs: [
						{ name: 'MCP gateway', path: '/mcp-gateway' },
						{ name: 'Connect', path: PATH },
					],
				})}
			/>

			<PageHero
				eyebrow={
					<>
						<a href="/mcp-gateway" className="hover:text-[#1c1c1c]">
							MCP gateway
						</a>{' '}
						/ Connect
					</>
				}
				title="Add your MCP URL to any AI agent"
				lede="Your MCP URL, such as https://yourname.lug.dev/work, works in every client below. Install Corsair from a client's own directory, or paste your URL into its config. After you claim your URL, Corsair Hub shows the same steps with your URL and key filled in."
				ctas={[
					{ label: 'Claim your URL', href: CLAIM_HREF },
					{ label: 'Already have one? Sign in', href: hubMeSignInUrl() },
				]}
				width="wide"
			>
				<nav aria-label="Clients" className="mt-8 flex flex-wrap gap-2">
					{AGENTS.map((m) => (
						<a
							key={m.id}
							href={`#${m.id}`}
							className="border border-[#1c1c1c1a] bg-white px-2.5 py-1 font-[family-name:var(--landing-font-mono)] text-xs text-[#1c1c1c99] no-underline transition-colors hover:text-[#1c1c1c]"
						>
							{m.name}
						</a>
					))}
				</nav>
			</PageHero>

			<Section
				id="directories"
				title="Install from a directory"
				lede="These install Corsair's MCP server, https://mcp.corsair.dev/mcp. When you sign in, Corsair asks which of your paths the client gets."
				width="wide"
			>
				<CardGrid columns={3}>
					{DIRECTORIES.map((d) => (
						<Card key={d.name}>
							<CardHead name={d.name} domain={d.domain} icon={d.icon} />
							{d.code ? <Command code={d.code} /> : null}
							<ol className="flex list-decimal flex-col gap-2 pl-5">
								{d.steps.map((s) => (
									<li key={s} className={stepText}>
										<Inline text={s} />
									</li>
								))}
							</ol>
							<a
								href={d.href}
								target="_blank"
								rel="noopener noreferrer"
								className={`mt-auto text-[15px] ${textLink}`}
							>
								{d.label}
								<span className="sr-only"> (opens in a new tab)</span>
							</a>
						</Card>
					))}
				</CardGrid>
			</Section>

			<Section
				id="paste"
				title="Paste your URL into any client"
				lede="Clients that sign in send you to Corsair, and you allow that one path. Clients that can't sign in send the path's API key in a header; it's on the path's page in Corsair Hub. A secret URL connects with neither, so treat it like a password."
				width="wide"
			>
				<CardGrid>
					{AGENTS.map((m) => (
						<Guide key={m.id} client={m} guide={m.guide(PLACEHOLDER)} />
					))}
				</CardGrid>
			</Section>

			<Section
				id="code"
				title="In your own code"
				lede="Agent frameworks connect with the path's API key, kept in an environment variable."
				width="wide"
			>
				<CardGrid>
					{CODE.map((m) => (
						<Guide key={m.id} client={m} guide={m.guide(PLACEHOLDER)} />
					))}
				</CardGrid>
			</Section>

			<EndCta
				title="One URL for every agent."
				ctas={[
					{ label: 'Claim your URL', href: CLAIM_HREF },
					{ label: 'How the gateway works', href: '/mcp-gateway' },
				]}
			/>
		</GatewayLayout>
	);
}
