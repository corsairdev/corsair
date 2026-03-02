import { z } from 'zod';

// ============================================================================
// Common Types
// ============================================================================

// Rich text structure used in blocks and properties
const RichTextSchema = z.object({
	type: z.string(),
	text: z.object({
		content: z.string(),
		link: z.object({ url: z.string() }).nullable().optional(),
	}).optional(),
	annotations: z.object({
		bold: z.boolean().optional(),
		italic: z.boolean().optional(),
		strikethrough: z.boolean().optional(),
		underline: z.boolean().optional(),
		code: z.boolean().optional(),
		color: z.string().optional(),
	}).optional(),
	plain_text: z.string().optional(),
	href: z.string().nullable().optional(),
});

// User reference structure
const UserReferenceSchema = z.object({
	object: z.literal('user'),
	id: z.string(),
});

// Parent structure - can be workspace, page, database, or block
const ParentSchema = z.union([
	z.object({
		type: z.literal('workspace'),
		workspace: z.boolean(),
	}),
	z.object({
		type: z.literal('page_id'),
		page_id: z.string(),
	}),
	z.object({
		type: z.literal('database_id'),
		database_id: z.string(),
	}),
	z.object({
		type: z.literal('block_id'),
		block_id: z.string(),
	}),
]);

// Block structure - base structure for all block types
// NOTE: Block types vary significantly (paragraph, heading, list, etc.) and each has
// different properties. We use passthrough() to allow additional properties while
// maintaining type safety for common fields.
const BlockSchema = z.object({
	object: z.literal('block'),
	id: z.string(),
	type: z.string(), // paragraph, heading_1, heading_2, heading_3, bulleted_list_item, etc.
	created_time: z.string().optional(),
	created_by: UserReferenceSchema.optional(),
	last_edited_time: z.string().optional(),
	last_edited_by: UserReferenceSchema.optional(),
	archived: z.boolean().optional(),
	has_children: z.boolean().optional(),
	parent: ParentSchema.optional(),
}).passthrough();

// ============================================================================
// Input Schemas
// ============================================================================

const BlocksAppendBlockInputSchema = z.object({
	block_id: z.string(),
	// NOTE: Children are typed as unknown because Notion supports many block types
	// (paragraph, heading, list, table, etc.) each with different structures.
	// The exact structure depends on the block type being created.
	children: z.array(BlockSchema),
});

const BlocksGetManyChildBlocksInputSchema = z.object({
	block_id: z.string(),
	start_cursor: z.string().optional(),
	page_size: z.number().optional(),
});

const DatabasesGetDatabaseInputSchema = z.object({
	database_id: z.string(),
});

const DatabasesGetManyDatabasesInputSchema = z.object({
	start_cursor: z.string().optional(),
	page_size: z.number().optional(),
});

const DatabasesSearchDatabaseInputSchema = z.object({
	query: z.string().optional(),
	// NOTE: Sort structure varies by use case and can include property-based sorting,
	// timestamp sorting, etc. The exact structure depends on the database schema.
	sort: z.unknown().optional(),
	// NOTE: Filter structure is highly dynamic and depends on the database properties.
	// Filters can be property-based, compound, or use various operators (equals, contains, etc.).
	filter: z.unknown().optional(),
	start_cursor: z.string().optional(),
	page_size: z.number().optional(),
});

const DatabasePagesCreateDatabasePageInputSchema = z.object({
	database_id: z.string(),
	// NOTE: Properties are typed as unknown because they are dynamic and depend on the
	// database schema. Each database can have different property types (title, rich_text,
	// number, select, multi_select, date, etc.) with different structures.
	properties: z.record(z.unknown()),
});

const DatabasePagesGetDatabasePageInputSchema = z.object({
	page_id: z.string(),
});

const DatabasePagesGetManyDatabasePagesInputSchema = z.object({
	database_id: z.string(),
	// NOTE: Filter structure is dynamic and depends on database properties.
	// Can include property filters, compound filters, and various operators.
	filter: z.unknown().optional(),
	// NOTE: Sorts array contains sort objects that vary by property type.
	// Each sort can be ascending/descending and property-based.
	sorts: z.array(z.unknown()).optional(),
	start_cursor: z.string().optional(),
	page_size: z.number().optional(),
});

const DatabasePagesUpdateDatabasePageInputSchema = z.object({
	page_id: z.string(),
	// NOTE: Properties are typed as unknown because they are dynamic and depend on the
	// database schema. Each property type has a different update structure.
	properties: z.record(z.unknown()).optional(),
	archived: z.boolean().optional(),
});

const PagesArchivePageInputSchema = z.object({
	page_id: z.string(),
});

const PagesCreatePageInputSchema = z.object({
	// NOTE: Parent can be page_id, database_id, or workspace, each with different structures.
	// Using union type for type safety.
	parent: z.union([
		z.object({ type: z.literal('page_id'), page_id: z.string() }),
		z.object({ type: z.literal('database_id'), database_id: z.string() }),
		z.object({ type: z.literal('workspace'), workspace: z.boolean() }),
	]),
	// NOTE: Properties are typed as unknown because they vary by parent type.
	// Database pages have schema-based properties, while regular pages have title/rich_text.
	properties: z.record(z.unknown()).optional(),
	// NOTE: Children are blocks that can be of various types (paragraph, heading, etc.).
	children: z.array(BlockSchema).optional(),
});

const PagesSearchPageInputSchema = z.object({
	query: z.string().optional(),
	// NOTE: Sort structure varies and can include property-based or timestamp sorting.
	sort: z.unknown().optional(),
	// NOTE: Filter structure is dynamic and can filter by object type, property values, etc.
	filter: z.unknown().optional(),
	start_cursor: z.string().optional(),
	page_size: z.number().optional(),
});

const UsersGetUserInputSchema = z.object({
	user_id: z.string(),
});

const UsersGetManyUsersInputSchema = z.object({
	start_cursor: z.string().optional(),
	page_size: z.number().optional(),
});

export type BlocksAppendBlockInput = z.infer<
	typeof BlocksAppendBlockInputSchema
>;
export type BlocksGetManyChildBlocksInput = z.infer<
	typeof BlocksGetManyChildBlocksInputSchema
>;
export type DatabasesGetDatabaseInput = z.infer<
	typeof DatabasesGetDatabaseInputSchema
>;
export type DatabasesGetManyDatabasesInput = z.infer<
	typeof DatabasesGetManyDatabasesInputSchema
>;
export type DatabasesSearchDatabaseInput = z.infer<
	typeof DatabasesSearchDatabaseInputSchema
>;
export type DatabasePagesCreateDatabasePageInput = z.infer<
	typeof DatabasePagesCreateDatabasePageInputSchema
>;
export type DatabasePagesGetDatabasePageInput = z.infer<
	typeof DatabasePagesGetDatabasePageInputSchema
>;
export type DatabasePagesGetManyDatabasePagesInput = z.infer<
	typeof DatabasePagesGetManyDatabasePagesInputSchema
>;
export type DatabasePagesUpdateDatabasePageInput = z.infer<
	typeof DatabasePagesUpdateDatabasePageInputSchema
>;
export type PagesArchivePageInput = z.infer<typeof PagesArchivePageInputSchema>;
export type PagesCreatePageInput = z.infer<typeof PagesCreatePageInputSchema>;
export type PagesSearchPageInput = z.infer<typeof PagesSearchPageInputSchema>;
export type UsersGetUserInput = z.infer<typeof UsersGetUserInputSchema>;
export type UsersGetManyUsersInput = z.infer<
	typeof UsersGetManyUsersInputSchema
>;

// ============================================================================
// Response Types
// ============================================================================

// Base list response structure used by most endpoints
const ListResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
	z.object({
		object: z.literal('list'),
		results: z.array(itemSchema),
		next_cursor: z.string().nullable(),
		has_more: z.boolean(),
		type: z.string().optional(),
		page_or_database: z.record(z.unknown()).optional(),
		request_id: z.string().optional(),
	});

// Page structure
const PageSchema = z.object({
	object: z.literal('page'),
	id: z.string(),
	created_time: z.string(),
	created_by: UserReferenceSchema.optional(),
	last_edited_time: z.string(),
	last_edited_by: UserReferenceSchema.optional(),
	cover: z
		.object({
			type: z.string(),
			external: z.object({ url: z.string() }).optional(),
			file: z.object({ url: z.string() }).optional(),
		})
		.nullable()
		.optional(),
	icon: z
		.object({
			type: z.string(),
			external: z.object({ url: z.string() }).optional(),
			emoji: z.string().optional(),
		})
		.nullable()
		.optional(),
	parent: ParentSchema,
	archived: z.boolean(),
	in_trash: z.boolean().optional(),
	is_locked: z.boolean().optional(),
	// NOTE: Properties are typed as unknown because they vary by page type.
	// Database pages have schema-based properties, regular pages have title/rich_text.
	properties: z.record(z.unknown()),
	url: z.string(),
	public_url: z.string().nullable().optional(),
}).passthrough();

// Database structure
const DatabaseSchema = z.object({
	object: z.literal('database'),
	id: z.string(),
	cover: z
		.object({
			type: z.string(),
			external: z.object({ url: z.string() }).optional(),
		})
		.nullable()
		.optional(),
	icon: z
		.object({
			type: z.string(),
			external: z.object({ url: z.string() }).optional(),
			emoji: z.string().optional(),
		})
		.nullable()
		.optional(),
	created_time: z.string(),
	created_by: UserReferenceSchema.optional(),
	last_edited_time: z.string(),
	last_edited_by: UserReferenceSchema.optional(),
	title: z.array(RichTextSchema),
	description: z.array(RichTextSchema),
	is_inline: z.boolean(),
	// NOTE: Properties are typed as unknown because each database has a unique schema
	// with different property types (title, rich_text, number, select, date, etc.).
	properties: z.record(z.unknown()),
	parent: ParentSchema,
	url: z.string(),
	public_url: z.string().nullable().optional(),
	archived: z.boolean(),
	in_trash: z.boolean().optional(),
}).passthrough();

// User structure
const UserSchema = z.object({
	object: z.literal('user'),
	id: z.string(),
	type: z.enum(['person', 'bot']),
	name: z.string().nullable().optional(),
	avatar_url: z.string().nullable().optional(),
	// NOTE: Bot users have additional fields like owner, workspace_name, etc.
	// Using passthrough to allow these dynamic fields.
}).passthrough();

// Response type definitions
export type BlocksAppendBlockResponse = z.infer<
	ReturnType<typeof ListResponseSchema<typeof BlockSchema>>
>;

export type BlocksGetManyChildBlocksResponse = z.infer<
	ReturnType<typeof ListResponseSchema<typeof BlockSchema>>
>;

export type DatabasesGetDatabaseResponse = z.infer<typeof DatabaseSchema>;

export type DatabasesGetManyDatabasesResponse = z.infer<
	ReturnType<typeof ListResponseSchema<typeof DatabaseSchema>>
>;

export type DatabasesSearchDatabaseResponse = z.infer<
	ReturnType<typeof ListResponseSchema<typeof DatabaseSchema>>
>;

export type DatabasePagesCreateDatabasePageResponse = z.infer<typeof PageSchema>;

export type DatabasePagesGetDatabasePageResponse = z.infer<typeof PageSchema>;

export type DatabasePagesGetManyDatabasePagesResponse = z.infer<
	ReturnType<typeof ListResponseSchema<typeof PageSchema>>
>;

export type DatabasePagesUpdateDatabasePageResponse = z.infer<typeof PageSchema>;

export type PagesArchivePageResponse = z.infer<typeof PageSchema>;

export type PagesCreatePageResponse = z.infer<typeof PageSchema>;

const PageOrDatabaseSchema = z.union([PageSchema, DatabaseSchema]);
export type PagesSearchPageResponse = z.infer<
	ReturnType<typeof ListResponseSchema<typeof PageOrDatabaseSchema>>
>;

export type UsersGetUserResponse = z.infer<typeof UserSchema>;

export type UsersGetManyUsersResponse = z.infer<
	ReturnType<typeof ListResponseSchema<typeof UserSchema>>
>;

export type NotionEndpointInputs = {
	blocksAppendBlock: BlocksAppendBlockInput;
	blocksGetManyChildBlocks: BlocksGetManyChildBlocksInput;
	databasesGetDatabase: DatabasesGetDatabaseInput;
	databasesGetManyDatabases: DatabasesGetManyDatabasesInput;
	databasesSearchDatabase: DatabasesSearchDatabaseInput;
	databasePagesCreateDatabasePage: DatabasePagesCreateDatabasePageInput;
	databasePagesGetDatabasePage: DatabasePagesGetDatabasePageInput;
	databasePagesGetManyDatabasePages: DatabasePagesGetManyDatabasePagesInput;
	databasePagesUpdateDatabasePage: DatabasePagesUpdateDatabasePageInput;
	pagesArchivePage: PagesArchivePageInput;
	pagesCreatePage: PagesCreatePageInput;
	pagesSearchPage: PagesSearchPageInput;
	usersGetUser: UsersGetUserInput;
	usersGetManyUsers: UsersGetManyUsersInput;
};

export type NotionEndpointOutputs = {
	blocksAppendBlock: BlocksAppendBlockResponse;
	blocksGetManyChildBlocks: BlocksGetManyChildBlocksResponse;
	databasesGetDatabase: DatabasesGetDatabaseResponse;
	databasesGetManyDatabases: DatabasesGetManyDatabasesResponse;
	databasesSearchDatabase: DatabasesSearchDatabaseResponse;
	databasePagesCreateDatabasePage: DatabasePagesCreateDatabasePageResponse;
	databasePagesGetDatabasePage: DatabasePagesGetDatabasePageResponse;
	databasePagesGetManyDatabasePages: DatabasePagesGetManyDatabasePagesResponse;
	databasePagesUpdateDatabasePage: DatabasePagesUpdateDatabasePageResponse;
	pagesArchivePage: PagesArchivePageResponse;
	pagesCreatePage: PagesCreatePageResponse;
	pagesSearchPage: PagesSearchPageResponse;
	usersGetUser: UsersGetUserResponse;
	usersGetManyUsers: UsersGetManyUsersResponse;
};

export const NotionEndpointInputSchemas = {
	blocksAppendBlock: BlocksAppendBlockInputSchema,
	blocksGetManyChildBlocks: BlocksGetManyChildBlocksInputSchema,
	databasesGetDatabase: DatabasesGetDatabaseInputSchema,
	databasesGetManyDatabases: DatabasesGetManyDatabasesInputSchema,
	databasesSearchDatabase: DatabasesSearchDatabaseInputSchema,
	databasePagesCreateDatabasePage: DatabasePagesCreateDatabasePageInputSchema,
	databasePagesGetDatabasePage: DatabasePagesGetDatabasePageInputSchema,
	databasePagesGetManyDatabasePages: DatabasePagesGetManyDatabasePagesInputSchema,
	databasePagesUpdateDatabasePage: DatabasePagesUpdateDatabasePageInputSchema,
	pagesArchivePage: PagesArchivePageInputSchema,
	pagesCreatePage: PagesCreatePageInputSchema,
	pagesSearchPage: PagesSearchPageInputSchema,
	usersGetUser: UsersGetUserInputSchema,
	usersGetManyUsers: UsersGetManyUsersInputSchema,
} as const;

export const NotionEndpointOutputSchemas = {
	blocksAppendBlock: ListResponseSchema(BlockSchema),
	blocksGetManyChildBlocks: ListResponseSchema(BlockSchema),
	databasesGetDatabase: DatabaseSchema,
	databasesGetManyDatabases: ListResponseSchema(DatabaseSchema),
	databasesSearchDatabase: ListResponseSchema(DatabaseSchema),
	databasePagesCreateDatabasePage: PageSchema,
	databasePagesGetDatabasePage: PageSchema,
	databasePagesGetManyDatabasePages: ListResponseSchema(PageSchema),
	databasePagesUpdateDatabasePage: PageSchema,
	pagesArchivePage: PageSchema,
	pagesCreatePage: PageSchema,
	pagesSearchPage: ListResponseSchema(PageOrDatabaseSchema),
	usersGetUser: UserSchema,
	usersGetManyUsers: ListResponseSchema(UserSchema),
} as const;
