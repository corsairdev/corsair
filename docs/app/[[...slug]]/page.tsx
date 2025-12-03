import IndexDoc from '@/content/docs/index.mdx'
import OverviewDoc from '@/content/docs/overview.mdx'
import InstallationDoc from '@/content/docs/installation.mdx'
import QuickstartDoc from '@/content/docs/quickstart.mdx'
import CoreConceptsDoc from '@/content/docs/core-concepts.mdx'
import TypeSafetyDoc from '@/content/docs/type-safety.mdx'
import CliDoc from '@/content/docs/cli.mdx'
import PluginsDoc from '@/content/docs/plugins.mdx'
import ExamplesDoc from '@/content/docs/examples.mdx'
import NextDoc from '@/content/docs/integrations/next.mdx'
import ViteDoc from '@/content/docs/integrations/vite.mdx'
import HonoDoc from '@/content/docs/integrations/hono.mdx'
import DrizzleDoc from '@/content/docs/integrations/drizzle.mdx'
import PrismaDoc from '@/content/docs/integrations/prisma.mdx'
import SlackDoc from '@/content/docs/plugins/slack.mdx'
import { DocsPage, DocsBody } from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'
import { extractTOC } from '@/lib/toc'
import { useMDXComponents } from '@/mdx-components'

interface PageProps {
  params: Promise<{ slug?: string[] }>
}

const pages = {
  'index': {
    Component: IndexDoc,
    title: 'Corsair Documentation',
    description:
      'The Vibe Coding SDK - Build type-safe full-stack TypeScript apps with natural language',
  },
  'overview': {
    Component: OverviewDoc,
    title: 'Overview',
    description:
      'The Vibe Coding SDK - Natural language queries and mutations for your full-stack TypeScript app',
  },
  'installation': {
    Component: InstallationDoc,
    title: 'Installation',
    description: 'Install Corsair in your Next.js + Drizzle + Postgres project',
  },
  'quickstart': {
    Component: QuickstartDoc,
    title: 'Quickstart',
    description: 'Get up and running with Corsair in 5 steps',
  },
  'core-concepts': {
    Component: CoreConceptsDoc,
    title: 'Core Concepts',
    description: 'Understanding queries, mutations, and client setup',
  },
  'type-safety': {
    Component: TypeSafetyDoc,
    title: 'Type Safety',
    description: 'Full end-to-end type safety from database to UI',
  },
  'cli': {
    Component: CliDoc,
    title: 'CLI',
    description:
      'Command-line tools for code generation, validation, and migrations',
  },
  'plugins': {
    Component: PluginsDoc,
    title: 'Plugins',
    description:
      'Extend Corsair with third-party integrations and business logic',
  },
  'examples': {
    Component: ExamplesDoc,
    title: 'Examples',
    description: 'Real-world examples and patterns for building with Corsair',
  },
  'integrations/next': {
    Component: NextDoc,
    title: 'Next.js',
    description: 'Integrate Corsair with Next.js App Router and Pages Router',
  },
  'integrations/vite': {
    Component: ViteDoc,
    title: 'Vite',
    description: 'Use Corsair with Vite for fast development and optimized builds',
  },
  'integrations/hono': {
    Component: HonoDoc,
    title: 'Hono',
    description: 'Integrate Corsair with Hono for lightweight, edge-compatible APIs',
  },
  'integrations/drizzle': {
    Component: DrizzleDoc,
    title: 'Drizzle',
    description: 'Use Corsair with Drizzle ORM for type-safe database operations',
  },
  'integrations/prisma': {
    Component: PrismaDoc,
    title: 'Prisma',
    description: 'Integrate Corsair with Prisma for type-safe database operations',
  },
  'plugins/slack': {
    Component: SlackDoc,
    title: 'Slack',
    description: 'Enable natural language queries and mutations for Slack operations',
  },
} as const

const mdxComponents = useMDXComponents()

export default async function Page(props: PageProps) {
  const params = await props.params
  const slugKey = (params.slug?.join('/') || 'index') as keyof typeof pages
  const page = pages[slugKey]

  if (!page) {
    notFound()
  }

  const MDX = page.Component
  const toc = extractTOC(slugKey)

  return (
    <DocsPage
      toc={toc}
      tableOfContent={{
        enabled: true,
        style: 'clerk',
        single: false,
      }}
    >
      <h1 className="text-3xl font-bold mb-2">{page.title}</h1>
      {page.description && (
        <p className="text-lg text-muted-foreground mb-8">{page.description}</p>
      )}
      <DocsBody>
        <MDX components={mdxComponents} />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  return Object.keys(pages).map(slug => ({
    slug: slug === 'index' ? undefined : slug.split('/'),
  }))
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const slugKey = (params.slug?.join('/') || 'index') as keyof typeof pages
  const page = pages[slugKey]

  if (!page) notFound()

  return {
    title: page.title,
    description: page.description,
  }
}
