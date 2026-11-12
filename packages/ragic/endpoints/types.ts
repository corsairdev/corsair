import { z } from 'zod';

// Inputs use Ragic's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field Ragic adds or omits cannot fail a call
// that has already happened. Shapes come from
// https://www.ragic.com/intl/en/doc-http-api and its OpenAPI document.
//
// Two things worth knowing before reading the models:
//
// - A record set is an object keyed by row id, not an array: `{"0": {...}, "1":
//    {...}}`. Each row carries `_ragicId`, and its other keys are field names or
//   field IDs depending on `naming`.
// - A form's values are whatever the caller's schema holds, so a field's value is
//   a JSON value: a string, a number, a boolean, an array for a multi-select, or a
//   nested object for a subtable.

/**
 * A JSON value. Used for a record's field values, which are defined by the
 * caller's Ragic form rather than by this API, so they are described as JSON
 * rather than as `unknown`, which would reach the docs as `any`.
 */
export type RagicJsonValue =
	| string
	| number
	| boolean
	| null
	| RagicJsonValue[]
	| { [key: string]: RagicJsonValue };

const JsonValueSchema: z.ZodType<RagicJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

const JsonObjectSchema = z.record(z.string(), JsonValueSchema);

/** One record: field name or ID to value, plus the reserved keys. */
export const RecordSchema = JsonObjectSchema.describe(
	'A record: field name or ID to value, plus _ragicId and the other reserved keys.',
);

export type RagicRecord = z.infer<typeof RecordSchema>;

/**
 * A record set keyed by row id. The keys are stringified integers, and each row
 * repeats its own id in `_ragicId`.
 */
const RecordSetSchema = z
	.record(z.string(), RecordSchema)
	.describe('Records keyed by row id, each also carrying _ragicId.');

export type RagicRecordSet = z.infer<typeof RecordSetSchema>;

// ── shared sheet coordinates ──────────────────────────────────────────────

/**
 * Every route needs the account, the folder path and the sheet index, because the
 * URL is `https://{server}/{account}{path}/{sheetIndex}`. There is no way to
 * address a sheet without them, so they are required on every input.
 */
const SheetSchema = z.object({
	account: z
		.string()
		.min(1)
		.describe(
			'The account name from your Ragic URL, such as "demo" in www.ragic.com/demo/sales.',
		),
	path: z
		.string()
		.min(1)
		.refine(
			(value) => {
				const folders = value.split('/').filter((part) => part.length > 0);
				return (
					folders.length > 0 &&
					folders.every((part) => part !== '.' && part !== '..')
				);
			},
			{ message: 'A folder path such as /sales, without . or .. segments.' },
		)
		.describe(
			'The folder path from your URL, starting with a slash, such as /sales.',
		),
	sheetIndex: z
		.number()
		.int()
		.describe(
			'The sheet number from your URL, the number after the folder path.',
		),
});

/** The three parts of a `where` filter. */
const FilterSchema = z.object({
	fieldId: z
		.union([z.number().int(), z.string().min(1)])
		.describe(
			'The field ID to filter on. The system fields have fixed ids: 105 create date, 106 entry manager, 108 create user, 109 last update date, 111 if locked, 112 if starred.',
		),
	op: z
		.enum(['eq', 'regex', 'gte', 'lte', 'gt', 'lt', 'like', 'eqeq'])
		.describe(
			'eq equals, regex regular expression, gte/lte/gt/lt compare, like contains, eqeq matches an internal record ID.',
		),
	value: z
		.union([z.string(), z.number()])
		.optional()
		.describe(
			'Omit it to match an empty field. A date needs yyyy/MM/dd or yyyy/MM/dd HH:mm:ss. Repeated eq, regex or like on one field is OR; a gte with an lte on one field is a range (AND).',
		),
});

export type RagicFilter = z.infer<typeof FilterSchema>;

// ── records.list ──────────────────────────────────────────────────────────

const RecordsListInputSchema = SheetSchema.extend({
	where: z
		.array(FilterSchema)
		.min(1)
		.optional()
		.describe(
			'Filter conditions. Several on the same field combine as the docs describe.',
		),
	fts: z.string().min(1).optional().describe('A full-text search term.'),
	filterId: z
		.number()
		.int()
		.optional()
		.describe('A saved Shared View id, as an alternative to building filters.'),
	limit: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe(
			'How many records to return. Defaults to 1,000; above that, set it explicitly.',
		),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('How many records to skip first.'),
	taskId: z
		.string()
		.min(1)
		.optional()
		.describe('Check a mass operation’s progress instead of listing records.'),
	order: z
		.object({
			fieldId: z.union([z.number().int(), z.string().min(1)]),
			direction: z.enum(['ASC', 'DESC']),
		})
		.optional()
		.describe('Sort by one field.'),
	reverse: z
		.boolean()
		.optional()
		.describe('Reverse the default creation-date ordering, newest first.'),
	naming: z
		.enum(['EID', 'FNAME'])
		.optional()
		.describe(
			'Name each field in the response by its ID (EID) or its name (FNAME, the default).',
		),
	subtables: z
		.boolean()
		.optional()
		.describe(
			'False omits subtable data, which makes the response much smaller.',
		),
	listing: z
		.boolean()
		.optional()
		.describe('True returns only the fields shown on the listing page.'),
	fetchDomainIds: z
		.array(z.union([z.number().int(), z.string()]))
		.min(1)
		.optional()
		.describe('Return only these field IDs.'),
	info: z
		.boolean()
		.optional()
		.describe('Add create date and create user to each record.'),
	comment: z
		.boolean()
		.optional()
		.describe('Add the comment thread to each record.'),
	history: z
		.boolean()
		.optional()
		.describe('Add the edit history to each record.'),
	conversation: z
		.boolean()
		.optional()
		.describe('Add the email conversation to each record.'),
	approval: z
		.boolean()
		.optional()
		.describe('Add the approval information to each record.'),
});

export type RecordsListInput = z.infer<typeof RecordsListInputSchema>;

/**
 * A record set, or a task-progress object when `taskId` was given. The two are
 * distinguished by `status`, which only the progress answer carries.
 */
const RecordsListResponseSchema = z
	.union([
		RecordSetSchema,
		z
			.object({
				status: z
					.string()
					.describe('RUNNING, COMPLETED or FAILED. Present only for a task.'),
				progress: z.number().nullish(),
				total: z.number().nullish(),
				message: z.string().nullish(),
			})
			.loose(),
	])
	.describe(
		'Records keyed by row id, or a task-progress object when taskId was given.',
	);

export type RecordsListResponse = z.infer<typeof RecordsListResponseSchema>;

// ── records.get ───────────────────────────────────────────────────────────

const RecordIdSchema = z
	.number()
	.int()
	.describe('The record id, which is the _ragicId value.');

const RecordsGetInputSchema = SheetSchema.extend({
	recordId: RecordIdSchema,
	naming: z.enum(['EID', 'FNAME']).optional(),
	subtables: z.boolean().optional(),
	info: z.boolean().optional(),
	comment: z.boolean().optional(),
	history: z.boolean().optional(),
	ignoreMask: z
		.boolean()
		.optional()
		.describe('Unmask masked text, when your groups allow it.'),
});

export type RecordsGetInput = z.infer<typeof RecordsGetInputSchema>;

/** Also a record set: Ragic wraps a single record in the same row-id map. */
const RecordsGetResponseSchema = RecordSetSchema;

export type RecordsGetResponse = z.infer<typeof RecordsGetResponseSchema>;

// ── records.create ────────────────────────────────────────────────────────

/**
 * The create and update parameters, which control what Ragic does around the save.
 * They are grouped so a caller can see them without reading the field values.
 */
const WriteOptionsShape = {
	doFormula: z
		.boolean()
		.optional()
		.describe('Recalculate every formula before saving.'),
	doDefaultValue: z
		.boolean()
		.optional()
		.describe('Load every default value before saving.'),
	doLinkLoad: z
		.union([z.boolean(), z.literal('first')])
		.optional()
		.describe(
			'Run link and load operations: true after the formula recalculation, "first" before it. Either way doFormula must also be set when a recalculation is needed.',
		),
	doWorkflow: z
		.boolean()
		.optional()
		.describe('False skips the workflow scripts, which otherwise run.'),
	doAIAgent: z
		.boolean()
		.optional()
		.describe('False skips the AI Agents, which otherwise run.'),
	notification: z
		.boolean()
		.optional()
		.describe('Defaults to true: the save sends notifications.'),
	doValidation: z
		.boolean()
		.optional()
		.describe(
			'Run the sheet’s field validation rules first. A failing field rejects the save.',
		),
	checkLock: z
		.boolean()
		.optional()
		.describe('Refuse the update when the record is locked.'),
} as const;

const RecordsCreateInputSchema = SheetSchema.extend({
	fields: JsonObjectSchema.describe(
		'Field ID to value. A multi-select takes an array; a date needs yyyy/MM/dd or yyyy/MM/dd HH:mm:ss; a subtable is `_subtable_<id>` keyed by a negative row id that groups a row’s values.',
	),
	...WriteOptionsShape,
});

export type RecordsCreateInput = z.infer<typeof RecordsCreateInputSchema>;

/**
 * The docs do not publish a write response. Live, a create and an update both
 * answer `{"status":"SUCCESS","msg":"&nbsp;","ragicId":2,"rv":"…","data":{…}}`,
 * where `data` is the saved record keyed by field ID.
 */
const WriteResponseSchema = z
	.object({
		status: z.string().nullish().describe('SUCCESS when the record was saved.'),
		msg: z.string().nullish(),
		ragicId: z.number().nullish().describe('The record id (_ragicId).'),
		// unknown: an internal revision marker Ragic returns without documenting it.
		rv: z.unknown().optional(),
		data: RecordSchema.nullish().describe(
			'The saved record, keyed by field ID, with its reserved keys.',
		),
	})
	.loose()
	.describe('The saved record, as Ragic returns it.');

export type WriteResponse = z.infer<typeof WriteResponseSchema>;

// ── records.update ────────────────────────────────────────────────────────

const RecordsUpdateInputSchema = RecordsCreateInputSchema.extend({
	recordId: RecordIdSchema,
});

export type RecordsUpdateInput = z.infer<typeof RecordsUpdateInputSchema>;

const RecordsUpdateResponseSchema = WriteResponseSchema;

export type RecordsUpdateResponse = z.infer<typeof RecordsUpdateResponseSchema>;

// ── records.delete ────────────────────────────────────────────────────────

const RecordsDeleteInputSchema = SheetSchema.extend({
	recordId: RecordIdSchema,
});

export type RecordsDeleteInput = z.infer<typeof RecordsDeleteInputSchema>;

/** Live: `{"msg":"The record has been moved to recycle bin.","ragicId":2}`. */
const RecordsDeleteResponseSchema = z
	.object({
		msg: z
			.string()
			.nullish()
			.describe('Says the record went to the recycle bin.'),
		ragicId: z.number().nullish().describe('The deleted record id.'),
		status: z.string().nullish(),
	})
	.loose();

export type RecordsDeleteResponse = z.infer<typeof RecordsDeleteResponseSchema>;

// ── records.comment ───────────────────────────────────────────────────────

const RecordsCommentInputSchema = SheetSchema.extend({
	recordId: RecordIdSchema,
	comment: z.string().min(1).describe('The comment text.'),
});

export type RecordsCommentInput = z.infer<typeof RecordsCommentInputSchema>;

/**
 * The comment just added, wrapped like a record set: keyed by the comment's row
 * id, with fixed field ids inside: 61 the formatted timestamp, 65 the commenter,
 * 66 the text, 67 the attachment filename, 73 the timestamp in milliseconds, plus
 * `_ragicId` and `_parentRagicId` (the record). Seen live; the reference shows the
 * inner object only.
 */
const RecordsCommentResponseSchema = RecordSetSchema.describe(
	'The comment just added, keyed by its row id: 61 time, 65 commenter, 66 text, 67 attachment, 73 time in ms.',
);

export type RecordsCommentResponse = z.infer<
	typeof RecordsCommentResponseSchema
>;

// ── records.lock / unlock ─────────────────────────────────────────────────

const RecordsLockInputSchema = SheetSchema.extend({
	recordId: RecordIdSchema,
});

export type RecordsLockInput = z.infer<typeof RecordsLockInputSchema>;

const RecordsLockResponseSchema = z
	.object({
		status: z.string().nullish().describe('SUCCESS on success.'),
		code: z.number().nullish(),
	})
	.loose();

export type RecordsLockResponse = z.infer<typeof RecordsLockResponseSchema>;

// ── schema.get ────────────────────────────────────────────────────────────

const SchemaGetInputSchema = SheetSchema;

export type SchemaGetInput = z.infer<typeof SchemaGetInputSchema>;

/**
 * A field's definition. `type` is Ragic's own type name, and
 * `selectionOptionsPreview` lists up to 50 options for a selection field.
 */
const FieldSchema = z
	.object({
		fieldId: z.union([z.number(), z.string()]).nullish(),
		fieldName: z.string().nullish(),
		type: z
			.string()
			.nullish()
			.describe("Ragic's field type, such as text, number, date or select."),
		required: z.boolean().nullish(),
		readOnly: z.boolean().nullish(),
		computed: z.boolean().nullish().describe('True when a formula fills it.'),
		hidden: z.boolean().nullish(),
		selectionOptionsPreview: z
			.array(z.string())
			.nullish()
			.describe('For a selection field, up to 50 of its options.'),
	})
	.loose();

const SubtableSchema = z
	.object({
		subtableKey: z
			.union([z.number(), z.string()])
			.nullish()
			.describe('The subtable id, a number in the reference response.'),
		fields: z.array(FieldSchema).nullish(),
	})
	.loose();

const SheetInfoSchema = z
	.object({
		sheetPath: z.string().nullish(),
		sheetIndex: z.union([z.number(), z.string()]).nullish(),
		sheetName: z.string().nullish(),
		keyFieldId: z
			.union([z.number(), z.string()])
			.nullish()
			.describe('The field that identifies each record on this sheet.'),
	})
	.loose();

const SchemaGetResponseSchema = z
	.object({
		sheet: SheetInfoSchema.nullish(),
		fields: z.array(FieldSchema).nullish(),
		subtables: z.array(SubtableSchema).nullish(),
	})
	.loose();

export type SchemaGetResponse = z.infer<typeof SchemaGetResponseSchema>;

// ── the maps ──────────────────────────────────────────────────────────────

export type RagicEndpointInputs = {
	recordsList: RecordsListInput;
	recordsGet: RecordsGetInput;
	recordsCreate: RecordsCreateInput;
	recordsUpdate: RecordsUpdateInput;
	recordsDelete: RecordsDeleteInput;
	recordsComment: RecordsCommentInput;
	recordsLock: RecordsLockInput;
	recordsUnlock: RecordsLockInput;
	schemaGet: SchemaGetInput;
};

export type RagicEndpointOutputs = {
	recordsList: RecordsListResponse;
	recordsGet: RecordsGetResponse;
	recordsCreate: WriteResponse;
	recordsUpdate: RecordsUpdateResponse;
	recordsDelete: RecordsDeleteResponse;
	recordsComment: RecordsCommentResponse;
	recordsLock: RecordsLockResponse;
	recordsUnlock: RecordsLockResponse;
	schemaGet: SchemaGetResponse;
};

export const RagicEndpointInputSchemas = {
	recordsList: RecordsListInputSchema,
	recordsGet: RecordsGetInputSchema,
	recordsCreate: RecordsCreateInputSchema,
	recordsUpdate: RecordsUpdateInputSchema,
	recordsDelete: RecordsDeleteInputSchema,
	recordsComment: RecordsCommentInputSchema,
	recordsLock: RecordsLockInputSchema,
	recordsUnlock: RecordsLockInputSchema,
	schemaGet: SchemaGetInputSchema,
} as const;

export const RagicEndpointOutputSchemas = {
	recordsList: RecordsListResponseSchema,
	recordsGet: RecordsGetResponseSchema,
	recordsCreate: WriteResponseSchema,
	recordsUpdate: RecordsUpdateResponseSchema,
	recordsDelete: RecordsDeleteResponseSchema,
	recordsComment: RecordsCommentResponseSchema,
	recordsLock: RecordsLockResponseSchema,
	recordsUnlock: RecordsLockResponseSchema,
	schemaGet: SchemaGetResponseSchema,
} as const;
