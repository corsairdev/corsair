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
      <DocsTitle>Quickstart</DocsTitle>
      <DocsDescription>
        Get up and running with Corsair in 5 steps
      </DocsDescription>
      <DocsBody>
        <h2>1. Create Corsair Config</h2>
        <p>Create a <code>corsair.config.ts</code> file in your project root:</p>
        <CodeBlock
          title="corsair.config.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { config as dotenvConfig } from 'dotenv'
import { type CorsairConfig } from 'corsair'
import { db } from './db'

dotenvConfig({ path: '.env.local' })

export const config = {
  dbType: 'postgres',
  orm: 'drizzle',
  framework: 'nextjs',
  pathToCorsairFolder: './corsair',
  apiEndpoint: process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!,
  db: db,
  schema: db._.schema,
  connection: process.env.DATABASE_URL!,
} satisfies CorsairConfig<typeof db>

export type Config = typeof config`}</code>
          </Pre>
        </CodeBlock>

        <h2>2. Set Environment Variables</h2>
        <p>Add to your <code>.env.local</code>:</p>
        <CodeBlock
          title=".env.local"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`DATABASE_URL=postgresql://user:password@localhost:5432/mydb
NEXT_PUBLIC_CORSAIR_API_ROUTE=/api/corsair`}</code>
          </Pre>
        </CodeBlock>

        <h2>3. Create Procedure File</h2>
        <p>Create <code>corsair/procedure.ts</code> to set up your tRPC context:</p>
        <CodeBlock
          title="corsair/procedure.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { createCorsairTRPC } from 'corsair'
import { config } from '../corsair.config'

export type DatabaseContext = {
  db: typeof config.db
  schema: Exclude<typeof config.schema, undefined>
  userId?: string
}

const t = createCorsairTRPC<DatabaseContext>()
export const { router, procedure } = t`}</code>
          </Pre>
        </CodeBlock>

        <h2>4. Define Your First Query</h2>
        <p>Create <code>corsair/queries/get-all-albums.ts</code>:</p>
        <CodeBlock
          title="corsair/queries/get-all-albums.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { z } from 'corsair'
import { procedure } from '../procedure'

export const getAllAlbums = procedure
  .input(z.object({}))
  .query(async ({ input, ctx }) => {
    const albums = await ctx.db.select().from(ctx.db._.fullSchema.albums)
    return albums
  })`}</code>
          </Pre>
        </CodeBlock>

        <h2>5. Create Router and API Route</h2>
        <p>Create <code>corsair/index.ts</code>:</p>
        <CodeBlock
          title="corsair/index.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { dualKeyOperationsMap } from 'corsair'
import { router } from './procedure'
import * as queries from './queries'
import * as mutations from './mutations'

export const corsairRouter = router({
  ...dualKeyOperationsMap(queries),
  ...dualKeyOperationsMap(mutations),
})

export type CorsairRouter = typeof corsairRouter`}</code>
          </Pre>
        </CodeBlock>

        <p>Create <code>app/api/corsair/[...corsair]/route.ts</code>:</p>
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
export const POST = handler`}</code>
          </Pre>
        </CodeBlock>

        <Callout type="info" title="Next Steps">
          Continue to Core Concepts to learn how to use your queries in client components.
        </Callout>
      </DocsBody>
    </DocsPage>
  )
}
