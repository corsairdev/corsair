# @corsair-dev/langchain

Corsair tools for [LangChain.js](https://docs.langchain.com/oss/javascript) / LangGraph — expose 200+ integrations (Slack, GitHub, Gmail, Linear, Stripe, …) to your agents, backed by **managed OAuth** and with **credentials that stay in your own database**.

Each Corsair operation becomes a LangChain tool. Pass them straight to `createAgent({ tools })` or `model.bindTools(...)`.

## Install

```bash
npm install @corsair-dev/langchain @langchain/core corsair
# plus a plugin per integration you use, e.g. Slack:
npm install @corsair-dev/slack
```

`@langchain/core` is a peer dependency.

## Usage

```ts
import { createCorsair } from 'corsair';
import { corsairTools } from '@corsair-dev/langchain';
import { slack } from '@corsair-dev/slack';
import { createAgent } from 'langchain';

const corsair = createCorsair({
	plugins: [slack({ authType: 'managed' })],
	database,
	kek: process.env.CORSAIR_KEK,
	hub: { projectApiKey: process.env.CORSAIR_API_KEY },
});

// One tool per Slack operation:
const tools = await corsairTools({ corsair, plugin: 'slack' });

const agent = createAgent({ model: 'openai:gpt-5.4-mini', tools });
const result = await agent.invoke({
	messages: [{ role: 'user', content: 'List the Slack channels.' }],
});
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
- Corsair is on Zod v4, which current `@langchain/core` accepts directly — no
  JSON Schema conversion.

## License

Apache-2.0
