# @corsair-dev/neuronwriter

NEURONwriter plugin for Corsair: list projects, start and poll content analyses, read their target word count, terms and SERP competitors, and read, import or score article content.

## Install

```bash
pnpm add @corsair-dev/neuronwriter
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `analysis.get` | `neuronwriter.api.analysis.get` | `read` | Poll one analysis: the status alone while it runs, then the target word count, terms, questions and SERP competitors |
| `analysis.start` | `neuronwriter.api.analysis.start` | `destructive` | Queue a content analysis for a keyword, spending one Content Writer analysis from the monthly limit; poll analysis.get for the recommendations |
| `content.evaluate` | `neuronwriter.api.content.evaluate` | `read` | Score content against its analysis without saving a revision, so a draft can be checked before it is written back |
| `content.get` | `neuronwriter.api.content.get` | `read` | Read a query's last saved content revision, or the latest autosave as well |
| `content.import` | `neuronwriter.api.content.import` | `write` | Replace the editor content from HTML or a fetched URL, saving it as a new revision |
| `projects.list` | `neuronwriter.api.projects.list` | `read` | List the account's projects with the id, language and search engine each one uses |
| `queries.list` | `neuronwriter.api.queries.list` | `read` | List the queries in a project, filterable by status, source, keyword, language, engine, dates and tags |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/neuronwriter

## License

Apache-2.0
