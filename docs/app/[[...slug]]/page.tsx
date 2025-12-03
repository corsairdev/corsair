import IndexDoc from '@/content/docs/index.mdx'
import OverviewDoc from '@/content/docs/overview.mdx'
import InstallationDoc from '@/content/docs/installation.mdx'
import QuickstartDoc from '@/content/docs/quickstart.mdx'
import CoreConceptsDoc from '@/content/docs/core-concepts.mdx'
import TypeSafetyDoc from '@/content/docs/type-safety.mdx'
import CliDoc from '@/content/docs/cli.mdx'
import AdaptersDoc from '@/content/docs/adapters.mdx'
import PluginsDoc from '@/content/docs/plugins.mdx'
import ExamplesDoc from '@/content/docs/examples.mdx'
import { DocsPage, DocsBody } from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'
import { extractTOC } from '@/lib/toc'

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
    title: 'Corsair Overview',
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
  'adapters': {
    Component: AdaptersDoc,
    title: 'Adapters',
    description: 'Framework adapters for Next.js and other platforms',
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
} as const

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
        <MDX />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  return Object.keys(pages).map(slug => ({
    slug: slug === 'index' ? undefined : [slug],
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

