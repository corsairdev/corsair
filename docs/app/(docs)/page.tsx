import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page'
import { Callout } from 'fumadocs-ui/components/callout'
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock'

export default function Page() {
  return (
    <DocsPage>
      <DocsTitle>Corsair Documentation</DocsTitle>
      <DocsDescription>
        The Vibe Coding SDK - Build type-safe full-stack TypeScript apps with
        natural language
      </DocsDescription>
      <DocsBody>
        <Callout title="Welcome to Corsair" type="info">
          Corsair is a TypeScript SDK that lets you write database queries and
          business logic in plain English while maintaining full type safety and
          control over your code.
        </Callout>

        <h2>Quick Example</h2>
        <CodeBlock
          title="TypeScript"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-tsx">{`const albums = await corsairQuery('get all albums by artist id', {
  artistId: params.artist_id,
})

const addUser = useCorsairMutation('create album', {
  onSuccess: () => {
    console.log('Album created!')
  }
})`}</code>
          </Pre>
        </CodeBlock>

        <h2>Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              <a href="/overview" className="hover:underline">
                Overview
              </a>
            </h3>
            <p className="text-sm text-muted-foreground">
              Learn about Corsair's features and how it works
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              <a href="/installation" className="hover:underline">
                Installation
              </a>
            </h3>
            <p className="text-sm text-muted-foreground">
              Install Corsair and its dependencies
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              <a href="/quickstart" className="hover:underline">
                Quickstart
              </a>
            </h3>
            <p className="text-sm text-muted-foreground">
              Get up and running in 5 steps
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              <a href="/core-concepts" className="hover:underline">
                Core Concepts
              </a>
            </h3>
            <p className="text-sm text-muted-foreground">
              Understand queries, mutations, and client setup
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              <a href="/cli" className="hover:underline">
                CLI
              </a>
            </h3>
            <p className="text-sm text-muted-foreground">
              Use CLI tools for generation and validation
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              <a href="/adapters" className="hover:underline">
                Adapters
              </a>
            </h3>
            <p className="text-sm text-muted-foreground">
              Framework and database adapter configuration
            </p>
          </div>
        </div>

        <h2>Key Features</h2>
        <ul>
          <li>
            <strong>Type-Safe:</strong> Full TypeScript support with inference
          </li>
          <li>
            <strong>Zero Runtime Overhead:</strong> Code generation at build
            time
          </li>
          {/* <li><strong>Schema-Aware:</strong> Automatic detection of schema changes</li> */}
          <li>
            <strong>Framework Agnostic:</strong> Works with Next.js (more
            coming)
          </li>
          <li>
            <strong>ORM Support:</strong> Currently Drizzle + Postgres
          </li>
          <li>
            <strong>AI-Friendly:</strong> Built for coding agents
          </li>
        </ul>

        <Callout type="warn" title="Status: Early Development">
          Corsair is in active development. Currently supports Next.js + Drizzle
          + Postgres. More frameworks and ORMs are coming soon.
        </Callout>

        <h2>Community</h2>
        <p>Join our community to get help, share ideas, and stay updated:</p>
        <ul>
          <li>
            <a
              href="https://github.com/corsairdev/corsair"
              className="hover:underline"
            >
              GitHub
            </a>
          </li>
          <li>
            <a href="https://corsair.dev" className="hover:underline">
              Website
            </a>
          </li>
        </ul>
      </DocsBody>
    </DocsPage>
  )
}
