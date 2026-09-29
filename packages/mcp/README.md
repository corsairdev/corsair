# @corsair-dev/mcp

MCP server and framework adapters for [Corsair](https://corsair.dev), the open-source integration layer for AI agents. Give any agent framework 200+ integrations as tools with a single adapter call.

[![npm](https://img.shields.io/npm/v/@corsair-dev/mcp)](https://www.npmjs.com/package/@corsair-dev/mcp)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue)](https://github.com/corsairdev/corsair/blob/main/LICENSE)
[![Discord](https://img.shields.io/badge/Discord-join-5865F2?logo=discord&logoColor=white)](https://discord.gg/uNgCP3mSzU)

Corsair handles the parts of an integration you would rather not maintain: OAuth, token refresh, webhook verification, and rate limits. Credentials stay encrypted in your own database. This package puts all of that behind the tool interface your agent framework already speaks.

## Install

```bash
npm install @corsair-dev/mcp
```

Install the framework you use alongside it. The Mastra quickstart below needs `npm install @mastra/core @ai-sdk/anthropic`. Each adapter treats its framework as an optional peer dependency.

## Quickstart

Build tools from a configured `corsair` instance and hand them to a Mastra agent:

```ts
import { Agent } from '@mastra/core/agent';
import { anthropic } from '@ai-sdk/anthropic';
import { MastraProvider } from '@corsair-dev/mcp';
import { corsair } from './corsair';

const provider = new MastraProvider();
const tools = await provider.build({ corsair });

const agent = new Agent({
    name: 'corsair-agent',
    model: anthropic('claude-sonnet-4-6'),
    instructions:
        'You have Corsair tools. Use list_operations to discover APIs, get_schema to read arguments, and run_script to execute.',
    tools: Object.fromEntries(tools.map((t) => [t.id, t])),
});

const response = await agent.generate('List all Slack channels.');
console.log(response.text);
```

Setting up the `corsair` instance is covered in the [setup guide](https://docs.corsair.dev/hub/setup).

## Adapters

Each adapter exposes Corsair's tools in the shape its framework expects, so there is no manual schema wiring. More frameworks are on the way.

| Adapter | Use case |
|---|---|
| [Anthropic SDK](https://docs.corsair.dev/mcp-adapters/anthropic-sdk) | Native tool use with Claude models |
| [Claude Agent SDK](https://docs.corsair.dev/mcp-adapters/claude-sdk) | In-process MCP with the Claude Agent SDK |
| [OpenAI Agents](https://docs.corsair.dev/mcp-adapters/openai) | OpenAI Agents SDK tools |
| [OpenAI](https://docs.corsair.dev/mcp-adapters/openai) | OpenAI function calling |
| [Vercel AI SDK](https://docs.corsair.dev/mcp-adapters/vercel-ai) | Tools for `useChat` and `streamText` |
| [Mastra](https://docs.corsair.dev/mcp-adapters/mastra) | Mastra agent tools |

Full list and options: [docs.corsair.dev/mcp-adapters](https://docs.corsair.dev/mcp-adapters/mcp-adapters).

## How it works

Every adapter exposes the same three tools, so the agent works the same way across 200+ integrations instead of reading a flat list of every endpoint:

| Tool | What it does |
|---|---|
| `list_operations` | Discover the available API endpoints |
| `get_schema` | Inspect the parameters for one endpoint |
| `run_script` | Execute a call with `corsair` in scope |

The agent calls `list_operations` to find what it can do, `get_schema` to learn the arguments, then `run_script` to run it. Add a plugin and its endpoints show up with no code change.

`run_script` evaluates the model's JavaScript in your process with the `corsair` instance in scope. It is not a sandbox, so keep the caller trusted, the same as any code your agent runs. Build the tools with `runOptions: { readonly: true }` to block write and destructive Corsair endpoints; note this restricts Corsair calls only, not other side effects in the script.

For coding agents over stdio (Claude Code, Cursor, Codex), see [Coding agents](https://docs.corsair.dev/mcp-adapters/claude-code).

## Links

- Docs: https://docs.corsair.dev
- Adapters: https://docs.corsair.dev/mcp-adapters/mcp-adapters
- Repository: https://github.com/corsairdev/corsair
- Discord: https://discord.gg/uNgCP3mSzU
- X: https://x.com/corsairdotdev

## License

Apache-2.0. See [LICENSE](https://github.com/corsairdev/corsair/blob/main/LICENSE).
