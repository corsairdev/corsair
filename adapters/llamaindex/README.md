# @corsair-dev/llamaindex

Corsair tools for [LlamaIndex.TS](https://developers.llamaindex.ai/typescript) — expose 200+ integrations (Slack, GitHub, Gmail, Linear, Stripe, …) to your agents, backed by **managed OAuth** and with **credentials that stay in your own database**.

Each Corsair operation becomes a LlamaIndex tool. Pass them straight to `agent({ tools })`.

## Install

```bash
npm install @corsair-dev/llamaindex @llamaindex/core corsair
# the agent runtime + an LLM binding:
npm install @llamaindex/workflow @llamaindex/openai
# plus a plugin per integration you use, e.g. Slack:
npm install @corsair-dev/slack
```

`@llamaindex/core` is a peer dependency.

## Usage

```ts
import { createCorsair } from 'corsair';
import { corsairTools } from '@corsair-dev/llamaindex';
import { slack } from '@corsair-dev/slack';
import { agent } from '@llamaindex/workflow';
import { openai } from '@llamaindex/openai';

const corsair = createCorsair({
	plugins: [slack({ authType: 'managed' })],
	database,
	kek: process.env.CORSAIR_KEK,
	hub: { projectApiKey: process.env.CORSAIR_API_KEY },
});

// One tool per Slack operation:
const tools = await corsairTools({ corsair, plugin: 'slack' });

// Route model calls through the Corsair LLM gateway (llm.corsair.dev).
const llm = openai({
	model: 'gpt-4.1-mini',
	additionalChatOptions: {
		baseURL: 'https://llm.corsair.dev/v1',
		apiKey: process.env.LITELLM_API_KEY,
	},
});

const slackAgent = agent({ tools, llm });
const response = await slackAgent.run('List the Slack channels.');
console.log(response.data);
```

## Choosing which tools

```ts
// A whole plugin (toolkit):
await corsairTools({ corsair, plugin: 'slack' });

// Specific operations:
await corsairTools({ corsair, operations: ['slack.api.channels.list', 'slack.api.messages.post'] });

// Every operation of every registered plugin (omit both):
await corsairTools({ corsair });
```

## Multi-tenancy

For a multi-tenant Corsair instance, pin the tenant whose stored credentials the
tools should use:

```ts
await corsairTools({ corsair, plugin: 'slack', tenantId: user.orgId });
```

Each tenant owns its own connections and credentials; single-tenant instances
ignore `tenantId`.

## Notes

- Tool names are the operation path with `.` replaced by `_`
  (`slack.api.channels.list` → `slack_api_channels_list`) so they satisfy the
  model's function-name constraint.
- Corsair is on Zod v4, which current `@llamaindex/core` accepts directly for a
  tool's `parameters` — no JSON Schema conversion.
- `@llamaindex/core` is npm-deprecated as a standalone package, but it remains
  the correct peer for LlamaIndex.TS tooling — the `llamaindex` meta-package
  itself depends on `@llamaindex/core@0.6.x`. There is no non-deprecated
  successor that exposes the same tool API.

## License

Apache-2.0
