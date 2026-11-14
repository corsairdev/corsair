import { z } from 'zod';

export const FiberyJsonSchema = z.json();
export type FiberyJson = z.infer<typeof FiberyJsonSchema>;
export const FiberyRecordSchema = z.record(z.string(), FiberyJsonSchema);
const WorkspaceTypeSchema = z.string().min(1);
const UuidSchema = z.string().uuid();
const QuerySchema = z
	.object({
		'q/from': WorkspaceTypeSchema,
		'q/select': z.array(FiberyJsonSchema).min(1),
		'q/where': FiberyJsonSchema.optional(),
		'q/order-by': FiberyJsonSchema.optional(),
		'q/offset': z.number().int().nonnegative().optional(),
		'q/limit': z.number().int().positive().optional(),
	})
	.strict()
	.superRefine((query, ctx) => {
		// Fibery's top-level count query (`['q/count', [...]]`) takes no q/limit; entity lists need one.
		const isCount = query['q/select'][0] === 'q/count';
		if (!isCount && query['q/limit'] === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['q/limit'],
				message: 'q/limit is required unless q/select is a q/count aggregate.',
			});
		}
	});
const HistoryWhereSchema = z
	.object({
		field: z.enum([
			'id',
			'action',
			'entityPublicId',
			'entityState',
			'author',
			'typeId',
			'entityTypeId',
			'entityName',
			'entityId',
			'field',
		]),
		operator: z.enum(['=', 'in', 'contains', 'not-in', 'empty', 'not-empty']),
		value: FiberyJsonSchema.optional(),
	})
	.strict();
const HistoryTimeframeSchema = z
	.object({ start: z.string().datetime(), end: z.string().datetime() })
	.strict()
	.refine(({ start, end }) => {
		const startDate = new Date(start);
		const endDate = new Date(end);
		const oneYearLater = new Date(startDate);
		oneYearLater.setUTCFullYear(oneYearLater.getUTCFullYear() + 1);
		return (
			endDate.getTime() >= startDate.getTime() &&
			endDate.getTime() <= oneYearLater.getTime()
		);
	}, 'Fibery history timeframe must be ordered and span no more than one year.');

export const FiberyEndpointInputSchemas = {
	schemaQuery: z.object({ withDescription: z.boolean().optional() }).strict(),
	databaseCreate: z.object({ database: FiberyRecordSchema }).strict(),
	databaseRename: z
		.object({ fromName: WorkspaceTypeSchema, toName: WorkspaceTypeSchema })
		.strict(),
	databaseDelete: z
		.object({
			name: WorkspaceTypeSchema,
			deleteEntities: z.boolean().optional(),
			deleteRelatedFields: z.boolean().optional(),
		})
		.strict(),
	fieldCreate: z
		.object({
			holderType: WorkspaceTypeSchema,
			name: WorkspaceTypeSchema,
			type: WorkspaceTypeSchema,
			meta: FiberyRecordSchema.optional(),
		})
		.strict(),
	enumCreate: z.object({ name: WorkspaceTypeSchema }).strict(),
	fieldRename: z
		.object({
			holderType: WorkspaceTypeSchema,
			fromName: WorkspaceTypeSchema,
			toName: WorkspaceTypeSchema,
		})
		.strict(),
	fieldDelete: z
		.object({
			holderType: WorkspaceTypeSchema,
			name: WorkspaceTypeSchema,
			deleteValues: z.boolean().optional(),
		})
		.strict(),
	fieldSetMeta: z
		.object({
			holderType: WorkspaceTypeSchema,
			name: WorkspaceTypeSchema,
			key: z.string().min(1),
			value: FiberyJsonSchema,
		})
		.strict(),
	installMixins: z
		.object({ types: z.record(z.string(), z.array(z.string())) })
		.strict(),
	entityQuery: z
		.object({
			query: QuerySchema,
			params: z.record(z.string(), FiberyJsonSchema).optional(),
		})
		.strict(),
	entityCreate: z
		.object({ type: WorkspaceTypeSchema, entity: FiberyRecordSchema })
		.strict(),
	entityUpdate: z
		.object({ type: WorkspaceTypeSchema, entity: FiberyRecordSchema })
		.strict(),
	entityDelete: z
		.object({ type: WorkspaceTypeSchema, id: UuidSchema })
		.strict(),
	entityUpsert: z
		.object({
			type: WorkspaceTypeSchema,
			// Fibery rejects upsert entities without fibery/id (create-or-update-entities-without-id-failed).
			entities: z
				.array(z.object({ 'fibery/id': UuidSchema }).catchall(FiberyJsonSchema))
				.min(1),
			conflictField: WorkspaceTypeSchema,
			conflictAction: z.enum(['skip-create', 'update-latest']),
		})
		.strict(),
	collectionAdd: z
		.object({
			type: WorkspaceTypeSchema,
			field: WorkspaceTypeSchema,
			entityId: UuidSchema,
			itemIds: z.array(UuidSchema).min(1),
		})
		.strict(),
	collectionRemove: z
		.object({
			type: WorkspaceTypeSchema,
			field: WorkspaceTypeSchema,
			entityId: UuidSchema,
			itemIds: z.array(UuidSchema).min(1),
		})
		.strict(),
	collectionSet: z
		.object({
			type: WorkspaceTypeSchema,
			field: WorkspaceTypeSchema,
			entityId: UuidSchema,
			itemIds: z.array(UuidSchema),
		})
		.strict(),
	collectionReset: z
		.object({
			type: WorkspaceTypeSchema,
			field: WorkspaceTypeSchema,
			entityId: UuidSchema,
		})
		.strict(),
	documentGet: z
		.object({
			secret: UuidSchema,
			format: z.enum(['md', 'html', 'json', 'plain-text']).optional(),
		})
		.strict(),
	documentGetBatch: z.object({ secrets: z.array(UuidSchema).min(1) }).strict(),
	documentUpdate: z
		.object({
			secret: UuidSchema,
			format: z.enum(['md', 'html', 'json']).optional(),
			content: z.string(),
		})
		.strict(),
	documentUpdateBatch: z
		.object({
			format: z.enum(['md', 'html', 'json']).optional(),
			documents: z
				.array(z.object({ secret: UuidSchema, content: z.string() }).strict())
				.min(1),
		})
		.strict(),
	fileUpload: z
		.object({
			name: z.string().min(1),
			contentType: z.string().min(1),
			base64: z.string(),
		})
		.strict(),
	fileDownload: z.object({ secret: UuidSchema }).strict(),
	fileSignUrls: z.object({ secrets: z.array(UuidSchema).min(1) }).strict(),
	viewsQuery: z
		.object({
			ids: z.array(UuidSchema).optional(),
			publicIds: z.array(z.string()).optional(),
			isPrivate: z.boolean().optional(),
			container: FiberyRecordSchema.optional(),
		})
		.strict(),
	viewsCreate: z.object({ views: z.array(FiberyRecordSchema).min(1) }).strict(),
	viewsUpdate: z
		.object({
			updates: z
				.array(
					z.object({ id: UuidSchema, values: FiberyRecordSchema }).strict(),
				)
				.min(1),
		})
		.strict(),
	viewsDelete: z.object({ ids: z.array(UuidSchema).min(1) }).strict(),
	historySearch: z
		.object({
			where: z.array(HistoryWhereSchema).optional(),
			timeframe: HistoryTimeframeSchema.optional(),
			limit: z.number().int().positive(),
			excludeAutomaticChanges: z
				.array(
					z.enum(['automations', 'integrations', 'formulas', 'auto-linking']),
				)
				.optional(),
			sinceItem: z.string().optional(),
		})
		.strict(),
} as const;

// md, html and plain-text return content as a string; json returns a ProseMirror-style object.
// Loose because the live API also returns modificationDate, which the guide does not list.
const FiberyDocumentSchema = z
	.object({
		secret: z.string(),
		content: z.union([z.string(), FiberyRecordSchema]),
		modificationDate: z.string().optional(),
	})
	.catchall(FiberyJsonSchema);

export const FiberyEndpointOutputSchemas = {
	schemaQuery: FiberyJsonSchema,
	databaseCreate: FiberyJsonSchema,
	databaseRename: FiberyJsonSchema,
	databaseDelete: FiberyJsonSchema,
	fieldCreate: FiberyJsonSchema,
	enumCreate: FiberyJsonSchema,
	fieldRename: FiberyJsonSchema,
	fieldDelete: FiberyJsonSchema,
	fieldSetMeta: FiberyJsonSchema,
	installMixins: FiberyJsonSchema,
	entityQuery: z.union([z.array(FiberyRecordSchema), z.number()]),
	// Fibery answers create and update with the entity object (fibery/id and the written fields).
	entityCreate: FiberyRecordSchema,
	entityUpdate: FiberyRecordSchema,
	entityDelete: FiberyJsonSchema,
	entityUpsert: z.array(FiberyJsonSchema),
	collectionAdd: FiberyJsonSchema,
	collectionRemove: FiberyJsonSchema,
	collectionSet: FiberyJsonSchema,
	collectionReset: FiberyJsonSchema,
	documentGet: FiberyDocumentSchema,
	documentGetBatch: z.array(FiberyDocumentSchema),
	documentUpdate: FiberyJsonSchema,
	documentUpdateBatch: FiberyJsonSchema,
	// Loose: the live upload also returns fibery/temp? and fibery/checksum, which the guide does not list.
	fileUpload: z
		.object({
			'fibery/id': UuidSchema,
			'fibery/name': z.string(),
			'fibery/content-type': z.string(),
			'fibery/secret': UuidSchema,
			'fibery/content-length': z.number(),
			'fibery/rank': z.number(),
		})
		.catchall(FiberyJsonSchema),
	fileDownload: z
		.object({
			kind: z.literal('binary'),
			contentType: z.string(),
			base64: z.string(),
		})
		.strict(),
	fileSignUrls: z
		.object({
			items: z.array(
				z
					.object({
						secret: UuidSchema,
						url: z.string().url(),
						expiresAt: z.string(),
					})
					.strict(),
			),
		})
		.strict(),
	viewsQuery: z.array(FiberyRecordSchema),
	viewsCreate: FiberyJsonSchema,
	viewsUpdate: FiberyJsonSchema,
	viewsDelete: FiberyJsonSchema,
	historySearch: z
		.object({
			items: z.array(FiberyRecordSchema),
			nextPage: FiberyRecordSchema,
		})
		.strict(),
} as const;

export type FiberyEndpointInputs = {
	[K in keyof typeof FiberyEndpointInputSchemas]: z.infer<
		(typeof FiberyEndpointInputSchemas)[K]
	>;
};

export type FiberyEndpointOutputs = {
	[K in keyof typeof FiberyEndpointOutputSchemas]: z.infer<
		(typeof FiberyEndpointOutputSchemas)[K]
	>;
};

export type FiberyOperation = keyof FiberyEndpointInputs;
