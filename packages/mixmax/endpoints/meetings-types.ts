import { z } from 'zod';
import { mixmaxBooleanFlag } from './flags';

// Meeting summaries search and meeting transcripts
// (developer.mixmax.com/reference, Meetings section). Field names, types, and
// limits mirror the official MeetingSummary, MeetingSummarySearchResponse,
// MeetingTranscriptEntry and MeetingTranscript schemas.

// One attendee on the calendar event. The official schema requires both
// fields but lets each be `null`.
export const MeetingSummaryParticipantSchema = z.object({
	email: z.string().nullable(),
	name: z.string().nullable(),
});

export type MeetingSummaryParticipant = z.infer<
	typeof MeetingSummaryParticipantSchema
>;

// One meeting summary as returned by GET /v1/meetings/summaries/search.
// Matches the official MeetingSummary schema: the listed fields are required
// (several nullable where the official spec says so) and the object stays
// passthrough so result items keep any extra fields the provider adds.
export const MeetingSummarySchema = z
	.object({
		// Contains slashes; URL encode it before passing it to
		// GET /v1/meetings/transcripts/{id}.
		id: z.string(),
		// The calendar event id, `null` for meetings without one.
		calendarId: z.string().nullable(),
		// The calendar event title, or the meeting's own title when there is
		// no calendar event.
		title: z.string().nullable(),
		// Display strings such as `2/13/2025, 2:30 PM UTC`, not always ISO
		// 8601; `null` without a calendar event.
		startTime: z.string().nullable(),
		endTime: z.string().nullable(),
		// Number of action items in the summary.
		actionItemsCount: z.number().int(),
		// The calendar event's attendees; empty without a calendar event.
		participants: z.array(MeetingSummaryParticipantSchema),
		// The participants named in the summary: names as strings on older
		// summaries, objects on newer ones.
		llmParticipants: z
			.array(
				z.union([
					z.string(),
					z
						.object({
							fullName: z.string(),
							displayName: z.string(),
							company: z.string().nullable().optional(),
							role: z.string().nullable().optional(),
							originalLabel: z.string().nullable().optional(),
						})
						.passthrough(),
				]),
			)
			.optional(),
		// The attendees as stored on the calendar event; left out without a
		// calendar event.
		calendarAttendees: z
			.array(
				z.object({
					email: z.string().optional(),
					name: z.string().optional(),
					// For example `accepted`, `declined`, `tentative` or
					// `needsAction`.
					responseStatus: z.string().optional(),
					isExternalToWorkspaceDomains: z.boolean().optional(),
					isWorkspaceMember: z.boolean().optional(),
					isExpandedFromGroup: z.boolean().optional(),
					originalGroupEmail: z.string().optional(),
				}),
			)
			.optional(),
		// Who owns the meeting; only on meetings shared with you, and `null`
		// when the owner cannot be looked up.
		owner: z
			.object({
				email: z.string(),
				name: z.string(),
			})
			.nullable()
			.optional(),
		// `owner` for your own meetings, `sharedWith` for meetings shared
		// with you.
		ownershipLevel: z.enum(['owner', 'sharedWith']),
		// Whether anyone outside your organization attended.
		isExternalMeeting: z.boolean(),
		// ISO 8601 date-time string.
		meetingCreatedAt: z.string(),
		// How many people or domains the meeting is shared with; always `0`
		// on meetings you do not own.
		sharedWithCount: z.number().int(),
		// Whether the summary is still being generated; left out on older
		// summaries.
		status: z.enum(['processing', 'completed']).optional(),
		// The CRMs the summary was synced to.
		syncedTo: z
			.array(
				z.object({
					crm: z.string(),
				}),
			)
			.optional(),
	})
	.passthrough();

export type MeetingSummary = z.infer<typeof MeetingSummarySchema>;

export const MeetingsSearchSummariesInputSchema = z.object({
	// `true` for external meetings only, `false` for internal only.
	isExternal: mixmaxBooleanFlag.optional(),
	// ISO 8601 date-time; only meetings on or after this date are returned.
	from: z.string().optional(),
	// ISO 8601 date-time; only meetings on or before this date are returned.
	to: z.string().optional(),
	// Attendee email address to filter by.
	attendee: z.string().optional(),
	// Case-insensitive partial match on the meeting title.
	title: z.string().optional(),
	// Number of results to skip for pagination. Defaults to 0.
	skip: z.coerce.number().int().min(0).optional(),
	// Maximum number of results. Defaults to 25, at most 100.
	limit: z.coerce.number().int().min(1).max(100).optional(),
	// `me` for your own meetings, `shared` for meetings shared with you,
	// `workspace` for the whole workspace (admins only). Omitted, both owned
	// and shared meetings are returned.
	owner: z.enum(['me', 'shared', 'workspace']).optional(),
});

export type MeetingsSearchSummariesInput = z.infer<
	typeof MeetingsSearchSummariesInputSchema
>;

// GET /v1/meetings/summaries/search answer, matching the official
// MeetingSummarySearchResponse envelope; the items stay extensible through
// MeetingSummarySchema.
export const MeetingsSearchSummariesOutputSchema = z.object({
	meetings: z.array(MeetingSummarySchema),
	// Results counted so far; while `hasMore` is `true` this is `skip` plus
	// `limit`, not the full number of matches.
	total: z.number().int(),
	// Whether another page exists; fetch it by raising `skip` by `limit`.
	hasMore: z.boolean(),
});

export type MeetingsSearchSummariesOutput = z.infer<
	typeof MeetingsSearchSummariesOutputSchema
>;

// One line of a meeting transcript, matching the official
// MeetingTranscriptEntry schema.
export const MeetingTranscriptEntrySchema = z.object({
	// The speaker's name, username or email, as the call reported it.
	name: z.string(),
	// What the speaker said.
	message: z.string(),
	// When it was said, as a Unix timestamp in milliseconds.
	timestamp: z.number().int(),
	// Milliseconds since the meeting started; only on some transcripts.
	relativeTimestamp: z.number().int().optional(),
});

export type MeetingTranscriptEntry = z.infer<
	typeof MeetingTranscriptEntrySchema
>;

// The full transcript of one meeting, matching the official
// MeetingTranscript schema. The listed fields are required (`deletedAt` is
// `null` while the transcript lives) and the document stays passthrough
// because the provider adds cleaned-up variants it does not pin down.
export const MeetingTranscriptSchema = z
	.object({
		// The meeting summary id, the same value you requested.
		id: z.string(),
		// The id of the user who owns the meeting.
		userId: z.string(),
		// The id of the call on the meeting platform, for example a Google
		// Meet code.
		meetingId: z.string(),
		// The transcript as it was recorded.
		transcript: z.array(MeetingTranscriptEntrySchema),
		// The transcript with speakers and wording cleaned up; only on some
		// transcripts.
		cleanedTranscript: z.array(MeetingTranscriptEntrySchema).optional(),
		// The names of the meeting's participants.
		participantNames: z.array(z.string()),
		// The names of the people who joined the call; only on some
		// transcripts.
		actualParticipantNames: z.array(z.string()).optional(),
		// When the transcript was deleted, or `null`.
		deletedAt: z.string().nullable(),
	})
	.passthrough();

export type MeetingTranscript = z.infer<typeof MeetingTranscriptSchema>;

export const MeetingsGetTranscriptInputSchema = z.object({
	// The meeting summary id from /v1/meetings/summaries/search.
	id: z.string().min(1),
});

export type MeetingsGetTranscriptInput = z.infer<
	typeof MeetingsGetTranscriptInputSchema
>;

export const MeetingsGetTranscriptOutputSchema = MeetingTranscriptSchema;

export type MeetingsGetTranscriptOutput = z.infer<
	typeof MeetingsGetTranscriptOutputSchema
>;
