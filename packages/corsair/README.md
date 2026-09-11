# Corsair: Connect your users to their apps

<div align="center">

[Website](https://corsair.dev) · [Discord](https://discord.gg/uNgCP3mSzU) · [X](https://x.com/corsairdotdev) 

</div>

Corsair is a fully-featured product integration platform with a seamless DX. Build anything, from an agent working across all your integrations to a multi-tenant dashboard for your users to connect to anything.


```
import { createCorsair } from 'corsair';
import { github } from '@corsair-dev/github';
import { slack } from '@corsair-dev/slack';

export const corsair = createCorsair({
  plugins: [github(), slack()],
  database: db,
  kek: process.env.CORSAIR_KEK!,
  hub: {
    projectApiKey: process.env.CORSAIR_API_KEY!,
    signingSecret: process.env.CORSAIR_SIGNING_SECRET!,
  },
});
```

## Why does this exist?

### More than MCP

Most agent integration tools are MCP-only. Corsair is built on a REST API, so the same integration layer works for agents, backend services, and the dashboards your customers use.

### One syntax for every integration

The more third-party APIs your agent touches, the more glue code you write. Corsair gives every integration the same syntax, and we maintain the adapters behind it. Connect once instead of rewriting plumbing for each new tool.

### Open source, your data

Closed integration platforms keep your users' tokens and data on infrastructure you can't inspect or leave. Corsair is open source. Self-host it, or use Hub if you want us to handle OAuth refresh and webhooks. Your data remains yours either way.

## Contributing

We welcome PRs for the core library, docs, tooling, and new integration plugins. Read [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

For a new integration, claim it on the [OSS Integrations page](https://corsair.dev/oss) before you start, then open an issue with the API you want to add. Questions? Ask in [Discord](https://discord.gg/uNgCP3mSzU).

---
## License

Licensed under the Apache License, Version 2.0. See [LICENSE](https://github.com/corsairdev/corsair/blob/main/LICENSE) for details.