import { z } from 'zod';

const QuestionResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.string(),
		value: z.unknown(),
	})
	.loose();

const CalculationResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.enum(['number', 'text', 'duration']),
		value: z.string(),
	})
	.loose();

const UrlParameterResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		value: z.string(),
	})
	.loose();

const SubmissionSchema = z
	.object({
		submissionId: z.string(),
		submissionTime: z.string(),
		lastUpdatedAt: z.string().optional(),
		questions: z.array(QuestionResponseSchema),
		calculations: z.array(CalculationResponseSchema).optional(),
		urlParameters: z.array(UrlParameterResponseSchema).optional(),
		scheduling: z.array(z.record(z.string(), z.unknown())).optional(),
		payments: z.array(z.record(z.string(), z.unknown())).optional(),
		quiz: z.record(z.string(), z.unknown()).optional(),
		login: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const FormSummarySchema = z
	.object({
		formId: z.string(),
		name: z.string(),
	})
	.loose();

const QuestionSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.string(),
	})
	.loose();

const FormMetadataSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		questions: z.array(QuestionSchema),
		calculations: z.array(z.record(z.string(), z.unknown())).optional(),
		urlParameters: z.array(z.record(z.string(), z.unknown())).optional(),
		scheduling: z.array(z.record(z.string(), z.unknown())).optional(),
		payments: z.array(z.record(z.string(), z.unknown())).optional(),
		quiz: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

// Official Zite FieldType: https://developers.zite.com/api/fields/create-field
export const ZiteFieldTypeSchema = z.enum([
	'single_line_text',
	'long_text',
	'email',
	'url',
	'phone_number',
	'number',
	'currency',
	'percent',
	'rating',
	'duration',
	'single_select',
	'multiple_select',
	'checkbox',
	'date',
	'datetime',
	'attachments',
	'linked_record',
	'lookup',
	'autonumber',
	'source',
]);

const FieldTemplateSchema = z.record(z.string(), z.unknown());

const CreateFieldInTableSchema = z.object({
	type: ZiteFieldTypeSchema,
	name: z.string().min(1),
	template: FieldTemplateSchema,
});

const ZiteFieldSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.string(),
		template: z.record(z.string(), z.unknown()),
		order: z.number().int(),
	})
	.loose();

const ZiteViewSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.string(),
		config: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const ZiteTableSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		order: z.number().int(),
		primaryFieldId: z.string(),
		fields: z.array(ZiteFieldSchema),
		views: z.array(ZiteViewSchema),
		url: z.string(),
	})
	.loose();

const ZiteDatabaseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		tables: z.array(ZiteTableSchema),
		createdAt: z.string(),
		updatedAt: z.string(),
		url: z.string(),
		workspaceId: z.string().optional(),
	})
	.loose();

const DatabaseListItemSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		url: z.string().optional(),
	})
	.loose();

const ZiteRecordSchema = z
	.object({
		id: z.string(),
		data: z.record(z.string(), z.unknown()),
		fields: z.record(z.string(), z.unknown()),
		createdAt: z.string(),
		updatedAt: z.string(),
	})
	.loose();

const WebhookEventTypeSchema = z.enum([
	'record.created',
	'record.updated',
	'record.deleted',
	'table.created',
	'table.updated',
	'table.deleted',
	'field.created',
	'field.updated',
	'field.deleted',
]);

const DatabaseWebhookSchema = z
	.object({
		id: z.number().int(),
		url: z.string(),
		events: z.array(z.string()),
		active: z.boolean(),
		tableIds: z.array(z.string()).nullable().optional(),
	})
	.loose();

const GetFormsInputSchema = z.object({});
const GetFormsResponseSchema = z.array(FormSummarySchema);
const GetFormMetadataInputSchema = z.object({ formId: z.string() });
const GetFormMetadataResponseSchema = FormMetadataSchema;

const ListSubmissionsInputSchema = z.object({
	formId: z.string(),
	limit: z.number().int().min(1).max(150).optional(),
	afterDate: z.string().optional(),
	beforeDate: z.string().optional(),
	offset: z.number().int().min(0).optional(),
	status: z.enum(['finished', 'in_progress']).optional(),
	includeEditLink: z.boolean().optional(),
	includePreview: z.boolean().optional(),
	sort: z.enum(['asc', 'desc']).optional(),
	search: z.string().optional(),
});

const ListSubmissionsResponseSchema = z
	.object({
		responses: z.array(SubmissionSchema),
		totalResponses: z.number(),
		pageCount: z.number(),
	})
	.loose();

const GetSubmissionByIdInputSchema = z.object({
	formId: z.string(),
	submissionId: z.string(),
	includeEditLink: z.boolean().optional(),
});

const GetSubmissionByIdResponseSchema = z
	.object({
		submission: SubmissionSchema,
	})
	.loose();

const CreateSubmissionInputSchema = z.object({
	formId: z.string(),
	submissions: z.array(
		z
			.object({
				questions: z.array(
					z.object({
						id: z.string(),
						value: z.unknown(),
					}),
				),
				urlParameters: z
					.array(
						z.object({
							id: z.string(),
							name: z.string(),
							value: z.string(),
						}),
					)
					.optional(),
				submissionTime: z.string().optional(),
				lastUpdatedAt: z.string().optional(),
				scheduling: z.array(z.record(z.string(), z.unknown())).optional(),
				payments: z.array(z.record(z.string(), z.unknown())).optional(),
				login: z.record(z.string(), z.unknown()).optional(),
			})
			.loose(),
	),
});

const CreateSubmissionResponseSchema = z
	.object({
		submissions: z.array(SubmissionSchema),
	})
	.loose();

const DeleteSubmissionInputSchema = z.object({
	formId: z.string(),
	submissionId: z.string(),
});

const DeleteSubmissionResponseSchema = z
	.object({
		deleted: z.boolean().optional(),
	})
	.loose();

const CreateFormWebhookInputSchema = z.object({
	formId: z.string(),
	url: z.string().url(),
});

const CreateFormWebhookResponseSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.loose();

const RemoveFormWebhookInputSchema = z.object({
	webhookId: z.union([z.string(), z.number()]),
});

const RemoveFormWebhookResponseSchema = z.object({}).loose();

const GetDatabasesInputSchema = z.object({});
const GetDatabasesResponseSchema = z.array(DatabaseListItemSchema);

const GetDatabaseByIdInputSchema = z.object({ databaseId: z.string() });
const GetDatabaseByIdResponseSchema = ZiteDatabaseSchema;

const CreateDatabaseInputSchema = z.object({
	name: z.string().min(1),
	tables: z
		.array(
			z.object({
				name: z.string().min(1),
				fields: z.array(CreateFieldInTableSchema).min(1),
			}),
		)
		.min(1),
});
const CreateDatabaseResponseSchema = ZiteDatabaseSchema;

const DeleteDatabaseInputSchema = z.object({ databaseId: z.string() });
const DeleteDatabaseResponseSchema = z.object({}).loose();

const CreateTableInputSchema = z.object({
	databaseId: z.string(),
	name: z.string().min(1),
	fields: z.array(CreateFieldInTableSchema).min(1),
});
const CreateTableResponseSchema = ZiteTableSchema;

const UpdateTableInputSchema = z.object({
	databaseId: z.string(),
	tableId: z.string(),
	name: z.string().min(1).optional(),
});
const UpdateTableResponseSchema = ZiteTableSchema;

const DeleteTableInputSchema = z.object({
	databaseId: z.string(),
	tableId: z.string(),
});
const DeleteTableResponseSchema = z.object({}).loose();

const CreateFieldInputSchema = z.object({
	databaseId: z.string(),
	tableId: z.string(),
	name: z.string().min(1),
	type: ZiteFieldTypeSchema,
	template: FieldTemplateSchema.optional(),
});
const CreateFieldResponseSchema = ZiteFieldSchema;

const UpdateFieldInputSchema = z.object({
	databaseId: z.string(),
	tableId: z.string(),
	fieldId: z.string(),
	name: z.string().min(1).optional(),
	template: FieldTemplateSchema.optional(),
});
const UpdateFieldResponseSchema = ZiteFieldSchema;

const DeleteFieldInputSchema = z.object({
	databaseId: z.string(),
	tableId: z.string(),
	fieldId: z.string(),
});
const DeleteFieldResponseSchema = z.object({}).loose();

const ListRecordsInputSchema = z.object({
	databaseId: z.string(),
	tableId: z.string(),
	filter: z.record(z.string(), z.unknown()).optional(),
	sort: z.array(z.record(z.string(), z.unknown())).optional(),
	limit: z.number().int().min(1).max(2000).optional(),
	offset: z.number().int().min(0).optional(),
});

const ListRecordsResponseSchema = z
	.object({
		records: z.array(ZiteRecordSchema),
		total: z.number().optional(),
	})
	.loose();

const GetRecordByIdInputSchema = z.object({
	databaseId: z.string(),
	tableId: z.string(),
	recordId: z.string(),
});
const GetRecordByIdResponseSchema = ZiteRecordSchema;

const CreateRecordInputSchema = z.object({
	databaseId: z.string(),
	tableId: z.string(),
	record: z.record(z.string(), z.unknown()),
});
const CreateRecordResponseSchema = ZiteRecordSchema;

const UpdateRecordInputSchema = z.object({
	databaseId: z.string(),
	tableId: z.string(),
	recordId: z.string(),
	record: z.record(z.string(), z.unknown()),
});
const UpdateRecordResponseSchema = ZiteRecordSchema;

const DeleteRecordInputSchema = z.object({
	databaseId: z.string(),
	tableId: z.string(),
	recordId: z.string(),
});
const DeleteRecordResponseSchema = z.object({}).loose();

const CreateDatabaseWebhookInputSchema = z.object({
	databaseId: z.string(),
	url: z.string().url(),
	events: z.array(WebhookEventTypeSchema).min(1),
	tableId: z.string().optional(),
});

const CreateDatabaseWebhookResponseSchema = z
	.object({
		id: z.number().int(),
		secret: z.string(),
	})
	.loose();

const ListDatabaseWebhooksInputSchema = z.object({
	databaseId: z.string(),
});

const ListDatabaseWebhooksResponseSchema = z
	.object({
		webhooks: z.array(DatabaseWebhookSchema),
	})
	.loose();

const DeleteDatabaseWebhookInputSchema = z.object({
	databaseId: z.string(),
	webhookId: z.union([z.string(), z.number()]),
});
const DeleteDatabaseWebhookResponseSchema = z.object({}).loose();

const AuthorizeOAuthInputSchema = z.object({
	clientId: z.string(),
	redirectUri: z.string(),
	state: z.string().optional(),
});

const AuthorizeOAuthResponseSchema = z
	.object({
		authorizationUrl: z.string(),
	})
	.loose();

const InvalidateAccessTokenInputSchema = z.object({
	token: z.string(),
});
const InvalidateAccessTokenResponseSchema = z.object({}).loose();

export const FilloutFormsEndpointInputSchemas = {
	getForms: GetFormsInputSchema,
	getFormMetadata: GetFormMetadataInputSchema,
	getDatabases: GetDatabasesInputSchema,
	getDatabaseById: GetDatabaseByIdInputSchema,
	createDatabase: CreateDatabaseInputSchema,
	deleteDatabase: DeleteDatabaseInputSchema,
	createTable: CreateTableInputSchema,
	updateTable: UpdateTableInputSchema,
	deleteTable: DeleteTableInputSchema,
	createField: CreateFieldInputSchema,
	updateField: UpdateFieldInputSchema,
	deleteField: DeleteFieldInputSchema,
	listSubmissions: ListSubmissionsInputSchema,
	getSubmissionById: GetSubmissionByIdInputSchema,
	createSubmission: CreateSubmissionInputSchema,
	deleteSubmission: DeleteSubmissionInputSchema,
	listRecords: ListRecordsInputSchema,
	getRecordById: GetRecordByIdInputSchema,
	createRecord: CreateRecordInputSchema,
	updateRecord: UpdateRecordInputSchema,
	deleteRecord: DeleteRecordInputSchema,
	createFormWebhook: CreateFormWebhookInputSchema,
	createDatabaseWebhook: CreateDatabaseWebhookInputSchema,
	listDatabaseWebhooks: ListDatabaseWebhooksInputSchema,
	deleteDatabaseWebhook: DeleteDatabaseWebhookInputSchema,
	removeFormWebhook: RemoveFormWebhookInputSchema,
	invalidateAccessToken: InvalidateAccessTokenInputSchema,
	authorizeOAuth: AuthorizeOAuthInputSchema,
} as const;

export const FilloutFormsEndpointOutputSchemas = {
	getForms: GetFormsResponseSchema,
	getFormMetadata: GetFormMetadataResponseSchema,
	getDatabases: GetDatabasesResponseSchema,
	getDatabaseById: GetDatabaseByIdResponseSchema,
	createDatabase: CreateDatabaseResponseSchema,
	deleteDatabase: DeleteDatabaseResponseSchema,
	createTable: CreateTableResponseSchema,
	updateTable: UpdateTableResponseSchema,
	deleteTable: DeleteTableResponseSchema,
	createField: CreateFieldResponseSchema,
	updateField: UpdateFieldResponseSchema,
	deleteField: DeleteFieldResponseSchema,
	listSubmissions: ListSubmissionsResponseSchema,
	getSubmissionById: GetSubmissionByIdResponseSchema,
	createSubmission: CreateSubmissionResponseSchema,
	deleteSubmission: DeleteSubmissionResponseSchema,
	listRecords: ListRecordsResponseSchema,
	getRecordById: GetRecordByIdResponseSchema,
	createRecord: CreateRecordResponseSchema,
	updateRecord: UpdateRecordResponseSchema,
	deleteRecord: DeleteRecordResponseSchema,
	createFormWebhook: CreateFormWebhookResponseSchema,
	createDatabaseWebhook: CreateDatabaseWebhookResponseSchema,
	listDatabaseWebhooks: ListDatabaseWebhooksResponseSchema,
	deleteDatabaseWebhook: DeleteDatabaseWebhookResponseSchema,
	removeFormWebhook: RemoveFormWebhookResponseSchema,
	invalidateAccessToken: InvalidateAccessTokenResponseSchema,
	authorizeOAuth: AuthorizeOAuthResponseSchema,
} as const;

export type FilloutFormsEndpointInputs = {
	[K in keyof typeof FilloutFormsEndpointInputSchemas]: z.infer<
		(typeof FilloutFormsEndpointInputSchemas)[K]
	>;
};

export type FilloutFormsEndpointOutputs = {
	[K in keyof typeof FilloutFormsEndpointOutputSchemas]: z.infer<
		(typeof FilloutFormsEndpointOutputSchemas)[K]
	>;
};

export type GetFormsInput = z.infer<typeof GetFormsInputSchema>;
export type GetFormsResponse = z.infer<typeof GetFormsResponseSchema>;
export type GetFormMetadataInput = z.infer<typeof GetFormMetadataInputSchema>;
export type GetFormMetadataResponse = z.infer<
	typeof GetFormMetadataResponseSchema
>;
export type ListSubmissionsInput = z.infer<typeof ListSubmissionsInputSchema>;
export type ListSubmissionsResponse = z.infer<
	typeof ListSubmissionsResponseSchema
>;
export type GetSubmissionByIdInput = z.infer<
	typeof GetSubmissionByIdInputSchema
>;
export type GetSubmissionByIdResponse = z.infer<
	typeof GetSubmissionByIdResponseSchema
>;
export type CreateSubmissionInput = z.infer<typeof CreateSubmissionInputSchema>;
export type CreateSubmissionResponse = z.infer<
	typeof CreateSubmissionResponseSchema
>;
export type DeleteSubmissionInput = z.infer<typeof DeleteSubmissionInputSchema>;
export type DeleteSubmissionResponse = z.infer<
	typeof DeleteSubmissionResponseSchema
>;
export type CreateFormWebhookInput = z.infer<
	typeof CreateFormWebhookInputSchema
>;
export type CreateFormWebhookResponse = z.infer<
	typeof CreateFormWebhookResponseSchema
>;
export type RemoveFormWebhookInput = z.infer<
	typeof RemoveFormWebhookInputSchema
>;
export type RemoveFormWebhookResponse = z.infer<
	typeof RemoveFormWebhookResponseSchema
>;
export type AuthorizeOAuthInput = z.infer<typeof AuthorizeOAuthInputSchema>;
export type AuthorizeOAuthResponse = z.infer<
	typeof AuthorizeOAuthResponseSchema
>;
export type InvalidateAccessTokenInput = z.infer<
	typeof InvalidateAccessTokenInputSchema
>;
export type InvalidateAccessTokenResponse = z.infer<
	typeof InvalidateAccessTokenResponseSchema
>;
