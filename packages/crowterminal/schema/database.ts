import { z } from 'zod';

// Entities mirror the shapes CrowTerminal returns, using its own field names
// from https://crowterminal.com/llms.txt and from live API responses.
//
// CrowTerminal is itself the persistence layer: it stores versioned skill
// history so an agent does not have to. These entities exist so a host can
// cache what it has read and reconcile webhook updates against it, not to
// become a second source of truth.

/** A creator's learned profile at one version. */
export const CrowterminalSkill = z.object({
	/** CrowTerminal client id. */
	id: z.string(),
	clientName: z.string().nullable().optional(),
	/** Increments on every stored revision. */
	version: z.number().nullable().optional(),
	primaryNiche: z.string().nullable().optional(),
	subNiches: z.array(z.string()).nullable().optional(),
	contentStyle: z.string().nullable().optional(),
	signatureStyle: z.string().nullable().optional(),
	hookPatterns: z.array(z.string()).nullable().optional(),
	/** Percent, as returned. */
	avgEngagement: z.number().nullable().optional(),
	bestPostingTimes: z.array(z.unknown()).nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});
export type CrowterminalSkill = z.infer<typeof CrowterminalSkill>;

/** One analytics point pushed to CrowTerminal for a creator. */
export const CrowterminalDataPoint = z.object({
	/** clientId:platform:dataType:videoId, since the API returns no point id. */
	id: z.string(),
	clientId: z.string(),
	platform: z.enum(['TIKTOK', 'INSTAGRAM', 'YOUTUBE']),
	dataType: z.string(),
	/** Absent for channel-level rather than video-level data. */
	videoId: z.string().nullable().optional(),
	/** 0-1 as accepted by the ingest endpoint. */
	confidence: z.number().nullable().optional(),
	ingestedAt: z.coerce.date().nullable().optional(),
});
export type CrowterminalDataPoint = z.infer<typeof CrowterminalDataPoint>;

/** A registered webhook subscription. The signing secret is never stored. */
export const CrowterminalWebhook = z.object({
	id: z.string(),
	url: z.string().nullable().optional(),
	events: z.array(z.string()).nullable().optional(),
	isActive: z.boolean().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});
export type CrowterminalWebhook = z.infer<typeof CrowterminalWebhook>;

/** A service incident from the status endpoints. */
export const CrowterminalIncident = z.object({
	/** Incidents carry no id; the start timestamp identifies them. */
	id: z.string(),
	status: z.string().nullable().optional(),
	duration: z.string().nullable().optional(),
	components: z.array(z.string()).nullable().optional(),
	startedAt: z.coerce.date().nullable().optional(),
});
export type CrowterminalIncident = z.infer<typeof CrowterminalIncident>;
