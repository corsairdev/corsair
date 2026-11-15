# @corsair-dev/sanity

Sanity plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/sanity
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `agentActions.generate` | `sanity.api.agentActions.generate` | `write` | Have Sanity's AI write content into a document's fields from an instruction, following the schema. Writes to the draft unless forcePublishedWrite; noWrite returns it without saving. Costs one Sanity AI credit. |
| `agentActions.prompt` | `sanity.api.agentActions.prompt` | `read` | Ask Sanity's AI a question, optionally about documents passed as params, and get text or JSON back. Writes nothing. Costs one Sanity AI credit. |
| `agentActions.transform` | `sanity.api.agentActions.transform` | `write` | Have Sanity's AI rewrite a document's existing content by an instruction (tone, length, style), in place or into another document. Costs one Sanity AI credit. |
| `agentActions.translate` | `sanity.api.agentActions.translate` | `write` | Have Sanity's AI translate a document into another language, usually into a new document. Costs one Sanity AI credit. |
| `assets.upload` | `sanity.api.assets.upload` | `write` | Upload an image or file (base64, up to 25 MB) as a Sanity asset and get its asset document and CDN URL, ready to reference from a document. |
| `datasets.create` | `sanity.api.datasets.create` | `write` | Create an empty dataset in the project. Needs an administrator token. |
| `datasets.delete` | `sanity.api.datasets.delete` | `destructive` | Delete a dataset with every document and asset in it, for good. Needs the name twice and an administrator token. |
| `datasets.list` | `sanity.api.datasets.list` | `read` | The project's datasets and whether each is public. |
| `documents.create` | `sanity.api.documents.create` | `write` | Create a document as a draft (default) or, with publish: true, publish it at once. Returns its id and draft id. |
| `documents.delete` | `sanity.api.documents.delete` | `destructive` | Delete up to 100 documents, published and draft together. Documents that reference them must drop the references first. With purge, they also leave the history. |
| `documents.discardDraft` | `sanity.api.documents.discardDraft` | `destructive` | Throw away a document's unpublished changes (its draft). The published version stays. With purge, the draft also leaves the history. |
| `documents.edit` | `sanity.api.documents.edit` | `write` | Change a document the way the Studio does: the patch goes to its draft, made from the published version if needed, and nothing goes live until documents.publish (or publish: true). |
| `documents.get` | `sanity.api.documents.get` | `read` | Fetch up to 100 documents by exact id (drafts.<id> for a draft). Ids that are missing or unreadable come back in omitted. |
| `documents.history` | `sanity.api.documents.history` | `read` | A document as it stood at a revision or a point in time. How far back depends on the plan's history retention. |
| `documents.mutate` | `sanity.api.documents.mutate` | `destructive` | Apply raw Sanity mutations (create, createOrReplace, createIfNotExists, patch, delete, by id or by query) in one transaction. For anything documents.create, edit, patch and delete can't express. |
| `documents.patch` | `sanity.api.documents.patch` | `write` | Patch one exact document id directly and get it back. A published id changes the live document at once; use documents.edit to go through a draft. ifRevisionId guards against overwriting someone else's change. |
| `documents.publish` | `sanity.api.documents.publish` | `write` | Publish a document's draft: the draft replaces the published version and goes away. Fails when there is no draft. |
| `documents.query` | `sanity.api.documents.query` | `read` | Run a GROQ query against a dataset and get its result. Reads published documents unless perspective says otherwise. Pass user input as params. |
| `documents.transactions` | `sanity.api.documents.transactions` | `read` | The transactions that changed some documents: when, by whom and which revisions, optionally with each mutation. |
| `documents.unpublish` | `sanity.api.documents.unpublish` | `write` | Take a published document off the published perspective; its content stays as a draft. |
| `schemas.list` | `sanity.api.schemas.list` | `read` | The schemas deployed to a dataset: their ids (the schemaId Agent Actions take) and each type's fields. Pass type for one type's full definition. Read this before writing documents of a type you don't know. |
| `webhooks.attempts` | `sanity.api.webhooks.attempts` | `read` | Recent delivery attempts of a webhook with the status your endpoint answered, to debug failing deliveries. |
| `webhooks.create` | `sanity.api.webhooks.create` | `write` | Create a webhook that POSTs to a URL when documents matching a GROQ filter are created, updated or deleted. Set a secret so deliveries can be verified. |
| `webhooks.delete` | `sanity.api.webhooks.delete` | `destructive` | Delete a webhook; deliveries stop at once. |
| `webhooks.list` | `sanity.api.webhooks.list` | `read` | The project's GROQ-powered webhooks: url, dataset, filter, projection and whether each is signed (never the secret). |
| `webhooks.update` | `sanity.api.webhooks.update` | `write` | Change a webhook's url, filter, projection, events or secret, or pause and resume it with disabled. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/sanity

## License

Apache-2.0
