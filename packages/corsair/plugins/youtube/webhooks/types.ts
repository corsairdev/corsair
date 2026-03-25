import { z } from 'zod';

// ── Activity Event ────────────────────────────────────────────────────────────

export const YoutubeActivitySchema = z.object({
	id: z.string(),
	kind: z.string().optional(),
	etag: z.string().optional(),
	snippet: z.object({
		channelId: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		publishedAt: z.string().optional(),
		type: z.string().optional(),
		thumbnails: z.record(z.object({
			url: z.string().optional(),
			width: z.number().optional(),
			height: z.number().optional(),
		})).optional(),
	}).optional(),
	contentDetails: z.record(z.unknown()).optional(),
}).passthrough();

export const NewActivityEventSchema = z.object({
	activity: YoutubeActivitySchema,
	event_type: z.string().optional(),
});

export type NewActivityEvent = z.infer<typeof NewActivityEventSchema>;

// ── Playlist Item Event ───────────────────────────────────────────────────────

export const YoutubePlaylistItemSchema = z.object({
	id: z.string(),
	kind: z.string().optional(),
	etag: z.string().optional(),
	snippet: z.object({
		playlistId: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		publishedAt: z.string().optional(),
		position: z.number().optional(),
		channelId: z.string().optional(),
		channelTitle: z.string().optional(),
		videoOwnerChannelId: z.string().optional(),
		resourceId: z.object({
			kind: z.string().optional(),
			videoId: z.string().optional(),
		}).optional(),
		thumbnails: z.record(z.object({
			url: z.string().optional(),
			width: z.number().optional(),
			height: z.number().optional(),
		})).optional(),
	}).optional(),
	contentDetails: z.object({
		videoId: z.string().optional(),
		videoPublishedAt: z.string().optional(),
	}).optional(),
}).passthrough();

export const NewPlaylistItemEventSchema = z.object({
	item: YoutubePlaylistItemSchema,
	event_type: z.string().optional(),
});

export type NewPlaylistItemEvent = z.infer<typeof NewPlaylistItemEventSchema>;

// ── Playlist Event ────────────────────────────────────────────────────────────

export const YoutubePlaylistSnapshotSchema = z.object({
	id: z.string(),
	kind: z.string().optional(),
	etag: z.string().optional(),
	snippet: z.object({
		channelId: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		publishedAt: z.string().optional(),
		thumbnails: z.record(z.object({
			url: z.string().optional(),
			width: z.number().optional(),
			height: z.number().optional(),
		})).optional(),
		localized: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
	}).optional(),
	status: z.object({ privacyStatus: z.string().optional() }).optional(),
	contentDetails: z.object({ itemCount: z.number().optional() }).optional(),
}).passthrough();

export const NewPlaylistEventSchema = z.object({
	playlist: YoutubePlaylistSnapshotSchema,
	event_type: z.string().optional(),
});

export type NewPlaylistEvent = z.infer<typeof NewPlaylistEventSchema>;

// ── Subscription Event ────────────────────────────────────────────────────────

export const YoutubeSubscriptionSnapshotSchema = z.object({
	id: z.string(),
	kind: z.string().optional(),
	etag: z.string().optional(),
	snippet: z.object({
		publishedAt: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		channelId: z.string().optional(),
		thumbnails: z.record(z.object({
			url: z.string().optional(),
			width: z.number().optional(),
			height: z.number().optional(),
		})).optional(),
		resourceId: z.object({
			kind: z.string().optional(),
			channelId: z.string().optional(),
		}).optional(),
	}).optional(),
	contentDetails: z.object({
		totalItemCount: z.number().optional(),
		newItemCount: z.number().optional(),
		activityType: z.string().optional(),
	}).optional(),
}).passthrough();

export const NewSubscriptionEventSchema = z.object({
	subscription: YoutubeSubscriptionSnapshotSchema,
	event_type: z.string().optional(),
});

export type NewSubscriptionEvent = z.infer<typeof NewSubscriptionEventSchema>;

// ── Webhook Outputs Map ───────────────────────────────────────────────────────

export type YoutubeWebhookOutputs = {
	newActivity: NewActivityEvent;
	newPlaylistItem: NewPlaylistItemEvent;
	newPlaylist: NewPlaylistEvent;
	newSubscription: NewSubscriptionEvent;
};
