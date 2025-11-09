import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page'

export default function Page() {
  return (
    <DocsPage>
      <DocsTitle>Corsair Docs</DocsTitle>
      <DocsDescription>
        Use the sidebar to explore the docs, or start here.
      </DocsDescription>
      <DocsBody>
        <ul>
          <li>
            <a href="/overview">Overview</a>
          </li>
          <li>
            <a href="/installation">Installation</a>
          </li>
          <li>
            <a href="/quickstart">Quickstart</a>
          </li>
          <li>
            <a href="/core-concepts">Core Concepts</a>
          </li>
          <li>
            <a href="/cli">CLI</a>
          </li>
          <li>
            <a href="/adapters">Adapters</a>
          </li>
        </ul>
      </DocsBody>
    </DocsPage>
  )
}
