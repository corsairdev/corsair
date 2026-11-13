import { z } from 'zod';

// Fireberry record fields are tenant-defined. The API explicitly accepts
// system and custom field system names, so these field maps are extensible.
// `unknown` is needed for tenant-defined nested custom field JSON values.
const CustomFieldObjectSchema = z.record(z.string(), z.unknown());
const FieldValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
	z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])),
	CustomFieldObjectSchema,
]);
const FieldMapSchema = z.record(z.string(), FieldValueSchema);
// `unknown` is needed because delete envelopes explicitly return data: null.
const EnvelopeDataSchema = z.unknown();
const EnvelopeSchema = z.object({
	success: z.boolean(),
	data: EnvelopeDataSchema,
	message: z.string(),
});
const RecordListResponseSchema = z.object({
	success: z.boolean(),
	data: z.object({
		PrimaryKey: z.string(),
		PrimaryField: z.string(),
		Total_Records: z.number(),
		Page_Size: z.number(),
		Page_Number: z.number(),
		Records: z.array(FieldMapSchema),
	}),
	message: z.string(),
});
const RecordResponseSchema = z.object({
	success: z.boolean(),
	data: z.object({ Record: FieldMapSchema }),
	message: z.string(),
});
const QueryResponseSchema = z.object({
	success: z.boolean(),
	data: z.array(FieldMapSchema),
	message: z.string(),
	pageNumber: z.number(),
	pageSize: z.number(),
	isLastPage: z.boolean(),
});
const BatchInputSchema = z.object({
	objectCode: z.string().min(1),
	data: z.array(FieldMapSchema).min(1),
});
const BatchUpdateInputSchema = z.object({
	objectCode: z.string().min(1),
	data: z
		.array(z.object({ id: z.string().min(1), record: FieldMapSchema }))
		.min(1),
});
const BatchDeleteInputSchema = z.object({
	objectCode: z.string().min(1),
	ids: z.array(z.string().min(1)).min(1).max(20),
});
// Batch API response bodies are undocumented on create/update and empty for delete.
const BatchResponseSchema = z.object({}).passthrough();
const QueryFieldSchema = z
	.object({
		name: z.string().min(1),
		alias: z.string().optional(),
		aggrFunc: z.enum(['SUM', 'COUNT', 'MIN', 'MAX']).optional(),
	})
	.strict();
const QueryFilterValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.array(z.union([z.string(), z.number()])),
]);
const QueryInputSchema = z
	.object({
		objectType: z.number().int(),
		fields: z.array(QueryFieldSchema).min(1),
		filter: z
			.array(
				z
					.object({
						type: z.enum(['AND', 'OR']),
						conditions: z.array(
							z
								.object({
									fieldName: z.string().min(1),
									operator: z.enum([
										'eq',
										'ne',
										'lt',
										'gt',
										'le',
										'ge',
										'start-with',
										'not-start-with',
										'is-null',
										'is-not-null',
										'eq-in',
										'not-in',
										'between',
										'userid',
									]),
									value: QueryFilterValueSchema.optional(),
								})
								.strict(),
						),
					})
					.strict(),
			)
			.optional(),
		orderBy: z
			.array(
				z
					.object({
						name: z.string(),
						order: z.enum(['asc', 'desc']).optional(),
					})
					.strict(),
			)
			.optional(),
		groupBy: z
			.array(
				z
					.object({
						name: z.string(),
						datePeriod: z
							.enum([
								'HOUR',
								'DAY',
								'WEEK',
								'MONTH',
								'QUARTER',
								'YEAR',
								'HOUR_PART',
								'DAY_PART',
								'WEEK_PART',
								'MONTH_PART',
								'QUARTER_PART',
								'DAY_OF_WEEK',
							])
							.optional(),
					})
					.strict(),
			)
			.optional(),
		pageNumber: z.number().int().min(1).optional(),
		pageSize: z.number().int().min(1).max(500).optional(),
	})
	.strict();
// Metadata schemas vary by object and field, so the documented envelope is checked while data is deferred.
const MetadataDataSchema = z.unknown();
const MetadataEnvelopeSchema = z.object({
	success: z.boolean(),
	data: MetadataDataSchema,
	message: z.string(),
});
const ObjectsResponseSchema = z.object({
	success: z.boolean(),
	data: z.array(
		z.object({
			name: z.string(),
			systemName: z.string(),
			objectType: z.union([z.string(), z.number()]),
		}),
	),
	message: z.string(),
});
const FieldResponseSchema = z.object({
	success: z.boolean(),
	data: z.object({
		label: z.string(),
		fieldName: z.string(),
		systemFieldTypeId: z.string(),
		fieldObjectType: z.string(),
		systemName: z.string(),
		values: z
			.array(z.object({ name: z.string(), value: z.string() }))
			.optional(),
	}),
	message: z.string(),
});
const EmptyInputSchema = z.object({}).strict();
const RecordBaseInputSchema = z.object({ object: z.string().min(1) }).strict();
const ListInputSchema = RecordBaseInputSchema.extend({
	pageSize: z.number().int().min(1).max(50).optional(),
	pageNumber: z.number().int().min(1).max(10).optional(),
});
const GetInputSchema = RecordBaseInputSchema.extend({ id: z.string().min(1) });
const CreateInputSchema = RecordBaseInputSchema.extend({
	data: FieldMapSchema,
});
const UpdateInputSchema = GetInputSchema.extend({ data: FieldMapSchema });
const DeleteInputSchema = GetInputSchema;
const MetadataObjectInputSchema = z.object({ id: z.number().int() }).strict();
const MetadataFieldInputSchema = z
	.object({ id: z.number().int(), fieldName: z.string().min(1) })
	.strict();

const endpointSchemas = {
	list: { input: ListInputSchema, output: RecordListResponseSchema },
	get: { input: GetInputSchema, output: RecordResponseSchema },
	create: { input: CreateInputSchema, output: RecordResponseSchema },
	update: { input: UpdateInputSchema, output: RecordResponseSchema },
	delete: { input: DeleteInputSchema, output: EnvelopeSchema },
	query: { input: QueryInputSchema, output: QueryResponseSchema },
	objects: { input: EmptyInputSchema, output: ObjectsResponseSchema },
	object: { input: MetadataObjectInputSchema, output: MetadataEnvelopeSchema },
	fields: { input: MetadataObjectInputSchema, output: MetadataEnvelopeSchema },
	field: { input: MetadataFieldInputSchema, output: FieldResponseSchema },
	picklist: {
		input: MetadataFieldInputSchema.extend({ fieldName: z.string().min(1) }),
		output: FieldResponseSchema,
	},
	batchCreate: { input: BatchInputSchema, output: BatchResponseSchema },
	batchUpdate: { input: BatchUpdateInputSchema, output: BatchResponseSchema },
	batchDelete: { input: BatchDeleteInputSchema, output: BatchResponseSchema },
} as const;

type InferInput<K extends keyof typeof endpointSchemas> = z.infer<
	(typeof endpointSchemas)[K]['input']
>;
type InferOutput<K extends keyof typeof endpointSchemas> = z.infer<
	(typeof endpointSchemas)[K]['output']
>;

export type FireberryEndpointInputs = {
	[K in keyof typeof endpointSchemas]: InferInput<K>;
};
export type FireberryEndpointOutputs = {
	[K in keyof typeof endpointSchemas]: InferOutput<K>;
};
export const FireberryEndpointInputSchemas = {
	list: endpointSchemas.list.input,
	get: endpointSchemas.get.input,
	create: endpointSchemas.create.input,
	update: endpointSchemas.update.input,
	delete: endpointSchemas.delete.input,
	query: endpointSchemas.query.input,
	objects: endpointSchemas.objects.input,
	object: endpointSchemas.object.input,
	fields: endpointSchemas.fields.input,
	field: endpointSchemas.field.input,
	picklist: endpointSchemas.picklist.input,
	batchCreate: endpointSchemas.batchCreate.input,
	batchUpdate: endpointSchemas.batchUpdate.input,
	batchDelete: endpointSchemas.batchDelete.input,
} as const;
export const FireberryEndpointOutputSchemas = {
	list: endpointSchemas.list.output,
	get: endpointSchemas.get.output,
	create: endpointSchemas.create.output,
	update: endpointSchemas.update.output,
	delete: endpointSchemas.delete.output,
	query: endpointSchemas.query.output,
	objects: endpointSchemas.objects.output,
	object: endpointSchemas.object.output,
	fields: endpointSchemas.fields.output,
	field: endpointSchemas.field.output,
	picklist: endpointSchemas.picklist.output,
	batchCreate: endpointSchemas.batchCreate.output,
	batchUpdate: endpointSchemas.batchUpdate.output,
	batchDelete: endpointSchemas.batchDelete.output,
} as const;
