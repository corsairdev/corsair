import { z } from 'zod';

// Knack stores each table as an "object" and exposes its columns as `field_1`,
// `field_2`, and so on, with a parallel `<key>_raw` value holding the typed
// form. The plugin cannot know what a caller's fields mean, so records pass
// those keys through rather than declaring them.

/**
 * Knack accepts any `field_N` key, so the record is an open record of unknown
 * values. `id` is the one field it always returns.
 */
// unknown: one field's value depends on that field's type in the caller's app
// (text, number, date, connection, attachment), which the plugin cannot know.
export const KnackRecordSchema = z
	.object({
		id: z.string(),
		// unknown: every other key is a `field_N` or `field_N_raw` value whose
		// type belongs to the caller's Knack app, not to this plugin.
	})
	.catchall(z.unknown());

export type KnackRecord = z.infer<typeof KnackRecordSchema>;

/**
 * A record as `records.get` returns it. Knack answers 200 with an empty
 * list for an id that does not exist, so this schema also describes the
 * "not found" answer and the endpoint raises on it.
 */
export const KnackRecordListSchema = z
	.object({
		total_pages: z.number().nullish(),
		current_page: z.number().nullish(),
		total_records: z.number().nullish(),
		records: z.array(KnackRecordSchema),
	})
	.loose();

const OBJECT_KEY_PATTERN = /^object_\d+$/;

const ObjectKeySchema = z
	.string()
	.regex(
		OBJECT_KEY_PATTERN,
		'An object key looks like `object_1`, from the table URL in the Builder.',
	)
	.describe('The table key, e.g. `object_3`.');

/**
 * A Knack record id is a 24-character lowercase hex string. Sending anything
 * else draws `400 {"errors":["Malformed Record ID."]}` from the live API, so
 * the check belongs here rather than in a round trip.
 */
const RecordIdSchema = z
	.string()
	.regex(/^[a-f0-9]{24}$/, 'A Knack record id is 24 lowercase hex characters.')
	.describe('The record id, from `records.list`.');

/**
 * A value Knack accepts for a field. Knack coerces a number or boolean to the
 * field's own type (a number sent to a short-text field is stored as `"123"`),
 * a connection or multiple-choice field takes an array of strings, and name,
 * email, address, link and date fields take an object (`{ first, last }`,
 * `{ url }`, `{ street, city }`, `{ date, hours }`). The plugin cannot narrow
 * this further without knowing the caller's field types.
 */
export type KnackFieldValue =
	| string
	| number
	| boolean
	| readonly string[]
	| Record<string, unknown>;

/**
 * Knack passes `field_N` names and their values through to the API, so a write
 * body is an open map keyed by field name.
 */
export const KnackFieldsSchema = z
	.record(
		z.string(),
		z.union([
			z.string(),
			z.number(),
			z.boolean(),
			z.array(z.string()),
			// unknown: a compound field's parts depend on its type in the caller's
			// app (name, email, address, link, date), which Knack validates.
			z.record(z.string(), z.unknown()),
		]),
	)
	.describe(
		'Field values keyed by Knack field name, e.g. `{ field_23: "Acme" }`. A connection field takes an array of record ids; name, email, address, link and date fields take an object such as `{ first: "Ada", last: "Lovelace" }` or `{ url: "https://example.com" }`. Read-only mirrors such as `field_23_raw` are not accepted.',
	);

// ── applications.get ──────────────────────────────────────────────────────

export const KnackApplicationsGetInputSchema = z.object({});

export type KnackApplicationsGetInput = z.input<
	typeof KnackApplicationsGetInputSchema
>;

const KnackObjectFieldSchema = z
	.object({
		key: z.string(),
		name: z.string(),
		type: z.string(),
		required: z.boolean().nullish(),
		unique: z.boolean().nullish(),
	})
	.loose();

const KnackObjectSchema = z
	.object({
		key: z.string(),
		name: z.string(),
		type: z.string().nullish(),
		user: z.boolean().nullish(),
		fields: z.array(KnackObjectFieldSchema).nullish(),
	})
	.loose();

export type KnackObject = z.infer<typeof KnackObjectSchema>;

export const KnackApplicationsGetResponseSchema = z
	.object({
		application: z
			.object({
				id: z.string().nullish(),
				name: z.string().nullish(),
				slug: z.string().nullish(),
				description: z.string().nullish(),
				counts: z.record(z.string(), z.number()).nullish(),
				objects: z.array(KnackObjectSchema).nullish(),
			})
			.loose(),
	})
	.loose();

export type KnackApplicationsGetResponse = z.infer<
	typeof KnackApplicationsGetResponseSchema
>;

// ── objects.list ──────────────────────────────────────────────────────────

export const KnackObjectsListInputSchema = z.object({});

export type KnackObjectsListInput = z.input<typeof KnackObjectsListInputSchema>;

export const KnackObjectsListResponseSchema = z
	.object({
		objects: z.array(
			z
				.object({
					key: z.string(),
					name: z.string(),
				})
				.loose(),
		),
	})
	.loose();

export type KnackObjectsListResponse = z.infer<
	typeof KnackObjectsListResponseSchema
>;

// ── objects.get ───────────────────────────────────────────────────────────

export const KnackObjectsGetInputSchema = z.object({
	object_key: ObjectKeySchema,
});

export type KnackObjectsGetInput = z.input<typeof KnackObjectsGetInputSchema>;

/**
 * An object key that is not in the app answers `200 {}`, so `object` is
 * optional here and the endpoint raises when it is missing rather than
 * returning a blank object as though the table existed.
 */
export const KnackObjectsGetResponseSchema = z
	.object({
		object: KnackObjectSchema.optional(),
	})
	.loose();

export type KnackObjectsGetResponse = z.infer<
	typeof KnackObjectsGetResponseSchema
>;

// ── records.list ──────────────────────────────────────────────────────────

/**
 * The filter operators Knack lists in its "Filters & Field Types" reference
 * that take a plain value. Numbers compare with `higher than` / `lower than`;
 * there is no `is greater than`. The relative date operators (`is during the
 * previous` and the like) also need `range` and `type`, so they are left out.
 */
export const KNACK_FILTER_OPERATORS = [
	'is',
	'is not',
	'contains',
	'does not contain',
	'starts with',
	'ends with',
	'is blank',
	'is not blank',
	'is any',
	'higher than',
	'lower than',
	'is before',
	'is after',
	'is today',
	'is today or before',
	'is today or after',
	'is before today',
	'is after today',
	'is before current time',
	'is after current time',
] as const;

export const KnackFilterSchema = z.object({
	field: z
		.string()
		.regex(/^field_\d+$/, 'A field key looks like `field_23`.')
		.describe('The field to filter on, e.g. `field_23`.'),
	operator: z.enum(KNACK_FILTER_OPERATORS),
	value: z
		.string()
		.optional()
		.describe(
			'The value to compare against, sent as text (a number too). Not needed for `is blank`, `is not blank` or the `is today` family.',
		),
});

export type KnackFilter = z.infer<typeof KnackFilterSchema>;

export const KnackRecordsListInputSchema = z.object({
	object_key: ObjectKeySchema,
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Defaults to the first page.'),
	rows_per_page: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe(
			'How many records to return per page: 25 by default, 1000 at most.',
		),
	sort_field: z
		.string()
		.regex(/^field_\d+$/, 'A field key looks like `field_23`.')
		.optional()
		.describe('The field to sort by, e.g. `field_23`.'),
	sort_order: z
		.enum(['asc', 'desc'])
		.optional()
		.describe('Used only with `sort_field`.'),
	filters: z
		.array(KnackFilterSchema)
		.optional()
		.describe('Conditions a record must meet. All of them must match.'),
});

export type KnackRecordsListInput = z.input<typeof KnackRecordsListInputSchema>;

export const KnackRecordsListResponseSchema = KnackRecordListSchema.extend({
	// A page past the end reports `total_pages: 0` with an empty list rather
	// than an error, so the caller sees the real counts.
	total_pages: z.number(),
	current_page: z.number(),
	total_records: z.number(),
});

export type KnackRecordsListResponse = z.infer<
	typeof KnackRecordsListResponseSchema
>;

// ── records.get ───────────────────────────────────────────────────────────

export const KnackRecordsGetInputSchema = z.object({
	object_key: ObjectKeySchema,
	record_id: RecordIdSchema,
});

export type KnackRecordsGetInput = z.input<typeof KnackRecordsGetInputSchema>;

export const KnackRecordsGetResponseSchema = KnackRecordSchema;

export type KnackRecordsGetResponse = KnackRecord;

// ── records.create ────────────────────────────────────────────────────────

const READ_ONLY_FIELD_PATTERN = /(_raw$|_html$)/;
const FIELD_KEY_PATTERN = /^field_\d+$/;

/**
 * The write body is a flat map of `field_N` to value. Two checks, in order:
 * a `_raw` or `_html` mirror gets its own message because it is a real key that
 * is read-only, and anything else that is not `field_N` is a typo or a column
 * label, which Knack would accept silently and ignore.
 */
export const KnackRecordWriteFieldsSchema = KnackFieldsSchema.refine(
	(fields) => Object.keys(fields).length > 0,
	'Give at least one field to write. Knack answers 200 and creates an empty record when sent an empty body, which is almost never what a caller meant.',
).superRefine((fields, ctx) => {
	for (const key of Object.keys(fields)) {
		if (READ_ONLY_FIELD_PATTERN.test(key)) {
			ctx.addIssue({
				code: 'custom',
				path: [key],
				message:
					'`_raw` and `_html` values are read-only mirrors; send the plain field key instead.',
			});
			continue;
		}
		if (!FIELD_KEY_PATTERN.test(key)) {
			ctx.addIssue({
				code: 'custom',
				path: [key],
				message: `"${key}" is not a Knack field key. Use the field_N key from \`objects.get\`, not the column label.`,
			});
		}
	}
});

export const KnackRecordsCreateInputSchema = z.object({
	object_key: ObjectKeySchema,
	fields: KnackRecordWriteFieldsSchema,
});

export type KnackRecordsCreateInput = z.input<
	typeof KnackRecordsCreateInputSchema
>;

export const KnackRecordsCreateResponseSchema = KnackRecordSchema;

export type KnackRecordsCreateResponse = KnackRecord;

// ── records.update ────────────────────────────────────────────────────────

export const KnackRecordsUpdateInputSchema = z.object({
	object_key: ObjectKeySchema,
	record_id: RecordIdSchema,
	fields: KnackRecordWriteFieldsSchema,
});

export type KnackRecordsUpdateInput = z.input<
	typeof KnackRecordsUpdateInputSchema
>;

export const KnackRecordsUpdateResponseSchema = KnackRecordSchema;

export type KnackRecordsUpdateResponse = KnackRecord;

// ── records.delete ────────────────────────────────────────────────────────

export const KnackRecordsDeleteInputSchema = z.object({
	object_key: ObjectKeySchema,
	record_id: RecordIdSchema,
});

export type KnackRecordsDeleteInput = z.input<
	typeof KnackRecordsDeleteInputSchema
>;

/**
 * Knack answers `{"delete": true}`. A body missing the flag is not success, so
 * the schema requires it rather than treating any 200 as a deletion.
 */
export const KnackRecordsDeleteResponseSchema = z
	.object({
		delete: z.literal(true).describe('True when Knack removed the record.'),
	})
	.loose();

export type KnackRecordsDeleteResponse = z.infer<
	typeof KnackRecordsDeleteResponseSchema
>;

// ── registry ──────────────────────────────────────────────────────────────

export const KnackEndpointInputSchemas = {
	applicationsGet: KnackApplicationsGetInputSchema,
	objectsList: KnackObjectsListInputSchema,
	objectsGet: KnackObjectsGetInputSchema,
	recordsList: KnackRecordsListInputSchema,
	recordsGet: KnackRecordsGetInputSchema,
	recordsCreate: KnackRecordsCreateInputSchema,
	recordsUpdate: KnackRecordsUpdateInputSchema,
	recordsDelete: KnackRecordsDeleteInputSchema,
} as const;

export const KnackEndpointOutputSchemas = {
	applicationsGet: KnackApplicationsGetResponseSchema,
	objectsList: KnackObjectsListResponseSchema,
	objectsGet: KnackObjectsGetResponseSchema,
	recordsList: KnackRecordsListResponseSchema,
	recordsGet: KnackRecordsGetResponseSchema,
	recordsCreate: KnackRecordsCreateResponseSchema,
	recordsUpdate: KnackRecordsUpdateResponseSchema,
	recordsDelete: KnackRecordsDeleteResponseSchema,
} as const;

export type KnackEndpointInputs = {
	applicationsGet: KnackApplicationsGetInput;
	objectsList: KnackObjectsListInput;
	objectsGet: KnackObjectsGetInput;
	recordsList: KnackRecordsListInput;
	recordsGet: KnackRecordsGetInput;
	recordsCreate: KnackRecordsCreateInput;
	recordsUpdate: KnackRecordsUpdateInput;
	recordsDelete: KnackRecordsDeleteInput;
};

export type KnackEndpointOutputs = {
	applicationsGet: KnackApplicationsGetResponse;
	objectsList: KnackObjectsListResponse;
	objectsGet: KnackObjectsGetResponse;
	recordsList: KnackRecordsListResponse;
	recordsGet: KnackRecordsGetResponse;
	recordsCreate: KnackRecordsCreateResponse;
	recordsUpdate: KnackRecordsUpdateResponse;
	recordsDelete: KnackRecordsDeleteResponse;
};
