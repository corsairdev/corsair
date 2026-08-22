import { z } from 'zod';

// Base Record metadata schema with passthrough for dynamic fields
export const XataRecordSchema = z
	.object({
		id: z.string(),
		xata: z
			.object({
				version: z.number().optional(),
				createdAt: z.string().optional(),
				updatedAt: z.string().optional(),
			})
			.optional(),
	})
	.passthrough();

export type XataRecord = z.infer<typeof XataRecordSchema> &
	Record<string, unknown>;

// Workspaces List
export const WorkspacesListInputSchema = z.object({});
export type WorkspacesListInput = z.infer<typeof WorkspacesListInputSchema>;

export const WorkspaceSchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string().optional(),
	role: z.string().optional(),
});

export const WorkspacesListResponseSchema = z.object({
	workspaces: z.array(WorkspaceSchema),
});
export type WorkspacesListResponse = z.infer<
	typeof WorkspacesListResponseSchema
>;

// Databases List
export const DatabasesListInputSchema = z.object({
	workspaceId: z.string().optional(),
});
export type DatabasesListInput = z.infer<typeof DatabasesListInputSchema>;

export const DatabaseSchema = z.object({
	name: z.string(),
	createdAt: z.string().optional(),
});

export const DatabasesListResponseSchema = z.object({
	dbs: z.array(DatabaseSchema),
});
export type DatabasesListResponse = z.infer<typeof DatabasesListResponseSchema>;

// Records Create
export const RecordsCreateInputSchema = z.object({
	workspaceId: z.string().optional(),
	region: z.string().optional(),
	dbName: z.string(),
	branch: z.string().optional(),
	tableName: z.string(),
	data: z.record(z.string(), z.unknown()),
});
export type RecordsCreateInput = z.infer<typeof RecordsCreateInputSchema>;

export const RecordsCreateResponseSchema = XataRecordSchema;
export type RecordsCreateResponse = z.infer<typeof RecordsCreateResponseSchema>;

// Records Get
export const RecordsGetInputSchema = z.object({
	workspaceId: z.string().optional(),
	region: z.string().optional(),
	dbName: z.string(),
	branch: z.string().optional(),
	tableName: z.string(),
	recordId: z.string(),
});
export type RecordsGetInput = z.infer<typeof RecordsGetInputSchema>;

export const RecordsGetResponseSchema = XataRecordSchema;
export type RecordsGetResponse = z.infer<typeof RecordsGetResponseSchema>;

// Records Update
export const RecordsUpdateInputSchema = z.object({
	workspaceId: z.string().optional(),
	region: z.string().optional(),
	dbName: z.string(),
	branch: z.string().optional(),
	tableName: z.string(),
	recordId: z.string(),
	data: z.record(z.string(), z.unknown()),
});
export type RecordsUpdateInput = z.infer<typeof RecordsUpdateInputSchema>;

export const RecordsUpdateResponseSchema = XataRecordSchema;
export type RecordsUpdateResponse = z.infer<typeof RecordsUpdateResponseSchema>;

// Records Delete
export const RecordsDeleteInputSchema = z.object({
	workspaceId: z.string().optional(),
	region: z.string().optional(),
	dbName: z.string(),
	branch: z.string().optional(),
	tableName: z.string(),
	recordId: z.string(),
});
export type RecordsDeleteInput = z.infer<typeof RecordsDeleteInputSchema>;

export const RecordsDeleteResponseSchema = z.object({
	id: z.string().optional(),
	success: z.boolean().optional(),
});
export type RecordsDeleteResponse = z.infer<typeof RecordsDeleteResponseSchema>;

// Records Query
export const RecordsQueryInputSchema = z.object({
	workspaceId: z.string().optional(),
	region: z.string().optional(),
	dbName: z.string(),
	branch: z.string().optional(),
	tableName: z.string(),
	filter: z.record(z.string(), z.unknown()).optional(),
	sort: z
		.union([
			z.record(z.string(), z.enum(['asc', 'desc'])),
			z.array(z.record(z.string(), z.enum(['asc', 'desc']))),
		])
		.optional(),
	columns: z.array(z.string()).optional(),
	page: z
		.object({
			size: z.number().optional(),
			after: z.string().optional(),
		})
		.optional(),
});
export type RecordsQueryInput = z.infer<typeof RecordsQueryInputSchema>;

export const RecordsQueryResponseSchema = z.object({
	records: z.array(XataRecordSchema),
	meta: z
		.object({
			page: z
				.object({
					cursor: z.string().optional(),
					more: z.boolean().optional(),
				})
				.optional(),
		})
		.optional(),
});
export type RecordsQueryResponse = z.infer<typeof RecordsQueryResponseSchema>;

// ─── Organizations ───────────────────────────────────────────────────────────

export const OrganizationStatusSchema = z.object({
	status: z.enum(['enabled', 'disabled']).optional(),
	disabled_by_admin: z.boolean().optional(),
	billing_status: z.string().optional(),
	usage_tier: z.string().optional(),
	last_updated: z.string().optional(),
	admin_reason: z.string().optional(),
	billing_reason: z.string().optional(),
	created_at: z.string().optional(),
});

export const OrganizationSchema = z.object({
	id: z.string(),
	name: z.string(),
	status: OrganizationStatusSchema.optional(),
	marketplace: z.string().optional(),
});

// organizations.list
export const OrganizationsListInputSchema = z.object({});
export type OrganizationsListInput = z.infer<
	typeof OrganizationsListInputSchema
>;
export const OrganizationsListResponseSchema = z.object({
	organizations: z.array(OrganizationSchema),
});
export type OrganizationsListResponse = z.infer<
	typeof OrganizationsListResponseSchema
>;

// organizations.get
export const OrganizationsGetInputSchema = z.object({
	organizationId: z.string(),
});
export type OrganizationsGetInput = z.infer<typeof OrganizationsGetInputSchema>;
export const OrganizationsGetResponseSchema = OrganizationSchema;
export type OrganizationsGetResponse = z.infer<
	typeof OrganizationsGetResponseSchema
>;

// organizations.update
export const OrganizationsUpdateInputSchema = z.object({
	organizationId: z.string(),
	name: z.string().optional(),
});
export type OrganizationsUpdateInput = z.infer<
	typeof OrganizationsUpdateInputSchema
>;
export const OrganizationsUpdateResponseSchema = OrganizationSchema;
export type OrganizationsUpdateResponse = z.infer<
	typeof OrganizationsUpdateResponseSchema
>;

// organizations.getLimits
export const OrganizationsGetLimitsInputSchema = z.object({
	organizationId: z.string(),
});
export type OrganizationsGetLimitsInput = z.infer<
	typeof OrganizationsGetLimitsInputSchema
>;
export const OrganizationsGetLimitsResponseSchema = z
	.object({
		maxProjects: z.number().optional(),
		maxBranches: z.number().optional(),
		maxBranchesPerProject: z.number().optional(),
		allowedRegions: z.array(z.string()).optional(),
	})
	.passthrough();
export type OrganizationsGetLimitsResponse = z.infer<
	typeof OrganizationsGetLimitsResponseSchema
>;

// organizations.getProjectLimits
export const OrganizationsGetProjectLimitsInputSchema = z.object({
	organizationId: z.string(),
});
export type OrganizationsGetProjectLimitsInput = z.infer<
	typeof OrganizationsGetProjectLimitsInputSchema
>;
export const OrganizationsGetProjectLimitsResponseSchema = z
	.object({
		maxInstances: z.number().optional(),
		maxStorage: z.number().optional(),
		allowedRegions: z.array(z.string()).optional(),
		maxBranches: z.number().optional(),
	})
	.passthrough();
export type OrganizationsGetProjectLimitsResponse = z.infer<
	typeof OrganizationsGetProjectLimitsResponseSchema
>;

// organizations.listApiKeys
export const OrganizationsListApiKeysInputSchema = z.object({
	organizationId: z.string(),
});
export type OrganizationsListApiKeysInput = z.infer<
	typeof OrganizationsListApiKeysInputSchema
>;
export const ApiKeyPreviewSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		createdAt: z.string().optional(),
		lastUsedAt: z.string().optional(),
	})
	.passthrough();
export const OrganizationsListApiKeysResponseSchema = z.object({
	keys: z.array(ApiKeyPreviewSchema),
});
export type OrganizationsListApiKeysResponse = z.infer<
	typeof OrganizationsListApiKeysResponseSchema
>;

// ─── Regions ─────────────────────────────────────────────────────────────────

// regions.list
export const RegionsListInputSchema = z.object({
	organizationId: z.string(),
});
export type RegionsListInput = z.infer<typeof RegionsListInputSchema>;
export const RegionSchema = z.object({
	id: z.string(),
	publicAccess: z.boolean(),
	backupsEnabled: z.boolean(),
	provider: z.enum(['aws', 'gcp', 'custom']),
	organizationId: z.string().nullable(),
});
export const RegionsListResponseSchema = z.object({
	regions: z.array(RegionSchema),
});
export type RegionsListResponse = z.infer<typeof RegionsListResponseSchema>;

// ─── Images ──────────────────────────────────────────────────────────────────

// images.list
export const ImagesListInputSchema = z.object({
	organizationId: z.string(),
	region: z.string().optional(),
});
export type ImagesListInput = z.infer<typeof ImagesListInputSchema>;
export const ImageSchema = z
	.object({
		name: z.string().optional(),
		version: z.string().optional(),
	})
	.passthrough();
export const ImagesListResponseSchema = z.object({
	images: z.array(ImageSchema),
});
export type ImagesListResponse = z.infer<typeof ImagesListResponseSchema>;

// ─── Instance Types ───────────────────────────────────────────────────────────

// instanceTypes.list
export const InstanceTypesListInputSchema = z.object({
	organizationId: z.string(),
	region: z.string(),
});
export type InstanceTypesListInput = z.infer<
	typeof InstanceTypesListInputSchema
>;
export const InstanceTypeSchema = z.object({
	name: z.string(),
	vcpus: z.number(),
	ram: z.number(),
	hourlyRate: z.number(),
	storageMonthlyRate: z.number(),
	region: z.string(),
});
export const InstanceTypesListResponseSchema = z.object({
	instanceTypes: z.array(InstanceTypeSchema),
});
export type InstanceTypesListResponse = z.infer<
	typeof InstanceTypesListResponseSchema
>;

// ─── Extensions ──────────────────────────────────────────────────────────────

// extensions.list
export const ExtensionsListInputSchema = z.object({
	organizationId: z.string(),
	image: z.string(),
	region: z.string().optional(),
});
export type ExtensionsListInput = z.infer<typeof ExtensionsListInputSchema>;
export const ExtensionSchema = z
	.object({
		name: z.string().optional(),
		version: z.string().optional(),
	})
	.passthrough();
export const ExtensionsListResponseSchema = z.object({
	extensions: z.array(ExtensionSchema),
});
export type ExtensionsListResponse = z.infer<
	typeof ExtensionsListResponseSchema
>;

// ─── Endpoint Input/Output Maps ───────────────────────────────────────────────

export type XataEndpointInputs = {
	workspacesList: WorkspacesListInput;
	databasesList: DatabasesListInput;
	recordsCreate: RecordsCreateInput;
	recordsGet: RecordsGetInput;
	recordsUpdate: RecordsUpdateInput;
	recordsDelete: RecordsDeleteInput;
	recordsQuery: RecordsQueryInput;
	organizationsList: OrganizationsListInput;
	organizationsGet: OrganizationsGetInput;
	organizationsUpdate: OrganizationsUpdateInput;
	organizationsGetLimits: OrganizationsGetLimitsInput;
	organizationsGetProjectLimits: OrganizationsGetProjectLimitsInput;
	organizationsListApiKeys: OrganizationsListApiKeysInput;
	regionsList: RegionsListInput;
	imagesList: ImagesListInput;
	instanceTypesList: InstanceTypesListInput;
	extensionsList: ExtensionsListInput;
};

export type XataEndpointOutputs = {
	workspacesList: WorkspacesListResponse;
	databasesList: DatabasesListResponse;
	recordsCreate: RecordsCreateResponse;
	recordsGet: RecordsGetResponse;
	recordsUpdate: RecordsUpdateResponse;
	recordsDelete: RecordsDeleteResponse;
	recordsQuery: RecordsQueryResponse;
	organizationsList: OrganizationsListResponse;
	organizationsGet: OrganizationsGetResponse;
	organizationsUpdate: OrganizationsUpdateResponse;
	organizationsGetLimits: OrganizationsGetLimitsResponse;
	organizationsGetProjectLimits: OrganizationsGetProjectLimitsResponse;
	organizationsListApiKeys: OrganizationsListApiKeysResponse;
	regionsList: RegionsListResponse;
	imagesList: ImagesListResponse;
	instanceTypesList: InstanceTypesListResponse;
	extensionsList: ExtensionsListResponse;
};

export const XataEndpointInputSchemas = {
	workspacesList: WorkspacesListInputSchema,
	databasesList: DatabasesListInputSchema,
	recordsCreate: RecordsCreateInputSchema,
	recordsGet: RecordsGetInputSchema,
	recordsUpdate: RecordsUpdateInputSchema,
	recordsDelete: RecordsDeleteInputSchema,
	recordsQuery: RecordsQueryInputSchema,
	organizationsList: OrganizationsListInputSchema,
	organizationsGet: OrganizationsGetInputSchema,
	organizationsUpdate: OrganizationsUpdateInputSchema,
	organizationsGetLimits: OrganizationsGetLimitsInputSchema,
	organizationsGetProjectLimits: OrganizationsGetProjectLimitsInputSchema,
	organizationsListApiKeys: OrganizationsListApiKeysInputSchema,
	regionsList: RegionsListInputSchema,
	imagesList: ImagesListInputSchema,
	instanceTypesList: InstanceTypesListInputSchema,
	extensionsList: ExtensionsListInputSchema,
} as const;

export const XataEndpointOutputSchemas = {
	workspacesList: WorkspacesListResponseSchema,
	databasesList: DatabasesListResponseSchema,
	recordsCreate: RecordsCreateResponseSchema,
	recordsGet: RecordsGetResponseSchema,
	recordsUpdate: RecordsUpdateResponseSchema,
	recordsDelete: RecordsDeleteResponseSchema,
	recordsQuery: RecordsQueryResponseSchema,
	organizationsList: OrganizationsListResponseSchema,
	organizationsGet: OrganizationsGetResponseSchema,
	organizationsUpdate: OrganizationsUpdateResponseSchema,
	organizationsGetLimits: OrganizationsGetLimitsResponseSchema,
	organizationsGetProjectLimits: OrganizationsGetProjectLimitsResponseSchema,
	organizationsListApiKeys: OrganizationsListApiKeysResponseSchema,
	regionsList: RegionsListResponseSchema,
	imagesList: ImagesListResponseSchema,
	instanceTypesList: InstanceTypesListResponseSchema,
	extensionsList: ExtensionsListResponseSchema,
} as const;
