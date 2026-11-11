# @corsair-dev/vectorshift

VectorShift plugin for Corsair - run and create pipelines in bulk, create and query knowledge bases, run chatbots, and execute transformations in VectorShift's sandbox.

## Install

```bash
pnpm add @corsair-dev/vectorshift
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `chatbots.create` | `vectorshift.api.chatbots.create` | `write` | Create a chatbot over a pipeline, naming the input and output nodes its messages use |
| `chatbots.run` | `vectorshift.api.chatbots.run` | `write` | Send a text or audio message to a chatbot and read its reply, continuing a conversation by id |
| `knowledgeBases.create` | `vectorshift.api.knowledgeBases.create` | `write` | Create a knowledge base, choosing the file parser, chunk size and overlap |
| `knowledgeBases.get` | `vectorshift.api.knowledgeBases.get` | `read` | Read one knowledge base by id, or by name with an optional owner |
| `knowledgeBases.query` | `vectorshift.api.knowledgeBases.query` | `write` | Ask one or more questions of a knowledge base, with retrieval, reranking and answering switches |
| `pipelines.bulkRun` | `vectorshift.api.pipelines.bulkRun` | `write` | Run one pipeline once per entry in parallel, with separate inputs and a run id each |
| `pipelines.create` | `vectorshift.api.pipelines.create` | `write` | Create a pipeline from a builder graph, passed through unchanged |
| `pipelines.list` | `vectorshift.api.pipelines.list` | `read` | List pipeline ids, optionally including shared pipelines and the full objects |
| `pipelines.run` | `vectorshift.api.pipelines.run` | `write` | Run a pipeline with the given inputs and read back every output node value |
| `transformations.create` | `vectorshift.api.transformations.create` | `write` | Create a transformation from a Python function and its input and output schemas |
| `transformations.run` | `vectorshift.api.transformations.run` | `write` | Run a transformation in VectorShift's sandbox with the given arguments |

## Auth

Auth: API key. A call with no saved key throws `AuthMissingError`; Corsair does not prompt for one. Store a key for the tenant, connect through Hub, or pass `vectorshift({ key })`.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/vectorshift

## License

Apache-2.0
