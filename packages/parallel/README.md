# @corsair-dev/parallel

Parallel plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/parallel
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `chat.create` | `parallel.api.chat.create` | `read` | Create a non-streaming chat completion |
| `decisions.create` | `parallel.api.decisions.create` | `read` | Answer grounded decision questions |
| `extract.extract` | `parallel.api.extract.extract` | `read` | Extract content from web URLs |
| `findall.cancel` | `parallel.api.findall.cancel` | `write` | Cancel a FindAll run |
| `findall.createRun` | `parallel.api.findall.createRun` | `write` | Create a FindAll run |
| `findall.enrich` | `parallel.api.findall.enrich` | `write` | Enrich a FindAll run |
| `findall.entitySearch` | `parallel.api.findall.entitySearch` | `read` | Search for entities |
| `findall.extend` | `parallel.api.findall.extend` | `write` | Extend a FindAll run |
| `findall.getRun` | `parallel.api.findall.getRun` | `read` | Get a FindAll run |
| `findall.ingest` | `parallel.api.findall.ingest` | `read` | Create an entity search specification |
| `findall.result` | `parallel.api.findall.result` | `read` | Get FindAll results |
| `findall.schema` | `parallel.api.findall.schema` | `read` | Get the FindAll schema |
| `images.search` | `parallel.api.images.search` | `read` | Search for images |
| `memory.clear` | `parallel.api.memory.clear` | `destructive` | Clear a memory scope |
| `memory.evict` | `parallel.api.memory.evict` | `destructive` | Evict a memory source |
| `memory.retrieve` | `parallel.api.memory.retrieve` | `read` | Retrieve memories |
| `monitors.cancel` | `parallel.api.monitors.cancel` | `destructive` | Permanently cancel a monitor |
| `monitors.create` | `parallel.api.monitors.create` | `write` | Create a monitor |
| `monitors.events` | `parallel.api.monitors.events` | `read` | List monitor events |
| `monitors.get` | `parallel.api.monitors.get` | `read` | Get a monitor |
| `monitors.list` | `parallel.api.monitors.list` | `read` | List monitors |
| `monitors.stats` | `parallel.api.monitors.stats` | `read` | Get monitor statistics |
| `monitors.trigger` | `parallel.api.monitors.trigger` | `write` | Trigger a monitor run |
| `monitors.update` | `parallel.api.monitors.update` | `write` | Update a monitor |
| `places.search` | `parallel.api.places.search` | `read` | Search for places by location |
| `responses.create` | `parallel.api.responses.create` | `read` | Create a non-streaming response |
| `search.search` | `parallel.api.search.search` | `read` | Search the web for relevant sources and excerpts |
| `tasks.addGroupRuns` | `parallel.api.tasks.addGroupRuns` | `write` | Add runs to a task group |
| `tasks.createGroup` | `parallel.api.tasks.createGroup` | `write` | Create a task group |
| `tasks.createRun` | `parallel.api.tasks.createRun` | `write` | Create a task run |
| `tasks.getGroup` | `parallel.api.tasks.getGroup` | `read` | Get a task group |
| `tasks.getGroupRun` | `parallel.api.tasks.getGroupRun` | `read` | Get a run in a task group |
| `tasks.getResult` | `parallel.api.tasks.getResult` | `read` | Get task run result |
| `tasks.getRun` | `parallel.api.tasks.getRun` | `read` | Get a task run |
| `tasks.getRunInput` | `parallel.api.tasks.getRunInput` | `read` | Get task run input |

Chat and Responses support non-streaming requests only. The four SSE-only
operations are not supported.

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Task, FindAll, and Monitor requests support configuring Parallel's outbound
webhooks. This plugin does not receive, route, or verify inbound webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/parallel

## License

Apache-2.0
