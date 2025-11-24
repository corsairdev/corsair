import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page'
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock'
import { Callout } from 'fumadocs-ui/components/callout'

export default function Page() {
  return (
    <DocsPage>
      <DocsTitle>Adapters</DocsTitle>
      <DocsDescription>
        Framework adapters for Next.js and other platforms
      </DocsDescription>
      <DocsBody>
        <h2>Next.js App Router</h2>
        <p>
          Corsair provides a tRPC-based adapter for Next.js App Router with support for 
          HTTP streaming and batch requests.
        </p>

        <h3>Setup</h3>
        <p>Create an API route handler at <code>app/api/corsair/[...corsair]/route.ts</code>:</p>
        <CodeBlock
          title="app/api/corsair/[...corsair]/route.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { fetchRequestHandler } from 'corsair'
import { corsairRouter } from '@/corsair/index'
import { db } from '@/db'

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/corsair',
    req,
    router: corsairRouter,
    createContext: () => {
      return {
        userId: '123',
        db,
        schema: db._.schema!,
      }
    },
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler
export const HEAD = handler
export const OPTIONS = handler`}</code>
          </Pre>
        </CodeBlock>

        <h3>Client Configuration</h3>
        <p>Configure the client to connect to your API route:</p>
        <CodeBlock
          title="corsair/client.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { createCorsairClient, createCorsairHooks } from 'corsair'
import type { CorsairRouter } from '.'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  if (process.env.VERCEL_URL) {
    return \`https://\${process.env.VERCEL_URL}\`
  }
  return \`http://localhost:\${process.env.PORT || 3000}\`
}

const { typedClient } = createCorsairClient<CorsairRouter>({
  url: \`\${getBaseUrl()}\${process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!}\`,
})

const {
  useCorsairQuery,
  useCorsairMutation,
  corsairQuery,
  corsairMutation,
} = createCorsairHooks<CorsairRouter>(typedClient)

export { useCorsairQuery, useCorsairMutation, corsairQuery, corsairMutation }`}</code>
          </Pre>
        </CodeBlock>

        <h3>Context Function</h3>
        <p>
          The <code>createContext</code> function is called for every request and provides 
          context to your procedures:
        </p>
        <CodeBlock
          title="TypeScript"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`createContext: async () => {
  return {
    userId: '123',
    db,
    schema: db._.schema!,
    plugins,
  }
}`}</code>
          </Pre>
        </CodeBlock>

        <Callout type="info" title="Authentication">
          Add authentication logic in the <code>createContext</code> function. 
          Access user information from headers or cookies and include it in the context.
        </Callout>

        <h3>Example with Authentication</h3>
        <CodeBlock
          title="app/api/corsair/[...corsair]/route.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { fetchRequestHandler } from 'corsair'
import { corsairRouter } from '@/corsair/index'
import { db } from '@/db'
import { cookies } from 'next/headers'

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/corsair',
    req,
    router: corsairRouter,
    createContext: async () => {
      const cookieStore = await cookies()
      const token = cookieStore.get('auth-token')?.value
      
      const userId = token ? await validateToken(token) : undefined
      
      return {
        userId,
        db,
        schema: db._.schema!,
      }
    },
  })
}

export const GET = handler
export const POST = handler`}</code>
          </Pre>
        </CodeBlock>

        <h2>Database Adapters</h2>
        <p>Corsair currently supports Drizzle ORM with Postgres:</p>

        <h3>Drizzle + Postgres</h3>
        <CodeBlock
          title="db/index.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })`}</code>
          </Pre>
        </CodeBlock>

        <Callout type="warn" title="Coming Soon">
          Support for Prisma, Express, Fastify, Hono, and other frameworks is in development.
        </Callout>
      </DocsBody>
    </DocsPage>
  )
}
