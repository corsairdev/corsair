# @corsair-dev/customgpt

CustomGPT plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/customgpt
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `conversations.create` | `customgpt.api.conversations.create` | `write` | Tool to create a new conversation session for a CustomGPT agent. Use this when starting a new chat interaction - it returns a session ID that you'll use to send messages. Optionally provide a name to help identify the conversation later. |
| `licenses.delete` | `customgpt.api.licenses.delete` | `destructive` | Deletes a license from a CustomGPT project/agent. Requires numeric project ID and license ID. This action is idempotent - it succeeds even if the license doesn't exist (404). The project must have licenses enabled in its plan for this endpoint to work properly. [DESTRUCTIVE · IRREVERSIBLE] |
| `licenses.get` | `customgpt.api.licenses.get` | `read` | Tool to retrieve a license for a specific project. Use when you need to fetch license details by license ID. |
| `licenses.list` | `customgpt.api.licenses.list` | `read` | List all licenses for a CustomGPT project/agent. Returns an array of license objects with details like ID, type, status, and timestamps. Returns an empty array if the project has no licenses or if licenses are not enabled for the project. Use this when you need to check what licenses exist for a specific project/agent. |
| `licenses.update` | `customgpt.api.licenses.update` | `write` | Updates the name of an existing license for a CustomGPT project/agent. Prerequisites: - The project must have licenses enabled in its plan - Both project ID and license ID must be valid and exist - Use List Projects to get valid project IDs - Use List Project Licenses to get valid license IDs for a project This action only updates the license name. Other license properties cannot be modified through this endpoint. |
| `limits.getUsage` | `customgpt.api.limits.getUsage` | `read` | Get account usage limits showing current usage vs. maximum allowed for projects, storage credits, and API queries. This returns how many projects, storage credits (characters indexed), and queries you've used compared to your account's maximum limits. Use this to monitor quota consumption. |
| `messages.get` | `customgpt.api.messages.get` | `read` | Tool to get message details from a CustomGPT conversation. Returns the complete details for a single message, including the user's prompt, the agent's response, timestamps, citations, and any attached metadata. |
| `messages.getTrustScore` | `customgpt.api.messages.getTrustScore` | `read` | Tool to retrieve verification trust score for a message in a CustomGPT conversation. Returns a score calculated by checking how well the agent's claims are supported by source documents. Higher scores indicate better-grounded responses with stronger evidence. |
| `messages.list` | `customgpt.api.messages.list` | `read` | Retrieves all messages from a CustomGPT conversation, including both user queries and AI responses. Use this to view the complete chat history for a specific conversation session. Returns an empty list if the conversation doesn't exist or has no messages. |
| `messages.submitFeedback` | `customgpt.api.messages.submitFeedback` | `write` | Tool to submit feedback (thumbs up/down) for a message in a CustomGPT conversation. Use this to record user satisfaction signals that help identify which AI responses are helpful and which need improvement. Feedback can be changed by submitting a new reaction value. |
| `messages.verify` | `customgpt.api.messages.verify` | `write` | Tool to verify message accuracy by triggering a fact-checking verification process. Use when you need to verify claims in a conversation message against source documents. The system compares each claim and reports which claims are supported, partially supported, or unsupported. |
| `pages.delete` | `customgpt.api.pages.delete` | `destructive` | Tool to delete a document from a CustomGPT agent's knowledge base. Permanently removes a document and the agent will no longer reference this content when answering questions. Use this to remove outdated or incorrect information. Warning: This action cannot be undone. [DESTRUCTIVE · IRREVERSIBLE] |
| `pages.getMetadata` | `customgpt.api.pages.getMetadata` | `read` | Tool to get document metadata including title, source URL, word count, and custom metadata fields. Use this to display document information or manage your knowledge base. |
| `pages.list` | `customgpt.api.pages.list` | `read` | Lists all documents in a CustomGPT agent's knowledge base. Returns indexed content including webpages, PDFs, and uploaded files that the agent can reference. Supports filtering by crawl/index status and pagination. Use this to audit knowledge sources or verify successful document ingestion. |
| `pages.reindex` | `customgpt.api.pages.reindex` | `write` | Tool to reindex a document in CustomGPT knowledge base. Re-crawls and re-indexes a URL-based document to update its content. Use this when the source content has changed and you want the agent to use the updated version. Only works for URL-based documents. |
| `pages.updateMetadata` | `customgpt.api.pages.updateMetadata` | `write` | Update document metadata for a specific page in a CustomGPT project. Updates custom metadata fields such as title, description, URL, and image that help organize and manage your knowledge base. Use when you need to add tags, categories, or other organizational information to documents. |
| `personas.activate` | `customgpt.api.personas.activate` | `write` | Restore a previous persona version for a CustomGPT agent. Activates a previous persona version, making it the current active persona. This creates a new version entry in the history (it doesn't overwrite), preserving the full audit trail. Use this to roll back to a known-good configuration. Requires Custom plan. |
| `personas.list` | `customgpt.api.personas.list` | `read` | Tool to list persona versions for a CustomGPT agent. Use when you need to view the version history of an agent's persona. Every time the persona is updated, a snapshot is automatically saved, allowing you to view changes over time or restore a previous version. Results are paginated. Requires Custom plan. |
| `projects.clone` | `customgpt.api.projects.clone` | `write` | Tool to clone a CustomGPT agent (project). Creates a complete copy of an existing agent, including its knowledge base, persona, and settings. Use this to create variations of an agent for testing, or to use an existing agent as a template for a new one. |
| `projects.create` | `customgpt.api.projects.create` | `write` | Tool to create a new CustomGPT agent from a sitemap URL or file upload. The agent immediately begins processing the content to build its knowledge base. Use when you need to create a new AI agent with custom knowledge from web content or documents. Either sitemap_path or file must be provided. |
| `projects.delete` | `customgpt.api.projects.delete` | `destructive` | Tool to delete a CustomGPT project by ID. Use when you need to permanently remove an existing agent after confirming the ID. [DESTRUCTIVE · IRREVERSIBLE] |
| `projects.get` | `customgpt.api.projects.get` | `read` | Tool to get agent details. Returns the full configuration and current status for a specific agent. Use this to check processing status, view settings, or retrieve metadata about the agent. |
| `projects.list` | `customgpt.api.projects.list` | `read` | Lists all CustomGPT projects (agents) for the authenticated user. Returns projects with full details including ID, name, type, chat status, and timestamps. Supports pagination via the 'page' parameter. Use this to discover available projects or iterate through all projects. |
| `projects.plugins` | `customgpt.api.projects.plugins` | `read` | Tool to retrieve plugin details for a specific CustomGPT agent (project). Use when you need to inspect plugin configuration, status, and metadata for an agent. |
| `projects.stats` | `customgpt.api.projects.stats` | `read` | Tool to get agent statistics. Returns usage metrics and performance statistics for an agent, including total conversations, query counts, document statistics, and processing information. Use when you need to monitor agent performance or generate usage reports. |
| `projects.update` | `customgpt.api.projects.update` | `write` | Updates an existing CustomGPT agent's name or configuration settings. Use this to rename an agent or modify its basic properties without affecting its knowledge base. Returns the complete updated project details including all metadata. |
| `reports.exportLeads` | `customgpt.api.reports.exportLeads` | `read` | Export leads from a CustomGPT project. Returns lead information captured from conversations including email addresses, names, phone numbers, and custom fields. Supports pagination and date range filtering. Use this to sync leads with CRM or marketing tools. |
| `reports.getAnalysis` | `customgpt.api.reports.getAnalysis` | `read` | Tool to retrieve analytics chart data for a CustomGPT project. Returns time-series data formatted for charts, with daily or weekly breakdowns of key metrics including conversation counts, query counts, and queries-per-conversation ratios. Use this to generate usage reports, track project engagement over time, or visualize chatbot performance trends. |
| `reports.getConversations` | `customgpt.api.reports.getConversations` | `read` | Tool to get conversation analytics for a CustomGPT project. Returns conversation metrics including total conversations, average queries per conversation, and other engagement statistics. Use this to understand how users engage with your agent and analyze conversation patterns over time. |
| `reports.getIntelligence` | `customgpt.api.reports.getIntelligence` | `read` | Tool to get customer intelligence for a CustomGPT project. Returns AI-analyzed insights about users including common intents, emotional sentiment, frequently discussed topics, and emerging trends. Use this to understand what users are asking about and identify patterns in user behavior. |
| `reports.getTraffic` | `customgpt.api.reports.getTraffic` | `read` | Tool to retrieve traffic analytics for a CustomGPT agent/project. Returns user traffic metrics including unique visitors, session counts, geographic distribution, and device types. Use this to understand who's using your agent and how they're accessing it. |
| `settings.get` | `customgpt.api.settings.get` | `read` | Retrieve configuration settings for a specific CustomGPT agent/project. Returns settings including: chatbot avatar, background, default prompt, example questions, response source, language, and branding preferences. Use this to inspect agent configuration, audit settings, or retrieve values before making updates. Note: Some newly created projects may not have settings initialized yet and will return a 404. |
| `settings.update` | `customgpt.api.settings.update` | `write` | Update CustomGPT agent configuration settings. Updates persona instructions, response format, citation style, branding, and deployment settings. Only include fields you want to change - omitted fields retain their current values. Use this to configure agent behavior, customize appearance, or adjust user experience settings. |
| `sources.add` | `customgpt.api.sources.add` | `write` | Add a data source to a CustomGPT agent's knowledge base. Connects content via sitemap URL, file upload, or integration. The system begins indexing immediately after creation. Use when adding documentation, FAQs, or knowledge content to an agent. |
| `sources.delete` | `customgpt.api.sources.delete` | `destructive` | Tool to delete a data source from a CustomGPT agent. Removes the source and all its documents from the agent's knowledge base. Use this to disconnect content that's no longer relevant or to clean up after testing. [DESTRUCTIVE · IRREVERSIBLE] |
| `sources.list` | `customgpt.api.sources.list` | `read` | Tool to list all data sources connected to an agent. Returns sources from various origins like sitemaps, Google Drive folders, SharePoint sites, or uploaded files. Use this to manage what content feeds into an agent's knowledge base. |
| `sources.update` | `customgpt.api.sources.update` | `write` | Update source settings for a CustomGPT agent data source. Configure how the source is indexed and kept up to date by adjusting auto-sync frequency, crawl depth, file filters, and refresh behavior. Use this to fine-tune sitemap crawling (JavaScript execution, image extraction), control which pages are added or removed during syncs, and set up custom refresh schedules. |
| `user.getProfile` | `customgpt.api.user.getProfile` | `read` | Tool to retrieve the current user's profile information. Use when you need to display or verify authenticated user details after login. |
| `user.searchTeamMembers` | `customgpt.api.user.searchTeamMembers` | `read` | Tool to search for team members by email address or user ID. Use this to find users when assigning permissions or managing team access. Requires Owner or Admin role to execute. |
| `user.updateProfile` | `customgpt.api.user.updateProfile` | `write` | Updates the authenticated user's profile information in CustomGPT. Use this action to modify profile details such as the user's display name, email address, or profile photo URL. All fields are optional - only the fields you provide will be updated. The action returns the complete updated user profile. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/customgpt

## License

Apache-2.0
