import defaultComponents from 'fumadocs-ui/mdx'
import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { TypeTable } from 'fumadocs-ui/components/type-table'

export function useMDXComponents(components?: any): any {
  return {
    ...defaultComponents,
    Callout,
    Tabs,
    Tab,
    TypeTable,
    ...components,
  }
}

