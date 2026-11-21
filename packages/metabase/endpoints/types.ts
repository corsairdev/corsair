import { z } from 'zod';

const EmptyInputSchema = z.object({}).strict();
const NamespaceQuerySchema = z
	.object({ namespace: z.string().nullable().optional() })
	.strict();
const CollectionIdSchema = z.union([
	z.number().int().positive(),
	z.string().regex(/^[A-Za-z0-9_-]{21}$/),
]);
const NumericCollectionIdSchema = z.number().int().positive();
const ModelSchema = z.enum([
	'dashboard',
	'table',
	'exploration',
	'dataset',
	'no_models',
	'timeline',
	'snippet',
	'collection',
	'measure',
	'transform',
	'document',
	'pulse',
	'action',
	'metric',
	'card',
]);
const PinnedStateSchema = z.enum(['is_not_pinned', 'is_pinned', 'all']);
const SortDirectionSchema = z.enum(['desc', 'asc']);
const CollectionTypeSchema = z.enum(['remote-synced']);

const CollectionListQuerySchema = z
	.object({
		archived: z.boolean().nullable().optional(),
		'exclude-other-user-collections': z.boolean().nullable().optional(),
		namespace: z.string().nullable().optional(),
		'personal-only': z.boolean().nullable().optional(),
	})
	.strict();

const CollectionCreateBodySchema = z
	.object({
		authority_level: z.literal('official').nullable().optional(),
		description: z.string().nullable().optional(),
		name: z.string().min(1),
		namespace: z.string().nullable().optional(),
		parent_id: z.number().int().positive().nullable().optional(),
	})
	.strict();

const CollectionUpdateBodySchema = z
	.object({
		archived: z.boolean().nullable().optional(),
		authority_level: z.literal('official').nullable().optional(),
		description: z.string().nullable().optional(),
		name: z.string().min(1).nullable().optional(),
		parent_id: z.number().int().positive().nullable().optional(),
	})
	.strict();

const CollectionItemsQuerySchema = z
	.object({
		q: z.string().nullable().optional(),
		'pinned-state': PinnedStateSchema.nullable().optional(),
		archived: z.boolean().nullable().optional(),
		'sort-direction': SortDirectionSchema.nullable().optional(),
		'show-dashboard-questions': z.boolean().nullable().optional(),
		'show-exploration-documents': z.boolean().nullable().optional(),
		'include-available-models': z.boolean().nullable().optional(),
		models: z.array(ModelSchema).nullable().optional(),
		'official-collections-first': z.boolean().nullable().optional(),
		'sort-column': z
			.enum([
				'model',
				'name',
				'last_edited_by',
				'last_edited_at',
				'description',
			])
			.nullable()
			.optional(),
	})
	.strict();

const RootItemsQuerySchema = z
	.object({
		'collection-type': CollectionTypeSchema.nullable().optional(),
		'include-library': z.boolean().nullable().optional(),
		q: z.string().nullable().optional(),
		'pinned-state': PinnedStateSchema.nullable().optional(),
		archived: z.boolean().nullable().optional(),
		'sort-direction': SortDirectionSchema.nullable().optional(),
		'show-dashboard-questions': z.boolean().nullable().optional(),
		'show-exploration-documents': z.boolean().nullable().optional(),
		'include-available-models': z.boolean().nullable().optional(),
		namespace: z.string().nullable().optional(),
		models: z.array(ModelSchema).nullable().optional(),
		'official-collections-first': z.boolean().nullable().optional(),
		'sort-column': z
			.enum([
				'model',
				'name',
				'last_edited_by',
				'last_edited_at',
				'description',
			])
			.nullable()
			.optional(),
	})
	.strict();

const ItemsMetadataQuerySchema = z
	.object({
		models: z.array(ModelSchema).nullable().optional(),
		archived: z.boolean().nullable().optional(),
		namespace: z.string().nullable().optional(),
		'pinned-state': PinnedStateSchema.nullable().optional(),
		'collection-type': CollectionTypeSchema.nullable().optional(),
		'include-library': z.boolean().nullable().optional(),
		'show-dashboard-questions': z.boolean().nullable().optional(),
		'show-exploration-documents': z.boolean().nullable().optional(),
	})
	.strict();

const TreeQuerySchema = z
	.object({
		'exclude-archived': z.boolean().nullable().optional(),
		'exclude-other-user-collections': z.boolean().nullable().optional(),
		'include-library': z.boolean().nullable().optional(),
		namespace: z.string().nullable().optional(),
		namespaces: z.array(z.string()).nullable().optional(),
		shallow: z.boolean().nullable().optional(),
		'collection-id': z.number().int().positive().nullable().optional(),
	})
	.strict();

const CollectionGraphBodySchema = z
	.object({
		groups: z.record(
			z.string(),
			z.record(z.string(), z.enum(['write', 'read', 'none'])),
		),
		namespace: z.string().min(1).nullable().optional(),
		revision: z.number().int().nullable().optional(),
	})
	.strict();

const MoveCandidatesBodySchema = z
	.object({
		card_ids: z
			.array(z.number().int().positive())
			.refine(
				(cardIds) => new Set(cardIds).size === cardIds.length,
				'Card IDs must be unique',
			)
			.optional(),
	})
	.strict()
	.nullable();

const CollectionListInputSchema = z
	.object({ query: CollectionListQuerySchema.optional() })
	.strict();
const CollectionCreateInputSchema = z
	.object({ body: CollectionCreateBodySchema })
	.strict();
const CollectionGetInputSchema = z
	.object({ path: z.object({ id: CollectionIdSchema }).strict() })
	.strict();
const CollectionUpdateInputSchema = z
	.object({
		path: z.object({ id: NumericCollectionIdSchema }).strict(),
		body: CollectionUpdateBodySchema,
	})
	.strict();
const CollectionDeleteInputSchema = z
	.object({ path: z.object({ id: NumericCollectionIdSchema }).strict() })
	.strict();
const CollectionGraphGetInputSchema = z
	.object({ query: NamespaceQuerySchema.optional() })
	.strict();
const CollectionGraphUpdateInputSchema = z
	.object({
		query: z
			.object({
				force: z.boolean().nullable().optional(),
				'skip-graph': z.boolean().nullable().optional(),
			})
			.strict()
			.optional(),
		body: CollectionGraphBodySchema,
	})
	.strict();
const CollectionRootInputSchema = z
	.object({ query: NamespaceQuerySchema.optional() })
	.strict();
const CollectionRootItemsInputSchema = z
	.object({ query: RootItemsQuerySchema.optional() })
	.strict();
const CollectionItemsInputSchema = z
	.object({
		path: z.object({ id: CollectionIdSchema }).strict(),
		query: CollectionItemsQuerySchema.optional(),
	})
	.strict();
const CollectionRootItemsMetadataInputSchema = z
	.object({ query: ItemsMetadataQuerySchema.optional() })
	.strict();
const CollectionItemsMetadataInputSchema = z
	.object({
		path: z.object({ id: CollectionIdSchema }).strict(),
		query: ItemsMetadataQuerySchema.omit({
			namespace: true,
			'collection-type': true,
			'include-library': true,
		}).optional(),
	})
	.strict();
const CollectionTreeInputSchema = z
	.object({ query: TreeQuerySchema.optional() })
	.strict();
const CollectionCandidatesInputSchema = z
	.object({ path: z.object({ id: NumericCollectionIdSchema }).strict() })
	.strict();
const RootMoveCandidatesInputSchema = z
	.object({ body: MoveCandidatesBodySchema.optional() })
	.strict();
const MoveCandidatesInputSchema = z
	.object({
		path: z.object({ id: NumericCollectionIdSchema }).strict(),
		body: MoveCandidatesBodySchema.optional(),
	})
	.strict();

// The official Collection schema documents these two fields as always present and explicitly allows
// endpoint-dependent hydrated fields, so the response keeps additional provider fields intact.
export const CollectionSchema = z
	.object({
		id: z.union([z.number().int().positive(), z.string()]),
		name: z.string(),
	})
	.passthrough();

export type CollectionTreeNode = {
	id: number | string;
	name: string;
	children?: boolean | CollectionTreeNode[];
};

export const CollectionTreeNodeSchema: z.ZodType<CollectionTreeNode> = z.lazy(
	() =>
		z
			.object({
				children: z
					.union([z.boolean(), z.array(CollectionTreeNodeSchema)])
					.optional(),
				id: z.union([z.number().int().positive(), z.string()]),
				name: z.string(),
			})
			// The docs describe additional `here` and `below` fields but omit their schemas from OpenAPI.
			.passthrough(),
);

export const CollectionGraphSchema = z
	.object({
		groups: z.record(
			z.string(),
			z.record(z.string(), z.enum(['write', 'read', 'none'])),
		),
		revision: z.number().int().nullable().optional(),
	})
	.passthrough();

// Metabase publishes empty item schemas in OpenAPI for heterogeneous collection rows and model names;
// z.json() preserves only JSON-compatible provider values instead of asserting an undocumented shape.
const JsonItemSchema = z.record(z.string(), z.json());

export const CollectionItemsResponseSchema = z
	.object({
		available_models: z.array(z.json()).optional(),
		data: z.array(JsonItemSchema),
		limit: z.number().int().nonnegative().nullable().optional(),
		models: z.array(z.json()).nullable(),
		offset: z.number().int().nonnegative().nullable().optional(),
		total: z.number().int().nonnegative(),
	})
	.passthrough();

export const CollectionItemsMetadataSchema = z
	.object({
		available_models: z.array(z.string()),
		total_items: z.number().int().nonnegative(),
	})
	.passthrough();

const CandidateInfoSchema = z
	.object({
		description: z.string().nullable(),
		id: z.number().int().positive(),
		name: z.string(),
	})
	.passthrough();

export const DashboardQuestionCandidatesSchema = z
	.object({
		data: z.array(
			z
				.object({
					description: z.string().nullable(),
					id: z.number().int().positive(),
					name: z.string(),
					sole_dashboard_info: CandidateInfoSchema,
				})
				.passthrough(),
		),
		total: z.number().int(),
	})
	.passthrough();

export const MoveCandidatesResponseSchema = z
	.object({ moved: z.array(z.number().int().positive()) })
	.passthrough();

export const CollectionGraphUpdateResponseSchema = z
	.object({ revision: z.number().int().nullable().optional() })
	.passthrough();

export const CollectionDeleteResponseSchema = z.number().int().nonnegative();

export const MetabaseEndpointInputSchemas = {
	collectionList: CollectionListInputSchema,
	collectionCreate: CollectionCreateInputSchema,
	collectionGet: CollectionGetInputSchema,
	collectionUpdate: CollectionUpdateInputSchema,
	collectionDelete: CollectionDeleteInputSchema,
	collectionGraphGet: CollectionGraphGetInputSchema,
	collectionGraphUpdate: CollectionGraphUpdateInputSchema,
	collectionRootGet: CollectionRootInputSchema,
	collectionRootItems: CollectionRootItemsInputSchema,
	collectionRootItemsMetadata: CollectionRootItemsMetadataInputSchema,
	collectionRootCandidates: EmptyInputSchema,
	collectionRootMoveCandidates: RootMoveCandidatesInputSchema,
	collectionTrashGet: EmptyInputSchema,
	collectionTree: CollectionTreeInputSchema,
	collectionCandidates: CollectionCandidatesInputSchema,
	collectionMoveCandidates: MoveCandidatesInputSchema,
	collectionItems: CollectionItemsInputSchema,
	collectionItemsMetadata: CollectionItemsMetadataInputSchema,
} as const;

export type MetabaseEndpointInputs = {
	[K in keyof typeof MetabaseEndpointInputSchemas]: z.infer<
		(typeof MetabaseEndpointInputSchemas)[K]
	>;
};

export const MetabaseEndpointOutputSchemas = {
	collectionList: z.array(CollectionSchema),
	collectionCreate: CollectionSchema,
	collectionGet: CollectionSchema,
	collectionUpdate: CollectionSchema,
	collectionDelete: CollectionDeleteResponseSchema,
	collectionGraphGet: CollectionGraphSchema,
	collectionGraphUpdate: CollectionGraphUpdateResponseSchema,
	collectionRootGet: CollectionSchema,
	collectionRootItems: CollectionItemsResponseSchema,
	collectionRootItemsMetadata: CollectionItemsMetadataSchema,
	collectionRootCandidates: DashboardQuestionCandidatesSchema,
	collectionRootMoveCandidates: MoveCandidatesResponseSchema,
	collectionTrashGet: CollectionSchema,
	collectionTree: z.array(CollectionTreeNodeSchema),
	collectionCandidates: DashboardQuestionCandidatesSchema,
	collectionMoveCandidates: MoveCandidatesResponseSchema,
	collectionItems: CollectionItemsResponseSchema,
	collectionItemsMetadata: CollectionItemsMetadataSchema,
} as const;

export type MetabaseEndpointOutputs = {
	[K in keyof typeof MetabaseEndpointOutputSchemas]: z.infer<
		(typeof MetabaseEndpointOutputSchemas)[K]
	>;
};
