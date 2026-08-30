import { z } from 'zod';

// ── Shared Schemas ──────────────────────────────────────────────────────────

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

// ── Forms ───────────────────────────────────────────────────────────────────

const GetFormsInputSchema = z.object({});

const GetFormsResponseSchema = z.array(FormSummarySchema);

const GetFormMetadataInputSchema = z.object({
	formId: z.string(),
});

const GetFormMetadataResponseSchema = FormMetadataSchema;

// ── Submissions ─────────────────────────────────────────────────────────────

const ListSubmissionsInputSchema = z.object({
	formId: z.string(),
	limit: z.number().min(1).max(150).optional(),
	afterDate: z.string().optional(),
	beforeDate: z.string().optional(),
	offset: z.number().optional(),
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

// ── Webhooks ────────────────────────────────────────────────────────────────

const CreateWebhookInputSchema = z.object({
	formId: z.string(),
	url: z.string(),
});

const CreateWebhookResponseSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.loose();

const RemoveWebhookInputSchema = z.object({
	webhookId: z.string(),
});

const RemoveWebhookResponseSchema = z.object({}).loose();

// ── Database/Table/Field Operations (not supported by Fillout API) ─────────

const UnsupportedInputSchema = z.object({
	reason: z.string().optional(),
});

const UnsupportedResponseSchema = z
	.object({
		supported: z.literal(false),
		message: z.string(),
	})
	.loose();

// ── Authorize OAuth ─────────────────────────────────────────────────────────

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

// ── Invalidate Access Token ─────────────────────────────────────────────────

const InvalidateAccessTokenInputSchema = z.object({
	accessToken: z.string(),
});

const InvalidateAccessTokenResponseSchema = z.object({}).loose();

// ── Export Input Schemas ────────────────────────────────────────────────────

export const FilloutFormsEndpointInputSchemas = {
	getForms: GetFormsInputSchema,
	getFormMetadata: GetFormMetadataInputSchema,
	getDatabases: UnsupportedInputSchema,
	getDatabaseById: UnsupportedInputSchema,
	createDatabase: UnsupportedInputSchema,
	deleteDatabase: UnsupportedInputSchema,
	createTable: UnsupportedInputSchema,
	updateTable: UnsupportedInputSchema,
	deleteTable: UnsupportedInputSchema,
	createField: UnsupportedInputSchema,
	updateField: UnsupportedInputSchema,
	deleteField: UnsupportedInputSchema,
	listSubmissions: ListSubmissionsInputSchema,
	getSubmissionById: GetSubmissionByIdInputSchema,
	createSubmission: CreateSubmissionInputSchema,
	updateSubmission: UnsupportedInputSchema,
	deleteSubmission: DeleteSubmissionInputSchema,
	createDatabaseWebhook: CreateWebhookInputSchema,
	listDatabaseWebhooks: UnsupportedInputSchema,
	deleteDatabaseWebhook: UnsupportedInputSchema,
	removeFormWebhook: RemoveWebhookInputSchema,
	invalidateAccessToken: InvalidateAccessTokenInputSchema,
	authorizeOAuth: AuthorizeOAuthInputSchema,
} as const;

// ── Export Output Schemas ───────────────────────────────────────────────────

export const FilloutFormsEndpointOutputSchemas = {
	getForms: GetFormsResponseSchema,
	getFormMetadata: GetFormMetadataResponseSchema,
	getDatabases: UnsupportedResponseSchema,
	getDatabaseById: UnsupportedResponseSchema,
	createDatabase: UnsupportedResponseSchema,
	deleteDatabase: UnsupportedResponseSchema,
	createTable: UnsupportedResponseSchema,
	updateTable: UnsupportedResponseSchema,
	deleteTable: UnsupportedResponseSchema,
	createField: UnsupportedResponseSchema,
	updateField: UnsupportedResponseSchema,
	deleteField: UnsupportedResponseSchema,
	listSubmissions: ListSubmissionsResponseSchema,
	getSubmissionById: GetSubmissionByIdResponseSchema,
	createSubmission: CreateSubmissionResponseSchema,
	updateSubmission: UnsupportedResponseSchema,
	deleteSubmission: DeleteSubmissionResponseSchema,
	createDatabaseWebhook: CreateWebhookResponseSchema,
	listDatabaseWebhooks: UnsupportedResponseSchema,
	deleteDatabaseWebhook: UnsupportedResponseSchema,
	removeFormWebhook: RemoveWebhookResponseSchema,
	invalidateAccessToken: InvalidateAccessTokenResponseSchema,
	authorizeOAuth: AuthorizeOAuthResponseSchema,
} as const;

// ── Export Types ────────────────────────────────────────────────────────────

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

// ── Named Type Exports ─────────────────────────────────────────────────────

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
export type CreateWebhookInput = z.infer<typeof CreateWebhookInputSchema>;
export type CreateWebhookResponse = z.infer<typeof CreateWebhookResponseSchema>;
export type RemoveWebhookInput = z.infer<typeof RemoveWebhookInputSchema>;
export type RemoveWebhookResponse = z.infer<typeof RemoveWebhookResponseSchema>;
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
