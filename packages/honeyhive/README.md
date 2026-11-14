# @corsair-dev/honeyhive

HoneyHive plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/honeyhive
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `configurations.create` | `honeyhive.api.configurations.create` | `destructive` | Create a new configuration |
| `configurations.delete` | `honeyhive.api.configurations.delete` | `destructive` | Delete a configuration |
| `configurations.list` | `honeyhive.api.configurations.list` | `read` | List LLM and pipeline configurations |
| `configurations.update` | `honeyhive.api.configurations.update` | `destructive` | Update an existing configuration |
| `datasets.addDatapoints` | `honeyhive.api.datasets.addDatapoints` | `destructive` | Add datapoints to a dataset |
| `datasets.create` | `honeyhive.api.datasets.create` | `destructive` | Create a new dataset in a project |
| `datasets.createLegacy` | `honeyhive.api.datasets.createLegacy` | `destructive` | Create a new dataset (legacy) |
| `datasets.delete` | `honeyhive.api.datasets.delete` | `destructive` | Delete a dataset from a project |
| `datasets.deleteLegacy` | `honeyhive.api.datasets.deleteLegacy` | `destructive` | Delete a dataset (legacy) |
| `datasets.list` | `honeyhive.api.datasets.list` | `read` | List datasets in a project |
| `datasets.listLegacy` | `honeyhive.api.datasets.listLegacy` | `read` | List datasets (legacy) |
| `datasets.removeDatapoint` | `honeyhive.api.datasets.removeDatapoint` | `destructive` | Remove a datapoint from a dataset |
| `datasets.update` | `honeyhive.api.datasets.update` | `destructive` | Update an existing dataset in a project |
| `datasets.updateLegacy` | `honeyhive.api.datasets.updateLegacy` | `destructive` | Update a dataset (legacy) |
| `events.create` | `honeyhive.api.events.create` | `write` | Create a new trace event |
| `events.createBatch` | `honeyhive.api.events.createBatch` | `write` | Create a batch of trace events |
| `events.get` | `honeyhive.api.events.get` | `read` | Get a trace event by project and event ID |
| `events.getLegacy` | `honeyhive.api.events.getLegacy` | `read` | Get a trace event by event ID (legacy) |
| `events.search` | `honeyhive.api.events.search` | `read` | Search trace events within a project |
| `events.searchLegacy` | `honeyhive.api.events.searchLegacy` | `read` | Search trace events (legacy) |
| `events.update` | `honeyhive.api.events.update` | `write` | Update a trace event |
| `experiments.compare` | `honeyhive.api.experiments.compare` | `read` | Compare two evaluation runs |
| `experiments.compareEvents` | `honeyhive.api.experiments.compareEvents` | `read` | Compare events between two evaluation runs |
| `experiments.createRun` | `honeyhive.api.experiments.createRun` | `destructive` | Create an evaluation run in a project |
| `experiments.createRunLegacy` | `honeyhive.api.experiments.createRunLegacy` | `destructive` | Create an evaluation run (legacy) |
| `experiments.deleteRun` | `honeyhive.api.experiments.deleteRun` | `destructive` | Delete an evaluation run |
| `experiments.getMetrics` | `honeyhive.api.experiments.getMetrics` | `read` | Get metric events for an evaluation run |
| `experiments.getRun` | `honeyhive.api.experiments.getRun` | `read` | Get evaluation run details |
| `experiments.getRunLegacy` | `honeyhive.api.experiments.getRunLegacy` | `read` | Get evaluation run details (legacy) |
| `experiments.getRunSchema` | `honeyhive.api.experiments.getRunSchema` | `read` | Get event schema for a single run |
| `experiments.getRunsSchema` | `honeyhive.api.experiments.getRunsSchema` | `read` | Get event schema across runs in a project |
| `experiments.getSummary` | `honeyhive.api.experiments.getSummary` | `read` | Get summary statistics for an evaluation run |
| `experiments.listRuns` | `honeyhive.api.experiments.listRuns` | `read` | List evaluation runs in a project |
| `experiments.listRunsLegacy` | `honeyhive.api.experiments.listRunsLegacy` | `read` | List evaluation runs (legacy) |
| `experiments.updateRun` | `honeyhive.api.experiments.updateRun` | `destructive` | Update an evaluation run |
| `metrics.create` | `honeyhive.api.metrics.create` | `write` | Create a new evaluator metric |
| `metrics.createVersion` | `honeyhive.api.metrics.createVersion` | `write` | Create a new version snapshot for a metric |
| `metrics.delete` | `honeyhive.api.metrics.delete` | `destructive` | Delete an evaluator metric |
| `metrics.deployVersion` | `honeyhive.api.metrics.deployVersion` | `write` | Deploy a specific version of a metric |
| `metrics.list` | `honeyhive.api.metrics.list` | `read` | List all metrics and evaluators |
| `metrics.listVersions` | `honeyhive.api.metrics.listVersions` | `read` | List versions of a metric |
| `metrics.run` | `honeyhive.api.metrics.run` | `write` | Run an evaluator metric on an event |
| `metrics.update` | `honeyhive.api.metrics.update` | `write` | Update an evaluator metric |
| `projects.create` | `honeyhive.api.projects.create` | `destructive` | Create a new project in a workspace |
| `projects.delete` | `honeyhive.api.projects.delete` | `destructive` | Delete a project |
| `projects.get` | `honeyhive.api.projects.get` | `read` | Get details for a project |
| `projects.update` | `honeyhive.api.projects.update` | `destructive` | Update a project name or description |
| `sessions.create` | `honeyhive.api.sessions.create` | `write` | Start a new session |
| `sessions.createEventBatch` | `honeyhive.api.sessions.createEventBatch` | `write` | Add a batch of events to a session |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/honeyhive

## License

Apache-2.0
