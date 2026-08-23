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

/**
 * One analytics point pushed to CrowTerminal for a creator.
 *
 * The ingest endpoints return no per-point id, so one is derived from the
 * fields that identify the point. Deriving it here rather than at the call site
 * means a raw provider record validates as-is and the same point always lands
 * on the same row.
 */
export const CrowterminalDataPoint = z.preprocess(
	(value) => {
		if (typeof value !== 'object' || value === null) return value;
		const row = value as Record<string, unknown>;
		if (typeof row.id === 'string' && row.id.length > 0) return row;
		const parts = [row.clientId, row.platform, row.dataType, row.videoId ?? ''];
		if (parts.slice(0, 3).some((p) => typeof p !== 'string')) return row;
		// Each part is escaped before joining: a raw join lets ('a:b', 'TIKTOK')
		// and ('a', 'b:TIKTOK') produce the same id.
		return {
			...row,
			id: parts.map((p) => encodeURIComponent(String(p))).join(':'),
		};
	},
	z.object({
		/** clientId:platform:dataType:videoId when the provider supplies none. */
		id: z.string(),
		clientId: z.string(),
		platform: z.enum(['TIKTOK', 'INSTAGRAM', 'YOUTUBE']),
		dataType: z.string(),
		/** Absent for channel-level rather than video-level data. */
		videoId: z.string().nullable().optional(),
		/** 0-1 as accepted by the ingest endpoint. */
		confidence: z.number().nullable().optional(),
		ingestedAt: z.coerce.date().nullable().optional(),
	}),
);
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

/**
 * A service incident from the status endpoints. Incidents carry no id, and the
 * status endpoints name the start time `timestamp`, so both are accepted and
 * the id is derived from whichever is present.
 */
export const CrowterminalIncident = z.preprocess(
	(value) => {
		if (typeof value !== 'object' || value === null) return value;
		const row = value as Record<string, unknown>;
		// Normalise timestamp -> startedAt first: zod strips the unrecognised
		// `timestamp`, so doing this only when the id is missing would drop the
		// start time from any incident that already carries an id.
		const startedAt = row.startedAt ?? row.timestamp;
		const normalised =
			typeof startedAt === 'string' ? { ...row, startedAt } : row;
		if (typeof row.id === 'string' && row.id.length > 0) return normalised;
		if (typeof startedAt !== 'string') return normalised;
		return { ...normalised, id: startedAt };
	},
	z.object({
		/** The incident start time, which is what identifies it. */
		id: z.string(),
		status: z.string().nullable().optional(),
		duration: z.string().nullable().optional(),
		components: z.array(z.string()).nullable().optional(),
		startedAt: z.coerce.date().nullable().optional(),
	}),
);
export type CrowterminalIncident = z.infer<typeof CrowterminalIncident>;
