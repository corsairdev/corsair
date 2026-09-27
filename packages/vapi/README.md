# @corsair-dev/vapi

Vapi plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/vapi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `assistants.create` | `vapi.api.assistants.create` | `write` | Create a new Vapi assistant |
| `assistants.delete` | `vapi.api.assistants.delete` | `destructive` | Delete a Vapi assistant [DESTRUCTIVE] |
| `assistants.get` | `vapi.api.assistants.get` | `read` | Retrieve a Vapi assistant by ID |
| `assistants.list` | `vapi.api.assistants.list` | `read` | List all Vapi assistants |
| `assistants.update` | `vapi.api.assistants.update` | `write` | Update a Vapi assistant |
| `calls.create` | `vapi.api.calls.create` | `write` | Create (initiate) a new Vapi call |
| `calls.delete` | `vapi.api.calls.delete` | `destructive` | Delete a Vapi call [DESTRUCTIVE] |
| `calls.get` | `vapi.api.calls.get` | `read` | Retrieve a Vapi call by ID |
| `calls.list` | `vapi.api.calls.list` | `read` | List all Vapi calls with optional filters |
| `calls.update` | `vapi.api.calls.update` | `write` | Update a Vapi call |
| `files.delete` | `vapi.api.files.delete` | `destructive` | Delete a Vapi file [DESTRUCTIVE] |
| `files.get` | `vapi.api.files.get` | `read` | Retrieve a Vapi file by ID |
| `files.list` | `vapi.api.files.list` | `read` | List all Vapi files |
| `files.update` | `vapi.api.files.update` | `write` | Update a Vapi file |
| `knowledgeBases.create` | `vapi.api.knowledgeBases.create` | `write` | Create a new Vapi knowledge base |
| `knowledgeBases.delete` | `vapi.api.knowledgeBases.delete` | `destructive` | Delete a Vapi knowledge base [DESTRUCTIVE] |
| `knowledgeBases.get` | `vapi.api.knowledgeBases.get` | `read` | Retrieve a Vapi knowledge base by ID |
| `knowledgeBases.list` | `vapi.api.knowledgeBases.list` | `read` | List all Vapi knowledge bases |
| `knowledgeBases.update` | `vapi.api.knowledgeBases.update` | `write` | Update a Vapi knowledge base |
| `phoneNumbers.create` | `vapi.api.phoneNumbers.create` | `write` | Create a new Vapi phone number |
| `phoneNumbers.delete` | `vapi.api.phoneNumbers.delete` | `destructive` | Delete a Vapi phone number [DESTRUCTIVE] |
| `phoneNumbers.get` | `vapi.api.phoneNumbers.get` | `read` | Retrieve a Vapi phone number by ID |
| `phoneNumbers.list` | `vapi.api.phoneNumbers.list` | `read` | List all Vapi phone numbers |
| `phoneNumbers.update` | `vapi.api.phoneNumbers.update` | `write` | Update a Vapi phone number |
| `squads.create` | `vapi.api.squads.create` | `write` | Create a new Vapi squad |
| `squads.delete` | `vapi.api.squads.delete` | `destructive` | Delete a Vapi squad [DESTRUCTIVE] |
| `squads.get` | `vapi.api.squads.get` | `read` | Retrieve a Vapi squad by ID |
| `squads.list` | `vapi.api.squads.list` | `read` | List all Vapi squads |
| `squads.update` | `vapi.api.squads.update` | `write` | Update a Vapi squad |
| `tools.create` | `vapi.api.tools.create` | `write` | Create a new Vapi tool |
| `tools.delete` | `vapi.api.tools.delete` | `destructive` | Delete a Vapi tool [DESTRUCTIVE] |
| `tools.get` | `vapi.api.tools.get` | `read` | Retrieve a Vapi tool by ID |
| `tools.list` | `vapi.api.tools.list` | `read` | List all Vapi tools |
| `tools.update` | `vapi.api.tools.update` | `write` | Update a Vapi tool |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 6 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/vapi

## License

Apache-2.0
