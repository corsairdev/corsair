import { z } from 'zod';

// Inputs use NetHunt's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field NetHunt adds or omits cannot fail a
// call that has already happened.
//
// NetHunt's public API is the Zapier surface: routes live under /zapier and
// records are `{ id, recordId, createdAt, fields }`, where `fields` is a map of
// the folder's field names to their values. Field names are per-folder and set
// by the user, so every field map is open and typed as a record.

const FolderIdSchema = z
	.string()
	.min(1)
	.describe("The folder's id, from folders.list.");

const RecordIdSchema = z.string().min(1).describe('The record id.');

/** An ISO 8601 instant, which every `since` filter takes. */
const InstantSchema = z
	.string()
	.datetime({ offset: true })
	.describe('An ISO 8601 instant, e.g. 2026-01-01T00:00:00.000Z.');

/** NetHunt's field values are strings, numbers, booleans or arrays of them. */
const FieldValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
	z.array(z.union([z.string(), z.number(), z.boolean()])),
]);

const FieldMapSchema = z
	.record(z.string(), FieldValueSchema)
	.describe(
		'The folder’s field names mapped to their values. Names are per-folder and set by the user.',
	);

// ── folders.list ──────────────────────────────────────────────────────────

const FoldersListInputSchema = z.object({
	writable: z
		.boolean()
		.optional()
		.describe(
			'True to list only folders the user may create records in, false for every readable folder. Defaults to every readable folder.',
		),
});

export type FoldersListInput = z.input<typeof FoldersListInputSchema>;

const FolderSchema = z
	.object({ id: z.string().nullish(), name: z.string().nullish() })
	.loose();

export type NethuntFolder = z.infer<typeof FolderSchema>;

const FoldersListResponseSchema = z.object({
	folders: z.array(FolderSchema),
});

export type FoldersListResponse = z.infer<typeof FoldersListResponseSchema>;

// ── folders.fields ────────────────────────────────────────────────────────

const FoldersFieldsInputSchema = z.object({ folderId: FolderIdSchema });

export type FoldersFieldsInput = z.input<typeof FoldersFieldsInputSchema>;

const FolderFieldSchema = z.object({ name: z.string().nullish() }).loose();

const FoldersFieldsResponseSchema = z.object({
	fields: z.array(FolderFieldSchema),
});

export type FoldersFieldsResponse = z.infer<typeof FoldersFieldsResponseSchema>;

// ── records.find ──────────────────────────────────────────────────────────

const RecordsFindInputSchema = z
	.object({
		folderId: FolderIdSchema,
		recordId: RecordIdSchema.optional(),
		query: z
			.string()
			.min(1)
			.optional()
			.describe(
				'A search query such as Name:Doe. NetHunt matches per field and ignores case.',
			),
		limit: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Most records to return. NetHunt defaults to 1.'),
	})
	.superRefine((value, ctx) => {
		// NetHunt needs one of the two; a request with neither answers an error.
		if (!value.recordId && !value.query) {
			ctx.addIssue({
				code: 'custom',
				message: 'Either recordId or query is required.',
			});
		}
	});

export type RecordsFindInput = z.input<typeof RecordsFindInputSchema>;

export const RecordSchema = z
	.object({
		id: z.string().nullish(),
		recordId: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		fields: FieldMapSchema.nullish(),
	})
	.loose();

export type NethuntRecord = z.infer<typeof RecordSchema>;

const RecordsFindResponseSchema = z.object({
	records: z.array(RecordSchema),
});

export type RecordsFindResponse = z.infer<typeof RecordsFindResponseSchema>;

// ── records.recent ────────────────────────────────────────────────────────

const RecordsRecentInputSchema = z.object({
	folderId: FolderIdSchema,
	since: InstantSchema.optional().describe(
		'Only records created after this instant. Defaults at NetHunt to 24 hours before the request.',
	),
	limit: z.number().int().min(1).optional(),
});

export type RecordsRecentInput = z.input<typeof RecordsRecentInputSchema>;

export type RecordsRecentResponse = RecordsFindResponse;

// ── records.updated ───────────────────────────────────────────────────────

const RecordsUpdatedInputSchema = z.object({
	folderId: FolderIdSchema,
	fieldNames: z
		.array(z.string().min(1))
		.optional()
		.describe(
			'Only report changes to these fields. Repeatable at the provider; several names are sent as separate parameters.',
		),
	since: InstantSchema.optional().describe(
		'Only records updated after this instant. Defaults at NetHunt to 24 hours before the request.',
	),
	limit: z.number().int().min(1).optional(),
});

export type RecordsUpdatedInput = z.input<typeof RecordsUpdatedInputSchema>;

export type RecordsUpdatedResponse = RecordsFindResponse;

// ── records.changes ───────────────────────────────────────────────────────

const RecordsChangesInputSchema = z.object({
	folderId: FolderIdSchema,
	recordId: RecordIdSchema.optional(),
	fieldNames: z.array(z.string().min(1)).optional(),
	since: InstantSchema.optional(),
	limit: z.number().int().min(1).optional(),
});

export type RecordsChangesInput = z.input<typeof RecordsChangesInputSchema>;

/**
 * One field's change: the values removed and the values added. NetHunt reports
 * actions, not before and after snapshots, so an update to a multi-value field
 * lists only what changed.
 */
const FieldActionSchema = z
	.object({
		remove: FieldValueSchema.optional(),
		add: FieldValueSchema.optional(),
	})
	.loose();

/** Who made the change. */
const ChangeUserSchema = z
	.object({
		personalName: z.string().nullish(),
		emailAddress: z.string().nullish(),
	})
	.loose();

const RecordChangeSchema = z
	.object({
		id: z.string().nullish(),
		recordId: z.string().nullish(),
		time: z.string().nullish(),
		user: ChangeUserSchema.nullish(),
		/** CREATE, UPDATE or DELETE. */
		recordAction: z.string().nullish(),
		/** Field name to the change made, as remove and add actions. */
		fieldActions: z.record(z.string(), FieldActionSchema).nullish(),
	})
	.loose();

const RecordsChangesResponseSchema = z.object({
	changes: z.array(RecordChangeSchema),
});

export type RecordsChangesResponse = z.infer<
	typeof RecordsChangesResponseSchema
>;

// ── records.create ────────────────────────────────────────────────────────

const RecordsCreateInputSchema = z.object({
	folderId: FolderIdSchema,
	timeZone: z
		.string()
		.min(1)
		.describe(
			'The user’s time zone, an IANA name such as Europe/London. NetHunt requires it on every create and uses it to interpret date fields.',
		),
	fields: FieldMapSchema,
});

export type RecordsCreateInput = z.input<typeof RecordsCreateInputSchema>;

const RecordCreatedSchema = z
	.object({
		recordId: z.string().nullish(),
		createdAt: z.string().nullish(),
		fields: FieldMapSchema.nullish(),
	})
	.loose();

export type RecordsCreateResponse = z.infer<typeof RecordCreatedSchema>;

const RecordUpdatedSchema = z
	.object({
		recordId: z.string().nullish(),
		updatedAt: z.string().nullish(),
		fields: FieldMapSchema.nullish(),
	})
	.loose();

export type RecordsUpdateResponse = z.infer<typeof RecordUpdatedSchema>;

// ── records.update ────────────────────────────────────────────────────────

/**
 * NetHunt updates one field at a time through an action object: `overwrite`
 * clears the value, `remove` takes values out and `add` puts values in. It
 * differs from `create`, which takes a flat field map.
 */
const FieldActionInputSchema = z
	.object({
		overwrite: z
			.boolean()
			.optional()
			.describe('Clear the field before adding. Do not combine with remove.'),
		remove: z
			.union([FieldValueSchema, z.array(FieldValueSchema)])
			.optional()
			.describe('Values to take out. Do not combine with overwrite.'),
		add: z
			.union([FieldValueSchema, z.array(FieldValueSchema)])
			.optional()
			.describe('Values to put in.'),
	})
	.superRefine((value, ctx) => {
		// NetHunt's docs forbid combining the two, and it fails at the provider.
		if (value.overwrite === true && value.remove !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['remove'],
				message: 'Do not combine overwrite with remove.',
			});
		}
	});

const RecordsUpdateInputSchema = z.object({
	recordId: RecordIdSchema,
	overwrite: z
		.boolean()
		.optional()
		.describe(
			'The default for every field action. NetHunt defaults it to false.',
		),
	fieldActions: z
		.record(z.string(), FieldActionInputSchema)
		.describe('Field name to the action to perform on it.'),
});

export type RecordsUpdateInput = z.input<typeof RecordsUpdateInputSchema>;

// ── records.delete ────────────────────────────────────────────────────────

const RecordsDeleteInputSchema = z.object({ recordId: RecordIdSchema });

export type RecordsDeleteInput = z.input<typeof RecordsDeleteInputSchema>;

/** A delete answers an empty object, so this records what was asked for. */
const RecordsDeleteResponseSchema = z.object({
	deleted: z.boolean(),
	recordId: z.string(),
});

export type RecordsDeleteResponse = z.infer<typeof RecordsDeleteResponseSchema>;

// ── records.comment ───────────────────────────────────────────────────────

const RecordsCommentInputSchema = z.object({
	recordId: RecordIdSchema,
	text: z.string().min(1).describe('The comment text.'),
});

export type RecordsCommentInput = z.input<typeof RecordsCommentInputSchema>;

const CommentCreatedSchema = z
	.object({
		commentId: z.string().nullish(),
		createdAt: z.string().nullish(),
	})
	.loose();

export type RecordsCommentResponse = z.infer<typeof CommentCreatedSchema>;

// ── records.callLog ───────────────────────────────────────────────────────

const RecordsCallLogInputSchema = z.object({
	recordId: RecordIdSchema,
	text: z.string().min(1).describe('The call log text.'),
	time: z
		.string()
		.datetime({ offset: true })
		.optional()
		.describe('When the call started, as an ISO 8601 instant in UTC.'),
	duration: z
		.number()
		.min(0)
		.optional()
		.describe('How long the call lasted, in minutes.'),
});

export type RecordsCallLogInput = z.input<typeof RecordsCallLogInputSchema>;

const CallLogCreatedSchema = z
	.object({
		callLogId: z.string().nullish(),
		createdAt: z.string().nullish(),
	})
	.loose();

export type RecordsCallLogResponse = z.infer<typeof CallLogCreatedSchema>;

// ── records.linkThread ────────────────────────────────────────────────────

const RecordsLinkThreadInputSchema = z.object({
	recordId: RecordIdSchema,
	gmailThreadId: z
		.string()
		.min(1)
		.describe('The Gmail thread id to attach to the record.'),
});

export type RecordsLinkThreadInput = z.input<
	typeof RecordsLinkThreadInputSchema
>;

/** Linking answers an empty object, so this records what was asked for. */
const RecordsLinkThreadResponseSchema = z.object({
	linked: z.boolean(),
	recordId: z.string(),
	gmailThreadId: z.string(),
});

export type RecordsLinkThreadResponse = z.infer<
	typeof RecordsLinkThreadResponseSchema
>;

// ── account.verify ────────────────────────────────────────────────────────

const AccountVerifyInputSchema = z.object({});

export type AccountVerifyInput = z.input<typeof AccountVerifyInputSchema>;

const NethuntUserSchema = z
	.object({
		personalName: z.string().nullish(),
		emailAddress: z.string().nullish(),
	})
	.loose();

/** The verify route answers a one-element array holding this. */
const VerifyResultSchema = z
	.object({ user: NethuntUserSchema.nullish() })
	.loose();

const AccountVerifyResponseSchema = z.object({ user: NethuntUserSchema });

export type AccountVerifyResponse = z.infer<typeof AccountVerifyResponseSchema>;

export type NethuntUser = z.infer<typeof NethuntUserSchema>;

export const VerifyArraySchema = z.array(VerifyResultSchema);

// ── records.recentComments / recentCallLogs / recentFiles ─────────────────

/** The three timeline triggers take the same folder, since and limit. */
const TimelineInputSchema = z.object({
	folderId: FolderIdSchema,
	since: InstantSchema.optional().describe(
		'Only items created after this instant. Defaults at NetHunt to 24 hours before the request.',
	),
	limit: z.number().int().min(1).optional(),
});

export type TimelineInput = z.input<typeof TimelineInputSchema>;

const RecordCommentSchema = z
	.object({
		id: z.string().nullish(),
		commentId: z.string().nullish(),
		recordId: z.string().nullish(),
		createdAt: z.string().nullish(),
		text: z.string().nullish(),
	})
	.loose();

const RecordsRecentCommentsResponseSchema = z.object({
	comments: z.array(RecordCommentSchema),
});

export type RecordsRecentCommentsResponse = z.infer<
	typeof RecordsRecentCommentsResponseSchema
>;

const RecordCallLogSchema = z
	.object({
		id: z.string().nullish(),
		callLogId: z.string().nullish(),
		recordId: z.string().nullish(),
		createdAt: z.string().nullish(),
		text: z.string().nullish(),
		/** When the call started. */
		time: z.string().nullish(),
		/** Minutes. */
		duration: z.number().nullish(),
		endTime: z.string().nullish(),
	})
	.loose();

const RecordsRecentCallLogsResponseSchema = z.object({
	callLogs: z.array(RecordCallLogSchema),
});

export type RecordsRecentCallLogsResponse = z.infer<
	typeof RecordsRecentCallLogsResponseSchema
>;

const RecordFileSchema = z
	.object({
		id: z.string().nullish(),
		fileId: z.string().nullish(),
		folderId: z.string().nullish(),
		recordId: z.string().nullish(),
		createdAt: z.string().nullish(),
		googleDriveFileId: z.string().nullish(),
		description: z.string().nullish(),
		iconUrl: z.string().nullish(),
		mimeType: z.string().nullish(),
		name: z.string().nullish(),
		url: z.string().nullish(),
	})
	.loose();

const RecordsRecentFilesResponseSchema = z.object({
	files: z.array(RecordFileSchema),
});

export type RecordsRecentFilesResponse = z.infer<
	typeof RecordsRecentFilesResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type NethuntEndpointInputs = {
	foldersList: FoldersListInput;
	foldersFields: FoldersFieldsInput;
	recordsFind: RecordsFindInput;
	recordsRecent: RecordsRecentInput;
	recordsUpdated: RecordsUpdatedInput;
	recordsChanges: RecordsChangesInput;
	recordsRecentComments: TimelineInput;
	recordsRecentCallLogs: TimelineInput;
	recordsRecentFiles: TimelineInput;
	recordsCreate: RecordsCreateInput;
	recordsUpdate: RecordsUpdateInput;
	recordsDelete: RecordsDeleteInput;
	recordsComment: RecordsCommentInput;
	recordsCallLog: RecordsCallLogInput;
	recordsLinkThread: RecordsLinkThreadInput;
	accountVerify: AccountVerifyInput;
};

export type NethuntEndpointOutputs = {
	foldersList: FoldersListResponse;
	foldersFields: FoldersFieldsResponse;
	recordsFind: RecordsFindResponse;
	recordsRecent: RecordsRecentResponse;
	recordsUpdated: RecordsUpdatedResponse;
	recordsChanges: RecordsChangesResponse;
	recordsRecentComments: RecordsRecentCommentsResponse;
	recordsRecentCallLogs: RecordsRecentCallLogsResponse;
	recordsRecentFiles: RecordsRecentFilesResponse;
	recordsCreate: RecordsCreateResponse;
	recordsUpdate: RecordsUpdateResponse;
	recordsDelete: RecordsDeleteResponse;
	recordsComment: RecordsCommentResponse;
	recordsCallLog: RecordsCallLogResponse;
	recordsLinkThread: RecordsLinkThreadResponse;
	accountVerify: AccountVerifyResponse;
};

export const NethuntEndpointInputSchemas = {
	foldersList: FoldersListInputSchema,
	foldersFields: FoldersFieldsInputSchema,
	recordsFind: RecordsFindInputSchema,
	recordsRecent: RecordsRecentInputSchema,
	recordsUpdated: RecordsUpdatedInputSchema,
	recordsChanges: RecordsChangesInputSchema,
	recordsRecentComments: TimelineInputSchema,
	recordsRecentCallLogs: TimelineInputSchema,
	recordsRecentFiles: TimelineInputSchema,
	recordsCreate: RecordsCreateInputSchema,
	recordsUpdate: RecordsUpdateInputSchema,
	recordsDelete: RecordsDeleteInputSchema,
	recordsComment: RecordsCommentInputSchema,
	recordsCallLog: RecordsCallLogInputSchema,
	recordsLinkThread: RecordsLinkThreadInputSchema,
	accountVerify: AccountVerifyInputSchema,
} as const;

export const NethuntEndpointOutputSchemas = {
	foldersList: FoldersListResponseSchema,
	foldersFields: FoldersFieldsResponseSchema,
	recordsFind: RecordsFindResponseSchema,
	recordsRecent: RecordsFindResponseSchema,
	recordsUpdated: RecordsFindResponseSchema,
	recordsChanges: RecordsChangesResponseSchema,
	recordsRecentComments: RecordsRecentCommentsResponseSchema,
	recordsRecentCallLogs: RecordsRecentCallLogsResponseSchema,
	recordsRecentFiles: RecordsRecentFilesResponseSchema,
	recordsCreate: RecordCreatedSchema,
	recordsUpdate: RecordUpdatedSchema,
	recordsDelete: RecordsDeleteResponseSchema,
	recordsComment: CommentCreatedSchema,
	recordsCallLog: CallLogCreatedSchema,
	recordsLinkThread: RecordsLinkThreadResponseSchema,
	accountVerify: AccountVerifyResponseSchema,
} as const;
