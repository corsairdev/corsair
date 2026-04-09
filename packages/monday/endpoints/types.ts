import { z } from 'zod';

// ── Shared Sub-Schemas ────────────────────────────────────────────────────────

const MondayGroupSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		color: z.string().optional(),
		position: z.string().optional(),
		archived: z.boolean().optional(),
	})
	.passthrough();

const MondayColumnSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		type: z.string().optional(),
		settings_str: z.string().optional(),
		description: z.string().nullable().optional(),
	})
	.passthrough();

const MondayColumnValueSchema = z
	.object({
		id: z.string(),
		title: z.string().optional(),
		text: z.string().nullable().optional(),
		value: z.string().nullable().optional(),
		type: z.string().optional(),
	})
	.passthrough();

const MondayBoardSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable().optional(),
		board_kind: z.string().optional(),
		state: z.string().optional(),
		workspace_id: z.union([z.string(), z.number()]).nullable().optional(),
	})
	.passthrough();

const MondayBoardDetailSchema = MondayBoardSchema.extend({
	groups: z.array(MondayGroupSchema).optional(),
	columns: z.array(MondayColumnSchema).optional(),
}).passthrough();

const MondayItemSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		state: z.string().optional(),
		created_at: z.string().nullable().optional(),
		creator_id: z.string().nullable().optional(),
		board: z.object({ id: z.string() }).optional(),
		group: z
			.object({ id: z.string(), title: z.string().optional() })
			.optional(),
		column_values: z.array(MondayColumnValueSchema).optional(),
	})
	.passthrough();

const MondayItemsPageSchema = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z.array(MondayItemSchema),
	})
	.passthrough();

const MondayUpdateSchema = z
	.object({
		id: z.string(),
		body: z.string().optional(),
		text_body: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		creator: z
			.object({
				id: z.string(),
				name: z.string().optional(),
			})
			.optional(),
		replies: z
			.array(z.object({ id: z.string(), body: z.string().optional() }))
			.optional(),
	})
	.passthrough();

const MondayUserSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		email: z.string().optional(),
		photo_thumb: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		is_admin: z.boolean().optional(),
		is_guest: z.boolean().optional(),
	})
	.passthrough();

const MondayWorkspaceSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		kind: z.string().optional(),
		description: z.string().nullable().optional(),
	})
	.passthrough();

// ── Input Schemas ────────────────────────────────────────────────────────────

const BoardsListInputSchema = z.object({
	limit: z.number().optional(),
	page: z.number().optional(),
	workspace_ids: z.array(z.number()).optional(),
	board_kind: z.enum(['public', 'private', 'share']).optional(),
	state: z.enum(['active', 'archived', 'deleted', 'all']).optional(),
	order_by: z.enum(['created_at', 'used_at']).optional(),
});

const BoardsGetInputSchema = z.object({
	board_id: z.string(),
});

const BoardsCreateInputSchema = z.object({
	board_name: z.string(),
	board_kind: z.enum(['public', 'private', 'share']).optional(),
	workspace_id: z.number().optional(),
	template_id: z.number().optional(),
});

const BoardsUpdateInputSchema = z.object({
	board_id: z.string(),
	board_attribute: z.enum(['name', 'description', 'communication']),
	new_value: z.string(),
});

const BoardsArchiveInputSchema = z.object({
	board_id: z.string(),
});

const BoardsDeleteInputSchema = z.object({
	board_id: z.string(),
});

const BoardsDuplicateInputSchema = z.object({
	board_id: z.string(),
	duplicate_type: z
		.enum([
			'duplicate_board_with_structure',
			'duplicate_board_with_pulses',
			'duplicate_board_with_pulses_and_updates',
		])
		.optional(),
	board_name: z.string().optional(),
	workspace_id: z.number().optional(),
});

const ItemsListInputSchema = z.object({
	board_id: z.string(),
	limit: z.number().optional(),
	cursor: z.string().optional(),
});

const ItemsGetInputSchema = z.object({
	item_id: z.string(),
});

const ItemsCreateInputSchema = z.object({
	board_id: z.string(),
	item_name: z.string(),
	group_id: z.string().optional(),
	column_values: z.string().optional(),
});

const ItemsUpdateInputSchema = z.object({
	board_id: z.string(),
	item_id: z.string(),
	column_id: z.string(),
	value: z.string(),
});

const ItemsMoveInputSchema = z.object({
	item_id: z.string(),
	group_id: z.string(),
});

const ItemsArchiveInputSchema = z.object({
	item_id: z.string(),
});

const ItemsDeleteInputSchema = z.object({
	item_id: z.string(),
});

const GroupsListInputSchema = z.object({
	board_id: z.string(),
});

const GroupsCreateInputSchema = z.object({
	board_id: z.string(),
	group_name: z.string(),
	position: z.string().optional(),
});

const GroupsUpdateInputSchema = z.object({
	board_id: z.string(),
	group_id: z.string(),
	group_attribute: z.enum([
		'title',
		'color',
		'position',
		'relative_position_before',
		'relative_position_after',
	]),
	new_value: z.string(),
});

const GroupsDeleteInputSchema = z.object({
	board_id: z.string(),
	group_id: z.string(),
});

const ColumnsListInputSchema = z.object({
	board_id: z.string(),
});

const ColumnsCreateInputSchema = z.object({
	board_id: z.string(),
	title: z.string(),
	column_type: z.string().optional(),
	description: z.string().optional(),
});

const ColumnsChangeValueInputSchema = z.object({
	board_id: z.string(),
	item_id: z.string(),
	column_id: z.string(),
	value: z.string(),
});

const UpdatesListInputSchema = z.object({
	item_id: z.string(),
	limit: z.number().optional(),
	page: z.number().optional(),
});

const UpdatesCreateInputSchema = z.object({
	item_id: z.string(),
	body: z.string(),
});

const UpdatesDeleteInputSchema = z.object({
	update_id: z.string(),
});

const UsersListInputSchema = z.object({
	limit: z.number().optional(),
	page: z.number().optional(),
	kind: z.enum(['all', 'non_guests', 'guests', 'non_pending']).optional(),
});

const UsersGetInputSchema = z.object({
	user_id: z.string(),
});

const WorkspacesListInputSchema = z.object({
	limit: z.number().optional(),
	page: z.number().optional(),
	kind: z.enum(['open', 'closed']).optional(),
	state: z.enum(['active', 'deleted', 'all']).optional(),
});

const WebhooksListInputSchema = z.object({
	board_id: z.string(),
});

const WebhooksCreateInputSchema = z.object({
	board_id: z.string(),
	url: z.string(),
	event: z.enum([
		'change_column_value',
		'change_specific_column_value',
		'change_status_column_value',
		'create_item',
		'create_update',
		'delete_update',
		'item_archived',
		'item_deleted',
		'item_moved_to_board',
		'item_restored',
		'when_date_arrived',
	]),
	config: z.string().optional(),
});

const WebhooksDeleteInputSchema = z.object({
	webhook_id: z.string(),
});

// ── Output Schemas ───────────────────────────────────────────────────────────

const BoardsListResponseSchema = z
	.object({ boards: z.array(MondayBoardSchema) })
	.passthrough();

const BoardsGetResponseSchema = z
	.object({ boards: z.array(MondayBoardDetailSchema) })
	.passthrough();

const BoardsCreateResponseSchema = z
	.object({
		create_board: z
			.object({ id: z.string(), name: z.string().optional() })
			.passthrough(),
	})
	.passthrough();

const BoardsUpdateResponseSchema = z
	.object({
		update_board: z.object({ id: z.string() }).passthrough(),
	})
	.passthrough();

const BoardsArchiveResponseSchema = z
	.object({
		archive_board: z.object({ id: z.string() }).passthrough(),
	})
	.passthrough();

const BoardsDeleteResponseSchema = z
	.object({
		delete_board: z.object({ id: z.string() }).passthrough(),
	})
	.passthrough();

const BoardsDuplicateResponseSchema = z
	.object({
		duplicate_board: z
			.object({ board: z.object({ id: z.string() }).passthrough() })
			.passthrough(),
	})
	.passthrough();

const ItemsListResponseSchema = z
	.object({
		boards: z.array(
			z.object({ items_page: MondayItemsPageSchema }).passthrough(),
		),
	})
	.passthrough();

const ItemsGetResponseSchema = z
	.object({ items: z.array(MondayItemSchema) })
	.passthrough();

const ItemsCreateResponseSchema = z
	.object({
		create_item: z
			.object({ id: z.string(), name: z.string().optional() })
			.passthrough(),
	})
	.passthrough();

const ItemsUpdateResponseSchema = z
	.object({
		change_column_value: z.object({ id: z.string() }).passthrough(),
	})
	.passthrough();

const ItemsMoveResponseSchema = z
	.object({
		move_item_to_group: z.object({ id: z.string() }).passthrough(),
	})
	.passthrough();

const ItemsArchiveResponseSchema = z
	.object({
		archive_item: z.object({ id: z.string() }).passthrough(),
	})
	.passthrough();

const ItemsDeleteResponseSchema = z
	.object({
		delete_item: z.object({ id: z.string() }).passthrough(),
	})
	.passthrough();

const GroupsListResponseSchema = z
	.object({
		boards: z.array(
			z.object({ groups: z.array(MondayGroupSchema) }).passthrough(),
		),
	})
	.passthrough();

const GroupsCreateResponseSchema = z
	.object({
		create_group: z
			.object({ id: z.string(), title: z.string().optional() })
			.passthrough(),
	})
	.passthrough();

const GroupsUpdateResponseSchema = z
	.object({
		update_group: z.object({ id: z.string() }).passthrough(),
	})
	.passthrough();

const GroupsDeleteResponseSchema = z
	.object({
		delete_group: z.object({ id: z.string() }).passthrough(),
	})
	.passthrough();

const ColumnsListResponseSchema = z
	.object({
		boards: z.array(
			z.object({ columns: z.array(MondayColumnSchema) }).passthrough(),
		),
	})
	.passthrough();

const ColumnsCreateResponseSchema = z
	.object({
		create_column: z
			.object({ id: z.string(), title: z.string().optional() })
			.passthrough(),
	})
	.passthrough();

const ColumnsChangeValueResponseSchema = z
	.object({
		change_column_value: z.object({ id: z.string() }).passthrough(),
	})
	.passthrough();

const UpdatesListResponseSchema = z
	.object({
		items: z.array(
			z.object({ updates: z.array(MondayUpdateSchema) }).passthrough(),
		),
	})
	.passthrough();

const UpdatesCreateResponseSchema = z
	.object({
		create_update: z
			.object({ id: z.string(), body: z.string().optional() })
			.passthrough(),
	})
	.passthrough();

const UpdatesDeleteResponseSchema = z
	.object({
		delete_update: z.object({ id: z.string() }).passthrough(),
	})
	.passthrough();

const UsersListResponseSchema = z
	.object({ users: z.array(MondayUserSchema) })
	.passthrough();

const UsersGetResponseSchema = z
	.object({ users: z.array(MondayUserSchema) })
	.passthrough();

const WorkspacesListResponseSchema = z
	.object({ workspaces: z.array(MondayWorkspaceSchema) })
	.passthrough();

const MondayWebhookObjectSchema = z
	.object({
		id: z.string(),
		board_id: z.string().optional(),
		event: z.string().optional(),
	})
	.passthrough();

const WebhooksListResponseSchema = z
	.object({ webhooks: z.array(MondayWebhookObjectSchema) })
	.passthrough();

const WebhooksCreateResponseSchema = z
	.object({
		create_webhook: MondayWebhookObjectSchema,
	})
	.passthrough();

const WebhooksDeleteResponseSchema = z
	.object({
		delete_webhook: z
			.object({ id: z.string(), board_id: z.string().optional() })
			.passthrough(),
	})
	.passthrough();

// ── Endpoint I/O Maps ────────────────────────────────────────────────────────

export type BoardsListInput = z.infer<typeof BoardsListInputSchema>;
export type BoardsGetInput = z.infer<typeof BoardsGetInputSchema>;
export type BoardsCreateInput = z.infer<typeof BoardsCreateInputSchema>;
export type BoardsUpdateInput = z.infer<typeof BoardsUpdateInputSchema>;
export type BoardsArchiveInput = z.infer<typeof BoardsArchiveInputSchema>;
export type BoardsDeleteInput = z.infer<typeof BoardsDeleteInputSchema>;
export type BoardsDuplicateInput = z.infer<typeof BoardsDuplicateInputSchema>;
export type ItemsListInput = z.infer<typeof ItemsListInputSchema>;
export type ItemsGetInput = z.infer<typeof ItemsGetInputSchema>;
export type ItemsCreateInput = z.infer<typeof ItemsCreateInputSchema>;
export type ItemsUpdateInput = z.infer<typeof ItemsUpdateInputSchema>;
export type ItemsMoveInput = z.infer<typeof ItemsMoveInputSchema>;
export type ItemsArchiveInput = z.infer<typeof ItemsArchiveInputSchema>;
export type ItemsDeleteInput = z.infer<typeof ItemsDeleteInputSchema>;
export type GroupsListInput = z.infer<typeof GroupsListInputSchema>;
export type GroupsCreateInput = z.infer<typeof GroupsCreateInputSchema>;
export type GroupsUpdateInput = z.infer<typeof GroupsUpdateInputSchema>;
export type GroupsDeleteInput = z.infer<typeof GroupsDeleteInputSchema>;
export type ColumnsListInput = z.infer<typeof ColumnsListInputSchema>;
export type ColumnsCreateInput = z.infer<typeof ColumnsCreateInputSchema>;
export type ColumnsChangeValueInput = z.infer<
	typeof ColumnsChangeValueInputSchema
>;
export type UpdatesListInput = z.infer<typeof UpdatesListInputSchema>;
export type UpdatesCreateInput = z.infer<typeof UpdatesCreateInputSchema>;
export type UpdatesDeleteInput = z.infer<typeof UpdatesDeleteInputSchema>;
export type UsersListInput = z.infer<typeof UsersListInputSchema>;
export type UsersGetInput = z.infer<typeof UsersGetInputSchema>;
export type WorkspacesListInput = z.infer<typeof WorkspacesListInputSchema>;
export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;
export type WebhooksCreateInput = z.infer<typeof WebhooksCreateInputSchema>;
export type WebhooksDeleteInput = z.infer<typeof WebhooksDeleteInputSchema>;

export type MondayEndpointInputs = {
	boardsList: BoardsListInput;
	boardsGet: BoardsGetInput;
	boardsCreate: BoardsCreateInput;
	boardsUpdate: BoardsUpdateInput;
	boardsArchive: BoardsArchiveInput;
	boardsDelete: BoardsDeleteInput;
	boardsDuplicate: BoardsDuplicateInput;
	itemsList: ItemsListInput;
	itemsGet: ItemsGetInput;
	itemsCreate: ItemsCreateInput;
	itemsUpdate: ItemsUpdateInput;
	itemsMove: ItemsMoveInput;
	itemsArchive: ItemsArchiveInput;
	itemsDelete: ItemsDeleteInput;
	groupsList: GroupsListInput;
	groupsCreate: GroupsCreateInput;
	groupsUpdate: GroupsUpdateInput;
	groupsDelete: GroupsDeleteInput;
	columnsList: ColumnsListInput;
	columnsCreate: ColumnsCreateInput;
	columnsChangeValue: ColumnsChangeValueInput;
	updatesList: UpdatesListInput;
	updatesCreate: UpdatesCreateInput;
	updatesDelete: UpdatesDeleteInput;
	usersList: UsersListInput;
	usersGet: UsersGetInput;
	workspacesList: WorkspacesListInput;
	webhooksList: WebhooksListInput;
	webhooksCreate: WebhooksCreateInput;
	webhooksDelete: WebhooksDeleteInput;
};

export type MondayEndpointOutputs = {
	boardsList: z.infer<typeof BoardsListResponseSchema>;
	boardsGet: z.infer<typeof BoardsGetResponseSchema>;
	boardsCreate: z.infer<typeof BoardsCreateResponseSchema>;
	boardsUpdate: z.infer<typeof BoardsUpdateResponseSchema>;
	boardsArchive: z.infer<typeof BoardsArchiveResponseSchema>;
	boardsDelete: z.infer<typeof BoardsDeleteResponseSchema>;
	boardsDuplicate: z.infer<typeof BoardsDuplicateResponseSchema>;
	itemsList: z.infer<typeof ItemsListResponseSchema>;
	itemsGet: z.infer<typeof ItemsGetResponseSchema>;
	itemsCreate: z.infer<typeof ItemsCreateResponseSchema>;
	itemsUpdate: z.infer<typeof ItemsUpdateResponseSchema>;
	itemsMove: z.infer<typeof ItemsMoveResponseSchema>;
	itemsArchive: z.infer<typeof ItemsArchiveResponseSchema>;
	itemsDelete: z.infer<typeof ItemsDeleteResponseSchema>;
	groupsList: z.infer<typeof GroupsListResponseSchema>;
	groupsCreate: z.infer<typeof GroupsCreateResponseSchema>;
	groupsUpdate: z.infer<typeof GroupsUpdateResponseSchema>;
	groupsDelete: z.infer<typeof GroupsDeleteResponseSchema>;
	columnsList: z.infer<typeof ColumnsListResponseSchema>;
	columnsCreate: z.infer<typeof ColumnsCreateResponseSchema>;
	columnsChangeValue: z.infer<typeof ColumnsChangeValueResponseSchema>;
	updatesList: z.infer<typeof UpdatesListResponseSchema>;
	updatesCreate: z.infer<typeof UpdatesCreateResponseSchema>;
	updatesDelete: z.infer<typeof UpdatesDeleteResponseSchema>;
	usersList: z.infer<typeof UsersListResponseSchema>;
	usersGet: z.infer<typeof UsersGetResponseSchema>;
	workspacesList: z.infer<typeof WorkspacesListResponseSchema>;
	webhooksList: z.infer<typeof WebhooksListResponseSchema>;
	webhooksCreate: z.infer<typeof WebhooksCreateResponseSchema>;
	webhooksDelete: z.infer<typeof WebhooksDeleteResponseSchema>;
};

export const MondayEndpointInputSchemas = {
	boardsList: BoardsListInputSchema,
	boardsGet: BoardsGetInputSchema,
	boardsCreate: BoardsCreateInputSchema,
	boardsUpdate: BoardsUpdateInputSchema,
	boardsArchive: BoardsArchiveInputSchema,
	boardsDelete: BoardsDeleteInputSchema,
	boardsDuplicate: BoardsDuplicateInputSchema,
	itemsList: ItemsListInputSchema,
	itemsGet: ItemsGetInputSchema,
	itemsCreate: ItemsCreateInputSchema,
	itemsUpdate: ItemsUpdateInputSchema,
	itemsMove: ItemsMoveInputSchema,
	itemsArchive: ItemsArchiveInputSchema,
	itemsDelete: ItemsDeleteInputSchema,
	groupsList: GroupsListInputSchema,
	groupsCreate: GroupsCreateInputSchema,
	groupsUpdate: GroupsUpdateInputSchema,
	groupsDelete: GroupsDeleteInputSchema,
	columnsList: ColumnsListInputSchema,
	columnsCreate: ColumnsCreateInputSchema,
	columnsChangeValue: ColumnsChangeValueInputSchema,
	updatesList: UpdatesListInputSchema,
	updatesCreate: UpdatesCreateInputSchema,
	updatesDelete: UpdatesDeleteInputSchema,
	usersList: UsersListInputSchema,
	usersGet: UsersGetInputSchema,
	workspacesList: WorkspacesListInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
} as const;

export const MondayEndpointOutputSchemas = {
	boardsList: BoardsListResponseSchema,
	boardsGet: BoardsGetResponseSchema,
	boardsCreate: BoardsCreateResponseSchema,
	boardsUpdate: BoardsUpdateResponseSchema,
	boardsArchive: BoardsArchiveResponseSchema,
	boardsDelete: BoardsDeleteResponseSchema,
	boardsDuplicate: BoardsDuplicateResponseSchema,
	itemsList: ItemsListResponseSchema,
	itemsGet: ItemsGetResponseSchema,
	itemsCreate: ItemsCreateResponseSchema,
	itemsUpdate: ItemsUpdateResponseSchema,
	itemsMove: ItemsMoveResponseSchema,
	itemsArchive: ItemsArchiveResponseSchema,
	itemsDelete: ItemsDeleteResponseSchema,
	groupsList: GroupsListResponseSchema,
	groupsCreate: GroupsCreateResponseSchema,
	groupsUpdate: GroupsUpdateResponseSchema,
	groupsDelete: GroupsDeleteResponseSchema,
	columnsList: ColumnsListResponseSchema,
	columnsCreate: ColumnsCreateResponseSchema,
	columnsChangeValue: ColumnsChangeValueResponseSchema,
	updatesList: UpdatesListResponseSchema,
	updatesCreate: UpdatesCreateResponseSchema,
	updatesDelete: UpdatesDeleteResponseSchema,
	usersList: UsersListResponseSchema,
	usersGet: UsersGetResponseSchema,
	workspacesList: WorkspacesListResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksCreate: WebhooksCreateResponseSchema,
	webhooksDelete: WebhooksDeleteResponseSchema,
} as const;
