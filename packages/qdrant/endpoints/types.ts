import { z } from 'zod';

// `.` and `..` would be resolved as URL dot-segments and hit a parent resource.
const PathSegment = z
	.string()
	.min(1)
	.refine((s) => s !== '.' && s !== '..', 'Must not be `.` or `..`');
const CollectionName = PathSegment;

export const PointId = z.union([
	z.number().int().nonnegative(),
	z.string().min(1),
]);

const Payload = z.record(z.string(), z.unknown());
const Config = z.record(z.string(), z.unknown());

const DenseVector = z.array(z.number());
const MultiVector = z.array(z.array(z.number()));
const SparseVector = z.object({
	indices: z.array(z.number().int().nonnegative()),
	values: z.array(z.number()),
});
const InferenceInput = z.object({ model: z.string() }).loose();

const Vector = z.union([
	DenseVector,
	MultiVector,
	SparseVector,
	InferenceInput,
]);
const VectorStruct = z.union([
	DenseVector,
	MultiVector,
	InferenceInput,
	z.record(z.string(), Vector),
]);

// Qdrant validates the many condition kinds itself.
const Condition = z.record(z.string(), z.unknown());
const Conditions = z.union([Condition, z.array(Condition)]);
const Filter = z
	.object({
		must: Conditions.optional(),
		should: Conditions.optional(),
		must_not: Conditions.optional(),
		min_should: z
			.object({ conditions: z.array(Condition), min_count: z.number().int() })
			.optional(),
	})
	.loose();

const ShardKey = z.union([z.string(), z.number().int().nonnegative()]);
const ShardKeySelector = z.union([
	ShardKey,
	z.array(ShardKey),
	z.object({}).loose(),
]);

const WithPayload = z.union([
	z.boolean(),
	z.array(z.string()),
	z.object({ include: z.array(z.string()) }),
	z.object({ exclude: z.array(z.string()) }),
]);
const WithVector = z.union([z.boolean(), z.array(z.string())]);

const Timeout = z
	.number()
	.int()
	.positive()
	.optional()
	.describe('Request timeout in seconds');

const WriteOptions = {
	wait: z
		.boolean()
		.default(true)
		.describe('Wait until the change is applied (Qdrant defaults to false)'),
	ordering: z.enum(['weak', 'medium', 'strong']).optional(),
	timeout: Timeout,
};

const ReadOptions = {
	consistency: z
		.union([z.number().int().positive(), z.enum(['majority', 'quorum', 'all'])])
		.optional(),
	timeout: Timeout,
};

const Selector = {
	points: z.array(PointId).min(1).optional(),
	filter: Filter.optional(),
	shard_key: ShardKeySelector.optional(),
};
const oneSelector = [
	(v: { points?: unknown; filter?: unknown }) =>
		(v.points === undefined) !== (v.filter === undefined),
	{ message: 'Provide exactly one of `points` or `filter`' },
] as const;

const UpdateResult = z
	.object({
		operation_id: z.number().int().nullable().optional(),
		// A string, not an enum: an unknown status must not report an applied write as failed.
		status: z.string().describe('acknowledged | completed | wait_timeout'),
	})
	.loose();

const PointRecord = z
	.object({
		id: PointId,
		payload: Payload.nullable().optional(),
		vector: z
			.union([
				DenseVector,
				MultiVector,
				z.record(z.string(), z.union([DenseVector, MultiVector, SparseVector])),
			])
			.nullable()
			.optional(),
		shard_key: ShardKey.nullable().optional(),
		order_value: z.number().nullable().optional(),
	})
	.loose();

const ScoredPoint = PointRecord.extend({
	version: z.number().int(),
	score: z.number(),
});

const QueryResponse = z.object({ points: z.array(ScoredPoint) });

const CollectionInfo = z
	.object({
		status: z.enum(['green', 'yellow', 'grey', 'red']),
		optimizer_status: z.union([
			z.literal('ok'),
			z.object({ error: z.string() }),
		]),
		points_count: z.number().int().nullable().optional(),
		indexed_vectors_count: z.number().int().nullable().optional(),
		segments_count: z.number().int(),
		config: Config,
		payload_schema: Config,
	})
	.loose();

const Alias = z.object({ alias_name: z.string(), collection_name: z.string() });

const Snapshot = z
	.object({
		name: z.string(),
		creation_time: z.string().nullable().optional(),
		size: z.number().int(),
		checksum: z.string().nullable().optional(),
	})
	.loose();

const VectorParams = z
	.object({
		size: z.number().int().positive(),
		distance: z.enum(['Cosine', 'Euclid', 'Dot', 'Manhattan']),
		datatype: z.enum(['float32', 'float16', 'uint8', 'turbo4']).optional(),
		on_disk: z.boolean().optional(),
		multivector_config: z
			.object({ comparator: z.literal('max_sim') })
			.optional(),
	})
	.loose();

const CollectionsCreate = z.object({
	collectionName: CollectionName,
	vectors: z
		.union([VectorParams, z.record(z.string(), VectorParams)])
		.optional(),
	sparse_vectors: z
		.record(
			z.string(),
			z.object({ modifier: z.enum(['none', 'idf']).optional() }).loose(),
		)
		.optional(),
	shard_number: z.number().int().positive().optional(),
	sharding_method: z.enum(['auto', 'custom']).optional(),
	replication_factor: z.number().int().positive().optional(),
	write_consistency_factor: z.number().int().positive().optional(),
	on_disk_payload: z.boolean().optional(),
	hnsw_config: Config.optional(),
	wal_config: Config.optional(),
	optimizers_config: Config.optional(),
	quantization_config: Config.optional(),
	strict_mode_config: Config.optional(),
	id_tracker: Config.optional(),
	payload: Config.optional().describe('Payload storage configuration'),
	metadata: Payload.optional(),
	timeout: Timeout,
});

const CollectionsUpdate = z.object({
	collectionName: CollectionName,
	vectors: z.record(z.string(), Config).optional(),
	sparse_vectors: z.record(z.string(), Config).optional(),
	params: Config.optional(),
	hnsw_config: Config.optional(),
	optimizers_config: Config.optional(),
	quantization_config: z.union([Config, z.literal('Disabled')]).optional(),
	strict_mode_config: Config.optional(),
	metadata: Payload.optional(),
	timeout: Timeout,
});

const AliasesUpdate = z.object({
	actions: z
		.array(
			z.union([
				z.object({
					create_alias: z.object({
						collection_name: z.string().min(1),
						alias_name: z.string().min(1),
					}),
				}),
				z.object({ delete_alias: z.object({ alias_name: z.string().min(1) }) }),
				z.object({
					rename_alias: z.object({
						old_alias_name: z.string().min(1),
						new_alias_name: z.string().min(1),
					}),
				}),
			]),
		)
		.min(1)
		.describe('Applied atomically'),
	timeout: Timeout,
});

const PayloadSchemaType = z.enum([
	'keyword',
	'integer',
	'float',
	'geo',
	'text',
	'bool',
	'datetime',
	'uuid',
]);

const PayloadIndexesCreate = z.object({
	collectionName: CollectionName,
	field_name: z
		.string()
		.min(1)
		.describe('Payload key, with dots for nested fields'),
	field_schema: z.union([
		PayloadSchemaType,
		z.object({ type: PayloadSchemaType }).loose(),
	]),
	...WriteOptions,
});

const PointsUpsert = z.object({
	collectionName: CollectionName,
	points: z
		.array(
			z.object({
				id: PointId,
				vector: VectorStruct,
				payload: Payload.nullable().optional(),
			}),
		)
		.min(1),
	update_filter: Filter.optional().describe(
		'Only overwrite existing points that match this filter',
	),
	update_mode: z.enum(['upsert', 'insert_only', 'update_only']).optional(),
	shard_key: ShardKeySelector.optional(),
	...WriteOptions,
});

const PointsGet = z.object({
	collectionName: CollectionName,
	ids: z.array(PointId).min(1),
	with_payload: WithPayload.optional(),
	with_vector: WithVector.optional(),
	shard_key: ShardKeySelector.optional(),
	...ReadOptions,
});

const PointsScroll = z.object({
	collectionName: CollectionName,
	filter: Filter.optional(),
	limit: z.number().int().positive().optional(),
	offset: PointId.optional().describe(
		'`next_page_offset` of the previous page',
	),
	order_by: z
		.union([
			z.string(),
			z.object({
				key: z.string(),
				direction: z.enum(['asc', 'desc']).optional(),
				start_from: z.union([z.number(), z.string()]).optional(),
			}),
		])
		.optional(),
	with_payload: WithPayload.optional(),
	with_vector: WithVector.optional(),
	shard_key: ShardKeySelector.optional(),
	...ReadOptions,
});

const PointsCount = z.object({
	collectionName: CollectionName,
	filter: Filter.optional(),
	exact: z.boolean().optional(),
	shard_key: ShardKeySelector.optional(),
	...ReadOptions,
});

const PointsSetPayload = z
	.object({
		collectionName: CollectionName,
		payload: Payload,
		key: z.string().optional().describe('Nested path to set the payload under'),
		...Selector,
		...WriteOptions,
	})
	.refine(...oneSelector);

const PointsOverwritePayload = z
	.object({
		collectionName: CollectionName,
		payload: Payload,
		// Qdrant's spec lists `key`, but the server ignores it and replaces the
		// whole payload. Declared so it can be rejected instead of stripped.
		key: z
			.string()
			.optional()
			.describe('Not supported. Use setPayload instead'),
		...Selector,
		...WriteOptions,
	})
	.refine((v) => v.key === undefined, {
		message:
			'overwritePayload replaces the whole payload and has no `key`. To change one nested object, use points.setPayload with `key`.',
		path: ['key'],
	})
	.refine(...oneSelector);

const PointsDeletePayload = z
	.object({
		collectionName: CollectionName,
		keys: z.array(z.string().min(1)).min(1),
		...Selector,
		...WriteOptions,
	})
	.refine(...oneSelector);

const PointsSelect = z
	.object({ collectionName: CollectionName, ...Selector, ...WriteOptions })
	.refine(...oneSelector);

const PointsUpdateVectors = z.object({
	collectionName: CollectionName,
	points: z.array(z.object({ id: PointId, vector: VectorStruct })).min(1),
	update_filter: Filter.optional(),
	shard_key: ShardKeySelector.optional(),
	...WriteOptions,
});

const PointsDeleteVectors = z
	.object({
		collectionName: CollectionName,
		vector: z.array(z.string()).min(1).describe('Names of the vectors'),
		...Selector,
		...WriteOptions,
	})
	.refine(...oneSelector);

const Query = z.union([
	DenseVector,
	MultiVector,
	PointId,
	z.object({}).loose(),
]);

const LookupFrom = z.object({
	collection: z.string().min(1),
	vector: z.string().optional(),
	shard_key: ShardKeySelector.optional(),
});

export type Prefetch = {
	prefetch?: Prefetch | Prefetch[];
	query?: z.infer<typeof Query>;
	using?: string;
	filter?: z.infer<typeof Filter>;
	params?: Record<string, unknown>;
	score_threshold?: number;
	limit?: number;
	lookup_from?: z.infer<typeof LookupFrom>;
};
const PrefetchSchema: z.ZodType<Prefetch> = z.lazy(() =>
	z.object({
		prefetch: z.union([PrefetchSchema, z.array(PrefetchSchema)]).optional(),
		query: Query.optional(),
		using: z.string().optional(),
		filter: Filter.optional(),
		params: Config.optional(),
		score_threshold: z.number().optional(),
		limit: z.number().int().positive().optional(),
		lookup_from: LookupFrom.optional(),
	}),
);

const QueryFields = {
	prefetch: z.union([PrefetchSchema, z.array(PrefetchSchema)]).optional(),
	query: Query.optional(),
	using: z.string().optional().describe('Named vector to search'),
	filter: Filter.optional(),
	params: Config.optional().describe('Search params, e.g. { hnsw_ef, exact }'),
	score_threshold: z.number().optional(),
	limit: z.number().int().positive().optional(),
	offset: z.number().int().nonnegative().optional(),
	with_payload: WithPayload.optional(),
	with_vector: WithVector.optional(),
	lookup_from: LookupFrom.optional(),
	shard_key: ShardKeySelector.optional(),
};

const { offset: _offset, ...GroupFields } = QueryFields;
const QueryGroups = z.object({
	collectionName: CollectionName,
	...GroupFields,
	group_by: z.string().min(1),
	group_size: z.number().int().positive().optional(),
	with_lookup: z
		.union([z.string(), z.object({ collection: z.string() }).loose()])
		.optional(),
	...ReadOptions,
});

const QueryFacet = z.object({
	collectionName: CollectionName,
	key: z.string().min(1).describe('Indexed payload field'),
	limit: z.number().int().positive().optional(),
	filter: Filter.optional(),
	exact: z.boolean().optional(),
	shard_key: ShardKeySelector.optional(),
	...ReadOptions,
});

const Empty = z.object({});
const Collection = z.object({ collectionName: CollectionName });
const Ack = z.boolean().describe('true when Qdrant applied the operation');

export const QdrantEndpointInputSchemas = {
	'collections.list': Empty,
	'collections.get': Collection,
	'collections.exists': Collection,
	'collections.create': CollectionsCreate,
	'collections.update': CollectionsUpdate,
	'collections.delete': Collection.extend({ timeout: Timeout }),
	'aliases.list': Empty,
	'aliases.listForCollection': Collection,
	'aliases.update': AliasesUpdate,
	'payloadIndexes.create': PayloadIndexesCreate,
	'payloadIndexes.delete': Collection.extend({
		fieldName: PathSegment,
		...WriteOptions,
	}),
	'points.upsert': PointsUpsert,
	'points.get': PointsGet,
	'points.delete': PointsSelect,
	'points.scroll': PointsScroll,
	'points.count': PointsCount,
	'points.setPayload': PointsSetPayload,
	'points.overwritePayload': PointsOverwritePayload,
	'points.deletePayload': PointsDeletePayload,
	'points.clearPayload': PointsSelect,
	'points.updateVectors': PointsUpdateVectors,
	'points.deleteVectors': PointsDeleteVectors,
	'query.points': z.object({
		collectionName: CollectionName,
		...QueryFields,
		...ReadOptions,
	}),
	'query.batch': z.object({
		collectionName: CollectionName,
		searches: z.array(z.object(QueryFields)).min(1),
		...ReadOptions,
	}),
	'query.groups': QueryGroups,
	'query.facet': QueryFacet,
	'snapshots.list': Collection,
	'snapshots.create': Collection,
	'snapshots.delete': Collection.extend({ snapshotName: PathSegment }),
} as const;

export const QdrantEndpointOutputSchemas = {
	'collections.list': z.object({
		collections: z.array(z.object({ name: z.string() })),
	}),
	'collections.get': CollectionInfo,
	'collections.exists': z.object({ exists: z.boolean() }),
	'collections.create': Ack,
	'collections.update': Ack,
	'collections.delete': Ack.describe('false when the collection did not exist'),
	'aliases.list': z.object({ aliases: z.array(Alias) }),
	'aliases.listForCollection': z.object({ aliases: z.array(Alias) }),
	'aliases.update': Ack,
	'payloadIndexes.create': UpdateResult,
	'payloadIndexes.delete': UpdateResult,
	'points.upsert': UpdateResult,
	'points.get': z.array(PointRecord),
	'points.delete': UpdateResult,
	'points.scroll': z.object({
		points: z.array(PointRecord),
		next_page_offset: PointId.nullable().optional(),
	}),
	'points.count': z.object({ count: z.number().int() }),
	'points.setPayload': UpdateResult,
	'points.overwritePayload': UpdateResult,
	'points.deletePayload': UpdateResult,
	'points.clearPayload': UpdateResult,
	'points.updateVectors': UpdateResult,
	'points.deleteVectors': UpdateResult,
	'query.points': QueryResponse,
	'query.batch': z.array(QueryResponse),
	'query.groups': z.object({
		groups: z.array(
			z
				.object({
					id: z.union([z.string(), z.number()]),
					hits: z.array(ScoredPoint),
					lookup: PointRecord.nullable().optional(),
				})
				.loose(),
		),
	}),
	'query.facet': z.object({
		hits: z.array(
			z.object({
				value: z.union([z.string(), z.number(), z.boolean()]),
				count: z.number().int(),
			}),
		),
	}),
	'snapshots.list': z.array(Snapshot),
	'snapshots.create': Snapshot,
	'snapshots.delete': Ack,
} as const;

type Inputs = typeof QdrantEndpointInputSchemas;
type Outputs = typeof QdrantEndpointOutputSchemas;

export type QdrantEndpointInputs = { [K in keyof Inputs]: z.input<Inputs[K]> };
export type QdrantEndpointParsedInputs = {
	[K in keyof Inputs]: z.output<Inputs[K]>;
};
export type QdrantEndpointOutputs = {
	[K in keyof Outputs]: z.output<Outputs[K]>;
};
