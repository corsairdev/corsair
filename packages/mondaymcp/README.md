# @corsair-dev/mondaymcp

Monday MCP plugin for Corsair — speaks the official monday.com Platform MCP server (https://mcp.monday.com/mcp) over Streamable HTTP JSON-RPC.

## Install

```bash
pnpm add @corsair-dev/mondaymcp
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `agents.catalog` | `mondaymcp.api.agents.catalog` | `read` | Browses the account-wide catalog of available trigger types and skills for monday platform agents using the Platform MCP. |
| `agents.manage` | `mondaymcp.api.agents.manage` | `destructive` | Full lifecycle management for monday platform agents — create, read, update, delete, change state, and run — using the Platform MCP. |
| `agents.manageKnowledge` | `mondaymcp.api.agents.manageKnowledge` | `write` | Lists, grants, updates, or revokes a monday platform agent's access to boards and docs using the Platform MCP. |
| `agents.manageSkills` | `mondaymcp.api.agents.manageSkills` | `write` | Creates skills in the account catalog and attaches or detaches them from a monday platform agent using the Platform MCP. |
| `agents.manageTriggers` | `mondaymcp.api.agents.manageTriggers` | `write` | Lists, adds, or removes the triggers attached to a monday platform agent — triggers define when the agent runs automatically — using the Platform MCP. |
| `assets.finalizeUpload` | `mondaymcp.api.assets.finalizeUpload` | `write` | Completes a file upload started with get_asset_upload_url, creates the asset, and attaches it to an item's file column using the Platform MCP. |
| `assets.get` | `mondaymcp.api.assets.get` | `read` | Retrieves file metadata for one or more monday.com assets by their IDs, including download URL, thumbnail, size, and uploader information using the Platform MCP. |
| `assets.getUploadUrl` | `mondaymcp.api.assets.getUploadUrl` | `write` | Returns a presigned URL to upload a file to monday.com, the first step in attaching a file to an item using the Platform MCP. |
| `automations.create` | `mondaymcp.api.automations.create` | `write` | Creates an automation on a monday.com board from a structured natural-language description using the Platform MCP. |
| `automations.list` | `mondaymcp.api.automations.list` | `read` | Lists all automations on a specific monday.com board, including their IDs, titles, active state, and configuration, using the Platform MCP. |
| `automations.manage` | `mondaymcp.api.automations.manage` | `destructive` | Activates, deactivates, or deletes an existing monday.com automation using the Platform MCP. |
| `boards.create` | `mondaymcp.api.boards.create` | `write` | Creates a new monday.com board in a specified workspace with configurable visibility, description, and ownership using the Platform MCP. |
| `boards.getActivity` | `mondaymcp.api.boards.getActivity` | `read` | Returns the activity log for a board, showing what changed, when, and by whom, over a configurable time range using the Platform MCP. |
| `boards.getInfo` | `mondaymcp.api.boards.getInfo` | `read` | Returns comprehensive metadata for a board, including its columns, groups, views, owners, and workspace details using the Platform MCP. |
| `boards.getItemsPage` | `mondaymcp.api.boards.getItemsPage` | `read` | Retrieves items from a board with pagination, optional column values, filters, sorting, and sub-item support using the Platform MCP. |
| `boards.insights` | `mondaymcp.api.boards.insights` | `read` | Calculates aggregated summaries of board data by filtering, grouping, and applying aggregation functions to columns using the Platform MCP. |
| `columns.create` | `mondaymcp.api.columns.create` | `write` | Adds a new column of a specified type to a monday.com board, with an optional title, description, and type-specific settings using the Platform MCP. |
| `columns.getTypeInfo` | `mondaymcp.api.columns.getTypeInfo` | `read` | Returns the JSON settings schema or filter/aggregation guidelines for a specific monday.com column type using the Platform MCP. |
| `dashboards.allWidgetsSchema` | `mondaymcp.api.dashboards.allWidgetsSchema` | `read` | Returns the complete JSON Schema definitions for all available widget types in monday.com, including required fields, data types, and configuration options using the Platform MCP. |
| `dashboards.create` | `mondaymcp.api.dashboards.create` | `write` | Creates a new monday.com dashboard that aggregates and visualizes data from one or more boards using the Platform MCP. |
| `dashboards.createWidget` | `mondaymcp.api.dashboards.createWidget` | `write` | Adds a new data visualization widget to a monday.com dashboard or board view with type-specific configuration settings using the Platform MCP. |
| `docs.create` | `mondaymcp.api.docs.create` | `write` | Creates a new monday.com document in a workspace or attached to a board item, then populates it with the provided markdown content using the Platform MCP. |
| `docs.read` | `mondaymcp.api.docs.read` | `read` | Retrieves monday.com documents with their full markdown content and block structure, or fetches the version history of a single document using the Platform MCP. |
| `docs.update` | `mondaymcp.api.docs.update` | `write` | Updates an existing monday.com document by executing an ordered list of operations such as appending content, renaming, editing blocks, or adding comments using the Platform MCP. |
| `folders.create` | `mondaymcp.api.folders.create` | `write` | Creates a new folder inside a monday.com workspace, with optional color, icon, font weight, and parent folder settings using the Platform MCP. |
| `folders.moveObject` | `mondaymcp.api.folders.moveObject` | `write` | Moves a board, folder, or overview to a different position, parent folder, or workspace in monday.com using the Platform MCP. |
| `folders.update` | `mondaymcp.api.folders.update` | `write` | Updates the name, color, icon, position, or parent of an existing folder in monday.com using the Platform MCP. |
| `forms.create` | `mondaymcp.api.forms.create` | `write` | Creates a new monday.com WorkForm and a backing board to store responses, returning a form token for subsequent form operations using the Platform MCP. |
| `forms.createSubmission` | `mondaymcp.api.forms.createSubmission` | `write` | Submits a completed response to a monday.com WorkForm, creating a new item on the form's backing board with the provided answers using the Platform MCP. |
| `forms.editQuestions` | `mondaymcp.api.forms.editQuestions` | `write` | Creates, updates, or deletes a single question on a monday.com WorkForm, with support for 23 question types and conditional visibility rules using the Platform MCP. |
| `forms.get` | `mondaymcp.api.forms.get` | `read` | Retrieves the full structure of a monday.com WorkForm by its form token, including all questions, settings, appearance, and features using the Platform MCP. |
| `forms.update` | `mondaymcp.api.forms.update` | `write` | Updates a monday.com WorkForm's settings, appearance, features, tags, or question order using a single action-based call using the Platform MCP. |
| `groups.create` | `mondaymcp.api.groups.create` | `write` | Creates a new group (section) in a monday.com board with an optional color and position relative to existing groups using the Platform MCP. |
| `items.changeColumnValues` | `mondaymcp.api.items.changeColumnValues` | `write` | Updates one or more column values on an existing monday.com item in a single call using the Platform MCP. |
| `items.create` | `mondaymcp.api.items.create` | `write` | Creates a new item on a board, optionally with column values, as a sub-item under a parent, or as a duplicate of an existing item using the Platform MCP. |
| `meetings.getNotetaker` | `mondaymcp.api.meetings.getNotetaker` | `read` | Retrieves notetaker meetings from the monday.com AI Notetaker, with optional filters for access level, summaries, topics, action items, and transcripts using the Platform MCP. |
| `notifications.create` | `mondaymcp.api.notifications.create` | `destructive` | Sends a notification to a user via the monday.com bell icon, with an optional email, targeting an update/reply or an item/board using the Platform MCP. |
| `schema.executeQuery` | `mondaymcp.api.schema.executeQuery` | `destructive` | Executes any monday.com GraphQL query or mutation dynamically. The most flexible tool in the Platform MCP, giving direct access to the full monday.com API surface. |
| `schema.getGraphqlSchema` | `mondaymcp.api.schema.getGraphqlSchema` | `read` | Fetches the monday.com GraphQL schema structure, including all available query fields, mutation fields, and a list of every type in the schema using the Platform MCP. |
| `schema.getTypeDetails` | `mondaymcp.api.schema.getTypeDetails` | `read` | Returns the full field list and type information for a specific GraphQL type in the monday.com API schema using the Platform MCP. |
| `search.query` | `mondaymcp.api.search.query` | `read` | Searches across monday.com for boards, documents, or folders by keyword, with optional filtering by workspace using the Platform MCP. |
| `sprints.getBoards` | `mondaymcp.api.sprints.getBoards` | `read` | Discovers monday Dev sprint boards and their paired tasks boards in your account using the Platform MCP. |
| `sprints.getMetadata` | `mondaymcp.api.sprints.getMetadata` | `read` | Returns a table of sprints from a monday Dev sprints board, including timeline, status, and completion data for each sprint using the Platform MCP. |
| `sprints.getSummary` | `mondaymcp.api.sprints.getSummary` | `read` | Returns a complete AI-generated performance summary and analysis for a completed monday Dev sprint using the Platform MCP. |
| `updates.create` | `mondaymcp.api.updates.create` | `destructive` | Posts a new update (comment) on a monday.com item, with support for mentions and threaded replies using the Platform MCP. |
| `updates.list` | `mondaymcp.api.updates.list` | `read` | Retrieves updates (comments and posts) from a monday.com item or board, with optional filtering by date range, replies, and file attachments using the Platform MCP. |
| `users.getContext` | `mondaymcp.api.users.getContext` | `read` | Returns information about the currently authenticated user, their account, and their most relevant boards, people, and workspaces using the Platform MCP. |
| `users.listAndTeams` | `mondaymcp.api.users.listAndTeams` | `read` | Fetches user profiles and team data from the account, with several targeting modes for looking up specific users or teams efficiently using the Platform MCP. |
| `views.create` | `mondaymcp.api.views.create` | `write` | Creates a new board view (tab) with optional filters and sorting on a monday.com board using the Platform MCP. |
| `views.createTable` | `mondaymcp.api.views.createTable` | `write` | Creates a new table-type board view with filters, sort, tags, and table-specific settings (column visibility/order and group-by) using the Platform MCP. |
| `views.update` | `mondaymcp.api.views.update` | `write` | Updates an existing board view (tab) — its name, filters, or sort order — on a monday.com board using the Platform MCP. |
| `views.updateTable` | `mondaymcp.api.views.updateTable` | `write` | Updates an existing table-type board view — name, filters, sort, tags, or table-specific settings (column visibility/order and group-by) using the Platform MCP. |
| `workflows.create` | `mondaymcp.api.workflows.create` | `write` | Creates a new empty workflow in a monday.com workspace using the Platform MCP, returning the workflow object ID and draft ID. |
| `workflows.plan` | `mondaymcp.api.workflows.plan` | `read` | Plans one or more monday.com workflows for a described process using an AI agent, returning a structured implementation plan, via the Platform MCP. |
| `workflows.publish` | `mondaymcp.api.workflows.publish` | `write` | Publishes a workflow draft, promoting it to the live version so it starts running, using the Platform MCP. |
| `workflows.update` | `mondaymcp.api.workflows.update` | `write` | Updates an existing workflow draft using an AI agent that interprets a natural-language prompt and applies structural changes, via the Platform MCP. |
| `workspaces.create` | `mondaymcp.api.workspaces.create` | `write` | Creates a new workspace in your monday.com account with a specified name, kind, and optional description using the Platform MCP. |
| `workspaces.getInfo` | `mondaymcp.api.workspaces.getInfo` | `read` | Returns the boards, docs, and folders inside a workspace, including which folder each item belongs to using the Platform MCP. |
| `workspaces.list` | `mondaymcp.api.workspaces.list` | `read` | Returns a paginated list of all workspaces available to the authenticated user, including their IDs, names, and descriptions using the Platform MCP. |
| `workspaces.update` | `mondaymcp.api.workspaces.update` | `write` | Updates the name, description, kind, or account product association of an existing workspace using the Platform MCP. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mondaymcp

## License

Apache-2.0
