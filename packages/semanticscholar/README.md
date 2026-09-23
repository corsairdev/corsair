# @corsair-dev/semanticscholar

SemanticScholar plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/semanticscholar
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `authors.batchGet` | `semanticscholar.api.authors.batchGet` | `read` | Retrieve details for up to 1000 authors in one request |
| `authors.get` | `semanticscholar.api.authors.get` | `read` | Retrieve details about an author by Semantic Scholar author ID |
| `authors.listPapers` | `semanticscholar.api.authors.listPapers` | `read` | List papers written by an author with offset pagination |
| `authors.search` | `semanticscholar.api.authors.search` | `read` | Search authors by name |
| `datasets.get` | `semanticscholar.api.datasets.get` | `read` | Get download links for a dataset in a release |
| `datasets.getDiffs` | `semanticscholar.api.datasets.getDiffs` | `read` | Get incremental dataset diffs between two releases |
| `datasets.getRelease` | `semanticscholar.api.datasets.getRelease` | `read` | Retrieve dataset release metadata |
| `datasets.listReleases` | `semanticscholar.api.datasets.listReleases` | `read` | List available Semantic Scholar dataset releases |
| `papers.autocomplete` | `semanticscholar.api.papers.autocomplete` | `read` | Suggest paper query completions for a partial query |
| `papers.batchGet` | `semanticscholar.api.papers.batchGet` | `read` | Retrieve details for up to 500 papers in one request |
| `papers.get` | `semanticscholar.api.papers.get` | `read` | Retrieve details about a paper by Semantic Scholar-supported ID |
| `papers.listAuthors` | `semanticscholar.api.papers.listAuthors` | `read` | List authors for a paper with offset pagination |
| `papers.listCitations` | `semanticscholar.api.papers.listCitations` | `read` | List papers that cite a paper with offset pagination |
| `papers.listReferences` | `semanticscholar.api.papers.listReferences` | `read` | List references cited by a paper with offset pagination |
| `papers.matchTitle` | `semanticscholar.api.papers.matchTitle` | `read` | Find the closest paper title match for a query |
| `papers.relevanceSearch` | `semanticscholar.api.papers.relevanceSearch` | `read` | Deprecated alias for paper relevance search; use papers.search for new code |
| `papers.search` | `semanticscholar.api.papers.search` | `read` | Search papers by relevance with optional publication filters |
| `papers.searchBulk` | `semanticscholar.api.papers.searchBulk` | `read` | Bulk search papers with token pagination and optional sorting |
| `recommendations.forPaper` | `semanticscholar.api.recommendations.forPaper` | `read` | Get recommended papers for one source paper |
| `recommendations.fromPaperLists` | `semanticscholar.api.recommendations.fromPaperLists` | `read` | Get paper recommendations from positive and optional negative paper examples |
| `snippets.searchText` | `semanticscholar.api.snippets.searchText` | `read` | Search text snippets within Semantic Scholar papers |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/semanticscholar

## License

Apache-2.0
