# Corsair: The TypeScript Integration ORM

A unified TypeScript framework for API and webhook integrations. Add integrations with the same syntax, same types, and same four database tables.

Database ORMs let you interact with your database seamlessly: `db.query.users.findMany(...)`

Corsair lets you interact with your integrations seamlessly: `corsair.withTenant(tenantId).slack.messages.post(...)`

## The Problem

Building workflows across third-party services means writing integration code. Lots of it.

When a user signs up in your app, you might want to:
- Post to your Slack workspace
- Create onboarding tasks in Linear
- Send a welcome email via Resend
- Update them in your CRM

Each integration requires the same infrastructure:
- API calls with proper auth and error handling
- Database schemas to store responses
- Type definitions for untyped API responses
- Webhooks or polling to keep data fresh
- Foreign keys to connect external data to your own

You end up rebuilding this from scratch for every service, resulting in fragmented code with different patterns, error handling, and auth flows.

## The Solution

Corsair gives you a single interface for all your integrations. Configure each plugin once, then use the same syntax everywhere:
```typescript
export const corsair = createCorsair({
  multiTenancy: true,
  database: drizzleAdapter(...),
  plugins: [slack(), linear(), resend(), hubspot()],
});

// Same syntax across every integration, fully typed
const tenant = corsair.withTenant('tenant_123');

await tenant.slack.api.messages.post({ channel: 'C01234567', text: 'New signup!' });
await tenant.linear.api.issues.create({ title: `Tasks for new user: ${user.name}`, teamId: 'TEAM_ABC' });
await tenant.resend.api.emails.send({ to: 'user@example.com', subject: 'Welcome!' });
```

**Everything is automatically handled:**

Your integrations work the same way whether you're calling Slack, Linear, GitHub, or Gmail. All responses are fully typed with no manual definitions. OAuth flows, token refresh, and API key management happen automatically per tenant. Rate limits, retries, and error handling work out of the box. Webhooks and polling keep your local database synchronized with zero configuration.

**Data stays in your database:**

Every API response is automatically synced to your local database using just four tables that handle all external data. You get full type safety when querying, and you can write foreign keys directly from your tables to Corsair's tables. No more maintaining custom schemas or trying to map untyped API responses.
```typescript
// Query synced data with full type safety
const issues = await tenant.linear.db.issues.search({
  where: { state: 'in_progress' },
});

// Write foreign keys directly to Corsair tables
await db.projects.create({
  name: 'New Project',
  linearIssueId: issues[0].id, // References Linear issue. Any update to that object will automatically be synced. 
});
```

**Customize when you need to:**

Corsair provides sensible defaults but lets you override anything. Add custom error handlers, lifecycle hooks, webhook processing, or service-specific configuration. You're never locked into our abstraction.

## Works with your existing tools

Corsair is the integration layer. It handles API calls, auth, typing, and data sync. Pair it with orchestration tools like Inngest or Temporal when you need async workflows, sleep, or complex sequencing:
```typescript
// Inngest handles orchestration, Corsair handles integrations
export const onCustomerChurn = inngest.createFunction(
  { id: "customer-churn" },
  { event: "customer.churned" },
  async ({ event, step }) => {
    const tenant = corsair.withTenant(event.data.tenantId);
    
    await step.run('remove-slack', () => tenant.slack.api.users.remove(...));
    await step.sleep('wait-period', '7d');
    await step.run('archive-linear', () => tenant.linear.api.issues.archive(...));
    await step.run('send-survey', () => tenant.resend.api.emails.send(...));
  }
);
```

## What you get

- **Consistent API** — Same patterns across every integration, no learning curve between services
- **Full type safety** — All responses are strongly typed, no manual type definitions needed
- **Multi-tenancy** — Keep data, auth, and database records fully isolated with no cross-contamination
- **Local database sync** — Four tables handle all external data. Write foreign keys directly to Corsair tables
- **Built-in auth** — OAuth, API keys, and token refresh handled automatically per tenant
- **Always fresh data** — Webhooks and polling keep your local database up to date automatically
- **Error handling** — Rate limits, retries, and failures managed out of the box

## When to use Corsair

**Use Corsair when:**
- Building workflows across multiple third-party services
- You need local database copies of external data with foreign keys to your own tables
- Managing integrations for multiple tenants with isolated auth and data
- You want type-safe integrations without maintaining SDK wrappers

**Don't use Corsair when:**
- Building deep, custom functionality with a single API (use that service's SDK directly)
- You only need one-off API calls without data persistence
- Your integrations don't require local data storage

## Real-world workflows

**Incident response:** When PagerDuty alerts fire, automatically create a Slack war room, spin up a Linear tracking issue, post the Linear link to Slack, and update the incident status—all with a few typed function calls.

**Sales automation:** When a deal closes in HubSpot, provision a customer workspace in Slack, create their GitHub organization, send contracts via DocuSign, and track everything in your database with foreign keys to the HubSpot deal.

**User onboarding:** When someone subscribes, add them to your Slack workspace, create personalized onboarding tasks in Linear, send welcome emails via Resend, and sync everything to your CRM—without writing integration code for each service.

## FAQ

<details>
<summary>How are keys stored?</summary>

Keys are stored using [envelope encryption](https://docs.cloud.google.com/kms/docs/envelope-encryption) in your database. You provide a master key (KEK) via environment variable or KMS, and Corsair generates unique encrypted keys (DEKs) for each tenant's integration (stored in the Corsair-managed tables). If multi-tenancy is enabled, keys are strictly scoped per tenant. **If you want to manage keys yourself, just pass them directly to Corsair and skip our key management.**

</details>

<details>
<summary>Why wouldn't I just use the SDK directly?</summary>

If you're going deep with one integration, use their SDK. But if you're coordinating multiple services, Corsair saves you from rebuilding auth, webhooks, rate limits, error handling, and database sync for each one. The same 20 lines work across all integrations. Plus, everything syncs to your local database automatically so you can write foreign keys and query fresh data.

</details>

<details>
<summary>Couldn't I just use a no-code workflow automation tool?</summary>

You could, but your data would live in their system, not yours. With Corsair, everything syncs to your database. So you can write SQL queries, create foreign keys, and build complex conditional logic that no-code tools can't handle. Plus it lives in your git repo and you only pay for what you use (no "monthly credits" or execution limits).

</details>

<details>
<summary>What happens if an integration's API changes?</summary>

Corsair manages API versioning by mapping version numbers to schemas. This is still under active development and you can expect improvements soon. 

</details>

<details>
<summary>How does Corsair handle rate limits?</summary>

Automatically. If an API sends `Retry-After`, we respect it. Otherwise, we use exponential backoff. Configurable per plugin if needed.

</details>
<details>
<summary>Can I use Corsair alongside direct SDK calls?</summary>

Yes. Corsair is just a function; use it where it helps, drop down to SDKs when you need custom logic. Mix them in the same workflow.

</details>

---

Built for teams who want to ship integrations, not maintain infrastructure.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.