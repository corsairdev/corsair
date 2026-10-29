import type { ReactNode } from 'react';

import { CopyableCodeSnippet } from '@/components/landing/copyable-code-snippet';
import type { IntegrationDetailData } from '@/lib/integration-page.types';
import {
	countToolsByRisk,
	integrationApprovalSummary,
	integrationAuthSummary,
} from '@/lib/integration-seo';
import {
	CURSOR_INSTALL_URL,
	hubMcpConnectUrl,
	MCP_DOCS_URL,
	MCP_URL,
} from '@/lib/site-links';

const CURSOR_CONFIG = `{
  "mcpServers": {
    "corsair": { "url": "${MCP_URL}" }
  }
}`;

// Clients whose step is a code block take a full row so the code stays readable.
const CLIENTS: { name: string; wide?: boolean; body: ReactNode }[] = [
	{
		name: 'Claude',
		body: (
			<>
				Open <strong>Customize → Connectors → Add custom connector</strong>,
				paste the address, then select <strong>Connect</strong>.
			</>
		),
	},
	{
		name: 'ChatGPT',
		body: (
			<>
				Add a custom MCP server with the address and choose{' '}
				<strong>OAuth</strong>. Personal plans get read tools only.
			</>
		),
	},
	{
		name: 'Cursor',
		wide: true,
		body: (
			<>
				<a
					href={CURSOR_INSTALL_URL}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-1 mb-3 flex w-fit items-center rounded-md bg-[#1c1c1c] px-3 py-1.5 text-[13px] font-medium text-white no-underline transition-colors hover:bg-[#333]"
				>
					Add to Cursor
				</a>
				Or add this to <code>~/.cursor/mcp.json</code>. Cursor opens Corsair to
				sign in the first time it connects.
				<pre className="mt-2 overflow-x-auto rounded-sm border border-[#1c1c1c1a] bg-[#fafafa] px-3 py-2 font-[family-name:var(--landing-font-mono)] text-[12px] leading-relaxed text-[#1c1c1c]">
					<code>{CURSOR_CONFIG}</code>
				</pre>
			</>
		),
	},
	{
		name: 'Claude Code',
		wide: true,
		body: (
			<>
				Run this, then run <code>/mcp</code> in Claude Code to sign in.
				<CopyableCodeSnippet
					code={`claude mcp add --transport http corsair ${MCP_URL}`}
					className="mt-2"
				/>
			</>
		),
	},
];

function Step({
	number,
	title,
	children,
}: {
	number: number;
	title: string;
	children: ReactNode;
}) {
	return (
		<li className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3">
			<span className="mt-0.5 flex size-7 items-center justify-center rounded-full border border-[#1c1c1c1a] bg-white font-[family-name:var(--landing-font-mono)] text-xs text-[#1c1c1c99]">
				{number}
			</span>
			<div className="min-w-0">
				<h3 className="text-base font-medium text-[#1c1c1c]">{title}</h3>
				<div className="mt-1.5 text-[15px] leading-relaxed text-[#1c1c1c99]">
					{children}
				</div>
			</div>
		</li>
	);
}

export function IntegrationMcpSetup({
	integration,
}: {
	integration: Pick<
		IntegrationDetailData,
		'id' | 'displayName' | 'authTypes' | 'operations'
	>;
}) {
	const { id, displayName } = integration;
	const risk = countToolsByRisk(integration.operations);

	return (
		<section className="pt-7 pb-4 md:pt-8 md:pb-5">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<h2 className="font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.06em] text-[#1c1c1c66]">
					Connect {displayName} to Claude, ChatGPT or Cursor
				</h2>

				<ol className="mt-6 space-y-7">
					<Step number={1} title={`Connect ${displayName} in Corsair`}>
						<p>
							{integrationAuthSummary(displayName, integration.authTypes)}{' '}
							<a
								href={hubMcpConnectUrl(id)}
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium text-[#4a38f5] no-underline hover:underline"
							>
								Connect {displayName}
							</a>
						</p>
						<p className="mt-2 text-sm">
							If your link lets the agent add apps, you can skip this: it gives
							you a sign-in link the first time it needs {displayName}. On a
							ChatGPT personal plan, connect {displayName} here first.
						</p>
					</Step>

					<Step number={2} title="Add Corsair's MCP server to your agent">
						<p>Every client uses the same address:</p>
						<CopyableCodeSnippet code={MCP_URL} className="mt-2 max-w-md" />
						<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
							{CLIENTS.map((client) => (
								<div
									key={client.name}
									className={`min-w-0 rounded-md border border-[#1c1c1c]/10 bg-white px-4 py-3 ${client.wide ? 'sm:col-span-2' : ''}`}
								>
									<p className="text-sm font-medium text-[#1c1c1c]">
										{client.name}
									</p>
									<div className="mt-1 text-sm leading-relaxed text-[#1c1c1c99]">
										{client.body}
									</div>
								</div>
							))}
						</div>
						<p className="mt-3 text-sm">
							Codex, Gemini CLI, VS Code, Zed and other clients with OAuth
							sign-in work the same way. Clients without it, such as GitHub
							Copilot&apos;s coding agent, use a link&apos;s own address and an
							API key.{' '}
							<a
								href={MCP_DOCS_URL}
								className="font-medium text-[#4a38f5] no-underline hover:underline"
							>
								Setup for every client
							</a>
						</p>
					</Step>

					<Step number={3} title="Sign in and choose what needs your approval">
						<p>
							Your client opens Corsair to sign in. Pick a link: the apps your
							agent can use and a mode that decides what it may do without
							asking. {integrationApprovalSummary(displayName, risk)}
						</p>
					</Step>
				</ol>
			</div>
		</section>
	);
}
