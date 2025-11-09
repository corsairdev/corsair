import type { Root } from 'fumadocs-core/page-tree'

export const tree: Root = {
  name: 'Docs',
  children: [
    { type: 'page', name: 'Introduction', url: '/' },
    { type: 'page', name: 'Overview', url: '/overview' },
    { type: 'page', name: 'Installation', url: '/installation' },
    { type: 'page', name: 'Quickstart', url: '/quickstart' },
    { type: 'page', name: 'Core Concepts', url: '/core-concepts' },
    { type: 'page', name: 'CLI', url: '/cli' },
    { type: 'page', name: 'Adapters', url: '/adapters' },
  ],
}
