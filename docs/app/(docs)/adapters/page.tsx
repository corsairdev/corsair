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
      <DocsTitle>Adapters</DocsTitle>
      <DocsDescription>
        Use framework adapters to expose Corsair operations.
      </DocsDescription>
      <DocsBody>
        <h2>Next.js</h2>
        <CodeBlock
          title="TypeScript"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { createNextJsHandler } from 'corsair/nextjs'
export const { POST } = createNextJsHandler(queries, mutations, async () => ({}))`}</code>
          </Pre>
        </CodeBlock>
        <h2>Express</h2>
        <CodeBlock
          title="TypeScript"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { createExpressHandler } from 'corsair/express'
app.post('/api/corsair', createExpressHandler(queries, mutations, async () => ({})))`}</code>
          </Pre>
        </CodeBlock>
      </DocsBody>
    </DocsPage>
  )
}
