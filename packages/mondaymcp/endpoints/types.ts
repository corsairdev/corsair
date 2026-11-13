import { z } from 'zod';

// Wire contracts for the monday.com Platform MCP server (https://mcp.monday.com/mcp,
// Streamable HTTP JSON-RPC 2.0). Every input schema mirrors the published parameter
// table of its tool on developer.monday.com (Platform MCP tools reference, updated
// 2026-09-06); parameter names are the provider's wire names. Tool results are MCP
// CallToolResult envelopes whose payload shapes are provider-defined, so they are
// parsed loosely on purpose.
export const MondayMcpToolResultItemSchema = z
	.object({
		type: z.string().optional(),
		text: z.string().optional(),
	})
	.loose();

export const MondayMcpToolResultSchema = z
	.object({
		content: z.array(MondayMcpToolResultItemSchema),
		isError: z.boolean().optional(),
	})
	.loose();

export type MondayMcpToolResult = z.infer<typeof MondayMcpToolResultSchema>;

export const AgentsCatalogInputSchema = z
	.object({
		action: z
			.enum(['list_triggers', 'list_skills'])
			.describe('list_triggers or list_skills.'),
		block_reference_ids: z
			.array(z.unknown())
			.describe(
				'Used with list_triggers. Fetch specific trigger types by block_reference_id. Omit to return all trigger types.',
			)
			.optional(),
	})
	.loose();

export type AgentsCatalogInput = z.infer<typeof AgentsCatalogInputSchema>;

export const SchemaExecuteQueryInputSchema = z
	.object({
		query: z
			.string()
			.describe('The full GraphQL query or mutation string to execute.'),
		variables: z
			.string()
			.describe(
				'A JSON string containing the variables for the GraphQL operation. Pass "{}" if the query uses no variables.',
			),
	})
	.loose();

export type SchemaExecuteQueryInput = z.infer<
	typeof SchemaExecuteQueryInputSchema
>;

export const DashboardsAllWidgetsSchemaInputSchema = z.object({}).loose();

export type DashboardsAllWidgetsSchemaInput = z.infer<
	typeof DashboardsAllWidgetsSchemaInputSchema
>;

export const BoardsInsightsInputSchema = z
	.object({
		boardId: z
			.number()
			.describe('The ID of the board to calculate insights for.'),
		aggregations: z
			.array(z.unknown())
			.describe(
				'Array of aggregation objects, each with a `columnId` and an optional `function`. Supported functions include `COUNT`, `COUNT_ITEMS`, `SUM`, `AVERAGE`, `MIN`, `MAX`, `MEDIAN`, `LABEL`, `DATE_TRUNC_MONTH`, `DATE_TRUNC_WEEK`, and more. Columns in `groupBy` must also appear here without a function.',
			)
			.optional(),
		groupBy: z
			.array(z.unknown())
			.describe(
				'Array of column IDs to group results by. All groupBy columns must also be present in `aggregations` without a function.',
			)
			.optional(),
		limit: z
			.number()
			.describe(
				'Maximum number of result rows to return. Maximum 1000. Defaults to `1000`.',
			)
			.optional(),
		filters: z
			.array(z.unknown())
			.describe(
				'Array of column filter objects (same structure as `get_board_items_page` filters). Narrows the item set before aggregation.',
			)
			.optional(),
		filtersOperator: z
			.string()
			.describe(
				'Logical operator for combining multiple filters: `and` (default) or `or`.',
			)
			.optional(),
		orderBy: z
			.array(z.unknown())
			.describe(
				'Array of sort objects with `columnId` and `direction` (`asc` or `desc`).',
			)
			.optional(),
	})
	.loose();

export type BoardsInsightsInput = z.infer<typeof BoardsInsightsInputSchema>;

export const ItemsChangeColumnValuesInputSchema = z
	.object({
		boardId: z.number().describe('The ID of the board that contains the item.'),
		itemId: z.number().describe('The ID of the item to update.'),
		columnValues: z
			.string()
			.describe(
				'A JSON string of column values to update. Keys are column IDs, values are type-specific. Examples: `{"text_col": "New value"}`, `{"status_col": {"label": "Done"}}`, `{"date_col": {"date": "2024-06-01"}}`, `{"email_col": "user@example.com"}`, `{"phone_col": "+1-800-555-0100"}`.',
			),
		createLabelsIfMissing: z
			.boolean()
			.describe(
				"If `true`, creates new Status or Dropdown labels that don't already exist. Requires board structure modification permission. Defaults to `false`.",
			)
			.optional(),
	})
	.loose();

export type ItemsChangeColumnValuesInput = z.infer<
	typeof ItemsChangeColumnValuesInputSchema
>;

export const AutomationsCreateInputSchema = z
	.object({
		userPrompt: z
			.string()
			.describe(
				'Structured description of the automation to create (see the format below).',
			),
		boardId: z.string().describe('The numeric board ID as a string.'),
	})
	.loose();

export type AutomationsCreateInput = z.infer<
	typeof AutomationsCreateInputSchema
>;

export const BoardsCreateInputSchema = z
	.object({
		boardName: z.string().describe('The display name of the new board.'),
		boardKind: z
			.string()
			.describe(
				'Visibility level of the board. One of `public`, `private`, or `share`. Defaults to `public`.',
			)
			.optional(),
		boardDescription: z
			.string()
			.describe("A short description of the board's purpose.")
			.optional(),
		workspaceId: z
			.string()
			.describe(
				'The ID of the workspace to create the board in. Use `list_workspaces` to discover workspace IDs.',
			)
			.optional(),
		boardOwnerIds: z
			.array(z.unknown())
			.describe(
				'List of user IDs to set as board owners. Use `list_users_and_teams` to look up user IDs.',
			)
			.optional(),
	})
	.loose();

export type BoardsCreateInput = z.infer<typeof BoardsCreateInputSchema>;

export const ColumnsCreateInputSchema = z
	.object({
		boardId: z.number().describe('The ID of the board to add the column to.'),
		columnType: z
			.string()
			.describe(
				'The type of column to create. Supported types include: `auto_number`, `board_relation`, `checkbox`, `date`, `dependency`, `dropdown`, `email`, `file`, `formula`, `hour`, `link`, `location`, `long_text`, `numbers`, `people`, `phone`, `rating`, `status`, `tags`, `team`, `text`, `time_tracking`, `timeline`, `vote`, `week`, `world_clock`, and others.',
			),
		columnTitle: z.string().describe('The display title for the new column.'),
		columnDescription: z
			.string()
			.describe('An optional description shown in the column header tooltip.')
			.optional(),
		columnSettings: z
			.string()
			.describe(
				'Column-specific configuration as a JSON string. Use `get_column_type_info` with `fetchMode: "schema"` to get the correct structure for a given type.',
			)
			.optional(),
	})
	.loose();

export type ColumnsCreateInput = z.infer<typeof ColumnsCreateInputSchema>;

export const DashboardsCreateInputSchema = z
	.object({
		name: z
			.string()
			.describe('Human-readable title for the dashboard (UTF-8 characters).'),
		workspace_id: z
			.string()
			.describe(
				'ID of the workspace that will own the dashboard. Use `list_workspaces` or `workspace_info` to find workspace IDs.',
			),
		board_ids: z
			.array(z.unknown())
			.describe(
				'List of board IDs (as strings) to connect to the dashboard. Minimum 1, maximum 50. All widgets on this dashboard will source data from these boards.',
			),
		kind: z
			.string()
			.describe(
				'Visibility level: `PUBLIC` or `PRIVATE`. Defaults to `PUBLIC`.',
			)
			.optional(),
		board_folder_id: z
			.string()
			.describe(
				'Folder ID within the workspace to place the dashboard in. If omitted, the dashboard is placed in the workspace root.',
			)
			.optional(),
	})
	.loose();

export type DashboardsCreateInput = z.infer<typeof DashboardsCreateInputSchema>;

export const DocsCreateInputSchema = z
	.object({
		doc_name: z.string().describe('The display name of the new document.'),
		markdown: z
			.string()
			.describe(
				'Markdown content to import into the document as blocks on creation.',
			),
		location: z
			.enum(['workspace', 'item'])
			.describe(
				'Where to create the document. One of `workspace` (standalone doc) or `item` (attached to a board item).',
			),
		workspace_id: z
			.number()
			.describe(
				'The ID of the workspace to create the document in. Use `list_workspaces` to discover workspace IDs.',
			)
			.optional(),
		doc_kind: z
			.string()
			.describe(
				'Visibility of the document. One of `public`, `private`, or `share`. Defaults to `public`. Only used when location=`workspace`.',
			)
			.optional(),
		folder_id: z
			.number()
			.describe(
				'ID of a folder to place the document inside. Only used when location=`workspace`. Use `search` with searchType `FOLDERS` to find folder IDs.',
			)
			.optional(),
		item_id: z
			.number()
			.describe(
				'The ID of the board item to attach the document to. Only used when location=`item`.',
			)
			.optional(),
		column_id: z
			.string()
			.describe(
				"ID of an existing doc column on the item's board. If omitted, a new doc column is created automatically. Only used when location=`item`.",
			)
			.optional(),
	})
	.loose()
	.superRefine((value, ctx) => {
		const field = value.location === 'workspace' ? 'workspace_id' : 'item_id';
		if (value[field] === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: [field],
				message: `${field} is required for ${value.location} documents`,
			});
		}
	});

export type DocsCreateInput = z.infer<typeof DocsCreateInputSchema>;

export const FoldersCreateInputSchema = z
	.object({
		workspaceId: z
			.string()
			.describe('The ID of the workspace where the folder will be created.'),
		name: z.string().describe('The name of the folder.'),
		color: z
			.string()
			.describe(
				"The folder's color. One of: `AQUAMARINE`, `BRIGHT_BLUE`, `BRIGHT_GREEN`, `CHILI_BLUE`, `DARK_ORANGE`, `DARK_PURPLE`, `DARK_RED`, `DONE_GREEN`, `INDIGO`, `LIPSTICK`, `NULL`, `PURPLE`, `SOFIA_PINK`, `STUCK_RED`, `SUNSET`, `WORKING_ORANGE`.",
			)
			.optional(),
		fontWeight: z
			.string()
			.describe(
				'The font weight of the folder label. One of: `FONT_WEIGHT_BOLD`, `FONT_WEIGHT_LIGHT`, `FONT_WEIGHT_NORMAL`, `FONT_WEIGHT_VERY_LIGHT`, `NULL`.',
			)
			.optional(),
		customIcon: z
			.string()
			.describe(
				'The icon displayed on the folder. One of: `FOLDER`, `MOREBELOW`, `MOREBELOWFILLED`, `NULL`, `WORK`.',
			)
			.optional(),
		parentFolderId: z
			.string()
			.describe(
				'The ID of a parent folder to nest this folder inside. If omitted, the folder is created at the workspace root.',
			)
			.optional(),
	})
	.loose();

export type FoldersCreateInput = z.infer<typeof FoldersCreateInputSchema>;

export const FormsCreateInputSchema = z
	.object({
		destination_workspace_id: z
			.string()
			.describe(
				'ID of the workspace in which the form and its backing board will be created.',
			),
		destination_name: z
			.string()
			.describe(
				'Name of the backing board that stores form responses. If omitted, the board receives a default name.',
			)
			.optional(),
		board_kind: z
			.string()
			.describe(
				'Visibility of the backing board. One of `private`, `public`, or `share`.',
			)
			.optional(),
		destination_folder_id: z
			.string()
			.describe('ID of an existing folder to place the backing board in.')
			.optional(),
		destination_folder_name: z
			.string()
			.describe(
				'Name of a new folder to create and place the backing board in.',
			)
			.optional(),
		board_owner_ids: z
			.array(z.unknown())
			.describe('List of user IDs to set as owners of the backing board.')
			.optional(),
		board_owner_team_ids: z
			.array(z.unknown())
			.describe('List of team IDs to set as owners of the backing board.')
			.optional(),
		board_subscriber_ids: z
			.array(z.unknown())
			.describe('User IDs to notify on board activity.')
			.optional(),
		board_subscriber_teams_ids: z
			.array(z.unknown())
			.describe('Team IDs to notify on board activity.')
			.optional(),
	})
	.loose();

export type FormsCreateInput = z.infer<typeof FormsCreateInputSchema>;

export const FormsCreateSubmissionInputSchema = z
	.object({
		form_token: z
			.string()
			.describe(
				'The form token, a full WorkForm URL, or a shortened wkf.ms URL. Shortened URLs are automatically resolved.',
			),
		answers: z
			.array(z.unknown())
			.describe(
				'Array of answer objects. Each object must include question_id and exactly one answer field matching the question type. See answer type fields below.',
			),
		form_timezone_offset: z
			.number()
			.describe(
				"The submitter's timezone offset in minutes (e.g., -120 for UTC−2, 0 for UTC, 120 for UTC+2).",
			),
		password: z
			.string()
			.describe(
				'Required only if the form has password protection enabled (check features.password.enabled from get_form).',
			)
			.optional(),
		tags: z
			.array(z.unknown())
			.describe(
				'Routing tags to attach to the submission. Each tag maps a column_id to a value.',
			)
			.optional(),
	})
	.loose();

export type FormsCreateSubmissionInput = z.infer<
	typeof FormsCreateSubmissionInputSchema
>;

export const GroupsCreateInputSchema = z
	.object({
		boardId: z.string().describe('The ID of the board to create the group in.'),
		groupName: z
			.string()
			.describe('The display name of the new group. Maximum 255 characters.'),
		groupColor: z
			.string()
			.describe(
				'Hex color for the group header. Must be one of the 19 predefined monday.com group colors: `#037f4c`, `#00c875`, `#9cd326`, `#cab641`, `#ffcb00`, `#784bd1`, `#9d50dd`, `#007eb5`, `#579bfc`, `#66ccff`, `#bb3354`, `#df2f4a`, `#ff007f`, `#ff5ac4`, `#ff642e`, `#fdab3d`, `#7f5347`, `#c4c4c4`, `#757575`.',
			)
			.optional(),
		relativeTo: z
			.string()
			.describe(
				'The ID of an existing group to position this group relative to. Use `get_board_info` to find group IDs.',
			)
			.optional(),
		positionRelativeMethod: z
			.string()
			.describe(
				'Whether to place the new group `before_at` or `after_at` the `relativeTo` group.',
			)
			.optional(),
	})
	.loose();

export type GroupsCreateInput = z.infer<typeof GroupsCreateInputSchema>;

export const ItemsCreateInputSchema = z
	.object({
		boardId: z.number().describe('The ID of the board to create the item on.'),
		name: z.string().describe('The display name of the new item.'),
		columnValues: z
			.string()
			.describe(
				'A JSON string of initial column values. Keys are column IDs, values are type-specific. Examples: `{"text_col": "hello"}`, `{"status_col": {"label": "Done"}}`, `{"date_col": {"date": "2024-05-10"}}`, `{"email_col": "user@example.com"}`.',
			),
		groupId: z
			.string()
			.describe(
				"The ID of the group to add the item to. Defaults to the board's top group if not specified.",
			)
			.optional(),
		parentItemId: z
			.number()
			.describe('The ID of a parent item to create this as a sub-item under.')
			.optional(),
		duplicateFromItemId: z
			.number()
			.describe(
				'The ID of an existing item to duplicate as the base. Only provide when duplicating an item.',
			)
			.optional(),
	})
	.loose();

export type ItemsCreateInput = z.infer<typeof ItemsCreateInputSchema>;

export const NotificationsCreateInputSchema = z
	.object({
		user_id: z
			.string()
			.describe('The ID of the user to send the notification to.'),
		target_id: z
			.string()
			.describe(
				'The ID of the target object. Provide an update or reply ID when `target_type` is `"Post"`, or an item or board ID when `target_type` is `"Project"`.',
			),
		text: z.string().describe('The notification message text.'),
		target_type: z
			.string()
			.describe(
				'The context for the notification link. `"Post"` links to an update or reply; `"Project"` links to an item or board.',
			),
	})
	.loose();

export type NotificationsCreateInput = z.infer<
	typeof NotificationsCreateInputSchema
>;

export const UpdatesCreateInputSchema = z
	.object({
		itemId: z.number().describe('The ID of the item to post the update on.'),
		body: z
			.string()
			.describe(
				'The update text. Use HTML tags for formatting. Do not use `@` mentions here — use `mentionsList` instead.',
			),
		mentionsList: z
			.string()
			.describe(
				'JSON array of mention objects. Each object requires an `id` and a `type`. Valid types: `User`, `Team`, `Board`, `Project`. Example: `[{"id": "48202303", "type": "User"}]`.',
			)
			.optional(),
		parentId: z
			.number()
			.describe(
				'The ID of an existing update to reply to. Omit this parameter to create a top-level update.',
			)
			.optional(),
	})
	.loose();

export type UpdatesCreateInput = z.infer<typeof UpdatesCreateInputSchema>;

export const ViewsCreateInputSchema = z
	.object({
		boardId: z.string().describe('The board ID to create the view on.'),
		type: z
			.unknown()
			.describe(
				'The type of board view to create. Defaults to TABLE. Use TABLE for standard board views.',
			)
			.optional(),
		name: z
			.string()
			.describe(
				'The name of the view (e.g. "High Priority Items", "My Tasks").',
			)
			.optional(),
		filter: z
			.record(z.string(), z.unknown())
			.describe(
				'Filter configuration. Contains rules (an array of { column_id, compare_value, operator }) and an optional operator (logical operator between rules, defaults to and).',
			)
			.optional(),
		sort: z
			.array(z.unknown())
			.describe(
				'Sort configuration. Array of { column_id, direction } objects. direction defaults to asc.',
			)
			.optional(),
		settings: z
			.record(z.string(), z.unknown())
			.describe(
				'Type-specific view settings as a JSON object. The shape varies by view type. For TABLE views, prefer create_view_table.',
			)
			.optional(),
	})
	.loose();

export type ViewsCreateInput = z.infer<typeof ViewsCreateInputSchema>;

export const ViewsCreateTableInputSchema = z
	.object({
		boardId: z.string().describe('The board ID to create the table view on.'),
		name: z
			.string()
			.describe(
				'The name of the view (e.g. "High Priority Items", "My Tasks").',
			)
			.optional(),
		filter: z
			.record(z.string(), z.unknown())
			.describe(
				'Filter configuration. Contains rules (an array of { column_id, compare_value, operator }) and an optional operator (logical operator between rules, defaults to and).',
			)
			.optional(),
		sort: z
			.array(z.unknown())
			.describe(
				'Sort configuration. Array of { column_id, direction } objects. direction defaults to asc.',
			)
			.optional(),
		tags: z
			.array(z.unknown())
			.describe('Tags to apply to the view.')
			.optional(),
		settings: z
			.record(z.string(), z.unknown())
			.describe(
				'Table-specific settings: columns (visibility/order) and group_by. See the settings reference below.',
			)
			.optional(),
	})
	.loose();

export type ViewsCreateTableInput = z.infer<typeof ViewsCreateTableInputSchema>;

export const DashboardsCreateWidgetInputSchema = z
	.object({
		parent_container_id: z
			.string()
			.describe(
				'ID of the parent container — a dashboard ID or a board view ID.',
			),
		parent_container_type: z
			.string()
			.describe(
				'Type of the parent container. Must be `DASHBOARD` or `BOARD_VIEW`.',
			),
		widget_kind: z
			.string()
			.describe(
				'The type of widget to create. One of: `APP_FEATURE`, `BATTERY`, `CALENDAR`, `CHART`, `GANTT`, `LISTVIEW`, `NUMBER`.',
			),
		widget_name: z
			.string()
			.describe('Display name for the widget (1–255 UTF-8 characters).'),
		settings: z
			.record(z.string(), z.unknown())
			.describe(
				'Widget-specific configuration as a JSON object. Must conform to the schema for the specified `widget_kind`. Use `all_widgets_schema` to retrieve the required structure for each type.',
			)
			.optional(),
	})
	.loose();

export type DashboardsCreateWidgetInput = z.infer<
	typeof DashboardsCreateWidgetInputSchema
>;

export const WorkflowsCreateInputSchema = z
	.object({
		workspaceId: z
			.string()
			.describe('The ID of the workspace to create the workflow in.'),
		title: z
			.string()
			.describe('Workflow title. Defaults to "New Workflow".')
			.optional(),
		privacyKind: z
			.enum(['PUBLIC', 'PRIVATE', 'SHAREABLE'])
			.describe(
				'Visibility: PUBLIC (default), PRIVATE, or SHAREABLE (accessible to guests outside the account).',
			)
			.optional(),
		description: z
			.string()
			.describe('Optional workflow description.')
			.optional(),
		folderId: z
			.string()
			.describe('Optional folder ID to place the workflow in.')
			.optional(),
		ownerIds: z
			.array(z.unknown())
			.describe('Optional list of user IDs to set as workflow owners.')
			.optional(),
	})
	.loose();

export type WorkflowsCreateInput = z.infer<typeof WorkflowsCreateInputSchema>;

export const WorkspacesCreateInputSchema = z
	.object({
		name: z.string().describe('The name of the new workspace.'),
		workspaceKind: z
			.string()
			.describe(
				'The type of workspace to create. One of: `open`, `closed`, or `template`. Open workspaces are visible to all account members; closed workspaces require an explicit invite.',
			),
		description: z
			.string()
			.describe("A short description of the workspace's purpose.")
			.optional(),
		accountProductId: z
			.string()
			.describe(
				'The account product ID to associate with the workspace (e.g., to scope the workspace to a specific monday product like CRM or Dev).',
			)
			.optional(),
	})
	.loose();

export type WorkspacesCreateInput = z.infer<typeof WorkspacesCreateInputSchema>;

export const AssetsFinalizeUploadInputSchema = z
	.object({
		uploadId: z
			.string()
			.describe('The upload_id returned by get_asset_upload_url.'),
		etag: z
			.string()
			.describe(
				'The ETag header value from the PUT response when uploading to the presigned URL.',
			),
		boardId: z.string().describe("The board's unique identifier."),
		itemId: z.string().describe("The item's unique identifier."),
		columnId: z
			.string()
			.describe(
				"The file or doc column's unique identifier to attach the uploaded asset to.",
			),
	})
	.loose();

export type AssetsFinalizeUploadInput = z.infer<
	typeof AssetsFinalizeUploadInputSchema
>;

export const FormsEditQuestionsInputSchema = z
	.object({
		action: z
			.string()
			.describe('The operation to perform: create, update, or delete.'),
		formToken: z.string().describe('The unique token identifying the form.'),
		questionId: z
			.string()
			.describe(
				'ID of the question to update or delete. Required for update and delete.',
			)
			.optional(),
		question: z
			.record(z.string(), z.unknown())
			.describe(
				'The question definition. Required for create. For update, required with type always included. See sub-fields below.',
			)
			.optional(),
	})
	.loose();

export type FormsEditQuestionsInput = z.infer<
	typeof FormsEditQuestionsInputSchema
>;

export const AssetsGetUploadUrlInputSchema = z
	.object({
		fileName: z
			.string()
			.describe(
				'The name of the file to upload, including extension (e.g. "report.pdf").',
			),
		contentType: z
			.string()
			.describe(
				'The MIME type of the file (e.g. "application/pdf", "image/png", "text/plain").',
			),
		fileSize: z
			.number()
			.describe(
				'The file size in bytes. Maximum 500&nbsp;MB (524288000 bytes).',
			),
	})
	.loose();

export type AssetsGetUploadUrlInput = z.infer<
	typeof AssetsGetUploadUrlInputSchema
>;

export const AssetsGetInputSchema = z
	.object({
		ids: z
			.array(z.unknown())
			.describe(
				'Array of asset IDs to fetch. Must contain at least one ID. Asset IDs are numeric strings (e.g., `["12345678"]`).',
			),
	})
	.loose();

export type AssetsGetInput = z.infer<typeof AssetsGetInputSchema>;

export const BoardsGetActivityInputSchema = z
	.object({
		boardId: z
			.number()
			.describe('The ID of the board to retrieve activity logs for.'),
		fromDate: z
			.string()
			.describe(
				'Start of the activity window in ISO 8601 format (e.g. `2025-12-01T00:00:00Z`). Defaults to 30 days ago.',
			)
			.optional(),
		toDate: z
			.string()
			.describe(
				'End of the activity window in ISO 8601 format. Defaults to the current time.',
			)
			.optional(),
		includeData: z
			.boolean()
			.describe(
				'Whether to include the full before/after data payload for each event. Defaults to `false`. Can significantly increase response size.',
			)
			.optional(),
	})
	.loose();

export type BoardsGetActivityInput = z.infer<
	typeof BoardsGetActivityInputSchema
>;

export const BoardsGetInfoInputSchema = z
	.object({
		boardId: z
			.number()
			.describe('The numeric ID of the board to retrieve information for.'),
	})
	.loose();

export type BoardsGetInfoInput = z.infer<typeof BoardsGetInfoInputSchema>;

export const BoardsGetItemsPageInputSchema = z
	.object({
		boardId: z.number().describe('The ID of the board to retrieve items from.'),
		itemIds: z
			.array(z.unknown())
			.describe('Fetch specific items by their IDs (maximum 100).')
			.optional(),
		searchTerm: z
			.string()
			.describe(
				'Free-text search term. Use when the user provides an approximate term rather than an exact column value. Prefer structured `filters` for exact matches.',
			)
			.optional(),
		limit: z
			.number()
			.describe(
				'Number of items to return per page. Range: 1–500. Defaults to `25`.',
			)
			.optional(),
		cursor: z
			.string()
			.describe(
				"Pagination cursor from the previous response's `nextCursor` field.",
			)
			.optional(),
		includeColumns: z
			.boolean()
			.describe(
				'Whether to include column values. Defaults to `false`. Only enable when you need column data — it significantly increases response size.',
			)
			.optional(),
		includeItemDescription: z
			.boolean()
			.describe(
				"Whether to include the item's rich-text description (body/notes). Defaults to `false`.",
			)
			.optional(),
		includeSubItems: z
			.boolean()
			.describe(
				'Whether to include sub-items for each item. Defaults to `false`.',
			)
			.optional(),
		subItemLimit: z
			.number()
			.describe(
				'Number of sub-items to return per item when `includeSubItems` is true. Range: 1–100. Defaults to `25`.',
			)
			.optional(),
		filters: z
			.array(z.unknown())
			.describe(
				'Array of column filter objects. Each filter requires `columnId` and `compareValue`, with optional `operator` and `compareAttribute`. Call `get_column_type_info` with `fetchMode: "guidelines"` to understand valid filter values per column type.',
			)
			.optional(),
		filtersOperator: z
			.string()
			.describe(
				'Logical operator for combining multiple filters. Either `and` (default) or `or`.',
			)
			.optional(),
		columnIds: z
			.array(z.unknown())
			.describe(
				'Limit which columns are returned when `includeColumns` is true. Omit to return all columns.',
			)
			.optional(),
		orderBy: z
			.array(z.unknown())
			.describe(
				'Array of sort objects with `columnId` and `direction` (`asc` or `desc`).',
			)
			.optional(),
	})
	.loose();

export type BoardsGetItemsPageInput = z.infer<
	typeof BoardsGetItemsPageInputSchema
>;

export const ColumnsGetTypeInfoInputSchema = z
	.object({
		columnType: z
			.string()
			.describe(
				'The column type to look up (e.g. `status`, `text`, `date`, `numbers`, `people`, `dropdown`, `timeline`).',
			),
		fetchMode: z
			.string()
			.describe(
				'Either `schema` (default) to get the full JSON settings schema, or `guidelines` to get only filter and aggregation rules.',
			)
			.optional(),
	})
	.loose();

export type ColumnsGetTypeInfoInput = z.infer<
	typeof ColumnsGetTypeInfoInputSchema
>;

export const FormsGetInputSchema = z
	.object({
		formToken: z
			.string()
			.describe(
				'The unique token identifying the form. Extract from the form URL: the alphanumeric string after /forms/ and before ?.',
			),
	})
	.loose();

export type FormsGetInput = z.infer<typeof FormsGetInputSchema>;

export const SchemaGetGraphqlSchemaInputSchema = z
	.object({
		operationType: z
			.string()
			.describe(
				'Filter results by operation type. Use "read" to return only query fields, or "write" to return only mutation fields. Omit to return both.',
			)
			.optional(),
	})
	.loose();

export type SchemaGetGraphqlSchemaInput = z.infer<
	typeof SchemaGetGraphqlSchemaInputSchema
>;

export const SprintsGetBoardsInputSchema = z.object({}).loose();

export type SprintsGetBoardsInput = z.infer<typeof SprintsGetBoardsInputSchema>;

export const MeetingsGetNotetakerInputSchema = z
	.object({
		ids: z
			.array(z.unknown())
			.describe(
				'Filter by specific meeting IDs. Use to fetch one or more specific meetings in a single call.',
			)
			.optional(),
		access: z
			.string()
			.describe(
				'Filter meetings by access level. One of `OWN` (default), `SHARED_WITH_ME`, `SHARED_WITH_ACCOUNT`, or `ALL`.',
			)
			.optional(),
		limit: z
			.number()
			.describe(
				'Maximum number of meetings to return per page. Between 1 and 100. Defaults to 25.',
			)
			.optional(),
		cursor: z
			.string()
			.describe(
				"Pagination cursor. Pass the `cursor` value from a previous response's `page_info` to fetch the next page.",
			)
			.optional(),
		search: z
			.string()
			.describe('Search meetings by title, participant name, or email.')
			.optional(),
		include_summary: z
			.boolean()
			.describe(
				'Whether to include the AI-generated summary for each meeting. Defaults to `false`.',
			)
			.optional(),
		include_topics: z
			.boolean()
			.describe(
				'Whether to include discussion topics and talking points for each meeting. Defaults to `false`.',
			)
			.optional(),
		include_action_items: z
			.boolean()
			.describe(
				'Whether to include action items for each meeting. Defaults to `false`.',
			)
			.optional(),
		include_transcript: z
			.boolean()
			.describe(
				'Whether to include the full transcript for each meeting. Transcripts can be very large. Defaults to `false`.',
			)
			.optional(),
	})
	.loose();

export type MeetingsGetNotetakerInput = z.infer<
	typeof MeetingsGetNotetakerInputSchema
>;

export const SprintsGetSummaryInputSchema = z
	.object({
		sprintId: z
			.number()
			.describe(
				'The ID of the sprint to get the summary for. Must be a completed sprint created after January 1, 2025. Use `get_sprints_metadata` to find sprint IDs.',
			),
	})
	.loose();

export type SprintsGetSummaryInput = z.infer<
	typeof SprintsGetSummaryInputSchema
>;

export const SprintsGetMetadataInputSchema = z
	.object({
		sprintsBoardId: z
			.number()
			.describe(
				'The ID of the monday Dev board containing the sprints. Use `get_monday_dev_sprints_boards` to find this ID.',
			),
		limit: z
			.number()
			.describe(
				'Number of sprints to retrieve. Between 1 and 100. Defaults to 25.',
			)
			.optional(),
	})
	.loose();

export type SprintsGetMetadataInput = z.infer<
	typeof SprintsGetMetadataInputSchema
>;

export const SchemaGetTypeDetailsInputSchema = z
	.object({
		typeName: z
			.string()
			.describe(
				'The exact name of the GraphQL type to inspect. Type names are case-sensitive (e.g., "Board", "Item", "Column").',
			),
	})
	.loose();

export type SchemaGetTypeDetailsInput = z.infer<
	typeof SchemaGetTypeDetailsInputSchema
>;

export const UpdatesListInputSchema = z
	.object({
		objectId: z
			.string()
			.describe('The ID of the item or board to retrieve updates from.'),
		objectType: z
			.string()
			.describe('The type of object: `"Item"` or `"Board"`.'),
		limit: z
			.number()
			.describe(
				'Number of updates to return per page. Default: `25`. Maximum: `100`.',
			)
			.optional(),
		page: z
			.number()
			.describe('Page number for pagination. Default: `1`.')
			.optional(),
		includeReplies: z
			.boolean()
			.describe(
				'Set to `true` to include threaded replies on each update. Default: `false`.',
			)
			.optional(),
		includeAssets: z
			.boolean()
			.describe(
				'Set to `true` to include file attachments in the response. Default: `false`.',
			)
			.optional(),
		fromDate: z
			.string()
			.describe(
				'Start of date range filter in ISO 8601 format (e.g. `"2025-01-01"` or `"2025-01-01T00:00:00Z"`). **Board queries only.** Must be used together with `toDate`.',
			)
			.optional(),
		toDate: z
			.string()
			.describe(
				'End of date range filter in ISO 8601 format. **Board queries only.** Must be used together with `fromDate`.',
			)
			.optional(),
		includeItemUpdates: z
			.boolean()
			.describe(
				'When `objectType` is `"Board"`, set to `true` to include updates on individual items. Default: `false` (board-level discussion only).',
			)
			.optional(),
	})
	.loose();

export type UpdatesListInput = z.infer<typeof UpdatesListInputSchema>;

export const UsersGetContextInputSchema = z.object({}).loose();

export type UsersGetContextInput = z.infer<typeof UsersGetContextInputSchema>;

export const AutomationsListInputSchema = z
	.object({
		boardId: z.string().describe('The numeric board ID as a string.'),
		limit: z
			.number()
			.describe(
				'Maximum number of automations to return (1–100). Default: 100.',
			)
			.optional(),
		cursor: z
			.string()
			.describe(
				'Pagination cursor from a previous response. Pass it to retrieve the next page of automations.',
			)
			.optional(),
	})
	.loose();

export type AutomationsListInput = z.infer<typeof AutomationsListInputSchema>;

export const UsersListAndTeamsInputSchema = z
	.object({
		getMe: z
			.boolean()
			.describe(
				'Returns the current user\'s profile including team memberships. **Top priority** — use whenever the request refers to "me" or "my teams". Conflicts with all other parameters.',
			)
			.optional(),
		userIds: z
			.array(z.unknown())
			.describe(
				'Array of specific user IDs to fetch (max 500). Always use when user IDs are available in context. Returns user profiles including team memberships.',
			)
			.optional(),
		name: z
			.string()
			.describe(
				'Fuzzy name search for **users only**. Standalone — cannot be combined with other parameters. Do not use to search for teams.',
			)
			.optional(),
		teamIds: z
			.array(z.unknown())
			.describe(
				'Array of specific team IDs to fetch (max 500). Always use when team IDs are known. Returns team details with owners and optional member data.',
			)
			.optional(),
		includeTeams: z
			.boolean()
			.describe(
				"Fetches all teams in the account alongside users. **Avoid** — only use as a last resort. To get a specific user's teams, fetch that user by `userIds` instead.",
			)
			.optional(),
		teamsOnly: z
			.boolean()
			.describe(
				'Returns only teams, no users. Combine with `teamIds` for targeted team lookup, or with `includeTeamMembers` for full member details.',
			)
			.optional(),
		includeTeamMembers: z
			.boolean()
			.describe(
				'Set to `true` only when you need full member details for teams beyond names and IDs.',
			)
			.optional(),
	})
	.loose();

export type UsersListAndTeamsInput = z.infer<
	typeof UsersListAndTeamsInputSchema
>;

export const WorkspacesListInputSchema = z
	.object({
		searchTerm: z
			.string()
			.describe(
				'Filters results to workspaces whose name matches the search term. **Only alphanumeric characters are supported.**',
			)
			.optional(),
		limit: z
			.number()
			.describe(
				'Number of workspaces to return per page. Min: `1`, max: `100`, default: `100`. Use a lower value for smaller responses.',
			)
			.optional(),
		page: z
			.number()
			.describe(
				'Page number to return. Default: `1`. Increment to paginate through large workspace lists.',
			)
			.optional(),
	})
	.loose();

export type WorkspacesListInput = z.infer<typeof WorkspacesListInputSchema>;

export const AgentsManageInputSchema = z
	.object({
		action: z
			.enum([
				'create',
				'create_blank',
				'get',
				'update',
				'delete',
				'activate',
				'deactivate',
				'run',
			])
			.describe(
				'One of create, create_blank, get, update, delete, activate, deactivate, run.',
			),
		agent_id: z
			.string()
			.describe(
				'Required for update, delete, activate, deactivate, run. Use with get to fetch a specific agent; omit it with get to list owned agents.',
			)
			.optional(),
		prompt: z
			.string()
			.describe(
				'Required for create. Plain-language description of what the agent should do.',
			)
			.optional(),
		agent_model: z
			.unknown()
			.describe(
				'Used with create or update. Omit unless the user explicitly names a valid monday-supported model.',
			)
			.optional(),
		name: z
			.string()
			.describe('Used with create_blank or update. Display name of the agent.')
			.optional(),
		role: z
			.string()
			.describe(
				'Used with create_blank or update. Short role title (e.g. "Customer Success Bot").',
			)
			.optional(),
		role_description: z
			.string()
			.describe(
				'Used with create_blank or update. Detailed description of the agent role.',
			)
			.optional(),
		avatar_url: z
			.string()
			.describe(
				'Used with create_blank. HTTPS URL of the avatar. Prefer dapulse-res.cloudinary.com or cdn.monday.com.',
			)
			.optional(),
		gender: z
			.enum(['male', 'female'])
			.describe(
				'Used with create_blank. male or female — a hint for the generated avatar/name when profile fields are omitted.',
			)
			.optional(),
		background_color: z
			.string()
			.describe('Used with create_blank. Lowercase hex, e.g. "#9450fd".')
			.optional(),
		user_prompt: z
			.string()
			.describe(
				'Used with create_blank. Stored as metadata; not used for AI generation.',
			)
			.optional(),
		plan: z
			.string()
			.describe(
				'Used with update. New step-by-step execution plan in markdown.',
			)
			.optional(),
	})
	.loose();

export type AgentsManageInput = z.infer<typeof AgentsManageInputSchema>;

export const AgentsManageKnowledgeInputSchema = z
	.object({
		action: z
			.enum(['list', 'add', 'update', 'remove'])
			.describe('One of list, add, update, remove.'),
		agent_id: z.string().describe('Unique identifier of the agent.'),
		resource_id: z
			.string()
			.describe(
				'Required for add, update, remove. The ID of the board or doc to grant/update/revoke access to.',
			)
			.optional(),
		scope_type: z
			.enum(['BOARD', 'DOC'])
			.describe(
				'Required for add, update, remove. The resource type: BOARD or DOC.',
			)
			.optional(),
		permission_type: z
			.enum(['READ', 'READ_WRITE'])
			.describe(
				'Required for add and update. READ (agent can read) or READ_WRITE (agent can read and write).',
			)
			.optional(),
	})
	.loose();

export type AgentsManageKnowledgeInput = z.infer<
	typeof AgentsManageKnowledgeInputSchema
>;

export const AgentsManageSkillsInputSchema = z
	.object({
		action: z
			.enum(['create', 'add', 'remove'])
			.describe('One of create, add, remove.'),
		agent_id: z
			.string()
			.describe(
				'Required for add and remove. Not used for create (an account-level operation).',
			)
			.optional(),
		name: z
			.string()
			.describe('Required for create. Display name of the new skill.')
			.optional(),
		content: z
			.string()
			.describe(
				"Required for create. Markdown instructions defining what the skill does and how to execute it — this is the skill's runtime behavior.",
			)
			.optional(),
		description: z
			.string()
			.describe('Used with create. Short description shown in the catalog.')
			.optional(),
		skill_id: z
			.string()
			.describe(
				'Required for add and remove. The skill ID from agent_catalog action: "list_skills", or the ID returned by action: "create". Never guess a skill ID.',
			)
			.optional(),
	})
	.loose();

export type AgentsManageSkillsInput = z.infer<
	typeof AgentsManageSkillsInputSchema
>;

export const AgentsManageTriggersInputSchema = z
	.object({
		action: z
			.enum(['list', 'add', 'remove'])
			.describe('One of list, add, remove.'),
		agent_id: z.string().describe('Unique identifier of the agent.'),
		block_reference_id: z
			.string()
			.describe(
				'Required for add. The trigger type\'s block_reference_id from agent_catalog action: "list_triggers". Never guess this value.',
			)
			.optional(),
		field_values: z
			.record(z.string(), z.unknown())
			.describe(
				'Used with add when the trigger type has required fields. Key/value object whose shape is described by field_schemas in the catalog. Scalar fields use string/number/boolean; selection fields use {\'{ "value": "", "label": "" }\'}.',
			)
			.optional(),
		node_id: z
			.string()
			.describe(
				'Required for remove. The node_id of the trigger instance — get it from action: "list". Each instance has a unique node_id.',
			)
			.optional(),
	})
	.loose();

export type AgentsManageTriggersInput = z.infer<
	typeof AgentsManageTriggersInputSchema
>;

export const AutomationsManageInputSchema = z
	.object({
		action: z
			.enum(['activate', 'deactivate', 'delete'])
			.describe(
				'The operation to perform: activate (enable a paused automation), deactivate (pause without deleting), or delete (permanently remove — irreversible).',
			),
		workflowId: z
			.string()
			.describe(
				'The automation ID to operate on. Obtain it from list_automations.',
			),
	})
	.loose();

export type AutomationsManageInput = z.infer<
	typeof AutomationsManageInputSchema
>;

export const FoldersMoveObjectInputSchema = z
	.object({
		objectType: z
			.string()
			.describe(
				'The type of object to move. One of: `Board`, `Folder`, `Overview`.',
			),
		id: z.string().describe('The ID of the object to move.'),
		parentFolderId: z
			.string()
			.describe(
				'The ID of the destination folder. Provide this to move the object into a specific folder.',
			)
			.optional(),
		workspaceId: z
			.string()
			.describe(
				'The ID of the destination workspace. Provide this when moving the object to a different workspace.',
			)
			.optional(),
		accountProductId: z
			.string()
			.describe(
				'The ID of the destination account product. Provide this when moving to a different account product context.',
			)
			.optional(),
		position_object_id: z
			.string()
			.describe(
				'The ID of a reference object to position this object relative to. Must be paired with `position_object_type`.',
			)
			.optional(),
		position_object_type: z
			.string()
			.describe(
				'The type of the reference object for positioning. One of: `Board`, `Folder`, `Overview`. Must be paired with `position_object_id`.',
			)
			.optional(),
		position_is_after: z
			.boolean()
			.describe(
				'If `true`, places this object after the reference object. If `false`, places it before.',
			)
			.optional(),
	})
	.loose();

export type FoldersMoveObjectInput = z.infer<
	typeof FoldersMoveObjectInputSchema
>;

export const WorkflowsPlanInputSchema = z
	.object({
		prompt: z
			.string()
			.describe(
				'Natural-language description of the full end-to-end process to plan (e.g. "When a deal is marked Won, create a task in the onboarding board and notify the account manager"). Maximum 2000 characters.',
			),
	})
	.loose();

export type WorkflowsPlanInput = z.infer<typeof WorkflowsPlanInputSchema>;

export const WorkflowsPublishInputSchema = z
	.object({
		workflowObjectId: z
			.string()
			.describe(
				'The workflow object ID returned by create_workflow. Identifies the workflow across all drafts and live versions.',
			),
		workflowDraftId: z
			.string()
			.describe(
				'The draft version ID to publish. Both workflowObjectId and workflowDraftId are required — together they identify the exact draft to publish.',
			),
		shouldActivate: z
			.boolean()
			.describe(
				'Whether to activate the workflow immediately after publishing so it starts running. Defaults to true. Pass false to publish without activating.',
			)
			.optional(),
	})
	.loose();

export type WorkflowsPublishInput = z.infer<typeof WorkflowsPublishInputSchema>;

export const DocsReadInputSchema = z
	.object({
		mode: z
			.string()
			.describe(
				'Operation mode. `content` (default) retrieves documents with markdown content. `version_history` retrieves the edit history of a single document.',
			)
			.optional(),
		type: z
			.string()
			.describe(
				'Query type for content mode. One of `ids` (doc IDs), `object_ids` (object IDs from the URL), or `workspace_ids`. Required when mode is `content`.',
			)
			.optional(),
		ids: z
			.array(z.unknown())
			.describe(
				'Array of ID values matching the selected `type`. In `version_history` mode, provide the single document `object_id` here (e.g., `["18412502542"]`).',
			),
		limit: z
			.number()
			.describe(
				'Number of documents per page (default: 25). Content mode only.',
			)
			.optional(),
		page: z
			.number()
			.describe('Page number to return, starting at 1. Content mode only.')
			.optional(),
		order_by: z
			.string()
			.describe(
				'Sort order for results. One of `created_at` or `used_at`. Content mode only.',
			)
			.optional(),
		include_blocks: z
			.boolean()
			.describe(
				'If `true`, includes block IDs, types, positions, and content in the response. Required before calling `update_doc`. Defaults to `false`. Content mode only.',
			)
			.optional(),
		blocks_limit: z
			.number()
			.describe(
				'Maximum number of blocks to return per document (default: 25). Use with `blocks_page` to paginate long documents. Content mode only.',
			)
			.optional(),
		blocks_page: z
			.number()
			.describe(
				'Page number for block pagination, starting at 1. Content mode only.',
			)
			.optional(),
		include_comments: z
			.boolean()
			.describe(
				'If `true`, fetches all comments and replies on the document. Defaults to `false`. Content mode only.',
			)
			.optional(),
		comments_limit: z
			.number()
			.describe(
				'Maximum number of comments to fetch per document when `include_comments` is `true`. Defaults to 50. Content mode only.',
			)
			.optional(),
		version_history_limit: z
			.number()
			.describe(
				'Maximum number of restoring points to return. Version history mode only.',
			)
			.optional(),
		since: z
			.string()
			.describe(
				'ISO 8601 date string to filter version history from (e.g., `"2026-03-15T00:00:00Z"`). Version history mode only.',
			)
			.optional(),
		until: z
			.string()
			.describe(
				'ISO 8601 date string to filter version history until. Defaults to now. Version history mode only.',
			)
			.optional(),
		include_diff: z
			.boolean()
			.describe(
				'If `true`, fetches content diffs between consecutive restoring points. May be slower. Version history mode only.',
			)
			.optional(),
	})
	.loose()
	// type is documented as required only when mode is content; version
	// history calls omit it.
	.superRefine((value, ctx) => {
		if ((value.mode ?? 'content') !== 'version_history' && !value.type) {
			ctx.addIssue({
				code: 'custom',
				message:
					'type is required when mode is content; omit type or set mode to version_history.',
				path: ['type'],
			});
		}
	});

export type DocsReadInput = z.infer<typeof DocsReadInputSchema>;

export const SearchQueryInputSchema = z
	.object({
		searchType: z
			.string()
			.describe(
				'The type of objects to search. One of `BOARD`, `DOCUMENTS`, or `FOLDERS`.',
			),
		searchTerm: z
			.string()
			.describe(
				'The keyword to search for. Omit or pass an empty string to return all objects of the given type.',
			)
			.optional(),
		limit: z
			.number()
			.describe(
				'Number of results to return per page. Maximum and default is `20`.',
			)
			.optional(),
		page: z
			.number()
			.describe('Page number to return, starting at 1. Defaults to `1`.')
			.optional(),
		workspaceIds: z
			.array(z.unknown())
			.describe(
				'Array of workspace IDs to scope the search. Only pass this when you want to restrict results to specific workspaces.',
			)
			.optional(),
	})
	.loose();

export type SearchQueryInput = z.infer<typeof SearchQueryInputSchema>;

export const DocsUpdateInputSchema = z
	.object({
		doc_id: z
			.string()
			.describe(
				'The document ID returned by `read_docs` (`id` field). Takes priority over `object_id` if both are provided.',
			)
			.optional(),
		object_id: z
			.string()
			.describe(
				'The document object ID visible in the document URL. Resolved to `doc_id` internally.',
			)
			.optional(),
		operations: z
			.array(z.unknown())
			.describe(
				'Ordered list of operations to perform (1–25). Each operation requires an `operation_type` and type-specific fields. See operation types below.',
			),
	})
	.loose()
	// doc_id and object_id are alternatives: the tool resolves either
	// identifier internally (doc_id takes priority when both are present).
	.superRefine((value, ctx) => {
		if (!value.doc_id && !value.object_id) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Provide doc_id or object_id — the update targets the document through either identifier.',
				path: ['doc_id'],
			});
		}
	});

export type DocsUpdateInput = z.infer<typeof DocsUpdateInputSchema>;

export const FoldersUpdateInputSchema = z
	.object({
		folderId: z.string().describe('The ID of the folder to update.'),
		name: z.string().describe('The new name for the folder.').optional(),
		color: z
			.string()
			.describe(
				'The new color for the folder. One of: `AQUAMARINE`, `BRIGHT_BLUE`, `BRIGHT_GREEN`, `CHILI_BLUE`, `DARK_ORANGE`, `DARK_PURPLE`, `DARK_RED`, `DONE_GREEN`, `INDIGO`, `LIPSTICK`, `NULL`, `PURPLE`, `SOFIA_PINK`, `STUCK_RED`, `SUNSET`, `WORKING_ORANGE`.',
			)
			.optional(),
		fontWeight: z
			.string()
			.describe(
				'The new font weight for the folder label. One of: `FONT_WEIGHT_BOLD`, `FONT_WEIGHT_LIGHT`, `FONT_WEIGHT_NORMAL`, `FONT_WEIGHT_VERY_LIGHT`, `NULL`.',
			)
			.optional(),
		customIcon: z
			.string()
			.describe(
				'The new icon for the folder. One of: `FOLDER`, `MOREBELOW`, `MOREBELOWFILLED`, `NULL`, `WORK`.',
			)
			.optional(),
		parentFolderId: z
			.string()
			.describe('The ID of the new parent folder to nest this folder inside.')
			.optional(),
		workspaceId: z
			.string()
			.describe(
				'The ID of the workspace containing the folder. Required when moving the folder to a different workspace.',
			)
			.optional(),
		accountProductId: z
			.string()
			.describe('The account product ID to associate with the folder.')
			.optional(),
		position_object_id: z
			.string()
			.describe(
				'The ID of an object to position this folder relative to. Must be paired with `position_object_type`.',
			)
			.optional(),
		position_object_type: z
			.string()
			.describe(
				'The type of object used as the positioning reference. One of: `Board`, `Folder`, `Overview`. Must be paired with `position_object_id`.',
			)
			.optional(),
		position_is_after: z
			.boolean()
			.describe(
				'If `true`, positions the folder after the reference object. If `false`, positions it before.',
			)
			.optional(),
	})
	.loose();

export type FoldersUpdateInput = z.infer<typeof FoldersUpdateInputSchema>;

export const FormsUpdateInputSchema = z
	.object({
		formToken: z.string().describe('The unique token identifying the form.'),
		action: z
			.string()
			.describe(
				'The operation to perform. See the table below for all supported actions and their required fields.',
			),
		form: z
			.record(z.string(), z.unknown())
			.describe(
				'Form data to update. Required for updateFormHeader, updateAppearance, updateAccessibility, updateFeatures, and updateQuestionOrder. Patch semantics — only include the fields you want to change.',
			)
			.optional(),
		formPassword: z
			.string()
			.describe('Required for the setFormPassword action.')
			.optional(),
		tag: z
			.record(z.string(), z.unknown())
			.describe(
				'Required for createTag, updateTag, and deleteTag. For create: provide name and value. For update: provide id and new value. For delete: provide id only.',
			)
			.optional(),
	})
	.loose();

export type FormsUpdateInput = z.infer<typeof FormsUpdateInputSchema>;

export const ViewsUpdateInputSchema = z
	.object({
		viewId: z.string().describe('The ID of the view to update.'),
		boardId: z.string().describe('The board ID the view belongs to.'),
		type: z
			.unknown()
			.describe('The type of the board view being updated. Defaults to TABLE.')
			.optional(),
		name: z
			.string()
			.describe('New name for the view (omit to leave unchanged).')
			.optional(),
		filter: z
			.record(z.string(), z.unknown())
			.describe(
				'Filter configuration. Contains rules (an array of { column_id, compare_value, operator }) and an optional operator (logical operator between rules, defaults to and).',
			)
			.optional(),
		sort: z
			.array(z.unknown())
			.describe(
				'Sort configuration. Array of { column_id, direction } objects. direction defaults to asc.',
			)
			.optional(),
		settings: z
			.record(z.string(), z.unknown())
			.describe(
				'Type-specific view settings as a JSON object. The shape varies by view type. For TABLE views, prefer update_view_table.',
			)
			.optional(),
	})
	.loose();

export type ViewsUpdateInput = z.infer<typeof ViewsUpdateInputSchema>;

export const ViewsUpdateTableInputSchema = z
	.object({
		viewId: z.string().describe('The ID of the table view to update.'),
		boardId: z.string().describe('The board ID the view belongs to.'),
		name: z
			.string()
			.describe('New name for the view (omit to leave unchanged).')
			.optional(),
		filter: z
			.record(z.string(), z.unknown())
			.describe(
				'Filter configuration. Contains rules (an array of { column_id, compare_value, operator }) and an optional operator (logical operator between rules, defaults to and).',
			)
			.optional(),
		sort: z
			.array(z.unknown())
			.describe(
				'Sort configuration. Array of { column_id, direction } objects. direction defaults to asc.',
			)
			.optional(),
		tags: z
			.array(z.unknown())
			.describe('Tags to apply to the view.')
			.optional(),
		settings: z
			.record(z.string(), z.unknown())
			.describe(
				'Table-specific settings: columns (visibility/order) and group_by. Same shape as create_view_table.',
			)
			.optional(),
	})
	.loose();

export type ViewsUpdateTableInput = z.infer<typeof ViewsUpdateTableInputSchema>;

export const WorkflowsUpdateInputSchema = z
	.object({
		workflowObjectId: z
			.number()
			.describe(
				'The workflow object ID returned by create_workflow. Identifies the workflow across all drafts and published versions; does not change across publishes.',
			),
		workflowDraftId: z
			.number()
			.describe(
				'The draft version ID to update. Always read it from the latest create_workflow/update_workflow response — the agent may return a new draft ID.',
			),
		prompt: z
			.string()
			.describe(
				'Natural-language description of the changes to make (e.g. "Add a trigger that fires when an item is created on the Marketing board"). Maximum 2000 characters.',
			),
	})
	.loose();

export type WorkflowsUpdateInput = z.infer<typeof WorkflowsUpdateInputSchema>;

export const WorkspacesUpdateInputSchema = z
	.object({
		id: z
			.string()
			.describe(
				'The ID of the workspace to update. Use list_workspaces to find workspace IDs.',
			),
		attributeName: z
			.string()
			.describe('The new name for the workspace.')
			.optional(),
		attributeDescription: z
			.string()
			.describe('The new description for the workspace.')
			.optional(),
		attributeKind: z
			.string()
			.describe(
				'The new kind for the workspace. One of: `open`, `closed`, or `template`.',
			)
			.optional(),
		attributeAccountProductId: z
			.number()
			.describe('The target account product ID to move the workspace to.')
			.optional(),
	})
	.loose();

export type WorkspacesUpdateInput = z.infer<typeof WorkspacesUpdateInputSchema>;

export const WorkspacesGetInfoInputSchema = z
	.object({
		workspace_id: z
			.number()
			.describe(
				'The ID of the workspace to retrieve information for. Use list_workspaces to find workspace IDs.',
			),
	})
	.loose();

export type WorkspacesGetInfoInput = z.infer<
	typeof WorkspacesGetInfoInputSchema
>;

export type MondayMcpEndpointInputs = {
	'agents.catalog': AgentsCatalogInput;
	'schema.executeQuery': SchemaExecuteQueryInput;
	'dashboards.allWidgetsSchema': DashboardsAllWidgetsSchemaInput;
	'boards.insights': BoardsInsightsInput;
	'items.changeColumnValues': ItemsChangeColumnValuesInput;
	'automations.create': AutomationsCreateInput;
	'boards.create': BoardsCreateInput;
	'columns.create': ColumnsCreateInput;
	'dashboards.create': DashboardsCreateInput;
	'docs.create': DocsCreateInput;
	'folders.create': FoldersCreateInput;
	'forms.create': FormsCreateInput;
	'forms.createSubmission': FormsCreateSubmissionInput;
	'groups.create': GroupsCreateInput;
	'items.create': ItemsCreateInput;
	'notifications.create': NotificationsCreateInput;
	'updates.create': UpdatesCreateInput;
	'views.create': ViewsCreateInput;
	'views.createTable': ViewsCreateTableInput;
	'dashboards.createWidget': DashboardsCreateWidgetInput;
	'workflows.create': WorkflowsCreateInput;
	'workspaces.create': WorkspacesCreateInput;
	'assets.finalizeUpload': AssetsFinalizeUploadInput;
	'forms.editQuestions': FormsEditQuestionsInput;
	'assets.getUploadUrl': AssetsGetUploadUrlInput;
	'assets.get': AssetsGetInput;
	'boards.getActivity': BoardsGetActivityInput;
	'boards.getInfo': BoardsGetInfoInput;
	'boards.getItemsPage': BoardsGetItemsPageInput;
	'columns.getTypeInfo': ColumnsGetTypeInfoInput;
	'forms.get': FormsGetInput;
	'schema.getGraphqlSchema': SchemaGetGraphqlSchemaInput;
	'sprints.getBoards': SprintsGetBoardsInput;
	'meetings.getNotetaker': MeetingsGetNotetakerInput;
	'sprints.getSummary': SprintsGetSummaryInput;
	'sprints.getMetadata': SprintsGetMetadataInput;
	'schema.getTypeDetails': SchemaGetTypeDetailsInput;
	'updates.list': UpdatesListInput;
	'users.getContext': UsersGetContextInput;
	'automations.list': AutomationsListInput;
	'users.listAndTeams': UsersListAndTeamsInput;
	'workspaces.list': WorkspacesListInput;
	'agents.manage': AgentsManageInput;
	'agents.manageKnowledge': AgentsManageKnowledgeInput;
	'agents.manageSkills': AgentsManageSkillsInput;
	'agents.manageTriggers': AgentsManageTriggersInput;
	'automations.manage': AutomationsManageInput;
	'folders.moveObject': FoldersMoveObjectInput;
	'workflows.plan': WorkflowsPlanInput;
	'workflows.publish': WorkflowsPublishInput;
	'docs.read': DocsReadInput;
	'search.query': SearchQueryInput;
	'docs.update': DocsUpdateInput;
	'folders.update': FoldersUpdateInput;
	'forms.update': FormsUpdateInput;
	'views.update': ViewsUpdateInput;
	'views.updateTable': ViewsUpdateTableInput;
	'workflows.update': WorkflowsUpdateInput;
	'workspaces.update': WorkspacesUpdateInput;
	'workspaces.getInfo': WorkspacesGetInfoInput;
};

export type MondayMcpEndpointOutputs = {
	'agents.catalog': MondayMcpToolResult;
	'schema.executeQuery': MondayMcpToolResult;
	'dashboards.allWidgetsSchema': MondayMcpToolResult;
	'boards.insights': MondayMcpToolResult;
	'items.changeColumnValues': MondayMcpToolResult;
	'automations.create': MondayMcpToolResult;
	'boards.create': MondayMcpToolResult;
	'columns.create': MondayMcpToolResult;
	'dashboards.create': MondayMcpToolResult;
	'docs.create': MondayMcpToolResult;
	'folders.create': MondayMcpToolResult;
	'forms.create': MondayMcpToolResult;
	'forms.createSubmission': MondayMcpToolResult;
	'groups.create': MondayMcpToolResult;
	'items.create': MondayMcpToolResult;
	'notifications.create': MondayMcpToolResult;
	'updates.create': MondayMcpToolResult;
	'views.create': MondayMcpToolResult;
	'views.createTable': MondayMcpToolResult;
	'dashboards.createWidget': MondayMcpToolResult;
	'workflows.create': MondayMcpToolResult;
	'workspaces.create': MondayMcpToolResult;
	'assets.finalizeUpload': MondayMcpToolResult;
	'forms.editQuestions': MondayMcpToolResult;
	'assets.getUploadUrl': MondayMcpToolResult;
	'assets.get': MondayMcpToolResult;
	'boards.getActivity': MondayMcpToolResult;
	'boards.getInfo': MondayMcpToolResult;
	'boards.getItemsPage': MondayMcpToolResult;
	'columns.getTypeInfo': MondayMcpToolResult;
	'forms.get': MondayMcpToolResult;
	'schema.getGraphqlSchema': MondayMcpToolResult;
	'sprints.getBoards': MondayMcpToolResult;
	'meetings.getNotetaker': MondayMcpToolResult;
	'sprints.getSummary': MondayMcpToolResult;
	'sprints.getMetadata': MondayMcpToolResult;
	'schema.getTypeDetails': MondayMcpToolResult;
	'updates.list': MondayMcpToolResult;
	'users.getContext': MondayMcpToolResult;
	'automations.list': MondayMcpToolResult;
	'users.listAndTeams': MondayMcpToolResult;
	'workspaces.list': MondayMcpToolResult;
	'agents.manage': MondayMcpToolResult;
	'agents.manageKnowledge': MondayMcpToolResult;
	'agents.manageSkills': MondayMcpToolResult;
	'agents.manageTriggers': MondayMcpToolResult;
	'automations.manage': MondayMcpToolResult;
	'folders.moveObject': MondayMcpToolResult;
	'workflows.plan': MondayMcpToolResult;
	'workflows.publish': MondayMcpToolResult;
	'docs.read': MondayMcpToolResult;
	'search.query': MondayMcpToolResult;
	'docs.update': MondayMcpToolResult;
	'folders.update': MondayMcpToolResult;
	'forms.update': MondayMcpToolResult;
	'views.update': MondayMcpToolResult;
	'views.updateTable': MondayMcpToolResult;
	'workflows.update': MondayMcpToolResult;
	'workspaces.update': MondayMcpToolResult;
	'workspaces.getInfo': MondayMcpToolResult;
};

export const MondayMcpEndpointInputSchemas = {
	'agents.catalog': AgentsCatalogInputSchema,
	'schema.executeQuery': SchemaExecuteQueryInputSchema,
	'dashboards.allWidgetsSchema': DashboardsAllWidgetsSchemaInputSchema,
	'boards.insights': BoardsInsightsInputSchema,
	'items.changeColumnValues': ItemsChangeColumnValuesInputSchema,
	'automations.create': AutomationsCreateInputSchema,
	'boards.create': BoardsCreateInputSchema,
	'columns.create': ColumnsCreateInputSchema,
	'dashboards.create': DashboardsCreateInputSchema,
	'docs.create': DocsCreateInputSchema,
	'folders.create': FoldersCreateInputSchema,
	'forms.create': FormsCreateInputSchema,
	'forms.createSubmission': FormsCreateSubmissionInputSchema,
	'groups.create': GroupsCreateInputSchema,
	'items.create': ItemsCreateInputSchema,
	'notifications.create': NotificationsCreateInputSchema,
	'updates.create': UpdatesCreateInputSchema,
	'views.create': ViewsCreateInputSchema,
	'views.createTable': ViewsCreateTableInputSchema,
	'dashboards.createWidget': DashboardsCreateWidgetInputSchema,
	'workflows.create': WorkflowsCreateInputSchema,
	'workspaces.create': WorkspacesCreateInputSchema,
	'assets.finalizeUpload': AssetsFinalizeUploadInputSchema,
	'forms.editQuestions': FormsEditQuestionsInputSchema,
	'assets.getUploadUrl': AssetsGetUploadUrlInputSchema,
	'assets.get': AssetsGetInputSchema,
	'boards.getActivity': BoardsGetActivityInputSchema,
	'boards.getInfo': BoardsGetInfoInputSchema,
	'boards.getItemsPage': BoardsGetItemsPageInputSchema,
	'columns.getTypeInfo': ColumnsGetTypeInfoInputSchema,
	'forms.get': FormsGetInputSchema,
	'schema.getGraphqlSchema': SchemaGetGraphqlSchemaInputSchema,
	'sprints.getBoards': SprintsGetBoardsInputSchema,
	'meetings.getNotetaker': MeetingsGetNotetakerInputSchema,
	'sprints.getSummary': SprintsGetSummaryInputSchema,
	'sprints.getMetadata': SprintsGetMetadataInputSchema,
	'schema.getTypeDetails': SchemaGetTypeDetailsInputSchema,
	'updates.list': UpdatesListInputSchema,
	'users.getContext': UsersGetContextInputSchema,
	'automations.list': AutomationsListInputSchema,
	'users.listAndTeams': UsersListAndTeamsInputSchema,
	'workspaces.list': WorkspacesListInputSchema,
	'agents.manage': AgentsManageInputSchema,
	'agents.manageKnowledge': AgentsManageKnowledgeInputSchema,
	'agents.manageSkills': AgentsManageSkillsInputSchema,
	'agents.manageTriggers': AgentsManageTriggersInputSchema,
	'automations.manage': AutomationsManageInputSchema,
	'folders.moveObject': FoldersMoveObjectInputSchema,
	'workflows.plan': WorkflowsPlanInputSchema,
	'workflows.publish': WorkflowsPublishInputSchema,
	'docs.read': DocsReadInputSchema,
	'search.query': SearchQueryInputSchema,
	'docs.update': DocsUpdateInputSchema,
	'folders.update': FoldersUpdateInputSchema,
	'forms.update': FormsUpdateInputSchema,
	'views.update': ViewsUpdateInputSchema,
	'views.updateTable': ViewsUpdateTableInputSchema,
	'workflows.update': WorkflowsUpdateInputSchema,
	'workspaces.update': WorkspacesUpdateInputSchema,
	'workspaces.getInfo': WorkspacesGetInfoInputSchema,
} as const;

export const MondayMcpEndpointOutputSchemas = {
	'agents.catalog': MondayMcpToolResultSchema,
	'schema.executeQuery': MondayMcpToolResultSchema,
	'dashboards.allWidgetsSchema': MondayMcpToolResultSchema,
	'boards.insights': MondayMcpToolResultSchema,
	'items.changeColumnValues': MondayMcpToolResultSchema,
	'automations.create': MondayMcpToolResultSchema,
	'boards.create': MondayMcpToolResultSchema,
	'columns.create': MondayMcpToolResultSchema,
	'dashboards.create': MondayMcpToolResultSchema,
	'docs.create': MondayMcpToolResultSchema,
	'folders.create': MondayMcpToolResultSchema,
	'forms.create': MondayMcpToolResultSchema,
	'forms.createSubmission': MondayMcpToolResultSchema,
	'groups.create': MondayMcpToolResultSchema,
	'items.create': MondayMcpToolResultSchema,
	'notifications.create': MondayMcpToolResultSchema,
	'updates.create': MondayMcpToolResultSchema,
	'views.create': MondayMcpToolResultSchema,
	'views.createTable': MondayMcpToolResultSchema,
	'dashboards.createWidget': MondayMcpToolResultSchema,
	'workflows.create': MondayMcpToolResultSchema,
	'workspaces.create': MondayMcpToolResultSchema,
	'assets.finalizeUpload': MondayMcpToolResultSchema,
	'forms.editQuestions': MondayMcpToolResultSchema,
	'assets.getUploadUrl': MondayMcpToolResultSchema,
	'assets.get': MondayMcpToolResultSchema,
	'boards.getActivity': MondayMcpToolResultSchema,
	'boards.getInfo': MondayMcpToolResultSchema,
	'boards.getItemsPage': MondayMcpToolResultSchema,
	'columns.getTypeInfo': MondayMcpToolResultSchema,
	'forms.get': MondayMcpToolResultSchema,
	'schema.getGraphqlSchema': MondayMcpToolResultSchema,
	'sprints.getBoards': MondayMcpToolResultSchema,
	'meetings.getNotetaker': MondayMcpToolResultSchema,
	'sprints.getSummary': MondayMcpToolResultSchema,
	'sprints.getMetadata': MondayMcpToolResultSchema,
	'schema.getTypeDetails': MondayMcpToolResultSchema,
	'updates.list': MondayMcpToolResultSchema,
	'users.getContext': MondayMcpToolResultSchema,
	'automations.list': MondayMcpToolResultSchema,
	'users.listAndTeams': MondayMcpToolResultSchema,
	'workspaces.list': MondayMcpToolResultSchema,
	'agents.manage': MondayMcpToolResultSchema,
	'agents.manageKnowledge': MondayMcpToolResultSchema,
	'agents.manageSkills': MondayMcpToolResultSchema,
	'agents.manageTriggers': MondayMcpToolResultSchema,
	'automations.manage': MondayMcpToolResultSchema,
	'folders.moveObject': MondayMcpToolResultSchema,
	'workflows.plan': MondayMcpToolResultSchema,
	'workflows.publish': MondayMcpToolResultSchema,
	'docs.read': MondayMcpToolResultSchema,
	'search.query': MondayMcpToolResultSchema,
	'docs.update': MondayMcpToolResultSchema,
	'folders.update': MondayMcpToolResultSchema,
	'forms.update': MondayMcpToolResultSchema,
	'views.update': MondayMcpToolResultSchema,
	'views.updateTable': MondayMcpToolResultSchema,
	'workflows.update': MondayMcpToolResultSchema,
	'workspaces.update': MondayMcpToolResultSchema,
	'workspaces.getInfo': MondayMcpToolResultSchema,
} as const;
