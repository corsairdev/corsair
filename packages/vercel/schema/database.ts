import { z } from 'zod';

export const VercelDeploymentSchema = z
	.object({
		uid: z.string(),
		name: z.string().optional(),
		url: z.string().optional(),
		created: z.number().optional(),
		readyState: z.string().optional(),
		type: z.string().optional(),
		target: z.string().nullable().optional(),
		projectId: z.string().optional(),
		teamId: z.string().optional(),
	})
	.passthrough();

export const VercelProjectSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		accountId: z.string().optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		framework: z.string().nullable().optional(),
		teamId: z.string().optional(),
	})
	.passthrough();

export const VercelEnvVariableSchema = z
	.object({
		id: z.string(),
		key: z.string().optional(),
		value: z.string().optional(),
		type: z.string().optional(),
		target: z.array(z.string()).optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		projectId: z.string().optional(),
		teamId: z.string().optional(),
	})
	.passthrough();

export const VercelDomainSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		createdAt: z.number().optional(),
		boughtAt: z.number().nullable().optional(),
		expiresAt: z.number().nullable().optional(),
		transferredAt: z.number().nullable().optional(),
		verified: z.boolean().optional(),
		projectId: z.string().optional(),
		teamId: z.string().optional(),
	})
	.passthrough();

export const VercelAliasSchema = z
	.object({
		uid: z.string(),
		alias: z.string().optional(),
		created: z
			.union([z.string(), z.number()])
			.transform((val) => new Date(val).getTime())
			.optional(),
		createdAt: z
			.union([z.string(), z.number()])
			.transform((val) => new Date(val).getTime())
			.optional(),
		deploymentId: z.string().nullable().optional(),
		projectId: z.string().nullable().optional(),
		redirect: z.string().nullable().optional(),
		teamId: z.string().optional(),
	})
	.passthrough();

export const VercelTeamSchema = z
	.object({
		id: z.string(),
		slug: z.string().optional(),
		name: z.string().optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional().nullable(),
		avatar: z.string().nullable().optional(),
	})
	.passthrough();

export type VercelDeployment = z.infer<typeof VercelDeploymentSchema>;
export type VercelProject = z.infer<typeof VercelProjectSchema>;
export type VercelEnvVariable = z.infer<typeof VercelEnvVariableSchema>;
export type VercelDomain = z.infer<typeof VercelDomainSchema>;
export type VercelAlias = z.infer<typeof VercelAliasSchema>;
export type VercelTeam = z.infer<typeof VercelTeamSchema>;
