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
      <DocsTitle>CLI</DocsTitle>
      <DocsDescription>
        Command-line tools for code generation, validation, and migrations
      </DocsDescription>
      <DocsBody>
        <Callout type="info" title="Built for AI Agents">
          Corsair CLI is designed to work with AI coding agents like Claude Code and Cursor.
        </Callout>

        <h2>Available Commands</h2>

        <h3>Watch Mode</h3>
        <p>Start the interactive development UI with watch mode:</p>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`pnpm corsair watch`}</code>
          </Pre>
        </CodeBlock>
        <p>
          This starts an interactive UI that watches for schema changes and automatically
          validates your queries and mutations. It provides real-time feedback on type safety
          and schema compatibility.
        </p>

        <h3>Generate</h3>
        <p>Generate types and validate your Corsair configuration:</p>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`pnpm corsair generate`}</code>
          </Pre>
        </CodeBlock>
        <p>
          This command generates TypeScript types for your queries and mutations based on
          your schema and validates that all operations are properly typed.
        </p>

        <h3>Check</h3>
        <p>Validate your queries and mutations without generating files:</p>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`pnpm corsair check`}</code>
          </Pre>
        </CodeBlock>
        <p>
          Runs validation checks on your Corsair operations to ensure they're correctly
          structured and type-safe. Useful in CI/CD pipelines.
        </p>

        <h3>Fix</h3>
        <p>Automatically fix common issues in your Corsair code:</p>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`pnpm corsair fix`}</code>
          </Pre>
        </CodeBlock>
        <p>
          Attempts to automatically fix common issues like missing exports, incorrect
          imports, or simple type errors.
        </p>

        <h3>Migrate</h3>
        <p>Run database migrations (integrates with your ORM's migration tool):</p>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`pnpm corsair migrate`}</code>
          </Pre>
        </CodeBlock>
        <p>
          For Drizzle projects, this runs <code>drizzle-kit push</code> to sync your
          schema with your database.
        </p>

        <h2>AI Agent Commands</h2>
        <p>
          Corsair has specialized commands designed for AI coding agents to generate
          queries and mutations:
        </p>

        <h3>Query Generation</h3>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`pnpm corsair query -n "get all albums by artist id" -i "return all albums in descending order (recent ones first)"`}</code>
          </Pre>
        </CodeBlock>

        <h3>Mutation Generation</h3>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`pnpm corsair mutation -n "create album" -i "create a new album with validation"`}</code>
          </Pre>
        </CodeBlock>

        <Callout type="info" title="Natural Language">
          These commands accept natural language descriptions and generate type-safe
          TypeScript code that matches your schema.
        </Callout>

        <h2>Configuration</h2>
        <p>
          The CLI reads from your <code>corsair.config.ts</code> file. Make sure it's
          properly configured before running CLI commands:
        </p>
        <CodeBlock
          title="corsair.config.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { type CorsairConfig } from 'corsair'
import { db } from './db'

export const config = {
  dbType: 'postgres',
  orm: 'drizzle',
  framework: 'nextjs',
  pathToCorsairFolder: './corsair',
  apiEndpoint: process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!,
  db: db,
  schema: db._.schema,
  connection: process.env.DATABASE_URL!,
} satisfies CorsairConfig<typeof db>`}</code>
          </Pre>
        </CodeBlock>

        <h2>CI/CD Integration</h2>
        <p>Add Corsair checks to your CI pipeline:</p>
        <CodeBlock
          title=".github/workflows/ci.yml"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-yaml">{`name: CI
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run corsair check
      - run: npm run typecheck`}</code>
          </Pre>
        </CodeBlock>

        <Callout type="warn" title="Schema-Aware Validation">
          When your database schema changes, Corsair will detect affected queries and
          mutations during the check command, preventing runtime errors.
        </Callout>
      </DocsBody>
    </DocsPage>
  )
}

