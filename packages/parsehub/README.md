# @corsair-dev/parsehub

ParseHub plugin for Corsair: run ParseHub scraping projects and get the data they extract.

## Install

```bash
pnpm add @corsair-dev/parsehub
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `projects.list` | `parsehub.api.projects.list` | `read` | List the scraping projects on the ParseHub account, 20 at a time. |
| `projects.get` | `parsehub.api.projects.get` | `read` | Get one project with its last run, last ready run and the 20 most recent runs. |
| `projects.run` | `parsehub.api.projects.run` | `destructive` | Start a run of a project on the ParseHub cloud. Returns the new run; poll runs.get until data_ready. |
| `projects.getLastReadyData` | `parsehub.api.projects.getLastReadyData` | `read` | Get the extracted data of the most recent run of a project that has data ready. |
| `runs.get` | `parsehub.api.runs.get` | `read` | Get one run: status, data_ready, page count and timing. |
| `runs.getData` | `parsehub.api.runs.getData` | `read` | Get the data a run extracted, as JSON or CSV. |
| `runs.cancel` | `parsehub.api.runs.cancel` | `destructive` | Cancel a running run. Data extracted so far stays available. |
| `runs.delete` | `parsehub.api.runs.delete` | `destructive` | Delete a run and its data, cancelling it first if it is running. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/parsehub

## License

Apache-2.0
