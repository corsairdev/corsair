import { z } from 'zod';

// ============================================================================
// Shared primitives (Northflank pagination + response envelope conventions)
// Docs: https://northflank.com/docs/v1/api/use-the-api
// List responses carry `pagination` as a TOP-LEVEL sibling of `data`
// (see list-pipelines / list-project-secrets examples), not nested in `data`.
// ============================================================================

export const PaginationInputSchema = z.object({
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(100).optional(),
	cursor: z.string().optional(),
});

export type PaginationInput = z.infer<typeof PaginationInputSchema>;

export const PaginationSchema = z.object({
	hasNextPage: z.boolean(),
	cursor: z.string().optional(),
	count: z.number(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

// ============================================================================
// Projects — docs: /docs/v1/api/team/projects/*
// ============================================================================

export const ProjectSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	color: z.string().optional(),
	region: z.string().optional(),
	clusterId: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ProjectsListInputSchema = PaginationInputSchema.optional();

export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

export const ProjectsListOutputSchema = z.object({
	data: z.object({
		projects: z.array(ProjectSchema),
	}),
	pagination: PaginationSchema.optional(),
});

export type ProjectsListOutput = z.infer<typeof ProjectsListOutputSchema>;

export const ProjectsGetInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
});

export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;

export const ProjectsGetOutputSchema = z.object({
	data: ProjectSchema,
});

export type ProjectsGetOutput = z.infer<typeof ProjectsGetOutputSchema>;

export const ProjectsCreateInputSchema = z
	.object({
		name: z.string().min(1, 'name is required'),
		description: z.string().optional(),
		region: z.string().min(1).optional(),
		clusterId: z.string().min(1).optional(),
		color: z.string().optional(),
	})
	.refine((v) => v.region !== undefined || v.clusterId !== undefined, {
		message: 'Either region or clusterId is required',
	});

export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;

export const ProjectsCreateOutputSchema = z.object({
	data: ProjectSchema,
});

export type ProjectsCreateOutput = z.infer<typeof ProjectsCreateOutputSchema>;

// PUT /v1/projects — upsert keyed by project name in the body (no projectId
// path param). Docs: /docs/v1/api/team/projects/create-or-update-project
// Body is one of {region} or {clusterId} (BYOC), like create.
export const ProjectsCreateOrUpdateInputSchema = z
	.object({
		name: z.string().min(1, 'name is required'),
		description: z.string().optional(),
		color: z.string().optional(),
		region: z.string().min(1).optional(),
		clusterId: z.string().min(1).optional(),
	})
	.refine((v) => v.region !== undefined || v.clusterId !== undefined, {
		message: 'Either region or clusterId is required',
	});

export type ProjectsCreateOrUpdateInput = z.infer<
	typeof ProjectsCreateOrUpdateInputSchema
>;

export const ProjectsCreateOrUpdateOutputSchema = z.object({
	data: ProjectSchema,
});

export type ProjectsCreateOrUpdateOutput = z.infer<
	typeof ProjectsCreateOrUpdateOutputSchema
>;

// PATCH /v1/projects/{projectId} — body is description/color only (no name).
// Docs: /docs/v1/api/team/projects/update-project
export const ProjectsUpdateInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	description: z.string().optional(),
	color: z.string().optional(),
});

export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;

export const ProjectsUpdateOutputSchema = z.object({
	data: ProjectSchema,
});

export type ProjectsUpdateOutput = z.infer<typeof ProjectsUpdateOutputSchema>;

// DELETE /v1/projects/{projectId}?delete_child_objects={boolean}
// Docs: /docs/v1/api/team/projects/delete-project
export const ProjectsDeleteInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	delete_child_objects: z.boolean().optional(),
});

export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;

export const ProjectsDeleteOutputSchema = z.object({
	data: z.object({}).passthrough(),
});

export type ProjectsDeleteOutput = z.infer<typeof ProjectsDeleteOutputSchema>;

// ============================================================================
// Services — docs: /docs/v1/api/project/services/list-services
// Only `list` is in scope for this plugin.
// ============================================================================

export const ServiceSchema = z.object({
	id: z.string(),
	appId: z.string().optional(),
	projectId: z.string().optional(),
	stageId: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	serviceType: z.enum(['combined', 'build', 'deployment']).optional(),
	disabledCI: z.boolean().optional(),
	disabledCD: z.boolean().optional(),
});

export type Service = z.infer<typeof ServiceSchema>;

export const ServicesListInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(100).optional(),
	cursor: z.string().optional(),
});

export type ServicesListInput = z.infer<typeof ServicesListInputSchema>;

export const ServicesListOutputSchema = z.object({
	data: z.object({
		services: z.array(ServiceSchema),
	}),
	pagination: PaginationSchema.optional(),
});

export type ServicesListOutput = z.infer<typeof ServicesListOutputSchema>;

// ============================================================================
// Secrets — docs: /docs/v1/api/project/secrets/*
// Secret groups: POST create, PUT upsert (no secretId in path),
// PATCH partial update, POST /{secretId} full update,
// GET /{secretId}/details for linked-addon details.
// secretType enum per docs: environment-arguments | environment | arguments
// (`type` is the hierarchy switch: secret | config).
// ============================================================================

export const SecretNfObjectSchema = z.object({
	id: z.string(),
	type: z.enum(['service', 'job']),
});

export type SecretNfObject = z.infer<typeof SecretNfObjectSchema>;

export const SecretRestrictionsSchema = z.object({
	restricted: z.boolean().optional(),
	nfObjects: z.array(SecretNfObjectSchema).optional(),
	tags: z.array(z.string()).optional(),
	tagMatchCondition: z.enum(['and', 'or']).optional(),
	stageIds: z.array(z.string()).optional(),
});

export type SecretRestrictions = z.infer<typeof SecretRestrictionsSchema>;

export const SecretAddonKeySchema = z.object({
	keyName: z.string(),
	aliases: z.array(z.string()).optional(),
});

export type SecretAddonKey = z.infer<typeof SecretAddonKeySchema>;

export const SecretAddonDependencySchema = z.object({
	addonId: z.string(),
	keys: z.array(SecretAddonKeySchema).optional(),
});

export type SecretAddonDependency = z.infer<typeof SecretAddonDependencySchema>;

export const SecretFileValueSchema = z.object({
	data: z.string(),
	encoding: z.string().optional(),
});

export type SecretFileValue = z.infer<typeof SecretFileValueSchema>;

export const SecretContentSchema = z.object({
	variables: z.record(z.string(), z.string()).optional(),
	files: z.record(z.string(), SecretFileValueSchema).optional(),
	dockerSecretMounts: z.record(z.string(), SecretFileValueSchema).optional(),
});

export type SecretContent = z.infer<typeof SecretContentSchema>;

export const SecretGroupSchema = z.object({
	id: z.string(),
	projectId: z.string().optional(),
	name: z.string(),
	description: z.string().optional(),
	tags: z.array(z.string()).optional(),
	type: z.enum(['secret', 'config']).optional(),
	secretType: z
		.enum(['environment-arguments', 'environment', 'arguments'])
		.optional(),
	priority: z.number().int().optional(),
	restrictions: SecretRestrictionsSchema.optional(),
	secrets: SecretContentSchema.optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export type SecretGroup = z.infer<typeof SecretGroupSchema>;

export const SecretsListInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(100).optional(),
	cursor: z.string().optional(),
});

export type SecretsListInput = z.infer<typeof SecretsListInputSchema>;

export const SecretsListOutputSchema = z.object({
	data: z.object({
		secrets: z.array(SecretGroupSchema),
	}),
	pagination: PaginationSchema.optional(),
});

export type SecretsListOutput = z.infer<typeof SecretsListOutputSchema>;

export const SecretsGetInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	secretId: z.string().min(1, 'secretId is required'),
	// show=this → only the group's secrets, inherited → only linked-addon
	// secrets, all (or omitted) → both.
	// Docs: /docs/v1/api/project/secrets/get-project-secret
	show: z.enum(['this', 'inherited', 'all']).optional(),
});

export type SecretsGetInput = z.infer<typeof SecretsGetInputSchema>;

export const SecretsGetOutputSchema = z.object({
	data: SecretGroupSchema,
});

export type SecretsGetOutput = z.infer<typeof SecretsGetOutputSchema>;

export const SecretsCreateInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	name: z.string().min(3).max(100),
	description: z.string().max(200).optional(),
	stageId: z.string().optional(),
	tags: z.array(z.string()).optional(),
	type: z.enum(['secret', 'config']).optional(),
	secretType: z.enum(['environment-arguments', 'environment', 'arguments']),
	priority: z.number().int(),
	restrictions: SecretRestrictionsSchema.optional(),
	addonDependencies: z.array(SecretAddonDependencySchema).optional(),
	externalAddonDependencies: z.array(SecretAddonDependencySchema).optional(),
	secrets: SecretContentSchema.optional(),
});

export type SecretsCreateInput = z.infer<typeof SecretsCreateInputSchema>;

export const SecretsCreateOutputSchema = z.object({
	data: SecretGroupSchema,
});

export type SecretsCreateOutput = z.infer<typeof SecretsCreateOutputSchema>;

// PUT /v1/projects/{projectId}/secrets — same body as create (upsert by name).
// Docs: /docs/v1/api/project/secrets/put-project-secret
export const SecretsCreateOrUpdateInputSchema = SecretsCreateInputSchema;

export type SecretsCreateOrUpdateInput = z.infer<
	typeof SecretsCreateOrUpdateInputSchema
>;

export const SecretsCreateOrUpdateOutputSchema = z.object({
	data: SecretGroupSchema,
});

export type SecretsCreateOrUpdateOutput = z.infer<
	typeof SecretsCreateOrUpdateOutputSchema
>;

// PATCH /v1/projects/{projectId}/secrets/{secretId} — all fields optional.
// Docs: /docs/v1/api/project/secrets/patch-project-secret
export const SecretsPatchInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	secretId: z.string().min(1, 'secretId is required'),
	description: z.string().max(200).optional(),
	stageId: z.string().optional(),
	tags: z.array(z.string()).optional(),
	type: z.enum(['secret', 'config']).optional(),
	secretType: z
		.enum(['environment-arguments', 'environment', 'arguments'])
		.optional(),
	priority: z.number().int().optional(),
	restrictions: SecretRestrictionsSchema.optional(),
	addonDependencies: z.array(SecretAddonDependencySchema).optional(),
	externalAddonDependencies: z.array(SecretAddonDependencySchema).optional(),
	secrets: SecretContentSchema.optional(),
});

export type SecretsPatchInput = z.infer<typeof SecretsPatchInputSchema>;

export const SecretsPatchOutputSchema = z.object({
	data: SecretGroupSchema,
});

export type SecretsPatchOutput = z.infer<typeof SecretsPatchOutputSchema>;

// POST /v1/projects/{projectId}/secrets/{secretId} — update, returns {data:{}}.
// Docs: /docs/v1/api/project/secrets/update-project-secret
export const SecretsUpdateInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	secretId: z.string().min(1, 'secretId is required'),
	description: z.string().max(200).optional(),
	priority: z.number().int().optional(),
	restrictions: SecretRestrictionsSchema.optional(),
	addonDependencies: z.array(SecretAddonDependencySchema).optional(),
	externalAddonDependencies: z.array(SecretAddonDependencySchema).optional(),
	type: z.enum(['secret', 'config']).optional(),
	secretType: z
		.enum(['environment-arguments', 'environment', 'arguments'])
		.optional(),
	secrets: SecretContentSchema.optional(),
});

export type SecretsUpdateInput = z.infer<typeof SecretsUpdateInputSchema>;

export const SecretsUpdateOutputSchema = z.object({
	data: z.object({}).passthrough(),
});

export type SecretsUpdateOutput = z.infer<typeof SecretsUpdateOutputSchema>;

// GET /v1/projects/{projectId}/secrets/{secretId}/details
// Docs: /docs/v1/api/project/secrets/get-project-secret-details
export const SecretAddonSecretSchema = z.object({
	id: z.string(),
	name: z.string(),
	addonType: z.string(),
	version: z.string(),
	variables: z.record(z.string(), z.string()).optional(),
});

export type SecretAddonSecret = z.infer<typeof SecretAddonSecretSchema>;

export const SecretsGetDetailsInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	secretId: z.string().min(1, 'secretId is required'),
});

export type SecretsGetDetailsInput = z.infer<
	typeof SecretsGetDetailsInputSchema
>;

export const SecretsGetDetailsOutputSchema = z.object({
	data: SecretGroupSchema.extend({
		addonSecrets: z.array(SecretAddonSecretSchema).optional(),
	}),
});

export type SecretsGetDetailsOutput = z.infer<
	typeof SecretsGetDetailsOutputSchema
>;

// ============================================================================
// Pipelines — docs: /docs/v1/api/project/pipelines/list-pipelines
// ============================================================================

export const PipelineSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export type Pipeline = z.infer<typeof PipelineSchema>;

export const PipelinesListInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(100).optional(),
	cursor: z.string().optional(),
});

export type PipelinesListInput = z.infer<typeof PipelinesListInputSchema>;

export const PipelinesListOutputSchema = z.object({
	data: z.object({
		pipelines: z.array(PipelineSchema),
	}),
	pagination: PaginationSchema.optional(),
});

export type PipelinesListOutput = z.infer<typeof PipelinesListOutputSchema>;

// ============================================================================
// Plans — docs: /docs/v1/api/miscellaneous/list-plans
// ============================================================================

export const PlanSchema = z.object({
	id: z.string(),
	name: z.string(),
	currency: z.string().optional(),
	amountPerMonth: z.number().optional(),
	amountPerHour: z.number().optional(),
});

export type Plan = z.infer<typeof PlanSchema>;

export const PlansListInputSchema = PaginationInputSchema.optional();

export type PlansListInput = z.infer<typeof PlansListInputSchema>;

export const PlansListOutputSchema = z.object({
	data: z.object({
		plans: z.array(PlanSchema),
	}),
	pagination: PaginationSchema.optional(),
});

export type PlansListOutput = z.infer<typeof PlansListOutputSchema>;

// ============================================================================
// Regions — docs: GET /v1/regions ("List regions", apiClient.list.regions)
// ============================================================================

export const RegionSchema = z.object({
	id: z.string(),
	name: z.string(),
	regionName: z.string().optional(),
});

export type Region = z.infer<typeof RegionSchema>;

export const RegionsListInputSchema = z.object({}).optional();

export type RegionsListInput = z.infer<typeof RegionsListInputSchema>;

export const RegionsListOutputSchema = z.object({
	data: z.object({
		regions: z.array(RegionSchema),
	}),
});

export type RegionsListOutput = z.infer<typeof RegionsListOutputSchema>;

// ============================================================================
// Addon types — GET /v1/addon-types ("List available addon types").
// Envelope live-verified 2026-09-17: { data: { addonTypes: [
// { type, name, description, features, resources, versions, majors } ] } }.
// `type` is the identifier callers need — it must be preserved, never
// stripped, by this schema.
// Path corroborated by the Jentic Northflank OpenAPI index and the
// "Get Addon Types endpoint" cross-reference in the create-addon docs.
// ============================================================================

export const AddonTypeSchema = z
	.object({
		// `type` is the identifier callers need — required so a missing
		// identifier fails loudly instead of being silently stripped.
		// Field shapes live-verified 2026-09-17 across all 8 catalog items:
		// type/name/description are strings; versions/majors are string
		// arrays; features/resources are objects (resources absent on one
		// item, hence optional).
		type: z.string(),
		name: z.string(),
		description: z.string().optional(),
		features: z.object({}).passthrough().optional(),
		resources: z.object({}).passthrough().optional(),
		versions: z.array(z.string()).optional(),
		majors: z.array(z.string()).optional(),
	})
	// Preserve any additional provider fields instead of stripping them.
	.passthrough();

export type AddonType = z.infer<typeof AddonTypeSchema>;

export const AddonTypesListInputSchema = PaginationInputSchema.optional();

export type AddonTypesListInput = z.infer<typeof AddonTypesListInputSchema>;

export const AddonTypesListOutputSchema = z.object({
	data: z.object({
		addonTypes: z.array(AddonTypeSchema),
	}),
	pagination: PaginationSchema.optional(),
});

export type AddonTypesListOutput = z.infer<typeof AddonTypesListOutputSchema>;

// ============================================================================
// Cloud providers (BYOC) — docs: /docs/v1/api/team/cloud-providers/*
// ============================================================================

export const CloudNodeTypeSchema = z.object({
	id: z.string(),
	name: z.string(),
	// Live catalog data contains nulls here (verified 2026-09-17).
	family: z.string().nullable().optional(),
	processorFamily: z.string().nullable().optional(),
	workloadType: z.string().nullable().optional(),
	generationAge: z.number().nullable().optional(),
	provider: z.string().nullable().optional(),
	resources: z
		.object({
			vcpu: z.number().nullable().optional(),
			memory: z.number().nullable().optional(),
		})
		.passthrough()
		.optional(),
});

export type CloudNodeType = z.infer<typeof CloudNodeTypeSchema>;

// GET /v1/cloud-providers/node-types
// Docs: /docs/v1/api/team/cloud-providers/list-provider-node-types
export const CloudNodeTypesListInputSchema = z.object({
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(100).optional(),
	cursor: z.string().optional(),
	provider: z.string().optional(),
	region: z.string().optional(),
	family: z.string().optional(),
	maxGenerationAge: z.number().int().optional(),
	hasGpu: z.boolean().optional(),
});

export type CloudNodeTypesListInput = z.infer<
	typeof CloudNodeTypesListInputSchema
>;

export const CloudNodeTypesListOutputSchema = z.object({
	// Live API returns { data: { nodeTypes: [...] } } — verified 2026-09-17.
	data: z.object({
		nodeTypes: z.array(CloudNodeTypeSchema),
	}),
	pagination: PaginationSchema.optional(),
});

export type CloudNodeTypesListOutput = z.infer<
	typeof CloudNodeTypesListOutputSchema
>;

export const CloudProviderRegionSchema = z.object({
	id: z.string(),
	name: z.string(),
	regionName: z.string().optional(),
	provider: z.string().optional(),
	availabilityZones: z
		.array(z.object({ id: z.string(), name: z.string() }))
		.optional(),
});

export type CloudProviderRegion = z.infer<typeof CloudProviderRegionSchema>;

// GET /v1/cloud-providers/regions
// Docs: /docs/v1/api/team/cloud-providers/list-provider-regions
export const CloudRegionsListInputSchema = z.object({
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(100).optional(),
	cursor: z.string().optional(),
	provider: z.string().optional(),
});

export type CloudRegionsListInput = z.infer<typeof CloudRegionsListInputSchema>;

export const CloudRegionsListOutputSchema = z.object({
	// Live API returns { data: { regions: [...] } } — verified 2026-09-17.
	data: z.object({
		regions: z.array(CloudProviderRegionSchema),
	}),
	pagination: PaginationSchema.optional(),
});

export type CloudRegionsListOutput = z.infer<
	typeof CloudRegionsListOutputSchema
>;

// ============================================================================
// Miscellaneous — docs: /docs/v1/api/team/miscellaneous/get-dns-id
// ============================================================================

export const MiscGetDnsIdInputSchema = z.object({}).optional();

export type MiscGetDnsIdInput = z.infer<typeof MiscGetDnsIdInputSchema>;

export const MiscGetDnsIdOutputSchema = z.object({
	data: z.object({
		dns: z.string(),
	}),
});

export type MiscGetDnsIdOutput = z.infer<typeof MiscGetDnsIdOutputSchema>;

// ============================================================================
// Schema Maps
// ============================================================================

export const NorthflankEndpointInputSchemas = {
	'projects.list': ProjectsListInputSchema,
	'projects.get': ProjectsGetInputSchema,
	'projects.create': ProjectsCreateInputSchema,
	'projects.createOrUpdate': ProjectsCreateOrUpdateInputSchema,
	'projects.update': ProjectsUpdateInputSchema,
	'projects.delete': ProjectsDeleteInputSchema,
	'services.list': ServicesListInputSchema,
	'secrets.list': SecretsListInputSchema,
	'secrets.get': SecretsGetInputSchema,
	'secrets.create': SecretsCreateInputSchema,
	'secrets.createOrUpdate': SecretsCreateOrUpdateInputSchema,
	'secrets.patch': SecretsPatchInputSchema,
	'secrets.update': SecretsUpdateInputSchema,
	'secrets.getDetails': SecretsGetDetailsInputSchema,
	'pipelines.list': PipelinesListInputSchema,
	'plans.list': PlansListInputSchema,
	'regions.list': RegionsListInputSchema,
	'addonTypes.list': AddonTypesListInputSchema,
	'cloudProviders.listNodeTypes': CloudNodeTypesListInputSchema,
	'cloudProviders.listRegions': CloudRegionsListInputSchema,
	'misc.getDnsId': MiscGetDnsIdInputSchema,
} as const;

export type NorthflankEndpointInputs = {
	[K in keyof typeof NorthflankEndpointInputSchemas]: z.infer<
		(typeof NorthflankEndpointInputSchemas)[K]
	>;
};

export const NorthflankEndpointOutputSchemas = {
	'projects.list': ProjectsListOutputSchema,
	'projects.get': ProjectsGetOutputSchema,
	'projects.create': ProjectsCreateOutputSchema,
	'projects.createOrUpdate': ProjectsCreateOrUpdateOutputSchema,
	'projects.update': ProjectsUpdateOutputSchema,
	'projects.delete': ProjectsDeleteOutputSchema,
	'services.list': ServicesListOutputSchema,
	'secrets.list': SecretsListOutputSchema,
	'secrets.get': SecretsGetOutputSchema,
	'secrets.create': SecretsCreateOutputSchema,
	'secrets.createOrUpdate': SecretsCreateOrUpdateOutputSchema,
	'secrets.patch': SecretsPatchOutputSchema,
	'secrets.update': SecretsUpdateOutputSchema,
	'secrets.getDetails': SecretsGetDetailsOutputSchema,
	'pipelines.list': PipelinesListOutputSchema,
	'plans.list': PlansListOutputSchema,
	'regions.list': RegionsListOutputSchema,
	'addonTypes.list': AddonTypesListOutputSchema,
	'cloudProviders.listNodeTypes': CloudNodeTypesListOutputSchema,
	'cloudProviders.listRegions': CloudRegionsListOutputSchema,
	'misc.getDnsId': MiscGetDnsIdOutputSchema,
} as const;

export type NorthflankEndpointOutputs = {
	[K in keyof typeof NorthflankEndpointOutputSchemas]: z.infer<
		(typeof NorthflankEndpointOutputSchemas)[K]
	>;
};
