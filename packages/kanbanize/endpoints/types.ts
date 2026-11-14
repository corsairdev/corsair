import { z } from 'zod';

// Inputs use Businessmap's own parameter names and its `0`/`1` integers for
// booleans, because those are what the API validates. Outputs are `.loose()`
// with their documented fields nullish, so a field Businessmap adds or omits
// cannot fail a call that has already happened.
// Reference: https://demo.kanbanize.com/openapi/json

const BoardIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The board ID, as returned by `boards.list`.');

const CardIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The card ID, as returned by `cards.list`.');

/** Businessmap's own boolean: `1` for on, `0` for off. */
const FlagSchema = z
	.union([z.literal(0), z.literal(1)])
	.describe('`1` for on, `0` for off.');

const IdListSchema = z.array(z.number().int().positive()).min(1);

/** Ids travel as one comma-separated query value, `explode: false`. */
function joinIds(ids: readonly number[] | undefined): string | undefined {
	return ids && ids.length > 0 ? ids.join(',') : undefined;
}

const PaginationSchema = z
	.object({
		all_pages: z.number().nullish(),
		current_page: z.number().nullish(),
		results_per_page: z.number().nullish(),
	})
	.loose();

export type KanbanizePagination = z.infer<typeof PaginationSchema>;

// ── boards ────────────────────────────────────────────────────────────────

const BoardsListInputSchema = z.object({
	board_ids: IdListSchema.optional().describe('Only these boards.'),
	workspace_ids: IdListSchema.optional().describe(
		'Only boards in these workspaces.',
	),
	is_archived: FlagSchema.optional().describe(
		'`0` for live boards, `1` for archived ones.',
	),
	if_assigned: FlagSchema.optional().describe(
		'`1` for only the boards the key’s user is assigned to.',
	),
	fields: z
		.array(
			z.enum([
				'board_id',
				'workspace_id',
				'is_archived',
				'name',
				'description',
				'type',
				'revision',
			]),
		)
		.min(1)
		.optional()
		.describe('Return only these fields. The record’s ID is always included.'),
	expand: z
		.array(
			z.enum([
				'workflows',
				'settings',
				'structure',
				'effective_cycle_time_column_ids',
				'data_fields',
			]),
		)
		.min(1)
		.optional()
		.describe('Include these nested objects.'),
});

export type BoardsListInput = z.input<typeof BoardsListInputSchema>;

export const KanbanizeBoardSchema = z
	.object({
		board_id: z.number(),
		workspace_id: z.number().nullish(),
		is_archived: FlagSchema.nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		type: z.number().nullish(),
		revision: z.number().nullish(),
	})
	.loose();

export type KanbanizeBoard = z.infer<typeof KanbanizeBoardSchema>;

const BoardsListResponseSchema = z
	.object({ data: z.array(KanbanizeBoardSchema) })
	.loose();

export type BoardsListResponse = z.infer<typeof BoardsListResponseSchema>;

const BoardGetInputSchema = z.object({ board_id: BoardIdSchema });

export type BoardGetInput = z.input<typeof BoardGetInputSchema>;

const BoardResponseSchema = z.object({ data: KanbanizeBoardSchema }).loose();

export type BoardResponse = z.infer<typeof BoardResponseSchema>;

const BoardCreateInputSchema = z.object({
	workspace_id: z
		.number()
		.int()
		.positive()
		.describe('The workspace to create the board in.'),
	name: z.string().min(1).max(100),
	description: z.string().optional(),
	type: z
		.union([z.literal(1), z.literal(2)])
		.optional()
		.describe('`1` for a Kanban board, `2` for an AI Canvas. Defaults to `1`.'),
});

export type BoardCreateInput = z.input<typeof BoardCreateInputSchema>;

const BoardUpdateInputSchema = z
	.object({
		board_id: BoardIdSchema,
		name: z.string().min(1).max(100).optional(),
		description: z.string().optional(),
		is_archived: FlagSchema.optional(),
	})
	.superRefine((value, ctx) => {
		const { board_id: _boardId, ...changes } = value;
		if (Object.values(changes).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['board_id'],
				message: 'Send `name`, `description` or `is_archived`.',
			});
		}
	});

export type BoardUpdateInput = z.input<typeof BoardUpdateInputSchema>;

const BoardRemoveInputSchema = z.object({ board_id: BoardIdSchema });

export type BoardRemoveInput = z.input<typeof BoardRemoveInputSchema>;

/** Every delete on the API answers 204 with no body. */
const DeletedResponseSchema = z.object({
	success: z.literal(true).describe('The resource is gone.'),
});

export type DeletedResponse = z.infer<typeof DeletedResponseSchema>;

// ── workflows ─────────────────────────────────────────────────────────────

const WorkflowIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The workflow ID, from `workflows.list`.');

export const KanbanizeWorkflowSchema = z
	.object({
		workflow_id: z.number(),
		name: z.string().nullish(),
		type: z.number().nullish(),
		position: z.number().nullish(),
		is_enabled: FlagSchema.nullish(),
		is_collapsible: FlagSchema.nullish(),
	})
	.loose();

export type KanbanizeWorkflow = z.infer<typeof KanbanizeWorkflowSchema>;

const WorkflowsListInputSchema = z.object({ board_id: BoardIdSchema });

export type WorkflowsListInput = z.input<typeof WorkflowsListInputSchema>;

const WorkflowsListResponseSchema = z
	.object({ data: z.array(KanbanizeWorkflowSchema) })
	.loose();

export type WorkflowsListResponse = z.infer<typeof WorkflowsListResponseSchema>;

const WorkflowGetInputSchema = z.object({
	board_id: BoardIdSchema,
	workflow_id: WorkflowIdSchema,
});

export type WorkflowGetInput = z.input<typeof WorkflowGetInputSchema>;

const WorkflowResponseSchema = z
	.object({ data: KanbanizeWorkflowSchema })
	.loose();

export type WorkflowResponse = z.infer<typeof WorkflowResponseSchema>;

const WorkflowCreateInputSchema = z.object({
	board_id: BoardIdSchema,
	type: z
		.union([z.literal(0), z.literal(1), z.literal(2)])
		.describe(
			'`0` for a cards workflow, `1` for an initiative workflow, `2` for a timeline workflow.',
		),
	name: z.string().min(1).max(100).optional(),
	position: z.number().int().min(0).optional().describe('`0` is the topmost.'),
	is_enabled: FlagSchema.optional(),
	is_collapsible: FlagSchema.optional(),
});

export type WorkflowCreateInput = z.input<typeof WorkflowCreateInputSchema>;

const WorkflowUpdateInputSchema = z
	.object({
		board_id: BoardIdSchema,
		workflow_id: WorkflowIdSchema,
		name: z.string().min(1).max(100).optional(),
		position: z.number().int().min(0).optional(),
		is_enabled: FlagSchema.optional(),
		is_collapsible: FlagSchema.optional(),
	})
	.superRefine((value, ctx) => {
		const { board_id: _boardId, workflow_id: _workflowId, ...changes } = value;
		if (Object.values(changes).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['workflow_id'],
				message: 'Send `name`, `position`, `is_enabled` or `is_collapsible`.',
			});
		}
	});

export type WorkflowUpdateInput = z.input<typeof WorkflowUpdateInputSchema>;

const WorkflowRemoveInputSchema = z.object({
	board_id: BoardIdSchema,
	workflow_id: WorkflowIdSchema,
});

export type WorkflowRemoveInput = z.input<typeof WorkflowRemoveInputSchema>;

// ── columns ───────────────────────────────────────────────────────────────

const ColumnIdSchema = z.number().int().positive().describe('The column ID.');

export const KanbanizeColumnSchema = z
	.object({
		column_id: z.number(),
		workflow_id: z.number().nullish(),
		section: z.number().nullish(),
		parent_column_id: z.number().nullish(),
		position: z.number().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		color: z.string().nullish(),
		limit: z.number().nullish(),
	})
	.loose();

export type KanbanizeColumn = z.infer<typeof KanbanizeColumnSchema>;

const ColumnsListInputSchema = z.object({
	board_id: BoardIdSchema,
	fields: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Return only these fields. The record’s ID is always included.'),
});

export type ColumnsListInput = z.input<typeof ColumnsListInputSchema>;

const ColumnsListResponseSchema = z
	.object({ data: z.array(KanbanizeColumnSchema) })
	.loose();

export type ColumnsListResponse = z.infer<typeof ColumnsListResponseSchema>;

const ColumnGetInputSchema = z.object({
	board_id: BoardIdSchema,
	column_id: ColumnIdSchema,
});

export type ColumnGetInput = z.input<typeof ColumnGetInputSchema>;

const ColumnResponseSchema = z.object({ data: KanbanizeColumnSchema }).loose();

export type ColumnResponse = z.infer<typeof ColumnResponseSchema>;

const ColumnCreateInputSchema = z
	.object({
		board_id: BoardIdSchema,
		name: z.string().min(1),
		position: z.number().int().min(0).describe('`0` is the leftmost.'),
		workflow_id: WorkflowIdSchema.optional().describe(
			'A main column, in a workflow. Needs `section`. Cannot be used with `parent_column_id`.',
		),
		section: z
			.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
			.optional()
			.describe(
				'`1` backlog, `2` requested, `3` progress, `4` done. Required with `workflow_id`.',
			),
		parent_column_id: ColumnIdSchema.optional().describe(
			'A subcolumn, under this parent. Cannot be used with `workflow_id`.',
		),
		description: z.string().optional(),
		color: z.string().optional().describe('Hexadecimal, such as `a1b2c3`.'),
	})
	.superRefine((value, ctx) => {
		const main = value.workflow_id !== undefined;
		const sub = value.parent_column_id !== undefined;
		if (main === sub) {
			ctx.addIssue({
				code: 'custom',
				path: [main ? 'parent_column_id' : 'workflow_id'],
				message:
					'A column is either a main column (`workflow_id`) or a subcolumn (`parent_column_id`), not both and not neither.',
			});
		}
		if (main && value.section === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['section'],
				message: 'A main column needs a `section`.',
			});
		}
		if (sub && value.section !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['section'],
				message: 'A subcolumn takes no `section`; it inherits its parent’s.',
			});
		}
	});

export type ColumnCreateInput = z.input<typeof ColumnCreateInputSchema>;

const ColumnUpdateInputSchema = z
	.object({
		board_id: BoardIdSchema,
		column_id: ColumnIdSchema,
		name: z.string().min(1).optional(),
		description: z.string().optional(),
		color: z.string().optional(),
		position: z.number().int().min(0).optional(),
		limit: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Work-in-progress limit.'),
		section: z
			.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
			.optional()
			.describe('Move a main column to another section.'),
		parent_column_id: ColumnIdSchema.optional().describe(
			'Move a subcolumn under another parent.',
		),
	})
	.superRefine((value, ctx) => {
		const { board_id: _boardId, column_id: _columnId, ...changes } = value;
		if (Object.values(changes).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['column_id'],
				message: 'Send at least one field to update.',
			});
		}
	});

export type ColumnUpdateInput = z.input<typeof ColumnUpdateInputSchema>;

const ColumnRemoveInputSchema = z.object({
	board_id: BoardIdSchema,
	column_id: ColumnIdSchema,
});

export type ColumnRemoveInput = z.input<typeof ColumnRemoveInputSchema>;

// ── lanes ─────────────────────────────────────────────────────────────────

const LaneIdSchema = z.number().int().positive().describe('The lane ID.');

export const KanbanizeLaneSchema = z
	.object({
		lane_id: z.number(),
		workflow_id: z.number().nullish(),
		parent_lane_id: z.number().nullish(),
		position: z.number().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		color: z.string().nullish(),
	})
	.loose();

export type KanbanizeLane = z.infer<typeof KanbanizeLaneSchema>;

const LanesListInputSchema = z.object({ board_id: BoardIdSchema });

export type LanesListInput = z.input<typeof LanesListInputSchema>;

const LanesListResponseSchema = z
	.object({ data: z.array(KanbanizeLaneSchema) })
	.loose();

export type LanesListResponse = z.infer<typeof LanesListResponseSchema>;

const LaneGetInputSchema = z.object({
	board_id: BoardIdSchema,
	lane_id: LaneIdSchema,
});

export type LaneGetInput = z.input<typeof LaneGetInputSchema>;

const LaneResponseSchema = z.object({ data: KanbanizeLaneSchema }).loose();

export type LaneResponse = z.infer<typeof LaneResponseSchema>;

const LaneCreateInputSchema = z
	.object({
		board_id: BoardIdSchema,
		name: z.string().min(1).max(100),
		position: z.number().int().min(0),
		workflow_id: WorkflowIdSchema.optional().describe(
			'A top-level lane on this workflow. Cannot be used with `parent_lane_id`.',
		),
		parent_lane_id: LaneIdSchema.optional().describe(
			'A nested lane under this one. Cannot be used with `workflow_id`.',
		),
		description: z.string().optional(),
		color: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		const top = value.workflow_id !== undefined;
		const nested = value.parent_lane_id !== undefined;
		if (top === nested) {
			ctx.addIssue({
				code: 'custom',
				path: [top ? 'parent_lane_id' : 'workflow_id'],
				message:
					'A lane sits either on a workflow (`workflow_id`) or under a lane (`parent_lane_id`), not both and not neither.',
			});
		}
	});

export type LaneCreateInput = z.input<typeof LaneCreateInputSchema>;

const LaneUpdateInputSchema = z
	.object({
		board_id: BoardIdSchema,
		lane_id: LaneIdSchema,
		name: z.string().min(1).max(100).optional(),
		description: z.string().optional(),
		color: z.string().optional(),
		position: z.number().int().min(0).optional(),
		parent_lane_id: LaneIdSchema.optional(),
	})
	.superRefine((value, ctx) => {
		const { board_id: _boardId, lane_id: _laneId, ...changes } = value;
		if (Object.values(changes).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['lane_id'],
				message: 'Send at least one field to update.',
			});
		}
	});

export type LaneUpdateInput = z.input<typeof LaneUpdateInputSchema>;

const LaneRemoveInputSchema = z.object({
	board_id: BoardIdSchema,
	lane_id: LaneIdSchema,
});

export type LaneRemoveInput = z.input<typeof LaneRemoveInputSchema>;

// ── cards ─────────────────────────────────────────────────────────────────

export const KANBANIZE_CARD_STATES = [
	'active',
	'archived',
	'discarded',
] as const;

export const KANBANIZE_CARD_EXPANDS = [
	'custom_fields',
	'stickers',
	'tag_ids',
	'milestone_ids',
	'co_owner_ids',
	'watcher_ids',
	'attachments',
	'cover_image',
	'checked_column_checklist_items',
	'annotations',
	'subtasks',
	'linked_cards',
	'transitions',
	'block_times',
	'logged_times',
] as const;

const FlagInputSchema = FlagSchema;
const IdListQuerySchema = IdListSchema.min(1);

const CardsListInputSchema = z.object({
	card_ids: IdListQuerySchema.optional(),
	board_ids: IdListQuerySchema.optional(),
	workflow_ids: IdListQuerySchema.optional(),
	state: z
		.enum(KANBANIZE_CARD_STATES)
		.optional()
		.describe('Defaults to `active`.'),
	column_ids: IdListQuerySchema.optional(),
	lane_ids: IdListQuerySchema.optional(),
	owner_user_ids: IdListQuerySchema.optional(),
	type_ids: IdListQuerySchema.optional(),
	custom_ids: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Only cards with these custom IDs.'),
	is_blocked: FlagInputSchema.optional(),
	priorities: IdListQuerySchema.optional(),
	sizes: z.array(z.number()).min(1).optional(),
	colors: z.array(z.string().min(1)).min(1).optional(),
	last_column_ids: IdListQuerySchema.optional(),
	last_lane_ids: IdListQuerySchema.optional(),
	version_ids: IdListQuerySchema.optional(),
	archived_from_date: z
		.string()
		.optional()
		.describe('Archived on or after this date, `YYYY-MM-DD`.'),
	archived_to_date: z.string().optional(),
	discarded_from_date: z.string().optional(),
	discarded_to_date: z.string().optional(),
	created_from_date: z.string().optional(),
	created_to_date: z.string().optional(),
	last_modified_from_date: z.string().optional(),
	last_modified_to_date: z.string().optional(),
	deadline_from_date: z.string().optional(),
	deadline_to_date: z.string().optional(),
	page: z.number().int().min(1).optional().describe('1-based page.'),
	per_page: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Cards per page. Defaults to 200.'),
	fields: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Return only these fields. The record’s ID is always included.'),
	expand: z
		.array(z.enum(KANBANIZE_CARD_EXPANDS))
		.min(1)
		.optional()
		.describe('Include these nested objects.'),
});

export type CardsListInput = z.input<typeof CardsListInputSchema>;

// A card is an open record: `expand` adds whole objects that the list shape
// does not mention, and `fields` can cut it down to a handful of keys.
export const KanbanizeCardSchema = z
	.object({
		card_id: z.number(),
		custom_id: z.string().nullish(),
		board_id: z.number().nullish(),
		workflow_id: z.number().nullish(),
		title: z.string().nullish(),
		owner_user_id: z.number().nullish(),
		type_id: z.number().nullish(),
		color: z.string().nullish(),
		section: z.number().nullish(),
		column_id: z.number().nullish(),
		lane_id: z.number().nullish(),
		last_column_id: z.number().nullish(),
		last_lane_id: z.number().nullish(),
		position: z.number().nullish(),
		description: z.string().nullish(),
		size: z.number().nullish(),
		priority: z.number().nullish(),
		deadline: z.string().nullish(),
		reporter: z
			.object({
				type: z
					.string()
					.nullish()
					.describe('`internal` for a user, `external` for an email address.'),
				value: z
					.union([z.number(), z.string()])
					.nullish()
					.describe('The user ID, or the email address for `external`.'),
			})
			.loose()
			.nullish()
			.describe('Who created the card.'),
		created_at: z.string().nullish(),
		revision: z.number().nullish(),
		last_modified: z.string().nullish(),
		in_current_position_since: z.string().nullish(),
		is_blocked: FlagSchema.nullish(),
		block_reason: z
			.object({
				block_type: z.number().nullish(),
				reason_id: z.number().nullish(),
				comment: z.string().nullish(),
			})
			.loose()
			.nullish()
			.describe('Why the card is blocked; null when it is not.'),
		finished_subtask_count: z.number().nullish(),
		unfinished_subtask_count: z.number().nullish(),
		tag_ids: z.array(z.number()).nullish(),
		// unknown: `expand` adds provider-shaped nested objects (custom_fields,
		// subtasks, linked_cards and so on), which have no closed type here.
		custom_fields: z.array(z.record(z.string(), z.unknown())).nullish(),
		subtasks: z.array(z.record(z.string(), z.unknown())).nullish(),
		linked_cards: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type KanbanizeCard = z.infer<typeof KanbanizeCardSchema>;

const CardsListResponseSchema = z
	.object({
		data: z.object({
			pagination: PaginationSchema.nullish(),
			data: z.array(KanbanizeCardSchema),
		}),
		next_page: z
			.number()
			.nullable()
			.describe('The next page while more remain; null on the last page.'),
	})
	.loose();

export type CardsListResponse = z.infer<typeof CardsListResponseSchema>;

const CardGetInputSchema = z.object({ card_id: CardIdSchema });

export type CardGetInput = z.input<typeof CardGetInputSchema>;

// `cards.create` and `cards.update` receive the card as a one-element array;
// the endpoints unwrap it so every card write returns the shape `cards.get` does.
const CardResponseSchema = z.object({ data: KanbanizeCardSchema }).loose();

export type CardResponse = z.infer<typeof CardResponseSchema>;

const IdArraySchema = z.array(z.number().int().positive()).min(1);

// Businessmap takes one write shape per field type: `value` for text, number,
// date and link fields; `selected_values_to_add_or_update` for a dropdown;
// contributor, vote and card-picker fields have their own keys.
const CustomFieldValueSchema = z
	.object({
		field_id: z.number().int().positive(),
		value: z
			.union([z.string(), z.number(), z.array(z.string())])
			.nullable()
			.optional()
			.describe('Text, number, date or link fields. null clears the value.'),
		selected_values_to_add_or_update: z
			.array(
				z
					.object({
						value_id: z.number().int().positive(),
						position: z.number().int().min(0).optional(),
					})
					.loose(),
			)
			.min(1)
			.optional()
			.describe('Dropdown fields: the option IDs to select.'),
		selected_value_ids_to_remove: IdArraySchema.optional().describe(
			'Dropdown fields: the option IDs to unselect.',
		),
		other_value: z
			.string()
			.nullable()
			.optional()
			.describe('Dropdown fields when "Other" is selected.'),
		contributor_ids_to_add: IdArraySchema.optional(),
		contributor_ids_to_remove: IdArraySchema.optional(),
		vote: z
			.union([z.literal(0), z.literal(1)])
			.optional()
			.describe('Vote fields: `1` up, `0` down.'),
		comment: z.string().nullable().optional(),
	})
	.loose()
	.refine(
		({ field_id: _fieldId, ...change }) =>
			Object.values(change).some((entry) => entry !== undefined),
		{ message: 'Send a value or a change for the custom field.' },
	);

const SubtaskToAddSchema = z
	.object({
		description: z.string().min(1),
		owner_user_id: z.number().int().positive().optional(),
		deadline: z
			.string()
			.optional()
			.describe('ISO 8601 with a timezone offset.'),
	})
	.loose();

/** The card fields both create and update accept, named as Businessmap names them. */
const cardWritableFields = {
	column_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The column the card sits in. On update, the card moves there.'),
	lane_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The lane the card sits in. On update, the card moves there.'),
	position: z.number().int().min(0).optional().describe('`0` is the top.'),
	title: z.string().min(1).optional(),
	description: z.string().optional(),
	custom_id: z.string().min(1).optional(),
	owner_user_id: z.number().int().positive().optional(),
	type_id: z.number().int().positive().optional(),
	size: z.number().optional(),
	priority: z
		.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
		.optional()
		.describe('`1` critical, `2` high, `3` average, `4` low.'),
	color: z.string().optional().describe('Hexadecimal, such as `a1b2c3`.'),
	deadline: z.string().optional().describe('ISO 8601 with a timezone offset.'),
	co_owner_ids_to_add: IdListQuerySchema.optional(),
	watcher_ids_to_add: IdListQuerySchema.optional(),
	tag_ids_to_add: IdListQuerySchema.optional(),
	milestone_ids_to_add: IdListQuerySchema.optional(),
};

const CardCreateInputSchema = z.object({
	...cardWritableFields,
	// Businessmap places every new card in a lane and a column of a board, so
	// both are required here, though optional on update.
	column_id: z
		.number()
		.int()
		.positive()
		.describe('The column the new card goes in, from `columns.list`.'),
	lane_id: z
		.number()
		.int()
		.positive()
		.describe('The lane the new card goes in, from `lanes.list`.'),
	// `title` is required on create even though the spec does not mark it so;
	// Businessmap rejects a card without one.
	title: z.string().min(1).describe('The card title.'),
	template_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Create the card from this template.'),
	custom_fields_to_add_or_update: z
		.array(CustomFieldValueSchema)
		.min(1)
		.optional(),
	subtasks_to_add: z.array(SubtaskToAddSchema).min(1).optional(),
	watch: z
		.union([z.literal(0), z.literal(1)])
		.optional()
		.describe('`1` to have the key’s user watch the new card.'),
});

export type CardCreateInput = z.input<typeof CardCreateInputSchema>;

const CardUpdateInputSchema = z
	.object({
		card_id: CardIdSchema,
		...cardWritableFields,
		tag_ids_to_remove: IdListQuerySchema.optional(),
		milestone_ids_to_remove: IdListQuerySchema.optional(),
		co_owner_ids_to_remove: IdListQuerySchema.optional(),
		watcher_ids_to_remove: IdListQuerySchema.optional(),
		custom_fields_to_add_or_update: z
			.array(CustomFieldValueSchema)
			.min(1)
			.optional(),
		custom_field_ids_to_remove: IdListQuerySchema.optional(),
		subtasks_to_add: z.array(SubtaskToAddSchema).min(1).optional(),
		// Businessmap documents null on these to clear them.
		custom_id: z.string().min(1).nullable().optional(),
		owner_user_id: z
			.number()
			.int()
			.positive()
			.nullable()
			.optional()
			.describe('null removes the owner.'),
		type_id: z.number().int().positive().nullable().optional(),
		size: z
			.number()
			.nullable()
			.optional()
			.describe('null counts as a size of 1.'),
		deadline: z
			.string()
			.nullable()
			.optional()
			.describe('ISO 8601 with a timezone offset. null removes the deadline.'),
		is_archived: FlagSchema.optional().describe('`1` archives the card.'),
		is_discarded: FlagSchema.optional().describe('`1` discards the card.'),
	})
	.superRefine((value, ctx) => {
		const { card_id: _cardId, ...changes } = value;
		if (Object.values(changes).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['card_id'],
				message: 'Send at least one field to update.',
			});
		}
	});

export type CardUpdateInput = z.input<typeof CardUpdateInputSchema>;

const CardRemoveInputSchema = z.object({
	card_id: CardIdSchema,
	exceeding_reason: z
		.string()
		.optional()
		.describe('Needed when deleting a card from a board that reaches a limit.'),
});

export type CardRemoveInput = z.input<typeof CardRemoveInputSchema>;

// ── comments and subtasks ─────────────────────────────────────────────────

export const KanbanizeCommentSchema = z
	.object({
		comment_id: z.number(),
		type: z
			.string()
			.nullish()
			.describe('`plain`, `sent as email` or `received as email`.'),
		// unknown: `{ type, value }` for a user comment; email comments carry
		// `sender` and `recipients` instead.
		author: z.record(z.string(), z.unknown()).nullish(),
		text: z.string().nullish(),
		created_at: z.string().nullish(),
		last_modified: z.string().nullish(),
	})
	.loose();

export type KanbanizeComment = z.infer<typeof KanbanizeCommentSchema>;

const CommentsListInputSchema = z.object({ card_id: CardIdSchema });

export type CommentsListInput = z.input<typeof CommentsListInputSchema>;

const CommentsListResponseSchema = z
	.object({ data: z.array(KanbanizeCommentSchema) })
	.loose();

export type CommentsListResponse = z.infer<typeof CommentsListResponseSchema>;

const CommentCreateInputSchema = z.object({
	card_id: CardIdSchema,
	text: z.string().min(1),
});

export type CommentCreateInput = z.input<typeof CommentCreateInputSchema>;

const CommentResponseSchema = z
	.object({ data: KanbanizeCommentSchema })
	.loose();

export type CommentResponse = z.infer<typeof CommentResponseSchema>;

export const KanbanizeSubtaskSchema = z
	.object({
		subtask_id: z.number(),
		description: z.string().nullish(),
		owner_user_id: z.number().nullish(),
		deadline: z.string().nullish(),
		finished_at: z.string().nullish(),
		position: z.number().nullish(),
	})
	.loose();

export type KanbanizeSubtask = z.infer<typeof KanbanizeSubtaskSchema>;

const SubtasksListInputSchema = z.object({ card_id: CardIdSchema });

export type SubtasksListInput = z.input<typeof SubtasksListInputSchema>;

const SubtasksListResponseSchema = z
	.object({ data: z.array(KanbanizeSubtaskSchema) })
	.loose();

export type SubtasksListResponse = z.infer<typeof SubtasksListResponseSchema>;

const SubtaskCreateInputSchema = z.object({
	card_id: CardIdSchema,
	description: z.string().min(1),
	owner_user_id: z.number().int().positive().optional(),
	deadline: z.string().optional().describe('ISO 8601 with a timezone offset.'),
});

export type SubtaskCreateInput = z.input<typeof SubtaskCreateInputSchema>;

const SubtaskResponseSchema = z
	.object({ data: KanbanizeSubtaskSchema })
	.loose();

export type SubtaskResponse = z.infer<typeof SubtaskResponseSchema>;

const SubtaskUpdateInputSchema = z
	.object({
		card_id: CardIdSchema,
		subtask_id: z.number().int().positive(),
		description: z.string().min(1).optional(),
		owner_user_id: z.number().int().positive().optional(),
		deadline: z.string().optional(),
		is_finished: FlagSchema.optional().describe('`1` marks the subtask done.'),
	})
	.superRefine((value, ctx) => {
		const { card_id: _cardId, subtask_id: _subtaskId, ...changes } = value;
		if (Object.values(changes).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['subtask_id'],
				message:
					'Send `description`, `owner_user_id`, `deadline` or `is_finished`.',
			});
		}
	});

export type SubtaskUpdateInput = z.input<typeof SubtaskUpdateInputSchema>;

const SubtaskRemoveInputSchema = z.object({
	card_id: CardIdSchema,
	subtask_id: z.number().int().positive(),
});

export type SubtaskRemoveInput = z.input<typeof SubtaskRemoveInputSchema>;

// ── tags ──────────────────────────────────────────────────────────────────

export const KanbanizeTagSchema = z
	.object({
		tag_id: z.number(),
		label: z.string().nullish(),
		color: z.string().nullish(),
		availability: z.number().nullish(),
		is_enabled: FlagSchema.nullish(),
	})
	.loose();

export type KanbanizeTag = z.infer<typeof KanbanizeTagSchema>;

const TagsListInputSchema = z.object({});

export type TagsListInput = z.input<typeof TagsListInputSchema>;

const TagsListResponseSchema = z
	.object({ data: z.array(KanbanizeTagSchema) })
	.loose();

export type TagsListResponse = z.infer<typeof TagsListResponseSchema>;

// ── users ─────────────────────────────────────────────────────────────────

export const KanbanizeUserSchema = z
	.object({
		user_id: z.number(),
		username: z.string().nullish(),
		realname: z.string().nullish(),
		email: z.string().nullish(),
		avatar: z.string().nullish(),
		is_enabled: FlagSchema.nullish(),
	})
	.loose();

export type KanbanizeUser = z.infer<typeof KanbanizeUserSchema>;

const UsersListInputSchema = z.object({
	fields: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Return only these fields. The record’s ID is always included.'),
});

export type UsersListInput = z.input<typeof UsersListInputSchema>;

const UsersListResponseSchema = z
	.object({ data: z.array(KanbanizeUserSchema) })
	.loose();

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

// ── me and limits ─────────────────────────────────────────────────────────

const MeInputSchema = z.object({});

export type MeInput = z.input<typeof MeInputSchema>;

const MeResponseSchema = z
	.object({
		data: z
			.object({
				user_id: z.number(),
				email: z.string().nullish(),
				username: z.string().nullish(),
				realname: z.string().nullish(),
				avatar: z.string().nullish(),
			})
			.loose(),
	})
	.loose();

export type MeResponse = z.infer<typeof MeResponseSchema>;

const ApiLimitsInputSchema = z.object({});

export type ApiLimitsInput = z.input<typeof ApiLimitsInputSchema>;

const ApiLimitsResponseSchema = z
	.object({
		data: z.array(
			z
				.object({
					type: z.string().nullish(),
					limit: z.number().nullish(),
				})
				.loose(),
		),
	})
	.loose();

export type ApiLimitsResponse = z.infer<typeof ApiLimitsResponseSchema>;

// ── webhooks ──────────────────────────────────────────────────────────────

export const KanbanizeWebhookSchema = z
	.object({
		webhook_id: z.number(),
		url: z.string().nullish(),
		is_enabled: FlagSchema.nullish(),
		board_id: z.number().nullish(),
		secret: z
			.string()
			.nullish()
			.describe(
				'Sent once, by `webhooks.create`: the secret Businessmap signs deliveries with. Store it; no later call returns it.',
			),
	})
	.loose();

export type KanbanizeWebhook = z.infer<typeof KanbanizeWebhookSchema>;

const WebhooksListInputSchema = z.object({});

export type WebhooksListInput = z.input<typeof WebhooksListInputSchema>;

const WebhooksListResponseSchema = z
	.object({ data: z.array(KanbanizeWebhookSchema) })
	.loose();

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

const WebhookCreateInputSchema = z.object({
	url: z.url().describe('The HTTP or HTTPS endpoint to notify.'),
	board_id: BoardIdSchema.describe('The board whose events it receives.'),
	is_enabled: FlagSchema.optional().describe('Defaults to `1`.'),
});

export type WebhookCreateInput = z.input<typeof WebhookCreateInputSchema>;

const WebhookUpdateInputSchema = z
	.object({
		webhook_id: z.number().int().positive(),
		url: z.url().optional(),
		board_id: BoardIdSchema.optional(),
		is_enabled: FlagSchema.optional(),
	})
	.superRefine((value, ctx) => {
		const { webhook_id: _webhookId, ...changes } = value;
		if (Object.values(changes).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['webhook_id'],
				message: 'Send `url`, `board_id` or `is_enabled`.',
			});
		}
	});

export type WebhookUpdateInput = z.input<typeof WebhookUpdateInputSchema>;

const WebhookRemoveInputSchema = z.object({
	webhook_id: z.number().int().positive(),
});

export type WebhookRemoveInput = z.input<typeof WebhookRemoveInputSchema>;

const WebhookResponseSchema = z
	.object({ data: KanbanizeWebhookSchema })
	.loose();

export type WebhookResponse = z.infer<typeof WebhookResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type KanbanizeEndpointInputs = {
	boardsList: BoardsListInput;
	boardsGet: BoardGetInput;
	boardsCreate: BoardCreateInput;
	boardsUpdate: BoardUpdateInput;
	boardsRemove: BoardRemoveInput;
	workflowsList: WorkflowsListInput;
	workflowsGet: WorkflowGetInput;
	workflowsCreate: WorkflowCreateInput;
	workflowsUpdate: WorkflowUpdateInput;
	workflowsRemove: WorkflowRemoveInput;
	columnsList: ColumnsListInput;
	columnsGet: ColumnGetInput;
	columnsCreate: ColumnCreateInput;
	columnsUpdate: ColumnUpdateInput;
	columnsRemove: ColumnRemoveInput;
	lanesList: LanesListInput;
	lanesGet: LaneGetInput;
	lanesCreate: LaneCreateInput;
	lanesUpdate: LaneUpdateInput;
	lanesRemove: LaneRemoveInput;
	cardsList: CardsListInput;
	cardsGet: CardGetInput;
	cardsCreate: CardCreateInput;
	cardsUpdate: CardUpdateInput;
	cardsRemove: CardRemoveInput;
	commentsList: CommentsListInput;
	commentsCreate: CommentCreateInput;
	subtasksList: SubtasksListInput;
	subtasksCreate: SubtaskCreateInput;
	subtasksUpdate: SubtaskUpdateInput;
	subtasksRemove: SubtaskRemoveInput;
	tagsList: TagsListInput;
	usersList: UsersListInput;
	meGet: MeInput;
	limitsGet: ApiLimitsInput;
	webhooksList: WebhooksListInput;
	webhooksCreate: WebhookCreateInput;
	webhooksUpdate: WebhookUpdateInput;
	webhooksRemove: WebhookRemoveInput;
};

export type KanbanizeEndpointOutputs = {
	boardsList: BoardsListResponse;
	boardsGet: BoardResponse;
	boardsCreate: BoardResponse;
	boardsUpdate: BoardResponse;
	boardsRemove: DeletedResponse;
	workflowsList: WorkflowsListResponse;
	workflowsGet: WorkflowResponse;
	workflowsCreate: WorkflowResponse;
	workflowsUpdate: WorkflowResponse;
	workflowsRemove: DeletedResponse;
	columnsList: ColumnsListResponse;
	columnsGet: ColumnResponse;
	columnsCreate: ColumnResponse;
	columnsUpdate: ColumnResponse;
	columnsRemove: DeletedResponse;
	lanesList: LanesListResponse;
	lanesGet: LaneResponse;
	lanesCreate: LaneResponse;
	lanesUpdate: LaneResponse;
	lanesRemove: DeletedResponse;
	cardsList: CardsListResponse;
	cardsGet: CardResponse;
	cardsCreate: CardResponse;
	cardsUpdate: CardResponse;
	cardsRemove: DeletedResponse;
	commentsList: CommentsListResponse;
	commentsCreate: CommentResponse;
	subtasksList: SubtasksListResponse;
	subtasksCreate: SubtaskResponse;
	subtasksUpdate: SubtaskResponse;
	subtasksRemove: DeletedResponse;
	tagsList: TagsListResponse;
	usersList: UsersListResponse;
	meGet: MeResponse;
	limitsGet: ApiLimitsResponse;
	webhooksList: WebhooksListResponse;
	webhooksCreate: WebhookResponse;
	webhooksUpdate: WebhookResponse;
	webhooksRemove: DeletedResponse;
};

export const KanbanizeEndpointInputSchemas = {
	boardsList: BoardsListInputSchema,
	boardsGet: BoardGetInputSchema,
	boardsCreate: BoardCreateInputSchema,
	boardsUpdate: BoardUpdateInputSchema,
	boardsRemove: BoardRemoveInputSchema,
	workflowsList: WorkflowsListInputSchema,
	workflowsGet: WorkflowGetInputSchema,
	workflowsCreate: WorkflowCreateInputSchema,
	workflowsUpdate: WorkflowUpdateInputSchema,
	workflowsRemove: WorkflowRemoveInputSchema,
	columnsList: ColumnsListInputSchema,
	columnsGet: ColumnGetInputSchema,
	columnsCreate: ColumnCreateInputSchema,
	columnsUpdate: ColumnUpdateInputSchema,
	columnsRemove: ColumnRemoveInputSchema,
	lanesList: LanesListInputSchema,
	lanesGet: LaneGetInputSchema,
	lanesCreate: LaneCreateInputSchema,
	lanesUpdate: LaneUpdateInputSchema,
	lanesRemove: LaneRemoveInputSchema,
	cardsList: CardsListInputSchema,
	cardsGet: CardGetInputSchema,
	cardsCreate: CardCreateInputSchema,
	cardsUpdate: CardUpdateInputSchema,
	cardsRemove: CardRemoveInputSchema,
	commentsList: CommentsListInputSchema,
	commentsCreate: CommentCreateInputSchema,
	subtasksList: SubtasksListInputSchema,
	subtasksCreate: SubtaskCreateInputSchema,
	subtasksUpdate: SubtaskUpdateInputSchema,
	subtasksRemove: SubtaskRemoveInputSchema,
	tagsList: TagsListInputSchema,
	usersList: UsersListInputSchema,
	meGet: MeInputSchema,
	limitsGet: ApiLimitsInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksCreate: WebhookCreateInputSchema,
	webhooksUpdate: WebhookUpdateInputSchema,
	webhooksRemove: WebhookRemoveInputSchema,
} as const;

export const KanbanizeEndpointOutputSchemas = {
	boardsList: BoardsListResponseSchema,
	boardsGet: BoardResponseSchema,
	boardsCreate: BoardResponseSchema,
	boardsUpdate: BoardResponseSchema,
	boardsRemove: DeletedResponseSchema,
	workflowsList: WorkflowsListResponseSchema,
	workflowsGet: WorkflowResponseSchema,
	workflowsCreate: WorkflowResponseSchema,
	workflowsUpdate: WorkflowResponseSchema,
	workflowsRemove: DeletedResponseSchema,
	columnsList: ColumnsListResponseSchema,
	columnsGet: ColumnResponseSchema,
	columnsCreate: ColumnResponseSchema,
	columnsUpdate: ColumnResponseSchema,
	columnsRemove: DeletedResponseSchema,
	lanesList: LanesListResponseSchema,
	lanesGet: LaneResponseSchema,
	lanesCreate: LaneResponseSchema,
	lanesUpdate: LaneResponseSchema,
	lanesRemove: DeletedResponseSchema,
	cardsList: CardsListResponseSchema,
	cardsGet: CardResponseSchema,
	cardsCreate: CardResponseSchema,
	cardsUpdate: CardResponseSchema,
	cardsRemove: DeletedResponseSchema,
	commentsList: CommentsListResponseSchema,
	commentsCreate: CommentResponseSchema,
	subtasksList: SubtasksListResponseSchema,
	subtasksCreate: SubtaskResponseSchema,
	subtasksUpdate: SubtaskResponseSchema,
	subtasksRemove: DeletedResponseSchema,
	tagsList: TagsListResponseSchema,
	usersList: UsersListResponseSchema,
	meGet: MeResponseSchema,
	limitsGet: ApiLimitsResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksCreate: WebhookResponseSchema,
	webhooksUpdate: WebhookResponseSchema,
	webhooksRemove: DeletedResponseSchema,
} as const;
