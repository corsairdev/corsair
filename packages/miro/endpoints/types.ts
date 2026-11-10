import { z } from 'zod';

// Inputs and outputs follow Miro's REST API v2 spec
// (github.com/miroapp/api-clients/packages/generator/spec.json) and the live
// reference pages, which disagree in two places that are called out inline.
//
// Outputs are `.loose()` and their fields nullish, so a field Miro adds cannot
// fail a call that has already happened.

// ── Shared pieces ────────────────────────────────────────────────────────────

const ItemId = z.string().min(1);
const BoardId = z
	.string()
	.min(1)
	.describe('The board id, as shown in the board URL.');

/** Boards page by offset; items and groups page by cursor. */
const OffsetPagingSchema = {
	limit: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Results per page, up to 50. Defaults to 20.'),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Zero-based offset of the first result. Defaults to 0.'),
};

const cursorPaging = (minimum: number) => ({
	limit: z
		.number()
		.int()
		.min(minimum)
		.max(50)
		.optional()
		.describe(
			`Results per page, ${minimum} to 50. Defaults to 10; Miro rejects anything below ${minimum} on this route.`,
		),
	cursor: z
		.string()
		.min(1)
		.optional()
		.describe('The `cursor` from the previous page; omit for the first.'),
});

/** Items and connectors refuse fewer than 10 rows per page. */
const CursorPagingSchema = cursorPaging(10);

const HrefSchema = z.string().nullish();

/**
 * A reference to another resource, as Miro sends it: an object with `id`,
 * `type` and usually `name`. The spec types `ownerId`, `teamId`, `createdBy`
 * and `modifiedBy` as strings, but a live board returns objects for all four.
 */
const ReferenceSchema = z
	.object({
		id: z.string().nullish(),
		type: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

/**
 * True when at least one field carries a change, so an update is not a no-op.
 *
 * `unknown` because the callers are zod refinements over several different
 * update shapes; each passes the fields it owns and this only asks whether a
 * value is present, so a union of every field type would add nothing.
 *
 * An empty *object* is not a change: Miro rejects `style: {}`, and a caller who
 * passed one meant nothing by it. An empty *array* is a change, because clearing
 * a list is a real edit: `captions: []` removes a connector's labels.
 */
function anySet(...values: unknown[]): boolean {
	return values.some((value) => {
		if (value === undefined) return false;
		if (Array.isArray(value)) return true;
		if (typeof value === 'object' && value !== null) {
			return Object.keys(value).length > 0;
		}
		return true;
	});
}

/**
 * A value inside an item's `data`, whose keys differ per item kind.
 *
 * Written as a recursive JSON union rather than `z.unknown()` because the docs
 * generator renders `ZodUnknown` as `any`, and this states what can be there.
 */
type ItemDataValue =
	| string
	| number
	| boolean
	| null
	| ItemDataValue[]
	| { [key: string]: ItemDataValue };

const ItemDataValueSchema: z.ZodType<ItemDataValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(ItemDataValueSchema),
		z.record(z.string(), ItemDataValueSchema),
	]),
);

/** The `data` object on a mixed item page, whose fields depend on the kind. */
const ItemDataSchema = z.record(z.string(), ItemDataValueSchema);

/** What a board write returns: the resource plus its links. */
const LinksSchema = z.object({ self: HrefSchema }).loose();

/**
 * A size or opacity in a returned style. Miro sends these as strings ("2.0",
 * "14"), which is how the reference types them; a number is read too, so a
 * route that sends one does not fail a call that has already happened.
 */
const StyleNumberSchema = z.union([z.string(), z.number()]).nullish();

const PositionSchema = z.object({
	x: z.number().describe('Horizontal position, in board units.'),
	y: z.number().describe('Vertical position, in board units.'),
	origin: z
		.string()
		.optional()
		.describe('`center` (the default) or `top-left`.'),
});

const GeometrySchema = z.object({
	width: z.number().optional().describe('Width in board units.'),
	height: z.number().optional(),
	rotation: z.number().optional().describe('Rotation in degrees, -180 to 180.'),
});

/** Attach an item to a frame or another item. */
const ParentSchema = z.object({
	id: ItemId.describe('The parent item id, usually a frame.'),
});

// ── boards ──────────────────────────────────────────────────────────────────

const BoardPolicySchema = z
	.object({
		permissionsPolicy: z
			.object({
				collaborationToolsStartAccess: z
					.enum(['all_editors', 'board_owners_and_coowners'])
					.optional(),
				copyAccess: z
					.enum(['anyone', 'team_members', 'team_editors', 'board_owner'])
					.optional(),
				sharingAccess: z
					.enum(['team_members_with_editing_rights', 'owner_and_coowners'])
					.optional(),
			})
			.loose()
			.optional(),
		sharingPolicy: z
			.object({
				access: z
					.enum(['private', 'view', 'comment', 'edit'])
					.optional()
					.describe('Who can reach the board.'),
				inviteToAccountAndBoardLinkAccess: z
					.enum(['no_access', 'viewer', 'commenter', 'editor'])
					.optional(),
				teamAccess: z.enum(['private', 'view', 'comment', 'edit']).optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

/**
 * The policy as a board returns it. The input above lists the values a caller
 * may send; a response is read as plain strings, so a value Miro adds (or one
 * only a response carries, such as `guest`) does not fail the read.
 */
const BoardPolicyOutputSchema = z
	.object({
		permissionsPolicy: z
			.object({
				collaborationToolsStartAccess: z.string().nullish(),
				copyAccess: z.string().nullish(),
				sharingAccess: z.string().nullish(),
			})
			.loose()
			.nullish(),
		sharingPolicy: z
			.object({
				access: z.string().nullish().describe('Who can reach the board.'),
				inviteToAccountAndBoardLinkAccess: z.string().nullish(),
				organizationAccess: z.string().nullish(),
				teamAccess: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const BoardSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		createdAt: z.string().nullish(),
		createdBy: ReferenceSchema.nullish(),
		modifiedAt: z.string().nullish(),
		modifiedBy: ReferenceSchema.nullish(),
		owner: ReferenceSchema.nullish().describe('The board owner.'),
		team: ReferenceSchema.nullish().describe('The team the board belongs to.'),
		organization: ReferenceSchema.nullish(),
		projectId: z.string().nullish(),
		viewLink: z.string().nullish(),
		type: z.string().nullish(),
		currentUserMembership: z
			.object({ role: z.string().nullish() })
			.loose()
			.nullish(),
		policy: BoardPolicyOutputSchema.nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

export type MiroBoard = z.infer<typeof BoardSchema>;

const BoardsListInputSchema = z.object({
	teamId: z.string().min(1).optional().describe('Only boards in this team.'),
	projectId: z
		.string()
		.min(1)
		.optional()
		.describe('Only boards in this project.'),
	query: z
		.string()
		.min(1)
		.optional()
		.describe('Only boards whose name contains this text.'),
	owner: z
		.string()
		.min(1)
		.optional()
		.describe('Only boards owned by this user id.'),
	sort: z
		.enum([
			'default',
			'last_modified',
			'last_opened',
			'last_created',
			'alphabetically',
		])
		.optional()
		.describe('Board ordering. Defaults to Miro own order.'),
	...OffsetPagingSchema,
});

export type BoardsListInput = z.input<typeof BoardsListInputSchema>;

const BoardsListResponseSchema = z.object({
	// Miro names the rows `data` on every list route; the plugin exposes them
	// under a resource name after shaping.
	boards: z.array(BoardSchema),
	total: z
		.number()
		.nullish()
		.describe('Rows matching the filters, across pages.'),
	limit: z.number().nullish(),
	offset: z.number().nullish(),
	size: z.number().nullish().describe('Rows in this page.'),
	links: LinksSchema.nullish(),
});

export type BoardsListResponse = z.infer<typeof BoardsListResponseSchema>;

const BoardsGetInputSchema = z.object({ boardId: BoardId });

export type BoardsGetInput = z.input<typeof BoardsGetInputSchema>;

const BoardsCreateInputSchema = z.object({
	name: z
		.string()
		.min(1)
		.max(60)
		.optional()
		.describe('Board name, up to 60 characters.'),
	description: z
		.string()
		.max(300)
		.optional()
		.describe('Board description, up to 300 characters.'),
	teamId: z.string().min(1).optional().describe('The team to create it in.'),
	projectId: z.string().min(1).optional(),
	policy: BoardPolicySchema.optional().describe(
		'Sharing and permission settings.',
	),
});

export type BoardsCreateInput = z.input<typeof BoardsCreateInputSchema>;

const BoardsUpdateInputSchema = z
	.object({
		boardId: BoardId,
		name: z.string().min(1).max(60).optional(),
		description: z.string().max(300).optional(),
		policy: BoardPolicySchema.optional(),
	})
	.superRefine((value, ctx) => {
		// A PATCH with nothing to change is a round trip that cannot help.
		if (
			value.name === undefined &&
			value.description === undefined &&
			value.policy === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['name'],
				message: 'Pass at least one of name, description or policy.',
			});
		}
	});

export type BoardsUpdateInput = z.input<typeof BoardsUpdateInputSchema>;

const BoardsRemoveInputSchema = z.object({ boardId: BoardId });

export type BoardsRemoveInput = z.input<typeof BoardsRemoveInputSchema>;

const BoardsCopyInputSchema = z.object({
	boardId: BoardId.describe('The board to copy.'),
	name: z.string().min(1).max(60).optional().describe('Name for the copy.'),
	description: z.string().max(300).optional(),
	teamId: z.string().min(1).optional().describe('Team to put the copy in.'),
	projectId: z.string().min(1).optional(),
});

export type BoardsCopyInput = z.input<typeof BoardsCopyInputSchema>;

// ── board members ───────────────────────────────────────────────────────────

export const MIRO_BOARD_MEMBER_ROLES = [
	'viewer',
	'commenter',
	'editor',
	'coowner',
	'owner',
] as const;

const BoardMemberSchema = z
	.object({
		id: z.string(),
		role: z.string().nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		// A live member row carries no email or timestamps; they stay typed but
		// optional so a plan that sends them still parses.
		email: z.string().nullish(),
		createdAt: z.string().nullish(),
		modifiedAt: z.string().nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

export type MiroBoardMember = z.infer<typeof BoardMemberSchema>;

const MembersListInputSchema = z.object({
	boardId: BoardId,
	// Members page by offset, unlike items and tags which use a cursor.
	...OffsetPagingSchema,
});

export type MembersListInput = z.input<typeof MembersListInputSchema>;

const MembersListResponseSchema = z.object({
	members: z.array(BoardMemberSchema),
	total: z.number().nullish().describe('Members across all pages.'),
	size: z.number().nullish(),
	limit: z.number().nullish(),
	offset: z.number().nullish(),
	links: LinksSchema.nullish(),
});

export type MembersListResponse = z.infer<typeof MembersListResponseSchema>;

const MembersShareInputSchema = z.object({
	boardId: BoardId,
	emails: z
		.array(z.email())
		.min(1)
		.max(20)
		.describe('Email addresses to invite to the board, up to 20 per call.'),
	role: z
		.enum(MIRO_BOARD_MEMBER_ROLES)
		.optional()
		.describe(
			'The role they get. Defaults to `commenter`; `owner` is treated as `coowner`.',
		),
	message: z.string().optional().describe('Note included in the invitation.'),
});

export type MembersShareInput = z.input<typeof MembersShareInputSchema>;

const MembersShareResponseSchema = z
	.object({
		successful: z
			.array(z.union([z.string(), z.number()]))
			.nullish()
			.describe(
				'Ids of the invitations that were sent, one per address that worked.',
			),
		failed: z
			.array(
				z
					.object({
						email: z.string().nullish(),
						reason: z.string().nullish(),
					})
					.loose(),
			)
			.nullish()
			.describe('The addresses that could not be invited, each with a reason.'),
	})
	.loose();

export type MembersShareResponse = z.infer<typeof MembersShareResponseSchema>;

const MembersGetInputSchema = z.object({
	boardId: BoardId,
	memberId: z.string().min(1).describe('The board member id, not a user id.'),
});

export type MembersGetInput = z.input<typeof MembersGetInputSchema>;

const MembersUpdateInputSchema = z.object({
	boardId: BoardId,
	memberId: z.string().min(1),
	role: z.enum(MIRO_BOARD_MEMBER_ROLES).describe('The new role.'),
});

export type MembersUpdateInput = z.input<typeof MembersUpdateInputSchema>;

const MembersRemoveInputSchema = z.object({
	boardId: BoardId,
	memberId: z.string().min(1),
});

export type MembersRemoveInput = z.input<typeof MembersRemoveInputSchema>;

// ── items, shared ───────────────────────────────────────────────────────────

/**
 * The `type` values the items route filters on. Connectors are not items:
 * they have their own routes and `connectors.list`.
 */
export const MIRO_ITEM_TYPES = [
	'app_card',
	'card',
	'data_table_format',
	'doc_format',
	'document',
	'embed',
	'frame',
	'image',
	'preview',
	'shape',
	'sticky_note',
	'text',
] as const;

const ItemBaseSchema = z
	.object({
		id: z.string(),
		type: z
			.string()
			.nullish()
			.describe('The item kind, such as `sticky_note`.'),
		createdAt: z.string().nullish(),
		// Objects, not ids, on a live response; verified against a real board.
		createdBy: ReferenceSchema.nullish(),
		modifiedAt: z.string().nullish(),
		modifiedBy: ReferenceSchema.nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

/** Every item carries a position and a geometry; only some carry data. */
const ItemPositionSchema = z
	.object({
		x: z.number().nullish(),
		y: z.number().nullish(),
		origin: z.string().nullish(),
		relativeTo: z.string().nullish(),
	})
	.loose();

const ItemGeometrySchema = z
	.object({
		width: z.number().nullish(),
		height: z.number().nullish(),
		rotation: z.number().nullish(),
	})
	.loose();

const ItemsListInputSchema = z
	.object({
		boardId: BoardId,
		type: z
			.array(z.enum(MIRO_ITEM_TYPES))
			.min(1)
			.optional()
			.describe(
				'Only this item kind. Miro filters on one type per call, so pass a single value.',
			),
		parentItemId: z
			.string()
			.min(1)
			.optional()
			.describe('Only items inside this frame or parent item.'),
		...CursorPagingSchema,
	})
	.superRefine((value, ctx) => {
		// The API accepts a single `type`, so a list would silently narrow to
		// the first one.
		if (value.type !== undefined && value.type.length > 1) {
			ctx.addIssue({
				code: 'custom',
				path: ['type'],
				message: 'Miro filters on one item type per call; pass a single value.',
			});
		}
	});

export type ItemsListInput = z.input<typeof ItemsListInputSchema>;

const ItemsListResponseSchema = z.object({
	items: z.array(
		ItemBaseSchema.extend({
			position: ItemPositionSchema.nullish(),
			geometry: ItemGeometrySchema.nullish(),
			// unknown: the spec types each item kind's `data` separately; reading
			// one kind's fields from a mixed page is not meaningful, so the raw
			// object is passed through.
			data: ItemDataSchema.nullish(),
			parent: z.object({ id: z.string().nullish() }).loose().nullish(),
		}),
	),
	cursor: z.string().nullish().describe('Pass as `cursor` for the next page.'),
	size: z.number().nullish(),
	limit: z.number().nullish(),
	links: LinksSchema.nullish(),
});

export type ItemsListResponse = z.infer<typeof ItemsListResponseSchema>;

const ItemsGetInputSchema = z.object({
	boardId: BoardId,
	itemId: z.string().min(1),
});

export type ItemsGetInput = z.input<typeof ItemsGetInputSchema>;

const ItemsRemoveInputSchema = z.object({
	boardId: BoardId,
	itemId: z.string().min(1),
});

export type ItemsRemoveInput = z.input<typeof ItemsRemoveInputSchema>;

// ── sticky notes ────────────────────────────────────────────────────────────

export const MIRO_STICKY_SHAPES = ['square', 'rectangle'] as const;
export const MIRO_STICKY_COLORS = [
	'gray',
	'light_yellow',
	'yellow',
	'orange',
	'light_green',
	'green',
	'dark_green',
	'cyan',
	'light_pink',
	'pink',
	'violet',
	'red',
	'light_blue',
	'blue',
	'dark_blue',
	'black',
] as const;

/** A returned sticky style: plain strings, so a new colour still parses. */
const StickyNoteStyleSchema = z
	.object({
		fillColor: z
			.string()
			.nullish()
			.describe('Sticky colour, such as `light_yellow`.'),
		textAlign: z.string().nullish(),
		textAlignVertical: z.string().nullish(),
	})
	.loose();

const FlatStickyNoteSchema = ItemBaseSchema.extend({
	data: z
		.object({
			content: z.string().nullish(),
			shape: z.string().nullish(),
		})
		.loose()
		.nullish(),
	style: StickyNoteStyleSchema.nullish(),
	position: ItemPositionSchema.nullish(),
	geometry: ItemGeometrySchema.nullish(),
	parent: z.object({ id: z.string().nullish() }).loose().nullish(),
});

const StickyNoteSchema = z.object({ item: FlatStickyNoteSchema });

export type MiroStickyNote = z.infer<typeof StickyNoteSchema>;

const StickyNotesCreateInputSchema = z.object({
	boardId: BoardId,
	content: z.string().optional().describe('The note text.'),
	shape: z.enum(MIRO_STICKY_SHAPES).optional(),
	fillColor: z.enum(MIRO_STICKY_COLORS).optional(),
	position: PositionSchema.optional(),
	geometry: GeometrySchema.optional(),
	parentId: z
		.string()
		.min(1)
		.optional()
		.describe('Frame or parent item to place it inside.'),
});

export type StickyNotesCreateInput = z.input<
	typeof StickyNotesCreateInputSchema
>;

const StickyNotesUpdateInputSchema = z
	.object({
		boardId: BoardId,
		itemId: z.string().min(1),
		content: z.string().optional(),
		shape: z.enum(MIRO_STICKY_SHAPES).optional(),
		fillColor: z.enum(MIRO_STICKY_COLORS).optional(),
		position: PositionSchema.optional(),
		geometry: GeometrySchema.optional(),
	})
	.superRefine((value, ctx) => {
		if (
			!anySet(
				value.content,
				value.shape,
				value.fillColor,
				value.position,
				value.geometry,
			)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['content'],
				message: 'Pass at least one field to change.',
			});
		}
	});

export type StickyNotesUpdateInput = z.input<
	typeof StickyNotesUpdateInputSchema
>;

// ── shapes ──────────────────────────────────────────────────────────────────

/**
 * The style a caller may set on a shape. Sizes and opacities are numbers here
 * and are sent as strings, which is how Miro types them.
 */
const ShapeStyleSchema = z
	.object({
		fillColor: z.string().optional(),
		fillOpacity: z.number().min(0).max(1).optional(),
		borderColor: z.string().optional(),
		borderWidth: z.number().optional(),
		borderStyle: z.enum(['normal', 'dashed', 'dotted']).optional(),
		borderOpacity: z.number().min(0).max(1).optional(),
		fontSize: z.number().optional(),
		fontFamily: z.string().optional(),
		textAlign: z.enum(['left', 'center', 'right']).optional(),
		textAlignVertical: z.enum(['top', 'middle', 'bottom']).optional(),
		color: z.string().optional().describe('Text colour.'),
	})
	.loose();

/** A returned shape style: strings throughout, see StyleNumberSchema. */
const ShapeStyleOutputSchema = z
	.object({
		fillColor: z.string().nullish(),
		fillOpacity: StyleNumberSchema,
		borderColor: z.string().nullish(),
		borderWidth: StyleNumberSchema,
		borderStyle: z.string().nullish(),
		borderOpacity: StyleNumberSchema,
		fontSize: StyleNumberSchema,
		fontFamily: z.string().nullish(),
		textAlign: z.string().nullish(),
		textAlignVertical: z.string().nullish(),
		color: z.string().nullish().describe('Text colour.'),
	})
	.loose();

const FlatShapeSchema = ItemBaseSchema.extend({
	data: z
		.object({
			shape: z.string().nullish(),
			content: z.string().nullish(),
		})
		.loose()
		.nullish(),
	style: ShapeStyleOutputSchema.nullish(),
	position: ItemPositionSchema.nullish(),
	geometry: ItemGeometrySchema.nullish(),
	parent: z.object({ id: z.string().nullish() }).loose().nullish(),
});

const ShapeSchema = z.object({ item: FlatShapeSchema });

export type MiroShape = z.infer<typeof ShapeSchema>;

/**
 * The shape names `POST /v2/boards/{board_id}/shapes` documents, followed by
 * six `flow_chart_*` names it does not. Miro documents those six only for its
 * experimental flowchart route, which this plugin does not call; they stay
 * accepted here because they were in the first version of this list, and Miro
 * answers 400 for one it refuses.
 */
export const MIRO_SHAPES = [
	'rectangle',
	'round_rectangle',
	'circle',
	'triangle',
	'rhombus',
	'parallelogram',
	'trapezoid',
	'pentagon',
	'hexagon',
	'octagon',
	'wedge_round_rectangle_callout',
	'star',
	'flow_chart_predefined_process',
	'cloud',
	'cross',
	'can',
	'right_arrow',
	'left_arrow',
	'left_right_arrow',
	'left_brace',
	'right_brace',
	'flow_chart_connector',
	'flow_chart_process',
	'flow_chart_decision',
	'flow_chart_input_output',
	'flow_chart_internal_storage',
	'flow_chart_cloud',
] as const;

const ShapesCreateInputSchema = z.object({
	boardId: BoardId,
	shape: z
		.enum(MIRO_SHAPES)
		.optional()
		.describe('The shape to draw. Defaults to `rectangle`.'),
	content: z.string().optional().describe('Text inside the shape.'),
	style: ShapeStyleSchema.optional(),
	position: PositionSchema.optional(),
	geometry: GeometrySchema.optional(),
	parentId: z.string().min(1).optional(),
});

export type ShapesCreateInput = z.input<typeof ShapesCreateInputSchema>;

const ShapesUpdateInputSchema = z
	.object({
		boardId: BoardId,
		itemId: z.string().min(1),
		content: z.string().optional(),
		style: ShapeStyleSchema.optional(),
		position: PositionSchema.optional(),
		geometry: GeometrySchema.optional(),
	})
	.superRefine((value, ctx) => {
		if (!anySet(value.content, value.style, value.position, value.geometry)) {
			ctx.addIssue({
				code: 'custom',
				path: ['content'],
				message: 'Pass at least one field to change.',
			});
		}
	});

export type ShapesUpdateInput = z.input<typeof ShapesUpdateInputSchema>;

// ── cards ───────────────────────────────────────────────────────────────────

const CardSchema = z.object({
	item: ItemBaseSchema.extend({
		data: z
			.object({
				title: z.string().nullish(),
				description: z.string().nullish(),
				dueDate: z.string().nullish(),
				assigneeId: z.string().nullish(),
			})
			.loose()
			.nullish(),
		style: z.object({ cardTheme: z.string().nullish() }).loose().nullish(),
		position: ItemPositionSchema.nullish(),
		geometry: ItemGeometrySchema.nullish(),
		parent: z.object({ id: z.string().nullish() }).loose().nullish(),
	}),
});

export type MiroCard = z.infer<typeof CardSchema>;

const CardsCreateInputSchema = z.object({
	boardId: BoardId,
	title: z.string().optional().describe('Card title.'),
	description: z.string().optional(),
	dueDate: z
		.string()
		.optional()
		.describe('ISO 8601 due date, such as 2026-12-01T00:00:00Z.'),
	assigneeId: z.string().min(1).optional().describe('User id of the assignee.'),
	cardTheme: z.string().optional().describe('Card colour theme.'),
	position: PositionSchema.optional(),
	geometry: GeometrySchema.optional(),
	parentId: z.string().min(1).optional(),
});

export type CardsCreateInput = z.input<typeof CardsCreateInputSchema>;

const CardsUpdateInputSchema = z
	.object({
		boardId: BoardId,
		itemId: z.string().min(1),
		title: z.string().optional(),
		description: z.string().optional(),
		dueDate: z.string().optional(),
		assigneeId: z.string().min(1).optional(),
		position: PositionSchema.optional(),
		geometry: GeometrySchema.optional(),
		cardTheme: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		if (
			!anySet(
				value.title,
				value.description,
				value.dueDate,
				value.assigneeId,
				value.position,
				value.geometry,
				value.cardTheme,
			)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['title'],
				message: 'Pass at least one field to change.',
			});
		}
	});

export type CardsUpdateInput = z.input<typeof CardsUpdateInputSchema>;

// ── text ────────────────────────────────────────────────────────────────────

const TextStyleSchema = z
	.object({
		color: z.string().optional(),
		fontSize: z.number().optional(),
		fontFamily: z.string().optional(),
		textAlign: z.enum(['left', 'center', 'right']).optional(),
	})
	.loose();

/** A returned text style: strings throughout, see StyleNumberSchema. */
const TextStyleOutputSchema = z
	.object({
		color: z.string().nullish(),
		fillColor: z.string().nullish(),
		fillOpacity: StyleNumberSchema,
		fontSize: StyleNumberSchema,
		fontFamily: z.string().nullish(),
		textAlign: z.string().nullish(),
	})
	.loose();

const FlatTextSchema = ItemBaseSchema.extend({
	data: z.object({ content: z.string().nullish() }).loose().nullish(),
	style: TextStyleOutputSchema.nullish(),
	position: ItemPositionSchema.nullish(),
	geometry: ItemGeometrySchema.nullish(),
	parent: z.object({ id: z.string().nullish() }).loose().nullish(),
});

const TextSchema = z.object({ item: FlatTextSchema });

export type MiroTextItem = z.infer<typeof TextSchema>;

const TextsCreateInputSchema = z.object({
	boardId: BoardId,
	content: z.string().describe('The text.'),
	style: TextStyleSchema.optional(),
	position: PositionSchema.optional(),
	geometry: GeometrySchema.optional(),
	parentId: z.string().min(1).optional(),
});

export type TextsCreateInput = z.input<typeof TextsCreateInputSchema>;

const TextsUpdateInputSchema = z
	.object({
		boardId: BoardId,
		itemId: z.string().min(1),
		content: z.string().optional(),
		style: TextStyleSchema.optional(),
		position: PositionSchema.optional(),
		geometry: GeometrySchema.optional(),
	})
	.superRefine((value, ctx) => {
		if (!anySet(value.content, value.style, value.position, value.geometry)) {
			ctx.addIssue({
				code: 'custom',
				path: ['content'],
				message: 'Pass at least one field to change.',
			});
		}
	});

export type TextsUpdateInput = z.input<typeof TextsUpdateInputSchema>;

// ── frames ──────────────────────────────────────────────────────────────────

const FlatFrameSchema = ItemBaseSchema.extend({
	data: z
		.object({
			title: z.string().nullish(),
			type: z.string().nullish(),
			format: z.string().nullish(),
			showContent: z.boolean().nullish(),
		})
		.loose()
		.nullish(),
	style: z.object({ fillColor: z.string().nullish() }).loose().nullish(),
	position: ItemPositionSchema.nullish(),
	geometry: ItemGeometrySchema.nullish(),
});

const FrameSchema = z.object({ item: FlatFrameSchema });

export type MiroFrame = z.infer<typeof FrameSchema>;

const FramesCreateInputSchema = z.object({
	boardId: BoardId,
	title: z.string().optional().describe('Frame title, shown as its label.'),
	position: PositionSchema.optional(),
	geometry: GeometrySchema.optional().describe(
		'Frames need width and height; rotation is not allowed.',
	),
	showContent: z.boolean().optional(),
});

export type FramesCreateInput = z.input<typeof FramesCreateInputSchema>;

const FramesUpdateInputSchema = z
	.object({
		boardId: BoardId,
		itemId: z.string().min(1),
		title: z.string().optional(),
		position: PositionSchema.optional(),
		geometry: GeometrySchema.optional(),
		showContent: z.boolean().optional(),
	})
	.superRefine((value, ctx) => {
		if (
			!anySet(value.title, value.position, value.geometry, value.showContent)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['title'],
				message: 'Pass at least one field to change.',
			});
		}
	});

export type FramesUpdateInput = z.input<typeof FramesUpdateInputSchema>;

// ── embeds ──────────────────────────────────────────────────────────────────

const FlatEmbedSchema = ItemBaseSchema.extend({
	data: z
		.object({
			url: z.string().nullish(),
			mode: z.string().nullish(),
			previewUrl: z.string().nullish(),
		})
		.loose()
		.nullish(),
	position: ItemPositionSchema.nullish(),
	geometry: ItemGeometrySchema.nullish(),
	parent: z.object({ id: z.string().nullish() }).loose().nullish(),
});

const EmbedSchema = z.object({ item: FlatEmbedSchema });

export type MiroEmbed = z.infer<typeof EmbedSchema>;

const EmbedsCreateInputSchema = z.object({
	boardId: BoardId,
	url: z.url().describe('The page or media URL to embed.'),
	mode: z
		.enum(['inline', 'modal'])
		.optional()
		.describe('Defaults to `inline`.'),
	position: PositionSchema.optional(),
	geometry: GeometrySchema.optional(),
	parentId: z.string().min(1).optional(),
});

export type EmbedsCreateInput = z.input<typeof EmbedsCreateInputSchema>;

const EmbedsUpdateInputSchema = z
	.object({
		boardId: BoardId,
		itemId: z.string().min(1),
		url: z.url().optional(),
		mode: z.enum(['inline', 'modal']).optional(),
		position: PositionSchema.optional(),
		geometry: GeometrySchema.optional(),
	})
	.superRefine((value, ctx) => {
		if (!anySet(value.url, value.mode, value.position, value.geometry)) {
			ctx.addIssue({
				code: 'custom',
				path: ['url'],
				message: 'Pass at least one field to change.',
			});
		}
	});

export type EmbedsUpdateInput = z.input<typeof EmbedsUpdateInputSchema>;

// ── connectors ──────────────────────────────────────────────────────────────

/**
 * The spec's `ConnectorCreationData.shape` lists `straight`, `elbowed` and
 * `curved`, while the live reference also accepts `elbow`. Both spellings are
 * allowed here so a valid call is not rejected.
 */
export const MIRO_CONNECTOR_SHAPES = [
	'straight',
	'elbowed',
	'elbow',
	'curved',
] as const;

const ConnectorEndpointInputSchema = z.object({
	id: ItemId.describe('The item the connector attaches to.'),
	snapTo: z
		.enum(['auto', 'top', 'right', 'bottom', 'left'])
		.optional()
		.describe('Which side of the item it meets. Defaults to `auto`.'),
	position: z
		.object({ x: z.number(), y: z.number() })
		.optional()
		.describe('A point inside the item, as a 0-1 fraction of its size.'),
});

const ConnectorEndpointSchema = z
	.object({
		id: z.string().nullish(),
		links: LinksSchema.nullish(),
	})
	.loose();

/**
 * A connector label. Miro sends and expects each one as an object, with the
 * text under `content`, in both directions.
 */
const CaptionSchema = z
	.object({
		content: z.string().nullish().describe('The label text.'),
		position: z
			.string()
			.nullish()
			.describe('Where it sits along the line, as a percentage such as `50%`.'),
		textAlignVertical: z.string().nullish(),
	})
	.loose();

/** Up to 20 labels of up to 200 characters each, which is what Miro allows. */
const CaptionsInputSchema = z.array(z.string().max(200)).max(20);

const FlatConnectorSchema = ItemBaseSchema.extend({
	startItem: ConnectorEndpointSchema.nullish(),
	endItem: ConnectorEndpointSchema.nullish(),
	shape: z.string().nullish(),
	style: z
		.object({
			strokeColor: z.string().nullish(),
			strokeWidth: z.string().nullish(),
			strokeStyle: z.string().nullish(),
			startStrokeCap: z.string().nullish(),
			endStrokeCap: z.string().nullish(),
		})
		.loose()
		.nullish(),
	captions: z.array(CaptionSchema).nullish(),
});

/** Every item route wraps the resource in `{ item }`. */
const ConnectorSchema = z.object({ item: FlatConnectorSchema });

export type MiroConnector = z.infer<typeof ConnectorSchema>;

const ConnectorsListInputSchema = z.object({
	boardId: BoardId,
	...CursorPagingSchema,
});

export type ConnectorsListInput = z.input<typeof ConnectorsListInputSchema>;

const ConnectorsListResponseSchema = z.object({
	// The connectors list returns flat connectors, unlike the item routes.
	connectors: z.array(FlatConnectorSchema),
	cursor: z.string().nullish(),
	size: z.number().nullish(),
	limit: z.number().nullish(),
	links: LinksSchema.nullish(),
});

export type ConnectorsListResponse = z.infer<
	typeof ConnectorsListResponseSchema
>;

const ConnectorsCreateInputSchema = z.object({
	boardId: BoardId,
	startItemId: ItemId.describe('The item the connector starts from.'),
	endItemId: ItemId.describe('The item the connector points at.'),
	shape: z
		.enum(MIRO_CONNECTOR_SHAPES)
		.optional()
		.describe('The route the line takes. Defaults to `curved`.'),
	strokeColor: z.string().optional().describe('Line colour, such as #4262ff.'),
	strokeWidth: z.string().optional(),
	strokeStyle: z.enum(['normal', 'dotted', 'dashed']).optional(),
	startStrokeCap: z
		.enum([
			'none',
			'stealth',
			'rounded_stealth',
			'arrow',
			'triangle',
			'filled_triangle',
		])
		.optional(),
	endStrokeCap: z
		.enum([
			'none',
			'stealth',
			'rounded_stealth',
			'arrow',
			'triangle',
			'filled_triangle',
		])
		.optional(),
	captions: CaptionsInputSchema.optional().describe(
		'Labels shown along the line: up to 20, each up to 200 characters.',
	),
});

export type ConnectorsCreateInput = z.input<typeof ConnectorsCreateInputSchema>;

const ConnectorsGetInputSchema = z.object({
	boardId: BoardId,
	connectorId: z.string().min(1),
});

export type ConnectorsGetInput = z.input<typeof ConnectorsGetInputSchema>;

const ConnectorsUpdateInputSchema = z
	.object({
		boardId: BoardId,
		connectorId: z.string().min(1),
		shape: z.enum(MIRO_CONNECTOR_SHAPES).optional(),
		strokeColor: z.string().optional(),
		strokeWidth: z.string().optional(),
		strokeStyle: z.enum(['normal', 'dotted', 'dashed']).optional(),
		captions: CaptionsInputSchema.optional().describe(
			'Replaces the labels; pass an empty list to remove them.',
		),
	})
	.superRefine((value, ctx) => {
		if (
			!anySet(
				value.shape,
				value.strokeColor,
				value.strokeWidth,
				value.strokeStyle,
				value.captions,
			)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['shape'],
				message: 'Pass at least one field to change.',
			});
		}
	});

export type ConnectorsUpdateInput = z.input<typeof ConnectorsUpdateInputSchema>;

const ConnectorsRemoveInputSchema = z.object({
	boardId: BoardId,
	connectorId: z.string().min(1),
});

export type ConnectorsRemoveInput = z.input<typeof ConnectorsRemoveInputSchema>;

// ── tags ────────────────────────────────────────────────────────────────────

export const MIRO_TAG_COLORS = [
	'red',
	'light_green',
	'cyan',
	'yellow',
	'magenta',
	'green',
	'blue',
	'gray',
	'violet',
	'dark_green',
	'dark_blue',
	'black',
] as const;

const FlatTagSchema = ItemBaseSchema.extend({
	title: z.string().nullish(),
	fillColor: z.string().nullish(),
});

const TagSchema = z.object({ item: FlatTagSchema });

export type MiroTag = z.infer<typeof TagSchema>;

const TagsListInputSchema = z.object({
	boardId: BoardId,
	// Tags page by offset, like boards and members.
	...OffsetPagingSchema,
});

export type TagsListInput = z.input<typeof TagsListInputSchema>;

const TagsListResponseSchema = z.object({
	// The tags list returns flat tags, unlike the item routes.
	tags: z.array(FlatTagSchema),
	total: z.number().nullish(),
	size: z.number().nullish(),
	limit: z.number().nullish(),
	offset: z.number().nullish(),
	links: LinksSchema.nullish(),
});

export type TagsListResponse = z.infer<typeof TagsListResponseSchema>;

const TagsCreateInputSchema = z.object({
	boardId: BoardId,
	title: z.string().min(1).max(120).describe('Tag text, up to 120 characters.'),
	fillColor: z
		.enum(MIRO_TAG_COLORS)
		.optional()
		.describe('Tag colour. Defaults to `red`.'),
});

export type TagsCreateInput = z.input<typeof TagsCreateInputSchema>;

const TagsGetInputSchema = z.object({
	boardId: BoardId,
	tagId: z.string().min(1),
});

export type TagsGetInput = z.input<typeof TagsGetInputSchema>;

const TagsUpdateInputSchema = z
	.object({
		boardId: BoardId,
		tagId: z.string().min(1),
		title: z.string().min(1).max(120).optional(),
		fillColor: z.enum(MIRO_TAG_COLORS).optional(),
	})
	.superRefine((value, ctx) => {
		if (value.title === undefined && value.fillColor === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['title'],
				message: 'Pass at least one of title or fillColor.',
			});
		}
	});

export type TagsUpdateInput = z.input<typeof TagsUpdateInputSchema>;

const TagsRemoveInputSchema = z.object({
	boardId: BoardId,
	tagId: z.string().min(1),
});

export type TagsRemoveInput = z.input<typeof TagsRemoveInputSchema>;

const TagsAttachInputSchema = z.object({
	boardId: BoardId,
	itemId: z.string().min(1),
	tagId: z.string().min(1).describe('The tag to attach to the item.'),
});

export type TagsAttachInput = z.input<typeof TagsAttachInputSchema>;

const TagsRemoveFromItemInputSchema = z.object({
	boardId: BoardId,
	itemId: z.string().min(1),
	tagId: z.string().min(1),
});

export type TagsRemoveFromItemInput = z.input<
	typeof TagsRemoveFromItemInputSchema
>;

const TagsOfItemInputSchema = z.object({
	boardId: BoardId,
	itemId: z.string().min(1),
});

export type TagsOfItemInput = z.input<typeof TagsOfItemInputSchema>;

const TagsOfItemResponseSchema = z.object({
	// This route also returns flat tags.
	tags: z.array(FlatTagSchema),
	size: z.number().nullish(),
	limit: z.number().nullish(),
	links: LinksSchema.nullish(),
});

export type TagsOfItemResponse = z.infer<typeof TagsOfItemResponseSchema>;

const ItemsByTagInputSchema = z.object({
	boardId: BoardId,
	tagId: z.string().min(1),
	limit: z.number().int().min(1).max(50).optional(),
	offset: z.number().int().min(0).optional(),
});

export type ItemsByTagInput = z.input<typeof ItemsByTagInputSchema>;

const ItemsByTagResponseSchema = z.object({
	items: z.array(
		ItemBaseSchema.extend({
			position: ItemPositionSchema.nullish(),
			geometry: ItemGeometrySchema.nullish(),
			data: ItemDataSchema.nullish(),
		}),
	),
	total: z.number().nullish(),
	size: z.number().nullish(),
	limit: z.number().nullish(),
	offset: z.number().nullish(),
	links: LinksSchema.nullish(),
});

export type ItemsByTagResponse = z.infer<typeof ItemsByTagResponseSchema>;

/**
 * What `items.get` can return: any one item kind, each wrapped in `{ item }`.
 *
 * Defined from the schemas so the declared type and the parser cannot drift;
 * an earlier hand-written union left out cards, texts, frames and embeds and
 * claimed the payload was unwrapped.
 */
const ItemUnionSchema = z.union([
	ConnectorSchema,
	StickyNoteSchema,
	ShapeSchema,
	CardSchema,
	TextSchema,
	FrameSchema,
	EmbedSchema,
]);

export type MiroAnyItem = z.infer<typeof ItemUnionSchema>;

// ── Registry ────────────────────────────────────────────────────────────────

export type MiroEndpointInputs = {
	boardsList: z.input<typeof BoardsListInputSchema>;
	boardsCreate: z.input<typeof BoardsCreateInputSchema>;
	boardsGet: z.input<typeof BoardsGetInputSchema>;
	boardsUpdate: z.input<typeof BoardsUpdateInputSchema>;
	boardsRemove: z.input<typeof BoardsRemoveInputSchema>;
	boardsCopy: z.input<typeof BoardsCopyInputSchema>;
	membersList: z.input<typeof MembersListInputSchema>;
	membersShare: z.input<typeof MembersShareInputSchema>;
	membersGet: z.input<typeof MembersGetInputSchema>;
	membersUpdate: z.input<typeof MembersUpdateInputSchema>;
	membersRemove: z.input<typeof MembersRemoveInputSchema>;
	itemsList: z.input<typeof ItemsListInputSchema>;
	itemsGet: z.input<typeof ItemsGetInputSchema>;
	itemsRemove: z.input<typeof ItemsRemoveInputSchema>;
	stickyNotesCreate: z.input<typeof StickyNotesCreateInputSchema>;
	stickyNotesUpdate: z.input<typeof StickyNotesUpdateInputSchema>;
	shapesCreate: z.input<typeof ShapesCreateInputSchema>;
	shapesUpdate: z.input<typeof ShapesUpdateInputSchema>;
	cardsCreate: z.input<typeof CardsCreateInputSchema>;
	cardsUpdate: z.input<typeof CardsUpdateInputSchema>;
	textsCreate: z.input<typeof TextsCreateInputSchema>;
	textsUpdate: z.input<typeof TextsUpdateInputSchema>;
	framesCreate: z.input<typeof FramesCreateInputSchema>;
	framesUpdate: z.input<typeof FramesUpdateInputSchema>;
	embedsCreate: z.input<typeof EmbedsCreateInputSchema>;
	embedsUpdate: z.input<typeof EmbedsUpdateInputSchema>;
	connectorsList: z.input<typeof ConnectorsListInputSchema>;
	connectorsCreate: z.input<typeof ConnectorsCreateInputSchema>;
	connectorsGet: z.input<typeof ConnectorsGetInputSchema>;
	connectorsUpdate: z.input<typeof ConnectorsUpdateInputSchema>;
	connectorsRemove: z.input<typeof ConnectorsRemoveInputSchema>;
	tagsList: z.input<typeof TagsListInputSchema>;
	tagsCreate: z.input<typeof TagsCreateInputSchema>;
	tagsGet: z.input<typeof TagsGetInputSchema>;
	tagsUpdate: z.input<typeof TagsUpdateInputSchema>;
	tagsRemove: z.input<typeof TagsRemoveInputSchema>;
	tagsAttach: z.input<typeof TagsAttachInputSchema>;
	tagsRemoveFromItem: z.input<typeof TagsRemoveFromItemInputSchema>;
	tagsOfItem: z.input<typeof TagsOfItemInputSchema>;
	itemsByTag: z.input<typeof ItemsByTagInputSchema>;
};

export type MiroEndpointOutputs = {
	boardsList: BoardsListResponse;
	boardsCreate: MiroBoard;
	boardsGet: MiroBoard;
	boardsUpdate: MiroBoard;
	boardsRemove: { success: boolean };
	boardsCopy: MiroBoard;
	membersList: MembersListResponse;
	membersShare: MembersShareResponse;
	membersGet: MiroBoardMember;
	membersUpdate: MiroBoardMember;
	membersRemove: { success: boolean };
	itemsList: ItemsListResponse;
	itemsGet: MiroAnyItem;
	itemsRemove: { success: boolean };
	stickyNotesCreate: MiroStickyNote;
	stickyNotesUpdate: MiroStickyNote;
	shapesCreate: MiroShape;
	shapesUpdate: MiroShape;
	cardsCreate: MiroCard;
	cardsUpdate: MiroCard;
	textsCreate: MiroTextItem;
	textsUpdate: MiroTextItem;
	framesCreate: MiroFrame;
	framesUpdate: MiroFrame;
	embedsCreate: MiroEmbed;
	embedsUpdate: MiroEmbed;
	connectorsList: ConnectorsListResponse;
	connectorsCreate: MiroConnector;
	connectorsGet: MiroConnector;
	connectorsUpdate: MiroConnector;
	connectorsRemove: { success: boolean };
	tagsList: TagsListResponse;
	tagsCreate: MiroTag;
	tagsGet: MiroTag;
	tagsUpdate: MiroTag;
	tagsRemove: { success: boolean };
	tagsAttach: { success: boolean };
	tagsRemoveFromItem: { success: boolean };
	tagsOfItem: TagsOfItemResponse;
	itemsByTag: ItemsByTagResponse;
};

export const MiroEndpointInputSchemas = {
	boardsList: BoardsListInputSchema,
	boardsCreate: BoardsCreateInputSchema,
	boardsGet: BoardsGetInputSchema,
	boardsUpdate: BoardsUpdateInputSchema,
	boardsRemove: BoardsRemoveInputSchema,
	boardsCopy: BoardsCopyInputSchema,
	membersList: MembersListInputSchema,
	membersShare: MembersShareInputSchema,
	membersGet: MembersGetInputSchema,
	membersUpdate: MembersUpdateInputSchema,
	membersRemove: MembersRemoveInputSchema,
	itemsList: ItemsListInputSchema,
	itemsGet: ItemsGetInputSchema,
	itemsRemove: ItemsRemoveInputSchema,
	stickyNotesCreate: StickyNotesCreateInputSchema,
	stickyNotesUpdate: StickyNotesUpdateInputSchema,
	shapesCreate: ShapesCreateInputSchema,
	shapesUpdate: ShapesUpdateInputSchema,
	cardsCreate: CardsCreateInputSchema,
	cardsUpdate: CardsUpdateInputSchema,
	textsCreate: TextsCreateInputSchema,
	textsUpdate: TextsUpdateInputSchema,
	framesCreate: FramesCreateInputSchema,
	framesUpdate: FramesUpdateInputSchema,
	embedsCreate: EmbedsCreateInputSchema,
	embedsUpdate: EmbedsUpdateInputSchema,
	connectorsList: ConnectorsListInputSchema,
	connectorsCreate: ConnectorsCreateInputSchema,
	connectorsGet: ConnectorsGetInputSchema,
	connectorsUpdate: ConnectorsUpdateInputSchema,
	connectorsRemove: ConnectorsRemoveInputSchema,
	tagsList: TagsListInputSchema,
	tagsCreate: TagsCreateInputSchema,
	tagsGet: TagsGetInputSchema,
	tagsUpdate: TagsUpdateInputSchema,
	tagsRemove: TagsRemoveInputSchema,
	tagsAttach: TagsAttachInputSchema,
	tagsRemoveFromItem: TagsRemoveFromItemInputSchema,
	tagsOfItem: TagsOfItemInputSchema,
	itemsByTag: ItemsByTagInputSchema,
} as const;

const ItemOrDeletedSchema = z.object({ success: z.boolean() });

export const MiroEndpointOutputSchemas = {
	boardsList: BoardsListResponseSchema,
	boardsCreate: BoardSchema,
	boardsGet: BoardSchema,
	boardsUpdate: BoardSchema,
	boardsRemove: ItemOrDeletedSchema,
	boardsCopy: BoardSchema,
	membersList: MembersListResponseSchema,
	membersShare: MembersShareResponseSchema,
	membersGet: BoardMemberSchema,
	membersUpdate: BoardMemberSchema,
	membersRemove: ItemOrDeletedSchema,
	itemsList: ItemsListResponseSchema,
	itemsGet: ItemUnionSchema,
	itemsRemove: ItemOrDeletedSchema,
	stickyNotesCreate: StickyNoteSchema,
	stickyNotesUpdate: StickyNoteSchema,
	shapesCreate: ShapeSchema,
	shapesUpdate: ShapeSchema,
	cardsCreate: CardSchema,
	cardsUpdate: CardSchema,
	textsCreate: TextSchema,
	textsUpdate: TextSchema,
	framesCreate: FrameSchema,
	framesUpdate: FrameSchema,
	embedsCreate: EmbedSchema,
	embedsUpdate: EmbedSchema,
	connectorsList: ConnectorsListResponseSchema,
	connectorsCreate: ConnectorSchema,
	connectorsGet: ConnectorSchema,
	connectorsUpdate: ConnectorSchema,
	connectorsRemove: ItemOrDeletedSchema,
	tagsList: TagsListResponseSchema,
	tagsCreate: TagSchema,
	tagsGet: TagSchema,
	tagsUpdate: TagSchema,
	tagsRemove: ItemOrDeletedSchema,
	tagsAttach: ItemOrDeletedSchema,
	tagsRemoveFromItem: ItemOrDeletedSchema,
	tagsOfItem: TagsOfItemResponseSchema,
	itemsByTag: ItemsByTagResponseSchema,
} as const;
