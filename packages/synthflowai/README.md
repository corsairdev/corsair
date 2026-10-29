# @corsair-dev/synthflowai

Synthflow AI plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/synthflowai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `actions.attach` | `synthflowai.api.actions.attach` | `write` | Attach actions to a Synthflow AI agent |
| `actions.create` | `synthflowai.api.actions.create` | `write` | Create a new action in Synthflow AI |
| `actions.delete` | `synthflowai.api.actions.delete` | `destructive` | Delete an action in Synthflow AI [DESTRUCTIVE] |
| `actions.detach` | `synthflowai.api.actions.detach` | `write` | Detach actions from a Synthflow AI agent |
| `actions.get` | `synthflowai.api.actions.get` | `read` | Retrieve metadata about a specific action by ID |
| `actions.list` | `synthflowai.api.actions.list` | `read` | List all actions in the workspace |
| `actions.update` | `synthflowai.api.actions.update` | `write` | Update an existing action in Synthflow AI |
| `assistants.create` | `synthflowai.api.assistants.create` | `write` | Create a new Synthflow AI assistant |
| `assistants.delete` | `synthflowai.api.assistants.delete` | `destructive` | Delete a Synthflow AI assistant [DESTRUCTIVE] |
| `assistants.get` | `synthflowai.api.assistants.get` | `read` | Retrieve details of an existing Synthflow AI assistant |
| `assistants.list` | `synthflowai.api.assistants.list` | `read` | List all Synthflow AI assistants |
| `assistants.update` | `synthflowai.api.assistants.update` | `write` | Update a Synthflow AI assistant's settings |
| `calls.create` | `synthflowai.api.calls.create` | `write` | Initiate an outbound voice call via Synthflow AI |
| `calls.get` | `synthflowai.api.calls.get` | `read` | Retrieve details and transcript of a phone call |
| `calls.list` | `synthflowai.api.calls.list` | `read` | List call history logs for a Synthflow AI model |
| `contacts.create` | `synthflowai.api.contacts.create` | `write` | Create a new contact in Synthflow AI |
| `contacts.delete` | `synthflowai.api.contacts.delete` | `destructive` | Delete a contact in Synthflow AI [DESTRUCTIVE] |
| `contacts.get` | `synthflowai.api.contacts.get` | `read` | Retrieve details of a contact by ID |
| `contacts.list` | `synthflowai.api.contacts.list` | `read` | List contacts in Synthflow AI |
| `contacts.update` | `synthflowai.api.contacts.update` | `write` | Update contact details in Synthflow AI |
| `knowledgeBases.attach` | `synthflowai.api.knowledgeBases.attach` | `write` | Attach a knowledge base to an assistant model |
| `knowledgeBases.create` | `synthflowai.api.knowledgeBases.create` | `write` | Create a new knowledge base in Synthflow AI |
| `knowledgeBases.delete` | `synthflowai.api.knowledgeBases.delete` | `destructive` | Delete a knowledge base in Synthflow AI [DESTRUCTIVE] |
| `knowledgeBases.detach` | `synthflowai.api.knowledgeBases.detach` | `write` | Detach a knowledge base from an assistant model |
| `knowledgeBases.get` | `synthflowai.api.knowledgeBases.get` | `read` | Get details of a knowledge base by ID |
| `knowledgeBases.update` | `synthflowai.api.knowledgeBases.update` | `write` | Update a knowledge base name or usage conditions |
| `memoryStores.attachToAgent` | `synthflowai.api.memoryStores.attachToAgent` | `write` | Attach a memory store to an assistant agent |
| `memoryStores.create` | `synthflowai.api.memoryStores.create` | `write` | Create a new memory store in Synthflow AI |
| `memoryStores.delete` | `synthflowai.api.memoryStores.delete` | `destructive` | Delete a memory store in Synthflow AI [DESTRUCTIVE] |
| `memoryStores.detachFromAgent` | `synthflowai.api.memoryStores.detachFromAgent` | `write` | Detach a memory store from an assistant agent |
| `memoryStores.get` | `synthflowai.api.memoryStores.get` | `read` | Get details of a memory store by ID |
| `memoryStores.list` | `synthflowai.api.memoryStores.list` | `read` | List memory stores in Synthflow AI |
| `memoryStores.update` | `synthflowai.api.memoryStores.update` | `write` | Update a memory store's title and description |
| `phoneBooks.create` | `synthflowai.api.phoneBooks.create` | `write` | Create a new phone book in Synthflow AI |
| `phoneBooks.delete` | `synthflowai.api.phoneBooks.delete` | `destructive` | Delete a phone book in Synthflow AI [DESTRUCTIVE] |
| `phoneBooks.list` | `synthflowai.api.phoneBooks.list` | `read` | List all phone books in the workspace |
| `voices.list` | `synthflowai.api.voices.list` | `read` | List all text-to-speech voices available in the workspace |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/synthflowai

## License

Apache-2.0
