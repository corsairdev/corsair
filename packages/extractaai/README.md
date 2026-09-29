# @corsair-dev/extractaai

Extractaai plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/extractaai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `classification.create` | `extractaai.api.classification.create` | `write` | Create a document classification (EXTRACTA_AI_CREATE_CLASSIFICATION) |
| `classification.delete` | `extractaai.api.classification.delete` | `destructive` | Delete a document classification (EXTRACTA_AI_DELETE_CLASSIFICATION) [DESTRUCTIVE · IRREVERSIBLE] |
| `classification.update` | `extractaai.api.classification.update` | `write` | Update a document classification (EXTRACTA_AI_UPDATE_CLASSIFICATION) |
| `classification.view` | `extractaai.api.classification.view` | `read` | View a document classification configuration (EXTRACTA_AI_VIEW_CLASSIFICATION) |
| `credits.get` | `extractaai.api.credits.get` | `read` | Get the account credit balance (EXTRACTA_AI_GET_CREDITS) |
| `extraction.create` | `extractaai.api.extraction.create` | `write` | Create a document extraction template (EXTRACTA_AI_CREATE_EXTRACTION) |
| `extraction.delete` | `extractaai.api.extraction.delete` | `destructive` | Delete an extraction, batch, or file (EXTRACTA_AI_DELETE_EXTRACTION) [DESTRUCTIVE · IRREVERSIBLE] |
| `extraction.getBatchResults` | `extractaai.api.extraction.getBatchResults` | `read` | Get extraction results for a batch (EXTRACTA_AI_GET_BATCH_RESULTS) |
| `extraction.update` | `extractaai.api.extraction.update` | `write` | Update a document extraction configuration (EXTRACTA_AI_UPDATE_EXTRACTION) |
| `extraction.view` | `extractaai.api.extraction.view` | `read` | View a document extraction configuration (EXTRACTA_AI_VIEW_EXTRACTION) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/extractaai

## License

Apache-2.0
