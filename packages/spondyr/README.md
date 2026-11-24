# @corsair-dev/spondyr

Spondyr plugin for Corsair: generate and deliver template-driven correspondence, and manage its templates, recipients, conditions and search filters.

## Install

```bash
pnpm add @corsair-dev/spondyr
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `batch.send` | `spondyr.api.batch.send` | `write` | Generate correspondence for a list of data objects in one request, optionally merging shared data into each |
| `batch.status` | `spondyr.api.batch.status` | `read` | Read a batch progress: items processed, and the reference ID of each item that errored |
| `conditions.create` | `spondyr.api.conditions.create` | `write` | Create a Condition that decides which template is used |
| `conditions.delete` | `spondyr.api.conditions.delete` | `destructive` | Delete a Condition; templates that reference it stop matching |
| `conditions.get` | `spondyr.api.conditions.get` | `read` | Get one Condition and the field it inspects |
| `conditions.list` | `spondyr.api.conditions.list` | `read` | List the template-selection Conditions of a Transaction Type |
| `conditions.update` | `spondyr.api.conditions.update` | `write` | Change a Condition field or its accepted values |
| `correspondence.deliver` | `spondyr.api.correspondence.deliver` | `write` | Deliver correspondence that was generated with `is_generate_only`, optionally to extra recipients |
| `correspondence.retry` | `spondyr.api.correspondence.retry` | `write` | Retry the templates that errored on a previous request |
| `correspondence.search` | `spondyr.api.correspondence.search` | `read` | Search past requests by batch, Event Type or Search Filter, with paging up to 250 a page |
| `correspondence.send` | `spondyr.api.correspondence.send` | `write` | Generate correspondence from a Transaction Type and either deliver it or hold it for `correspondence.deliver` |
| `correspondence.status` | `spondyr.api.correspondence.status` | `read` | Read the status of a generated request, one entry per template, with each recipient delivery result |
| `eventTypes.create` | `spondyr.api.eventTypes.create` | `write` | Add an Event Type to a Transaction Type |
| `eventTypes.delete` | `spondyr.api.eventTypes.delete` | `destructive` | Delete an Event Type; templates that reference it stop matching |
| `eventTypes.get` | `spondyr.api.eventTypes.get` | `read` | Get one Event Type and the Transaction Type it belongs to |
| `eventTypes.list` | `spondyr.api.eventTypes.list` | `read` | List the Event Types of one Transaction Type |
| `eventTypes.update` | `spondyr.api.eventTypes.update` | `write` | Rename an Event Type or move it to another Transaction Type |
| `recipients.create` | `spondyr.api.recipients.create` | `write` | Create a Recipient; any address field may hold a `{FieldName}` placeholder |
| `recipients.delete` | `spondyr.api.recipients.delete` | `destructive` | Delete a Recipient; templates that name it stop resolving |
| `recipients.get` | `spondyr.api.recipients.get` | `read` | Get one Recipient and the placeholder fields it resolves |
| `recipients.list` | `spondyr.api.recipients.list` | `read` | List a Transaction Type's Recipients with their addresses |
| `recipients.update` | `spondyr.api.recipients.update` | `write` | Change a Recipient name, address or placeholder fields |
| `searchFilters.create` | `spondyr.api.searchFilters.create` | `write` | Create a Search Filter that tags generated correspondence for later search |
| `searchFilters.delete` | `spondyr.api.searchFilters.delete` | `destructive` | Delete a Search Filter; existing tags stay on the documents |
| `searchFilters.get` | `spondyr.api.searchFilters.get` | `read` | Get one Search Filter and the tag it writes onto correspondence |
| `searchFilters.list` | `spondyr.api.searchFilters.list` | `read` | List a Transaction Type's Search Filters |
| `searchFilters.update` | `spondyr.api.searchFilters.update` | `write` | Change a Search Filter tag |
| `templates.create` | `spondyr.api.templates.create` | `write` | Create a template from previously uploaded content, with its delivery recipients and conditions |
| `templates.delete` | `spondyr.api.templates.delete` | `destructive` | Delete a template |
| `templates.get` | `spondyr.api.templates.get` | `read` | Get one template with its content reference, recipients, conditions and search filters |
| `templates.list` | `spondyr.api.templates.list` | `read` | List the templates of a Transaction Type with their recipients |
| `templates.update` | `spondyr.api.templates.update` | `write` | Change a template content, recipients, conditions or searches |
| `templates.uploadContent` | `spondyr.api.templates.uploadContent` | `write` | Upload a template file as base64 and return the reference ID a template needs; the content can attach to one template only |
| `transactionTypes.create` | `spondyr.api.transactionTypes.create` | `write` | Create a Transaction Type from a JSON sample that defines the template fields |
| `transactionTypes.delete` | `spondyr.api.transactionTypes.delete` | `destructive` | Delete a Transaction Type; every template, condition and search filter built on it goes with it |
| `transactionTypes.get` | `spondyr.api.transactionTypes.get` | `read` | Get one Transaction Type with its JSON and CSV field samples |
| `transactionTypes.list` | `spondyr.api.transactionTypes.list` | `read` | List the Transaction Types on the subscription |
| `transactionTypes.update` | `spondyr.api.transactionTypes.update` | `write` | Change a Transaction Type name or its JSON sample |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/spondyr

## License

Apache-2.0
