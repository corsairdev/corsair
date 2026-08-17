import { z } from 'zod';

/**
 * Entities stored locally. Monitors, dashboards, SLOs, and incidents are the
 * resources agents revisit across conversations (status checks, follow-ups),
 * so their identity and summary fields are cached; high-churn query results
 * (logs, spans, metrics, hosts) are always fetched live.
 */

export const DatadogMonitorEntity = z.object({
	id: z.string(),
	name: z.string().optional(),
	type: z.string().optional(),
	query: z.string().optional(),
	message: z.string().optional(),
	overallState: z.string().optional(),
	tags: z.array(z.string()).optional(),
	priority: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});
export type DatadogMonitorEntity = z.infer<typeof DatadogMonitorEntity>;

export const DatadogDashboardEntity = z.object({
	id: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	layoutType: z.string().optional(),
	url: z.string().optional(),
	authorHandle: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});
export type DatadogDashboardEntity = z.infer<typeof DatadogDashboardEntity>;

export const DatadogSloEntity = z.object({
	id: z.string(),
	name: z.string().optional(),
	type: z.string().optional(),
	description: z.string().optional(),
	tags: z.array(z.string()).optional(),
	createdAt: z.coerce.date().nullable().optional(),
});
export type DatadogSloEntity = z.infer<typeof DatadogSloEntity>;

export const DatadogIncidentEntity = z.object({
	id: z.string(),
	title: z.string().optional(),
	state: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});
export type DatadogIncidentEntity = z.infer<typeof DatadogIncidentEntity>;
