import 'fumadocs-ui/style.css'
import './globals.css'
import { RootProvider } from 'fumadocs-ui/provider'
import { NextProvider } from 'fumadocs-core/framework/next'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { ReactNode } from 'react'

const tree = {
  name: 'Documentation',
  children: [
    {
      type: 'folder' as const,
      name: 'Getting Started',
      defaultOpen: true,
      children: [
        {
          type: 'page' as const,
          name: 'Introduction',
          url: '/',
        },
        {
          type: 'page' as const,
          name: 'Installation',
          url: '/installation',
        },
        {
          type: 'page' as const,
          name: 'Basic Usage',
          url: '/basic-usage',
        },
      ],
    },
    {
      type: 'folder' as const,
      name: 'Concepts',
      defaultOpen: false,
      children: [
        {
          type: 'page' as const,
          name: 'API',
          url: '/api',
        },
        {
          type: 'page' as const,
          name: 'Client',
          url: '/client',
        },
        {
          type: 'page' as const,
          name: 'CLI',
          url: '/cli',
        },
        {
          type: 'page' as const,
          name: 'Plugins',
          url: '/plugins',
        },
        {
          type: 'page' as const,
          name: 'Database',
          url: '/database',
        },
        {
          type: 'page' as const,
          name: 'TypeScript',
          url: '/typescript',
        },
      ],
    },
    {
      type: 'folder' as const,
      name: 'Integrations',
      defaultOpen: false,
      children: [
        {
          type: 'separator' as const,
          name: 'Fullstack',
        },
        {
          type: 'page' as const,
          name: 'Next.js',
          url: '/integrations/next',
        },
        {
          type: 'separator' as const,
          name: 'Frontend',
        },
        {
          type: 'page' as const,
          name: 'Vite',
          url: '/integrations/vite',
        },
        {
          type: 'separator' as const,
          name: 'Backend',
        },
        {
          type: 'page' as const,
          name: 'Hono',
          url: '/integrations/hono',
        },
        {
          type: 'separator' as const,
          name: 'ORM',
        },
        {
          type: 'page' as const,
          name: 'Prisma',
          url: '/integrations/prisma',
        },
        {
          type: 'page' as const,
          name: 'Drizzle',
          url: '/integrations/drizzle',
        },
      ],
    },
    {
      type: 'folder' as const,
      name: 'Plugins',
      defaultOpen: false,
      children: [
        {
          type: 'page' as const,
          name: 'Slack',
          url: '/plugins/slack',
        },
      ],
    },
  ],
}

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextProvider>
          <RootProvider theme={{ defaultTheme: 'dark', enableSystem: false }}>
            <DocsLayout
              tree={tree}
              nav={{ title: 'Corsair' }}
              sidebar={{
                defaultOpenLevel: 0,
              }}
            >
              {props.children}
            </DocsLayout>
          </RootProvider>
        </NextProvider>
      </body>
    </html>
  )
}
