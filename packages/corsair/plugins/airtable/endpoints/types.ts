import { z } from 'zod';

// ── Input Schemas ────────────────────────────────────────────────────────────

const BasesGetManyInputSchema = z.object({
	offset: z.string().optional(),
});

const BasesGetSchemaInputSchema = z.object({
	baseId: z.string(),
	include: z
		.array(z.enum(['visibleFieldIds', 'fieldIdsInSynced']))
		.optional(),
});

const RecordsCreateInputSchema = z.object({
	baseId: z.string(),
	tableIdOrName: z.string(),
	// Record fields use unknown here because Airtable field types vary by base
	fields: z.record(z.unknown()),
	typecast: z.boolean().optional(),
});

const RecordsCreateOrUpdateInputSchema = z.object({
	baseId: z.string(),
	tableIdOrName: z.string(),
	// Upsert payload fields use unknown because their types are defined in Airtable, not statically
	fields: z.record(z.unknown()),
	fieldsToMergeOn: z.array(z.string()),
	typecast: z.boolean().optional(),
});

const RecordsDeleteInputSchema = z.object({
	baseId: z.string(),
	tableIdOrName: z.string(),
	recordId: z.string(),
});

const RecordsGetInputSchema = z.object({
	baseId: z.string(),
	tableIdOrName: z.string(),
	recordId: z.string(),
	returnFieldsByFieldId: z.boolean().optional(),
});

const RecordsSearchInputSchema = z.object({
	baseId: z.string(),
	tableIdOrName: z.string(),
	fields: z.array(z.string()).optional(),
	filterByFormula: z.string().optional(),
	maxRecords: z.number().optional(),
	pageSize: z.number().optional(),
	sort: z
		.array(
			z.object({
				field: z.string(),
				direction: z.enum(['asc', 'desc']).optional(),
			}),
		)
		.optional(),
	view: z.string().optional(),
	cellFormat: z.enum(['json', 'string']).optional(),
	timeZone: z.string().optional(),
	userLocale: z.string().optional(),
	returnFieldsByFieldId: z.boolean().optional(),
	offset: z.string().optional(),
});

const RecordsUpdateInputSchema = z.object({
	baseId: z.string(),
	tableIdOrName: z.string(),
	recordId: z.string(),
	// Update payload fields use unknown because Airtable controls the field schema
	fields: z.record(z.unknown()),
	typecast: z.boolean().optional(),
});

const WebhooksGetPayloadsInputSchema = z.object({
	baseId: z.string(),
	webhookId: z.string(),
	cursor: z.number().optional(),
});

export const AirtableEndpointInputSchemas = {
	basesGetMany: BasesGetManyInputSchema,
	basesGetSchema: BasesGetSchemaInputSchema,
	recordsCreate: RecordsCreateInputSchema,
	recordsCreateOrUpdate: RecordsCreateOrUpdateInputSchema,
	recordsDelete: RecordsDeleteInputSchema,
	recordsGet: RecordsGetInputSchema,
	recordsSearch: RecordsSearchInputSchema,
	recordsUpdate: RecordsUpdateInputSchema,
	webhookGetPayloads: WebhooksGetPayloadsInputSchema,
} as const;

export type AirtableEndpointInputs = {
	[K in keyof typeof AirtableEndpointInputSchemas]: z.infer<
		(typeof AirtableEndpointInputSchemas)[K]
	>;
};

// ── Output Schemas ───────────────────────────────────────────────────────────

// Airtable records use unknown for field values because they depend on the remote base schema
const AirtableRecordSchema = z
	.object({
		id: z.string(),
		createdTime: z.string(),
		fields: z.record(z.unknown()),
	})
	.passthrough();

const AirtableBaseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		permissionLevel: z.string(),
	})
	.passthrough();

// Airtable field options use unknown because option shapes depend on the field type
const AirtableFieldSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		name: z.string(),
		description: z.string().optional(),
		options: z.record(z.unknown()).optional(),
	})
	.passthrough();

const AirtableViewSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		name: z.string(),
		personalForCreator: z.boolean().optional(),
	})
	.passthrough();

const AirtableTableSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		primaryFieldId: z.string(),
		description: z.string().optional(),
		fields: z.array(AirtableFieldSchema),
		views: z.array(AirtableViewSchema),
	})
	.passthrough();

const BasesGetManyResponseSchema = z
	.object({
		bases: z.array(AirtableBaseSchema),
		offset: z.string().optional(),
	})
	.passthrough();

const BasesGetSchemaResponseSchema = z
	.object({
		tables: z.array(AirtableTableSchema),
	})
	.passthrough();

const RecordsCreateResponseSchema = z
	.object({
		records: z.array(AirtableRecordSchema),
	})
	.passthrough();

const RecordsCreateOrUpdateResponseSchema = z
	.object({
		records: z.array(AirtableRecordSchema),
	})
	.passthrough();

const RecordsDeleteResponseSchema = z
	.object({
		id: z.string(),
		deleted: z.boolean(),
	})
	.passthrough();

const RecordsGetResponseSchema = AirtableRecordSchema;

const RecordsSearchResponseSchema = z
	.object({
		records: z.array(AirtableRecordSchema),
		offset: z.string().optional(),
	})
	.passthrough();

const RecordsUpdateResponseSchema = z
	.object({
		records: z.array(AirtableRecordSchema),
	})
	.passthrough();

// Webhook payload items use unknown for payloads because they mirror Airtable’s dynamic webhook format
const WebhooksGetPayloadsResponseSchema = z
	.object({
		cursorForNextPayload: z.number().optional(),
		payloads: z.array(z.unknown()).default([]),
	})
	.passthrough();

export const AirtableEndpointOutputSchemas = {
	basesGetMany: BasesGetManyResponseSchema,
	basesGetSchema: BasesGetSchemaResponseSchema,
	recordsCreate: RecordsCreateResponseSchema,
	recordsCreateOrUpdate: RecordsCreateOrUpdateResponseSchema,
	recordsDelete: RecordsDeleteResponseSchema,
	recordsGet: RecordsGetResponseSchema,
	recordsSearch: RecordsSearchResponseSchema,
	recordsUpdate: RecordsUpdateResponseSchema,
	webhookGetPayloads: WebhooksGetPayloadsResponseSchema,
} as const;

export type AirtableEndpointOutputs = {
	[K in keyof typeof AirtableEndpointOutputSchemas]: z.infer<
		(typeof AirtableEndpointOutputSchemas)[K]
	>;
};

// ── Named Type Exports ───────────────────────────────────────────────────────

export type BasesGetManyInput = z.infer<typeof BasesGetManyInputSchema>;
export type BasesGetSchemaInput = z.infer<typeof BasesGetSchemaInputSchema>;
export type RecordsCreateInput = z.infer<typeof RecordsCreateInputSchema>;
export type RecordsCreateOrUpdateInput = z.infer<
	typeof RecordsCreateOrUpdateInputSchema
>;
export type RecordsDeleteInput = z.infer<typeof RecordsDeleteInputSchema>;
export type RecordsGetInput = z.infer<typeof RecordsGetInputSchema>;
export type RecordsSearchInput = z.infer<typeof RecordsSearchInputSchema>;
export type RecordsUpdateInput = z.infer<typeof RecordsUpdateInputSchema>;
export type WebhooksGetPayloadsInput = z.infer<
	typeof WebhooksGetPayloadsInputSchema
>;

export type BasesGetManyResponse = z.infer<typeof BasesGetManyResponseSchema>;
export type BasesGetSchemaResponse = z.infer<
	typeof BasesGetSchemaResponseSchema
>;
export type RecordsCreateResponse = z.infer<typeof RecordsCreateResponseSchema>;
export type RecordsCreateOrUpdateResponse = z.infer<
	typeof RecordsCreateOrUpdateResponseSchema
>;
export type RecordsDeleteResponse = z.infer<typeof RecordsDeleteResponseSchema>;
export type RecordsGetResponse = z.infer<typeof RecordsGetResponseSchema>;
export type RecordsSearchResponse = z.infer<typeof RecordsSearchResponseSchema>;
export type RecordsUpdateResponse = z.infer<typeof RecordsUpdateResponseSchema>;
export type WebhooksGetPayloadsResponse = z.infer<
	typeof WebhooksGetPayloadsResponseSchema
>;