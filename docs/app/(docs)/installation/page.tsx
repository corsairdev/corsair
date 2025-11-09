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
        Install core packages, then add adapters as needed.
      </DocsDescription>
      <DocsBody>
        <h2>Packages</h2>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`pnpm add corsair zod superjson @tanstack/react-query
pnpm add -D drizzle-kit typescript`}</code>
          </Pre>
        </CodeBlock>
        <h3>Optional</h3>
        <Callout type="info" title="Add per framework">
          Install only the adapters and framework deps you use.
        </Callout>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`pnpm add next @trpc/server @trpc/client @trpc/tanstack-react-query
pnpm add express fastify hono @cloudflare/workers-types`}</code>
          </Pre>
        </CodeBlock>
      </DocsBody>
    </DocsPage>
  )
}
