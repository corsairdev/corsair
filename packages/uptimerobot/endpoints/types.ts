import { z } from 'zod';

// Inputs use UptimeRobot's own parameter names. Outputs are `.loose()` and
// their documented fields nullish, so a field UptimeRobot adds or omits cannot
// fail a call that has already happened.
// Reference: https://cdn.uptimerobot.com/api/openapi.yaml

const MonitorIdSchema = z.number().int().positive();

/** The five states a monitor can be in. */
export const UPTIMEROBOT_MONITOR_STATUSES = [
	'PAUSED',
	'STARTED',
	'UP',
	'LOOKS_DOWN',
	'DOWN',
] as const;

const MonitorStatusSchema = z.enum(UPTIMEROBOT_MONITOR_STATUSES);

/**
 * The monitor types. Each type takes its own body shape — a PORT monitor needs
 * a port, a KEYWORD monitor needs the keyword settings — which `monitors.create`
 * checks for the type that was chosen.
 */
export const UPTIMEROBOT_MONITOR_TYPES = [
	'HTTP',
	'KEYWORD',
	'PING',
	'PORT',
	'HEARTBEAT',
	'DNS',
	'API',
	'UDP',
	'VISUAL_COMPARISON',
	'THIRD_PARTY_SERVICE',
] as const;

const MonitorTypeSchema = z.enum(UPTIMEROBOT_MONITOR_TYPES);

/** The response-time bucket, in seconds. */
const IntervalSchema = z
	.number()
	.int()
	.min(30)
	.describe('Seconds between checks. The free plan allows no less than 300.');

const PagingSchema = {
	limit: z
		.number()
		.int()
		.min(1)
		.max(200)
		.optional()
		.describe('Items per page, 1 to 200. UptimeRobot defaults to 50.'),
	cursor: z
		.string()
		.optional()
		.describe(
			"Where to resume. It is the opaque value after `cursor=` in the previous page's `nextLink`.",
		),
};

/**
 * A monitor as UptimeRobot returns it.
 *
 * `status` is the current state and `lastIncident` the most recent failure, so
 * a monitor that has never failed answers no `lastIncident`.
 */
const MonitorSchema = z
	.object({
		id: z.number().nullish(),
		friendlyName: z.string().nullish(),
		url: z.string().nullish(),
		type: z.string().nullish(),
		status: z.string().nullish(),
		interval: z.number().nullish(),
		timeout: z.number().nullish(),
		createDateTime: z.string().nullish(),
		groupId: z.number().nullish(),
		port: z.number().nullish(),
		keywordValue: z.string().nullish(),
		keywordType: z.string().nullish(),
		gracePeriod: z.number().nullish(),
		heartbeatUrl: z.string().nullish(),
		responseTimeThreshold: z.number().nullish(),
		customFields: z.record(z.string(), z.string()).nullish(),
		tags: z
			.array(
				z
					.object({
						id: z.number().nullish(),
						name: z.string().nullish(),
						color: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		assignedAlertContacts: z
			.array(
				z
					.object({
						alertContactId: z.number().nullish(),
						threshold: z.number().nullish(),
						recurrence: z.number().nullish(),
					})
					.loose(),
			)
			.nullish(),
		lastIncident: z
			.object({
				id: z.string().nullish(),
				// An object such as `{code: 'RESOLVED'}`. The spec leaves it untyped
				// (`status: {}`), so the code is modelled and the rest passed through.
				status: z.object({ code: z.string().nullish() }).loose().nullish(),
				cause: z.number().nullish(),
				reason: z.string().nullish(),
				startedAt: z.string().nullish(),
				duration: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type UptimeRobotMonitor = z.infer<typeof MonitorSchema>;

/** UptimeRobot pages with an opaque `nextLink`; null means the last page. */
function paginated<T extends z.ZodType>(item: T) {
	return z
		.object({
			data: z.array(item).nullish(),
			nextLink: z.string().nullish(),
		})
		.loose();
}

// ── monitors ──────────────────────────────────────────────────────────────

const MonitorsListInputSchema = z.object({
	...PagingSchema,
	name: z
		.string()
		.optional()
		.describe('A case-insensitive substring of the monitor name.'),
	url: z
		.string()
		.optional()
		.describe('A case-insensitive substring of the monitor URL.'),
	status: z
		.array(MonitorStatusSchema)
		.min(1)
		.optional()
		.describe('Only monitors in any of these states.'),
	tags: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Only monitors carrying any of these tag names. Case-sensitive.'),
	groupId: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Only monitors in this group; 0 is the ungrouped default group.'),
	customField: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('`key:value` pairs, all of which must match.'),
});

export type MonitorsListInput = z.infer<typeof MonitorsListInputSchema>;

const MonitorsListResponseSchema = paginated(MonitorSchema);

export type MonitorsListResponse = z.infer<typeof MonitorsListResponseSchema>;

const MonitorsGetInputSchema = z.object({ id: MonitorIdSchema });

export type MonitorsGetInput = z.infer<typeof MonitorsGetInputSchema>;

const MonitorsGetResponseSchema = MonitorSchema;

export type MonitorsGetResponse = z.infer<typeof MonitorsGetResponseSchema>;

/** The types whose create body requires `timeout`, per UptimeRobot's spec. */
const TYPES_NEEDING_TIMEOUT: ReadonlySet<string> = new Set([
	'HTTP',
	'KEYWORD',
	'PING',
	'PORT',
	'API',
	'UDP',
]);

/** The types whose create body requires `config`, per UptimeRobot's spec. */
const TYPES_NEEDING_CONFIG: ReadonlySet<string> = new Set([
	'DNS',
	'API',
	'UDP',
	'VISUAL_COMPARISON',
]);

/**
 * Creating a monitor.
 *
 * UptimeRobot documents one body per monitor `type`; this is the union of them,
 * checked against the chosen type:
 *
 * - `HEARTBEAT` needs no URL at all — the monitor is its own ping endpoint.
 * - `KEYWORD` needs `url`, `timeout`, `keywordType`, `keywordCaseType` and `keywordValue`.
 * - `PORT` and `UDP` need `url` and `port`.
 * - HTTP, KEYWORD, PING, PORT, API and UDP need `timeout` (at most 60).
 * - DNS, API, UDP and VISUAL_COMPARISON need `config`.
 * - everything else needs `url`.
 */
const MonitorsCreateInputSchema = z
	.object({
		// Optional because a THIRD_PARTY_SERVICE monitor is created from a provider id
		// alone; every other type still requires both, which the refine below checks.
		friendlyName: z.string().min(1).max(250).optional(),
		type: MonitorTypeSchema,
		interval: IntervalSchema.optional(),
		url: z
			.string()
			.min(1)
			.max(10_000)
			.optional()
			.describe(
				'The URL, hostname or IP to check; for DNS the resolver. Omitted only for HEARTBEAT.',
			),
		port: z
			.number()
			.int()
			.min(1)
			.max(65_535)
			.optional()
			.describe('Required for PORT and UDP monitors, rejected otherwise.'),
		portAlertCondition: z
			.enum(['CLOSED', 'OPEN'])
			.optional()
			.describe(
				'PORT only. Whether a closed port or an open one is the alert.',
			),
		keywordType: z
			.enum(['ALERT_EXISTS', 'ALERT_NOT_EXISTS'])
			.optional()
			.describe('KEYWORD only. Alert when the keyword is present or absent.'),
		keywordCaseType: z
			.enum(['CaseSensitive', 'CaseInsensitive'])
			.optional()
			.describe('KEYWORD only.'),
		keywordValue: z
			.string()
			.max(500)
			.optional()
			.describe('KEYWORD only. Text to look for in the response body.'),
		timeout: z
			.number()
			.int()
			.min(1)
			.max(60)
			.optional()
			.describe(
				'Seconds to wait, at most 60. Required for HTTP, KEYWORD, PING, PORT, API and UDP monitors.',
			),
		gracePeriod: z
			.number()
			.int()
			.min(0)
			.max(86_400)
			.optional()
			.describe('HEARTBEAT only. Seconds of lateness allowed before alerting.'),
		groupId: z.number().int().min(0).optional(),
		tagNames: z.array(z.string().min(1)).min(1).optional(),
		maintenanceWindowsIds: z.array(z.number().int()).optional(),
		assignedAlertContacts: z
			.array(
				z
					.object({
						alertContactId: z
							.number()
							.int()
							.describe('From account.alertContacts.'),
						threshold: z.number().int().min(0).optional(),
						recurrence: z.number().int().min(0).optional(),
					})
					.loose(),
			)
			.min(1)
			.optional()
			.describe('Who is alerted. Threshold and recurrence are paid-plan only.'),
		customFields: z
			.record(z.string(), z.string())
			.optional()
			.describe('Up to 20 key/value pairs. Paid plans only.'),
		responseTimeThreshold: z.number().int().min(0).max(60_000).optional(),
		// The spec types this per monitor type and the shape belongs to UptimeRobot,
		// so it is passed through rather than modelled. API monitors need
		// `config.apiAssertions`; THIRD_PARTY_SERVICE needs `config.thirdPartyService`.
		config: z
			.record(z.string(), z.unknown())
			.optional()
			.describe(
				'Type-specific configuration. API monitors need `apiAssertions`; THIRD_PARTY_SERVICE needs `thirdPartyService.providerId`.',
			),
		httpMethodType: z
			.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])
			.optional()
			.describe('HTTP monitors only.'),
		authType: z
			.string()
			.optional()
			.describe(
				'HTTP monitors only. The authentication scheme the check uses.',
			),
		customHttpHeaders: z
			.record(z.string(), z.string())
			.optional()
			.describe('HTTP monitors only. Headers sent with the check.'),
	})
	.superRefine((value, ctx) => {
		// A third-party service monitor is created from a provider id and nothing
		// else: the spec's DTO requires only `type` and `config.thirdPartyService`,
		// so the url, name and interval rules do not apply to it.
		if (value.type === 'THIRD_PARTY_SERVICE') {
			if (value.config === undefined) {
				ctx.addIssue({
					code: 'custom',
					path: ['config'],
					message:
						'A THIRD_PARTY_SERVICE monitor needs config.thirdPartyService.providerId.',
				});
			}
			return;
		}
		if (value.friendlyName === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['friendlyName'],
				message: `A ${value.type} monitor needs a friendlyName.`,
			});
		}
		if (value.interval === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['interval'],
				message: `A ${value.type} monitor needs an interval.`,
			});
		}
		const needsUrl = value.type !== 'HEARTBEAT';
		if (needsUrl && value.url === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['url'],
				message: `A ${value.type} monitor needs a url.`,
			});
		}
		if (value.type === 'HEARTBEAT' && value.url !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['url'],
				message:
					'A HEARTBEAT monitor takes no url; it is pinged by its own URL.',
			});
		}
		if (
			(value.type === 'PORT' || value.type === 'UDP') &&
			value.port === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['port'],
				message: `A ${value.type} monitor needs a port.`,
			});
		}
		// UptimeRobot answers 400 when one of these types has no timeout.
		if (TYPES_NEEDING_TIMEOUT.has(value.type) && value.timeout === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['timeout'],
				message: `A ${value.type} monitor needs a timeout.`,
			});
		}
		if (TYPES_NEEDING_CONFIG.has(value.type) && value.config === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['config'],
				message: `A ${value.type} monitor needs config.`,
			});
		}
		if (value.type === 'KEYWORD') {
			for (const key of [
				'keywordType',
				'keywordCaseType',
				'keywordValue',
			] as const) {
				if (value[key] === undefined) {
					ctx.addIssue({
						code: 'custom',
						path: [key],
						message: `A KEYWORD monitor needs ${key}.`,
					});
				}
			}
		}
	});

export type MonitorsCreateInput = z.infer<typeof MonitorsCreateInputSchema>;

const MonitorsCreateResponseSchema = MonitorSchema;

export type MonitorsCreateResponse = z.infer<
	typeof MonitorsCreateResponseSchema
>;

/** Only the fields given are changed; everything else keeps its value. */
const MonitorsUpdateInputSchema = z
	.object({
		id: MonitorIdSchema,
		friendlyName: z.string().min(1).max(250).optional(),
		url: z.string().min(1).max(10_000).optional(),
		interval: z.number().int().min(15).optional(),
		timeout: z.number().int().min(0).max(60).optional(),
		gracePeriod: z.number().int().min(0).max(86_400).optional(),
		port: z.number().int().min(1).max(65_535).optional(),
		portAlertCondition: z.enum(['CLOSED', 'OPEN']).optional(),
		keywordType: z.enum(['ALERT_EXISTS', 'ALERT_NOT_EXISTS']).optional(),
		keywordCaseType: z.union([z.literal(0), z.literal(1)]).optional(),
		keywordValue: z.string().max(500).optional(),
		status: MonitorStatusSchema.optional().describe(
			'PAUSED stops the checks, STARTED resumes them. Prefer monitors.pause and monitors.start.',
		),
		groupId: z.number().int().min(0).optional(),
		tagNames: z.array(z.string().min(1)).optional(),
		maintenanceWindowsIds: z.array(z.number().int()).optional(),
		customFields: z.record(z.string(), z.string()).optional(),
		responseTimeThreshold: z.number().int().min(0).max(60_000).optional(),
	})
	.loose();

export type MonitorsUpdateInput = z.infer<typeof MonitorsUpdateInputSchema>;

const MonitorsUpdateResponseSchema = MonitorSchema;

export type MonitorsUpdateResponse = z.infer<
	typeof MonitorsUpdateResponseSchema
>;

const MonitorsDeleteInputSchema = z.object({ id: MonitorIdSchema });

export type MonitorsDeleteInput = z.infer<typeof MonitorsDeleteInputSchema>;

/** Deleting answers 204 with no body, so the plugin states what it did. */
const MonitorsDeleteResponseSchema = z.object({
	id: z.number(),
	deleted: z.literal(true),
});

export type MonitorsDeleteResponse = z.infer<
	typeof MonitorsDeleteResponseSchema
>;

const MonitorActionInputSchema = z.object({ id: MonitorIdSchema });

export type MonitorActionInput = z.infer<typeof MonitorActionInputSchema>;

const MonitorActionResponseSchema = MonitorSchema;

export type MonitorActionResponse = z.infer<typeof MonitorActionResponseSchema>;

const MonitorsResetInputSchema = z.object({ id: MonitorIdSchema });

export type MonitorsResetInput = z.infer<typeof MonitorsResetInputSchema>;

const MonitorsResetResponseSchema = z.object({
	id: z.number(),
	reset: z.literal(true),
});

export type MonitorsResetResponse = z.infer<typeof MonitorsResetResponseSchema>;

// ── stats ─────────────────────────────────────────────────────────────────

export const UPTIMEROBOT_TIME_FRAMES = [
	'DAY',
	'WEEK',
	'MONTH',
	'DAYS_30',
	'YEAR',
	'ALL',
	'CUSTOM',
] as const;

const StatsUptimeInputSchema = z
	.object({
		timeFrame: z
			.enum(UPTIMEROBOT_TIME_FRAMES)
			.describe('CUSTOM needs both `start` and `end`.'),
		start: z
			.number()
			.int()
			.optional()
			.describe('Unix seconds. Required when timeFrame is CUSTOM.'),
		end: z
			.number()
			.int()
			.optional()
			.describe(
				'Unix seconds, after start. Required when timeFrame is CUSTOM.',
			),
		logLimit: z
			.number()
			.int()
			.min(1)
			.max(500)
			.optional()
			.describe('How many log entries to return.'),
	})
	.superRefine((value, ctx) => {
		if (value.timeFrame !== 'CUSTOM') return;
		if (value.start === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['start'],
				message: 'CUSTOM needs a start.',
			});
		}
		if (value.end === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['end'],
				message: 'CUSTOM needs an end.',
			});
		}
		if (
			value.start !== undefined &&
			value.end !== undefined &&
			value.end <= value.start
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['end'],
				message: 'end must be after start.',
			});
		}
	});

export type StatsUptimeInput = z.infer<typeof StatsUptimeInputSchema>;

const StatsUptimeResponseSchema = z
	.object({
		overallUptime: z.number().nullish(),
		totalIncidents: z.number().nullish(),
		totalTimeWithoutIncidents: z.number().nullish(),
		affectedMonitors: z.number().nullish(),
		mtbf: z.number().nullish(),
		logs: z
			.array(
				z
					.object({
						// DOWNTIME or SLOW_RESPONSE today; a string so a new type cannot fail the read.
						type: z.string().nullish(),
						datetime: z.string().nullish(),
						duration: z.number().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type StatsUptimeResponse = z.infer<typeof StatsUptimeResponseSchema>;

const DateRangeSchema = {
	from: z
		.string()
		.optional()
		.describe('ISO 8601 start. Defaults to 24 hours ago.'),
	to: z.string().optional().describe('ISO 8601 end. Defaults to now.'),
};

const StatsMonitorUptimeInputSchema = z.object({
	id: MonitorIdSchema,
	...DateRangeSchema,
});

export type StatsMonitorUptimeInput = z.infer<
	typeof StatsMonitorUptimeInputSchema
>;

/** The range is capped at 90 days; a longer one is rejected, not shortened. */
const StatsMonitorUptimeResponseSchema = z
	.object({
		uptime: z.number().nullish(),
		total_downtime_seconds: z.number().nullish(),
		incident_count: z.number().nullish(),
		mtbf: z.number().nullish(),
		from: z.string().nullish(),
		to: z.string().nullish(),
	})
	.loose();

export type StatsMonitorUptimeResponse = z.infer<
	typeof StatsMonitorUptimeResponseSchema
>;

const StatsResponseTimeInputSchema = z.object({
	id: MonitorIdSchema,
	...DateRangeSchema,
	includeTimeSeries: z
		.boolean()
		.optional()
		.describe('Also return `time_series`, which a long range makes large.'),
});

export type StatsResponseTimeInput = z.infer<
	typeof StatsResponseTimeInputSchema
>;

const StatsResponseTimeResponseSchema = z
	.object({
		summary: z
			.object({
				min: z.number().nullish(),
				max: z.number().nullish(),
				avg: z.number().nullish(),
			})
			.loose()
			.nullish(),
		data_points: z.number().nullish(),
		from: z.string().nullish(),
		to: z.string().nullish(),
		time_series: z
			.array(
				z
					.object({
						timestamp: z.string().nullish(),
						value: z.number().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type StatsResponseTimeResponse = z.infer<
	typeof StatsResponseTimeResponseSchema
>;

// ── incidents ─────────────────────────────────────────────────────────────

const IncidentsListInputSchema = z.object({
	...PagingSchema,
	monitor_id: z.number().int().positive().optional(),
	monitor_name: z
		.string()
		.optional()
		.describe('A partial, case-insensitive match on the monitor name.'),
	started_after: z.string().optional().describe('ISO 8601.'),
	started_before: z.string().optional().describe('ISO 8601.'),
	status: z
		.literal('open')
		.optional()
		.describe(
			'Only ongoing incidents, whatever started_after and started_before say.',
		),
	type: z.enum(['Downtime', 'SlowResponse', 'VisualChange']).optional(),
	cause: z
		.enum([
			'Timeout',
			'2xx',
			'3xx',
			'4xx',
			'5xx',
			'DNS',
			'AssertionFailed',
			'InvalidJSON',
			'ConfigError',
		])
		.optional()
		.describe('The root-cause group.'),
});

export type IncidentsListInput = z.infer<typeof IncidentsListInputSchema>;

/**
 * A filtered incident page can hold fewer than `limit` items, or none, while
 * `nextLink` is still set — so paging continues on `nextLink`, not on a count.
 */
const IncidentSummarySchema = z
	.object({
		id: z.string().nullish(),
		status: z.object({ code: z.string().nullish() }).loose().nullish(),
		cause: z.number().nullish(),
		reason: z.string().nullish(),
		duration: z.number().nullish(),
		startedAt: z.string().nullish(),
		resolvedAt: z.string().nullish(),
	})
	.loose();

export type UptimeRobotIncident = z.infer<typeof IncidentSummarySchema>;

const IncidentsListResponseSchema = paginated(IncidentSummarySchema);

export type IncidentsListResponse = z.infer<typeof IncidentsListResponseSchema>;

const IncidentsGetInputSchema = z.object({
	id: z.string().min(1).describe('The incident id, as a string.'),
});

export type IncidentsGetInput = z.infer<typeof IncidentsGetInputSchema>;

/** One incident with its `rootCause`: the failing URL, status and headers. */
const IncidentsGetResponseSchema = IncidentSummarySchema.extend({
	rootCause: z
		.object({
			url: z.string().nullish(),
			httpResponseCode: z.number().nullish(),
			responseDownloadUrl: z.string().nullish(),
			requestHeaders: z.record(z.string(), z.string()).nullish(),
			responseHeaders: z.record(z.string(), z.string()).nullish(),
		})
		.loose()
		.nullish(),
}).loose();

export type IncidentsGetResponse = z.infer<typeof IncidentsGetResponseSchema>;

const IncidentCommentsInputSchema = z.object({
	id: z.string().min(1),
	...PagingSchema,
});

export type IncidentCommentsInput = z.infer<typeof IncidentCommentsInputSchema>;

const IncidentCommentSchema = z
	.object({
		id: z.number().nullish(),
		comment: z.string().nullish(),
		publishOnStatusPage: z.boolean().nullish(),
		created: z.string().nullish(),
		user: z
			.object({
				id: z.number().nullish(),
				fullName: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type UptimeRobotIncidentComment = z.infer<typeof IncidentCommentSchema>;

const IncidentCommentsResponseSchema = paginated(IncidentCommentSchema);

export type IncidentCommentsResponse = z.infer<
	typeof IncidentCommentsResponseSchema
>;

const IncidentsAddCommentInputSchema = z.object({
	id: z.string().min(1),
	content: z.string().min(1).max(10_000),
	publishOnStatusPage: z
		.boolean()
		.optional()
		.describe('Also show the comment on the status pages. Defaults to false.'),
});

export type IncidentsAddCommentInput = z.infer<
	typeof IncidentsAddCommentInputSchema
>;

const IncidentsAddCommentResponseSchema = IncidentCommentSchema;

export type IncidentsAddCommentResponse = z.infer<
	typeof IncidentsAddCommentResponseSchema
>;

// ── status pages ──────────────────────────────────────────────────────────

const StatusPagesListInputSchema = z.object({ ...PagingSchema });

export type StatusPagesListInput = z.infer<typeof StatusPagesListInputSchema>;

const StatusPageSchema = z
	.object({
		id: z.number().nullish(),
		friendlyName: z.string().nullish(),
		customDomain: z.string().nullish(),
		urlKey: z.string().nullish(),
		isPasswordSet: z.boolean().nullish(),
		monitorIds: z.array(z.number()).nullish(),
		tagIds: z.array(z.number()).nullish(),
		monitorsCount: z.number().nullish(),
		pinnedAnnouncementId: z.number().nullish(),
		status: z.object({ code: z.string().nullish() }).loose().nullish(),
	})
	.loose();

export type UptimeRobotStatusPage = z.infer<typeof StatusPageSchema>;

const StatusPagesListResponseSchema = paginated(StatusPageSchema);

export type StatusPagesListResponse = z.infer<
	typeof StatusPagesListResponseSchema
>;

const StatusPagesGetInputSchema = z.object({ id: z.number().int().positive() });

export type StatusPagesGetInput = z.infer<typeof StatusPagesGetInputSchema>;

const StatusPagesGetResponseSchema = StatusPageSchema;

export type StatusPagesGetResponse = z.infer<
	typeof StatusPagesGetResponseSchema
>;

const StatusPagesCreateInputSchema = z.object({
	friendlyName: z.string().min(1).max(255),
	monitorIds: z
		.array(z.number().int().min(0))
		.optional()
		.describe(
			'The monitors to show. `[0]` alone means every monitor in the account; an empty array shows none.',
		),
	tagIds: z
		.array(z.number().int().min(1))
		.min(1)
		.optional()
		.describe('Show every monitor carrying one of these tags.'),
	autoAddMonitors: z
		.boolean()
		.optional()
		.describe(
			'Also show monitors created later. An explicit monitorIds wins over this, including an empty one.',
		),
	customDomain: z.string().max(255).optional(),
	password: z
		.string()
		.max(255)
		.optional()
		.describe('Visitors must enter this to see the page.'),
	hideUrlLinks: z.boolean().optional(),
	noIndex: z.boolean().optional(),
	sort: z
		.enum([
			'FriendlyNameAsc',
			'FriendlyNameDesc',
			'StatusUpDownPaused',
			'StatusDownUpPaused',
		])
		.optional(),
});

export type StatusPagesCreateInput = z.infer<
	typeof StatusPagesCreateInputSchema
>;

const StatusPagesCreateResponseSchema = StatusPageSchema;

export type StatusPagesCreateResponse = z.infer<
	typeof StatusPagesCreateResponseSchema
>;

const StatusPagesDeleteInputSchema = z.object({
	id: z.number().int().positive(),
});

export type StatusPagesDeleteInput = z.infer<
	typeof StatusPagesDeleteInputSchema
>;

const StatusPagesDeleteResponseSchema = z.object({
	id: z.number(),
	deleted: z.literal(true),
});

export type StatusPagesDeleteResponse = z.infer<
	typeof StatusPagesDeleteResponseSchema
>;

const StatusPagesAnnouncementsInputSchema = z.object({
	pspId: z.number().int().positive(),
	...PagingSchema,
	status: z
		.enum(['OFFLINE', 'PENDING', 'PUBLISHED', 'ARCHIVED'])
		.optional()
		.describe(
			'OFFLINE is a draft, PENDING is scheduled, PUBLISHED is live, ARCHIVED is history.',
		),
});

export type StatusPagesAnnouncementsInput = z.infer<
	typeof StatusPagesAnnouncementsInputSchema
>;

const AnnouncementSchema = z
	.object({
		id: z.number().nullish(),
		pspId: z.number().nullish(),
		title: z.string().nullish(),
		content: z.string().nullish(),
		status: z.string().nullish(),
		type: z.string().nullish(),
		deliveryStatus: z.string().nullish().describe('CantSend, InQueue or Sent.'),
		startDate: z.string().nullish(),
		endDate: z.string().nullish(),
		creationDate: z.string().nullish(),
		submitDate: z.string().nullish(),
		sentCount: z.number().nullish(),
	})
	.loose();

export type UptimeRobotAnnouncement = z.infer<typeof AnnouncementSchema>;

const StatusPagesAnnouncementsResponseSchema = paginated(AnnouncementSchema);

export type StatusPagesAnnouncementsResponse = z.infer<
	typeof StatusPagesAnnouncementsResponseSchema
>;

const StatusPagesCreateAnnouncementInputSchema = z.object({
	pspId: z.number().int().positive(),
	title: z.string().min(1).max(255),
	content: z.string().min(1).max(2000),
	status: z
		.enum(['Offline', 'Pending', 'Published', 'Archived'])
		.describe(
			'Offline is a draft, Pending is scheduled, Published is visible now, Archived is history.',
		),
	type: z.enum(['Info', 'Maintenance', 'Issue']),
	startDate: z
		.string()
		.optional()
		.describe(
			'ISO 8601. Omit it on a Published announcement to publish immediately.',
		),
	endDate: z.string().optional().describe('ISO 8601, after startDate.'),
});

export type StatusPagesCreateAnnouncementInput = z.infer<
	typeof StatusPagesCreateAnnouncementInputSchema
>;

const StatusPagesCreateAnnouncementResponseSchema = AnnouncementSchema;

export type StatusPagesCreateAnnouncementResponse = z.infer<
	typeof StatusPagesCreateAnnouncementResponseSchema
>;

// ── maintenance windows ───────────────────────────────────────────────────

const MaintenanceWindowsListInputSchema = z.object({ ...PagingSchema });

export type MaintenanceWindowsListInput = z.infer<
	typeof MaintenanceWindowsListInputSchema
>;

/** `interval` decides which other fields apply; see `maintenanceWindows.create`. */
const MaintenanceWindowSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		// once, daily, weekly or monthly; a string so a new value cannot fail the read.
		interval: z.string().nullish(),
		date: z.string().nullish(),
		time: z.string().nullish(),
		duration: z.number().nullish(),
		days: z.array(z.number()).nullish(),
		monitorIds: z.array(z.number()).nullish(),
		autoAddMonitors: z.boolean().nullish(),
		// active or paused; a string for the same reason.
		status: z.string().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type UptimeRobotMaintenanceWindow = z.infer<
	typeof MaintenanceWindowSchema
>;

const MaintenanceWindowsListResponseSchema = paginated(MaintenanceWindowSchema);

export type MaintenanceWindowsListResponse = z.infer<
	typeof MaintenanceWindowsListResponseSchema
>;

const MaintenanceWindowFields = {
	name: z.string().min(1).max(255),
	interval: z
		.enum(['once', 'daily', 'weekly', 'monthly'])
		.describe('weekly and monthly also take `days`.'),
	date: z
		.string()
		.describe(
			'YYYY-MM-DD. Required on create; the window starts repeating from it.',
		),
	time: z
		.string()
		.regex(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'HH:mm:ss')
		.describe('HH:mm:ss.'),
	duration: z.number().int().min(1).describe('Minutes the window lasts.'),
	days: z
		.array(z.number().int())
		.optional()
		.describe(
			'Weekly: 1 to 7. Monthly: days of the month, or -1 for the last day.',
		),
	monitorIds: z.array(z.number().int()).optional(),
	autoAddMonitors: z
		.boolean()
		.optional()
		.describe('Also cover monitors created later.'),
};

const MaintenanceWindowsCreateInputSchema = z.object(MaintenanceWindowFields);

export type MaintenanceWindowsCreateInput = z.infer<
	typeof MaintenanceWindowsCreateInputSchema
>;

const MaintenanceWindowsCreateResponseSchema = MaintenanceWindowSchema;

export type MaintenanceWindowsCreateResponse = z.infer<
	typeof MaintenanceWindowsCreateResponseSchema
>;

const MaintenanceWindowsUpdateInputSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(1).max(255).optional(),
	interval: z.enum(['once', 'daily', 'weekly', 'monthly']).optional(),
	date: z.string().optional(),
	time: z
		.string()
		.regex(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'HH:mm:ss')
		.optional(),
	duration: z.number().int().min(1).optional(),
	days: z.array(z.number().int()).optional(),
	monitorIds: z.array(z.number().int()).optional(),
	status: z
		.enum(['active', 'paused'])
		.optional()
		.describe(
			'paused stops the window suppressing alerts; active restores it.',
		),
});

export type MaintenanceWindowsUpdateInput = z.infer<
	typeof MaintenanceWindowsUpdateInputSchema
>;

const MaintenanceWindowsUpdateResponseSchema = MaintenanceWindowSchema;

export type MaintenanceWindowsUpdateResponse = z.infer<
	typeof MaintenanceWindowsUpdateResponseSchema
>;

const MaintenanceWindowsDeleteInputSchema = z.object({
	id: z.number().int().positive(),
});

export type MaintenanceWindowsDeleteInput = z.infer<
	typeof MaintenanceWindowsDeleteInputSchema
>;

const MaintenanceWindowsDeleteResponseSchema = z.object({
	id: z.number(),
	deleted: z.literal(true),
});

export type MaintenanceWindowsDeleteResponse = z.infer<
	typeof MaintenanceWindowsDeleteResponseSchema
>;

// ── monitor groups ────────────────────────────────────────────────────────

const MonitorGroupsListInputSchema = z.object({ ...PagingSchema });

export type MonitorGroupsListInput = z.infer<
	typeof MonitorGroupsListInputSchema
>;

const MonitorGroupSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

export type UptimeRobotMonitorGroup = z.infer<typeof MonitorGroupSchema>;

const MonitorGroupsListResponseSchema = paginated(MonitorGroupSchema);

export type MonitorGroupsListResponse = z.infer<
	typeof MonitorGroupsListResponseSchema
>;

const MonitorGroupsCreateInputSchema = z.object({
	name: z.string().min(1).max(255),
	monitorIds: z
		.array(z.number().int().min(1))
		.min(1)
		.optional()
		.describe('Monitors to put in the new group.'),
	groupIds: z
		.array(z.number().int().min(0))
		.min(1)
		.optional()
		.describe('Move every monitor of these groups into the new one.'),
});

export type MonitorGroupsCreateInput = z.infer<
	typeof MonitorGroupsCreateInputSchema
>;

const MonitorGroupsCreateResponseSchema = MonitorGroupSchema;

export type MonitorGroupsCreateResponse = z.infer<
	typeof MonitorGroupsCreateResponseSchema
>;

const MonitorGroupsDeleteInputSchema = z.object({
	id: z.number().int().positive(),
});

export type MonitorGroupsDeleteInput = z.infer<
	typeof MonitorGroupsDeleteInputSchema
>;

/**
 * Deleting a group leaves its monitors in place and ungrouped — the endpoint
 * answers 204, so the plugin states what it did.
 */
const MonitorGroupsDeleteResponseSchema = z.object({
	id: z.number(),
	deleted: z.literal(true),
});

export type MonitorGroupsDeleteResponse = z.infer<
	typeof MonitorGroupsDeleteResponseSchema
>;

// ── tags ──────────────────────────────────────────────────────────────────

/**
 * Tags page by a numeric `nextCursorId`, not by the `nextLink` every other list
 * returns, so the cursor here is a number and comes from that field.
 */
const TagsListInputSchema = z.object({
	limit: PagingSchema.limit,
	cursor: z
		.number()
		.optional()
		.describe(
			"Where to resume. Take it from the previous page's `nextCursorId`.",
		),
});

export type TagsListInput = z.infer<typeof TagsListInputSchema>;

const TagSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
	})
	.loose();

export type UptimeRobotTag = z.infer<typeof TagSchema>;

/** Tags page by `nextCursorId` rather than by a link. */
const TagsListResponseSchema = z
	.object({
		data: z.array(TagSchema).nullish(),
		nextCursorId: z.number().nullish(),
	})
	.loose();

export type TagsListResponse = z.infer<typeof TagsListResponseSchema>;

const TagsDeleteInputSchema = z.object({ id: z.number().int().positive() });

export type TagsDeleteInput = z.infer<typeof TagsDeleteInputSchema>;

const TagsDeleteResponseSchema = z.object({
	id: z.number(),
	deleted: z.literal(true),
});

export type TagsDeleteResponse = z.infer<typeof TagsDeleteResponseSchema>;

// ── account ───────────────────────────────────────────────────────────────

const AccountMeInputSchema = z.object({});

export type AccountMeInput = z.infer<typeof AccountMeInputSchema>;

const AccountMeResponseSchema = z
	.object({
		email: z.string().nullish(),
		fullName: z.string().nullish(),
		monitorsCount: z.number().nullish(),
		monitorLimit: z.number().nullish(),
		dependencyMonitorsCount: z.number().nullish(),
		dependencyMonitorLimit: z.number().nullish(),
		smsCredits: z.number().nullish(),
		activeSubscription: z
			.object({
				plan: z
					.string()
					.nullish()
					.describe(
						'A display label, not a stable identifier, so do not branch on it.',
					),
				monitorLimit: z.number().nullish(),
				expirationDate: z.string().nullish(),
				status: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type AccountMeResponse = z.infer<typeof AccountMeResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type UptimeRobotEndpointInputs = {
	monitorsList: MonitorsListInput;
	monitorsGet: MonitorsGetInput;
	monitorsCreate: MonitorsCreateInput;
	monitorsUpdate: MonitorsUpdateInput;
	monitorsDelete: MonitorsDeleteInput;
	monitorsPause: MonitorActionInput;
	monitorsStart: MonitorActionInput;
	monitorsReset: MonitorsResetInput;
	statsUptime: StatsUptimeInput;
	statsMonitorUptime: StatsMonitorUptimeInput;
	statsResponseTime: StatsResponseTimeInput;
	incidentsList: IncidentsListInput;
	incidentsGet: IncidentsGetInput;
	incidentsComments: IncidentCommentsInput;
	incidentsAddComment: IncidentsAddCommentInput;
	statusPagesList: StatusPagesListInput;
	statusPagesGet: StatusPagesGetInput;
	statusPagesCreate: StatusPagesCreateInput;
	statusPagesDelete: StatusPagesDeleteInput;
	statusPagesAnnouncements: StatusPagesAnnouncementsInput;
	statusPagesCreateAnnouncement: StatusPagesCreateAnnouncementInput;
	maintenanceWindowsList: MaintenanceWindowsListInput;
	maintenanceWindowsCreate: MaintenanceWindowsCreateInput;
	maintenanceWindowsUpdate: MaintenanceWindowsUpdateInput;
	maintenanceWindowsDelete: MaintenanceWindowsDeleteInput;
	monitorGroupsList: MonitorGroupsListInput;
	monitorGroupsCreate: MonitorGroupsCreateInput;
	monitorGroupsDelete: MonitorGroupsDeleteInput;
	tagsList: TagsListInput;
	tagsDelete: TagsDeleteInput;
	accountMe: AccountMeInput;
};

export type UptimeRobotEndpointOutputs = {
	monitorsList: MonitorsListResponse;
	monitorsGet: MonitorsGetResponse;
	monitorsCreate: MonitorsCreateResponse;
	monitorsUpdate: MonitorsUpdateResponse;
	monitorsDelete: MonitorsDeleteResponse;
	monitorsPause: MonitorActionResponse;
	monitorsStart: MonitorActionResponse;
	monitorsReset: MonitorsResetResponse;
	statsUptime: StatsUptimeResponse;
	statsMonitorUptime: StatsMonitorUptimeResponse;
	statsResponseTime: StatsResponseTimeResponse;
	incidentsList: IncidentsListResponse;
	incidentsGet: IncidentsGetResponse;
	incidentsComments: IncidentCommentsResponse;
	incidentsAddComment: IncidentsAddCommentResponse;
	statusPagesList: StatusPagesListResponse;
	statusPagesGet: StatusPagesGetResponse;
	statusPagesCreate: StatusPagesCreateResponse;
	statusPagesDelete: StatusPagesDeleteResponse;
	statusPagesAnnouncements: StatusPagesAnnouncementsResponse;
	statusPagesCreateAnnouncement: StatusPagesCreateAnnouncementResponse;
	maintenanceWindowsList: MaintenanceWindowsListResponse;
	maintenanceWindowsCreate: MaintenanceWindowsCreateResponse;
	maintenanceWindowsUpdate: MaintenanceWindowsUpdateResponse;
	maintenanceWindowsDelete: MaintenanceWindowsDeleteResponse;
	monitorGroupsList: MonitorGroupsListResponse;
	monitorGroupsCreate: MonitorGroupsCreateResponse;
	monitorGroupsDelete: MonitorGroupsDeleteResponse;
	tagsList: TagsListResponse;
	tagsDelete: TagsDeleteResponse;
	accountMe: AccountMeResponse;
};

export const UptimeRobotEndpointInputSchemas = {
	monitorsList: MonitorsListInputSchema,
	monitorsGet: MonitorsGetInputSchema,
	monitorsCreate: MonitorsCreateInputSchema,
	monitorsUpdate: MonitorsUpdateInputSchema,
	monitorsDelete: MonitorsDeleteInputSchema,
	monitorsPause: MonitorActionInputSchema,
	monitorsStart: MonitorActionInputSchema,
	monitorsReset: MonitorsResetInputSchema,
	statsUptime: StatsUptimeInputSchema,
	statsMonitorUptime: StatsMonitorUptimeInputSchema,
	statsResponseTime: StatsResponseTimeInputSchema,
	incidentsList: IncidentsListInputSchema,
	incidentsGet: IncidentsGetInputSchema,
	incidentsComments: IncidentCommentsInputSchema,
	incidentsAddComment: IncidentsAddCommentInputSchema,
	statusPagesList: StatusPagesListInputSchema,
	statusPagesGet: StatusPagesGetInputSchema,
	statusPagesCreate: StatusPagesCreateInputSchema,
	statusPagesDelete: StatusPagesDeleteInputSchema,
	statusPagesAnnouncements: StatusPagesAnnouncementsInputSchema,
	statusPagesCreateAnnouncement: StatusPagesCreateAnnouncementInputSchema,
	maintenanceWindowsList: MaintenanceWindowsListInputSchema,
	maintenanceWindowsCreate: MaintenanceWindowsCreateInputSchema,
	maintenanceWindowsUpdate: MaintenanceWindowsUpdateInputSchema,
	maintenanceWindowsDelete: MaintenanceWindowsDeleteInputSchema,
	monitorGroupsList: MonitorGroupsListInputSchema,
	monitorGroupsCreate: MonitorGroupsCreateInputSchema,
	monitorGroupsDelete: MonitorGroupsDeleteInputSchema,
	tagsList: TagsListInputSchema,
	tagsDelete: TagsDeleteInputSchema,
	accountMe: AccountMeInputSchema,
} as const;

export const UptimeRobotEndpointOutputSchemas = {
	monitorsList: MonitorsListResponseSchema,
	monitorsGet: MonitorsGetResponseSchema,
	monitorsCreate: MonitorsCreateResponseSchema,
	monitorsUpdate: MonitorsUpdateResponseSchema,
	monitorsDelete: MonitorsDeleteResponseSchema,
	monitorsPause: MonitorActionResponseSchema,
	monitorsStart: MonitorActionResponseSchema,
	monitorsReset: MonitorsResetResponseSchema,
	statsUptime: StatsUptimeResponseSchema,
	statsMonitorUptime: StatsMonitorUptimeResponseSchema,
	statsResponseTime: StatsResponseTimeResponseSchema,
	incidentsList: IncidentsListResponseSchema,
	incidentsGet: IncidentsGetResponseSchema,
	incidentsComments: IncidentCommentsResponseSchema,
	incidentsAddComment: IncidentsAddCommentResponseSchema,
	statusPagesList: StatusPagesListResponseSchema,
	statusPagesGet: StatusPagesGetResponseSchema,
	statusPagesCreate: StatusPagesCreateResponseSchema,
	statusPagesDelete: StatusPagesDeleteResponseSchema,
	statusPagesAnnouncements: StatusPagesAnnouncementsResponseSchema,
	statusPagesCreateAnnouncement: StatusPagesCreateAnnouncementResponseSchema,
	maintenanceWindowsList: MaintenanceWindowsListResponseSchema,
	maintenanceWindowsCreate: MaintenanceWindowsCreateResponseSchema,
	maintenanceWindowsUpdate: MaintenanceWindowsUpdateResponseSchema,
	maintenanceWindowsDelete: MaintenanceWindowsDeleteResponseSchema,
	monitorGroupsList: MonitorGroupsListResponseSchema,
	monitorGroupsCreate: MonitorGroupsCreateResponseSchema,
	monitorGroupsDelete: MonitorGroupsDeleteResponseSchema,
	tagsList: TagsListResponseSchema,
	tagsDelete: TagsDeleteResponseSchema,
	accountMe: AccountMeResponseSchema,
} as const;
