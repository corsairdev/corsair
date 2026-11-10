import { z } from 'zod';
import { mixmaxBooleanFlag, mixmaxSendTimeMs } from './flags';

// Sequences and sequence folders (developer.mixmax.com/reference, Sequences
// section). Field names, types, and limits mirror the official inline schemas
// for /v1/sequences, /v1/sequences/{id}/recipients and /v1/sequencefolders.

export const SequenceEmailRecipientSchema = z.object({
	email: z.string().min(1),
	name: z.string().optional(),
});

export type SequenceEmailRecipient = z.infer<
	typeof SequenceEmailRecipientSchema
>;

// GET /v1/sequences list item — the official inline schema. Every documented
// field is optional and the object stays passthrough: the provider omits
// fields that do not apply (`folder` only appears with `expand=folder`, and
// `stages` carries stage ids unless `expand=stages` sends stage objects).
export const SequenceSummarySchema = z
	.object({
		_id: z.string().optional(),
		userId: z.string().optional(),
		name: z.string().optional(),
		// ISO 8601 date-time string.
		createdAt: z.string().optional(),
		// Stage ids, or stage objects when `expand=stages`; the official spec
		// declares the stage items as untyped (any), so both id strings and
		// expanded stage objects are accepted.
		stages: z.array(z.unknown()).optional(),
		variables: z.array(z.string()).optional(),
		cc: z.array(SequenceEmailRecipientSchema).optional(),
		bcc: z.array(SequenceEmailRecipientSchema).optional(),
		sendStagesAsReplies: z.boolean().optional(),
		linkTrackingEnabled: z.boolean().optional(),
		fileTrackingEnabled: z.boolean().optional(),
		notificationsEnabled: z.boolean().optional(),
		timezone: z.string().optional(),
		pausedBy: z.string().optional(),
		syncToOrg: z.boolean().optional(),
		folder: z.object({}).passthrough().optional(),
	})
	.passthrough();

export type SequenceSummary = z.infer<typeof SequenceSummarySchema>;

export const SequencesListInputSchema = z.object({
	// Returns sequences whose name matches this text.
	name: z.string().optional(),
	// `personal`, `shared`, `all`, or a folder `_id`.
	folder: z.string().optional(),
	// `stages` to include each stage's content, `folder` to include the folder.
	expand: z.string().optional(),
	// Comma-separated fields to return.
	fields: z.string().optional(),
	// The maximum, and the default, is 100.
	limit: z.coerce.number().int().max(100).optional(),
	// The `next` cursor from the previous page.
	next: z.string().optional(),
	// The `previous` cursor from the next page.
	previous: z.string().optional(),
});

export type SequencesListInput = z.infer<typeof SequencesListInputSchema>;

export const SequencesListOutputSchema = z.object({
	results: z.array(SequenceSummarySchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type SequencesListOutput = z.infer<typeof SequencesListOutputSchema>;

export const SequencesSearchInputSchema = z.object({
	// Search string matched against recipients, for example a name or a full
	// email address.
	query: z.string().optional(),
	// One recipient email address matched exactly (case-sensitive).
	recipients: z.string().optional(),
	// Only return recipients of this sequence.
	sequenceId: z.string().optional(),
	// From 1 to 50; the default is 50.
	limit: z.coerce.number().int().max(50).optional(),
	offset: z.coerce.number().int().optional(),
	sortBy: z.string().optional(),
	sortDesc: mixmaxBooleanFlag.optional(),
});

export type SequencesSearchInput = z.infer<typeof SequencesSearchInputSchema>;

// One recipient in one sequence. The `was*`/`is*` flags are 1 or 0 and the
// `num*` fields are counts; recipient-level times are Unix seconds. Matches
// the official SequenceSearchRecipient schema; every field stays optional and
// the object passthrough because the provider adds `was*`/`num*` counters it
// does not pin down.
export const SequenceSearchRecipientSchema = z
	.object({
		_id: z.string().optional(),
		recipientId: z.string().optional(),
		userId: z.string().optional(),
		sequenceId: z.string().optional(),
		email: z.string().optional(),
		domain: z.string().optional(),
		// `null` when the recipient was added without a name.
		name: z.string().nullish(),
		state: z.string().optional(),
		// `null` until the recipient finishes the sequence.
		completedReason: z.string().nullish(),
		// When the recipient was added, in Unix seconds.
		createdAt: z.number().optional(),
		// The four times below are `null` until that step happens.
		completedAt: z.number().nullish(),
		lastStageProcessedAt: z.number().nullish(),
		lastStageSentAt: z.number().nullish(),
		lastStageSentOrdinal: z.number().optional(),
		nextStageScheduledAt: z.number().nullish(),
		isActive: z.number().optional(),
		isPaused: z.number().optional(),
		isCompleted: z.number().optional(),
		wasSent: z.number().optional(),
		wasOpened: z.number().optional(),
		wasReplied: z.number().optional(),
		wasBounced: z.number().optional(),
		numOpens: z.number().optional(),
		numClicks: z.number().optional(),
		numDownloads: z.number().optional(),
		numDelivered: z.number().optional(),
		// Per-stage activity; the official SequenceSearchStage shape is not
		// pinned for this plugin, so stages stay extensible objects.
		stages: z.array(z.object({}).passthrough()).optional(),
		to: z
			.object({
				email: z.string().optional(),
				name: z.string().nullish(),
			})
			.optional(),
		lastStageSent: z
			.object({
				ordinal: z.number().optional(),
				processedAt: z.number().optional(),
			})
			.optional(),
		sequence: z
			.object({
				_id: z.string().optional(),
				name: z.string().optional(),
			})
			.optional(),
		user: z
			.object({
				email: z.string().optional(),
				name: z.string().optional(),
			})
			.optional(),
	})
	.passthrough();

export type SequenceSearchRecipient = z.infer<
	typeof SequenceSearchRecipientSchema
>;

// GET /v1/sequences/search answer. The official spec leaves the `sequences`
// result items opaque (bare `object`, documented as always empty) while the
// matches live under `recipients`, so only the envelope is validated.
export const SequencesSearchOutputSchema = z.object({
	// The official schema declares no required properties on this response;
	// both groups are documented but not guaranteed required.
	sequences: z
		.object({
			total: z.number().optional(),
			results: z.array(z.object({}).passthrough()).optional(),
		})
		.optional(),
	recipients: z
		.object({
			total: z.number().optional(),
			results: z.array(SequenceSearchRecipientSchema).optional(),
		})
		.optional(),
});

export type SequencesSearchOutput = z.infer<typeof SequencesSearchOutputSchema>;

// POST /v1/sequences/cancel body. Without `emails` (or with an empty array)
// every active recipient the caller added is cancelled; `orgId` requires a
// non-empty `emails` array.
export const SequencesCancelAllInputSchema = z.object({
	emails: z.array(z.string()).optional(),
	// Stored as the recipients' completion reason; defaults to
	// `manuallyCancelled`.
	reason: z.string().optional(),
	// The id of the workspace whose admins cancel on behalf of every member.
	orgId: z.string().optional(),
});

export type SequencesCancelAllInput = z.infer<
	typeof SequencesCancelAllInputSchema
>;

export const SequencesCancelAllOutputSchema = z.object({
	recipients: z.array(z.string()).optional(),
});

export type SequencesCancelAllOutput = z.infer<
	typeof SequencesCancelAllOutputSchema
>;

export const SequencesCancelInputSchema = z.object({
	id: z.string().min(1),
	// The email addresses of the recipients to cancel. Leave out to cancel
	// every active recipient the caller added; an empty array cancels nobody.
	emails: z.array(z.string()).optional(),
});

export type SequencesCancelInput = z.infer<typeof SequencesCancelInputSchema>;

export const SequencesCancelOutputSchema = z.object({
	recipients: z.array(z.string()),
});

export type SequencesCancelOutput = z.infer<typeof SequencesCancelOutputSchema>;

// One recipient of a sequence as returned by GET /v1/sequences/{id}/recipients.
// Matches the official SequenceRecipient schema; documented fields stay
// optional and the object passthrough because the provider adds per-stage
// detail it does not pin down.
export const SequenceRecipientSchema = z
	.object({
		_id: z.string().optional(),
		sequenceId: z.string().optional(),
		userId: z.string().optional(),
		sequence: z
			.object({
				_id: z.string().optional(),
			})
			.optional(),
		to: z
			.object({
				email: z.string().optional(),
				// `null` when the recipient was added without a name.
				name: z.string().nullish(),
			})
			.optional(),
		state: z.string().optional(),
		// `null` until the recipient finishes the sequence.
		completedReason: z.string().nullish(),
		// When the recipient was added, in Unix seconds.
		createdAt: z.number().optional(),
		// The position of the last stage sent, counting from 1.
		lastStageSentOrdinal: z.number().optional(),
		analytics: z
			.object({
				events: z
					.object({
						opens: z.number().optional(),
						clicks: z.number().optional(),
						downloads: z.number().optional(),
					})
					.optional(),
			})
			.optional(),
		// Per-stage activity; the official SequenceRecipientStage shape is not
		// pinned for this plugin, so stages stay extensible objects.
		stages: z.array(z.object({}).passthrough()).optional(),
		// The recipient's variables; only present with `includeVariables=true`
		// and the provider declares them as `+[anything]`.
		variables: z.object({}).passthrough().optional(),
	})
	.passthrough();

export type SequenceRecipient = z.infer<typeof SequenceRecipientSchema>;

export const SequencesRecipientsListInputSchema = z.object({
	id: z.string().min(1),
	// Values above 50 are treated as 50.
	limit: z.coerce.number().int().max(50).optional(),
	offset: z.coerce.number().int().optional(),
	sortBy: z.string().optional(),
	sortDesc: mixmaxBooleanFlag.optional(),
	// A search string that narrows the list, for example a full email address.
	query: z.string().optional(),
	// Whose recipients to include: leave out for everyone, `myself` for
	// recipients the caller added, or a team id.
	analyticsFrom: z.string().optional(),
	// `true` to include each recipient's `variables`.
	includeVariables: mixmaxBooleanFlag.optional(),
});

export type SequencesRecipientsListInput = z.infer<
	typeof SequencesRecipientsListInputSchema
>;

// GET /v1/sequences/{id}/recipients answers 200 with a bare JSON array, not
// the `{results, next}` page shape the other list endpoints use; paging is
// done with `limit` and `offset`.
export const SequencesRecipientsListOutputSchema = z.array(
	SequenceRecipientSchema,
);

export type SequencesRecipientsListOutput = z.infer<
	typeof SequencesRecipientsListOutputSchema
>;

export const SequenceRecipientAddSchema = z.object({
	email: z.string().min(1),
	// Values for the variables the sequence uses, keyed by variable name.
	variables: z.object({}).passthrough().optional(),
	// The provider declares scheduledAt as an opaque value (a Unix-millisecond
	// integer, or the literal `false` to keep the recipient in the draft); no
	// narrower contract is documented.
	scheduledAt: z.unknown().optional(),
});

export type SequenceRecipientAdd = z.infer<typeof SequenceRecipientAddSchema>;

export const SequencesRecipientsAddInputSchema = z.object({
	id: z.string().min(1),
	recipients: z.array(SequenceRecipientAddSchema).min(1),
	// When to start the sequence for these recipients, in Unix milliseconds;
	// each recipient's own `scheduledAt` takes precedence. Leave it out to
	// start now. `false` is refused here: at this level Mixmax treats it as
	// "now"; to keep recipients as drafts, set `false` on each recipient.
	scheduledAt: mixmaxSendTimeMs.optional(),
	// `true` to fill in each recipient's variables from their contact data.
	enrich: mixmaxBooleanFlag.optional(),
	// `true` to add recipients even when they lack values for variables the
	// sequence uses.
	allowMissingVariables: mixmaxBooleanFlag.optional(),
});

export type SequencesRecipientsAddInput = z.infer<
	typeof SequencesRecipientsAddInputSchema
>;

// One entry per recipient sent, saying whether it was added.
export const SequenceRecipientAddResultSchema = z.object({
	id: z.string().optional(),
	email: z.string().optional(),
	stages: z.array(z.string()).optional(),
	status: z.string().optional(),
	errors: z.array(z.string()).optional(),
});

export type SequenceRecipientAddResult = z.infer<
	typeof SequenceRecipientAddResultSchema
>;

export const SequencesRecipientsAddOutputSchema = z.object({
	recipients: z.array(SequenceRecipientAddResultSchema),
});

export type SequencesRecipientsAddOutput = z.infer<
	typeof SequencesRecipientsAddOutputSchema
>;

// A sequence folder, matching the official SequenceFolder schema. Documented
// fields stay optional and the object passthrough: the provider may omit
// fields and add sharing detail it does not pin down.
export const SequenceFolderSchema = z
	.object({
		_id: z.string().optional(),
		userId: z.string().optional(),
		name: z.string().optional(),
		// The sequences in the folder.
		sequenceIds: z.array(z.string()).optional(),
		// Who the folder is shared with, as `users`, `teams` and `orgs` lists;
		// the provider declares the object without fixed properties.
		shared: z.object({}).passthrough().optional(),
		// ISO 8601 date-time strings.
		createdAt: z.string().optional(),
		savedAt: z.string().optional(),
	})
	.passthrough();

export type SequenceFolder = z.infer<typeof SequenceFolderSchema>;

export const SequenceFoldersListInputSchema = z.object({});

export type SequenceFoldersListInput = z.infer<
	typeof SequenceFoldersListInputSchema
>;

export const SequenceFoldersListOutputSchema = z.object({
	results: z.array(SequenceFolderSchema),
});

export type SequenceFoldersListOutput = z.infer<
	typeof SequenceFoldersListOutputSchema
>;

export const SequenceFoldersCreateInputSchema = z.object({
	name: z.string().min(1),
	// `enforceNameUniqueness: true` fails with 409 when the caller already owns
	// a folder with this name.
	options: z
		.object({
			enforceNameUniqueness: z.boolean().optional(),
		})
		.optional(),
});

export type SequenceFoldersCreateInput = z.infer<
	typeof SequenceFoldersCreateInputSchema
>;

// POST /v1/sequencefolders answers 200 with the new folder.
export const SequenceFoldersCreateOutputSchema = SequenceFolderSchema;

export type SequenceFoldersCreateOutput = z.infer<
	typeof SequenceFoldersCreateOutputSchema
>;

export const SequenceFoldersGetInputSchema = z.object({
	id: z.string().min(1),
});

export type SequenceFoldersGetInput = z.infer<
	typeof SequenceFoldersGetInputSchema
>;

export const SequenceFoldersGetOutputSchema = SequenceFolderSchema;

export type SequenceFoldersGetOutput = z.infer<
	typeof SequenceFoldersGetOutputSchema
>;

// PATCH /v1/sequencefolders/{id}. The docs warn that a request without `name`
// CLEARS the folder's name, so `name` is required here even though the
// provider would accept a body without one.
export const SequenceFoldersRenameInputSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	// `enforceNameUniqueness: true` fails with 409 when the caller already owns
	// a folder with this name.
	options: z
		.object({
			enforceNameUniqueness: z.boolean().optional(),
		})
		.optional(),
});

export type SequenceFoldersRenameInput = z.infer<
	typeof SequenceFoldersRenameInputSchema
>;

// PATCH /v1/sequencefolders/{id} answers 200 with the updated folder.
export const SequenceFoldersRenameOutputSchema = SequenceFolderSchema;

export type SequenceFoldersRenameOutput = z.infer<
	typeof SequenceFoldersRenameOutputSchema
>;

export const SequenceFoldersDeleteInputSchema = z.object({
	id: z.string().min(1),
});

export type SequenceFoldersDeleteInput = z.infer<
	typeof SequenceFoldersDeleteInputSchema
>;

// DELETE /v1/sequencefolders/{id} answers 204 with no body.
export const SequenceFoldersDeleteOutputSchema = z.undefined();

export type SequenceFoldersDeleteOutput = z.infer<
	typeof SequenceFoldersDeleteOutputSchema
>;

// POST /v1/sequencefolders/{id}/sequences body. The official body takes `_id`
// to move one sequence or `sequenceIds` to move several (anyOf); when both
// are sent `sequenceIds` wins, so neither field alone is required — only that
// at least one is present.
export const SequenceFoldersAddSequencesInputSchema = z
	.object({
		id: z.string().min(1),
		_id: z.string().min(1).optional(),
		sequenceIds: z.array(z.string()).min(1).optional(),
	})
	.refine(
		(input) => input._id !== undefined || input.sequenceIds !== undefined,
		{
			message: 'Provide `_id` or a non-empty `sequenceIds` array',
		},
	);

export type SequenceFoldersAddSequencesInput = z.infer<
	typeof SequenceFoldersAddSequencesInputSchema
>;

// One result per moved sequence, matching the official SequenceMoveResult.
export const SequenceMoveResultSchema = z.object({
	id: z.string().optional(),
	success: z.boolean().optional(),
	message: z.string().optional(),
});

export type SequenceMoveResult = z.infer<typeof SequenceMoveResultSchema>;

// POST /v1/sequencefolders/{id}/sequences answers 200 with one result per
// moved sequence, in one of two documented shapes: `{"results": [...]}` when
// `sequenceIds` was sent, or a bare one-element array when `_id` was sent.
export const SequenceFoldersAddSequencesOutputSchema = z.union([
	z.object({ results: z.array(SequenceMoveResultSchema) }).passthrough(),
	z.array(SequenceMoveResultSchema),
]);

export type SequenceFoldersAddSequencesOutput = z.infer<
	typeof SequenceFoldersAddSequencesOutputSchema
>;
