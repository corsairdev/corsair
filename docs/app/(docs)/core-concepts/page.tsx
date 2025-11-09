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
      <DocsTitle>Core Concepts</DocsTitle>
      <DocsDescription>Routers and client provider.</DocsDescription>
      <DocsBody>
        <h2>Router</h2>
        <p>Use createCorsairTRPC to create a router with superjson.</p>
        <CodeBlock
          title="TypeScript"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { createCorsairTRPC } from 'corsair/core'
const t = createCorsairTRPC<{ userId: string }>()
const appRouter = t.router({
  ping: t.procedure.query(() => 'pong')
})`}</code>
          </Pre>
        </CodeBlock>
        <h2>Client</h2>
        <p>Wrap your app with CorsairProvider to enable TanStack Query.</p>
        <CodeBlock
          title="TypeScript"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { CorsairProvider } from 'corsair/client'
export function Providers({ children }: { children: React.ReactNode }) {
  return <CorsairProvider>{children}</CorsairProvider>
}`}</code>
          </Pre>
        </CodeBlock>
      </DocsBody>
    </DocsPage>
  )
}
