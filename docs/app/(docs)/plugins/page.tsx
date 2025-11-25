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
      <DocsTitle>Plugins</DocsTitle>
      <DocsDescription>
        Extend Corsair with third-party integrations and business logic
      </DocsDescription>
      <DocsBody>
        <Callout type="info" title="Plugin System">
          Corsair's plugin system allows you to chain business logic with database operations.
          Plugins are type-safe and integrate seamlessly with your procedures.
        </Callout>

        <h2>Available Plugins</h2>
        <p>Corsair currently supports the following plugins (with more in development):</p>
        <ul>
          <li>Slack - Send messages to Slack channels</li>
          <li>Discord - Coming soon</li>
          <li>Resend - Coming soon</li>
          <li>Stripe - Coming soon</li>
          <li>Posthog - Coming soon</li>
        </ul>

        <h2>Setup</h2>
        <h3>1. Configure Plugins</h3>
        <p>Add plugin configuration to your <code>corsair.config.ts</code>:</p>
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
  plugins: {
    slack: {
      token: process.env.SLACK_BOT_TOKEN!,
      channels: {
        'general': 'C01234567',
        'notifications': 'C01234568',
        'errors': 'C01234569',
      },
    },
  },
} satisfies CorsairConfig<typeof db>`}</code>
          </Pre>
        </CodeBlock>

        <h3>2. Create Plugins Instance</h3>
        <p>Initialize plugins in your procedure file:</p>
        <CodeBlock
          title="corsair/procedure.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { createCorsairTRPC } from 'corsair'
import { createPlugins } from 'corsair/plugins'
import { config } from '@/corsair.config'

export const plugins = createPlugins(config)

export type DatabaseContext = {
  db: typeof config.db
  schema: Exclude<typeof config.schema, undefined>
  userId?: string
  plugins: typeof plugins
}

const t = createCorsairTRPC<DatabaseContext>()
export const { router, procedure } = t`}</code>
          </Pre>
        </CodeBlock>

        <h3>3. Pass Plugins to Context</h3>
        <p>Include plugins in your API route context:</p>
        <CodeBlock
          title="app/api/corsair/[...corsair]/route.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { fetchRequestHandler } from 'corsair'
import { corsairRouter } from '@/corsair/index'
import { db } from '@/db'
import { plugins } from '@/corsair/procedure'

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
        plugins,
      }
    },
  })
}

export const GET = handler
export const POST = handler`}</code>
          </Pre>
        </CodeBlock>

        <h2>Using Plugins</h2>

        <h3>Slack Plugin</h3>
        <p>Send messages to Slack channels from your mutations:</p>
        <CodeBlock
          title="corsair/mutations/send-slack-message.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { z } from 'corsair'
import { procedure } from '../procedure'

export const sendSlackMessage = procedure
  .input(
    z.object({
      channel: z.string(),
      message: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    await ctx.plugins.slack.sendMessage({
      channelId: input.channel,
      message: input.message,
    })

    return { success: true }
  })`}</code>
          </Pre>
        </CodeBlock>

        <h3>Combining with Database Operations</h3>
        <p>Chain plugin actions with database operations:</p>
        <CodeBlock
          title="corsair/mutations/create-user-with-notification.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { z } from 'corsair'
import { procedure } from '../procedure'

export const createUserWithNotification = procedure
  .input(
    z.object({
      name: z.string(),
      email: z.string().email(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [user] = await ctx.db
      .insert(ctx.db._.fullSchema.users)
      .values(input)
      .returning()

    await ctx.plugins.slack.sendMessage({
      channelId: 'notifications',
      message: \`New user created: \${user.name} (\${user.email})\`,
    })

    return user
  })`}</code>
          </Pre>
        </CodeBlock>

        <h2>Environment Variables</h2>
        <p>Add required environment variables for plugins:</p>
        <CodeBlock
          title=".env.local"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-bash">{`SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret`}</code>
          </Pre>
        </CodeBlock>

        <Callout type="warn" title="Security">
          Never commit API keys or tokens to version control. Always use environment
          variables and add them to your <code>.gitignore</code>.
        </Callout>

        <h2>Creating Custom Plugins</h2>
        <p>
          You can create custom plugins by extending the plugin system. More documentation
          on custom plugins coming soon.
        </p>

        <Callout type="info" title="Plugin Ecosystem">
          The plugin ecosystem is in early development. If you'd like to request a specific
          integration or contribute a plugin, please open an issue on GitHub.
        </Callout>
      </DocsBody>
    </DocsPage>
  )
}

