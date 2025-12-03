# Corsair

**The Vibe Coding SDK.**

_Type-safe natural language queries and mutations for your database and third-party APIs._

```typescript
const onboardUser = useCorsairMutation(
  'create user account, send welcome email via Resend, and notify team via Slack'
)

await onboardUser.mutateAsync({
  email: 'john.doe@corsair.dev',
  name: 'John Doe',
  plan: 'pro',
  channel: '#sign-ups',
})

// Fully typed. Zero `any` types. Complete intellisense.
```

## Why Corsair

Corsair gives you the speed of AI code generation with production-grade type safety. Write natural language, get fully-typed implementations at **compile time** (not runtime), with complete control to view and edit the generated code.

## Perfect for Coding Agents

Corsair reduces token usage and increases reliability when working with AI coding assistants:

```bash
pnpm corsair query -n "published posts with comments" -i "fetch all published posts with authors and approved comments"
```

The agent delegates to Corsair using normal bash commands. You get type safety, minimal token usage, and zero technical debt.

---

**The Vibe Coding SDK** — Built for developers who want the speed of AI coding with the reliability of hand-written TypeScript.

[Documentation](https://docs.corsair.dev) • [Discord](https://discord.gg/corsair) • [Twitter](https://twitter.com/corsairdev)
