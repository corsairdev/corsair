import { z } from 'zod';

/**
 * Locally persisted Ayrshare entities.
 *
 * Auto-schedules are the recurring plans every later publish refers to by
 * `title`. History posts are the records agents query and delete. Neither
 * transactional analytics (per-post likes/impressions) nor the `/user`
 * profile are stored: analytics are a different endpoint, and this plugin
 * does not fetch `/user`.
 *
 * Field names match official JSON keys.
 * Docs: https://www.ayrshare.com/docs/llms.txt
 *
 * Each field is labeled from the official attribute table, or as live-observed
 * when Ayrshare returned it on this account (2026-08-13) but the docs example
 * omits it. Only the primary key is required: Ayrshare omits unused fields
 * rather than sending null.
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/**
 * UTC clock time used by auto-schedule.
 * Official: https://www.ayrshare.com/docs/apis/auto-schedule/set-schedule
 * Format: ISO-8601 UTC, e.g. `13:05Z`.
 */
export const AyrshareScheduleTime = z.string();
export type AyrshareScheduleTime = z.infer<typeof AyrshareScheduleTime>;

/**
 * Per-network result nested in a history row's `postIds`.
 * Official history example: https://www.ayrshare.com/docs/apis/history/get-history
 */
export const AyrshareSocialPostId = z
	.object({
		/** Social network this id belongs to (`twitter`, `facebook`, …). */
		platform: S,
		/** Social-network post id. */
		id: z.union([z.string(), z.number()]).nullable().optional(),
		/** Per-network send status (`success`, `error`, …). */
		status: S,
		/** Canonical URL of the published post. */
		postUrl: S,
		/** Official example: `true` when the Facebook post is a video. */
		isVideo: B,
	})
	.loose();
export type AyrshareSocialPostId = z.infer<typeof AyrshareSocialPostId>;

/**
 * `scheduleDate` on a history row.
 *
 * Official example still shows the Firestore-shaped object
 * `{ _seconds, _nanoseconds, utc }` and notes a future release will send a
 * plain ISO-8601 string instead. Live 2026-08-13 had no posts, so both forms
 * are accepted.
 * Docs: https://www.ayrshare.com/docs/apis/history/get-history
 */
export const AyrshareScheduleDate = z.union([
	z.string(),
	z
		.object({
			_seconds: N,
			_nanoseconds: N,
			utc: S,
		})
		.loose(),
]);
export type AyrshareScheduleDate = z.infer<typeof AyrshareScheduleDate>;

/**
 * Auto-post schedule. Keyed by case-sensitive `title`.
 *
 * Official list: https://www.ayrshare.com/docs/apis/auto-schedule/list-schedule
 * Official set: https://www.ayrshare.com/docs/apis/auto-schedule/set-schedule
 *
 * Live SET 2026-08-13 also echoed `schedule`, `daysOfWeek`, and `excludeDates`
 * on the set response (the docs example only shows `status`, `message`,
 * `title`). Live LIST of a never-used schedule omitted `lastScheduleDate`.
 */
export const AyrshareAutoSchedule = z
	.object({
		/** Case-sensitive schedule name; join key for publish `autoSchedule.title`. */
		title: z.string(),
		/** UTC times, treated as a set. Example: `["13:05Z", "22:14Z"]`. */
		schedule: z.array(AyrshareScheduleTime).optional(),
		/** Weekdays 0-6 (Sunday–Saturday). Official list example includes this. */
		daysOfWeek: z.array(z.number().int()).optional(),
		/**
		 * Next schedule date, or the previously scheduled date if nothing is
		 * pending. Official list field; omitted on a never-used schedule
		 * (live 2026-08-13).
		 */
		lastScheduleDate: S,
		/**
		 * UTC dates excluded from future auto-scheduling.
		 * Official set body; live LIST 2026-08-13 returned it on the schedule.
		 */
		excludeDates: z.array(z.string()).optional(),
	})
	.loose();
export type AyrshareAutoSchedule = z.infer<typeof AyrshareAutoSchedule>;

/**
 * Ayrshare top-level post, as returned by `/history`.
 *
 * Official: https://www.ayrshare.com/docs/apis/history/get-history
 * This account had no posts on 2026-08-13 (HTTP 400, code 221), so the key
 * list below is the official example — including approval-workflow fields
 * that only appear when that feature is used.
 */
export const AyrsharePost = z
	.object({
		/** Ayrshare top-level Post ID. */
		id: z.string(),
		/** Post body. */
		post: S,
		/** Networks the post was sent to. */
		platforms: z.array(z.string()).optional(),
		/** Per-network ids and statuses. */
		postIds: z.array(AyrshareSocialPostId).optional(),
		/**
		 * `success`, `error`, `processing`, `pending`, `paused`, `deleted`,
		 * `awaiting approval`. Deleted rows are only returned with
		 * `status=deleted`.
		 */
		status: S,
		/** When the post was created. */
		created: S,
		/** Publish / scheduled time. String or `{ _seconds, _nanoseconds, utc }`. */
		scheduleDate: AyrshareScheduleDate.optional(),
		/** Per-network errors. Official example is `[]`; live errors may be objects. */
		errors: z.array(z.unknown()).optional(),
		/** Media URLs attached to the post. */
		mediaUrls: z.array(z.string()).optional(),
		/** Shortened or original URLs in the post. Official example: `urls: []`. */
		urls: z.array(z.unknown()).optional(),
		/** `now` in the official example; `immediate` / `scheduled` as a filter. */
		type: S,
		/** Reference notes set via `/post`. */
		notes: S,
		/** User-profile title the post was sent from. */
		profileTitle: S,
		/** User Profile reference ID. */
		refId: S,
		/** Whether the post requires the approval workflow. */
		requiresApproval: B,
		/** Approval-workflow: approved. */
		approved: B,
		/** Approval-workflow: who approved. */
		approvedBy: S,
		/** Approval-workflow: when approved. */
		approvedDate: S,
		/** Approval-workflow: who rejected. */
		rejectedBy: S,
		/** Approval-workflow: when rejected. */
		rejectedDate: S,
		/** Whether links in the post were shortened. */
		shortenLinks: B,
	})
	.loose();
export type AyrsharePost = z.infer<typeof AyrsharePost>;
