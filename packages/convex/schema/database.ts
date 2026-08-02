import { z } from 'zod';

export const ConvexProjectSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		slug: z.string().optional(),
		teamId: z.string().optional(),
		teamSlug: z.string().nullable().optional(),
		createTime: z.number().optional(),
		prodDeploymentName: z.string().nullable().optional(),
		devDeploymentName: z.string().nullable().optional(),
	})
	.passthrough();

export type ConvexProject = z.infer<typeof ConvexProjectSchema>;

export const ConvexDeploymentSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		createTime: z.number().optional(),
		deploymentType: z.string().optional(),
		projectId: z.string().optional(),
		region: z.string().nullable().optional(),
		isDefault: z.boolean().optional(),
		reference: z.string().nullable().optional(),
		deploymentUrl: z.string().nullable().optional(),
	})
	.passthrough();

export type ConvexDeployment = z.infer<typeof ConvexDeploymentSchema>;

export const ConvexDeployKeySchema = z
	.object({
		id: z.string().optional(),
		deploymentName: z.string().optional(),
		name: z.string().optional(),
		creationTime: z.number().optional(),
		expiresAt: z.number().nullable().optional(),
		allowedActions: z.array(z.string()).optional(),
	})
	.passthrough();

export type ConvexDeployKey = z.infer<typeof ConvexDeployKeySchema>;
