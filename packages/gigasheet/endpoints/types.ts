import { z } from 'zod';

// ============================================================================
// User Schemas
// ============================================================================

export const UserWhoamiInputSchema = z.object({}).strict();
export type UserWhoamiInput = z.infer<typeof UserWhoamiInputSchema>;

export const UserWhoamiOutputSchema = z.object({
	username: z.string(),
	authenticated: z.boolean(),
});
export type UserWhoamiResponse = z.infer<typeof UserWhoamiOutputSchema>;

export const UserGetDetailsInputSchema = z.object({}).strict();
export type UserGetDetailsInput = z.infer<typeof UserGetDetailsInputSchema>;

// `unknown` because user profile properties returned by Gigasheet include extensible metadata.
export const UserGetDetailsOutputSchema = z
	.object({
		username: z.string().optional(),
		email: z.string().optional(),
		name: z.string().optional(),
		id: z.string().optional(),
	})
	.passthrough();
export type UserGetDetailsResponse = z.infer<typeof UserGetDetailsOutputSchema>;

export const UserGetSpaceUsedInputSchema = z.object({}).strict();
export type UserGetSpaceUsedInput = z.infer<typeof UserGetSpaceUsedInputSchema>;

export const UserGetSpaceUsedOutputSchema = z.object({
	bytesUsed: z.number().int().nonnegative(),
});
export type UserGetSpaceUsedResponse = z.infer<
	typeof UserGetSpaceUsedOutputSchema
>;

export const UserGetEnrichmentCreditsInputSchema = z.object({}).strict();
export type UserGetEnrichmentCreditsInput = z.infer<
	typeof UserGetEnrichmentCreditsInputSchema
>;

export const UserGetEnrichmentCreditsOutputSchema = z.object({
	Limit: z.number().int().nonnegative(),
	Used: z.number().int().nonnegative(),
});
export type UserGetEnrichmentCreditsResponse = z.infer<
	typeof UserGetEnrichmentCreditsOutputSchema
>;

// ============================================================================
// Upload Schemas
// ============================================================================

export const UploadFromUrlInputSchema = z
	.object({
		url: z.string().url(),
		name: z.string().min(1),
		folderHandle: z.string().optional(),
		targetHandle: z.string().optional(),
		skipNotification: z.boolean().optional(),
		skipTypeInference: z.boolean().optional(),
		callbackUrl: z.string().optional(),
	})
	.strict();
export type UploadFromUrlInput = z.infer<typeof UploadFromUrlInputSchema>;

export const UploadFromUrlOutputSchema = z.object({
	Handle: z.string(),
	Message: z.string().optional(),
	Success: z.boolean().optional(),
	Error: z.string().nullable().optional(),
});
export type UploadFromUrlResponse = z.infer<typeof UploadFromUrlOutputSchema>;

export const UploadDirectInputSchema = z
	.object({
		name: z.string().min(1),
		contents: z.union([z.string(), z.array(z.number())]),
		parentDirectory: z.string().optional(),
		targetHandle: z.string().optional(),
		skipNotification: z.boolean().optional(),
		skipTypeInference: z.boolean().optional(),
		callbackUrl: z.string().optional(),
	})
	.strict();
export type UploadDirectInput = z.infer<typeof UploadDirectInputSchema>;

export const UploadDirectOutputSchema = z.object({
	Handle: z.string(),
	Message: z.string().optional(),
	Success: z.boolean().optional(),
	Error: z.string().nullable().optional(),
});
export type UploadDirectResponse = z.infer<typeof UploadDirectOutputSchema>;

// ============================================================================
// Datasets Schemas
// ============================================================================

export const DatasetsGetInputSchema = z
	.object({
		handle: z.string().min(1),
	})
	.strict();
export type DatasetsGetInput = z.infer<typeof DatasetsGetInputSchema>;

// `unknown` because dataset metadata contains dynamic column definitions, parsing info, and custom attributes.
export const DatasetsGetOutputSchema = z
	.object({
		FileUuid: z.string().optional(),
		FileName: z.string().optional(),
		FileSize: z.string().optional(),
		FileRows: z.number().optional(),
		Status: z
			.enum(['uploading', 'loading', 'processing', 'processed', 'error'])
			.optional(),
		DetailedStatus: z.string().optional(),
		Headers: z.array(z.string()).optional(),
		FieldsTypes: z.array(z.string()).optional(),
		IsDirectory: z.boolean().optional(),
		Owner: z.string().optional(),
		ParentDirectory: z.string().optional(),
		CreatedAt: z.string().optional(),
		LastUpdated: z.string().optional(),
		Note: z.string().optional(),
	})
	.passthrough();
export type DatasetsGetResponse = z.infer<typeof DatasetsGetOutputSchema>;

export const DatasetsDeleteInputSchema = z
	.object({
		handle: z.string().min(1),
		recursive: z.boolean().optional(),
	})
	.strict();
export type DatasetsDeleteInput = z.infer<typeof DatasetsDeleteInputSchema>;

export const DatasetsDeleteOutputSchema = z.object({
	Success: z.boolean().optional(),
	Message: z.string().optional(),
});
export type DatasetsDeleteResponse = z.infer<typeof DatasetsDeleteOutputSchema>;

export const DatasetsGetColumnsInputSchema = z
	.object({
		handle: z.string().min(1),
		showHidden: z.boolean().optional(),
		type: z.string().optional(),
	})
	.strict();
export type DatasetsGetColumnsInput = z.infer<
	typeof DatasetsGetColumnsInputSchema
>;

export const DatasetsGetColumnsOutputSchema = z.array(
	z.object({
		Id: z.string(),
		Name: z.string(),
		FieldType: z.string().optional(),
		Origin: z.string().optional(),
	}),
);
export type DatasetsGetColumnsResponse = z.infer<
	typeof DatasetsGetColumnsOutputSchema
>;

export const DatasetsListInputSchema = z
	.object({
		handle: z.string().optional(),
	})
	.strict();
export type DatasetsListInput = z.infer<typeof DatasetsListInputSchema>;

// `unknown` because directory items contain flexible provider metadata and sharing settings.
export const DatasetsListOutputSchema = z.array(
	z
		.object({
			// `unknown` because nested metadata object contains dynamic dataset attributes.
			metadata: z
				.object({
					FileUuid: z.string().optional(),
					FileName: z.string().optional(),
					FileRows: z.number().optional(),
					FileSize: z.string().optional(),
					Status: z.string().optional(),
					IsDirectory: z.boolean().optional(),
					Owner: z.string().optional(),
					ParentDirectory: z.string().optional(),
					CreatedAt: z.string().optional(),
					LastUpdated: z.string().optional(),
				})
				.passthrough()
				.optional(),
			permissions: z.array(z.number()).optional(),
			within_quota: z.boolean().optional(),
		})
		.passthrough(),
);
export type DatasetsListResponse = z.infer<typeof DatasetsListOutputSchema>;

export const DatasetsGetOperationStatusInputSchema = z
	.object({
		handle: z.string().min(1),
	})
	.strict();
export type DatasetsGetOperationStatusInput = z.infer<
	typeof DatasetsGetOperationStatusInputSchema
>;

export const DatasetsGetOperationStatusOutputSchema = z.object({
	Status: z
		.union([z.enum(['Working', 'Done', 'Error']), z.literal('')])
		.optional(),
	Message: z.string().optional(),
	Owner: z.string().optional(),
	UpdatedAt: z.string().optional(),
});
export type DatasetsGetOperationStatusResponse = z.infer<
	typeof DatasetsGetOperationStatusOutputSchema
>;

// ============================================================================
// Rows Schemas
// ============================================================================

export const RowsAppendByNameInputSchema = z
	.object({
		handle: z.string().min(1),
		// `unknown` because spreadsheet records contain values of variable primitive types (string, number, boolean, null).
		records: z.array(z.record(z.string(), z.unknown())),
	})
	.strict();
export type RowsAppendByNameInput = z.infer<typeof RowsAppendByNameInputSchema>;

export const RowsAppendByNameOutputSchema = z.object({
	Success: z.boolean().optional(),
	Message: z.string().optional(),
});
export type RowsAppendByNameResponse = z.infer<
	typeof RowsAppendByNameOutputSchema
>;

export const RowsInsertBlankRowInputSchema = z
	.object({
		handle: z.string().min(1),
		index: z.number().int().min(0),
		num_rows: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
export type RowsInsertBlankRowInput = z.infer<
	typeof RowsInsertBlankRowInputSchema
>;

export const RowsInsertBlankRowOutputSchema = z.object({
	Success: z.boolean().optional(),
	Message: z.string().optional(),
});
export type RowsInsertBlankRowResponse = z.infer<
	typeof RowsInsertBlankRowOutputSchema
>;

export const RowsDeleteRowsInputSchema = z
	.object({
		handle: z.string().min(1),
		rows: z.array(z.number().int().min(0)),
	})
	.strict();
export type RowsDeleteRowsInput = z.infer<typeof RowsDeleteRowsInputSchema>;

export const RowsDeleteRowsOutputSchema = z.object({
	Success: z.boolean().optional(),
	Message: z.string().optional(),
});
export type RowsDeleteRowsResponse = z.infer<typeof RowsDeleteRowsOutputSchema>;

// ============================================================================
// Views Schemas
// ============================================================================

export const ViewsListInputSchema = z
	.object({
		handle: z.string().min(1),
	})
	.strict();
export type ViewsListInput = z.infer<typeof ViewsListInputSchema>;

export const ViewsListOutputSchema = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
		file: z.string().optional(),
		owner: z.string().optional(),
		client_state: z.string().optional(),
	}),
);
export type ViewsListResponse = z.infer<typeof ViewsListOutputSchema>;

export const ViewsGetInputSchema = z
	.object({
		handle: z.string().min(1),
		view: z.string().min(1),
	})
	.strict();
export type ViewsGetInput = z.infer<typeof ViewsGetInputSchema>;

export const ViewsGetOutputSchema = z.object({
	id: z.string(),
	name: z.string(),
	file: z.string().optional(),
	owner: z.string().optional(),
	client_state: z.string().optional(),
});
export type ViewsGetResponse = z.infer<typeof ViewsGetOutputSchema>;

// ============================================================================
// Exports Schemas
// ============================================================================

export const ExportsCreateInputSchema = z
	.object({
		handle: z.string().min(1),
		filename: z.string().optional(),
		folderHandle: z.string().optional(),
		compressionType: z.enum(['zip', 'gzip']).optional(),
		decompress: z.boolean().optional(),
		recordsPerFile: z.number().int().positive().optional(),
		row_limit_from_head: z.number().int().positive().optional(),
		skipNotification: z.boolean().optional(),
		useClientState: z.boolean().optional(),
		// `unknown` because gridState accepts complex AgGrid filter models and sort specifications.
		gridState: z.record(z.string(), z.unknown()).optional(),
	})
	.strict();
export type ExportsCreateInput = z.infer<typeof ExportsCreateInputSchema>;

export const ExportsCreateOutputSchema = z.object({
	handle: z.string(),
});
export type ExportsCreateResponse = z.infer<typeof ExportsCreateOutputSchema>;

export const ExportsDownloadInputSchema = z
	.object({
		handle: z.string().min(1),
	})
	.strict();
export type ExportsDownloadInput = z.infer<typeof ExportsDownloadInputSchema>;

export const ExportsDownloadOutputSchema = z.object({
	presignedUrl: z.string().url(),
	error: z.string().optional(),
});
export type ExportsDownloadResponse = z.infer<
	typeof ExportsDownloadOutputSchema
>;

// ============================================================================
// Endpoint Registry Types & Schemas
// ============================================================================

export type GigasheetEndpointInputs = {
	'user.whoami': UserWhoamiInput;
	'user.getDetails': UserGetDetailsInput;
	'user.getSpaceUsed': UserGetSpaceUsedInput;
	'user.getEnrichmentCredits': UserGetEnrichmentCreditsInput;
	'upload.fromUrl': UploadFromUrlInput;
	'upload.direct': UploadDirectInput;
	'datasets.get': DatasetsGetInput;
	'datasets.delete': DatasetsDeleteInput;
	'datasets.getColumns': DatasetsGetColumnsInput;
	'datasets.list': DatasetsListInput;
	'datasets.getOperationStatus': DatasetsGetOperationStatusInput;
	'rows.appendByName': RowsAppendByNameInput;
	'rows.insertBlankRow': RowsInsertBlankRowInput;
	'rows.deleteRows': RowsDeleteRowsInput;
	'views.list': ViewsListInput;
	'views.get': ViewsGetInput;
	'exports.create': ExportsCreateInput;
	'exports.download': ExportsDownloadInput;
};

export type GigasheetEndpointOutputs = {
	'user.whoami': UserWhoamiResponse;
	'user.getDetails': UserGetDetailsResponse;
	'user.getSpaceUsed': UserGetSpaceUsedResponse;
	'user.getEnrichmentCredits': UserGetEnrichmentCreditsResponse;
	'upload.fromUrl': UploadFromUrlResponse;
	'upload.direct': UploadDirectResponse;
	'datasets.get': DatasetsGetResponse;
	'datasets.delete': DatasetsDeleteResponse;
	'datasets.getColumns': DatasetsGetColumnsResponse;
	'datasets.list': DatasetsListResponse;
	'datasets.getOperationStatus': DatasetsGetOperationStatusResponse;
	'rows.appendByName': RowsAppendByNameResponse;
	'rows.insertBlankRow': RowsInsertBlankRowResponse;
	'rows.deleteRows': RowsDeleteRowsResponse;
	'views.list': ViewsListResponse;
	'views.get': ViewsGetResponse;
	'exports.create': ExportsCreateResponse;
	'exports.download': ExportsDownloadResponse;
};

export const GigasheetEndpointInputSchemas = {
	'user.whoami': UserWhoamiInputSchema,
	'user.getDetails': UserGetDetailsInputSchema,
	'user.getSpaceUsed': UserGetSpaceUsedInputSchema,
	'user.getEnrichmentCredits': UserGetEnrichmentCreditsInputSchema,
	'upload.fromUrl': UploadFromUrlInputSchema,
	'upload.direct': UploadDirectInputSchema,
	'datasets.get': DatasetsGetInputSchema,
	'datasets.delete': DatasetsDeleteInputSchema,
	'datasets.getColumns': DatasetsGetColumnsInputSchema,
	'datasets.list': DatasetsListInputSchema,
	'datasets.getOperationStatus': DatasetsGetOperationStatusInputSchema,
	'rows.appendByName': RowsAppendByNameInputSchema,
	'rows.insertBlankRow': RowsInsertBlankRowInputSchema,
	'rows.deleteRows': RowsDeleteRowsInputSchema,
	'views.list': ViewsListInputSchema,
	'views.get': ViewsGetInputSchema,
	'exports.create': ExportsCreateInputSchema,
	'exports.download': ExportsDownloadInputSchema,
} as const;

export const GigasheetEndpointOutputSchemas = {
	'user.whoami': UserWhoamiOutputSchema,
	'user.getDetails': UserGetDetailsOutputSchema,
	'user.getSpaceUsed': UserGetSpaceUsedOutputSchema,
	'user.getEnrichmentCredits': UserGetEnrichmentCreditsOutputSchema,
	'upload.fromUrl': UploadFromUrlOutputSchema,
	'upload.direct': UploadDirectOutputSchema,
	'datasets.get': DatasetsGetOutputSchema,
	'datasets.delete': DatasetsDeleteOutputSchema,
	'datasets.getColumns': DatasetsGetColumnsOutputSchema,
	'datasets.list': DatasetsListOutputSchema,
	'datasets.getOperationStatus': DatasetsGetOperationStatusOutputSchema,
	'rows.appendByName': RowsAppendByNameOutputSchema,
	'rows.insertBlankRow': RowsInsertBlankRowOutputSchema,
	'rows.deleteRows': RowsDeleteRowsOutputSchema,
	'views.list': ViewsListOutputSchema,
	'views.get': ViewsGetOutputSchema,
	'exports.create': ExportsCreateOutputSchema,
	'exports.download': ExportsDownloadOutputSchema,
} as const;
