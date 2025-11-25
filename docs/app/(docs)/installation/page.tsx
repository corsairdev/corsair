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
      <DocsTitle>Installation</DocsTitle>
      <DocsDescription>
        Install Corsair in your Next.js + Drizzle + Postgres project
      </DocsDescription>
      <DocsBody>
        <Callout type="info" title="Prerequisites">
          You'll need a Next.js project with Drizzle ORM and Postgres already set up.
        </Callout>

        <h2>Install Corsair</h2>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`npm install corsair`}</code>
          </Pre>
        </CodeBlock>

        <h2>Install Required Dependencies</h2>
        <p>Corsair requires several peer dependencies for full functionality:</p>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`npm install @tanstack/react-query @trpc/server @trpc/client @trpc/tanstack-react-query
npm install drizzle-orm drizzle-zod zod superjson dotenv`}</code>
          </Pre>
        </CodeBlock>

        <h2>Install Dev Dependencies</h2>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`npm install -D drizzle-kit typescript tsx`}</code>
          </Pre>
        </CodeBlock>

        <h2>Database Setup</h2>
        <p>Make sure you have a Postgres database running and configured. Install the Postgres client:</p>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`npm install pg
npm install -D @types/pg`}</code>
          </Pre>
        </CodeBlock>

        <Callout type="warn" title="Next Steps">
          After installation, continue to the Quickstart guide to configure Corsair and create your first queries.
        </Callout>
      </DocsBody>
    </DocsPage>
  )
}
