# @corsair-dev/dovetail

Dovetail plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/dovetail
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `channels.create` | `dovetail.api.channels.create` | `write` | Creates a new channel in Dovetail to organize and collect feedback data. Channels are containers for specific types of customer feedback such as app reviews, NPS responses, churn reasons, product reviews, or support tickets. Use this to set up a new data collection source before importing feedback data. |
| `channels.createDataPoint` | `dovetail.api.channels.createDataPoint` | `write` | Tool to create a data point within a channel. Use after capturing new content to record and classify it in Dovetail. |
| `channels.createTopic` | `dovetail.api.channels.createTopic` | `write` | Tool to create a new topic in a Dovetail channel. Requires channel_id, title, and description. Use to organize feedback within channels by creating themed discussion topics. |
| `channels.delete` | `dovetail.api.channels.delete` | `destructive` | Tool to delete an existing channel. Use when you need to remove a channel and move it to the project's trash (restorable for 30 days). Confirm the channel ID before calling. |
| `channels.deleteTopic` | `dovetail.api.channels.deleteTopic` | `destructive` | Tool to delete an existing topic. Use when you have confirmed the topic ID and want to move it to trash (restorable for 30 days). Example: "Delete topic with ID 123e4567-e89b-12d3-a456-426614174000." |
| `channels.update` | `dovetail.api.channels.update` | `write` | Tool to update an existing channel's title or context. Use after confirming the channel ID and fields to change. |
| `channels.updateTopic` | `dovetail.api.channels.updateTopic` | `write` | Tool to update an existing topic. Use after confirming the topic ID and fields to change. Example: "Update topic with id 123... to have title 'New'". |
| `contacts.create` | `dovetail.api.contacts.create` | `write` | Tool to create a new contact in Dovetail. Use when you need to register a contact before logging interactions. |
| `contacts.get` | `dovetail.api.contacts.get` | `read` | Tool to retrieve details of a specific contact. Use when you have confirmed the contact ID and need full contact metadata from Dovetail. |
| `contacts.list` | `dovetail.api.contacts.list` | `read` | Retrieves a paginated list of contacts from a Dovetail workspace. Returns contact IDs, names, creation timestamps, and custom fields. Use cursor-based pagination (limit + start_cursor) to navigate large contact lists efficiently. |
| `contacts.update` | `dovetail.api.contacts.update` | `write` | Tool to update an existing contact in Dovetail. Use when you need to modify a contact's name, email, or custom fields. |
| `data.create` | `dovetail.api.data.create` | `write` | Tool to create a data item in a Dovetail project with text content, title, and/or structured fields. Use when you need to capture and store research data, interview notes, or other content in a project. |
| `data.delete` | `dovetail.api.data.delete` | `destructive` | Tool to delete an existing data item. Use when you have confirmed the data ID and want to move it to trash (restorable for 30 days). Example: "Delete data with ID 1tFfvvAmYPCLUqb9zO8dgN." |
| `data.export` | `dovetail.api.data.export` | `read` | Tool to export data in HTML or Markdown format. Use when you need to retrieve a formatted version of data items from Dovetail. |
| `data.get` | `dovetail.api.data.get` | `read` | Tool to retrieve details of a specific data item by ID. Use when you have confirmed the data ID and need full metadata including custom fields, files, and project information from Dovetail. |
| `data.importFile` | `dovetail.api.data.importFile` | `write` | Tool to import a public URL of a file as new data in Dovetail. Use when you need to add external files to a project. |
| `data.list` | `dovetail.api.data.list` | `read` | Tool to list data items in Dovetail. Use when you need to retrieve, filter, sort, or paginate through your workspace data. Supports filtering by created_at (date range), project_id, and title. Results can be sorted by created_at or title. Uses cursor-based pagination with configurable page size. |
| `data.update` | `dovetail.api.data.update` | `write` | Tool to update a data item in Dovetail. Use when you need to modify the title or fields of an existing data item. |
| `docs.create` | `dovetail.api.docs.create` | `write` | Tool to create a doc in a Dovetail project with text content, title and/or custom fields. Use when you need to document research findings, store notes, or create structured content within a project. The doc content is stored but not returned in the response. |
| `docs.delete` | `dovetail.api.docs.delete` | `destructive` | Tool to delete an existing doc. Use when you need to remove a doc and move it to the project's trash (restorable for 30 days). |
| `docs.export` | `dovetail.api.docs.export` | `read` | Tool to export a doc in HTML or Markdown format. Use when you need to retrieve the full content of a doc from Dovetail in a specific format. |
| `docs.get` | `dovetail.api.docs.get` | `read` | Tool to retrieve details of a specific doc by ID. Use when you have confirmed the doc ID and need full doc metadata from Dovetail. |
| `docs.importFile` | `dovetail.api.docs.importFile` | `write` | Tool to import a public file URL as a new doc in Dovetail. Use when you need to create a doc from an external file source. The file must be publicly accessible at the provided URL. |
| `docs.list` | `dovetail.api.docs.list` | `read` | Tool to list docs in a Dovetail workspace with optional filtering, sorting, and pagination. Use when you need to retrieve docs, optionally filtered by project, title, content, or creation date. |
| `docs.listUserDocs` | `dovetail.api.docs.listUserDocs` | `read` | Tool to get a list of docs associated with a user in Dovetail. Use when you need to retrieve documents for a specific user or the authenticated user (use 'me' as user_id). |
| `docs.update` | `dovetail.api.docs.update` | `write` | Tool to update a doc in Dovetail. Use when you need to modify a doc's title or custom fields. |
| `files.get` | `dovetail.api.files.get` | `read` | Tool to retrieve details of a specific file by its ID. Use when you need file metadata, download URL, or processing status from Dovetail. |
| `folders.get` | `dovetail.api.folders.get` | `read` | Tool to retrieve details of a specific folder. Use when you have confirmed the folder ID and need full folder metadata from Dovetail. |
| `folders.list` | `dovetail.api.folders.list` | `read` | Tool to get a list of folders associated with a workspace. Use when you need to retrieve folder hierarchy, search for folders by title, or navigate the folder structure with pagination support. |
| `highlights.list` | `dovetail.api.highlights.list` | `read` | List highlights from your Dovetail workspace with optional filtering and pagination. Use this action to retrieve highlights that have been created across your notes and projects. Supports filtering by project or note, and cursor-based pagination for large result sets. |
| `insights.create` | `dovetail.api.insights.create` | `write` | Creates a new insight in Dovetail to store synthesized research findings, observations, or conclusions. Use this tool when you need to document and save key findings from user research, interviews, or data analysis. Insights can optionally be linked to a project for better organization. Returns the created insight's ID, title, creation timestamp, and other metadata. Note: The body content is stored but not included in the response. |
| `insights.delete` | `dovetail.api.insights.delete` | `destructive` | Tool to delete an existing insight. Use when you have confirmed the insight ID and want to move it to trash (restorable for 30 days). |
| `insights.export` | `dovetail.api.insights.export` | `read` | Tool to export an insight in HTML or Markdown format. Use when you need to retrieve the full content of an insight for documentation, reporting, or sharing purposes. The exported content includes the insight's title and body in the specified format. |
| `insights.get` | `dovetail.api.insights.get` | `read` | Tool to retrieve details of a specific insight by ID. Use when you need full insight metadata from Dovetail. |
| `insights.importFile` | `dovetail.api.insights.importFile` | `write` | Tool to import a file from a public URL as a new insight in Dovetail. Use when you need to create an insight from an external file source such as PDFs, images, or documents. The file must be publicly accessible for Dovetail to fetch and import it. After import, the insight can be analyzed, tagged, and connected to projects. |
| `insights.list` | `dovetail.api.insights.list` | `read` | Tool to get a list of insights associated with a workspace. Use when you need to retrieve insights with optional filtering by project, publication status, or title, and support for cursor-based pagination. |
| `insights.listUserInsights` | `dovetail.api.insights.listUserInsights` | `read` | List personal insights for a user in Dovetail. Returns a paginated list of insights including their IDs, titles, creation dates, and published status. Use DOVETAIL_GET_TOKEN_INFO to obtain a valid user_id. |
| `insights.update` | `dovetail.api.insights.update` | `write` | Updates an existing insight in Dovetail, allowing you to modify the title and custom fields. Use when you need to revise insight information, correct titles, or update custom field values. |
| `notes.create` | `dovetail.api.notes.create` | `write` | Tool to create a note in a Dovetail project with text content, title and/or custom fields. Use when you need to document research notes, store interview findings, or create structured content within a project. The note content is stored but not returned in the response. |
| `notes.delete` | `dovetail.api.notes.delete` | `destructive` | Tool to delete an existing note. Use when you have confirmed the note ID and want to move it to trash (restorable for 30 days). |
| `notes.export` | `dovetail.api.notes.export` | `read` | Tool to export a note from Dovetail in HTML or Markdown format. Use when you need to retrieve the full content of a note in a specific export format. |
| `notes.get` | `dovetail.api.notes.get` | `read` | Tool to retrieve details of a specific note. Use when you have confirmed the note ID and need full note metadata from Dovetail. |
| `notes.importFile` | `dovetail.api.notes.importFile` | `write` | Tool to import a file from a public URL as a new note in Dovetail. Use when you need to create a note by importing content from an accessible file URL (PDF, video, audio, etc.). |
| `notes.list` | `dovetail.api.notes.list` | `read` | List notes in Dovetail workspace with optional pagination and sorting. Use this tool to retrieve notes from your Dovetail workspace. Supports pagination for large result sets and sorting options. Returns note metadata including IDs, titles, timestamps, and associated project information. |
| `notes.update` | `dovetail.api.notes.update` | `write` | Tool to update an existing note in Dovetail. Use when you need to modify a note's title, content, or custom fields. Example: "Update note 8IFq5LEC6hV1Vgsu0jPNJ with new title 'Q1 Review'". |
| `projects.create` | `dovetail.api.projects.create` | `write` | Tool to create a new project in your Dovetail workspace. Use when you need to create a project to organize research data. |
| `projects.get` | `dovetail.api.projects.get` | `read` | Tool to retrieve details of a specific project. Use when you have confirmed the project ID and need full project metadata from Dovetail. |
| `projects.list` | `dovetail.api.projects.list` | `read` | Tool to list all projects in Dovetail. Use after authenticating with a valid workspace token when you need to retrieve the full project list. |
| `search.magicSearch` | `dovetail.api.search.magicSearch` | `read` | Tool to perform a magic search across workspace data. Use when you need to retrieve relevant highlights, notes, insights, channels, themes, or tags by query. |
| `tags.list` | `dovetail.api.tags.list` | `read` | List all tags in the authenticated Dovetail workspace. Returns tag details including title, color, highlight count, and timestamps. Supports pagination for workspaces with many tags. |
| `token.getInfo` | `dovetail.api.token.getInfo` | `read` | Retrieves information about the current API token, including its unique identifier and the associated workspace subdomain. Use this to verify which workspace the token belongs to. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/dovetail

## License

Apache-2.0
