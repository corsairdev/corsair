import z from 'zod';

export const GrafanaHealthStatus = z.object({
	id: z.string(),
	version: z.string().optional(),
	commit: z.string().optional(),
	database: z.string().optional(),
	enterpriseCommit: z.string().optional(),
	licenseAvailable: z.boolean().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

export const GrafanaLog = z.object({
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
	createdAt: z.coerce.date().nullable().optional(),
});

export const GrafanaDashboardQuery = z.object({
	id: z.string(),
	accessToken: z.string(),
	panelId: z.number(),
	from: z.string().optional(),
	to: z.string().optional(),
	// results is z.unknown() because its shape depends entirely on the panel's data source
	results: z.unknown().optional(),
	queriedAt: z.coerce.date().nullable().optional(),
});

export type GrafanaHealthStatus = z.infer<typeof GrafanaHealthStatus>;
export type GrafanaLog = z.infer<typeof GrafanaLog>;
export type GrafanaDashboardQuery = z.infer<typeof GrafanaDashboardQuery>;
