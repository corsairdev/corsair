import { z } from 'zod';
import type { ConvexDeployment, ConvexProject } from '../schema/database';
import {
	ConvexDeployKeySchema,
	ConvexDeploymentSchema,
	ConvexProjectSchema,
} from '../schema/database';

// ── Common validation ────────────────────────────────────────────────────────

/**
 * Valid Convex deployment name (subdomain) used to build the deployment-scoped
 * REST base URL (`https://<deployment>.convex.cloud/api`). Convex deployment
 * names are DNS labels — lowercase letters, digits, and hyphens only. Restricting
 * input to this shape prevents crafted values (e.g. `attacker.example:443/`)
 * from redirecting an authenticated request to another host.
 */
export const CONVEX_SUBDOMAIN_PATTERN =
	/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/;

const ConvexIdSchema = z.number().int().nonnegative();

const SafePathSegmentSchema = z.coerce
	.string()
	.min(1)
	.refine((value) => !/[/\\?#]/.test(value) && !value.includes('..'), {
		message: 'Invalid path segment',
	});

const DeploymentUrlSchema = z.string().url().optional();

const DeploymentScopedLocationSchema = {
	subdomain: z
		.string()
		.regex(CONVEX_SUBDOMAIN_PATTERN, 'Invalid Convex deployment name')
		.optional(),
	deploymentUrl: DeploymentUrlSchema,
	deployKey: z.string().min(1).optional(),
};

// ── Common resource schemas ──────────────────────────────────────────────────

export const ProjectSchema = ConvexProjectSchema;
export type Project = ConvexProject;

export const DeploymentSchema = ConvexDeploymentSchema;
export type Deployment = ConvexDeployment;

// The list endpoint adds `deploymentName`; the raw API object omits it.
export const DeployKeySchema = ConvexDeployKeySchema.omit({
	deploymentName: true,
}).passthrough();
export type DeployKey = z.infer<typeof DeployKeySchema>;

export const PaginationMetadataSchema = z
	.object({
		hasMore: z.boolean(),
		nextCursor: z.string().nullable().optional(),
	})
	.passthrough();

export const DeploymentClassMetadataSchema = z
	.object({
		type: z.string(),
		available: z.boolean(),
	})
	.passthrough();

export const DeploymentRegionMetadataSchema = z
	.object({
		name: z.string(),
		displayName: z.string(),
		available: z.boolean(),
	})
	.passthrough();

const DeploymentTypeSchema = z.enum(['dev', 'prod', 'preview', 'custom']);

const DeployKeyActionSchema = z.enum([
	'deployment:deploy',
	'deployment:env:view',
	'deployment:env:write',
	'deployment:pause',
	'deployment:unpause',
	'deployment:logs:view',
	'deployment:metrics:view',
	'deployment:integrations:view',
	'deployment:integrations:write',
	'deployment:data:view',
	'deployment:data:write',
	'deployment:backups:view',
	'deployment:backups:create',
	'deployment:backups:download',
	'deployment:backups:delete',
	'deployment:backups:import',
	'deployment:functions:actAsUser',
	'deployment:functions:runInternalQueries',
	'deployment:functions:runInternalMutations',
	'deployment:functions:runInternalActions',
	'deployment:functions:runTestQuery',
	'deployment:auditLog:view',
	'deployment:usageLimits:view',
	'deployment:usageLimits:write',
	'deployment:usage:view',
	'deployment:aiGateway:use',
]);

const RequestDestinationSchema = z.enum(['convexCloud', 'convexSite']);

// ── Input schemas ────────────────────────────────────────────────────────────

const ProjectsListInputSchema = z.object({
	team_id: SafePathSegmentSchema,
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(100).optional(),
	q: z.string().optional(),
});

const ProjectGetByIdInputSchema = z.object({
	project_id: SafePathSegmentSchema,
});

const ProjectGetBySlugInputSchema = z.object({
	team_id_or_slug: SafePathSegmentSchema,
	project_slug: SafePathSegmentSchema,
});

const ProjectCreateInputSchema = z.object({
	team_id: SafePathSegmentSchema,
	projectName: z.string().min(1),
	deploymentType: DeploymentTypeSchema.nullable().optional(),
	deploymentClass: z.string().nullable().optional(),
	deploymentRegion: z.string().nullable().optional(),
});

const ProjectDeleteInputSchema = z.object({
	project_id: SafePathSegmentSchema,
});

const DeploymentsListInputSchema = z.object({
	project_id: SafePathSegmentSchema,
	includeLocal: z.boolean().optional(),
	isDefault: z.boolean().nullable().optional(),
	deploymentType: DeploymentTypeSchema.optional(),
});

const DeploymentGetInputSchema = z.object({
	deployment_name: SafePathSegmentSchema,
});

const DeploymentCreateInputSchema = z.object({
	project_id: SafePathSegmentSchema,
	type: DeploymentTypeSchema,
	class: z.string().nullable().optional(),
	region: z.string().nullable().optional(),
	reference: z.string().nullable().optional(),
	isDefault: z.boolean().nullable().optional(),
	expiresAt: z.number().int().nullable().optional(),
});

const DeploymentUpdateInputSchema = z.object({
	deployment_name: SafePathSegmentSchema,
	reference: z.string().nullable().optional(),
	dashboardEditConfirmation: z.boolean().nullable().optional(),
	expiresAt: z.number().int().nullable().optional(),
	sendLogsToClient: z.boolean().nullable().optional(),
	class: z.string().nullable().optional(),
	isDefault: z.boolean().nullable().optional(),
	deploymentType: DeploymentTypeSchema.nullable().optional(),
});

const DeploymentDeleteInputSchema = z.object({
	deployment_name: SafePathSegmentSchema,
});

const DeployKeyCreateInputSchema = z.object({
	deployment_name: SafePathSegmentSchema,
	name: z.string().min(1),
	allowedActions: z.array(DeployKeyActionSchema).optional(),
	expiresAt: z.number().int().nullable().optional(),
});

const DeployKeysListInputSchema = z.object({
	deployment_name: SafePathSegmentSchema,
});

const CustomDomainDeleteInputSchema = z.object({
	deployment_name: SafePathSegmentSchema,
	requestDestination: RequestDestinationSchema,
	domain: z.string().min(1),
});

const TokenDetailsInputSchema = z.object({});

const DeploymentClassesListInputSchema = z.object({
	team_id: SafePathSegmentSchema,
});

const DeploymentRegionsListInputSchema = z.object({
	team_id: SafePathSegmentSchema,
});

const QueryBatchItemSchema = z.object({
	path: z.string().min(1),
	args: z.record(z.string(), z.json()).default({}),
	format: z.string().nullable().optional(),
});

const ExecuteQueryBatchInputSchema = z.object({
	...DeploymentScopedLocationSchema,
	queries: z.array(QueryBatchItemSchema).min(1),
});
const QueryTimestampInputSchema = z.object(DeploymentScopedLocationSchema);

const LogStreamsListInputSchema = z.object(DeploymentScopedLocationSchema);

// ── Output schemas ───────────────────────────────────────────────────────────

const ProjectsListResponseSchema = z
	.object({
		items: z.array(ProjectSchema),
		pagination: PaginationMetadataSchema,
	})
	.passthrough();

const ProjectGetResponseSchema = ProjectSchema;

const ProjectCreateResponseSchema = z
	.object({
		projectId: ConvexIdSchema,
		id: ConvexIdSchema,
		slug: z.string(),
		deploymentName: z.string().nullable().optional(),
		deploymentUrl: z.string().nullable().optional(),
	})
	.passthrough();

// Convex returns an empty 200 body for these operations.
const EmptyResponseSchema = z.object({ success: z.boolean() });

const ProjectDeleteResponseSchema = EmptyResponseSchema;

const DeploymentsListResponseSchema = z.array(DeploymentSchema);

const DeploymentGetResponseSchema = DeploymentSchema;

const DeploymentCreateResponseSchema = DeploymentSchema;

const DeploymentUpdateResponseSchema = EmptyResponseSchema;

const DeploymentDeleteResponseSchema = EmptyResponseSchema;

const DeployKeyCreateResponseSchema = z
	.object({
		deployKey: z.string(),
	})
	.passthrough();

const DeployKeysListResponseSchema = z.array(DeployKeySchema);

const CustomDomainDeleteResponseSchema = EmptyResponseSchema;

const TokenDetailsResponseSchema = z
	.object({
		id: ConvexIdSchema,
		teamId: ConvexIdSchema.optional(),
		projectId: ConvexIdSchema.optional(),
		name: z.string(),
		createTime: z.number(),
		type: z.enum(['teamToken', 'projectToken']),
	})
	.passthrough();

const DeploymentClassesListResponseSchema = z
	.object({
		items: z.array(DeploymentClassMetadataSchema),
	})
	.passthrough();

const DeploymentRegionsListResponseSchema = z
	.object({
		items: z.array(DeploymentRegionMetadataSchema),
	})
	.passthrough();

export const QueryBatchResultSchema = z.discriminatedUnion('status', [
	z.object({
		status: z.literal('success'),
		value: z.json(),
		logLines: z.array(z.string()).optional(),
	}),
	z.object({
		status: z.literal('error'),
		errorMessage: z.string(),
		errorData: z.json().optional(),
		logLines: z.array(z.string()).optional(),
	}),
]);

const ExecuteQueryBatchResponseSchema = z.object({
	results: z.array(QueryBatchResultSchema),
});

export const QueryTimestampResponseSchema = z.object({
	ts: z.string(),
});

const LogStreamStatusSchema = z.object({
	type: z.enum(['pending', 'restarting', 'failed', 'active', 'deleting']),
	reason: z.string().optional(),
});

export const LogStreamSchema = z
	.object({
		id: z.string(),
		logStreamType: z.enum([
			'datadog',
			'webhook',
			'axiom',
			'sentry',
			'postHogLogs',
			'postHogErrorTracking',
			's3Export',
		]),
		status: LogStreamStatusSchema,
		topics: z.array(z.string()).nullable().optional(),
	})
	.passthrough();

const LogStreamsListResponseSchema = z.array(LogStreamSchema);

// ── Endpoint maps ────────────────────────────────────────────────────────────

export type ConvexEndpointInputs = {
	projectsList: z.infer<typeof ProjectsListInputSchema>;
	projectGetById: z.infer<typeof ProjectGetByIdInputSchema>;
	projectGetBySlug: z.infer<typeof ProjectGetBySlugInputSchema>;
	projectCreate: z.infer<typeof ProjectCreateInputSchema>;
	projectDelete: z.infer<typeof ProjectDeleteInputSchema>;
	deploymentsList: z.infer<typeof DeploymentsListInputSchema>;
	deploymentGet: z.infer<typeof DeploymentGetInputSchema>;
	deploymentCreate: z.infer<typeof DeploymentCreateInputSchema>;
	deploymentUpdate: z.infer<typeof DeploymentUpdateInputSchema>;
	deploymentDelete: z.infer<typeof DeploymentDeleteInputSchema>;
	deployKeyCreate: z.infer<typeof DeployKeyCreateInputSchema>;
	deployKeysList: z.infer<typeof DeployKeysListInputSchema>;
	customDomainDelete: z.infer<typeof CustomDomainDeleteInputSchema>;
	tokenDetails: z.infer<typeof TokenDetailsInputSchema>;
	deploymentClassesList: z.infer<typeof DeploymentClassesListInputSchema>;
	deploymentRegionsList: z.infer<typeof DeploymentRegionsListInputSchema>;
	executeQueryBatch: z.infer<typeof ExecuteQueryBatchInputSchema>;
	queryTimestamp: z.infer<typeof QueryTimestampInputSchema>;
	logStreamsList: z.infer<typeof LogStreamsListInputSchema>;
};

export type ConvexEndpointOutputs = {
	projectsList: z.infer<typeof ProjectsListResponseSchema>;
	projectGetById: z.infer<typeof ProjectGetResponseSchema>;
	projectGetBySlug: z.infer<typeof ProjectGetResponseSchema>;
	projectCreate: z.infer<typeof ProjectCreateResponseSchema>;
	projectDelete: z.infer<typeof ProjectDeleteResponseSchema>;
	deploymentsList: z.infer<typeof DeploymentsListResponseSchema>;
	deploymentGet: z.infer<typeof DeploymentGetResponseSchema>;
	deploymentCreate: z.infer<typeof DeploymentCreateResponseSchema>;
	deploymentUpdate: z.infer<typeof DeploymentUpdateResponseSchema>;
	deploymentDelete: z.infer<typeof DeploymentDeleteResponseSchema>;
	deployKeyCreate: z.infer<typeof DeployKeyCreateResponseSchema>;
	deployKeysList: z.infer<typeof DeployKeysListResponseSchema>;
	customDomainDelete: z.infer<typeof CustomDomainDeleteResponseSchema>;
	tokenDetails: z.infer<typeof TokenDetailsResponseSchema>;
	deploymentClassesList: z.infer<typeof DeploymentClassesListResponseSchema>;
	deploymentRegionsList: z.infer<typeof DeploymentRegionsListResponseSchema>;
	executeQueryBatch: z.infer<typeof ExecuteQueryBatchResponseSchema>;
	queryTimestamp: z.infer<typeof QueryTimestampResponseSchema>;
	logStreamsList: z.infer<typeof LogStreamsListResponseSchema>;
};

export const ConvexEndpointInputSchemas = {
	projectsList: ProjectsListInputSchema,
	projectGetById: ProjectGetByIdInputSchema,
	projectGetBySlug: ProjectGetBySlugInputSchema,
	projectCreate: ProjectCreateInputSchema,
	projectDelete: ProjectDeleteInputSchema,
	deploymentsList: DeploymentsListInputSchema,
	deploymentGet: DeploymentGetInputSchema,
	deploymentCreate: DeploymentCreateInputSchema,
	deploymentUpdate: DeploymentUpdateInputSchema,
	deploymentDelete: DeploymentDeleteInputSchema,
	deployKeyCreate: DeployKeyCreateInputSchema,
	deployKeysList: DeployKeysListInputSchema,
	customDomainDelete: CustomDomainDeleteInputSchema,
	tokenDetails: TokenDetailsInputSchema,
	deploymentClassesList: DeploymentClassesListInputSchema,
	deploymentRegionsList: DeploymentRegionsListInputSchema,
	executeQueryBatch: ExecuteQueryBatchInputSchema,
	queryTimestamp: QueryTimestampInputSchema,
	logStreamsList: LogStreamsListInputSchema,
} as const;

export const ConvexEndpointOutputSchemas = {
	projectsList: ProjectsListResponseSchema,
	projectGetById: ProjectGetResponseSchema,
	projectGetBySlug: ProjectGetResponseSchema,
	projectCreate: ProjectCreateResponseSchema,
	projectDelete: ProjectDeleteResponseSchema,
	deploymentsList: DeploymentsListResponseSchema,
	deploymentGet: DeploymentGetResponseSchema,
	deploymentCreate: DeploymentCreateResponseSchema,
	deploymentUpdate: DeploymentUpdateResponseSchema,
	deploymentDelete: DeploymentDeleteResponseSchema,
	deployKeyCreate: DeployKeyCreateResponseSchema,
	deployKeysList: DeployKeysListResponseSchema,
	customDomainDelete: CustomDomainDeleteResponseSchema,
	tokenDetails: TokenDetailsResponseSchema,
	deploymentClassesList: DeploymentClassesListResponseSchema,
	deploymentRegionsList: DeploymentRegionsListResponseSchema,
	executeQueryBatch: ExecuteQueryBatchResponseSchema,
	queryTimestamp: QueryTimestampResponseSchema,
	logStreamsList: LogStreamsListResponseSchema,
} as const;

// Named response types for handlers

export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;
export type ProjectGetResponse = z.infer<typeof ProjectGetResponseSchema>;
export type ProjectCreateResponse = z.infer<typeof ProjectCreateResponseSchema>;
export type ProjectDeleteResponse = z.infer<typeof ProjectDeleteResponseSchema>;
export type DeploymentsListResponse = z.infer<
	typeof DeploymentsListResponseSchema
>;
export type DeploymentGetResponse = z.infer<typeof DeploymentGetResponseSchema>;
export type DeploymentCreateResponse = z.infer<
	typeof DeploymentCreateResponseSchema
>;
export type DeploymentUpdateResponse = z.infer<
	typeof DeploymentUpdateResponseSchema
>;
export type DeploymentDeleteResponse = z.infer<
	typeof DeploymentDeleteResponseSchema
>;
export type DeployKeyCreateResponse = z.infer<
	typeof DeployKeyCreateResponseSchema
>;
export type DeployKeysListResponse = z.infer<
	typeof DeployKeysListResponseSchema
>;
export type CustomDomainDeleteResponse = z.infer<
	typeof CustomDomainDeleteResponseSchema
>;
export type TokenDetailsResponse = z.infer<typeof TokenDetailsResponseSchema>;
export type DeploymentClassesListResponse = z.infer<
	typeof DeploymentClassesListResponseSchema
>;
export type DeploymentRegionsListResponse = z.infer<
	typeof DeploymentRegionsListResponseSchema
>;
export type ExecuteQueryBatchResponse = z.infer<
	typeof ExecuteQueryBatchResponseSchema
>;
export type QueryTimestampResponse = z.infer<
	typeof QueryTimestampResponseSchema
>;
export type LogStreamsListResponse = z.infer<
	typeof LogStreamsListResponseSchema
>;
