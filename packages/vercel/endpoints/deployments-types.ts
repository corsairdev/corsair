import { z } from 'zod';
import {
	optBool,
	optNum,
	optStr,
	PaginationSchema,
	paginationInput,
	teamIdInput,
} from './common';

const deploymentStates = [
	'BLOCKED',
	'BUILDING',
	'CANCELED',
	'ERROR',
	'INITIALIZING',
	'QUEUED',
	'READY',
] as const;
const deploymentState = z.enum(deploymentStates);

const idOrUrl = z
	.string()
	.min(1)
	.describe(
		'Deployment id (dpl_…) or its hostname, e.g. my-app-abc123.vercel.app.',
	);
const deploymentId = z.string().min(1).describe('Deployment id (dpl_…).');

const commandSetting = z.string().max(256).nullable().optional();

// gitSource variants from the spec for the three common providers. `ref` is the
// branch or tag; `sha` pins a commit on it.
const gitRef = z.string().min(1).describe('Branch or tag to deploy.');
const gitSha = z
	.string()
	.min(1)
	.optional()
	.describe('Commit SHA to deploy. Defaults to the latest commit on ref.');
const gitSource = z
	.union([
		z.object({
			type: z.literal('github'),
			repoId: z
				.union([z.string().min(1), z.number().int()])
				.describe('Numeric GitHub repository id.'),
			ref: gitRef,
			sha: gitSha,
		}),
		z.object({
			type: z.literal('github'),
			org: z.string().min(1).describe('GitHub owner or organization.'),
			repo: z.string().min(1).describe('Repository name.'),
			ref: gitRef,
			sha: gitSha,
		}),
		z.object({
			type: z.literal('gitlab'),
			projectId: z
				.union([z.string().min(1), z.number().int()])
				.describe('GitLab project id.'),
			ref: gitRef,
			sha: gitSha,
		}),
		z.object({
			type: z.literal('bitbucket'),
			repoUuid: z.string().min(1).describe('Bitbucket repository UUID.'),
			workspaceUuid: z.string().min(1).optional(),
			ref: gitRef,
			sha: gitSha,
		}),
		z.object({
			type: z.literal('bitbucket'),
			owner: z.string().min(1).describe('Bitbucket workspace slug.'),
			slug: z.string().min(1).describe('Repository slug.'),
			ref: gitRef,
			sha: gitSha,
		}),
	])
	.describe(
		'Git source to build: github by repoId or org+repo, gitlab by projectId, bitbucket by repoUuid or owner+slug. Not with files.',
	);

const deploymentFile = z.union([
	z.object({
		file: z
			.string()
			.min(1)
			.describe('Path from the project root, e.g. api/index.js.'),
		data: z
			.string()
			.describe('File content: plain text, or base64 with encoding base64.'),
		encoding: z.enum(['utf-8', 'base64']).optional(),
	}),
	z.object({
		file: z.string().min(1).describe('Path from the project root.'),
		sha: z
			.string()
			.min(1)
			.describe('SHA1 of a file already uploaded through the file upload API.'),
		size: z.number().int().min(0).optional().describe('File size in bytes.'),
	}),
]);

// Responses: documented fields, every one tolerant of nulls and absence (live
// data drops "required" fields, e.g. routes comes back null), the rest passed
// through. Single deployments are keyed by `id`.
const aliasError = z
	.object({ code: optStr(), message: optStr() })
	.passthrough()
	.nullable()
	.optional();
const creator = z
	.object({ uid: optStr(), username: optStr(), email: optStr() })
	.passthrough()
	.nullable()
	.optional();
const looseRecord = () =>
	z.record(z.string(), z.unknown()).nullable().optional();
const looseArray = () => z.array(z.unknown()).nullable().optional();

export const DeploymentSchema = z
	.object({
		id: z.string(),
		name: optStr(),
		url: optStr(),
		projectId: optStr(),
		ownerId: optStr(),
		readyState: optStr(),
		readySubstate: optStr(),
		status: optStr(),
		target: optStr(),
		type: optStr(),
		source: optStr(),
		createdAt: optNum(),
		buildingAt: optNum(),
		ready: optNum(),
		canceledAt: optNum(),
		inspectorUrl: optStr(),
		errorCode: optStr(),
		errorMessage: optStr(),
		alias: z.array(z.string()).nullable().optional(),
		automaticAliases: z.array(z.string()).nullable().optional(),
		aliasAssigned: z.union([z.boolean(), z.number()]).nullable().optional(),
		aliasError,
		creator,
		meta: looseRecord(),
		gitSource: looseRecord(),
		projectSettings: looseRecord(),
		regions: looseArray(),
		public: optBool(),
	})
	.passthrough();

// List items are keyed by `uid`; `url` is null while a deployment is uploading.
export const DeploymentListItemSchema = z
	.object({
		uid: z.string(),
		name: optStr(),
		url: optStr(),
		projectId: optStr(),
		state: optStr(),
		readyState: optStr(),
		readySubstate: optStr(),
		target: optStr(),
		type: optStr(),
		source: optStr(),
		created: optNum(),
		createdAt: optNum(),
		buildingAt: optNum(),
		ready: optNum(),
		inspectorUrl: optStr(),
		errorCode: optStr(),
		errorMessage: optStr(),
		isRollbackCandidate: optBool(),
		aliasAssigned: z.union([z.boolean(), z.number()]).nullable().optional(),
		aliasError,
		creator,
		meta: looseRecord(),
	})
	.passthrough();

// Build log events come in three documented shapes (plain log line, payload
// wrapper, alias-assigned); `type` is the one field all of them carry.
export const DeploymentEventSchema = z
	.object({
		type: z.string(),
		created: optNum(),
		date: optNum(),
		id: optStr(),
		deploymentId: optStr(),
		serial: optStr(),
		text: optStr(),
		level: optStr(),
		info: looseRecord(),
		payload: looseRecord(),
	})
	.passthrough();

export const DeploymentFileSchema = z
	.object({
		name: z.string(),
		type: optStr(),
		mode: optNum(),
		uid: optStr(),
		contentType: optStr(),
		children: looseArray(),
	})
	.passthrough();

export const VercelDeploymentsInputSchemas = {
	getDeployments: z.object({
		teamId: teamIdInput,
		...paginationInput,
		projectId: z
			.string()
			.min(1)
			.optional()
			.describe('Only deployments of this project (id or name).'),
		projectIds: z
			.array(z.string().min(1))
			.min(1)
			.max(20)
			.optional()
			.describe('Only deployments of these project ids. Not with projectId.'),
		app: z
			.string()
			.min(1)
			.optional()
			.describe('Only deployments with this name.'),
		target: z
			.string()
			.min(1)
			.optional()
			.describe('Environment: production, preview, or a custom environment.'),
		state: z
			.union([deploymentState, z.array(deploymentState).min(1)])
			.optional()
			.describe('Only deployments in this state, or any of these states.'),
		branch: z
			.string()
			.min(1)
			.optional()
			.describe('Only deployments of this Git branch.'),
		sha: z
			.string()
			.min(1)
			.optional()
			.describe('Only deployments of this commit SHA.'),
		users: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Only deployments created by these user ids (comma-separated).',
			),
		rollbackCandidate: z
			.boolean()
			.optional()
			.describe('true: only deployments production can roll back to.'),
	}),
	getDeployment: z.object({
		teamId: teamIdInput,
		idOrUrl,
		withGitRepoInfo: z
			.boolean()
			.optional()
			.describe(
				'Include gitSource (commit SHA, branch, repo) in the response.',
			),
	}),
	createDeployment: z
		.object({
			teamId: teamIdInput,
			name: z
				.string()
				.min(1)
				.describe(
					'Project name used in the deployment URL. Required even when project is set.',
				),
			project: z
				.string()
				.min(1)
				.optional()
				.describe(
					'Project id or name to deploy into. Overrides name for the project.',
				),
			target: z
				.string()
				.min(1)
				.optional()
				.describe(
					'production, staging, or a custom environment. Omit for a preview deployment. production updates the live site.',
				),
			customEnvironmentSlugOrId: z
				.string()
				.min(1)
				.optional()
				.describe('Custom environment to deploy to, overriding target.'),
			deploymentId: z
				.string()
				.min(1)
				.optional()
				.describe(
					'Redeploy this existing deployment (dpl_…): settings and env are inherited unless overridden here.',
				),
			withLatestCommit: z
				.boolean()
				.optional()
				.describe(
					'With deploymentId: build the latest commit instead of the original one.',
				),
			gitSource: gitSource.optional(),
			files: z
				.array(deploymentFile)
				.min(1)
				.optional()
				.describe(
					'Files for a deployment without Git: inline small files (file + data), or reference uploaded ones (file + sha). Not with gitSource.',
				),
			projectSettings: z
				.object({
					framework: z
						.string()
						.nullable()
						.optional()
						.describe(
							'Framework preset slug, e.g. nextjs, vite, astro. null for none.',
						),
					buildCommand: commandSetting,
					devCommand: commandSetting,
					installCommand: commandSetting,
					outputDirectory: commandSetting,
					rootDirectory: commandSetting,
					commandForIgnoringBuildStep: commandSetting,
					nodeVersion: z
						.enum(['26.x', '24.x', '22.x', '20.x', '18.x'])
						.optional(),
					serverlessFunctionRegion: z
						.string()
						.max(4)
						.nullable()
						.optional()
						.describe('Function region id, e.g. iad1.'),
					sourceFilesOutsideRootDirectory: z.boolean().optional(),
					skipGitConnectDuringLink: z.boolean().optional(),
				})
				.optional()
				.describe(
					'Build settings for this deployment. Needed on the first deployment of a new project, then saved.',
				),
			meta: z
				.record(z.string(), z.string().max(65536))
				.optional()
				.describe('Key-value metadata to attach to the deployment.'),
			monorepoManager: z.string().nullable().optional(),
			forceNew: z
				.boolean()
				.optional()
				.describe(
					'true: always build, even when an identical deployment exists.',
				),
			skipAutoDetectionConfirmation: z
				.boolean()
				.optional()
				.describe(
					'true: proceed when the detected framework differs from the project setting instead of failing with 400.',
				),
		})
		.refine((input) => !(input.gitSource && input.files), {
			message: 'Pass gitSource or files, not both.',
			path: ['files'],
		}),
	cancelDeployment: z.object({
		teamId: teamIdInput,
		deploymentId: deploymentId.describe(
			'Deployment (dpl_…) that is still queued or building.',
		),
	}),
	deleteDeployment: z
		.object({
			teamId: teamIdInput,
			deploymentId: deploymentId.optional(),
			url: z
				.string()
				.min(1)
				.optional()
				.describe(
					'Deployment or alias hostname to delete by, instead of deploymentId.',
				),
		})
		.refine((input) => Boolean(input.deploymentId) !== Boolean(input.url), {
			message: 'Pass exactly one of deploymentId or url.',
			path: ['deploymentId'],
		}),
	getDeploymentEvents: z.object({
		teamId: teamIdInput,
		idOrUrl,
		direction: z
			.enum(['forward', 'backward'])
			.optional()
			.describe('forward: oldest first (default). backward: newest first.'),
		limit: z
			.union([z.literal(-1), z.number().int().min(1)])
			.optional()
			.describe('Maximum number of events; -1 returns all of them.'),
		since: z
			.number()
			.optional()
			.describe('Only events from this timestamp (ms).'),
		until: z
			.number()
			.optional()
			.describe('Only events up to this timestamp (ms).'),
		name: z
			.string()
			.min(1)
			.optional()
			.describe('Only events of this build id.'),
		statusCode: z
			.union([z.number().int(), z.string().min(1)])
			.optional()
			.describe(
				'Only request events with this HTTP status or range, e.g. 500 or 5xx.',
			),
		builds: z.boolean().optional().describe('Include build events.'),
		delimiter: z
			.boolean()
			.optional()
			.describe('Include delimiter events between steps.'),
	}),
	getDeploymentFiles: z.object({
		teamId: teamIdInput,
		deploymentId,
	}),
} as const;

export const VercelDeploymentsOutputSchemas = {
	getDeployments: z
		.object({
			deployments: z.array(DeploymentListItemSchema),
			pagination: PaginationSchema.nullable().optional(),
		})
		.passthrough(),
	getDeployment: DeploymentSchema,
	createDeployment: DeploymentSchema,
	cancelDeployment: DeploymentSchema,
	deleteDeployment: z
		.object({ uid: z.string(), state: optStr() })
		.passthrough(),
	getDeploymentEvents: z.array(DeploymentEventSchema),
	getDeploymentFiles: z.array(DeploymentFileSchema),
} as const;

export type VercelDeploymentsInputs = {
	[K in keyof typeof VercelDeploymentsInputSchemas]: z.input<
		(typeof VercelDeploymentsInputSchemas)[K]
	>;
};
export type VercelDeploymentsOutputs = {
	[K in keyof typeof VercelDeploymentsOutputSchemas]: z.infer<
		(typeof VercelDeploymentsOutputSchemas)[K]
	>;
};
