import z from 'zod';

export const GrafanaHealthStatus = z
	.object({
		id: z.string(),
		version: z.string().optional(),
		commit: z.string().optional(),
		database: z.string().optional(),
		enterpriseCommit: z.string().optional(),
		licenseAvailable: z.boolean().optional(),
		checkedAt: z.coerce.date().nullable().optional(),
	})
	.passthrough();

export const GrafanaLog = z
	.object({
		id: z.string(),
		timeUnixNano: z.string().optional(),
		severityText: z.string().optional(),
		severityNumber: z.number().optional(),
		body: z.string().optional(),
		traceId: z.string().optional(),
		spanId: z.string().optional(),
		flags: z.number().optional(),
		// resource is z.record(z.string()) because attribute keys/values are arbitrary string pairs
		resource: z.record(z.string()).optional(),
		scope: z.string().optional(),
		scopeVersion: z.string().optional(),
		droppedAttributesCount: z.number().optional(),
		createdAt: z.coerce.date().nullable().optional(),
	})
	.passthrough();

export const GrafanaDashboardQuery = z
	.object({
		id: z.string(),
		accessToken: z.string(),
		panelId: z.number(),
		from: z.string().optional(),
		to: z.string().optional(),
		intervalMs: z.number().optional(),
		maxDataPoints: z.number().optional(),
		// results is z.unknown() because its shape depends entirely on the panel's data source
		results: z.unknown().optional(),
		queriedAt: z.coerce.date().nullable().optional(),
	})
	.passthrough();

export const GrafanaRingStatus = z
	.object({
		id: z.string(),
		content: z.string().optional(),
		contentType: z.string().optional(),
		statusCode: z.number().optional(),
		fetchedAt: z.coerce.date().nullable().optional(),
	})
	.passthrough();

export const GrafanaJwksKey = z
	.object({
		id: z.string(),
		use: z.string().optional(),
		algorithm: z.string().optional(),
		certificates: z.array(z.string()).optional(),
		certificatesUrl: z.string().optional(),
		// keyMaterial is z.unknown() because its shape varies by algorithm (RSA, EC, etc.)
		keyMaterial: z.unknown().optional(),
		fetchedAt: z.coerce.date().nullable().optional(),
	})
	.passthrough();

export const GrafanaSamlSession = z
	.object({
		id: z.string(),
		statusCode: z.number().optional(),
		location: z.string().optional(),
		message: z.string().optional(),
		successful: z.boolean().optional(),
		processedAt: z.coerce.date().nullable().optional(),
	})
	.passthrough();

export type GrafanaHealthStatus = z.infer<typeof GrafanaHealthStatus>;
export type GrafanaLog = z.infer<typeof GrafanaLog>;
export type GrafanaDashboardQuery = z.infer<typeof GrafanaDashboardQuery>;
export type GrafanaRingStatus = z.infer<typeof GrafanaRingStatus>;
export type GrafanaJwksKey = z.infer<typeof GrafanaJwksKey>;
export type GrafanaSamlSession = z.infer<typeof GrafanaSamlSession>;
