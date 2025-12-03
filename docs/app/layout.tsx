import 'fumadocs-ui/style.css'
import { RootProvider } from 'fumadocs-ui/provider'
import { NextProvider } from 'fumadocs-core/framework/next'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { ReactNode } from 'react'

const tree = {
  name: 'Documentation',
  children: [
    {
      type: 'page' as const,
      name: 'Introduction',
      url: '/',
    },
    {
      type: 'separator' as const,
      name: 'Getting Started',
    },
    {
      type: 'page' as const,
      name: 'Overview',
      url: '/overview',
    },
    {
      type: 'page' as const,
      name: 'Installation',
      url: '/installation',
    },
    {
      type: 'page' as const,
      name: 'Quickstart',
      url: '/quickstart',
    },
    {
      type: 'separator' as const,
      name: 'Guides',
    },
    {
      type: 'page' as const,
      name: 'Core Concepts',
      url: '/core-concepts',
    },
    {
      type: 'page' as const,
      name: 'Type Safety',
      url: '/type-safety',
    },
    {
      type: 'page' as const,
      name: 'CLI',
      url: '/cli',
    },
    {
      type: 'page' as const,
      name: 'Adapters',
      url: '/adapters',
    },
    {
      type: 'page' as const,
      name: 'Plugins',
      url: '/plugins',
    },
    {
      type: 'page' as const,
      name: 'Examples',
      url: '/examples',
    },
  ],
}

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextProvider>
          <RootProvider theme={{ defaultTheme: 'light', enableSystem: false }}>
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
