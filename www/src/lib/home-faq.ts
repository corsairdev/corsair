// The homepage FAQ. Also rendered into /index.md.

export const FAQ_ITEMS = [
	{
		id: 'what-is-it',
		question: 'What is an MCP URL?',
		answer:
			'One address, such as yourname.lug.dev/work, that you add to Claude, ChatGPT, Cursor, Codex or any MCP client. Behind it are the apps you connected to Corsair. The agent sees a short list of tools and looks up an app’s operations only when it needs them, so 700+ apps don’t fill its context window.',
		link: { href: '/mcp-gateway', label: 'How the MCP gateway works' },
	},
	{
		id: 'clients',
		question: 'Which agents does it work with?',
		answer:
			'Any client that takes a remote MCP URL: Claude, ChatGPT, Cursor, Claude Code, Codex, VS Code, Windsurf, Zed, OpenCode, Hermes, OpenClaw and more. ChatGPT, Cursor, Claude Code, Hermes and OpenClaw can also install Corsair from their own plugin directories.',
		link: { href: '/connect', label: 'Setup for every client' },
	},
	{
		id: 'api-keys',
		question: 'Does my agent ever see my API keys?',
		answer:
			'No. Corsair resolves credentials at call time. Your agent sees operation names and results only.',
	},
	{
		id: 'hosted-security',
		question: 'Is it safe to connect my Gmail and Slack?',
		answer:
			"Corsair runs on the open-source SDK and uses envelope encryption: every account's API keys, tokens and synced data are encrypted with their own key, and the keys that unlock them are held in AWS KMS and rotate automatically. If our database leaked, your keys and data would stay unreadable. One customer can't reach another's data, and every action your agent takes is checked against your path's mode.",
		link: { href: '/security', label: 'Learn more about security' },
	},
	{
		id: 'cost',
		question: 'What does it cost?',
		answer:
			"It's free for 10 connected accounts and 100 credits a month. Pro is $20 a month for 30 connections and 10,000 credits. Apps that run on Corsair's own key, such as Exa and Firecrawl, cost credits per call, and $5 buys 1,000 more.",
		link: { href: '/pricing', label: 'See the plans' },
	},
	{
		id: 'missing-integration',
		question: "What if I need an app you don't have?",
		answer:
			"Tell us and we'll add it. Every integration is open-source TypeScript, so you can also open a PR or scaffold a new plugin with one command.",
	},
	{
		id: 'developers',
		question: 'Can I build this into my own product?',
		answer:
			'Yes. The Corsair SDK is open source under Apache 2.0. It runs inside your app, your users connect their own accounts, and their tokens stay encrypted in your own database. Or call the same plugins over HTTP from Corsair Cloud.',
		link: { href: '/developers', label: 'Corsair for developers' },
	},
] as const;
