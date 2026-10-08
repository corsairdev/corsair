# @corsair-dev/reducto

Reducto plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/reducto
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.configureWebhook` | `reducto.api.account.configureWebhook` | `write` | Open the Svix webhook portal URL for this account |
| `account.version` | `reducto.api.account.version` | `read` | Read the Reducto API version |
| `classify.classify` | `reducto.api.classify.classify` | `write` | Classify a document against a list of categories |
| `classify.classifyAsync` | `reducto.api.classify.classifyAsync` | `write` | Start a classify job and return its job id |
| `edit.edit` | `reducto.api.edit.edit` | `write` | Fill or edit a PDF or DOCX from natural language instructions |
| `edit.editAsync` | `reducto.api.edit.editAsync` | `write` | Start an edit job and return its job id |
| `extract.extract` | `reducto.api.extract.extract` | `write` | Extract fields from a document using a JSON schema |
| `extract.extractAsync` | `reducto.api.extract.extractAsync` | `write` | Start an extract job and return its job id |
| `files.delete` | `reducto.api.files.delete` | `destructive` | Delete an uploaded file. Free plans return 422 NOT_APPLICABLE; Growth and Enterprise delete it |
| `files.upload` | `reducto.api.files.upload` | `write` | Upload a file and return a reducto:// file id |
| `jobs.cancel` | `reducto.api.jobs.cancel` | `destructive` | Cancel a running job |
| `jobs.delete` | `reducto.api.jobs.delete` | `destructive` | Delete a job and its stored artifacts. Returns 202. Free plans return 422 NOT_APPLICABLE |
| `jobs.get` | `reducto.api.jobs.get` | `read` | Retrieve a job status and, when finished, its result |
| `jobs.list` | `reducto.api.jobs.list` | `read` | List jobs, page by page, using cursor and limit |
| `parse.parse` | `reducto.api.parse.parse` | `write` | Parse a document into chunks of text, tables, and figures with bounding boxes |
| `parse.parseAsync` | `reducto.api.parse.parseAsync` | `write` | Start a parse job and return its job id |
| `pipeline.run` | `reducto.api.pipeline.run` | `write` | Run a Studio pipeline against a document |
| `pipeline.runAsync` | `reducto.api.pipeline.runAsync` | `write` | Start a Studio pipeline job and return its job id |
| `split.split` | `reducto.api.split.split` | `write` | Split a document into named sections by page |
| `split.splitAsync` | `reducto.api.split.splitAsync` | `write` | Start a split job and return its job id |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/reducto

## License

Apache-2.0
