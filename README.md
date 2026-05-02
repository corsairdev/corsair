# Corsair: The Unified Integration Layer for Agents

⭐ the repo · [Website](https://corsair.dev) · [Discord](https://discord.gg/uNgCP3mSzU) · [X](https://x.com/corsairdotdev) 


Corsair is the unified integration layer for your agents. Connect your Corsair instance to your agent and immediately get access to every integration. Your agent never sees the credentials, and you control exactly what it can do.

---
## Why this exists

Agents are now capable of anything. It feels silly to do a routine task manually. But you do it anyways, because giving agents the keys to all your apps feels reckless. One misunderstood instruction and they're sending an email you'd never send. 

Corsair allows you to safely integrate with any app. Connect the Corsair MCP to any agent and have built-in tool calls, permissions, and scoped auth.

---
## Example: Sending an Email

You're away from your computer, so you ask your agent to send an email:

```
Send Sarah the Q1 numbers from the Financials folder in Drive.
```

Using Corsair, your agent calls Google Drive and then Gmail. You have permissions set up so your agent can't send an email without you seeing. Corsair intercepts the Gmail call, sees it's a send action, and creates a permission request:

```
Agent: I've drafted the email. This action requires your approval before it sends.

  ⚠️ gmail: messages.post
     To: sarah@corsair.dev
     Subject: "Q1 Numbers"
     
     Hi Sarah, attached is the breakdown we discussed on the call.

     <file>
     
     Best,
     Claude

  Review and approve: https://somepubliclink.com/review/a8f2c1
  Link expires in 10 minutes.
```

You open the link. Why does it say "Best, Claude"? You deny the permission, scold Claude, and it sends you a new request.

---
## Permission modes

Each integration has its own mode. Set GitHub to strict and Slack to cautious based on how much you trust each surface.

- **open** — everything runs immediately
- **cautious** _(recommended)_ — reads and writes run immediately; destructive actions require approval
- **strict** — reads run immediately; writes require approval; destructive actions are blocked
- **readonly** — reads only; all writes and destructive actions are blocked

You can also override individual endpoints within any mode. For example, set Slack to `open` but require approval before sending any message.

---
## Multi-tenancy

Corsair is built for production. Set `multiTenancy: true` and every tenant gets isolated credentials, isolated data storage, and isolated permissions handling. You can scope a request to a tenant id and Corsair ensures there is no cross-contamination.

```typescript
const corsair = createCorsair({
  multiTenancy: true,
  plugins: [slack(), github()],
});

const client = corsair.withTenant('org-456');
await client.slack.api.messages.post({ channel: '#alerts', text: 'Deploy complete.' });
```

---
## Webhooks

Every plugin is shipped with typed, signature-verified webhook handlers. All webhooks point to a single endpoint. Set it and forget it.

```typescript
app.post('/webhooks', async (req, res) => {
  const webhook = processWebhook(corsair, req.headers, req.body)
  
  return res.json(webhook.response)
});
```

---
## FAQ

<details> <summary>Where are credentials stored?</summary>

In an encrypted database using envelope encryption. A KEK you control encrypts per-tenant data keys, which encrypt the actual secrets. If you'd rather manage keys yourself, pass them directly and skip the key manager.

</details> <details> <summary>Does the agent ever see my API keys?</summary>

No. The agent sees method names and results. Credentials are resolved internally by Corsair at call time. The agent cannot read, log, or exfiltrate them.

</details> <details> <summary>What happens if I deny an approval request?</summary>

The action is discarded. Nothing is sent, created, or modified. Your agent can try again with corrected parameters and will send a new approval request.

</details> <details> <summary>Can I use Corsair with multiple tenants?</summary>

Yes. Set `multiTenancy: true` and each tenant gets isolated credentials, data storage, and permission evaluation. Endpoint discovery is available at the root and doesn't require a tenant.

</details> <details> <summary>Can I use Corsair alongside direct SDK calls?</summary>

Yes. Corsair is a library. Use it where the permission layer and key management help, and drop down to individual SDKs when you need custom logic.

</details>

<details>
<summary>Can the agent go around the permission request?</summary>
No. Corsair creates a permission request in a database the agent doesn't have access to. Your agent cannot get past the permission request until that database row is set to `approved`.
</details>

<details>
<summary>What integrations do you currently support?</summary>
For the full list of integrations, see our [docs](https://docs.corsair.dev/guides/plugins). We're adding integrations regularly. If there's an integration you need, create a Github issue.
</details>

---
## License

Licensed under the Apache License, Version 2.0. See [LICENSE](https://github.com/corsairdev/corsair/blob/main/LICENSE) for details.