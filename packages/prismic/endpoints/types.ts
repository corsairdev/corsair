import { z } from 'zod';

// Prismic is a headless CMS. Its **Content API** reads published documents and
// its **Migration API** writes drafts, on two different hosts with different
// contracts, so the schemas below keep the two apart. Outputs are `.loose()`
// with documented fields nullish, so a field Prismic adds or omits cannot fail a
// call that has already happened.
// Reference: https://prismic.io/docs/migration-api-technical-reference

/**
 * Any JSON value. A document's `data` is shaped by the repository's custom types,
 * which the plugin cannot know, so it is described exactly rather than left
 * untyped.
 */
export type PrismicJsonValue =
	| string
	| number
	| boolean
	| null
	| PrismicJsonValue[]
	| { [key: string]: PrismicJsonValue };

export const PrismicJsonValueSchema: z.ZodType<PrismicJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(PrismicJsonValueSchema),
		z.record(z.string(), PrismicJsonValueSchema),
	]),
);

const RepositorySchema = z
	.string()
	.min(1)
	.regex(
		/^[a-z0-9][a-z0-9-]*$/,
		'A Prismic repository id is lowercase letters, digits and hyphens.',
	)
	.describe(
		'The repository id, such as `my-cafe`. It is the first part of its host.',
	);

// ── Content API: repository metadata ──────────────────────────────────────

export const RefSchema = z
	.object({
		id: z.string().nullish(),
		ref: z.string().nullish().describe('The ref token a query is pinned to.'),
		label: z.string().nullish(),
		isMasterRef: z
			.boolean()
			.nullish()
			.describe('True for the published `master` ref.'),
	})
	.loose();

export type PrismicRef = z.infer<typeof RefSchema>;

export const LanguageSchema = z
	.object({
		id: z.string().nullish().describe('The locale code, such as `en-us`.'),
		name: z.string().nullish(),
	})
	.loose();

export type PrismicLanguage = z.infer<typeof LanguageSchema>;

export const RepositoryInfoInputSchema = z.object({
	repository: RepositorySchema.optional().describe(
		'Overrides the plugin option for this call.',
	),
});

export type RepositoryInfoInput = z.infer<typeof RepositoryInfoInputSchema>;

const RepositoryInfoOutputSchema = z
	.object({
		refs: z
			.array(RefSchema)
			.describe('Every ref, including `master` and any open releases.'),
		bookmarks: z
			.record(z.string(), z.string())
			.nullish()
			.describe('Saved queries by name.'),
		types: z
			.record(z.string(), z.string())
			.nullish()
			.describe('Custom type ids to their display labels.'),
		languages: z.array(LanguageSchema).nullish(),
		tags: z.array(z.string()).nullish(),
		integrationFieldsRef: z.string().nullish(),
		license: z.string().nullish(),
		version: z.string().nullish(),
	})
	.loose();

export type RepositoryInfoOutput = z.infer<typeof RepositoryInfoOutputSchema>;

// ── Content API: documents ────────────────────────────────────────────────

export const DocumentSchema = z
	.object({
		id: z.string().nullish(),
		uid: z.string().nullish(),
		type: z.string().nullish().describe('The custom type id.'),
		lang: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		// unknown: which fields exist depends on the repository's custom types, so
		// the document body is passed through as Prismic sent it.
		data: z.record(z.string(), PrismicJsonValueSchema).nullish(),
		slugs: z.array(z.string()).nullish(),
		href: z.string().nullish(),
		url: z
			.string()
			.nullish()
			.describe('Absent on a document with no route set.'),
		first_publication_date: z.string().nullish(),
		last_publication_date: z.string().nullish(),
		alternate_languages: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						lang: z.string().nullish(),
						type: z.string().nullish(),
						uid: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		linked_documents: z.array(PrismicJsonValueSchema).nullish(),
	})
	.loose();

export type PrismicDocument = z.infer<typeof DocumentSchema>;

const listQueryFields = {
	page: z.number().int().min(1).optional().describe('1-based page number.'),
	pageSize: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe(
			'Documents per page. Prismic caps this at 100 on most plans, so a full page means another page may exist.',
		),
	orderings: z
		.string()
		.min(1)
		.optional()
		.describe(
			'An ordering such as `[my.document.date desc]`, or several separated by a space.',
		),
	q: z
		.string()
		.min(1)
		.optional()
		.describe(
			'A Prismic predicate expression such as `[[at(document.type, "page")]]`.',
		),
	lang: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Only documents in this locale, such as `en-us`. Also accepts `*`.',
		),
	tags: z
		.array(z.string().min(1))
		.optional()
		.describe('Only documents carrying every one of these tags.'),
	after: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Continues after a cursor Prismic returned on the previous page, which is more reliable than `page` for a changing dataset.',
		),
	ref: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Pins the query to a ref, such as a release preview. Defaults to `master`.',
		),
	nextPage: z
		.string()
		.min(1)
		.optional()
		.describe(
			"The previous answer's `next_page`. It already carries the ref and every filter, so the other fields are ignored when it is set.",
		),
};

export const DocumentsSearchInputSchema = z.object(listQueryFields);

export type DocumentsSearchInput = z.infer<typeof DocumentsSearchInputSchema>;

const DocumentsSearchOutputSchema = z
	.object({
		page: z.number().nullish(),
		results_per_page: z.number().nullish(),
		results_size: z.number().nullish(),
		total_results_size: z.number().nullish(),
		total_pages: z.number().nullish(),
		next_page: z
			.string()
			.nullish()
			.describe('The absolute next page URL. Absent on the last page.'),
		prev_page: z.string().nullish(),
		results: z.array(DocumentSchema),
	})
	.loose();

export type DocumentsSearchOutput = z.infer<typeof DocumentsSearchOutputSchema>;

export const DocumentsGetInputSchema = z.object({
	id: z.string().min(1).describe('The document id.'),
	ref: listQueryFields.ref,
	lang: listQueryFields.lang,
});

export type DocumentsGetInput = z.infer<typeof DocumentsGetInputSchema>;

/** A single-document read answers the document itself, not a page. */
const DocumentsGetOutputSchema = DocumentSchema;

export type DocumentsGetOutput = z.infer<typeof DocumentsGetOutputSchema>;

// ── Migration API ─────────────────────────────────────────────────────────

const MigrationLangSchema = z
	.string()
	.min(2)
	.describe('The locale code, such as `en-us`.');
const MigrationUidSchema = z
	.string()
	.min(1)
	.describe(
		'The document UID, unique within its type. Required if the type has one.',
	);

export const MigrationCreateInputSchema = z
	.object({
		title: z
			.string()
			.min(1)
			.describe('The display title shown in the page list.'),
		type: z.string().min(1).describe('The custom type id.'),
		uid: MigrationUidSchema.optional(),
		lang: MigrationLangSchema,
		// unknown: the fields must match the repository's custom type, which the
		// plugin cannot know, so the body passes through and Prismic validates it.
		data: z
			.record(z.string(), PrismicJsonValueSchema)
			.describe(
				"The document's fields and slices. Each key is a field or slice zone on the type.",
			),
		tags: z.array(z.string().min(1)).optional(),
		alternate_language_id: z
			.string()
			.min(1)
			.optional()
			.describe('The document this one translates.'),
	})
	.loose();

export type MigrationCreateInput = z.infer<typeof MigrationCreateInputSchema>;

export const MigrationUpdateInputSchema = z
	.object({
		id: z.string().min(1).describe('The id of the document to update.'),
		uid: MigrationUidSchema.optional(),
		// unknown: same as create; the type decides which fields are valid.
		data: z.record(z.string(), PrismicJsonValueSchema).optional(),
		title: z.string().min(1).optional(),
		tags: z
			.array(z.string().min(1))
			.optional()
			.describe('Replaces the existing tags; omitting it deletes them all.'),
	})
	.superRefine((value, ctx) => {
		// A PUT must change something; an empty body is a no-op Prismic rejects.
		if (
			value.data === undefined &&
			value.title === undefined &&
			value.tags === undefined &&
			value.uid === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply data, title, tags or uid to change.',
				path: ['data'],
			});
		}
	});

export type MigrationUpdateInput = z.infer<typeof MigrationUpdateInputSchema>;

/** The id Prismic assigned, which a later update needs. */
const MigrationWriteOutputSchema = z
	.object({
		id: z.string().nullish(),
		uid: z.string().nullish(),
		type: z.string().nullish(),
		lang: z.string().nullish(),
		title: z.string().nullish(),
	})
	.loose();

export type MigrationWriteOutput = z.infer<typeof MigrationWriteOutputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type PrismicEndpointInputs = {
	repositoryInfo: RepositoryInfoInput;
	documentsSearch: DocumentsSearchInput;
	documentsGet: DocumentsGetInput;
	migrationCreate: MigrationCreateInput;
	migrationUpdate: MigrationUpdateInput;
};

export type PrismicEndpointOutputs = {
	repositoryInfo: RepositoryInfoOutput;
	documentsSearch: DocumentsSearchOutput;
	documentsGet: DocumentsGetOutput;
	migrationCreate: MigrationWriteOutput;
	migrationUpdate: MigrationWriteOutput;
};

export const PrismicEndpointInputSchemas = {
	repositoryInfo: RepositoryInfoInputSchema,
	documentsSearch: DocumentsSearchInputSchema,
	documentsGet: DocumentsGetInputSchema,
	migrationCreate: MigrationCreateInputSchema,
	migrationUpdate: MigrationUpdateInputSchema,
} as const;

export const PrismicEndpointOutputSchemas = {
	repositoryInfo: RepositoryInfoOutputSchema,
	documentsSearch: DocumentsSearchOutputSchema,
	documentsGet: DocumentsGetOutputSchema,
	migrationCreate: MigrationWriteOutputSchema,
	migrationUpdate: MigrationWriteOutputSchema,
} as const;
