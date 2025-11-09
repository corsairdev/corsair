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
      <DocsTitle>CLI</DocsTitle>
      <DocsDescription>Manage migrations and watch codegen.</DocsDescription>
      <DocsBody>
        <h2>Commands</h2>
        <ul>
          <li>corsair generate</li>
          <li>corsair check</li>
          <li>corsair migrate</li>
          <li>corsair watch</li>
        </ul>
        <h3>generate</h3>
        <p>Pulls schema and generates SQL migrations using drizzle-kit.</p>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`pnpm corsair generate`}</code>
          </Pre>
        </CodeBlock>
        <h3>check</h3>
        <p>Runs migrations inside a transaction and rolls back on error.</p>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`pnpm corsair check`}</code>
          </Pre>
        </CodeBlock>
        <h3>migrate</h3>
        <p>
          Applies migrations in a transaction and cleans up SQL files on
          success.
        </p>
        <CodeBlock
          title="Shell"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`pnpm corsair migrate`}</code>
          </Pre>
        </CodeBlock>
        <h3>watch</h3>
        <p>Watches for changes and generates API routes.</p>
        <Callout type="warn" title="Database URL">
          Ensure DATABASE_URL is set before running CLI commands.
        </Callout>
      </DocsBody>
    </DocsPage>
  )
}
