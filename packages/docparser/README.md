# @corsair-dev/docparser

Docparser plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/docparser
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `documents.fetch` | `docparser.api.documents.fetch` | `destructive` | Import a document from a public URL into a parser. Uses parsing credits (one per 5 pages). Parsing takes a few minutes; check documents.status, then read results.get. |
| `documents.reintegrate` | `docparser.api.documents.reintegrate` | `destructive` | Send documents' parsed data to the parser's integrations and webhooks again. |
| `documents.reparse` | `docparser.api.documents.reparse` | `destructive` | Parse documents again with the parser's current rules, replacing their parsed data. Uses no extra credits. |
| `documents.status` | `docparser.api.documents.status` | `read` | Check whether a document has been imported and parsed (done), and list any failed jobs. |
| `documents.upload` | `docparser.api.documents.upload` | `destructive` | Upload a base64-encoded document into a parser. Uses parsing credits (one per 5 pages). Parsing takes a few minutes; check documents.status, then read results.get. |
| `models.list` | `docparser.api.models.list` | `read` | List the model layouts of one parser. |
| `parsers.list` | `docparser.api.parsers.list` | `read` | List document parsers (id and label). |
| `ping` | `docparser.api.ping` | `read` | Check that the API key is accepted. |
| `results.get` | `docparser.api.results.get` | `read` | Get the parsed data of one document. |
| `results.list` | `docparser.api.results.list` | `read` | Get the parsed data of a parser's documents, newest first (100 by default). Filter by upload or processing date or remote id. Each row holds the fields the parser extracted. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/docparser

## License

Apache-2.0
