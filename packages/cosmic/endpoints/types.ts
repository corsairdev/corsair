import { z } from 'zod';

export const BucketSlugSchema = z.string().min(1).optional();

const StatusSchema = z.enum(['published', 'draft', 'any']);

const CosmicObjectSchema = z
	.object({
		id: z.string(),
		slug: z.string(),
		title: z.string(),
		type: z.string(),
		status: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		created_at: z.string().optional(),
		modified_at: z.string().optional(),
		published_at: z.string().optional(),
		bucket: z.string().optional(),
	})
	.passthrough();

const ObjectsEnvelopeSchema = z
	.object({
		objects: z.array(CosmicObjectSchema),
		total: z.number(),
		limit: z.number().optional(),
	})
	.passthrough();

const SingleObjectEnvelopeSchema = z
	.object({
		object: CosmicObjectSchema,
	})
	.passthrough();

const MessageEnvelopeSchema = z
	.object({
		message: z.string(),
	})
	.passthrough();

const ObjectsFindInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	type: z.string().min(1).optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	props: z.string().min(1).optional(),
	status: StatusSchema.optional(),
	sort: z.string().min(1).optional(),
	limit: z.number().int().positive().optional(),
	skip: z.number().int().nonnegative().optional(),
	after: z.string().min(1).optional(),
	depth: z.number().int().nonnegative().optional(),
});

const ObjectsFindOneInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	type: z.string().min(1),
	slug: z.string().min(1),
	props: z.string().min(1).optional(),
	status: StatusSchema.optional(),
	depth: z.number().int().nonnegative().optional(),
});

const ObjectByIdInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	id: z.string().min(1),
	props: z.string().min(1).optional(),
	status: StatusSchema.optional(),
	depth: z.number().int().nonnegative().optional(),
});

const ObjectInsertInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	title: z.string().min(1),
	type: z.string().min(1),
	slug: z.string().min(1).optional(),
	status: z.enum(['published', 'draft']).optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	trigger_webhook: z.boolean().optional(),
});

const ObjectUpdateInputSchema = z
	.object({
		bucketSlug: BucketSlugSchema,
		id: z.string().min(1),
		title: z.string().min(1).optional(),
		slug: z.string().min(1).optional(),
		status: z.enum(['published', 'draft']).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		trigger_webhook: z.boolean().optional(),
	})
	.superRefine((value, ctx) => {
		if (
			value.title === undefined &&
			value.slug === undefined &&
			value.status === undefined &&
			value.metadata === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide at least one field to update',
			});
		}
	});

const ObjectDeleteInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	id: z.string().min(1),
	trigger_webhook: z.boolean().optional(),
});

const BatchOperationSchema = z
	.object({
		method: z.enum(['add', 'edit', 'delete']),
		object_id: z.string().min(1).optional(),
		object: z.record(z.string(), z.unknown()).optional(),
		trigger_webhook: z.boolean().optional(),
	})
	.superRefine((value, ctx) => {
		if (
			(value.method === 'edit' || value.method === 'delete') &&
			!value.object_id
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'object_id is required for edit and delete operations',
			});
		}
		if ((value.method === 'add' || value.method === 'edit') && !value.object) {
			ctx.addIssue({
				code: 'custom',
				message: 'object is required for add and edit operations',
			});
		}
	});

const ObjectsBatchInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	operations: z.array(BatchOperationSchema).min(1).max(25),
});

const BatchResultSchema = z
	.object({
		method: z.string(),
		status: z.string(),
		object: z.record(z.string(), z.unknown()).optional(),
		message: z.string().optional(),
	})
	.passthrough();

const ObjectsBatchResponseSchema = z
	.object({
		operations: z.array(BatchResultSchema),
	})
	.passthrough();

const RevisionSchema = z
	.object({
		id: z.string(),
		object_id: z.string(),
		title: z.string(),
		slug: z.string(),
		status: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

const RevisionsEnvelopeSchema = z
	.object({
		revisions: z.array(RevisionSchema),
		total: z.number(),
		limit: z.number().optional(),
	})
	.passthrough();

const SingleRevisionEnvelopeSchema = z
	.object({
		revision: RevisionSchema,
	})
	.passthrough();

const RevisionsFindInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	objectId: z.string().min(1),
	props: z.string().min(1).optional(),
	limit: z.number().int().positive().optional(),
	skip: z.number().int().nonnegative().optional(),
	sort: z.enum(['created_at', '-created_at']).optional(),
});

const RevisionFindOneInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	objectId: z.string().min(1),
	revisionId: z.string().min(1),
	props: z.string().min(1).optional(),
});

const RevisionInsertInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	objectId: z.string().min(1),
	title: z.string().min(1).optional(),
	slug: z.string().min(1).optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	trigger_webhook: z.boolean().optional(),
});

const MediaSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		original_name: z.string().optional(),
		url: z.string().optional(),
		imgix_url: z.string().optional(),
		folder: z.string().optional(),
		alt_text: z.string().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
		size: z.union([z.number(), z.string()]).optional(),
		type: z.string().optional(),
		bucket: z.string().optional(),
		created_at: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

const MediaEnvelopeSchema = z
	.object({
		media: z.array(MediaSchema),
		total: z.number(),
		limit: z.number().optional(),
	})
	.passthrough();

const SingleMediaEnvelopeSchema = z
	.object({
		media: MediaSchema,
	})
	.passthrough();

const MediaFindInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	query: z.record(z.string(), z.unknown()).optional(),
	props: z.string().min(1).optional(),
	sort: z.string().min(1).optional(),
	limit: z.number().int().positive().optional(),
	skip: z.number().int().nonnegative().optional(),
});

const MediaFindOneInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	name: z.string().min(1),
	props: z.string().min(1).optional(),
});

const Base64Schema = z
	.string()
	.min(1)
	.refine((value) => {
		if (value.length % 4 !== 0) return false;
		return /^[A-Za-z0-9+/]*={0,2}$/.test(value);
	}, 'Expected base64-encoded data');

const MediaInsertInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	filename: z.string().min(1),
	contentType: z.string().min(1),
	data: Base64Schema,
	folder: z.string().min(1).optional(),
	alt_text: z.string().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	trigger_webhook: z.boolean().optional(),
});

const MediaUpdateInputSchema = z
	.object({
		bucketSlug: BucketSlugSchema,
		id: z.string().min(1),
		folder: z.string().min(1).optional(),
		alt_text: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		trigger_webhook: z.boolean().optional(),
	})
	.superRefine((value, ctx) => {
		if (
			value.folder === undefined &&
			value.alt_text === undefined &&
			value.metadata === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide at least one field to update',
			});
		}
	});

const MediaDeleteInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	id: z.string().min(1),
	trigger_webhook: z.boolean().optional(),
});

const MetafieldSchema = z
	.object({
		id: z.string().optional(),
		title: z.string(),
		key: z.string(),
		type: z.string(),
		required: z.boolean().optional(),
	})
	.passthrough();

const ObjectTypeSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		slug: z.string(),
		singular: z.string().optional(),
		singleton: z.boolean().optional(),
		emoji: z.string().optional(),
		metafields: z.array(MetafieldSchema).optional(),
		created_at: z.string().optional(),
		modified_at: z.string().optional(),
	})
	.passthrough();

const ObjectTypesEnvelopeSchema = z
	.object({
		object_types: z.array(ObjectTypeSchema),
	})
	.passthrough();

const SingleObjectTypeEnvelopeSchema = z
	.object({
		object_type: ObjectTypeSchema,
	})
	.passthrough();

const ObjectTypesFindOneInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	slug: z.string().min(1),
});

const EmptyBucketInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
});

const ObjectTypeInsertInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	title: z.string().min(1),
	slug: z.string().min(1).optional(),
	singular: z.string().min(1).optional(),
	singleton: z.boolean().optional(),
	emoji: z.string().optional(),
	metafields: z.array(MetafieldSchema).optional(),
	localization: z.boolean().optional(),
	options: z
		.object({ slug_field: z.boolean().optional() })
		.passthrough()
		.optional(),
});

const ObjectTypeUpdateInputSchema = z
	.object({
		bucketSlug: BucketSlugSchema,
		slug: z.string().min(1),
		title: z.string().min(1).optional(),
		singular: z.string().min(1).optional(),
		singleton: z.boolean().optional(),
		emoji: z.string().optional(),
		metafields: z.array(MetafieldSchema).optional(),
	})
	.superRefine((value, ctx) => {
		if (
			value.title === undefined &&
			value.singular === undefined &&
			value.singleton === undefined &&
			value.emoji === undefined &&
			value.metafields === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide at least one field to update',
			});
		}
	});

const ObjectTypeDeleteInputSchema = z.object({
	bucketSlug: BucketSlugSchema,
	slug: z.string().min(1),
	trigger_webhook: z.boolean().optional(),
});

export type CosmicObject = z.infer<typeof CosmicObjectSchema>;
export type ObjectsFindInput = z.input<typeof ObjectsFindInputSchema>;
export type ObjectsFindResponse = z.infer<typeof ObjectsEnvelopeSchema>;
export type ObjectInsertInput = z.input<typeof ObjectInsertInputSchema>;
export type ObjectUpdateInput = z.input<typeof ObjectUpdateInputSchema>;
export type ObjectsBatchInput = z.input<typeof ObjectsBatchInputSchema>;
export type ObjectsBatchResponse = z.infer<typeof ObjectsBatchResponseSchema>;
export type Revision = z.infer<typeof RevisionSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type MediaInsertInput = z.input<typeof MediaInsertInputSchema>;
export type ObjectType = z.infer<typeof ObjectTypeSchema>;

export type CosmicEndpointInputs = {
	objectsFind: ObjectsFindInput;
	objectsFindOne: z.input<typeof ObjectsFindOneInputSchema>;
	objectsGetById: z.input<typeof ObjectByIdInputSchema>;
	objectsInsert: ObjectInsertInput;
	objectsUpdate: ObjectUpdateInput;
	objectsDelete: z.input<typeof ObjectDeleteInputSchema>;
	objectsBatch: ObjectsBatchInput;
	revisionsFind: z.input<typeof RevisionsFindInputSchema>;
	revisionsFindOne: z.input<typeof RevisionFindOneInputSchema>;
	revisionsInsert: z.input<typeof RevisionInsertInputSchema>;
	mediaFind: z.input<typeof MediaFindInputSchema>;
	mediaFindOne: z.input<typeof MediaFindOneInputSchema>;
	mediaInsert: MediaInsertInput;
	mediaUpdate: z.input<typeof MediaUpdateInputSchema>;
	mediaDelete: z.input<typeof MediaDeleteInputSchema>;
	objectTypesFind: z.input<typeof EmptyBucketInputSchema>;
	objectTypesFindOne: z.input<typeof ObjectTypesFindOneInputSchema>;
	objectTypesInsert: z.input<typeof ObjectTypeInsertInputSchema>;
	objectTypesUpdate: z.input<typeof ObjectTypeUpdateInputSchema>;
	objectTypesDelete: z.input<typeof ObjectTypeDeleteInputSchema>;
};

export type CosmicEndpointOutputs = {
	objectsFind: ObjectsFindResponse;
	objectsFindOne: z.infer<typeof SingleObjectEnvelopeSchema>;
	objectsGetById: z.infer<typeof SingleObjectEnvelopeSchema>;
	objectsInsert: z.infer<typeof SingleObjectEnvelopeSchema>;
	objectsUpdate: z.infer<typeof SingleObjectEnvelopeSchema>;
	objectsDelete: z.infer<typeof MessageEnvelopeSchema>;
	objectsBatch: ObjectsBatchResponse;
	revisionsFind: z.infer<typeof RevisionsEnvelopeSchema>;
	revisionsFindOne: z.infer<typeof SingleRevisionEnvelopeSchema>;
	revisionsInsert: z.infer<typeof SingleRevisionEnvelopeSchema>;
	mediaFind: z.infer<typeof MediaEnvelopeSchema>;
	mediaFindOne: z.infer<typeof SingleMediaEnvelopeSchema>;
	mediaInsert: z.infer<typeof SingleMediaEnvelopeSchema>;
	mediaUpdate: z.infer<typeof MessageEnvelopeSchema>;
	mediaDelete: z.infer<typeof MessageEnvelopeSchema>;
	objectTypesFind: z.infer<typeof ObjectTypesEnvelopeSchema>;
	objectTypesFindOne: z.infer<typeof SingleObjectTypeEnvelopeSchema>;
	objectTypesInsert: z.infer<typeof SingleObjectTypeEnvelopeSchema>;
	objectTypesUpdate: z.infer<typeof SingleObjectTypeEnvelopeSchema>;
	objectTypesDelete: z.infer<typeof MessageEnvelopeSchema>;
};

export const CosmicEndpointInputSchemas = {
	objectsFind: ObjectsFindInputSchema,
	objectsFindOne: ObjectsFindOneInputSchema,
	objectsGetById: ObjectByIdInputSchema,
	objectsInsert: ObjectInsertInputSchema,
	objectsUpdate: ObjectUpdateInputSchema,
	objectsDelete: ObjectDeleteInputSchema,
	objectsBatch: ObjectsBatchInputSchema,
	revisionsFind: RevisionsFindInputSchema,
	revisionsFindOne: RevisionFindOneInputSchema,
	revisionsInsert: RevisionInsertInputSchema,
	mediaFind: MediaFindInputSchema,
	mediaFindOne: MediaFindOneInputSchema,
	mediaInsert: MediaInsertInputSchema,
	mediaUpdate: MediaUpdateInputSchema,
	mediaDelete: MediaDeleteInputSchema,
	objectTypesFind: EmptyBucketInputSchema,
	objectTypesFindOne: ObjectTypesFindOneInputSchema,
	objectTypesInsert: ObjectTypeInsertInputSchema,
	objectTypesUpdate: ObjectTypeUpdateInputSchema,
	objectTypesDelete: ObjectTypeDeleteInputSchema,
} as const;

export const CosmicEndpointOutputSchemas = {
	objectsFind: ObjectsEnvelopeSchema,
	objectsFindOne: SingleObjectEnvelopeSchema,
	objectsGetById: SingleObjectEnvelopeSchema,
	objectsInsert: SingleObjectEnvelopeSchema,
	objectsUpdate: SingleObjectEnvelopeSchema,
	objectsDelete: MessageEnvelopeSchema,
	objectsBatch: ObjectsBatchResponseSchema,
	revisionsFind: RevisionsEnvelopeSchema,
	revisionsFindOne: SingleRevisionEnvelopeSchema,
	revisionsInsert: SingleRevisionEnvelopeSchema,
	mediaFind: MediaEnvelopeSchema,
	mediaFindOne: SingleMediaEnvelopeSchema,
	mediaInsert: SingleMediaEnvelopeSchema,
	mediaUpdate: MessageEnvelopeSchema,
	mediaDelete: MessageEnvelopeSchema,
	objectTypesFind: ObjectTypesEnvelopeSchema,
	objectTypesFindOne: SingleObjectTypeEnvelopeSchema,
	objectTypesInsert: SingleObjectTypeEnvelopeSchema,
	objectTypesUpdate: SingleObjectTypeEnvelopeSchema,
	objectTypesDelete: MessageEnvelopeSchema,
} as const;
