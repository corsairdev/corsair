import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { ReactNode } from 'react'
import { tree } from '@/lib/tree'

export default function Layout(props: { children: ReactNode }) {
  return <DocsLayout tree={tree}>{props.children}</DocsLayout>
}
