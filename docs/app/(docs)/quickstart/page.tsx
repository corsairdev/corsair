import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page'
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock'

export default function Page() {
  return (
    <DocsPage>
      <DocsTitle>Quickstart</DocsTitle>
      <DocsDescription>
        Configure, define operations, and run the CLI.
      </DocsDescription>
      <DocsBody>
        <h2>1. Configure</h2>
        <CodeBlock
          title="corsair.config.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`export default {
  paths: {
    queries: 'corsair/queries',
    mutations: 'corsair/mutations',
    schema: 'corsair/schema.ts',
    apiEndpoint: 'api/corsair'
  },
  out: './corsair/drizzle',
  envFile: '.env.local'
}`}</code>
          </Pre>
        </CodeBlock>
        <h2>2. Define operations</h2>
        <CodeBlock
          title="TypeScript"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { z } from 'corsair'
export const input = z.object({ id: z.string() })
export async function handler(ctx: any, i: { id: string }) {
  return { id: i.id }
}`}</code>
          </Pre>
        </CodeBlock>
        <h2>3. Run CLI</h2>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`pnpm corsair generate
pnpm corsair check
pnpm corsair migrate`}</code>
          </Pre>
        </CodeBlock>
      </DocsBody>
    </DocsPage>
  )
}
