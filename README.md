# Corsair: Connect your users to their apps

<div align="center">

[Website](https://corsair.dev) · [Discord](https://discord.gg/uNgCP3mSzU) · [X](https://x.com/corsairdotdev) 

[![npm](https://img.shields.io/npm/dm/corsair?style=flat&colorA=000000&colorB=000000)](https://npm.chart.dev/corsair?primary=neutral&gray=neutral&theme=dark)

<a href="https://trendshift.io/repositories/50327?utm_source=repository-badge&amp;utm_medium=badge&amp;utm_campaign=badge-repository-50327" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/repositories/50327" alt="corsairdev%2Fcorsair | Trendshift" width="250" height="55"/></a>

</div>

Corsair is a fully-featured product integration platform with a seamless DX. Build anything, from an agent working across all your integrations to a multi-tenant dashboard for your users to connect to anything.

[![Corsair Demo](https://img.youtube.com/vi/fflIzDutxsc/maxresdefault.jpg)](https://youtu.be/fflIzDutxsc)

## Why does this exist?

### More than MCP

Most agent integration tools are MCP-only. Corsair is built on a REST API, so the same integration layer works for agents, backend services, and the dashboards your customers use.

### Wix Plugin Integration

The Wix plugin extends Corsair’s REST-based integration layer to support Wix services.  
- **Purpose:** Enables agents and backend services to interact with Wix sites.  
- **Usage:** Generated via `pnpm run generate:plugin Wix`.  
- **Benefit:** Provides seamless integration for dashboards and customer-facing tools built on Wix.


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