# @corsair-dev/kadoa

Kadoa plugin for Corsair: build and manage web-extraction workflows, read their extracted rows and detected data changes, and manage schemas, variables, triggers and delivery destinations.

## Install

```bash
pnpm add @corsair-dev/kadoa
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `changes.get` | `kadoa.api.changes.get` | `read` | One detected data change with its differences and current data |
| `changes.list` | `kadoa.api.changes.list` | `read` | Data changes detected across workflows in a date window, with the changed fields and counts; `exclude` drops the large arrays |
| `locations.list` | `kadoa.api.locations.list` | `read` | Countries a workflow can scrape from, with their ISO codes |
| `schemas.create` | `kadoa.api.schemas.create` | `write` | Create an extraction schema from typed data fields or classification fields, for workflows to reuse |
| `schemas.delete` | `kadoa.api.schemas.delete` | `destructive` | Delete a schema and every revision of it; it cannot be restored |
| `schemas.get` | `kadoa.api.schemas.get` | `read` | One extraction schema with its fields and entity |
| `schemas.list` | `kadoa.api.schemas.list` | `read` | Every extraction schema the caller can see |
| `schemas.update` | `kadoa.api.schemas.update` | `write` | Rename a schema, change its entity, or publish a new revision from replacement fields; workflows on the old revision keep it |
| `triggers.list` | `kadoa.api.triggers.list` | `read` | Triggers where this workflow is the source, plus the incoming ones that start it |
| `variables.create` | `kadoa.api.variables.create` | `write` | Create a string, number, object or array variable, or a secret held by Kadoa or read from your Google Secret Manager |
| `variables.delete` | `kadoa.api.variables.delete` | `destructive` | Delete a variable; a secret still bound to a connection is refused with a 409 |
| `variables.get` | `kadoa.api.variables.get` | `read` | One variable by ID; a secret comes back without its value |
| `variables.list` | `kadoa.api.variables.list` | `read` | Team variables with their keys and values, optionally limited to one workflow’s; a secret’s value is never returned |
| `variables.update` | `kadoa.api.variables.update` | `write` | Change a variable’s key or value; a stored value cannot change type, and a secret’s new value is written only |
| `workflows.connectors` | `kadoa.api.workflows.connectors` | `read` | Destinations that receive this workflow’s results after each run, with the format each takes |
| `workflows.create` | `kadoa.api.workflows.create` | `destructive` | Create a workflow from a prompt, an existing schema, inline entity and fields, or a template; every URL must belong to one website. Spends Kadoa credits once it runs |
| `workflows.data` | `kadoa.api.workflows.data` | `read` | Extracted rows of a workflow’s latest published run, with filters, sorting and paging; `limit: 0` streams every row at once |
| `workflows.delete` | `kadoa.api.workflows.delete` | `destructive` | Delete a workflow along with its run history and stored data; it cannot be restored |
| `workflows.get` | `kadoa.api.workflows.get` | `read` | One workflow with its sources, schema, schedule, latest run state and pending fields |
| `workflows.history` | `kadoa.api.workflows.history` | `read` | Past runs of a workflow with their state, record count and errors, paged or by run ID |
| `workflows.jobStatus` | `kadoa.api.workflows.jobStatus` | `read` | Where a run stands: IN_PROGRESS, FINISHED, FAILED, NOT_SUPPORTED or FAILED_INSUFFICIENT_FUNDS, with any errors |
| `workflows.list` | `kadoa.api.workflows.list` | `read` | List workflows by name, ID, state or tag, with paging by skip; `statusFilters: ["group:attention"]` returns the ones waiting on you |
| `workflows.pause` | `kadoa.api.workflows.pause` | `write` | Pause a workflow so its schedule stops starting runs; workflows.resume turns it back on |
| `workflows.resume` | `kadoa.api.workflows.resume` | `destructive` | Unpause a paused workflow, or resume a preview or error workflow; a 202 means a fresh preview run was started and returned a jobId |
| `workflows.run` | `kadoa.api.workflows.run` | `destructive` | Start a run and get a jobId back at once; spends Kadoa credits. Follow it with workflows.jobStatus({ workflowId, jobId }), or read the result with workflows.data |
| `workflows.schedule` | `kadoa.api.workflows.schedule` | `write` | Set when a workflow’s next run starts, as a UTC time; the workflow needs a schedule for this to work |
| `workflows.stop` | `kadoa.api.workflows.stop` | `write` | Stop the workflow’s active run; queued steps are dropped and the step already running may finish |
| `workflows.updateMetadata` | `kadoa.api.workflows.updateMetadata` | `write` | Change a workflow’s name, description, tags, sources, record limit, schedule, location or monitored fields |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/kadoa

## License

Apache-2.0
