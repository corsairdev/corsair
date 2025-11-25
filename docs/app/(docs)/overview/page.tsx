import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page'
import { Callout } from 'fumadocs-ui/components/callout'

export default function Page() {
  return (
    <DocsPage>
      <DocsTitle>Corsair Overview</DocsTitle>
      <DocsDescription>
        The Vibe Coding SDK - Natural language queries and mutations for your full-stack TypeScript app
      </DocsDescription>
      <DocsBody>
        <Callout title="What is Corsair?" type="info">
          Corsair lets you write database queries and business logic in plain English. 
          It generates real TypeScript API routes using your existing ORM—no magic, no vendor lock-in, no runtime overhead.
        </Callout>
        
        <h2>Why Corsair?</h2>
        <p>
          We have great AI coding tools for building UIs. But what about the other two tiers of your app: 
          business logic and databases? Corsair fills that gap.
        </p>

        <h3>You stay in control</h3>
        <ul>
          <li><strong>Real code, not abstraction</strong> - Corsair generates standard TypeScript API routes. View them, edit them, own them.</li>
          <li><strong>Zero runtime overhead</strong> - Code generation happens at build time. Your queries run at normal API speeds.</li>
          <li><strong>Fully type-safe</strong> - Your prompts map to input/output types. TypeScript knows exactly what you're sending and receiving.</li>
          <li><strong>Schema-aware</strong> - Change your Drizzle schema? Corsair detects affected routes and rewrites them automatically.</li>
          <li><strong>Incremental adoption</strong> - Use Corsair alongside your existing API routes. No need to rewrite your app.</li>
          <li><strong>No vendor lock-in</strong> - Your queries are stored as normal TypeScript. Want to eject? Just move the generated routes.</li>
        </ul>

        <h2>Features</h2>
        <ul>
          <li>tRPC-based router with superjson for serialization</li>
          <li>TanStack Query integration for client-side data fetching</li>
          <li>Next.js App Router adapter with streaming support</li>
          <li>CLI for code generation, validation, and migrations</li>
          <li>Drizzle ORM + Postgres support</li>
          <li>Plugin system (Slack, Stripe, Posthog, Resend)</li>
          <li>Built for AI coding agents (Claude, Cursor)</li>
        </ul>

        <h2>How it works</h2>
        <ol>
          <li><strong>You write:</strong> <code>useCorsairQuery("get all albums by artist id", {'{'}artistId{'}'})</code></li>
          <li><strong>Corsair generates:</strong> A complete TypeScript API route using your Drizzle ORM</li>
          <li><strong>You get:</strong> Type-safe queries with intellisense, no SQL required</li>
          <li><strong>Schema changes?</strong> Corsair sees the diff and updates affected routes</li>
        </ol>

        <Callout type="warn" title="Early Development">
          Currently supports Next.js, Drizzle, and Postgres. More ORMs and frameworks coming soon.
        </Callout>
      </DocsBody>
    </DocsPage>
  )
}
