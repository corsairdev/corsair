import { z } from 'zod';

// ============================================================================
// Projects
// ============================================================================

export const ProjectsListInputSchema = z
	.object({
		page: z.number().int().positive().optional(),
		per_page: z.number().int().positive().max(100).optional(),
		cursor: z.string().optional(),
	})
	.optional();

export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

export const ProjectsListOutputSchema = z
	.object({
		data: z
			.object({
				projects: z.array(z.record(z.string(), z.unknown())),
				pagination: z.record(z.string(), z.unknown()).optional(),
			})
			.passthrough(),
	})
	.passthrough();

export type ProjectsListOutput = z.infer<typeof ProjectsListOutputSchema>;

export const ProjectsGetInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
});

export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;

export const ProjectsGetOutputSchema = z
	.object({
		data: z.record(z.string(), z.unknown()),
	})
	.passthrough();

export type ProjectsGetOutput = z.infer<typeof ProjectsGetOutputSchema>;

export const ProjectsCreateInputSchema = z.object({
	name: z.string().min(1, 'name is required'),
	description: z.string().optional(),
	region: z.string().min(1, 'region is required'),
	color: z.string().optional(),
});

export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;

export const ProjectsCreateOutputSchema = z
	.object({
		data: z.record(z.string(), z.unknown()),
	})
	.passthrough();

export type ProjectsCreateOutput = z.infer<typeof ProjectsCreateOutputSchema>;

export const ProjectsUpdateInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	name: z.string().optional(),
	description: z.string().optional(),
	color: z.string().optional(),
});

export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;

export const ProjectsUpdateOutputSchema = z
	.object({
		data: z.record(z.string(), z.unknown()),
	})
	.passthrough();

export type ProjectsUpdateOutput = z.infer<typeof ProjectsUpdateOutputSchema>;

// ============================================================================
// Services
// ============================================================================

export const ServicesListInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(100).optional(),
	cursor: z.string().optional(),
});

export type ServicesListInput = z.infer<typeof ServicesListInputSchema>;

export const ServicesListOutputSchema = z
	.object({
		data: z
			.object({
				services: z.array(z.record(z.string(), z.unknown())),
				pagination: z.record(z.string(), z.unknown()).optional(),
			})
			.passthrough(),
	})
	.passthrough();

export type ServicesListOutput = z.infer<typeof ServicesListOutputSchema>;

export const ServicesGetInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	serviceId: z.string().min(1, 'serviceId is required'),
});

export type ServicesGetInput = z.infer<typeof ServicesGetInputSchema>;

export const ServicesGetOutputSchema = z
	.object({
		data: z.record(z.string(), z.unknown()),
	})
	.passthrough();

export type ServicesGetOutput = z.infer<typeof ServicesGetOutputSchema>;

export const ServicesCreateCombinedInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	name: z.string().min(1, 'name is required'),
	description: z.string().optional(),
	billing: z.record(z.string(), z.unknown()).optional(),
	deployment: z.record(z.string(), z.unknown()).optional(),
	buildSource: z.record(z.string(), z.unknown()).optional(),
	vcsData: z.record(z.string(), z.unknown()).optional(),
	buildSettings: z.record(z.string(), z.unknown()).optional(),
	runtimeEnvironment: z.record(z.string(), z.unknown()).optional(),
});

export type ServicesCreateCombinedInput = z.infer<
	typeof ServicesCreateCombinedInputSchema
>;

export const ServicesCreateCombinedOutputSchema = z
	.object({
		data: z.record(z.string(), z.unknown()),
	})
	.passthrough();

export type ServicesCreateCombinedOutput = z.infer<
	typeof ServicesCreateCombinedOutputSchema
>;

export const ServicesUpdateCombinedInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	serviceId: z.string().min(1, 'serviceId is required'),
	name: z.string().optional(),
	description: z.string().optional(),
	billing: z.record(z.string(), z.unknown()).optional(),
	deployment: z.record(z.string(), z.unknown()).optional(),
	buildSource: z.record(z.string(), z.unknown()).optional(),
	vcsData: z.record(z.string(), z.unknown()).optional(),
	buildSettings: z.record(z.string(), z.unknown()).optional(),
	runtimeEnvironment: z.record(z.string(), z.unknown()).optional(),
});

export type ServicesUpdateCombinedInput = z.infer<
	typeof ServicesUpdateCombinedInputSchema
>;

export const ServicesUpdateCombinedOutputSchema = z
	.object({
		data: z.record(z.string(), z.unknown()),
	})
	.passthrough();

export type ServicesUpdateCombinedOutput = z.infer<
	typeof ServicesUpdateCombinedOutputSchema
>;

// ============================================================================
// Environments
// ============================================================================

export const EnvironmentsListPreviewsInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	previewBlueprintId: z.string().min(1, 'previewBlueprintId is required'),
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(100).optional(),
	cursor: z.string().optional(),
});

export type EnvironmentsListPreviewsInput = z.infer<
	typeof EnvironmentsListPreviewsInputSchema
>;

export const EnvironmentsListPreviewsOutputSchema = z
	.object({
		data: z
			.object({
				previewEnvironments: z.array(z.record(z.string(), z.unknown())),
				pagination: z.record(z.string(), z.unknown()).optional(),
			})
			.passthrough(),
	})
	.passthrough();

export type EnvironmentsListPreviewsOutput = z.infer<
	typeof EnvironmentsListPreviewsOutputSchema
>;

// ============================================================================
// Secrets
// ============================================================================

export const SecretsListInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(100).optional(),
	cursor: z.string().optional(),
});

export type SecretsListInput = z.infer<typeof SecretsListInputSchema>;

export const SecretsListOutputSchema = z
	.object({
		data: z
			.object({
				secrets: z.array(z.record(z.string(), z.unknown())),
				pagination: z.record(z.string(), z.unknown()).optional(),
			})
			.passthrough(),
	})
	.passthrough();

export type SecretsListOutput = z.infer<typeof SecretsListOutputSchema>;

export const SecretsGetInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	secretId: z.string().min(1, 'secretId is required'),
});

export type SecretsGetInput = z.infer<typeof SecretsGetInputSchema>;

export const SecretsGetOutputSchema = z
	.object({
		data: z.record(z.string(), z.unknown()),
	})
	.passthrough();

export type SecretsGetOutput = z.infer<typeof SecretsGetOutputSchema>;

export const SecretsCreateInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	name: z.string().min(1, 'name is required'),
	description: z.string().optional(),
	secretType: z.enum(['secret', 'variable']).optional(),
	priority: z.number().int().optional(),
	data: z.record(z.string(), z.string()).optional(),
	useAsEnvironmentVariable: z.boolean().optional(),
});

export type SecretsCreateInput = z.infer<typeof SecretsCreateInputSchema>;

export const SecretsCreateOutputSchema = z
	.object({
		data: z.record(z.string(), z.unknown()),
	})
	.passthrough();

export type SecretsCreateOutput = z.infer<typeof SecretsCreateOutputSchema>;

export const SecretsUpdateInputSchema = z.object({
	projectId: z.string().min(1, 'projectId is required'),
	secretId: z.string().min(1, 'secretId is required'),
	name: z.string().optional(),
	description: z.string().optional(),
	data: z.record(z.string(), z.string()).optional(),
	priority: z.number().int().optional(),
});

export type SecretsUpdateInput = z.infer<typeof SecretsUpdateInputSchema>;

export const SecretsUpdateOutputSchema = z
	.object({
		data: z.record(z.string(), z.unknown()),
	})
	.passthrough();

export type SecretsUpdateOutput = z.infer<typeof SecretsUpdateOutputSchema>;

// ============================================================================
// Plans
// ============================================================================

export const PlansListInputSchema = z
	.object({
		page: z.number().int().positive().optional(),
		per_page: z.number().int().positive().max(100).optional(),
		cursor: z.string().optional(),
	})
	.optional();

export type PlansListInput = z.infer<typeof PlansListInputSchema>;

export const PlansListOutputSchema = z
	.object({
		data: z
			.object({
				plans: z.array(z.record(z.string(), z.unknown())),
			})
			.passthrough(),
	})
	.passthrough();

export type PlansListOutput = z.infer<typeof PlansListOutputSchema>;

// ============================================================================
// Regions
// ============================================================================

export const RegionsListInputSchema = z.object({}).optional();

export type RegionsListInput = z.infer<typeof RegionsListInputSchema>;

export const RegionsListOutputSchema = z
	.object({
		data: z
			.object({
				regions: z.array(z.record(z.string(), z.unknown())),
			})
			.passthrough(),
	})
	.passthrough();

export type RegionsListOutput = z.infer<typeof RegionsListOutputSchema>;

// ============================================================================
// Schema Maps
// ============================================================================

export const NorthflankEndpointInputSchemas = {
	'projects.list': ProjectsListInputSchema,
	'projects.get': ProjectsGetInputSchema,
	'projects.create': ProjectsCreateInputSchema,
	'projects.update': ProjectsUpdateInputSchema,
	'services.list': ServicesListInputSchema,
	'services.get': ServicesGetInputSchema,
	'services.createCombined': ServicesCreateCombinedInputSchema,
	'services.updateCombined': ServicesUpdateCombinedInputSchema,
	'environments.listPreviews': EnvironmentsListPreviewsInputSchema,
	'secrets.list': SecretsListInputSchema,
	'secrets.get': SecretsGetInputSchema,
	'secrets.create': SecretsCreateInputSchema,
	'secrets.update': SecretsUpdateInputSchema,
	'plans.list': PlansListInputSchema,
	'regions.list': RegionsListInputSchema,
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
	'projects.update': ProjectsUpdateOutputSchema,
	'services.list': ServicesListOutputSchema,
	'services.get': ServicesGetOutputSchema,
	'services.createCombined': ServicesCreateCombinedOutputSchema,
	'services.updateCombined': ServicesUpdateCombinedOutputSchema,
	'environments.listPreviews': EnvironmentsListPreviewsOutputSchema,
	'secrets.list': SecretsListOutputSchema,
	'secrets.get': SecretsGetOutputSchema,
	'secrets.create': SecretsCreateOutputSchema,
	'secrets.update': SecretsUpdateOutputSchema,
	'plans.list': PlansListOutputSchema,
	'regions.list': RegionsListOutputSchema,
} as const;

export type NorthflankEndpointOutputs = {
	[K in keyof typeof NorthflankEndpointOutputSchemas]: z.infer<
		(typeof NorthflankEndpointOutputSchemas)[K]
	>;
};

export type NorthflankEndpointInput =
	NorthflankEndpointInputs[keyof NorthflankEndpointInputs] & {
		[key: string]: unknown;
	};
