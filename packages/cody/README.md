# @corsair-dev/cody

Cody plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/cody
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `bots.list` | `cody.api.bots.list` | `read` | Get all bots with optional keyword filtering |
| `conversations.create` | `cody.api.conversations.create` | `write` | Create a new conversation with a specified bot and optional focus mode documents |
| `conversations.delete` | `cody.api.conversations.delete` | `write` | Delete a conversation by its ID |
| `conversations.get` | `cody.api.conversations.get` | `read` | Fetch a conversation by its ID from Cody AI |
| `conversations.list` | `cody.api.conversations.list` | `read` | Get all conversations with optional filtering by bot, keyword, or includes |
| `conversations.update` | `cody.api.conversations.update` | `write` | Update a conversation by its ID including name, bot_id, and document_ids |
| `documents.create` | `cody.api.documents.create` | `write` | Create a new document with text or HTML content in Cody AI |
| `documents.createFromFile` | `cody.api.documents.createFromFile` | `write` | Create a document by uploading a file (up to 100 MB) |
| `documents.createFromWebpage` | `cody.api.documents.createFromWebpage` | `write` | Create a document from a publicly accessible webpage URL |
| `documents.delete` | `cody.api.documents.delete` | `write` | Delete a document by id |
| `documents.get` | `cody.api.documents.get` | `read` | Retrieve a specific document by its identifier from Cody AI |
| `documents.list` | `cody.api.documents.list` | `read` | Retrieve all documents from Cody AI account with optional filtering |
| `folders.create` | `cody.api.folders.create` | `write` | Create a new folder in Cody AI for organizing content |
| `folders.get` | `cody.api.folders.get` | `read` | Retrieve a specific folder by its identifier |
| `folders.list` | `cody.api.folders.list` | `read` | Retrieve all folders with optional keyword filtering |
| `folders.update` | `cody.api.folders.update` | `write` | Update a folder by its ID |
| `messages.get` | `cody.api.messages.get` | `read` | Fetch a specific message by its ID from Cody AI |
| `messages.list` | `cody.api.messages.list` | `read` | Retrieve a paginated list of messages from Cody, optionally filtered by conversation |
| `messages.send` | `cody.api.messages.send` | `write` | Send a message to Cody AI and receive an AI-generated response |
| `messages.sendForStream` | `cody.api.messages.sendForStream` | `write` | Send a message to Cody AI and receive a Server-Sent Events (SSE) stream URL for the AI response |
| `uploads.getSignedUrl` | `cody.api.uploads.getSignedUrl` | `read` | Get an AWS S3 signed upload URL for file uploads |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/cody

## License

Apache-2.0
