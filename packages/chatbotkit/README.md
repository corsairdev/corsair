# @corsair-dev/chatbotkit

Chatbotkit plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/chatbotkit
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `blueprints.create` | `chatbotkit.api.blueprints.create` | `write` | Create a new blueprint configuration template |
| `blueprints.delete` | `chatbotkit.api.blueprints.delete` | `destructive` | Permanently delete a blueprint template |
| `blueprints.get` | `chatbotkit.api.blueprints.get` | `read` | Fetch a blueprint template by ID |
| `blueprints.list` | `chatbotkit.api.blueprints.list` | `read` | List blueprint templates, cursor-paginated |
| `blueprints.update` | `chatbotkit.api.blueprints.update` | `write` | Update an existing blueprint template |
| `bots.create` | `chatbotkit.api.bots.create` | `write` | Create a new AI bot |
| `bots.delete` | `chatbotkit.api.bots.delete` | `destructive` | Permanently delete a bot |
| `bots.downvote` | `chatbotkit.api.bots.downvote` | `write` | Register a downvote for a bot |
| `bots.get` | `chatbotkit.api.bots.get` | `read` | Fetch a single bot by ID or alias |
| `bots.list` | `chatbotkit.api.bots.list` | `read` | List bots on the ChatBotKit account, cursor-paginated |
| `bots.update` | `chatbotkit.api.bots.update` | `write` | Update an existing bot configuration |
| `bots.upvote` | `chatbotkit.api.bots.upvote` | `write` | Register an upvote for a bot |
| `conversations.complete` | `chatbotkit.api.conversations.complete` | `write` | Send message to conversation and get AI response |
| `conversations.create` | `chatbotkit.api.conversations.create` | `write` | Create a new conversation chat session |
| `conversations.delete` | `chatbotkit.api.conversations.delete` | `destructive` | Permanently delete a conversation session |
| `conversations.get` | `chatbotkit.api.conversations.get` | `read` | Fetch a conversation by ID |
| `conversations.list` | `chatbotkit.api.conversations.list` | `read` | List conversations, cursor-paginated |
| `conversations.update` | `chatbotkit.api.conversations.update` | `write` | Update conversation metadata or bot association |
| `datasets.create` | `chatbotkit.api.datasets.create` | `write` | Create a new knowledge dataset |
| `datasets.delete` | `chatbotkit.api.datasets.delete` | `destructive` | Permanently delete a dataset |
| `datasets.get` | `chatbotkit.api.datasets.get` | `read` | Fetch a dataset by ID |
| `datasets.list` | `chatbotkit.api.datasets.list` | `read` | List knowledge datasets, cursor-paginated |
| `datasets.search` | `chatbotkit.api.datasets.search` | `read` | Search a dataset for relevant knowledge records |
| `datasets.update` | `chatbotkit.api.datasets.update` | `write` | Update dataset configuration |
| `files.create` | `chatbotkit.api.files.create` | `write` | Create a new file record |
| `files.delete` | `chatbotkit.api.files.delete` | `destructive` | Permanently delete a file resource |
| `files.get` | `chatbotkit.api.files.get` | `read` | Fetch file metadata by ID |
| `files.list` | `chatbotkit.api.files.list` | `read` | List uploaded file resources, cursor-paginated |
| `secrets.create` | `chatbotkit.api.secrets.create` | `write` | Create a new integration secret credential |
| `secrets.delete` | `chatbotkit.api.secrets.delete` | `destructive` | Permanently delete a secret credential |
| `secrets.get` | `chatbotkit.api.secrets.get` | `read` | Fetch a secret credential by ID |
| `secrets.list` | `chatbotkit.api.secrets.list` | `read` | List integration secrets, cursor-paginated |
| `secrets.update` | `chatbotkit.api.secrets.update` | `write` | Update an existing integration secret credential |
| `skillsets.create` | `chatbotkit.api.skillsets.create` | `write` | Create a new skillset container |
| `skillsets.delete` | `chatbotkit.api.skillsets.delete` | `destructive` | Permanently delete a skillset |
| `skillsets.get` | `chatbotkit.api.skillsets.get` | `read` | Fetch a skillset by ID |
| `skillsets.list` | `chatbotkit.api.skillsets.list` | `read` | List skillsets on the account, cursor-paginated |
| `skillsets.update` | `chatbotkit.api.skillsets.update` | `write` | Update skillset configuration or state |
| `tasks.create` | `chatbotkit.api.tasks.create` | `write` | Create a new background execution task |
| `tasks.delete` | `chatbotkit.api.tasks.delete` | `destructive` | Permanently delete a background task |
| `tasks.get` | `chatbotkit.api.tasks.get` | `read` | Fetch a task by ID |
| `tasks.list` | `chatbotkit.api.tasks.list` | `read` | List background tasks, cursor-paginated |
| `tasks.update` | `chatbotkit.api.tasks.update` | `write` | Update task schedule or bot assignment |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/chatbotkit

## License

Apache-2.0
