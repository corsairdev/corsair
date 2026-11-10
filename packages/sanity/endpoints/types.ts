import { z } from 'zod';
import { isValidDataset } from '../client';

// ── Shared ──────────────────────────────────────────────────────────────────

const DatasetSchema = z
	.string()
	.refine(isValidDataset, {
		message:
			'Must be a dataset name: lowercase letters, digits, dashes and underscores, starting with a letter or digit.',
	})
	.optional()
	.describe(
		"The dataset to use. Left out: the connection's dataset, else production.",
	);

const DocumentIdSchema = z
	.string()
	.min(1)
	.max(128)
	.regex(
		/^[A-Za-z0-9._-]+$/,
		'Document ids are letters, digits, dots, dashes and underscores.',
	);

const PublishedIdSchema = DocumentIdSchema.describe(
	'The document id. A drafts. prefix is accepted and dropped: drafts and the published document share this id.',
);

// unknown: a Sanity document has whatever fields its schema type defines.
const DocumentSchema = z
	.object({
		_id: z.string(),
		_type: z.string(),
		_rev: z.string().nullish(),
		_createdAt: z.string().nullish(),
		_updatedAt: z.string().nullish(),
	})
	.loose();

// unknown: field values are any JSON the document's schema allows.
const FieldValuesSchema = z.record(z.string(), z.unknown());

const PatchOperationsShape = {
	set: FieldValuesSchema.optional().describe(
		"Fields to set, by path: { title: 'New title', 'seo.description': '...', 'body[_key==\"a1\"].text': '...' }.",
	),
	setIfMissing: FieldValuesSchema.optional().describe(
		'Fields to set only where they have no value yet. Use it before inserting into an array that may not exist: { tags: [] }.',
	),
	unset: z
		.array(z.string().min(1))
		.optional()
		.describe("Paths to remove, for example ['subtitle', 'tags[0]']."),
	inc: z
		.record(z.string(), z.number())
		.optional()
		.describe('Numbers to add to, by path.'),
	dec: z
		.record(z.string(), z.number())
		.optional()
		.describe('Numbers to subtract from, by path.'),
	insert: z
		.object({
			before: z.string().optional(),
			after: z.string().optional(),
			replace: z.string().optional(),
			// unknown: array items are any JSON the field allows.
			items: z.array(z.unknown()).min(1),
		})
		.refine(
			(value) =>
				[value.before, value.after, value.replace].filter(
					(position) => position !== undefined,
				).length === 1,
			'Give exactly one of before, after or replace.',
		)
		.optional()
		.describe(
			"Insert items into an array at a path: { after: 'tags[-1]', items: ['news'] } appends. Objects in an array need a unique _key.",
		),
	diffMatchPatch: z
		.record(z.string(), z.string())
		.optional()
		.describe('diff-match-patch strings to apply to text fields, by path.'),
};

const PatchOperationsSchema = z.object(PatchOperationsShape);

type PatchOperations = z.infer<typeof PatchOperationsSchema>;

export const PATCH_OPERATION_KEYS = Object.keys(
	PatchOperationsShape,
) as (keyof PatchOperations)[];

function hasPatchOperation(value: PatchOperations): boolean {
	return PATCH_OPERATION_KEYS.some((key) => value[key] !== undefined);
}

const PATCH_REQUIRED_MESSAGE =
	'Give at least one of set, setIfMissing, unset, inc, dec, insert or diffMatchPatch.';

const TransactionReceiptSchema = z
	.object({
		transactionId: z
			.string()
			.nullish()
			.describe(
				'The transaction that made the change. Missing when there was nothing to change.',
			),
	})
	.loose();

// ── documents.query ─────────────────────────────────────────────────────────

const PerspectiveSchema = z
	.union([
		z.enum(['published', 'drafts', 'raw']),
		z.array(z.string().min(1)).min(1).max(10),
	])
	.optional()
	.describe(
		"Which version of each document the query sees. published (default): live documents only. drafts: drafts where they exist, else published. raw: everything, drafts and release versions under their own ids. A list of release names reads those releases stacked over published, for example ['rSummerLaunch', 'drafts'].",
	);

const DocumentsQueryInputSchema = z.object({
	query: z
		.string()
		.min(1)
		.max(100_000)
		.describe(
			"A GROQ query, for example *[_type == 'post' && defined(slug.current)] | order(publishedAt desc)[0...10]{ _id, title, 'slug': slug.current }. Project only the fields you need and slice the results: answers above 1 MB can be cut off on Corsair's cloud.",
		),
	// unknown: GROQ parameter values are any JSON.
	params: z
		.record(z.string(), z.unknown())
		.optional()
		.describe(
			"Values for $parameters in the query, without the $: { type: 'post' } for $type. Pass user input this way, never by building it into the query.",
		),
	perspective: PerspectiveSchema,
	dataset: DatasetSchema,
});

export type DocumentsQueryInput = z.infer<typeof DocumentsQueryInputSchema>;

const DocumentsQueryResponseSchema = z
	.object({
		// unknown: a GROQ query can return any JSON value.
		result: z.unknown().describe("The query's result: any JSON value."),
		ms: z.number().nullish().describe('Server time in milliseconds.'),
	})
	.loose();

export type DocumentsQueryResponse = z.infer<
	typeof DocumentsQueryResponseSchema
>;

// ── documents.get ───────────────────────────────────────────────────────────

const DocumentsGetInputSchema = z.object({
	ids: z
		.array(DocumentIdSchema)
		.min(1)
		.max(100)
		.describe(
			'Exact document ids, up to 100. A draft is drafts.<id>, a release version versions.<release>.<id>.',
		),
	dataset: DatasetSchema,
});

export type DocumentsGetInput = z.infer<typeof DocumentsGetInputSchema>;

const DocumentsGetResponseSchema = z
	.object({
		documents: z.array(DocumentSchema),
		omitted: z
			.array(
				z
					.object({
						id: z.string(),
						reason: z
							.string()
							.describe(
								"existence: no such document. permission: the token can't read it.",
							),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type DocumentsGetResponse = z.infer<typeof DocumentsGetResponseSchema>;

// ── documents.create ────────────────────────────────────────────────────────

const DocumentsCreateInputSchema = z.object({
	document: z
		.object({
			_type: z.string().min(1).describe("The schema type, for example 'post'."),
			_id: PublishedIdSchema.optional().describe(
				'The id to give the document. Left out, a random one is made.',
			),
		})
		.loose()
		.describe(
			"The new document's fields: { _type: 'post', title: '...', slug: { _type: 'slug', current: '...' } }. Objects in arrays need a unique _key. Read the dataset's schema or an existing document of the type for its fields.",
		),
	publish: z
		.boolean()
		.optional()
		.describe(
			'false (default): the document is created as a draft, which nothing reading published content sees until documents.publish. true: created and published at once.',
		),
	ifExists: z
		.enum(['fail', 'ignore'])
		.optional()
		.describe(
			'When a draft with this id already exists: fail (default) errors, ignore leaves it and returns. Only the draft is checked: with an _id of a published document, a new draft is made over it.',
		),
	dryRun: z
		.boolean()
		.optional()
		.describe('Check the change without making it.'),
	dataset: DatasetSchema,
});

export type DocumentsCreateInput = z.infer<typeof DocumentsCreateInputSchema>;

const DocumentChangeResponseSchema = TransactionReceiptSchema.extend({
	id: z
		.string()
		.describe(
			'The published id. Pass it to documents.publish, documents.edit and the rest.',
		),
	draftId: z.string().describe('The draft, drafts.<id>.'),
	published: z
		.boolean()
		.describe('Whether the change was also published in this call.'),
});

export type DocumentsCreateResponse = z.infer<
	typeof DocumentChangeResponseSchema
>;

// ── documents.edit ──────────────────────────────────────────────────────────

const DocumentsEditInputSchema = z
	.object({
		id: PublishedIdSchema,
		...PatchOperationsShape,
		publish: z
			.boolean()
			.optional()
			.describe(
				'false (default): the edit stays in the draft until documents.publish. true: published in the same transaction.',
			),
		dryRun: z.boolean().optional(),
		dataset: DatasetSchema,
	})
	.refine(hasPatchOperation, PATCH_REQUIRED_MESSAGE);

export type DocumentsEditInput = z.infer<typeof DocumentsEditInputSchema>;

export type DocumentsEditResponse = z.infer<
	typeof DocumentChangeResponseSchema
>;

// ── documents.patch ─────────────────────────────────────────────────────────

const DocumentsPatchInputSchema = z
	.object({
		id: DocumentIdSchema.describe(
			'The exact document to patch: a published id changes the live document at once, drafts.<id> the draft.',
		),
		...PatchOperationsShape,
		ifRevisionId: z
			.string()
			.optional()
			.describe(
				"Apply only if the document's _rev is still this; otherwise Sanity answers 409 and nothing changes.",
			),
		dryRun: z.boolean().optional(),
		dataset: DatasetSchema,
	})
	.refine(hasPatchOperation, PATCH_REQUIRED_MESSAGE);

export type DocumentsPatchInput = z.infer<typeof DocumentsPatchInputSchema>;

const DocumentsPatchResponseSchema = TransactionReceiptSchema.extend({
	document: DocumentSchema.nullish().describe('The document after the patch.'),
});

export type DocumentsPatchResponse = z.infer<
	typeof DocumentsPatchResponseSchema
>;

// ── documents.publish / unpublish / discardDraft / delete ───────────────────

const DocumentsPublishInputSchema = z.object({
	id: PublishedIdSchema,
	ifDraftRevisionId: z
		.string()
		.optional()
		.describe("Publish only if the draft's _rev is still this."),
	ifPublishedRevisionId: z
		.string()
		.optional()
		.describe("Publish only if the published document's _rev is still this."),
	dryRun: z.boolean().optional(),
	dataset: DatasetSchema,
});

export type DocumentsPublishInput = z.infer<typeof DocumentsPublishInputSchema>;

const DocumentIdsReceiptSchema = TransactionReceiptSchema.extend({
	id: z.string(),
	draftId: z.string(),
});

export type DocumentsPublishResponse = z.infer<typeof DocumentIdsReceiptSchema>;

const DocumentsUnpublishInputSchema = z.object({
	id: PublishedIdSchema,
	dryRun: z.boolean().optional(),
	dataset: DatasetSchema,
});

export type DocumentsUnpublishInput = z.infer<
	typeof DocumentsUnpublishInputSchema
>;

export type DocumentsUnpublishResponse = z.infer<
	typeof DocumentIdsReceiptSchema
>;

const PurgeSchema = z
	.boolean()
	.optional()
	.describe(
		'Also remove it from the document history. Default false, so documents.history can still read it.',
	);

const DocumentsDiscardDraftInputSchema = z.object({
	id: PublishedIdSchema,
	purge: PurgeSchema,
	dryRun: z.boolean().optional(),
	dataset: DatasetSchema,
});

export type DocumentsDiscardDraftInput = z.infer<
	typeof DocumentsDiscardDraftInputSchema
>;

export type DocumentsDiscardDraftResponse = z.infer<
	typeof DocumentIdsReceiptSchema
>;

const DocumentsDeleteInputSchema = z.object({
	ids: z
		.array(PublishedIdSchema)
		.min(1)
		.max(100)
		.describe('Documents to delete, up to 100, published and draft together.'),
	purge: PurgeSchema,
	dryRun: z.boolean().optional(),
	dataset: DatasetSchema,
});

export type DocumentsDeleteInput = z.infer<typeof DocumentsDeleteInputSchema>;

const DocumentsDeleteResponseSchema = TransactionReceiptSchema.extend({
	ids: z.array(z.string()),
});

export type DocumentsDeleteResponse = z.infer<
	typeof DocumentsDeleteResponseSchema
>;

// ── documents.mutate ────────────────────────────────────────────────────────

const MUTATION_KINDS = [
	'create',
	'createOrReplace',
	'createIfNotExists',
	'delete',
	'patch',
] as const;

const DocumentsMutateInputSchema = z.object({
	mutations: z
		// unknown: a mutation's body is a document, a patch or a delete selector.
		.array(z.record(z.string(), z.unknown()))
		.min(1)
		.max(1000)
		.refine(
			(mutations) =>
				mutations.every((mutation) => {
					const keys = Object.keys(mutation);
					return (
						keys.length === 1 &&
						(MUTATION_KINDS as readonly string[]).includes(keys[0] ?? '')
					);
				}),
			`Each mutation is one of ${MUTATION_KINDS.join(', ')}, as a single key.`,
		)
		.describe(
			'Sanity mutations, applied in one transaction: { create: {...} }, { createOrReplace: {...} }, { createIfNotExists: {...} }, { patch: { id, set, ... , ifRevisionID } } or { delete: { id } }. A patch or delete can take query + params instead of id to hit every match. They write the exact ids given: a published id is live at once.',
		),
	transactionId: z
		.string()
		.min(1)
		.max(128)
		.optional()
		.describe(
			'Your own id for the transaction. Sending one already used is refused, so a retry cannot apply twice.',
		),
	returnDocuments: z
		.boolean()
		.optional()
		.describe('Return each changed document. Default false: ids only.'),
	visibility: z
		.enum(['sync', 'async', 'deferred'])
		.optional()
		.describe(
			'sync (default): answer once queries see the change. async: answer on commit. deferred: fastest, for bulk imports.',
		),
	autoGenerateArrayKeys: z
		.boolean()
		.optional()
		.describe('Add a _key to array objects that have none.'),
	dryRun: z.boolean().optional(),
	dataset: DatasetSchema,
});

export type DocumentsMutateInput = z.infer<typeof DocumentsMutateInputSchema>;

const DocumentsMutateResponseSchema = z
	.object({
		transactionId: z.string(),
		results: z.array(
			z
				.object({
					id: z.string().nullish(),
					operation: z.string().nullish(),
					document: DocumentSchema.nullish(),
				})
				.loose(),
		),
	})
	.loose();

export type DocumentsMutateResponse = z.infer<
	typeof DocumentsMutateResponseSchema
>;

// ── documents.history ───────────────────────────────────────────────────────

const DocumentsHistoryInputSchema = z
	.object({
		id: DocumentIdSchema.describe(
			'The exact document id, drafts.<id> for a draft.',
		),
		revision: z
			.string()
			.optional()
			.describe('A _rev, from a document or documents.transactions.'),
		time: z
			.string()
			.datetime({ offset: true })
			.optional()
			.describe('An ISO time: the document as it stood then.'),
		lastRevision: z
			.boolean()
			.optional()
			.describe(
				'The last version it had, including just before it was deleted. The way to recover a deleted document.',
			),
		dataset: DatasetSchema,
	})
	.refine(
		(value) =>
			[value.revision, value.time, value.lastRevision || undefined].filter(
				(choice) => choice !== undefined,
			).length === 1,
		'Give exactly one of revision, time or lastRevision.',
	);

export type DocumentsHistoryInput = z.infer<typeof DocumentsHistoryInputSchema>;

const DocumentsHistoryResponseSchema = z.object({
	document: DocumentSchema.nullable().describe(
		"The document at that point, or null when it didn't exist then or the history has been purged. How far back history reaches depends on the plan.",
	),
});

export type DocumentsHistoryResponse = z.infer<
	typeof DocumentsHistoryResponseSchema
>;

// ── documents.transactions ──────────────────────────────────────────────────

const DocumentsTransactionsInputSchema = z.object({
	ids: z.array(DocumentIdSchema).min(1).max(20),
	fromTime: z.string().datetime({ offset: true }).optional(),
	toTime: z.string().datetime({ offset: true }).optional(),
	fromTransaction: z.string().optional(),
	toTransaction: z.string().optional(),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe(
			'How many transactions, default 20, at most 100. Sanity merges quick successive edits by one author into one entry.',
		),
	reverse: z.boolean().optional().describe('Newest first.'),
	authors: z
		.array(z.string().min(1))
		.max(20)
		.optional()
		.describe('Only transactions by these user or token ids.'),
	dataset: DatasetSchema,
});

export type DocumentsTransactionsInput = z.infer<
	typeof DocumentsTransactionsInputSchema
>;

const TransactionSchema = z
	.object({
		id: z.string().describe('The transaction id, also the _rev it produced.'),
		timestamp: z.string(),
		author: z.string().nullish().describe('The user or token id.'),
		// unknown: mutations in Sanity's mutation format, with document content left out.
		mutations: z
			.array(z.record(z.string(), z.unknown()))
			.nullish()
			.describe(
				'What each mutation was, without the document content (Sanity requires that). Read a revision with documents.history.',
			),
		documentIDs: z.array(z.string()).nullish(),
	})
	.loose();

const DocumentsTransactionsResponseSchema = z.object({
	transactions: z.array(TransactionSchema),
});

export type DocumentsTransactionsResponse = z.infer<
	typeof DocumentsTransactionsResponseSchema
>;

// ── assets.upload ───────────────────────────────────────────────────────────

/** Largest upload, decoded. */
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

const STRICT_BASE64_RE =
	/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

const AssetsUploadInputSchema = z.object({
	kind: z
		.enum(['image', 'file'])
		.describe(
			'image: a picture Sanity can crop and resize (JPEG, PNG, WebP, GIF, SVG, AVIF, TIFF). file: anything else (PDF, audio, video...).',
		),
	contentBase64: z
		.string()
		.min(4)
		.max(Math.ceil(MAX_UPLOAD_BYTES / 3) * 4)
		.regex(STRICT_BASE64_RE, 'Must be standard base64, padded.')
		.describe('The file as base64, up to 25 MB decoded.'),
	contentType: z
		.string()
		.regex(/^[\w.+-]+\/[\w.+-]+$/, 'Must be a MIME type such as image/png.')
		.describe('The MIME type, for example image/png or application/pdf.'),
	filename: z.string().min(1).max(255).optional(),
	title: z.string().max(500).optional(),
	description: z.string().max(5000).optional(),
	label: z.string().max(500).optional(),
	imageMetadata: z
		.array(z.enum(['exif', 'location', 'lqip', 'palette', 'blurhash']))
		.optional()
		.describe(
			'Images only: metadata to extract. Sanity always extracts dimensions; lqip, palette and blurhash are on by default.',
		),
	dataset: DatasetSchema,
});

export type AssetsUploadInput = z.infer<typeof AssetsUploadInputSchema>;

const AssetsUploadResponseSchema = z.object({
	asset: DocumentSchema.extend({
		url: z.string().nullish().describe('The public CDN URL of the file.'),
		originalFilename: z.string().nullish(),
		mimeType: z.string().nullish(),
		size: z.number().nullish(),
		sha1hash: z.string().nullish(),
	})
		.loose()
		.describe(
			"The asset document. Reference it from a document: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }. Uploading the same bytes again returns the existing asset.",
		),
});

export type AssetsUploadResponse = z.infer<typeof AssetsUploadResponseSchema>;

// ── datasets ────────────────────────────────────────────────────────────────

const DatasetEntrySchema = z
	.object({
		name: z.string(),
		aclMode: z
			.string()
			.nullish()
			.describe(
				'public: published documents are readable without a token. private: a token is needed.',
			),
		createdAt: z.string().nullish(),
		datasetProfile: z.string().nullish(),
		tags: z.array(z.unknown()).nullish(),
	})
	.loose();

const DatasetsListInputSchema = z.object({});

export type DatasetsListInput = z.infer<typeof DatasetsListInputSchema>;

const DatasetsListResponseSchema = z.object({
	datasets: z.array(DatasetEntrySchema),
});

export type DatasetsListResponse = z.infer<typeof DatasetsListResponseSchema>;

const DatasetNameSchema = z
	.string()
	.refine(isValidDataset, {
		message:
			'Must be lowercase letters, digits, dashes and underscores, starting with a letter or digit, 64 at most.',
	})
	.describe('The dataset name.');

const DatasetsCreateInputSchema = z.object({
	name: DatasetNameSchema,
	aclMode: z
		.enum(['public', 'private'])
		.optional()
		.describe(
			"public: published documents can be read without a token. private: reading needs a token; Sanity's free plan refuses it. Left out, Sanity's default (public) applies.",
		),
});

export type DatasetsCreateInput = z.infer<typeof DatasetsCreateInputSchema>;

const DatasetsCreateResponseSchema = z
	.object({
		datasetName: z.string().nullish(),
		aclMode: z.string().nullish(),
	})
	.loose();

export type DatasetsCreateResponse = z.infer<
	typeof DatasetsCreateResponseSchema
>;

const DatasetsDeleteInputSchema = z.object({
	name: DatasetNameSchema,
	confirmName: z
		.string()
		.describe(
			'The dataset name typed again. Must equal name: deleting a dataset deletes every document and asset in it for good.',
		),
});

export type DatasetsDeleteInput = z.infer<typeof DatasetsDeleteInputSchema>;

const DatasetsDeleteResponseSchema = z
	.object({ deleted: z.boolean().nullish() })
	.loose();

export type DatasetsDeleteResponse = z.infer<
	typeof DatasetsDeleteResponseSchema
>;

// ── schemas.list ────────────────────────────────────────────────────────────

const SchemasListInputSchema = z.object({
	type: z
		.string()
		.min(1)
		.optional()
		.describe(
			"A type name, for example 'post': its full definition comes back as definition, with every field's options and validation.",
		),
	dataset: DatasetSchema,
});

export type SchemasListInput = z.infer<typeof SchemasListInputSchema>;

const SchemaFieldSummarySchema = z.object({
	name: z.string(),
	type: z.string().nullish(),
	title: z.string().nullish(),
	// unknown: array members, references and the like, as the schema has them.
	of: z.array(z.unknown()).nullish(),
	// unknown: reference targets, as the schema has them.
	to: z.array(z.unknown()).nullish(),
});

const SchemasListResponseSchema = z.object({
	schemas: z.array(
		z.object({
			schemaId: z
				.string()
				.describe(
					'Pass this as schemaId to the agentActions operations, for example _.schemas.default.',
				),
			workspace: z.string().nullish(),
			title: z.string().nullish(),
			deployedAt: z.string().nullish(),
			types: z
				.array(
					z.object({
						name: z.string(),
						type: z.string().nullish(),
						title: z.string().nullish(),
						fields: z.array(SchemaFieldSummarySchema).nullish(),
					}),
				)
				.describe(
					"The schema's types, with each type's top-level fields. Documents are type 'document'.",
				),
			// unknown: Studio's deployed definition of one type, any JSON.
			definition: z
				.unknown()
				.optional()
				.describe('The full definition of the type asked for, when found.'),
		}),
	),
});

export type SchemasListResponse = z.infer<typeof SchemasListResponseSchema>;

// ── agentActions ────────────────────────────────────────────────────────────

/** Longest an Agent Action call waits. Generations can run for minutes; pass async for those. */
export const AGENT_ACTION_TIMEOUT_MS = 120_000;

const SchemaIdSchema = z
	.string()
	.min(1)
	.describe(
		"The deployed schema the action reads, for example _.schemas.default. List them with schemas.list; a project deploys one with 'sanity schema deploy'.",
	);

// unknown: an instruction parameter is a string or a typed object Sanity validates.
const InstructionParamsSchema = z
	.record(z.string(), z.union([z.string(), z.record(z.string(), z.unknown())]))
	.optional()
	.describe(
		"Values for $names in the instruction: a string, { type: 'constant', value }, { type: 'field', path, documentId? }, { type: 'document', documentId? } or { type: 'groq', query, params? }.",
	);

// unknown: Sanity validates a target's path, include, exclude, types and operation.
const TargetSchema = z
	.union([
		z.record(z.string(), z.unknown()),
		z.array(z.record(z.string(), z.unknown())).max(50),
	])
	.optional()
	.describe(
		"Which fields to write, for example { path: 'title' } or [{ path: ['body'] }, { path: 'description', operation: 'set' }]. Left out, every field the action can write.",
	);

const TargetDocumentSchema = z
	.object({
		operation: z.enum([
			'edit',
			'create',
			'createIfNotExists',
			'createOrReplace',
		]),
		_id: z.string().optional(),
		_type: z.string().optional(),
		// unknown: initial field values, as the type allows.
		initialValues: z.record(z.string(), z.unknown()).optional(),
	})
	.optional()
	.describe(
		"Where the result goes: { operation: 'create', _type: 'post' } writes a new document, { operation: 'edit', _id } an existing one. Writes go to the draft unless forcePublishedWrite.",
	);

const AgentCommonShape = {
	schemaId: SchemaIdSchema,
	noWrite: z
		.boolean()
		.optional()
		.describe('Return the result without saving anything. Not with async.'),
	async: z
		.boolean()
		.optional()
		.describe(
			'Start the action and return the target document id at once; the write lands later. For long generations.',
		),
	forcePublishedWrite: z
		.boolean()
		.optional()
		.describe(
			'Write to the published document instead of its draft, so the change is live at once. Default false.',
		),
	temperature: z.number().min(0).max(1).optional(),
	localeSettings: z
		.object({ locale: z.string(), timeZone: z.string() })
		.optional()
		.describe(
			"Needed for the action to write date and datetime fields: { locale: 'en-US', timeZone: 'Europe/Oslo' }.",
		),
	// unknown: Sanity validates conditional path overrides.
	conditionalPaths: z.record(z.string(), z.unknown()).optional(),
	dataset: DatasetSchema,
};

function notAsyncAndNoWrite(value: { async?: boolean; noWrite?: boolean }) {
	return !(value.async && value.noWrite);
}

const ASYNC_NOWRITE_MESSAGE = 'async and noWrite cannot both be true.';

const AgentGenerateInputSchema = z
	.object({
		...AgentCommonShape,
		instruction: z
			.string()
			.min(1)
			.describe(
				'What to write, for example "Write an SEO description of $title under 160 characters".',
			),
		instructionParams: InstructionParamsSchema,
		documentId: z
			.string()
			.optional()
			.describe('An existing document to write into. Or give targetDocument.'),
		targetDocument: TargetDocumentSchema,
		target: TargetSchema,
	})
	.refine(
		(value) =>
			(value.documentId === undefined) !== (value.targetDocument === undefined),
		'Give exactly one of documentId or targetDocument.',
	)
	.refine(notAsyncAndNoWrite, ASYNC_NOWRITE_MESSAGE);

export type AgentGenerateInput = z.infer<typeof AgentGenerateInputSchema>;

const AgentTransformInputSchema = z
	.object({
		...AgentCommonShape,
		documentId: z.string().min(1).describe('The source document.'),
		instruction: z
			.string()
			.min(1)
			.max(2000)
			.describe(
				'How to change it, for example "Rewrite in plain British English". 2,000 characters at most once params are filled in.',
			),
		instructionParams: InstructionParamsSchema,
		targetDocument: TargetDocumentSchema.describe(
			'Write the result to another document instead of the source.',
		),
		target: TargetSchema,
	})
	.refine(notAsyncAndNoWrite, ASYNC_NOWRITE_MESSAGE);

export type AgentTransformInput = z.infer<typeof AgentTransformInputSchema>;

const LanguageSchema = z.object({
	id: z.string().min(1).describe("A language id, for example 'de-DE'."),
	title: z.string().optional(),
});

const AgentTranslateInputSchema = z
	.object({
		...AgentCommonShape,
		documentId: z.string().min(1).describe('The source document.'),
		toLanguage: LanguageSchema,
		fromLanguage: LanguageSchema.optional(),
		styleGuide: z
			.string()
			.max(2000)
			.optional()
			.describe(
				'How to translate: tone, terms to keep. 2,000 characters at most.',
			),
		protectedPhrases: z
			.array(z.string().min(1))
			.max(100)
			.optional()
			.describe('Words to leave untranslated, such as product names.'),
		languageFieldPath: z
			.string()
			.optional()
			.describe(
				'A field to set to toLanguage.id, for document-level localization.',
			),
		targetDocument: TargetDocumentSchema.describe(
			"Write the translation to another document, usually { operation: 'create' }, instead of over the source.",
		),
		target: TargetSchema,
	})
	.refine(notAsyncAndNoWrite, ASYNC_NOWRITE_MESSAGE);

export type AgentTranslateInput = z.infer<typeof AgentTranslateInputSchema>;

const AgentDocumentResponseSchema = z.object({
	document: DocumentSchema.partial({ _type: true })
		.loose()
		.describe(
			'The document as the action left it; with async, only its _id, since the write happens later.',
		),
});

export type AgentGenerateResponse = z.infer<typeof AgentDocumentResponseSchema>;
export type AgentTransformResponse = AgentGenerateResponse;
export type AgentTranslateResponse = AgentGenerateResponse;

const AgentPromptInputSchema = z
	.object({
		instruction: z.string().min(1),
		instructionParams: InstructionParamsSchema,
		format: z
			.enum(['string', 'json'])
			.optional()
			.describe(
				"string (default): text. json: a JSON value, and the instruction must contain the word 'json'.",
			),
		temperature: z.number().min(0).max(1).optional(),
		dataset: DatasetSchema,
	})
	.refine(
		(value) => value.format !== 'json' || /json/i.test(value.instruction),
		"With format 'json' the instruction must contain the word json.",
	);

export type AgentPromptInput = z.infer<typeof AgentPromptInputSchema>;

const AgentPromptResponseSchema = z.object({
	text: z.string().nullish().describe("The answer, when format is 'string'."),
	// unknown: whatever JSON the model returned.
	json: z.unknown().optional().describe("The answer, when format is 'json'."),
});

export type AgentPromptResponse = z.infer<typeof AgentPromptResponseSchema>;

// ── webhooks ────────────────────────────────────────────────────────────────

const WebhookSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		url: z.string().nullish(),
		dataset: z.string().nullish(),
		httpMethod: z.string().nullish(),
		apiVersion: z.string().nullish(),
		// unknown: Sanity's rule object (on, filter, projection).
		rule: z.record(z.string(), z.unknown()).nullish(),
		includeDrafts: z.boolean().nullish(),
		isDisabled: z.boolean().nullish(),
		isDisabledByUser: z.boolean().nullish(),
		createdAt: z.string().nullish(),
		hasSecret: z
			.boolean()
			.describe(
				'Whether deliveries are signed. The secret itself is never returned.',
			),
	})
	.loose();

const WebhooksListInputSchema = z.object({});

export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

const WebhooksListResponseSchema = z.object({
	webhooks: z.array(WebhookSchema).describe("The project's webhooks."),
});

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

const HttpUrlSchema = z.string().refine((value) => {
	if (!URL.canParse(value)) return false;
	const url = new URL(value);
	return (
		(url.protocol === 'https:' || url.protocol === 'http:') &&
		!url.username &&
		!url.password
	);
}, 'Must be an http(s) URL without credentials.');

const WebhookFieldsShape = {
	name: z.string().min(1).max(200),
	url: HttpUrlSchema.describe(
		'Where Sanity sends deliveries. For a Corsair app, its webhook endpoint (add ?tenantId= when several tenants share one Sanity project).',
	),
	dataset: z
		.string()
		.optional()
		.describe(
			"The dataset to watch, or '*' for all. Left out: the connection's dataset.",
		),
	on: z
		.array(z.enum(['create', 'update', 'delete']))
		.min(1)
		.describe('Which changes fire it. Unpublishing fires delete.'),
	filter: z
		.string()
		.max(10_000)
		.optional()
		.describe(
			"A GROQ filter, for example _type == 'post'. Left out: every document.",
		),
	projection: z
		.string()
		.max(10_000)
		.optional()
		.describe(
			"The body to send, as a GROQ projection, for example { _id, title, 'slug': slug.current }. Left out: the whole document.",
		),
	includeDrafts: z
		.boolean()
		.optional()
		.describe('Fire on drafts too. Default false: published documents only.'),
	secret: z
		.string()
		.min(16)
		.max(500)
		.optional()
		.describe(
			'Signs every delivery. Store the same value with keys.set_webhook_signature: deliveries without a valid signature are refused.',
		),
	description: z.string().max(1000).optional(),
};

const WebhooksCreateInputSchema = z.object(WebhookFieldsShape);

export type WebhooksCreateInput = z.infer<typeof WebhooksCreateInputSchema>;

const WebhookResponseSchema = z.object({ webhook: WebhookSchema });

export type WebhooksCreateResponse = z.infer<typeof WebhookResponseSchema>;

const WebhooksUpdateInputSchema = z
	.object(WebhookFieldsShape)
	.partial()
	.extend({
		id: z.string().min(1),
		disabled: z
			.boolean()
			.optional()
			.describe('true pauses deliveries, false resumes them.'),
	});

export type WebhooksUpdateInput = z.infer<typeof WebhooksUpdateInputSchema>;

export type WebhooksUpdateResponse = z.infer<typeof WebhookResponseSchema>;

const WebhooksDeleteInputSchema = z.object({ id: z.string().min(1) });

export type WebhooksDeleteInput = z.infer<typeof WebhooksDeleteInputSchema>;

const WebhooksDeleteResponseSchema = z
	.object({
		id: z.string().nullish(),
		// Documented as a boolean; the API answers a count (1).
		deleted: z
			.union([z.boolean(), z.number()])
			.nullish()
			.transform((value) => (value == null ? value : Boolean(value))),
	})
	.loose();

export type WebhooksDeleteResponse = z.infer<
	typeof WebhooksDeleteResponseSchema
>;

const WebhooksAttemptsInputSchema = z.object({
	id: z.string().min(1),
	state: z
		.enum(['success', 'failure'])
		.optional()
		.describe('Only successful or only failed attempts.'),
	limit: z.number().int().min(1).max(100).optional().describe('Default 25.'),
	offset: z.number().int().min(0).optional(),
});

export type WebhooksAttemptsInput = z.infer<typeof WebhooksAttemptsInputSchema>;

const WebhooksAttemptsResponseSchema = z.object({
	attempts: z.array(
		z
			.object({
				id: z.string(),
				isFailure: z.boolean().nullish(),
				failureReason: z
					.string()
					.nullish()
					.describe('timeout, network, http or other.'),
				resultCode: z
					.number()
					.nullish()
					.describe('The HTTP status your endpoint answered.'),
				resultBody: z.string().nullish(),
				duration: z.number().nullish(),
				createdAt: z.string().nullish(),
				messageId: z.string().nullish(),
			})
			.loose(),
	),
});

export type WebhooksAttemptsResponse = z.infer<
	typeof WebhooksAttemptsResponseSchema
>;

// ── Maps ────────────────────────────────────────────────────────────────────

export type SanityEndpointInputs = {
	documentsQuery: DocumentsQueryInput;
	documentsGet: DocumentsGetInput;
	documentsCreate: DocumentsCreateInput;
	documentsEdit: DocumentsEditInput;
	documentsPatch: DocumentsPatchInput;
	documentsPublish: DocumentsPublishInput;
	documentsUnpublish: DocumentsUnpublishInput;
	documentsDiscardDraft: DocumentsDiscardDraftInput;
	documentsDelete: DocumentsDeleteInput;
	documentsMutate: DocumentsMutateInput;
	documentsHistory: DocumentsHistoryInput;
	documentsTransactions: DocumentsTransactionsInput;
	assetsUpload: AssetsUploadInput;
	datasetsList: DatasetsListInput;
	datasetsCreate: DatasetsCreateInput;
	datasetsDelete: DatasetsDeleteInput;
	schemasList: SchemasListInput;
	agentActionsGenerate: AgentGenerateInput;
	agentActionsTransform: AgentTransformInput;
	agentActionsTranslate: AgentTranslateInput;
	agentActionsPrompt: AgentPromptInput;
	webhooksList: WebhooksListInput;
	webhooksCreate: WebhooksCreateInput;
	webhooksUpdate: WebhooksUpdateInput;
	webhooksDelete: WebhooksDeleteInput;
	webhooksAttempts: WebhooksAttemptsInput;
};

export type SanityEndpointOutputs = {
	documentsQuery: DocumentsQueryResponse;
	documentsGet: DocumentsGetResponse;
	documentsCreate: DocumentsCreateResponse;
	documentsEdit: DocumentsEditResponse;
	documentsPatch: DocumentsPatchResponse;
	documentsPublish: DocumentsPublishResponse;
	documentsUnpublish: DocumentsUnpublishResponse;
	documentsDiscardDraft: DocumentsDiscardDraftResponse;
	documentsDelete: DocumentsDeleteResponse;
	documentsMutate: DocumentsMutateResponse;
	documentsHistory: DocumentsHistoryResponse;
	documentsTransactions: DocumentsTransactionsResponse;
	assetsUpload: AssetsUploadResponse;
	datasetsList: DatasetsListResponse;
	datasetsCreate: DatasetsCreateResponse;
	datasetsDelete: DatasetsDeleteResponse;
	schemasList: SchemasListResponse;
	agentActionsGenerate: AgentGenerateResponse;
	agentActionsTransform: AgentTransformResponse;
	agentActionsTranslate: AgentTranslateResponse;
	agentActionsPrompt: AgentPromptResponse;
	webhooksList: WebhooksListResponse;
	webhooksCreate: WebhooksCreateResponse;
	webhooksUpdate: WebhooksUpdateResponse;
	webhooksDelete: WebhooksDeleteResponse;
	webhooksAttempts: WebhooksAttemptsResponse;
};

export const SanityEndpointInputSchemas = {
	documentsQuery: DocumentsQueryInputSchema,
	documentsGet: DocumentsGetInputSchema,
	documentsCreate: DocumentsCreateInputSchema,
	documentsEdit: DocumentsEditInputSchema,
	documentsPatch: DocumentsPatchInputSchema,
	documentsPublish: DocumentsPublishInputSchema,
	documentsUnpublish: DocumentsUnpublishInputSchema,
	documentsDiscardDraft: DocumentsDiscardDraftInputSchema,
	documentsDelete: DocumentsDeleteInputSchema,
	documentsMutate: DocumentsMutateInputSchema,
	documentsHistory: DocumentsHistoryInputSchema,
	documentsTransactions: DocumentsTransactionsInputSchema,
	assetsUpload: AssetsUploadInputSchema,
	datasetsList: DatasetsListInputSchema,
	datasetsCreate: DatasetsCreateInputSchema,
	datasetsDelete: DatasetsDeleteInputSchema,
	schemasList: SchemasListInputSchema,
	agentActionsGenerate: AgentGenerateInputSchema,
	agentActionsTransform: AgentTransformInputSchema,
	agentActionsTranslate: AgentTranslateInputSchema,
	agentActionsPrompt: AgentPromptInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
	webhooksAttempts: WebhooksAttemptsInputSchema,
} as const;

export const SanityEndpointOutputSchemas = {
	documentsQuery: DocumentsQueryResponseSchema,
	documentsGet: DocumentsGetResponseSchema,
	documentsCreate: DocumentChangeResponseSchema,
	documentsEdit: DocumentChangeResponseSchema,
	documentsPatch: DocumentsPatchResponseSchema,
	documentsPublish: DocumentIdsReceiptSchema,
	documentsUnpublish: DocumentIdsReceiptSchema,
	documentsDiscardDraft: DocumentIdsReceiptSchema,
	documentsDelete: DocumentsDeleteResponseSchema,
	documentsMutate: DocumentsMutateResponseSchema,
	documentsHistory: DocumentsHistoryResponseSchema,
	documentsTransactions: DocumentsTransactionsResponseSchema,
	assetsUpload: AssetsUploadResponseSchema,
	datasetsList: DatasetsListResponseSchema,
	datasetsCreate: DatasetsCreateResponseSchema,
	datasetsDelete: DatasetsDeleteResponseSchema,
	schemasList: SchemasListResponseSchema,
	agentActionsGenerate: AgentDocumentResponseSchema,
	agentActionsTransform: AgentDocumentResponseSchema,
	agentActionsTranslate: AgentDocumentResponseSchema,
	agentActionsPrompt: AgentPromptResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksCreate: WebhookResponseSchema,
	webhooksUpdate: WebhookResponseSchema,
	webhooksDelete: WebhooksDeleteResponseSchema,
	webhooksAttempts: WebhooksAttemptsResponseSchema,
} as const;
