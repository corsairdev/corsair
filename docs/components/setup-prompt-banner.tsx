'use client';

import { useState, useSyncExternalStore } from 'react';
import { getState, subscribe } from '@/lib/quick-start-store';

const MIGRATION_SQL_SQLITE = `CREATE TABLE IF NOT EXISTS corsair_integrations (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    name TEXT NOT NULL,
    config TEXT NOT NULL DEFAULT '{}',
    dek TEXT NULL
);
CREATE TABLE IF NOT EXISTS corsair_accounts (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    tenant_id TEXT NOT NULL,
    integration_id TEXT NOT NULL,
    config TEXT NOT NULL DEFAULT '{}',
    dek TEXT NULL,
    FOREIGN KEY (integration_id) REFERENCES corsair_integrations(id)
);
CREATE TABLE IF NOT EXISTS corsair_entities (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    account_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    version TEXT NOT NULL,
    data TEXT NOT NULL DEFAULT '{}',
    FOREIGN KEY (account_id) REFERENCES corsair_accounts(id)
);
CREATE TABLE IF NOT EXISTS corsair_events (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    account_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload TEXT NOT NULL DEFAULT '{}',
    status TEXT,
    FOREIGN KEY (account_id) REFERENCES corsair_accounts(id)
);
CREATE TABLE IF NOT EXISTS corsair_permissions (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    token TEXT NOT NULL,
    plugin TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    args TEXT NOT NULL,
    tenant_id TEXT NOT NULL DEFAULT 'default',
    status TEXT NOT NULL DEFAULT 'pending',
    expires_at TEXT NOT NULL,
    error TEXT NULL
);`;

const MIGRATION_SQL_PG = `CREATE TABLE IF NOT EXISTS corsair_integrations (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name TEXT NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    dek TEXT NULL
);
CREATE TABLE IF NOT EXISTS corsair_accounts (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tenant_id TEXT NOT NULL,
    integration_id TEXT NOT NULL REFERENCES corsair_integrations(id),
    config JSONB NOT NULL DEFAULT '{}',
    dek TEXT NULL
);
CREATE TABLE IF NOT EXISTS corsair_entities (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    account_id TEXT NOT NULL REFERENCES corsair_accounts(id),
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    version TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS corsair_events (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    account_id TEXT NOT NULL REFERENCES corsair_accounts(id),
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    status TEXT
);
CREATE TABLE IF NOT EXISTS corsair_permissions (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    token TEXT NOT NULL,
    plugin TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    args TEXT NOT NULL,
    tenant_id TEXT NOT NULL DEFAULT 'default',
    status TEXT NOT NULL DEFAULT 'pending',
    expires_at TEXT NOT NULL,
    error TEXT NULL
);`;

function buildPrompt(db: string, framework: string): string {
    const isSQLite = db === 'SQLite';

    const dbInstall = isSQLite
        ? `pnpm install better-sqlite3\npnpm install --save-dev @types/better-sqlite3`
        : `pnpm install pg\npnpm install --save-dev @types/pg`;

    const migrationCmd = isSQLite
        ? `sqlite3 corsair.db < migration.sql`
        : `psql $DATABASE_URL -f migration.sql`;

    const corsairTs = isSQLite
        ? `import Database from 'better-sqlite3';
import { createCorsair, github } from 'corsair';

const db = new Database('corsair.db');

export const corsair = createCorsair({
    plugins: [github()],
    database: db,
    kek: process.env.CORSAIR_KEK!,
});`
        : `import { Pool } from 'pg';
import { createCorsair, github } from 'corsair';

const db = new Pool({ connectionString: process.env.DATABASE_URL });

export const corsair = createCorsair({
    plugins: [github()],
    database: db,
    kek: process.env.CORSAIR_KEK!,
});`;

    const envVars = isSQLite
        ? `CORSAIR_KEK="<your-generated-kek>"\nGITHUB_TOKEN="ghp_your_token_here"`
        : `CORSAIR_KEK="<your-generated-kek>"\nDATABASE_URL="postgres://..."\nGITHUB_TOKEN="ghp_your_token_here"`;

    const agentSetup =
        framework === 'Anthropic SDK'
            ? `pnpm install @corsair-dev/mcp @anthropic-ai/sdk

Create agent.ts:

import Anthropic from '@anthropic-ai/sdk';
import { AnthropicProvider } from '@corsair-dev/mcp';
import { corsair } from './corsair';

async function main() {
    const provider = new AnthropicProvider();
    const tools = provider.build({ corsair });
    const client = new Anthropic();

    const message = await client.beta.messages.toolRunner({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        tools,
        messages: [{ role: 'user', content: 'List my GitHub repos with the most open issues.' }],
    });

    for (const block of message.content) {
        if (block.type === 'text') console.log(block.text);
    }
}

main().catch(console.error);`
            : framework === 'Claude Agent SDK'
              ? `pnpm install @corsair-dev/mcp @anthropic-ai/claude-agent-sdk

Create agent.ts:

import { createSdkMcpServer, query } from '@anthropic-ai/claude-agent-sdk';
import { ClaudeProvider } from '@corsair-dev/mcp';
import { corsair } from './corsair';

async function main() {
    const provider = new ClaudeProvider();
    const tools = await provider.build({ corsair });
    const server = createSdkMcpServer({ name: 'corsair', tools });

    const stream = query({
        prompt: 'List my GitHub repos with the most open issues.',
        options: { model: 'claude-opus-4-6', mcpServers: { corsair: server } },
    });

    for await (const event of stream) {
        if ('result' in event) process.stdout.write(event.result);
    }
}

main().catch(console.error);`
              : `pnpm install @corsair-dev/mcp @openai/agents

Create agent.ts:

import { OpenAIAgentsProvider } from '@corsair-dev/mcp';
import { Agent, run, tool } from '@openai/agents';
import { corsair } from './corsair';

async function main() {
    const provider = new OpenAIAgentsProvider();
    const tools = provider.build({ corsair, tool });

    const agent = new Agent({
        name: 'corsair-agent',
        model: 'gpt-4.1',
        instructions: 'You have access to Corsair tools. Use list_operations to discover available APIs, get_schema to understand arguments, and run_script to execute them.',
        tools,
    });

    const result = await run(agent, 'List my GitHub repos with the most open issues.');
    console.log(result.finalOutput);
}

main().catch(console.error);`;

    return `Set up Corsair from scratch with ${db} and ${framework}, then run a GitHub agent.

## 1. Install
pnpm install corsair
${dbInstall}

## 2. Generate a KEK
Run and copy the output:
openssl rand -base64 32

## 3. Add to .env
${envVars}

## 4. Run the database migration
Save as migration.sql:

${isSQLite ? MIGRATION_SQL_SQLITE : MIGRATION_SQL_PG}

Then run:
${migrationCmd}

## 5. Create corsair.ts
${corsairTs}

## 6. Store your GitHub token and run setup
Go to GitHub → Settings → Developer settings → Personal access tokens (classic).
Generate a token with scopes: repo, read:org, read:user.
Add GITHUB_TOKEN to .env, then run:

npx corsair setup --github api_key=$GITHUB_TOKEN --backfill

## 7. Create the agent (${framework})
${agentSetup}

## Run it
npx tsx agent.ts`;
}

export function SetupPromptBanner() {
    const { db, framework } = useSyncExternalStore(subscribe, getState, getState);
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        navigator.clipboard.writeText(buildPrompt(db, framework));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="flex items-center justify-between mb-6" style={{ margin: '0 0 1.5rem 0' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0 }}>Setup</div>
            <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-fd-primary text-fd-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
                {copied ? (
                    <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                        Copy prompt
                    </>
                )}
            </button>
        </div>
    );
}
