import { z } from 'zod';
import { mixmaxBooleanFlag } from './flags';

// Live feed (developer.mixmax.com/reference, Live feed section). Field names
// and types mirror the official LiveFeedMessage, LiveFeedStats and
// LiveFeedEvent schemas and their page envelopes.

// The provider documents several of these fields as nullable (the sender's
// display name, the delegator, the last event's author and each recipient's
// name) and its own example returns them as `null`, so they are `nullish`
// rather than optional: a `null` must not fail the whole page.
export const LiveFeedMessageSchema = z
	.object({
		_id: z.string().optional(),
		userId: z.string().optional(),
		fromEmail: z.string().optional(),
		fromName: z.string().nullish(),
		delegatorEmail: z.string().nullish(),
		delegatorName: z.string().nullish(),
		subject: z.string().optional(),
		// The email service, for example `gmail`.
		service: z.string().optional(),
		serviceMessageId: z.string().optional(),
		serviceThreadId: z.string().optional(),
		// The most recent event, for example `sent`, `opened` or `bounced`.
		lastEventType: z.string().optional(),
		lastEventByEmail: z.string().nullish(),
		lastEventByName: z.string().nullish(),
		// When the message was sent, in Unix milliseconds (second precision).
		sent: z.number().optional(),
		// The provider encodes these flags and counters as integers: 1 yes,
		// 0 no, and raw counts for the num* fields.
		wasSentViaMixmax: z.number().optional(),
		includeInTeamLiveFeed: z.number().optional(),
		showContentTeamFeed: z.number().optional(),
		trackingMuted: z.number().optional(),
		wasDeliveredWithTrackedOpens: z.number().optional(),
		wasDeliveredWithTrackedLinks: z.number().optional(),
		wasDeliveredWithTrackedFiles: z.number().optional(),
		numOpens: z.number().optional(),
		numClicks: z.number().optional(),
		numDownloads: z.number().optional(),
		wasReplied: z.number().optional(),
		wasAccepted: z.number().optional(),
		wasDeclined: z.number().optional(),
		wasTentative: z.number().optional(),
		wasBounced: z.number().optional(),
		lastEventAt: z.number().optional(),
		// All recipients (to, cc and bcc).
		recipients: z
			.array(
				z.object({
					email: z.string().optional(),
					name: z.string().nullish(),
				}),
			)
			.optional(),
	})
	.passthrough();

export type LiveFeedMessage = z.infer<typeof LiveFeedMessageSchema>;

export const LiveFeedStatsSchema = z
	.object({
		sent: z.number().optional(),
		delivered: z.number().optional(),
		// Unique recipient addresses.
		recipients: z.number().optional(),
		opened: z.number().optional(),
		clicked: z.number().optional(),
		downloaded: z.number().optional(),
		replied: z.number().optional(),
		accepted: z.number().optional(),
		declined: z.number().optional(),
		tentative: z.number().optional(),
		bounced: z.number().optional(),
		// Rates as percentages for every documented key.
		percentages: z
			.object({
				opened: z.number().optional(),
				clicked: z.number().optional(),
				downloaded: z.number().optional(),
				replied: z.number().optional(),
				accepted: z.number().optional(),
				declined: z.number().optional(),
				tentative: z.number().optional(),
				bounced: z.number().optional(),
				unsubscribed: z.number().optional(),
				delivered: z.number().optional(),
				tasksCompleted: z.number().optional(),
			})
			.optional(),
	})
	.passthrough();

export type LiveFeedStats = z.infer<typeof LiveFeedStatsSchema>;

export const LiveFeedListInputSchema = z.object({
	// Search in the same format as the live feed search box; defaults to
	// `from:me`.
	query: z.string().optional(),
	// An IANA time zone name used to work out day boundaries for `sent:`.
	timezone: z.string().optional(),
	// Number of messages to return, 0-300. A larger value returns 400.
	limit: z.coerce.number().int().max(300).optional(),
	// Number of matching messages to skip. Ignored when paging tokens are set.
	offset: z.coerce.number().int().optional(),
	// The `next` token from a previous page.
	next: z.string().optional(),
	// The `previous` token from a previous page.
	previous: z.string().optional(),
	// Set to false to leave out `stats`, which makes the request faster.
	stats: mixmaxBooleanFlag.optional(),
	// Set to true to return only messages shared to the team live feed.
	showOnlySyncedToMixmax: mixmaxBooleanFlag.optional(),
	// Returns only these messages, if they also match the query. Passed
	// through as an array; the shared transport serializes arrays as repeated
	// query keys, matching the parameter's form/explode style.
	messageIds: z.array(z.string()).optional(),
});

export type LiveFeedListInput = z.infer<typeof LiveFeedListInputSchema>;

export const LiveFeedListOutputSchema = z.object({
	results: z.array(LiveFeedMessageSchema),
	hasNext: z.boolean().optional(),
	// Token for the next page. Present only when `hasNext` is true.
	next: z.string().optional(),
	hasPrevious: z.boolean().optional(),
	// Token for the previous page. Present only when `hasPrevious` is true.
	previous: z.string().optional(),
	// Totals for every message matching the query, not just this page.
	stats: LiveFeedStatsSchema.optional(),
});

export type LiveFeedListOutput = z.infer<typeof LiveFeedListOutputSchema>;

// Location, device and link fields are `null` on events that do not carry
// them (the provider's example event has all of them `null`), so they are
// `nullish` rather than optional.
export const LiveFeedEventSchema = z
	.object({
		// Missing on the added `sent` event.
		_id: z.string().optional(),
		// The event type, for example `opened`, `clicked`, `downloaded`,
		// `replied`, `bounced` or `sent`.
		type: z.string().optional(),
		recipientEmail: z.string().nullish(),
		recipientName: z.string().nullish(),
		subject: z.string().optional(),
		serviceThreadId: z.string().optional(),
		country: z.string().nullish(),
		region: z.string().nullish(),
		city: z.string().nullish(),
		os: z.string().nullish(),
		// The email client or browser, if known.
		program: z.string().nullish(),
		linkUrl: z.string().nullish(),
		linkText: z.string().nullish(),
		fileName: z.string().nullish(),
		// Same as `type`.
		activityType: z.string().optional(),
		// When the event happened, in Unix milliseconds.
		timestamp: z.number().optional(),
		// 1 if the event came from a mobile device, if known.
		isMobile: z.number().nullish(),
		// `country`, `region` and `city` grouped together.
		location: z
			.object({
				country: z.string().nullish(),
				region: z.string().nullish(),
				city: z.string().nullish(),
			})
			.optional(),
		// `os`, `program` and `isMobile` grouped together.
		device: z
			.object({
				os: z.string().nullish(),
				program: z.string().nullish(),
				isMobile: z.number().nullish(),
			})
			.optional(),
		// `linkUrl`, `linkText` and `fileName` grouped together.
		metadata: z
			.object({
				linkUrl: z.string().nullish(),
				linkText: z.string().nullish(),
				fileName: z.string().nullish(),
			})
			.optional(),
	})
	.passthrough();

export type LiveFeedEvent = z.infer<typeof LiveFeedEventSchema>;

export const LiveFeedEventsInputSchema = z
	.object({
		// The `_id` of a live feed message. Either this or `contactEmail` is
		// required by the provider.
		messageId: z.string().optional(),
		// Whether the message in `messageId` was sent through Mixmax.
		wasSentViaMixmax: mixmaxBooleanFlag.optional(),
		// A recipient email address; returns that contact's events across your
		// messages.
		contactEmail: z.string().optional(),
		// Include events on messages from people who share a group with you,
		// limited to messages shared to the team live feed.
		includeGroupMembers: mixmaxBooleanFlag.optional(),
		// Same as `includeGroupMembers`; used only when that is not set.
		includeTeammates: mixmaxBooleanFlag.optional(),
		// Number of events to return.
		limit: z.coerce.number().int().optional(),
		// The `next` token from a previous events page. Tokens from
		// GET /v1/livefeed do not work here.
		next: z.string().optional(),
	})
	.refine(
		// The reference: "Pass `messageId` or `contactEmail`"; a request with
		// neither answers 500, so it is refused here with a message that says why.
		(input) => Boolean(input.messageId) || Boolean(input.contactEmail),
		{ message: 'Provide `messageId` or `contactEmail`' },
	);

export type LiveFeedEventsInput = z.infer<typeof LiveFeedEventsInputSchema>;

export const LiveFeedEventsOutputSchema = z.object({
	results: z.array(LiveFeedEventSchema),
	// True when the page was full, so more events may exist.
	hasNext: z.boolean().optional(),
	// Token for the next page; `null` on the last page.
	next: z.string().nullish(),
});

export type LiveFeedEventsOutput = z.infer<typeof LiveFeedEventsOutputSchema>;
