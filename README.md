# Corsair: Integration Layer for AI Agents

Corsair gives you (or your agent) safe access to hundreds of integrations. It natively handles all integration plumbing. The only code you write is the code that's specific to your use case. Your data stays in your database, not a third-party service.

---

# Why this exists

Integrations make products capable. Integrations are also frustrating to write. If you look at any codebase with integrations, 95% of the code is identical. It's all just basic plumbing. The part of the integration that is unique to a codebase and actually adds value is probably just a few lines. We shouldn't waste time writing and maintaining the 95% for a few lines. Developers have accepted that we do. Corsair handles the 95% so you don't have to. It's really hard to get wrong. 

---

## Get started

Install Corsair:
```bash
npm install corsair @corsair-dev/mcp
```

Declare your integrations in a file you can track and commit to git:
```typescript
// corsair.ts
export const corsair = createCorsair({
  plugins: [slack(), github(), gmail(), linear(), googlecalendar()],
});
```

Connect it to your agent and start prompting:
```typescript
const corsairMcpServer = runStdioMcpServer({ corsair })

query({
  prompt: "invite jim to next thursday's sales call. tell him over slack too so he can accept it. lmk when he does",
  options: {
	mcpServers: { corsair: corsairMcpServer },
  },
})
```

> MCP exposes 4 tools, no matter how many plugins you have:
> - Setup: `corsair_setup`
> - Introspection: `list_operations` and `get_schema`
> - Execution: `corsair_run`

---

## What you can do

Once connected, your agent can reason across all your integrations at once. Some things that become one-liners:

> *"Summarize my unread emails from customers, open a Linear issue for anything that looks urgent, and post the digest to #standup."*

> *"When a new GitHub issue is labeled `bug`, create a matching Linear ticket and notify the on-call engineer in Slack."*

The second one is a live webhook workflow. Corsair handles the event routing and your agent handles the logic.

---

## Compatibility

We're adding stuff every day. Request something if you don't see it here. We will build it for you.

Integrations: Slack · Linear · HubSpot · Gmail · Google Calendar · GitHub · PostHog · Amplitude · Airtable · Google Drive · Spotify · Oura · and more

Frameworks: Claude · OpenAI · Vercel AI SDK · Mastra · and more

---

## Beyond personal use

The same setup scales to multi-tenant SaaS. Set `multiTenancy: true`, call `corsair.withTenant(teamId)`, and every API call is automatically scoped to those credentials.

---

# Alternatives

You should choose the best integration solution for your use case. Here's a quick comparison, in an effort to demonstrate why we think Corsair is the best integration solution for any use case:

|                     | Corsair | cURL / CLI | SDK | Vibe code it yourself | Pay for a no-code platform |
|---------------------|------|------|-----|-----------|---------|
| Compatible with coding agents        | ✓    | ✓ | ✗ | inconsistent | via plugins |
| Strongly typed           | ✓    | ✗ | dependent on SDK | ✗ | ✗ |
| Automatically refreshes data (minimal staleness) | ✓    | ✗ | ✗ | ✗ | inconsistent |
| Webhook support        | ✓    | ✗ | manual | ✗ | ✓ |
| Data is seen only by you    | ✓    | ✓ | ✓ | ✓ | ✗ |
| Updates with breaking API changes | ✓    | ✗ | manual | ✗ | ✓ |

---

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
