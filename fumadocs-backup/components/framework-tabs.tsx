'use client';

import type { ReactNode } from 'react';
import {
	Children,
	createContext,
	useContext,
	useState,
	useSyncExternalStore,
} from 'react';
import { getState, setState, subscribe } from '@/lib/quick-start-store';

const FrameworkContext = createContext<{
	active: string;
	setActive: (v: string) => void;
} | null>(null);

function AnthropicLogo() {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			style={{ flexShrink: 0 }}
		>
			<path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.603L16.744 20h-3.603L6.57 3.52z" />
		</svg>
	);
}

function OpenAILogo() {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			style={{ flexShrink: 0 }}
		>
			<path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.369 2.02-1.168a.076.076 0 0 1 .071 0l4.83 2.786a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.402-.676zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.602 1.5v2.999l-2.602 1.5-2.602-1.5z" />
		</svg>
	);
}

const FRAMEWORK_LOGOS: Record<string, () => ReactNode> = {
	'Anthropic SDK': AnthropicLogo,
	'Claude Agent SDK': AnthropicLogo,
	'OpenAI Agents': OpenAILogo,
};

function pmInstall(pm: string, pkg: string): string {
	if (pm === 'yarn') return `yarn add ${pkg}`;
	if (pm === 'bun') return `bun add ${pkg}`;
	return `${pm} install ${pkg}`;
}

function pmRun(pm: string, cmd: string): string {
	if (pm === 'npm') return `npx ${cmd}`;
	if (pm === 'yarn') return `yarn ${cmd}`;
	if (pm === 'bun') return `bunx ${cmd}`;
	return `pnpm ${cmd}`;
}

function buildFrameworkPrompt(framework: string, pm: string): string {
	const setupCmd = pmRun(pm, 'corsair setup');
	const runCmd = pmRun(pm, 'tsx agent.ts');

	if (framework === 'Anthropic SDK') {
		return `Set up a Corsair GitHub agent using the Anthropic SDK.

I already have:
- src/server/corsair.ts set up with the GitHub plugin
- The database migrated and GitHub token stored via \`${setupCmd}\`

Create agent.ts:
- Install: ${pmInstall(pm, '@corsair-dev/mcp @anthropic-ai/sdk')}
- Import AnthropicProvider from @corsair-dev/mcp, Anthropic from @anthropic-ai/sdk, and corsair from ./src/server/corsair
- Build tools: new AnthropicProvider().build({ corsair })
- Call client.beta.messages.toolRunner with model claude-sonnet-4-6, max_tokens 4096, the tools, and prompt: "Use Corsair. List my GitHub repos with the most open issues."
- Print any text blocks from the response
- Wrap everything in async function main() and call main().catch(console.error)

Run it with: ${runCmd}`;
	}

	if (framework === 'Claude Agent SDK') {
		return `Set up a Corsair GitHub agent using the Claude Agent SDK.

I already have:
- src/server/corsair.ts set up with the GitHub plugin
- The database migrated and GitHub token stored via \`${setupCmd}\`

Create agent.ts:
- Install: ${pmInstall(pm, '@corsair-dev/mcp @anthropic-ai/claude-agent-sdk')}
- Import ClaudeProvider from @corsair-dev/mcp, createSdkMcpServer and query from @anthropic-ai/claude-agent-sdk, and corsair from ./src/server/corsair
- Build tools: await new ClaudeProvider().build({ corsair })
- Wrap in MCP server: createSdkMcpServer({ name: 'corsair', tools })
- Call query with prompt "Use Corsair. List my GitHub repos with the most open issues." and options: { model: 'claude-opus-4-6', mcpServers: { corsair: server }, allowedTools: [{ type: 'mcp', serverName: 'corsair' }] }
- Stream the result and print any text events
- Wrap everything in async function main() and call main().catch(console.error)

Run it with: ${runCmd}`;
	}

	return `Set up a Corsair GitHub agent using the OpenAI Agents SDK.

I already have:
- src/server/corsair.ts set up with the GitHub plugin
- The database migrated and GitHub token stored via \`${setupCmd}\`

Create agent.ts:
- Install: ${pmInstall(pm, '@corsair-dev/mcp @openai/agents')}
- Import OpenAIAgentsProvider from @corsair-dev/mcp, Agent, run, tool from @openai/agents, and corsair from ./src/server/corsair
- Build tools: new OpenAIAgentsProvider().build({ corsair, tool })
- Create an Agent with name 'corsair-agent', model 'gpt-4.1', instructions to use list_operations, get_schema, and run_script tools, and the tools array
- Run with: run(agent, "Use Corsair. List my GitHub repos with the most open issues.")
- Log result.finalOutput
- Wrap everything in async function main() and call main().catch(console.error)

Run it with: ${runCmd}`;
}

interface FrameworkTabsProps {
	children: ReactNode;
	defaultValue?: string;
}

export function FrameworkTabs({ children, defaultValue }: FrameworkTabsProps) {
	const panels = Children.toArray(children).filter(
		(c): c is React.ReactElement<FrameworkPanelProps> =>
			typeof c === 'object' &&
			c !== null &&
			'props' in c &&
			'value' in (c as any).props,
	);

	const [active, setActive] = useState(
		defaultValue ?? (panels[0] as any)?.props?.value ?? '',
	);
	const [copied, setCopied] = useState(false);
	const { pm } = useSyncExternalStore(subscribe, getState, getState);

	function handleSelect(value: string) {
		setActive(value);
		setState({ framework: value });
	}

	function handleCopyPrompt() {
		const prompt = buildFrameworkPrompt(active, pm);
		navigator.clipboard.writeText(prompt);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<FrameworkContext.Provider value={{ active, setActive }}>
			<div className="flex flex-wrap items-center justify-between gap-2 mt-4 mb-0">
				<div className="flex flex-wrap gap-2">
					{panels.map((panel) => {
						const value = (panel as any).props.value as string;
						const isActive = active === value;
						const Logo = FRAMEWORK_LOGOS[value];
						return (
							<button
								key={value}
								onClick={() => handleSelect(value)}
								className={[
									'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap',
									isActive
										? 'border-fd-primary text-fd-foreground bg-fd-background shadow-sm'
										: 'border-fd-border text-fd-muted-foreground bg-fd-background hover:border-fd-foreground/30 hover:text-fd-foreground',
								].join(' ')}
							>
								{Logo && <Logo />}
								{value}
							</button>
						);
					})}
				</div>
			</div>
			{children}
		</FrameworkContext.Provider>
	);
}

interface FrameworkPanelProps {
	value: string;
	children: ReactNode;
}

export function FrameworkPanel({ value, children }: FrameworkPanelProps) {
	const ctx = useContext(FrameworkContext);
	if (!ctx || ctx.active !== value) return null;
	return <div>{children}</div>;
}
