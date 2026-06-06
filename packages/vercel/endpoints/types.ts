import { z } from 'zod';

export const PaginationSchema = z
	.object({
		count: z.number(),
		next: z.number().nullable(),
		prev: z.number().nullable(),
	})
	.passthrough();

export const ProjectLinkSchema = z
	.object({
		type: z.string(),
		repo: z.string(),
		repoId: z.number().optional(),
		org: z.string().optional().nullable(),
		gitCredentialId: z.string().optional().nullable(),
		productionBranch: z.string().optional().nullable(),
		createdAt: z.number().optional().nullable(),
		updatedAt: z.number().optional().nullable(),
		deployHooks: z.array(z.unknown()).optional().nullable(),
	})
	.passthrough();

export const ProjectSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		accountId: z.string(),
		createdAt: z.number(),
		updatedAt: z.number(),
		framework: z.string().nullable(),
		link: ProjectLinkSchema.optional().nullable(),
		// @ts-expect-error - justification: Vercel API response for latestDeployments is highly variable
		latestDeployments: z.array(z.any()).optional().nullable(),
		// @ts-expect-error - justification: Vercel API response for targets is highly variable
		targets: z.record(z.string(), z.any()).optional().nullable(),
	})
	.passthrough();

export const DeploymentCreatorSchema = z
	.object({
		uid: z.string(),
		email: z.string(),
		username: z.string(),
	})
	.passthrough();

export const DeploymentSchema = z
	.object({
		uid: z.string(),
		name: z.string(),
		url: z.string(),
		created: z.number(),
		readyState: z.string(),
		type: z.union([z.enum(['LAMBDAS', 'PREBUILT', 'STATIC']), z.string()]),
		creator: DeploymentCreatorSchema.optional().nullable(),
		meta: z.record(z.string(), z.string()).optional().nullable(),
		target: z.union([z.enum(['production', 'staging']), z.string()]).nullable(),
		aliasError: z
			.object({
				code: z.string(),
				message: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		aliasAssigned: z.number().nullable().optional(),
		inspectorUrl: z.string().optional().nullable(),
	})
	.passthrough();

export const DomainSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		createdAt: z.number(),
		boughtAt: z.number().nullable(),
		expiresAt: z.number().nullable(),
		transferredAt: z.number().nullable(),
		verified: z.boolean(),
		nameservers: z.array(z.string()),
		intendedNameservers: z.array(z.string()),
	})
	.passthrough();

export const ProjectDomainSchema = z
	.object({
		name: z.string(),
		apexName: z.string(),
		projectId: z.string(),
		redirect: z.string().nullable(),
		redirectStatusCode: z.number().nullable(),
		gitBranch: z.string().nullable(),
		updatedAt: z.number(),
		createdAt: z.number(),
		verified: z.boolean(),
	})
	.passthrough();

export const EnvVariableSchema = z
	.object({
		id: z.string(),
		key: z.string(),
		value: z.string(),
		type: z.enum(['plain', 'secret', 'encrypted', 'sensitive']),
		target: z.array(z.enum(['production', 'preview', 'development'])),
		gitBranch: z.string().nullable(),
		configurationId: z.string().nullable().optional(),
		createdAt: z.number(),
		updatedAt: z.number(),
		createdBy: z.string().nullable().optional(),
		updatedBy: z.string().nullable().optional(),
	})
	.passthrough();

export const AliasSchema = z
	.object({
		uid: z.string(),
		alias: z.string(),
		created: z.string(),
		createdAt: z.number(),
		deploymentId: z.string().nullable(),
		projectId: z.string().nullable(),
		redirect: z.string().nullable(),
	})
	.passthrough();

export const AssignAliasResponseSchema = z
	.object({
		uid: z.string(),
		alias: z.string(),
		created: z.string(),
		oldDeploymentId: z.string().nullable(),
	})
	.passthrough();

export const WebhookEventSchema = z.enum([
	'deployment.created',
	'deployment.succeeded',
	'deployment.ready',
	'deployment.error',
	'deployment.canceled',
	'deployment.promoted',
	'project.created',
	'project.removed',
	'domain.created',
	'integration-configuration.scope-change-confirmed',
	'integration-configuration.removed',
	'integration-configuration.permission-upgraded',
]); // Ensure this is explicitly closed!

export const WebhookSchema = z
	.object({
		id: z.string(),
		url: z.string(),
		events: z.array(WebhookEventSchema.or(z.string())),
		ownerId: z.string(),
		projectIds: z.array(z.string()).optional(),
		createdAt: z.number(),
		updatedAt: z.number(),
	})
	.passthrough();

export const TeamMembershipSchema = z
	.object({
		uid: z.string(),
		role: z
			.enum(['OWNER', 'MEMBER', 'DEVELOPER', 'BILLING', 'VIEWER'])
			.or(z.string()),
		createdAt: z.number(),
	})
	.passthrough();

export const TeamSchema = z
	.object({
		id: z.string(),
		slug: z.string(),
		name: z.string(),
		createdAt: z.number(),
		updatedAt: z.number().optional().nullable(),
		avatar: z.string().nullable(),
		membership: TeamMembershipSchema,
	})
	.passthrough();

export const BaseVercelInput = z
	.object({
		teamId: z.string().optional(),
	})
	.passthrough();

export const VercelEndpointInputSchemas = {
	projectsGetProjects: z
		.object({
			limit: z.number().optional(),
			until: z.number().optional(),
			since: z.number().optional(),
		})
		.merge(BaseVercelInput),
	projectsGetProject: z.object({ idOrName: z.string() }).merge(BaseVercelInput),
	deploymentsGetDeployments: z
		.object({
			projectId: z.string().optional(),
			limit: z.number().optional(),
			until: z.number().optional(),
		})
		.merge(BaseVercelInput),
	deploymentsGetDeployment: z
		.object({ idOrUrl: z.string() })
		.merge(BaseVercelInput),
	deploymentsCreateDeployment: z
		.object({
			name: z.string(),
			project: z.string().optional(),
			target: z.enum(['production', 'staging']).optional(),
			gitSource: z
				.object({
					type: z.enum(['github', 'gitlab', 'bitbucket']),
					ref: z.string().optional(),
					repoId: z.union([z.string(), z.number()]).optional(),
					sha: z.string().optional(),
				})
				.passthrough()
				.optional(),
			// @ts-expect-error - justification: Files structure varies based on deployment needs
			files: z.array(z.any()).optional(),
			meta: z.record(z.string(), z.string()).optional(),
			env: z.record(z.string(), z.string()).optional(),
		})
		.merge(BaseVercelInput),
	domainsGetDomains: z
		.object({
			limit: z.number().optional(),
			until: z.number().optional(),
			since: z.number().optional(),
		})
		.merge(BaseVercelInput),
	domainsGetProjectDomains: z
		.object({
			idOrName: z.string(),
			limit: z.number().optional(),
			until: z.number().optional(),
			since: z.number().optional(),
		})
		.merge(BaseVercelInput),
	envsGetEnvVariables: z
		.object({ idOrName: z.string() })
		.merge(BaseVercelInput),
	envsCreateEnvVariable: z
		.object({
			idOrName: z.string(),
			key: z.string(),
			value: z.string(),
			type: z.enum(['plain', 'secret', 'encrypted', 'sensitive']),
			target: z.array(z.enum(['production', 'preview', 'development'])),
			gitBranch: z.string().optional().nullable(),
			comment: z.string().optional(),
		})
		.merge(BaseVercelInput),
	aliasesGetAliases: z
		.object({
			limit: z.number().optional(),
			until: z.number().optional(),
			since: z.number().optional(),
		})
		.merge(BaseVercelInput),
	aliasesAssignAlias: z
		.object({
			deploymentId: z.string(),
			alias: z.string(),
			redirect: z.string().nullable().optional(),
		})
		.merge(BaseVercelInput),
	webhooksGetWebhooks: BaseVercelInput,
	webhooksCreateWebhook: z
		.object({
			url: z.string(),
			events: z.array(WebhookEventSchema.or(z.string())),
			projectIds: z.array(z.string()).optional(),
		})
		.merge(BaseVercelInput),
	teamsGetTeams: BaseVercelInput,
};

export const VercelEndpointOutputSchemas = {
	projectsGetProjects: z
		.object({ projects: z.array(ProjectSchema), pagination: PaginationSchema })
		.passthrough(),
	projectsGetProject: ProjectSchema,
	deploymentsGetDeployments: z
		.object({
			deployments: z.array(DeploymentSchema),
			pagination: PaginationSchema,
		})
		.passthrough(),
	deploymentsGetDeployment: DeploymentSchema,
	deploymentsCreateDeployment: DeploymentSchema,
	domainsGetDomains: z
		.object({ domains: z.array(DomainSchema), pagination: PaginationSchema })
		.passthrough(),
	domainsGetProjectDomains: z
		.object({
			domains: z.array(ProjectDomainSchema),
			pagination: PaginationSchema,
		})
		.passthrough(),
	envsGetEnvVariables: z
		.object({ envs: z.array(EnvVariableSchema).optional() })
		.passthrough(),
	envsCreateEnvVariable: EnvVariableSchema,
	aliasesGetAliases: z
		.object({ aliases: z.array(AliasSchema), pagination: PaginationSchema })
		.passthrough(),
	aliasesAssignAlias: AssignAliasResponseSchema,
	webhooksGetWebhooks: z.array(WebhookSchema),
	webhooksCreateWebhook: WebhookSchema,
	teamsGetTeams: z
		.object({ teams: z.array(TeamSchema), pagination: PaginationSchema })
		.passthrough(),
};

export type VercelEndpointInputs = {
	[K in keyof typeof VercelEndpointInputSchemas]: z.infer<
		(typeof VercelEndpointInputSchemas)[K]
	>;
};

export type VercelEndpointOutputs = {
	[K in keyof typeof VercelEndpointOutputSchemas]: z.infer<
		(typeof VercelEndpointOutputSchemas)[K]
	>;
};

export type Project = z.infer<typeof ProjectSchema>;
export type Deployment = z.infer<typeof DeploymentSchema>;
export type Domain = z.infer<typeof DomainSchema>;
export type ProjectDomain = z.infer<typeof ProjectDomainSchema>;
export type EnvVariable = z.infer<typeof EnvVariableSchema>;
export type Alias = z.infer<typeof AliasSchema>;
export type Webhook = z.infer<typeof WebhookSchema>;
export type Team = z.infer<typeof TeamSchema>;
