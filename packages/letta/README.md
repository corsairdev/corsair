# @corsair-dev/letta

Stateful agents with Letta: create and configure agents, send them messages (sync, streaming, async or scheduled), manage core memory blocks, archival passages, archives, folders and files, tools and MCP servers, conversations, identities, templates, runs, steps and models (129 operations).

## Install

```bash
pnpm add @corsair-dev/letta
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accessTokens.create` | `letta.api.accessTokens.create` | `destructive` | Create token (Cloud-only). Create a new client side access token with the specified configuration. Mints a client-side access token (it expires after 5 minutes unless expires_at says otherwise). |
| `accessTokens.delete` | `letta.api.accessTokens.delete` | `destructive` | Delete token (Cloud-only). Delete a client side access token. Letta Cloud refused every delete on 11-27 (400, its own body check fails even with no body); tokens expire on their own. Cannot be undone. |
| `accessTokens.list` | `letta.api.accessTokens.list` | `read` | List tokens (Cloud-only). List all client side access tokens for the current account. This is only available for cloud users. |
| `agents.archives.attach` | `letta.api.agents.archives.attach` | `write` | Attach Archive To Agent. Attach an archive to an agent. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `agents.archives.detach` | `letta.api.agents.archives.detach` | `write` | Detach Archive From Agent. Detach an archive from an agent. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `agents.blocks.attach` | `letta.api.agents.blocks.attach` | `write` | Attach Block To Agent. Attach a core memory block to an agent. |
| `agents.blocks.detach` | `letta.api.agents.blocks.detach` | `write` | Detach Block From Agent. Detach a core memory block from an agent. |
| `agents.blocks.get` | `letta.api.agents.blocks.get` | `read` | Retrieve Block For Agent. Retrieve a core memory block from an agent. |
| `agents.blocks.list` | `letta.api.agents.blocks.list` | `read` | List Blocks For Agent. Retrieve the core memory blocks of a specific agent. |
| `agents.blocks.update` | `letta.api.agents.blocks.update` | `write` | Update Block For Agent. Updates a core memory block of an agent. |
| `agents.create` | `letta.api.agents.create` | `write` | Create Agent. Create an agent. (POST /v1/agents/) |
| `agents.delete` | `letta.api.agents.delete` | `destructive` | Delete Agent. Delete an agent. Cannot be undone. |
| `agents.exportFile` | `letta.api.agents.exportFile` | `read` | Export Agent. Export the serialized JSON representation of an agent, formatted with indentation. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `agents.files.close` | `letta.api.agents.files.close` | `write` | Close File For Agent. Closes a specific file for a given agent. This endpoint marks a specific file as closed in the agent's file state. The file will be removed from the agent's working memory view. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `agents.files.closeAll` | `letta.api.agents.files.closeAll` | `write` | Close All Files For Agent. Closes all currently open files for a given agent. This endpoint updates the file state for the agent so that no files are marked as open. Typically used to reset the working memory view for the agent. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `agents.files.list` | `letta.api.agents.files.list` | `read` | List Files For Agent. Get the files attached to an agent with their open/closed status. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `agents.files.open` | `letta.api.agents.files.open` | `write` | Open File For Agent. Opens a specific file for a given agent. This endpoint marks a specific file as open in the agent's file state. The file will be included in the agent's working memory view. Returns a list of file names that were closed due to LRU eviction. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `agents.folders.attach` | `letta.api.agents.folders.attach` | `write` | Attach Folder To Agent. Attach a folder to an agent. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `agents.folders.detach` | `letta.api.agents.folders.detach` | `write` | Detach Folder From Agent. Detach a folder from an agent. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `agents.folders.list` | `letta.api.agents.folders.list` | `read` | List Folders For Agent. Get the folders associated with an agent. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `agents.get` | `letta.api.agents.get` | `read` | Retrieve Agent. Get the state of the agent. |
| `agents.identities.attach` | `letta.api.agents.identities.attach` | `write` | Attach Identity To Agent. Attach an identity to an agent. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `agents.identities.detach` | `letta.api.agents.identities.detach` | `write` | Detach Identity From Agent. Detach an identity from an agent. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `agents.importFile` | `letta.api.agents.importFile` | `write` | Import Agent. Import a serialized agent file and recreate the agent(s) in the system. Returns the IDs of all imported agents. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `agents.list` | `letta.api.agents.list` | `read` | List Agents. Get a list of all agents. (GET /v1/agents/) |
| `agents.messages.cancel` | `letta.api.agents.messages.cancel` | `write` | Cancel Message. Cancel runs associated with an agent. If run_ids are passed in, cancel those in particular. Note to cancel active runs associated with an agent, redis is required. |
| `agents.messages.compact` | `letta.api.agents.messages.compact` | `destructive` | Summarize Messages. Summarize an agent's conversation history. |
| `agents.messages.create` | `letta.api.agents.messages.create` | `destructive` | Create Message. Process a user message and return the agent's response. This endpoint accepts a message from a user and processes it through the agent. Note: Sending multiple concurrent requests to the same agent can lead to undefined behavior. Runs the agent: it calls its model (spending tokens) and may run tools. |
| `agents.messages.createAsync` | `letta.api.agents.messages.createAsync` | `destructive` | Create Message Async. Asynchronously process a user message and return a run object. The actual processing happens in the background, and the status can be checked using the run ID. This is "asynchronous" in the sense that it's a background run and explicitly must be fetched by the run ID. Runs the agent in the background and returns a run to poll with runs.get. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `agents.messages.list` | `letta.api.agents.messages.list` | `read` | List Messages. Retrieve message history for an agent. |
| `agents.messages.reset` | `letta.api.agents.messages.reset` | `destructive` | Reset Messages. Resets the messages for an agent. Clears the agent's message history. |
| `agents.messages.stream` | `letta.api.agents.messages.stream` | `destructive` | Create Message Streaming. Process a user message and return the agent's response. Deprecated: Use the POST /{agent_id}/messages endpoint with streaming=true in the request body instead. Note: Sending multiple concurrent requests to the same agent can lead to undefined behavior. Runs the agent like agents.messages.create and returns the server-sent events as text. |
| `agents.passages.create` | `letta.api.agents.passages.create` | `write` | Create Passage. Insert a memory into an agent's archival memory store. |
| `agents.passages.delete` | `letta.api.agents.passages.delete` | `destructive` | Delete Passage. Delete a memory from an agent's archival memory store. Cannot be undone. |
| `agents.passages.list` | `letta.api.agents.passages.list` | `read` | List Passages. Retrieve the memories in an agent's archival memory store (paginated query). |
| `agents.passages.search` | `letta.api.agents.passages.search` | `read` | Search Archival Memory. Search archival memory using semantic (embedding-based) search with optional temporal filtering. This endpoint allows manual triggering of archival memory searches, enabling users to query an agent's archival memory store directly via the API. |
| `agents.recompile` | `letta.api.agents.recompile` | `write` | Recompile Agent. Manually trigger system prompt recompilation for an agent. |
| `agents.schedule.create` | `letta.api.agents.schedule.create` | `destructive` | Schedule Agent Message. Schedule a message to be sent by the agent at a specified time or on a recurring basis. |
| `agents.schedule.delete` | `letta.api.agents.schedule.delete` | `destructive` | Delete Scheduled Agent Message. Delete a scheduled message by its ID for a specific agent. Cannot be undone. |
| `agents.schedule.get` | `letta.api.agents.schedule.get` | `read` | Retrieve Scheduled Agent Message. Retrieve a scheduled message by its ID for a specific agent. |
| `agents.schedule.list` | `letta.api.agents.schedule.list` | `read` | List Scheduled Agent Messages. List all scheduled messages for a specific agent. |
| `agents.tools.attach` | `letta.api.agents.tools.attach` | `write` | Attach Tool To Agent. Attach a tool to an agent. |
| `agents.tools.detach` | `letta.api.agents.tools.detach` | `write` | Detach Tool From Agent. Detach a tool from an agent. |
| `agents.tools.list` | `letta.api.agents.tools.list` | `read` | List Tools For Agent. Get tools from an existing agent. |
| `agents.tools.run` | `letta.api.agents.tools.run` | `destructive` | Run Tool For Agent. Trigger a tool by name on a specific agent, providing the necessary arguments. This endpoint executes a tool that is attached to the agent, using the agent's state and environment variables for execution context. Executes the tool with the arguments given; side effects are the tool’s own. |
| `agents.tools.updateApproval` | `letta.api.agents.tools.updateApproval` | `write` | Update Approval For Tool. Modify the approval requirement for a tool attached to an agent. Accepts requires_approval via request body (preferred) or query parameter (deprecated). Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `agents.update` | `letta.api.agents.update` | `write` | Update Agent. Update an existing agent. (PATCH /v1/agents/{agent_id}) |
| `archives.create` | `letta.api.archives.create` | `write` | Create Archive. Create a new archive. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `archives.delete` | `letta.api.archives.delete` | `destructive` | Delete Archive. Delete an archive by its ID. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. Cannot be undone. |
| `archives.get` | `letta.api.archives.get` | `read` | Retrieve Archive. Get a single archive by its ID. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `archives.list` | `letta.api.archives.list` | `read` | List Archives. Get a list of all archives for the current organization with optional filters and pagination. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `archives.passages.create` | `letta.api.archives.passages.create` | `write` | Create Passage In Archive. Create a new passage in an archive. This adds a passage to the archive and creates embeddings for vector storage. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `archives.passages.createMany` | `letta.api.archives.passages.createMany` | `write` | Create Passages In Archive. Create multiple passages in an archive. This adds passages to the archive and creates embeddings for vector storage. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `archives.passages.delete` | `letta.api.archives.passages.delete` | `destructive` | Delete Passage From Archive. Delete a passage from an archive. This permanently removes the passage from both the database and vector storage (if applicable). Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. Cannot be undone. |
| `archives.update` | `letta.api.archives.update` | `write` | Update Archive. Update an existing archive's name and/or description. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `blocks.agents.list` | `letta.api.blocks.agents.list` | `read` | List Agents For Block. Retrieves all agents associated with the specified block. Raises a 404 if the block does not exist. |
| `blocks.create` | `letta.api.blocks.create` | `write` | Create Block. (POST /v1/blocks/) |
| `blocks.delete` | `letta.api.blocks.delete` | `destructive` | Delete Block. Cannot be undone. (DELETE /v1/blocks/{block_id}) |
| `blocks.get` | `letta.api.blocks.get` | `read` | Retrieve Block. (GET /v1/blocks/{block_id}) |
| `blocks.list` | `letta.api.blocks.list` | `read` | List Blocks. (GET /v1/blocks/) |
| `blocks.update` | `letta.api.blocks.update` | `write` | Update Block. (PATCH /v1/blocks/{block_id}) |
| `client.health` | `letta.api.client.health` | `read` | Check Health. Liveness endpoint; returns 200 when process is responsive. |
| `conversations.cancel` | `letta.api.conversations.cancel` | `write` | Cancel Conversation. Cancel runs associated with a conversation. Note: To cancel active runs, Redis is required. Agent-direct mode: Pass conversation_id="default" with agent_id query parameter to cancel runs for the agent's default conversation. |
| `conversations.create` | `letta.api.conversations.create` | `write` | Create Conversation. Create a new conversation for an agent. |
| `conversations.delete` | `letta.api.conversations.delete` | `destructive` | Delete Conversation. Delete a conversation. The conversation will no longer appear in list operations. Cannot be undone. |
| `conversations.fork` | `letta.api.conversations.fork` | `write` | Fork Conversation. Fork an existing conversation. Creates a new conversation that shares the same in-context messages as the source conversation, but with a newly compiled system message reflecting the latest memory block values. The forked conversation belongs to the same agent as the source. |
| `conversations.get` | `letta.api.conversations.get` | `read` | Retrieve Conversation. Retrieve a specific conversation. |
| `conversations.list` | `letta.api.conversations.list` | `read` | List Conversations. List all conversations for an agent (or all conversations if agent_id not provided). |
| `conversations.messages.compact` | `letta.api.conversations.messages.compact` | `destructive` | Compact Conversation. Compact (summarize) a conversation's message history. This endpoint summarizes the in-context messages for a specific conversation, reducing the message count while preserving important context. |
| `conversations.messages.create` | `letta.api.conversations.messages.create` | `destructive` | Send Conversation Message. Send a message to a conversation and get a response. This endpoint sends a message to an existing conversation. By default (streaming=true), returns a streaming response (Server-Sent Events). Set streaming=false to get a complete JSON response. Runs the agent in this conversation: it calls its model and may run tools. Letta streams by default here: the answer is the server-sent event text as a string unless you pass streaming: false. |
| `conversations.messages.list` | `letta.api.conversations.messages.list` | `read` | List Conversation Messages. List all messages in a conversation. Returns LettaMessage objects (UserMessage, AssistantMessage, etc.) for all messages in the conversation, with support for cursor-based pagination. |
| `conversations.messages.stream` | `letta.api.conversations.messages.stream` | `read` | Retrieve Conversation Stream. Resume the stream for the most recent active run in a conversation. This endpoint allows you to reconnect to an active background stream for a conversation, enabling recovery from network interruptions. |
| `conversations.recompile` | `letta.api.conversations.recompile` | `write` | Recompile Conversation. Manually trigger system prompt recompilation for a conversation. |
| `conversations.update` | `letta.api.conversations.update` | `write` | Update Conversation. Update a conversation. |
| `environments.get` | `letta.api.environments.get` | `read` | Get Environment Connection. Get a specific environment connection by deviceId. |
| `environments.list` | `letta.api.environments.list` | `read` | List Environment Connections. List all active environment connections for the organization. |
| `environments.sendMessage` | `letta.api.environments.sendMessage` | `destructive` | Send Message to Environment. Send a message to a specific environment connection. |
| `folders.agents.list` | `letta.api.folders.agents.list` | `read` | List Agents For Folder. Get all agent IDs that have the specified folder attached. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `folders.create` | `letta.api.folders.create` | `write` | Create Folder. Create a new data folder. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `folders.delete` | `letta.api.folders.delete` | `destructive` | Delete Folder. Delete a data folder. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. Cannot be undone. |
| `folders.files.delete` | `letta.api.folders.files.delete` | `destructive` | Delete File From Folder. Delete a file from a folder. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. Cannot be undone. |
| `folders.files.get` | `letta.api.folders.files.get` | `read` | Retrieve File. Retrieve a file from a folder by ID. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `folders.files.list` | `letta.api.folders.files.list` | `read` | List Files For Folder. List paginated files associated with a data folder. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `folders.files.upload` | `letta.api.folders.files.upload` | `write` | Upload File To Folder. Upload a file to a data folder. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `folders.get` | `letta.api.folders.get` | `read` | Retrieve Folder. Get a folder by ID. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `folders.list` | `letta.api.folders.list` | `read` | List Folders. List all data folders created by a user. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `folders.update` | `letta.api.folders.update` | `write` | Update Folder. Update the name or documentation of an existing data folder. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `mcpServers.create` | `letta.api.mcpServers.create` | `write` | Create Mcp Server. Add a new MCP server to the Letta MCP server config. |
| `mcpServers.delete` | `letta.api.mcpServers.delete` | `destructive` | Delete Mcp Server. Delete an MCP server by its ID. Cannot be undone. |
| `mcpServers.get` | `letta.api.mcpServers.get` | `read` | Retrieve Mcp Server. Get a specific MCP server. |
| `mcpServers.list` | `letta.api.mcpServers.list` | `read` | List Mcp Servers. Get a list of all configured MCP servers. |
| `mcpServers.refresh` | `letta.api.mcpServers.refresh` | `write` | Refresh Mcp Server Tools. Refresh tools for an MCP server by: 1. Fetching current tools from the MCP server 1. Deleting tools that no longer exist on the server 1. Updating schemas for existing tools 1. Adding new tools from the server Returns a summary of changes made. |
| `mcpServers.tools.get` | `letta.api.mcpServers.tools.get` | `read` | Retrieve Mcp Tool. Get a specific MCP tool by its ID. |
| `mcpServers.tools.list` | `letta.api.mcpServers.tools.list` | `read` | List Tools For Mcp Server. Get a list of all tools for a specific MCP server. |
| `mcpServers.tools.run` | `letta.api.mcpServers.tools.run` | `destructive` | Run Mcp Tool. Execute a specific MCP tool The request body should contain the tool arguments in the ToolExecuteRequest format. Executes the MCP tool with the arguments given. |
| `mcpServers.update` | `letta.api.mcpServers.update` | `write` | Update Mcp Server. Update an existing MCP server configuration. |
| `messages.get` | `letta.api.messages.get` | `read` | Retrieve Message. Retrieve a message by ID. |
| `messages.list` | `letta.api.messages.list` | `read` | List All Messages. List messages across all agents for the current user. |
| `messages.search` | `letta.api.messages.search` | `read` | Search All Messages. Search messages across the organization with optional agent filtering. Returns messages with FTS/vector ranks and total RRF score. This is a cloud-only feature. |
| `models.embeddings.list` | `letta.api.models.embeddings.list` | `read` | List Embedding Models. List available embedding models using the asynchronous implementation for improved performance. Returns EmbeddingModel format which extends EmbeddingConfig with additional metadata fields. Legacy EmbeddingConfig fields are marked as deprecated but still available for backward compatibility. |
| `models.list` | `letta.api.models.list` | `read` | List Llm Models. List available LLM models using the asynchronous implementation for improved performance. Returns Model format which extends LLMConfig with additional metadata fields. Legacy LLMConfig fields are marked as deprecated but still available for backward compatibility. |
| `passages.search` | `letta.api.passages.search` | `read` | Search Passages. Search passages across the organization with optional agent and archive filtering. Returns passages with relevance scores. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `runs.get` | `letta.api.runs.get` | `read` | Retrieve Run. Get the status of a run. (GET /v1/runs/{run_id}) |
| `runs.list` | `letta.api.runs.list` | `read` | List Runs. List all runs. (GET /v1/runs/) |
| `runs.messages.list` | `letta.api.runs.messages.list` | `read` | List Messages For Run. Get response messages associated with a run. |
| `runs.messages.stream` | `letta.api.runs.messages.stream` | `read` | Retrieve Stream For Run. Reattaches to a background run’s stream; returns the server-sent events as text. |
| `runs.steps.list` | `letta.api.runs.steps.list` | `read` | List Steps For Run. Get steps associated with a run with filtering options. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `runs.trace.get` | `letta.api.runs.trace.get` | `read` | Retrieve Trace For Run. Retrieve OTEL trace spans for a run. Returns a filtered set of spans relevant for observability: - agent_step: Individual agent reasoning steps - tool executions: Tool call spans - Root span: The top-level request span - time_to_first_token: TTFT measurement span Requires ClickHouse to be… Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `runs.usage.get` | `letta.api.runs.usage.get` | `read` | Retrieve Usage For Run. Get usage statistics for a run. |
| `steps.feedback.create` | `letta.api.steps.feedback.create` | `write` | Modify Feedback For Step. Modify feedback for a given step. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `steps.get` | `letta.api.steps.get` | `read` | Retrieve Step. Get a step by ID. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `steps.list` | `letta.api.steps.list` | `read` | List Steps. List steps with optional pagination and date filters. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `steps.messages.list` | `letta.api.steps.messages.list` | `read` | List Messages For Step. List messages for a given step. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `steps.metrics.get` | `letta.api.steps.metrics.get` | `read` | Retrieve Metrics For Step. Get step metrics by step ID. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `steps.trace.get` | `letta.api.steps.trace.get` | `read` | Retrieve Trace For Step. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `tags.list` | `letta.api.tags.list` | `read` | List Tags. Get the list of all tags (from agents and blocks) that have been created. |
| `templates.agents.create` | `letta.api.templates.agents.create` | `write` | Create Agents From Template. Creates an Agent or multiple Agents from a template. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `templates.create` | `letta.api.templates.create` | `write` | Create template (Cloud-only). Creates a new template from an existing agent or agent file. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `templates.delete` | `letta.api.templates.delete` | `destructive` | Delete template (Cloud-only). Deletes all versions of a template with the specified name. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. Cannot be undone. |
| `templates.rollback` | `letta.api.templates.rollback` | `destructive` | Rollback template to previous version (Cloud-only). Rollback the current working version of a template to a previous saved version. If the current version has unsaved changes, they will be automatically saved as a new version before rollback. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `templates.save` | `letta.api.templates.save` | `write` | Save template version (Cloud-only). Saves the current version of the template as a new version. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `templates.update` | `letta.api.templates.update` | `write` | Update current template from agent file (Cloud-only). Updates the current working version of a template from an agent file. Letta Cloud answered 404 with no such route for this on 11-27 (free account); it may need a paid plan or have been retired. |
| `tools.create` | `letta.api.tools.create` | `write` | Create Tool. Create a new tool. (POST /v1/tools/) |
| `tools.delete` | `letta.api.tools.delete` | `destructive` | Delete Tool. Delete a tool by name. Cannot be undone. |
| `tools.get` | `letta.api.tools.get` | `read` | Retrieve Tool. Get a tool by ID. (GET /v1/tools/{tool_id}) |
| `tools.list` | `letta.api.tools.list` | `read` | List Tools. Get a list of all tools available to agents. |
| `tools.search` | `letta.api.tools.search` | `read` | Search Tools. Search tools using semantic search. Requires tool embedding to be enabled (embed_tools=True). Uses vector search, full-text search, or hybrid mode to find tools matching the query. Returns tools ranked by relevance with their search scores. |
| `tools.update` | `letta.api.tools.update` | `write` | Update Tool. Update an existing tool. (PATCH /v1/tools/{tool_id}) |
| `tools.upsert` | `letta.api.tools.upsert` | `write` | Upsert Tool. Create or update a tool. (PUT /v1/tools/) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/letta

## License

Apache-2.0
