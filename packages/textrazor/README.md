# @corsair-dev/textrazor

TextRazor plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/textrazor
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `textrazor.api.account.get` | `read` | Get the current TextRazor plan, concurrency limits, and daily usage |
| `analysis.analyzeContent` | `textrazor.api.analysis.analyzeContent` | `read` | Analyze text or a URL with one or more TextRazor extractors in a single call |
| `analysis.classifyText` | `textrazor.api.analysis.classifyText` | `read` | Classify text or a URL against built-in or custom TextRazor classifiers |
| `analysis.extractEntities` | `textrazor.api.analysis.extractEntities` | `read` | Extract named entities from text or a URL, optionally filtering by relevance and confidence |
| `classifiers.delete` | `textrazor.api.classifiers.delete` | `destructive` | Delete a custom classifier and all of its categories |
| `classifiers.deleteCategory` | `textrazor.api.classifiers.deleteCategory` | `destructive` | Delete a category from a custom classifier |
| `classifiers.getCategory` | `textrazor.api.classifiers.getCategory` | `read` | Get a category from a custom classifier by id |
| `classifiers.listCategories` | `textrazor.api.classifiers.listCategories` | `read` | List categories for a custom classifier with limit and offset pagination |
| `classifiers.put` | `textrazor.api.classifiers.put` | `write` | Create or update a custom classifier from JSON categories |
| `dictionaries.addEntries` | `textrazor.api.dictionaries.addEntries` | `write` | Add or overwrite entries in a custom entity dictionary |
| `dictionaries.create` | `textrazor.api.dictionaries.create` | `write` | Create a custom entity dictionary |
| `dictionaries.delete` | `textrazor.api.dictionaries.delete` | `destructive` | Delete a custom entity dictionary and all of its entries |
| `dictionaries.deleteEntry` | `textrazor.api.dictionaries.deleteEntry` | `destructive` | Delete a dictionary entry by id |
| `dictionaries.get` | `textrazor.api.dictionaries.get` | `read` | Get a custom entity dictionary by id |
| `dictionaries.getEntry` | `textrazor.api.dictionaries.getEntry` | `read` | Get a dictionary entry by id |
| `dictionaries.list` | `textrazor.api.dictionaries.list` | `read` | List custom entity dictionaries on the account |
| `dictionaries.listEntries` | `textrazor.api.dictionaries.listEntries` | `read` | List dictionary entries with limit and offset pagination |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/textrazor

## License

Apache-2.0
