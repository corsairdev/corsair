// Copied from Corsair Hub (explorer/src/mcp-clients.ts at db464adbd), which uses the
// same guides for its setup screens. Change both together until they share one source.
// Snippets follow each client's docs (checked 2026-10-22; ChatGPT's steps 2026-11-23). A client that
// documents neither a header nor sign-in gets the secret URL.
// Codex CLI: learn.chatgpt.com/docs/extend/mcp?surface=cli (checked 2026-10-23)
// opencode: opencode.ai/docs/mcp-servers (checked 2026-10-23)
// Kiro: kiro.dev/docs/mcp/configuration (checked 2026-10-23)
// Hermes Agent: hermes-agent.nousresearch.com/docs/user-guide/features/mcp (checked 2026-10-23)
// Amp: ampcode.com/docs/customize/mcp (checked 2026-10-23)
// Vercel AI SDK: ai-sdk.dev/docs/ai-sdk-core/mcp-tools (checked 2026-10-23)
// OpenAI Agents SDK: openai.github.io/openai-agents-js/guides/mcp (checked 2026-10-23)
// Mastra: mastra.ai/docs/mcp/overview (checked 2026-10-23)

export type ClientLink = {
	shortUrl: string | null;
	secretUrl: string;
	/** Only while it is still on hand, just after minting. */
	apiKey: string | null;
};

export type CopyValue = { label: string; value: string; secret?: boolean };

export type GuideStep = { text: string; copy?: CopyValue[]; or?: string };

export type ClientGuide = {
	snippet?: { label: string; code: string };
	install?: { label: string; href: string };
	/** An alternative to the snippet itself. */
	or?: string;
	steps: GuideStep[];
	note?: string;
};

export type McpClient = {
	id: string;
	name: string;
	domain: string;
	/** Marks a terminal client, so it reads apart from its maker's app. */
	terminal?: boolean;
	/** Other names search should match, such as the maker. */
	aliases?: string[];
	/** Clients from one maker share a tile; `variant` names this one inside it. */
	family?: { id: string; name: string; variant: string };
	auth: 'sign-in' | 'key' | 'both' | 'secret-url';
	guide: (link: ClientLink) => ClientGuide;
};

const KEY_PLACEHOLDER = '<your API key>';
const keyOf = (link: ClientLink) => link.apiKey ?? KEY_PLACEHOLDER;
const urlOf = (link: ClientLink) => link.shortUrl ?? link.secretUrl;
const needsKey = (link: ClientLink) => link.shortUrl !== null;

/**
 * Whether this client's own steps use the API key. A "both" client counts: its first snippet
 * carries the key, and signing in is the alternative written under it.
 */
export function clientNeedsKey(
	client: McpClient,
	link: Pick<ClientLink, 'shortUrl'>,
) {
	return (
		link.shortUrl !== null && (client.auth === 'key' || client.auth === 'both')
	);
}

const json = (value: unknown) => JSON.stringify(value, null, 2);

function headers(link: ClientLink) {
	return needsKey(link)
		? { headers: { Authorization: `Bearer ${keyOf(link)}` } }
		: {};
}

function base64(value: string) {
	if (typeof Buffer !== 'undefined')
		return Buffer.from(value).toString('base64');
	return btoa(unescape(encodeURIComponent(value)));
}

const ENV_KEY = 'CORSAIR_API_KEY';
const envKeyStep = (link: ClientLink): GuideStep[] =>
	needsKey(link)
		? [
				{
					text: 'Set the key in your environment.',
					copy: [
						{ label: 'Name', value: ENV_KEY },
						{ label: 'Value', value: keyOf(link), secret: true },
					],
				},
			]
		: [];
// Generated TypeScript reads the key from the environment rather than inlining it.
const tsHeaders = (link: ClientLink) =>
	needsKey(link)
		? `headers: { Authorization: \`Bearer \${process.env.${ENV_KEY}}\` }`
		: null;

const SIGN_IN = "You'll be sent to Corsair to sign in and allow this one link.";
const NO_SIGN_IN = 'It connects with no sign-in.';
const NO_HEADER = 'No header is needed.';

const headerCopy = (link: ClientLink): CopyValue => ({
	label: 'Header',
	value: `Authorization: Bearer ${keyOf(link)}`,
	secret: true,
});

export const MCP_CLIENTS: McpClient[] = [
	{
		id: 'claude-code',
		family: { id: 'claude', name: 'Claude', variant: 'Code' },
		name: 'Claude Code',
		domain: 'claude.com',
		terminal: true,
		aliases: ['anthropic'],
		auth: 'both',
		guide: (link) => ({
			snippet: {
				label: 'Run in a terminal',
				code: needsKey(link)
					? `claude mcp add --transport http corsair ${urlOf(link)} --header "Authorization: Bearer ${keyOf(link)}"`
					: `claude mcp add --transport http corsair ${urlOf(link)}`,
			},
			or: needsKey(link)
				? 'leave off `--header`, then run `/mcp` in Claude Code to sign in.'
				: undefined,
			steps: [
				{ text: 'Add `--scope user` to have it in every project.' },
				...(needsKey(link)
					? []
					: [{ text: 'Run `/mcp` in Claude Code to check it connected.' }]),
			],
		}),
	},
	{
		id: 'cursor',
		name: 'Cursor',
		domain: 'cursor.com',
		auth: 'both',
		guide: (link) => {
			const server = { url: urlOf(link) };
			return {
				install: {
					label: 'Add to Cursor',
					href: `cursor://anysphere.cursor-deeplink/mcp/install?name=corsair&config=${encodeURIComponent(base64(JSON.stringify(server)))}`,
				},
				snippet: {
					label: 'Or add to ~/.cursor/mcp.json',
					code: json({ mcpServers: { corsair: server } }),
				},
				steps: [],
			};
		},
	},
	{
		id: 'claude',
		family: { id: 'claude', name: 'Claude', variant: 'App' },
		name: 'Claude app',
		domain: 'claude.ai',
		aliases: ['anthropic'],
		auth: 'sign-in',
		guide: (link) => ({
			snippet: { label: 'Server URL', code: urlOf(link) },
			steps: [
				{
					text: 'In Claude, open Customize → Connectors → Add custom connector.',
				},
				{ text: 'Name it Corsair, paste the URL, and add it.' },
				...(needsKey(link) ? [{ text: SIGN_IN }] : []),
			],
			note: needsKey(link)
				? 'On a Team or Enterprise plan, an owner adds connectors under Organization settings.'
				: `${NO_SIGN_IN} On a Team or Enterprise plan, an owner adds connectors under Organization settings.`,
		}),
	},
	{
		id: 'chatgpt',
		name: 'ChatGPT',
		domain: 'chatgpt.com',
		aliases: ['openai'],
		auth: 'sign-in',
		guide: (link) => ({
			snippet: { label: 'MCP server URL', code: urlOf(link) },
			steps: [
				{
					text: 'In ChatGPT, open Plugins, select +, then Add custom MCP server, and paste the URL.',
				},
				{
					text: needsKey(link)
						? `Choose OAuth. ${SIGN_IN}`
						: 'Choose no authentication.',
				},
			],
		}),
	},
	{
		id: 'vscode',
		name: 'VS Code',
		domain: 'code.visualstudio.com',
		aliases: ['microsoft', 'copilot'],
		auth: 'both',
		guide: (link) => ({
			snippet: {
				label: 'Add to .vscode/mcp.json',
				code: json({
					servers: {
						corsair: { type: 'http', url: urlOf(link), ...headers(link) },
					},
				}),
			},
			or: 'run “MCP: Add Server” → HTTP and paste the URL. VS Code signs you in.',
			steps: [],
		}),
	},
	{
		id: 'copilot-cli',
		family: { id: 'copilot', name: 'GitHub Copilot', variant: 'CLI' },
		name: 'GitHub Copilot CLI',
		domain: 'github.com',
		terminal: true,
		auth: 'key',
		guide: (link) => ({
			snippet: {
				label: 'Run in a terminal',
				code: needsKey(link)
					? `copilot mcp add --transport http corsair ${urlOf(link)} --header "Authorization: Bearer ${keyOf(link)}"`
					: `copilot mcp add --transport http corsair ${urlOf(link)}`,
			},
			steps: [],
		}),
	},
	{
		id: 'copilot-agent',
		family: { id: 'copilot', name: 'GitHub Copilot', variant: 'Agent' },
		name: 'Copilot coding agent',
		domain: 'github.com',
		auth: 'key',
		guide: (link) => ({
			snippet: {
				label: 'Repository → Settings → Copilot → MCP configuration',
				code: json({
					mcpServers: {
						corsair: {
							type: 'http',
							url: urlOf(link),
							...(needsKey(link)
								? {
										headers: {
											Authorization: 'Bearer $COPILOT_MCP_CORSAIR_KEY',
										},
									}
								: {}),
							tools: ['*'],
						},
					},
				}),
			},
			steps: needsKey(link)
				? [
						{
							text: 'Save the API key as an environment secret.',
							copy: [
								{ label: 'Name', value: 'COPILOT_MCP_CORSAIR_KEY' },
								{ label: 'Value', value: keyOf(link), secret: true },
							],
						},
					]
				: [],
			note: needsKey(link)
				? "The coding agent can't sign in, so it always needs the key."
				: undefined,
		}),
	},
	{
		id: 'windsurf',
		name: 'Windsurf',
		domain: 'windsurf.com',
		aliases: ['codeium'],
		auth: 'key',
		guide: (link) => ({
			snippet: {
				label: 'Add to mcp_config.json (Cascade → MCPs)',
				code: json({
					mcpServers: { corsair: { serverUrl: urlOf(link), ...headers(link) } },
				}),
			},
			steps: [],
		}),
	},
	{
		id: 'zed',
		name: 'Zed',
		domain: 'zed.dev',
		auth: 'both',
		guide: (link) => ({
			snippet: {
				label: 'Add to Zed settings',
				code: json({
					context_servers: { corsair: { url: urlOf(link), ...headers(link) } },
				}),
			},
			or: needsKey(link)
				? 'leave out `headers` and Zed signs you in.'
				: undefined,
			steps: [],
		}),
	},
	{
		id: 'gemini',
		name: 'Gemini CLI',
		domain: 'gemini.google.com',
		terminal: true,
		aliases: ['google'],
		auth: 'both',
		guide: (link) => ({
			snippet: {
				label: 'Run in a terminal',
				code: needsKey(link)
					? `gemini mcp add --transport http --header "Authorization: Bearer ${keyOf(link)}" corsair ${urlOf(link)}`
					: `gemini mcp add --transport http corsair ${urlOf(link)}`,
			},
			or: needsKey(link)
				? 'leave off `--header` and run `/mcp auth corsair` to sign in.'
				: undefined,
			steps: [],
		}),
	},
	{
		id: 'cline',
		name: 'Cline',
		domain: 'cline.bot',
		auth: 'key',
		guide: (link) => ({
			snippet: {
				label: 'MCP Servers → Remote Servers → edit config',
				code: json({
					mcpServers: {
						corsair: {
							type: 'streamableHttp',
							url: urlOf(link),
							...headers(link),
						},
					},
				}),
			},
			steps: [],
		}),
	},
	{
		id: 'roo',
		name: 'Roo Code',
		domain: 'roocode.com',
		auth: 'key',
		guide: (link) => ({
			snippet: {
				label: "Add to Roo Code's MCP settings",
				code: json({
					mcpServers: {
						corsair: {
							type: 'streamable-http',
							url: urlOf(link),
							...headers(link),
						},
					},
				}),
			},
			steps: [],
		}),
	},
	{
		id: 'goose',
		name: 'Goose',
		domain: 'block.xyz',
		aliases: ['block'],
		auth: 'sign-in',
		guide: (link) => ({
			snippet: { label: 'Server URL', code: urlOf(link) },
			steps: [
				{
					text: 'Run `goose configure` → Add Extension → Remote Extension (Streamable HTTP).',
					or: 'in the app, open Extensions → Add custom extension.',
				},
				...(needsKey(link) ? [{ text: SIGN_IN }] : []),
			],
			note: needsKey(link) ? undefined : NO_SIGN_IN,
		}),
	},
	{
		id: 'librechat',
		name: 'LibreChat',
		domain: 'librechat.ai',
		auth: 'both',
		guide: (link) => ({
			snippet: {
				label: 'Add to librechat.yaml',
				code: [
					'mcpServers:',
					'  corsair:',
					'    type: streamable-http',
					`    url: ${urlOf(link)}`,
					...(needsKey(link)
						? ['    headers:', `      Authorization: "Bearer ${keyOf(link)}"`]
						: []),
				].join('\n'),
			},
			steps: [{ text: 'Restart LibreChat to load it.' }],
		}),
	},
	{
		id: 'lmstudio',
		name: 'LM Studio',
		domain: 'lmstudio.ai',
		auth: 'key',
		guide: (link) => ({
			snippet: {
				label: 'Program → Install → Edit mcp.json',
				code: json({
					mcpServers: { corsair: { url: urlOf(link), ...headers(link) } },
				}),
			},
			steps: [],
			note: 'Needs LM Studio 0.3.17 or later.',
		}),
	},
	{
		id: 'amazonq',
		name: 'Amazon Q Developer',
		domain: 'aws.amazon.com',
		aliases: ['aws'],
		auth: 'both',
		guide: (link) => ({
			snippet: { label: 'Server URL', code: urlOf(link) },
			steps: [
				{
					text: 'In the Amazon Q panel, open the MCP configuration and add an http server with this URL.',
				},
				...(needsKey(link)
					? [
							{
								text: 'Add the header.',
								copy: [headerCopy(link)],
								or: 'leave it out and sign in when the browser opens.',
							},
						]
					: []),
			],
			note: needsKey(link) ? undefined : NO_HEADER,
		}),
	},
	{
		id: 'raycast',
		name: 'Raycast',
		domain: 'raycast.com',
		auth: 'both',
		guide: (link) => ({
			snippet: { label: 'Server URL', code: urlOf(link) },
			steps: [
				{ text: 'Run the Install MCP Server command and paste the URL.' },
				...(needsKey(link)
					? [
							{
								text: 'Add the HTTP header.',
								copy: [headerCopy(link)],
								or: 'pick OAuth → Dynamic and sign in.',
							},
						]
					: []),
			],
			note: needsKey(link) ? undefined : NO_HEADER,
		}),
	},
	{
		id: 'warp',
		name: 'Warp',
		domain: 'warp.dev',
		auth: 'both',
		guide: (link) => ({
			snippet: {
				label: 'Settings → Agents → MCP servers → Add',
				code: json({ corsair: { url: urlOf(link), ...headers(link) } }),
			},
			steps: [],
		}),
	},
	{
		id: 'continue',
		name: 'Continue',
		domain: 'continue.dev',
		auth: 'key',
		guide: (link) => ({
			snippet: { label: 'Server URL', code: urlOf(link) },
			steps: [
				{
					text: 'Add a streamable-http MCP server in your Continue config with this URL.',
				},
				...(needsKey(link)
					? [
							{
								text: 'Send the key in `requestOptions.headers`.',
								copy: [
									{
										label: 'Authorization',
										value: `Bearer ${keyOf(link)}`,
										secret: true,
									},
								],
							},
						]
					: []),
			],
			note: needsKey(link) ? undefined : NO_HEADER,
		}),
	},
	{
		id: 'jetbrains',
		name: 'JetBrains AI Assistant',
		domain: 'jetbrains.com',
		aliases: ['intellij', 'pycharm', 'webstorm'],
		auth: 'secret-url',
		guide: (link) => ({
			snippet: { label: 'Secret URL', code: link.secretUrl },
			steps: [
				{
					text: 'In the IDE, open Settings → Tools → AI Assistant → Model Context Protocol → Add → HTTP and paste the URL.',
				},
			],
			note: "JetBrains doesn't document custom headers or sign-in, so use the secret URL. Treat it like a password.",
		}),
	},
	{
		id: 'cherry',
		name: 'Cherry Studio',
		domain: 'cherry-ai.com',
		auth: 'secret-url',
		guide: (link) => ({
			snippet: { label: 'Secret URL', code: link.secretUrl },
			steps: [
				{
					text: 'In Cherry Studio, open Settings → MCP → Add server → Streamable HTTP and paste the URL.',
				},
			],
			note: "Cherry Studio's own docs don't cover headers or sign-in, so use the secret URL. Treat it like a password.",
		}),
	},
	{
		id: 'codex',
		name: 'Codex CLI',
		domain: 'openai.com',
		terminal: true,
		aliases: ['openai'],
		auth: 'both',
		guide: (link) =>
			needsKey(link)
				? {
						snippet: {
							label: 'Add to ~/.codex/config.toml',
							code: [
								'[mcp_servers.corsair]',
								`url = "${urlOf(link)}"`,
								`http_headers = { "Authorization" = "Bearer ${keyOf(link)}" }`,
							].join('\n'),
						},
						or: `run \`codex mcp add corsair --url ${urlOf(link)}\`, then \`codex mcp login corsair\` to sign in.`,
						steps: [],
					}
				: {
						snippet: {
							label: 'Run in a terminal',
							code: `codex mcp add corsair --url ${urlOf(link)}`,
						},
						steps: [],
					},
	},
	{
		id: 'opencode',
		name: 'opencode',
		domain: 'opencode.ai',
		terminal: true,
		aliases: ['sst'],
		auth: 'both',
		guide: (link) => ({
			snippet: {
				label: 'Add to opencode.json',
				code: json({
					$schema: 'https://opencode.ai/config.json',
					mcp: {
						corsair: {
							type: 'remote',
							url: urlOf(link),
							...(needsKey(link) ? { oauth: false, ...headers(link) } : {}),
						},
					},
				}),
			},
			or: needsKey(link)
				? 'leave out `oauth` and `headers`, then run `opencode mcp auth corsair` to sign in.'
				: undefined,
			steps: [],
		}),
	},
	{
		id: 'kiro',
		name: 'Kiro',
		domain: 'kiro.dev',
		aliases: ['aws', 'amazon'],
		auth: 'both',
		guide: (link) => ({
			snippet: {
				label: 'Add to ~/.kiro/settings/mcp.json',
				code: json({
					mcpServers: { corsair: { url: urlOf(link), ...headers(link) } },
				}),
			},
			or: needsKey(link)
				? 'leave out `headers` and Kiro signs you in.'
				: undefined,
			steps: [],
		}),
	},
	{
		id: 'hermes',
		name: 'Hermes Agent',
		domain: 'nousresearch.com',
		terminal: true,
		aliases: ['nous research'],
		auth: 'both',
		guide: (link) => ({
			snippet: {
				label: 'Add to ~/.hermes/config.yaml',
				code: [
					'mcp_servers:',
					'  corsair:',
					`    url: "${urlOf(link)}"`,
					...(needsKey(link)
						? ['    headers:', `      Authorization: "Bearer ${keyOf(link)}"`]
						: []),
				].join('\n'),
			},
			or: needsKey(link)
				? 'swap `headers` for `auth: oauth` and run `hermes mcp login corsair` to sign in.'
				: undefined,
			steps: [],
		}),
	},
	{
		id: 'amp',
		name: 'Amp',
		domain: 'ampcode.com',
		aliases: ['sourcegraph'],
		auth: 'both',
		guide: (link) => ({
			snippet: {
				label: "Add to Amp's settings.json",
				code: json({
					'amp.mcpServers': { corsair: { url: urlOf(link), ...headers(link) } },
				}),
			},
			or: needsKey(link)
				? 'leave out `headers` and Amp signs you in when it starts.'
				: undefined,
			steps: [],
		}),
	},
	{
		id: 'ai-sdk',
		name: 'Vercel AI SDK',
		domain: 'vercel.com',
		aliases: ['ai sdk', 'next.js'],
		auth: 'key',
		guide: (link) => ({
			snippet: {
				label: 'In your code',
				code: [
					'import { createMCPClient } from "@ai-sdk/mcp";',
					'',
					'const corsair = await createMCPClient({',
					'  transport: {',
					'    type: "http",',
					`    url: "${urlOf(link)}",`,
					...(tsHeaders(link) ? [`    ${tsHeaders(link)},`] : []),
					'  },',
					'});',
					'const tools = await corsair.tools();',
				].join('\n'),
			},
			steps: envKeyStep(link),
		}),
	},
	{
		id: 'openai-agents',
		name: 'OpenAI Agents SDK',
		domain: 'openai.com',
		aliases: ['openai'],
		auth: 'key',
		guide: (link) => ({
			snippet: {
				label: 'In your code',
				code: [
					'import { Agent, MCPServerStreamableHttp } from "@openai/agents";',
					'',
					'const corsair = new MCPServerStreamableHttp({',
					'  name: "corsair",',
					`  url: "${urlOf(link)}",`,
					...(tsHeaders(link)
						? [`  requestInit: { ${tsHeaders(link)} },`]
						: []),
					'});',
					'await corsair.connect();',
					'const agent = new Agent({ name: "Assistant", mcpServers: [corsair] });',
				].join('\n'),
			},
			steps: envKeyStep(link),
		}),
	},
	{
		id: 'mastra',
		name: 'Mastra',
		domain: 'mastra.ai',
		auth: 'key',
		guide: (link) => ({
			snippet: {
				label: 'In your code',
				code: [
					'import { MCPClient } from "@mastra/mcp";',
					'',
					'const corsair = new MCPClient({',
					'  servers: {',
					'    corsair: {',
					`      url: new URL("${urlOf(link)}"),`,
					...(tsHeaders(link)
						? [`      requestInit: { ${tsHeaders(link)} },`]
						: []),
					'    },',
					'  },',
					'});',
					'const tools = await corsair.listTools();',
				].join('\n'),
			},
			steps: envKeyStep(link),
		}),
	},
];

/** The six lug.dev offers first, so the first-run step shows what they just saw there. */
export const COMMON_CLIENTS = [
	'claude-code',
	'claude',
	'chatgpt',
	'cursor',
	'codex',
	'opencode',
	'windsurf',
];

export const FEATURED_CLIENTS = [
	'claude',
	'claude-code',
	'chatgpt',
	'cursor',
	'opencode',
	'hermes',
	'codex',
	'vscode',
	'windsurf',
	'gemini',
	'kiro',
	'copilot-agent',
	'zed',
	'cline',
	'amp',
	'goose',
	'mastra',
];

export const familyOf = (client: McpClient) => client.family?.id ?? client.id;
// A shared tile wears the maker's plain mark, not a terminal badge.
export const faceOf = (client: McpClient) =>
	MCP_CLIENTS.find((c) => familyOf(c) === familyOf(client) && !c.terminal) ??
	client;

const norm = (value: string) =>
	value
		.toLowerCase()
		.replace(/[-_.\u2026]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

/** The client a reported sign-in name belongs to: by name, alias or maker, ignoring case and a "(project)" suffix. */
export function clientForName(name: string | null | undefined) {
	const n = norm((name ?? '').replace(/\s*\(.*\)\s*$/, ''));
	if (!n) return undefined;
	const hit = (x: string | undefined) =>
		x !== undefined && (n === norm(x) || n.startsWith(`${norm(x)} `));
	const found = MCP_CLIENTS.find(
		(c) => hit(c.name) || c.aliases?.some(hit) || hit(c.family?.name),
	);
	return found && faceOf(found);
}
