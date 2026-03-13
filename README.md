# Corsair

Your AI agent just became useful.

Corsair gives your agent type-safe access to the tools you use. It natively handles credentials, token refresh, and webhooks. Your data never leaves your machine.

<img src="https://cdn.simpleicons.org/slack" width="24" height="24" title="Slack" /> &nbsp;<img src="https://cdn.simpleicons.org/github" width="24" height="24" title="GitHub" /> &nbsp;<img src="https://cdn.simpleicons.org/gmail" width="24" height="24" title="Gmail" /> &nbsp;<img src="https://cdn.simpleicons.org/linear" width="24" height="24" title="Linear" /> &nbsp;<img src="https://cdn.simpleicons.org/googlecalendar" width="24" height="24" title="Google Calendar" /> &nbsp;<img src="https://cdn.simpleicons.org/notion" width="24" height="24" title="Notion" /> &nbsp;<img src="https://cdn.simpleicons.org/airtable" width="24" height="24" title="Airtable" /> &nbsp;<img src="https://cdn.simpleicons.org/discord" width="24" height="24" title="Discord" /> &nbsp;<img src="https://cdn.simpleicons.org/hubspot" width="24" height="24" title="HubSpot" /> &nbsp;<img src="https://cdn.simpleicons.org/todoist" width="24" height="24" title="Todoist" /> &nbsp;<img src="https://cdn.simpleicons.org/spotify" width="24" height="24" title="Spotify" /> &nbsp;<img src="https://cdn.simpleicons.org/resend" width="24" height="24" title="Resend" /> &nbsp;<img src="https://cdn.simpleicons.org/posthog" width="24" height="24" title="PostHog" /> &nbsp;<img src="https://cdn.simpleicons.org/sentry" width="24" height="24" title="Sentry" /> &nbsp;<img src="https://cdn.simpleicons.org/amplitude" width="24" height="24" title="Amplitude" />

---

## The problem

You want to build an agent that can check your calendar before scheduling a meeting, triage GitHub issues, draft a Slack message, and create a Linear ticket. You'll find that wiring up each integration takes longer than building the agent itself.

Declare the plugins you want in Corsair, authenticate once, and your agent can discover APIs for all of them.

---

## Get started

Declare your integrations in a file you can commit to git:

```typescript
// corsair.ts
export default createCorsair({
  plugins: [slack(), github(), gmail(), linear(), googlecalendar()],
});
```

Authenticate your accounts interactively:

```bash
npx corsair auth
```

Connect to your agent and start prompting:

```typescript
const tools = await new ClaudeProvider().build({ corsair });
// pass tools to your agent of choice
```

---

## What you can do

Once connected, your agent can reason across all your integrations at once. Some things that become one-liners:

> *"Summarize my unread emails, open a Linear issue for anything that looks urgent, and post the digest to #standup."*

> *"Look at my open GitHub PRs. Check if any of the reviewers have conflicts on their calendar today, then nudge them on Slack."*

> *"Find every Linear issue that's been open for more than two weeks with no activity. Draft a summary and email it to the team."*

> *"When a new GitHub issue is labeled `bug`, create a matching Linear ticket and notify the on-call engineer in Slack."*

The last one is a live webhook workflow. Corsair handles the event routing and your agent handles the logic.

---

## You're still in control

Giving an agent access to Gmail sounds useful until you realize it can just...send emails on your behalf (to anyone).

Corsair has a permissions system so you can gate exactly which actions require your sign-off before they fire:

```typescript
gmail({
  permissions: {
    mode: 'cautious',
    overrides: {
      'messages.send': 'require_approval',
    },
  },
})
```

The agent can still read and search your email. It will send only after you approve. Same idea applies to posting in Slack, merging a PR, or anything else you'd rather not leave fully autonomous.

---

## Your data, your machine

Every other integration platform asks you to sign up, hand over API keys, and route your data through their servers. That means your emails, your calendar events, and your customer data are all passing through infrastructure you don't control.

Corsair is yours, and only you touch the data. Credentials are encrypted and stored locally. Your integration data syncs to a database you own. Nothing leaves unless you send it somewhere yourself.

This is a privacy-first architecture, and it means the whole thing is version-controllable, self-hostable, and auditable. Your `corsair.ts` is a plain TypeScript file. Commit it, fork it, deploy it.

---

## Plugins

<img src="https://cdn.simpleicons.org/slack" width="24" height="24" title="Slack" /> &nbsp;<img src="https://cdn.simpleicons.org/github" width="24" height="24" title="GitHub" /> &nbsp;<img src="https://cdn.simpleicons.org/gmail" width="24" height="24" title="Gmail" /> &nbsp;<img src="https://cdn.simpleicons.org/googlecalendar" width="24" height="24" title="Google Calendar" /> &nbsp;<img src="https://cdn.simpleicons.org/googledrive" width="24" height="24" title="Google Drive" /> &nbsp;<img src="https://cdn.simpleicons.org/googlesheets" width="24" height="24" title="Google Sheets" /> &nbsp;<img src="https://cdn.simpleicons.org/linear" width="24" height="24" title="Linear" /> &nbsp;<img src="https://cdn.simpleicons.org/notion" width="24" height="24" title="Notion" /> &nbsp;<img src="https://cdn.simpleicons.org/hubspot" width="24" height="24" title="HubSpot" /> &nbsp;<img src="https://cdn.simpleicons.org/discord" width="24" height="24" title="Discord" /> &nbsp;<img src="https://cdn.simpleicons.org/airtable" width="24" height="24" title="Airtable" /> &nbsp;<img src="https://cdn.simpleicons.org/todoist" width="24" height="24" title="Todoist" /> &nbsp;<img src="https://cdn.simpleicons.org/spotify" width="24" height="24" title="Spotify" /> &nbsp;<img src="https://cdn.simpleicons.org/resend" width="24" height="24" title="Resend" /> &nbsp;<img src="https://cdn.simpleicons.org/posthog" width="24" height="24" title="PostHog" /> &nbsp;<img src="https://cdn.simpleicons.org/sentry" width="24" height="24" title="Sentry" /> &nbsp;<img src="https://cdn.simpleicons.org/amplitude" width="24" height="24" title="Amplitude" />

We're adding more every week. Request one if you don't see it here.

---

## Works with your agent framework

Claude, OpenAI, Vercel AI SDK, Mastra — Corsair ships adapters for all of them via the Model Context Protocol.

---

## Beyond personal use

The same setup scales to multi-tenant SaaS. Set `multiTenancy: true`, call `corsair.withTenant(userId)`, and every API call is automatically scoped to that user's credentials.

---

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
