# @corsair-dev/mastra

A [Mastra](https://mastra.ai) `ToolProvider` for [Corsair](https://corsair.dev) — expose 200+ integrations (Slack, GitHub, Gmail, Linear, Stripe, …) to your Mastra agents, backed by **managed OAuth** and with **credentials that stay in your own database**.

Each Corsair plugin becomes a toolkit and each operation becomes a tool. The same provider works two ways:

- **Editor / managed** — register it with `MastraEditor` and Mastra's connection UI drives the OAuth lifecycle (the VNext surface).
- **Code-config** — call `resolveTools()` yourself and hand the tools to an `Agent`.

## Install

```bash
npm install @corsair-dev/mastra @mastra/core corsair
# plus a plugin per integration you use, e.g. Slack:
npm install @corsair-dev/slack
# and, for the managed-connection editor UI:
npm install @mastra/editor
```

`@mastra/core` is a peer dependency.

## Usage

Create a Corsair instance, then a provider:

```ts
import { createCorsair } from 'corsair';
import { CorsairToolProvider } from '@corsair-dev/mastra';
import { slack } from '@corsair-dev/slack';

const corsair = createCorsair({
	plugins: [slack({ authType: 'managed' })],
	database,
	kek: process.env.CORSAIR_KEK,
	hub: { projectApiKey: process.env.CORSAIR_API_KEY },
	multiTenancy: true,
});

const provider = new CorsairToolProvider({
	corsair,
	// Map a Mastra request to a Corsair tenant (per-user, per-org, …):
	tenantId: (req) => req.authorId ?? 'default',
});
```

## Tenancy

`tenantId` is the single knob that maps a Mastra request to a Corsair **tenant** — each tenant owns its own connections and credentials. It also derives the Mastra connection scope for you, so there is nothing else to wire up:

| `tenantId`               | Meaning                                    | Derived scope       |
| ------------------------ | ------------------------------------------ | ------------------- |
| `'acme'` (string)        | Pin every request to one tenant            | `'shared'`          |
| `(req) => …` (function)  | Resolve per request (multi-tenant SaaS)    | `'caller-supplied'` |
| _omitted_                | Connection's tenant → author id → default  | `'per-author'`      |

The function receives the connection id, author id, toolkit, and Mastra's live request context, so you can bucket by whatever your app authenticates on (user, org, workspace):

```ts
new CorsairToolProvider({
	corsair,
	tenantId: ({ authorId, requestContext }) =>
		orgIdFrom(requestContext) ?? authorId ?? 'default',
});
```

Pass `defaultScope` explicitly to override the derived one.

### With the Mastra editor (managed connections)

```ts
import { Mastra } from '@mastra/core';
import { MastraEditor } from '@mastra/editor';

export const mastra = new Mastra({
	agents: {
		/* … */
	},
	editor: new MastraEditor({
		toolProviders: { corsair: provider },
	}),
});
```

### Code-config (resolve tools directly)

```ts
import { Agent } from '@mastra/core/agent';

const tools = await provider.resolveTools(['slack.api.channels.list']);

const agent = new Agent({
	id: 'my-agent',
	name: 'My Agent',
	instructions: 'You have Slack tools via Corsair.',
	model,
	tools,
});
```

## Choosing which tools

You rarely hand-write slugs. Pick the level that fits:

**Let users choose in the editor (most common).** With `MastraEditor`, the
playground lists every Corsair toolkit and tool and users toggle them — no code.
Scope what's offered with the provider's allowlist (inherited from
`BaseToolProvider`, same as Composio/Arcade):

```ts
// only Slack shows up; omit both to offer everything Corsair has
new CorsairToolProvider({ corsair, allowedToolkits: ['slack'] });
new CorsairToolProvider({ corsair, allowedTools: ['slack.api.channels.list'] });
```

**Code-config — specific tools:**

```ts
const tools = await provider.resolveTools([
	'slack.api.channels.list',
	'slack.api.messages.post',
]);
```

**Code-config — a whole toolkit, or every operation Corsair offers:**

```ts
// one toolkit: pass { toolkit: 'slack' }; omit it for every registered plugin
const { data } = await provider.listTools({ toolkit: 'slack' });
const tools = await provider.resolveTools(data.map((t) => t.slug));
```

`listTools()` returns metadata (browse/pick); `resolveTools()` returns the
executable tools you hand to an `Agent`. All operations of every plugin you
register on the `corsair` instance are reachable this way.

## License

Apache-2.0
