import { z } from 'zod';

const IdSchema = z.number();
const DateSchema = z.string();
const JsonObjectSchema = z.record(z.string(), z.unknown());

const ProjectSchema = z
	.object({
		projectId: IdSchema,
		accountName: z.string().optional(),
		name: z.string(),
		slug: z.string(),
		repositoryType: z.string().optional(),
		repositoryName: z.string().optional(),
	})
	.passthrough();

const BuildSchema = z
	.object({
		buildId: IdSchema,
		buildNumber: z.number(),
		version: z.string().optional(),
		message: z.string().optional(),
		branch: z.string().optional(),
		status: z.string(),
	})
	.passthrough();

const ProjectBuildResponseSchema = z
	.object({ project: ProjectSchema, build: BuildSchema })
	.passthrough();

const UserSchema = z.object({}).passthrough();
const RoleSchema = z.object({}).passthrough();
const CollaboratorSchema = z.object({}).passthrough();
const EnvironmentSchema = z.object({}).passthrough();
const ArtifactSchema = z.object({}).passthrough();

export const EndpointInputSchemas = {
	buildsDelete: z.object({ buildId: IdSchema }),
	buildsDownloadLog: z.object({ jobId: IdSchema }),
	buildsGetArtifacts: z.object({ jobId: IdSchema }),
	buildsGetByVersion: z.object({
		accountName: z.string().min(1),
		projectSlug: z.string().min(1),
		buildVersion: z.string().min(1),
	}),
	environmentsList: z.object({}),
	projectsGetBranchBadge: z.object({
		token: z.string().min(1),
		branch: z.string().min(1),
	}),
	projectsGetBadge: z.object({ token: z.string().min(1) }),
	projectsList: z.object({}),
	projectsGetPublicBadge: z.object({
		repositoryProvider: z.enum(['github', 'bitbucket']),
		repositoryAccountName: z.string().min(1),
		repositorySlug: z.string().min(1),
	}),
	rolesGet: z.object({ roleId: IdSchema }),
	rolesList: z.object({}),
	usersInvitationsList: z.object({}),
	usersList: z.object({}),
	collaboratorsList: z.object({}),
} as const;

export const EndpointOutputSchemas = {
	buildsDelete: z.object({ success: z.literal(true) }),
	buildsDownloadLog: z.string(),
	buildsGetArtifacts: z.array(ArtifactSchema),
	buildsGetByVersion: ProjectBuildResponseSchema,
	environmentsList: z.array(EnvironmentSchema),
	projectsGetBranchBadge: z.string(),
	projectsGetBadge: z.string(),
	projectsList: z.array(ProjectSchema),
	projectsGetPublicBadge: z.string(),
	// GET /roles/{roleId} returns a Role object per swagger; allow both role shape and legacy {user,roles} wrapper for backwards compat
	rolesGet: z.union([
		RoleSchema.passthrough(),
		z.object({ user: UserSchema, roles: z.array(RoleSchema) }).passthrough(),
		z.object({ roleId: IdSchema }).passthrough(),
	]),
	rolesList: z.array(RoleSchema),
	usersInvitationsList: z.array(JsonObjectSchema),
	usersList: z.array(UserSchema),
	collaboratorsList: z.array(CollaboratorSchema),
} as const;

export type EndpointInputs = {
	[K in keyof typeof EndpointInputSchemas]: z.infer<
		(typeof EndpointInputSchemas)[K]
	>;
};

export type EndpointOutputs = {
	[K in keyof typeof EndpointOutputSchemas]: z.infer<
		(typeof EndpointOutputSchemas)[K]
	>;
};

export type AppVeyorProject = z.infer<typeof ProjectSchema>;
export type AppVeyorBuild = z.infer<typeof BuildSchema>;
export type AppVeyorArtifact = z.infer<typeof ArtifactSchema>;
export type AppVeyorEnvironment = z.infer<typeof EnvironmentSchema>;
