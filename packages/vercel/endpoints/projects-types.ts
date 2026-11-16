import { z } from 'zod';
import {
	optBool,
	optNum,
	optStr,
	PaginationSchema,
	paginationInput,
	teamIdInput,
} from './common';

const idOrName = z
	.string()
	.min(1)
	.describe('Project id (prj_…) or project name.');
const projectId = z.string().min(1).describe('Project id (prj_…) or name.');
const deploymentId = z.string().min(1).describe('Deployment id (dpl_…).');

const envTarget = z.enum(['production', 'preview', 'development']);

const projectSettings = {
	framework: z
		.string()
		.nullable()
		.optional()
		.describe(
			'Framework preset slug, e.g. nextjs, vite, astro. null for none.',
		),
	buildCommand: z.string().nullable().optional(),
	devCommand: z.string().nullable().optional(),
	installCommand: z.string().nullable().optional(),
	outputDirectory: z.string().nullable().optional(),
	rootDirectory: z.string().nullable().optional(),
	commandForIgnoringBuildStep: z.string().nullable().optional(),
	publicSource: z.boolean().nullable().optional(),
	serverlessFunctionRegion: z.string().nullable().optional(),
	previewDeploymentsDisabled: z.boolean().nullable().optional(),
	skipGitConnectDuringLink: z.boolean().optional(),
};

// Responses: the documented core fields, every one tolerant of nulls and
// absence (Vercel adds and drops fields), the rest passed through.
export const ProjectSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		accountId: optStr(),
		createdAt: optNum(),
		updatedAt: optNum(),
		framework: optStr(),
		nodeVersion: optStr(),
		buildCommand: optStr(),
		devCommand: optStr(),
		installCommand: optStr(),
		outputDirectory: optStr(),
		rootDirectory: optStr(),
		live: optBool(),
		// Nested Vercel objects passed through as is: their fields change often.
		link: z.record(z.string(), z.unknown()).nullable().optional(),
		latestDeployments: z.array(z.unknown()).nullable().optional(),
		targets: z.record(z.string(), z.unknown()).nullable().optional(),
		alias: z.array(z.unknown()).nullable().optional(),
		lastAliasRequest: z
			.object({
				type: optStr(),
				jobStatus: optStr(),
				toDeploymentId: optStr(),
				fromDeploymentId: optStr(),
				requestedAt: optNum(),
			})
			.passthrough()
			.nullable()
			.optional(),
	})
	.passthrough();

export const ProjectMemberSchema = z
	.object({
		uid: z.string(),
		username: optStr(),
		email: optStr(),
		name: optStr(),
		avatar: optStr(),
		role: optStr(),
		computedProjectRole: optStr(),
		teamRole: optStr(),
		createdAt: optNum(),
	})
	.passthrough();

export const VercelProjectsInputSchemas = {
	getProjects: z.object({
		teamId: teamIdInput,
		...paginationInput,
		from: z
			.string()
			.optional()
			.describe('Continuation token or timestamp: projects updated after it.'),
		search: z.string().optional().describe('Search projects by name.'),
		repo: z.string().optional().describe('Filter by connected Git repo.'),
		repoId: z.string().optional(),
		repoUrl: z.string().optional(),
		excludeRepos: z
			.string()
			.optional()
			.describe('Comma-separated repos to leave out.'),
		edgeConfigId: z
			.string()
			.optional()
			.describe('Only projects connected to this Edge Config.'),
	}),
	getProject: z.object({
		teamId: teamIdInput,
		idOrName,
		rollbackInfo: z
			.boolean()
			.optional()
			.describe(
				'true: include lastAliasRequest, the status of the last promote or rollback (jobStatus pending, in-progress, succeeded, failed).',
			),
	}),
	createProject: z.object({
		teamId: teamIdInput,
		name: z.string().min(1).max(100).describe('Project name.'),
		...projectSettings,
		gitRepository: z
			.object({
				type: z.enum(['github', 'gitlab', 'bitbucket']),
				repo: z.string().min(1).describe('owner/repo'),
			})
			.optional()
			.describe('Git repository to connect.'),
		environmentVariables: z
			.array(
				z.object({
					key: z.string().min(1),
					value: z.string(),
					target: z.union([envTarget, z.array(envTarget).min(1)]),
					type: z
						.enum(['system', 'secret', 'encrypted', 'plain', 'sensitive'])
						.optional(),
					gitBranch: z.string().optional(),
				}),
			)
			.optional()
			.describe('Environment variables to create with the project.'),
	}),
	updateProject: z.object({
		teamId: teamIdInput,
		idOrName,
		name: z.string().min(1).max(100).optional(),
		...projectSettings,
		nodeVersion: z
			.enum(['26.x', '24.x', '22.x', '20.x', '18.x'])
			.optional()
			.describe('Node.js version for builds and functions.'),
		autoExposeSystemEnvs: z.boolean().optional(),
		autoAssignCustomDomains: z.boolean().optional(),
		gitForkProtection: z.boolean().optional(),
		directoryListing: z.boolean().optional(),
		sourceFilesOutsideRootDirectory: z.boolean().optional(),
		enableAffectedProjectsDeployments: z.boolean().optional(),
		ssoProtection: z
			.object({
				deploymentType: z.enum([
					'all',
					'preview',
					'prod_deployment_urls_and_all_previews',
					'all_except_custom_domains',
				]),
			})
			.nullable()
			.optional()
			.describe('Vercel Authentication. null turns it off.'),
	}),
	deleteProject: z.object({
		teamId: teamIdInput,
		idOrName,
	}),
	pauseProject: z.object({
		teamId: teamIdInput,
		projectId,
	}),
	unpauseProject: z.object({
		teamId: teamIdInput,
		projectId,
	}),
	promoteDeployment: z.object({
		teamId: teamIdInput,
		projectId,
		deploymentId: deploymentId.describe(
			'Deployment to promote to production (no rebuild).',
		),
	}),
	rollbackDeployment: z.object({
		teamId: teamIdInput,
		projectId,
		deploymentId: deploymentId.describe('Earlier deployment to roll back to.'),
		description: z
			.string()
			.max(256)
			.optional()
			.describe('Reason for the rollback.'),
	}),
	getProjectMembers: z.object({
		teamId: teamIdInput,
		idOrName,
		...paginationInput,
		search: z
			.string()
			.optional()
			.describe('Search members by name, username or email.'),
	}),
} as const;

export const VercelProjectsOutputSchemas = {
	getProjects: z
		.object({
			projects: z.array(ProjectSchema),
			pagination: PaginationSchema.nullable().optional(),
		})
		.passthrough(),
	getProject: ProjectSchema,
	createProject: ProjectSchema,
	updateProject: ProjectSchema,
	deleteProject: z.object({ deleted: z.boolean(), idOrName: z.string() }),
	pauseProject: z.object({ projectId: z.string(), paused: z.boolean() }),
	unpauseProject: z.object({ projectId: z.string(), paused: z.boolean() }),
	promoteDeployment: z.object({
		projectId: z.string(),
		deploymentId: z.string(),
		requested: z.boolean(),
	}),
	rollbackDeployment: z.object({
		projectId: z.string(),
		deploymentId: z.string(),
		requested: z.boolean(),
	}),
	getProjectMembers: z
		.object({
			members: z.array(ProjectMemberSchema).optional(),
			pagination: PaginationSchema.nullable().optional(),
		})
		.passthrough(),
} as const;

export type VercelProjectsInputs = {
	[K in keyof typeof VercelProjectsInputSchemas]: z.input<
		(typeof VercelProjectsInputSchemas)[K]
	>;
};
export type VercelProjectsOutputs = {
	[K in keyof typeof VercelProjectsOutputSchemas]: z.infer<
		(typeof VercelProjectsOutputSchemas)[K]
	>;
};
