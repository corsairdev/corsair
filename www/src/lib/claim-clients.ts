// The agents the last /start step offers. Copied from lug.dev (hub
// apps/lug/src/data/apps.ts). Ids and domains must match Hub's
// (hub apps/app/src/components/me/clients.ts): /me opens on `client=` and
// offers the rest of `clients=`. They differ from mcp-clients.ts, whose ids
// are the setup guides'.

export type ClaimClient = { id: string; name: string; domain: string };

export const CLAIM_CLIENTS: readonly ClaimClient[] = [
	{ id: 'claude', name: 'Claude', domain: 'claude.ai' },
	{ id: 'chatgpt', name: 'ChatGPT', domain: 'chatgpt.com' },
	{ id: 'cursor', name: 'Cursor', domain: 'cursor.com' },
	{ id: 'codex', name: 'Codex', domain: 'openai.com' },
	{ id: 'opencode', name: 'OpenCode', domain: 'opencode.ai' },
	{ id: 'windsurf', name: 'Windsurf', domain: 'windsurf.com' },
	{ id: 'vscode', name: 'VS Code', domain: 'code.visualstudio.com' },
	{ id: 'zed', name: 'Zed', domain: 'zed.dev' },
];

const FIRST = CLAIM_CLIENTS[0] as ClaimClient;

export const claimClientById = (id: string): ClaimClient =>
	CLAIM_CLIENTS.find((c) => c.id === id) ?? FIRST;
