import { z } from 'zod';

export const PrismaWorkspace = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();

export const PrismaProject = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		displayName: z.string().nullable().optional(),
		workspaceId: z.string().optional(),
		region: z.string().optional(),
		logicalId: z.string().optional(),
		createdAt: z.string().optional(),
	})
	.passthrough();

export const PrismaDatabase = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		projectId: z.string().optional(),
		region: z.string().optional(),
		isDefault: z.boolean().optional(),
		status: z.string().optional(),
		createdAt: z.string().optional(),
	})
	.passthrough();

export const PrismaConnection = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		databaseId: z.string().optional(),
		type: z.string().optional(),
		createdAt: z.string().optional(),
	})
	.passthrough();

export const PrismaBackup = z
	.object({
		id: z.string().optional(),
		databaseId: z.string().optional(),
		status: z.string().optional(),
		createdAt: z.string().optional(),
	})
	.passthrough();

export const PrismaRegion = z
	.object({
		id: z.string().optional(),
		region: z.string().optional(),
		displayName: z.string().optional(),
		available: z.boolean().optional(),
		product: z.string().optional(),
	})
	.passthrough();

export const PrismaIntegration = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		workspaceId: z.string().optional(),
		type: z.string().optional(),
	})
	.passthrough();

export type PrismaWorkspace = z.infer<typeof PrismaWorkspace>;
export type PrismaProject = z.infer<typeof PrismaProject>;
export type PrismaDatabase = z.infer<typeof PrismaDatabase>;
export type PrismaConnection = z.infer<typeof PrismaConnection>;
export type PrismaBackup = z.infer<typeof PrismaBackup>;
export type PrismaRegion = z.infer<typeof PrismaRegion>;
export type PrismaIntegration = z.infer<typeof PrismaIntegration>;
