# @corsair-dev/docraptor

DocRaptor plugin for Corsair: convert HTML or XML into PDF and Excel documents, synchronously, asynchronously with status polling, or as paid hosted documents.

## Install

```bash
pnpm add @corsair-dev/docraptor
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `documents.createAsync` | `docraptor.api.documents.createAsync` | `write` | Queue an HTML-to-PDF or XML-to-Excel conversion and return its status_id; poll documents.status for the download_url |
| `documents.createHosted` | `docraptor.api.documents.createHosted` | `write` | Generate a document and host it at a public DocRaptor URL, a paid add-on; the URL is billed per download |
| `documents.createHostedAsync` | `docraptor.api.documents.createHostedAsync` | `write` | Queue a hosted document (paid add-on) and return its status_id; poll documents.status for the public download_url |
| `documents.expire` | `docraptor.api.documents.expire` | `destructive` | Permanently remove a hosted document so its public URL stops working; this cannot be undone |
| `documents.list` | `docraptor.api.documents.list` | `read` | List generated documents with paging; test-mode keys are denied this listing |
| `documents.status` | `docraptor.api.documents.status` | `read` | Read where an asynchronous document stands: queued or working, completed with its download_url, or failed with validation errors |
| `ips.list` | `docraptor.api.ips.list` | `read` | List DocRaptor's outbound IP addresses, for allowlisting callbacks |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/docraptor

## License

Apache-2.0
