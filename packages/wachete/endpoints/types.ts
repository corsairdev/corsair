import { z } from 'zod';

// Inputs use Wachete's own parameter names. Outputs are `.loose()` and their
// documented fields nullish.
// Reference: https://wachete.com/api and the live OpenAPI document at
// https://api.wachete.com/swagger/v1/swagger.json

/**
 * Wachete's enums are declared as integers in the OpenAPI document, but that
 * same document's own example payload sends names (`"Error"`, `"NotEq"`,
 * `"Webhook"`, `"SinglePage"`), and the prose docs do too. ASP.NET Core accepts
 * either on a string-enum contract, so the plugin accepts both and sends the
 * name, which is the form every documented example uses.
 */

/** What a monitor alerts on. */
export const WACHETE_ALERT_TYPES = [
	'Error',
	'Changed',
	'NotEq',
	'Eq',
	'Contains',
	'NotContains',
	'StartsWith',
	'EndsWith',
	'Regex',
	'Lower',
	'Greater',
	'Exists',
	'NotExists',
] as const;

/**
 * The comparison a `parameters` alert makes. Wachete declares 0 to 10 for both
 * this and `AlertType`, but does not publish which number maps to which name —
 * so the name is what the schema asks for and the number is accepted as-is.
 */
const CompareTypeSchema = z.union([
	z.enum(WACHETE_ALERT_TYPES),
	z.number().int().min(0).max(10),
]);

/** A number, or the name Wachete documents, since both are accepted. */
const AlertTypeSchema = z.union([
	z.enum(WACHETE_ALERT_TYPES),
	z.number().int().min(0).max(10),
]);

const JobTypeSchema = z
	.union([z.enum(['SinglePage', 'Portal']), z.number().int().min(0).max(1)])
	.describe(
		'SinglePage watches one page; Portal crawls a site. Defaults to SinglePage.',
	);

export const WACHETE_MESSAGING_TYPES = [
	'Email',
	'Webhook',
	'Sms',
	'Slack',
	'Teams',
	'Telegram',
	'Pushover',
	'Discord',
] as const;

const MessagingTypeSchema = z
	.union([
		z.enum(WACHETE_MESSAGING_TYPES),
		// The declared set is 0, 1, 4, 8, 16, 32, 64 and 92 — flags, not a
		// sequence, so any of them is passed through.
		z
			.number()
			.int(),
	])
	.describe('How to notify: a name such as Webhook, or its numeric value.');

const LocationSchema = z
	.union([z.enum(['us', 'gb']), z.number().int().min(0).max(5)])
	.describe('The location to check from. The docs name us and gb.');

/** A header, as a key/value pair rather than an object. */
const HeadersSchema = z
	.array(
		z.object({
			key: z.string(),
			value: z.string(),
		}),
	)
	.describe('Request headers, as `{ key, value }` pairs.');

const NotificationEndpointSchema = z
	.object({
		type: MessagingTypeSchema,
		value: z
			.string()
			.describe('The address, URL or handle, depending on the type.'),
	})
	.loose();

const AlertSchema = z
	.object({
		type: AlertTypeSchema,
		value: z
			.string()
			.nullish()
			.describe('What to compare against, for the alert types that need it.'),
		parameters: z
			.object({
				compare: CompareTypeSchema.nullish(),
				value: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const UrlFilterValueSchema = z
	.object({
		filter: z.string().min(1),
		type: z
			.union([z.enum(['Contains', 'Regex']), z.number().int().min(0).max(1)])
			.describe('Contains for a plain substring, Regex for a pattern.'),
	})
	.loose();

const UrlFilterSchema = z
	.object({
		include: z.array(UrlFilterValueSchema).min(1).optional(),
		exclude: z.array(UrlFilterValueSchema).min(1).optional(),
	})
	.describe('Portal only: which crawled URLs to keep or skip.');

// ── the monitor ───────────────────────────────────────────────────────────

/**
 * A monitor, as Wachete reads it back. `data` holds the last check: its value,
 * when it last changed, and any error the check hit.
 */
const ClientTaskSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		method: z.string().nullish(),
		url: z.string().nullish(),
		headers: HeadersSchema.nullish(),
		body: z.string().nullish(),
		xPath: z.string().nullish(),
		excludeXPath: z.string().nullish(),
		regex: z.string().nullish(),
		alerts: z.array(AlertSchema).nullish(),
		recurrenceInSeconds: z.number().nullish(),
		folderId: z.string().nullish(),
		data: z
			.object({
				lastCheckTimestamp: z.string().nullish(),
				valueChangedTimestamp: z.string().nullish(),
				raw: z.string().nullish(),
				error: z.string().nullish(),
				diff: z.array(z.unknown()).nullish(),
			})
			.loose()
			.nullish(),
		notificationEndpoints: z.array(NotificationEndpointSchema).nullish(),
		proxies: z.array(z.object({ location: z.string() }).loose()).nullish(),
		location: LocationSchema.nullish(),
		dynamicContent: z.boolean().nullish(),
		scrollPage: z.boolean().nullish(),
		ignoreInvalidPages: z.boolean().nullish(),
		collectRawHtml: z.boolean().nullish(),
		jobType: JobTypeSchema.nullish(),
		crawlingDepth: z.number().nullish(),
		crawlBinaryContent: z.boolean().nullish(),
		urlFilter: UrlFilterSchema.nullish(),
		crawlPagesFromAllDomains: z.boolean().nullish(),
		note: z.string().nullish(),
	})
	.loose();

export type WacheteTask = z.infer<typeof ClientTaskSchema>;

/** Adding and updating are the same call: an `id` updates, its absence creates. */
const TasksUpsertInputSchema = z
	.object({
		id: z
			.string()
			.optional()
			.describe('Omit to create, send to update that monitor.'),
		name: z.string().min(1),
		url: z.string().min(1),
		xPath: z
			.string()
			.optional()
			.describe('The part of the page to watch. `/` is the whole page.'),
		excludeXPath: z
			.string()
			.optional()
			.describe('A part of the page to ignore, such as a timestamp.'),
		regex: z.string().optional(),
		method: z
			.string()
			.optional()
			.describe('The HTTP method to fetch with. Defaults to GET.'),
		headers: HeadersSchema.optional(),
		body: z.string().optional().describe('Request body, for a POST monitor.'),
		alerts: z.array(AlertSchema).min(1).optional(),
		recurrenceInSeconds: z
			.number()
			.int()
			.positive()
			.describe('How often to check, in seconds. 86400 is daily.'),
		folderId: z.string().optional(),
		notificationEndpoints: z
			.array(NotificationEndpointSchema)
			.min(1)
			.optional()
			.describe('Who to tell. Omit to notify every endpoint on the account.'),
		proxies: z
			.array(z.object({ location: z.string() }).loose())
			.min(1)
			.optional(),
		location: LocationSchema.optional(),
		dynamicContent: z
			.boolean()
			.optional()
			.describe('Set when the watched content is rendered by JavaScript.'),
		scrollPage: z.boolean().optional(),
		ignoreInvalidPages: z.boolean().optional(),
		collectRawHtml: z.boolean().optional(),
		jobType: JobTypeSchema.optional(),
		crawlingDepth: z
			.union([z.literal(1), z.literal(2), z.literal(3)])
			.optional()
			.describe('Portal only: how deep to crawl, 1 to 3. Defaults to 2.'),
		crawlBinaryContent: z.boolean().optional(),
		urlFilter: UrlFilterSchema.optional(),
		crawlPagesFromAllDomains: z.boolean().optional(),
		note: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.jobType === 'Portal' || value.jobType === 1) {
			if (value.crawlingDepth === undefined) return;
			return;
		}
		// Everything below only applies to Portal monitors.
		for (const key of [
			'crawlingDepth',
			'urlFilter',
			'crawlBinaryContent',
			'crawlPagesFromAllDomains',
		] as const) {
			if (value[key] !== undefined) {
				ctx.addIssue({
					code: 'custom',
					path: [key],
					message: `${key} only applies to a Portal monitor.`,
				});
			}
		}
	});

export type TasksUpsertInput = z.infer<typeof TasksUpsertInputSchema>;

const TaskResponseSchema = ClientTaskSchema;

export type TaskResponse = z.infer<typeof TaskResponseSchema>;

const TasksGetInputSchema = z.object({ id: z.string().min(1) });

export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;

const TasksDeleteInputSchema = z.object({ id: z.string().min(1) });

export type TasksDeleteInput = z.infer<typeof TasksDeleteInputSchema>;

/** Deleting answers 200 with no body, so the plugin states what it did. */
const DeleteResponseSchema = z.object({
	id: z.string(),
	deleted: z.literal(true),
});

export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;

const TasksSearchInputSchema = z.object({
	query: z
		.string()
		.min(1)
		.describe('A search term matched against monitor names.'),
});

export type TasksSearchInput = z.infer<typeof TasksSearchInputSchema>;

/** Search caps at 500 monitors and is not paged. */
const TasksSearchResponseSchema = z
	.object({
		tasks: z.array(ClientTaskSchema).nullish(),
	})
	.loose();

export type TasksSearchResponse = z.infer<typeof TasksSearchResponseSchema>;

const TasksPagesInputSchema = z.object({
	id: z.string().min(1).describe('A Portal monitor id.'),
});

export type TasksPagesInput = z.infer<typeof TasksPagesInputSchema>;

const PagesResponseSchema = z
	.object({
		pages: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type PagesResponse = z.infer<typeof PagesResponseSchema>;

// ── notifications ─────────────────────────────────────────────────────────

const NotificationsListInputSchema = z.object({
	taskId: z
		.string()
		.optional()
		.describe('Only this monitor. Omit for every monitor.'),
	from: z.string().optional().describe('ISO 8601 start.'),
	to: z.string().optional().describe('ISO 8601 end.'),
	count: z.number().int().positive().optional(),
	continuationToken: z
		.string()
		.optional()
		.describe('The token the previous page returned.'),
	html: z
		.boolean()
		.optional()
		.describe('Include the notification HTML, which makes the response large.'),
});

export type NotificationsListInput = z.infer<
	typeof NotificationsListInputSchema
>;

const NotificationSchema = z
	.object({
		id: z.string().nullish(),
		type: AlertTypeSchema.nullish(),
		current: z.string().nullish(),
		comparand: z.string().nullish(),
		html: z.string().nullish(),
		error: z.string().nullish(),
		timestamp: z.string().nullish(),
		serverTime: z.string().nullish(),
		taskId: z.string().nullish(),
		taskName: z.string().nullish(),
		url: z.string().nullish(),
	})
	.loose();

export type WacheteNotification = z.infer<typeof NotificationSchema>;

const NotificationsListResponseSchema = z
	.object({
		data: z.array(NotificationSchema).nullish(),
		continuationToken: z
			.string()
			.nullish()
			.describe('Pass this back to read the next page; null on the last.'),
	})
	.loose();

export type NotificationsListResponse = z.infer<
	typeof NotificationsListResponseSchema
>;

const NotificationsGetInputSchema = z.object({
	alertId: z.string().min(1),
});

export type NotificationsGetInput = z.infer<typeof NotificationsGetInputSchema>;

/** One notification rendered as HTML, as it was sent. */
const NotificationHtmlResponseSchema = z
	.object({
		jobType: JobTypeSchema.nullish(),
		syntheticExpression: z.string().nullish(),
		url: z.string().nullish(),
		name: z.string().nullish(),
		html: z.string().nullish(),
		timestampUtc: z.string().nullish(),
	})
	.loose();

export type NotificationHtmlResponse = z.infer<
	typeof NotificationHtmlResponseSchema
>;

// ── history ───────────────────────────────────────────────────────────────

const DataListInputSchema = z.object({
	id: z.string().min(1).describe('The monitor id.'),
	from: z.string().optional().describe('ISO 8601 start.'),
	to: z.string().optional().describe('ISO 8601 end.'),
	count: z.number().int().positive().optional(),
	returnDiff: z
		.boolean()
		.optional()
		.describe(
			'Return a Google-style diff per entry rather than the raw value.',
		),
	continuationToken: z.string().optional(),
});

export type DataListInput = z.infer<typeof DataListInputSchema>;

const DataListResponseSchema = z
	.object({
		data: z
			.array(
				z
					.object({
						lastCheckTimestamp: z.string().nullish(),
						valueChangedTimestamp: z.string().nullish(),
						raw: z.string().nullish(),
						error: z.string().nullish(),
						// Each diff entry is an operation with its text.
						diff: z.array(z.unknown()).nullish(),
					})
					.loose(),
			)
			.nullish(),
		continuationToken: z.string().nullish(),
	})
	.loose();

export type DataListResponse = z.infer<typeof DataListResponseSchema>;

// ── folders ───────────────────────────────────────────────────────────────

const FolderSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		parentId: z.string().nullish(),
		count: z.number().nullish(),
		failedCount: z.number().nullish(),
		pausedCount: z.number().nullish(),
	})
	.loose();

export type WacheteFolder = z.infer<typeof FolderSchema>;

/** A folder listing returns its subfolders and monitors, plus the path to it. */
const FolderListInputSchema = z.object({
	parentId: z
		.string()
		.optional()
		.describe('The folder to list. Omit to list the root.'),
	continuationToken: z.string().optional(),
});

export type FolderListInput = z.infer<typeof FolderListInputSchema>;

const FolderListResponseSchema = z
	.object({
		subfolders: z.array(FolderSchema).nullish(),
		tasks: z.array(ClientTaskSchema).nullish(),
		path: z.array(FolderSchema).nullish(),
		continuationToken: z.string().nullish(),
	})
	.loose();

export type FolderListResponse = z.infer<typeof FolderListResponseSchema>;

const FolderUpsertInputSchema = z.object({
	id: z
		.string()
		.optional()
		.describe('Omit to create, send to rename or move that folder.'),
	name: z.string().min(1),
	parentId: z.string().optional(),
});

export type FolderUpsertInput = z.infer<typeof FolderUpsertInputSchema>;

const FolderResponseSchema = FolderSchema;

export type FolderResponse = z.infer<typeof FolderResponseSchema>;

const FolderDeleteInputSchema = z.object({
	id: z.string().min(1),
});

export type FolderDeleteInput = z.infer<typeof FolderDeleteInputSchema>;

const FolderMoveInputSchema = z
	.object({
		folderId: z
			.string()
			.describe('The destination folder. An empty string means the root.'),
		taskIds: z.array(z.string()).min(1).optional(),
		folderIds: z.array(z.string()).min(1).optional(),
	})
	.superRefine((value, ctx) => {
		if (!value.taskIds && !value.folderIds) {
			ctx.addIssue({
				code: 'custom',
				path: ['taskIds'],
				message: 'A move needs at least one taskId or folderId.',
			});
		}
		if (
			value.folderIds?.length === 1 &&
			value.folderIds[0] === value.folderId
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['folderIds'],
				message: 'A folder cannot be moved into itself.',
			});
		}
	});

export type FolderMoveInput = z.infer<typeof FolderMoveInputSchema>;

const FolderMoveResponseSchema = z.object({ moved: z.literal(true) }).loose();

export type FolderMoveResponse = z.infer<typeof FolderMoveResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type WacheteEndpointInputs = {
	tasksUpsert: TasksUpsertInput;
	tasksGet: TasksGetInput;
	tasksDelete: TasksDeleteInput;
	tasksSearch: TasksSearchInput;
	tasksPages: TasksPagesInput;
	notificationsList: NotificationsListInput;
	notificationsGet: NotificationsGetInput;
	dataList: DataListInput;
	foldersList: FolderListInput;
	foldersUpsert: FolderUpsertInput;
	foldersDelete: FolderDeleteInput;
	foldersMove: FolderMoveInput;
};

export type WacheteEndpointOutputs = {
	tasksUpsert: TaskResponse;
	tasksGet: TaskResponse;
	tasksDelete: DeleteResponse;
	tasksSearch: TasksSearchResponse;
	tasksPages: PagesResponse;
	notificationsList: NotificationsListResponse;
	notificationsGet: NotificationHtmlResponse;
	dataList: DataListResponse;
	foldersList: FolderListResponse;
	foldersUpsert: FolderResponse;
	foldersDelete: DeleteResponse;
	foldersMove: FolderMoveResponse;
};

export const WacheteEndpointInputSchemas = {
	tasksUpsert: TasksUpsertInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksDelete: TasksDeleteInputSchema,
	tasksSearch: TasksSearchInputSchema,
	tasksPages: TasksPagesInputSchema,
	notificationsList: NotificationsListInputSchema,
	notificationsGet: NotificationsGetInputSchema,
	dataList: DataListInputSchema,
	foldersList: FolderListInputSchema,
	foldersUpsert: FolderUpsertInputSchema,
	foldersDelete: FolderDeleteInputSchema,
	foldersMove: FolderMoveInputSchema,
} as const;

export const WacheteEndpointOutputSchemas = {
	tasksUpsert: TaskResponseSchema,
	tasksGet: TaskResponseSchema,
	tasksDelete: DeleteResponseSchema,
	tasksSearch: TasksSearchResponseSchema,
	tasksPages: PagesResponseSchema,
	notificationsList: NotificationsListResponseSchema,
	notificationsGet: NotificationHtmlResponseSchema,
	dataList: DataListResponseSchema,
	foldersList: FolderListResponseSchema,
	foldersUpsert: FolderResponseSchema,
	foldersDelete: DeleteResponseSchema,
	foldersMove: FolderMoveResponseSchema,
} as const;
