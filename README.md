# Corsair

Corsair gives you (or your agent) safe access to hundreds of integrations. It natively handles all integration plumbing. The only code you write is the code that's specific to your use case. Your data stays yours.

---

# Why this exists

Integrations make products capable. Integrations are also frustrating to write. If you look at any codebase with integrations, 95% of the code is identical. It's all just basic plumbing. The part of the integration that is unique to a codebase and actually adds value is probably just a few lines. We shouldn't waste time writing and maintaining the 95% for a few lines. The developer community has just accepted that we do. Corsair handles the 95% so you don't have to. It's really hard to get wrong. 

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

---

## What you can do

Once connected, your agent can reason across all your integrations at once. Some things that become one-liners:

> *"Summarize my unread emails from customers, open a Linear issue for anything that looks urgent, and post the digest to #standup."*

> *"When a new GitHub issue is labeled `bug`, create a matching Linear ticket and notify the on-call engineer in Slack."*

The second one is a live webhook workflow. Corsair handles the event routing and your agent handles the logic.

---

## Compatibility
> We're adding stuff every day. Request something if you don't see it here. We will build it for you.

Plugins: Slack, Linear, Hubspot, Gmail, Google Calendar, posthog, amplitude, airtable, googledrive, github, ...

Frameworks: Claude, OpenAI, Vercel AI SDK, Mastra

---

## Beyond personal use

The same setup scales to multi-tenant SaaS. Set `multiTenancy: true`, call `corsair.withTenant(userId)`, and every API call is automatically scoped to that user's credentials.

---

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
