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
        Type-safe data and API toolkit for fast iteration with strong typing and
        adapters.
      </DocsDescription>
      <DocsBody>
        <Callout title="Why Corsair?" type="info">
          Move quickly with type safety, schema-driven tooling, and framework
          adapters.
        </Callout>
        <h2>Features</h2>
        <ul>
          <li>tRPC-style router utilities with superjson</li>
          <li>Client provider for TanStack Query</li>
          <li>Adapters for Next.js and Express</li>
          <li>CLI for migrations and codegen watch</li>
          <li>Schema helpers and Postgres integration</li>
        </ul>
      </DocsBody>
    </DocsPage>
  )
}
