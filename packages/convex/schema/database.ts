import { z } from 'zod';

// Entity schemas mirror the response objects of the Convex Management API
// (OpenAPI spec: https://api.convex.dev/v1/openapi.json, docs:
// https://docs.convex.dev/management-api). Identifiers are int64 in the API.

const ConvexIdSchema = z.number().int().nonnegative();

/**
 * Project.
 * https://docs.convex.dev/management-api/get-project-by-id (`ProjectResponse`)
 */
export const ConvexProjectSchema = z
	.object({
		id: ConvexIdSchema,
		name: z.string(),
		slug: z.string(),
		teamId: ConvexIdSchema,
		teamSlug: z.string(),
		createTime: z.number().int(),
		prodDeploymentName: z.string().nullable().optional(),
		devDeploymentName: z.string().nullable().optional(),
	})
	.passthrough();

export type ConvexProject = z.infer<typeof ConvexProjectSchema>;

/**
 * Deployment, keyed by its readable `name`. The API returns either a cloud
 * deployment or a local one (`kind`); cloud-only and local-only fields are
 * optional here.
 * https://docs.convex.dev/management-api/platform-get-deployment
 * (`PlatformDeploymentResponse`)
 */
export const ConvexDeploymentSchema = z
	.object({
		id: ConvexIdSchema.optional(),
		name: z.string(),
		createTime: z.number().int(),
		lastDeployTime: z.number().int().nullable().optional(),
		deploymentType: z.enum(['dev', 'prod', 'preview', 'custom']),
		projectId: ConvexIdSchema,
		creator: ConvexIdSchema.nullable().optional(),
		previewIdentifier: z.string().nullable().optional(),
		region: z.string().optional(),
		isDefault: z.boolean().optional(),
		reference: z.string().optional(),
		dashboardEditConfirmation: z.boolean().nullable().optional(),
		deploymentUrl: z.string().optional(),
		expiresAt: z.number().int().nullable().optional(),
		class: z.string().optional(),
		sendLogsToClient: z.boolean().nullable().optional(),
		kind: z.enum(['cloud', 'local']),
		port: z.number().int().optional(),
		deviceName: z.string().optional(),
		isActive: z.boolean().optional(),
	})
	.passthrough();

export type ConvexDeployment = z.infer<typeof ConvexDeploymentSchema>;

/**
 * Deploy key metadata (never the secret). The API does not echo the owning
 * deployment, so `deploymentName` is added by the plugin when caching.
 * https://docs.convex.dev/management-api/list-deploy-keys
 * (`PlatformDeployKeyResponse`)
 */
export const ConvexDeployKeySchema = z
	.object({
		id: ConvexIdSchema,
		deploymentName: z.string(),
		name: z.string(),
		creationTime: z.number().int(),
		lastUsedTime: z.number().int().nullable().optional(),
		expiresAt: z.number().int().nullable().optional(),
		creator: ConvexIdSchema.nullable().optional(),
		managedBy: z
			.union([z.literal('vercel'), z.object({ oauthApp: z.string() })])
			.nullable()
			.optional(),
		allowedActions: z.array(z.string()),
	})
	.passthrough();

export type ConvexDeployKey = z.infer<typeof ConvexDeployKeySchema>;
