import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

/** A check as the list endpoint answers (summary shape). */
export const CheckSummarySchema = z
	.object({
		id: z.number().nullish().describe('Check id'),
		name: z.string().nullish().describe('Check name'),
		// unknown: a string on lists, an object keyed by check type on reads.
		type: z.unknown().nullish().describe('Check type, e.g. http'),
		hostname: z.string().nullish().describe('Target host'),
		lasterrortime: z
			.number()
			.nullish()
			.describe('UNIX timestamp of the last error, if any'),
		lasttesttime: z
			.number()
			.nullish()
			.describe('UNIX timestamp of the last test, if any'),
		lastresponsetime: z
			.number()
			.nullish()
			.describe('Response time in ms of the last test'),
		lastdownstart: z
			.number()
			.nullish()
			.describe('UNIX timestamp when the check last went down'),
		lastdownend: z
			.number()
			.nullish()
			.describe('UNIX timestamp when the check last recovered'),
		created: z.number().nullish().describe('UNIX timestamp of creation'),
		// unknown: the API answers a boolean, older checks have sent 0/1.
		paused: z.unknown().nullish().describe('Pause state'),
		resolution: z.number().nullish().describe('Test interval in minutes'),
		status: z.string().nullish().describe('up, down, paused or unconfirmed'),
		// unknown: tag objects ({ name, type, count }) only arrive with include_tags.
		tags: z.unknown().nullish().describe('Tags, when include_tags is set'),
	})
	.loose()
	.describe('A Pingdom check');
export type CheckSummary = z.infer<typeof CheckSummarySchema>;

/** A check with its full type-specific settings. */
export const CheckDetailSchema = z
	.object({
		id: z.number().nullish().describe('Check id'),
		name: z.string().nullish().describe('Check name'),
		hostname: z.string().nullish().describe('Target host'),
		type: z
			// unknown: the type block is keyed by the check type (http, ping,
			// dns, …) and carries that type's settings.
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Type-specific settings keyed by the check type'),
		created: z.number().nullish().describe('UNIX timestamp of creation'),
		// unknown: the API answers a boolean, older checks have sent 0/1.
		paused: z.unknown().nullish().describe('Pause state'),
		resolution: z.number().nullish().describe('Test interval in minutes'),
		send_notification_when_down: z
			.number()
			.nullish()
			.describe('Alerts after N failures'),
		notify_again_every: z
			.number()
			.nullish()
			.describe('Re-notification interval'),
		notify_when_backup: z.boolean().nullish().describe('Alert on recovery'),
		userids: z.array(z.number()).nullish().describe('Assigned user ids'),
		teamids: z.array(z.number()).nullish().describe('Assigned team ids'),
		integrationids: z
			.array(z.number())
			.nullish()
			.describe('Assigned integration ids'),
		// unknown: tag objects ({ name, type, count }) only arrive with include_tags.
		tags: z.unknown().nullish().describe('Tags'),
		probe_filters: z
			// unknown: probe filters are provider-defined region objects.
			.array(z.unknown())
			.nullish()
			.describe('Probe region filters'),
		ipv6: z.boolean().nullish().describe('Whether the check uses IPv6'),
		status: z.string().nullish().describe('up, down, paused or unconfirmed'),
		lasterrortime: z
			.number()
			.nullish()
			.describe('UNIX timestamp of last error'),
		lasttesttime: z.number().nullish().describe('UNIX timestamp of last test'),
		lastresponsetime: z.number().nullish().describe('Last response time in ms'),
	})
	.loose()
	.describe('A Pingdom check with its settings');
export type CheckDetail = z.infer<typeof CheckDetailSchema>;

/** Fields shared by checks.create and checks.update. */
const checkCommonFields = {
	paused: z.boolean().optional().describe('Create or leave the check paused'),
	resolution: z
		.enum(['1', '5', '15', '30', '60'])
		.optional()
		.transform((v) => (v === undefined ? undefined : Number(v)))
		.describe('Test interval in minutes (1, 5, 15, 30 or 60)'),
	userIds: z.array(z.number().int()).optional().describe('User ids to alert'),
	teamIds: z.array(z.number().int()).optional().describe('Team ids to alert'),
	integrationIds: z
		.array(z.number().int())
		.optional()
		.describe('Integration ids to alert'),
	sendNotificationWhenDown: z
		.number()
		.int()
		.optional()
		.describe('Alert after this many consecutive failures'),
	notifyAgainEvery: z
		.number()
		.int()
		.optional()
		.describe('Re-notify every N failures'),
	notifyWhenBackup: z
		.boolean()
		.optional()
		.describe('Send an alert when the check recovers'),
	tags: z.string().optional().describe('Comma-separated tags for filtering'),
	probeFilters: z
		// unknown: provider-defined entries the reference does not type.
		.array(z.record(z.string(), z.unknown()))
		.optional()
		.describe(
			'Probe region filters, e.g. [{"region":"EU"}] or [{"region":"NA"}]',
		),
	ipv6: z.boolean().optional().describe('Test over IPv6'),
	responseTimeThreshold: z
		.number()
		.int()
		.optional()
		.describe('Response time threshold in ms'),
	customMessage: z.string().optional().describe('Custom alert message'),
};

type CheckCommon = {
	paused?: boolean;
	resolution?: number;
	userIds?: number[];
	teamIds?: number[];
	integrationIds?: number[];
	sendNotificationWhenDown?: number;
	notifyAgainEvery?: number;
	notifyWhenBackup?: boolean;
	tags?: string;
	// unknown: probe filters are provider-defined region objects.
	probeFilters?: Record<string, unknown>[];
	ipv6?: boolean;
	responseTimeThreshold?: number;
	customMessage?: string;
};

// unknown: flat body fields whose names depend on the check type.
type CheckTypeSettings = Record<string, unknown>;

/** An action (alert) entry. */
export const ActionSchema = z
	.object({
		username: z.string().nullish().describe('Name of the alerted user'),
		userid: z.number().nullish().describe('Id of the alerted user'),
		checkid: z.number().nullish().describe('Id of the alerted check'),
		checkname: z.string().nullish().describe('Name of the alerted check'),
		time: z.number().nullish().describe('UNIX time of alert generation'),
		via: z
			.string()
			.nullish()
			.describe('Alert medium, e.g. email, sms, twitter, apns, agcm'),
	})
	.loose()
	.describe('A Pingdom alert action');
export type Action = z.infer<typeof ActionSchema>;

/** A probe server. */
export const ProbeSchema = z
	.object({
		id: z.number().nullish().describe('Probe id'),
		country: z.string().nullish().describe('Country'),
		city: z.string().nullish().describe('City'),
		name: z.string().nullish().describe('Display name'),
		active: z.boolean().nullish().describe('Whether the probe is active'),
		hostname: z.string().nullish().describe('DNS name'),
		ip: z.string().nullish().describe('IPv4 address'),
		ipv6: z.string().nullish().describe('IPv6 address'),
		region: z.string().nullish().describe('Probe region, e.g. EU'),
	})
	.loose()
	.describe('A Pingdom probe server');
export type Probe = z.infer<typeof ProbeSchema>;

/** A maintenance window. */
export const MaintenanceSchema = z
	.object({
		id: z.number().nullish().describe('Window id'),
		description: z.string().nullish().describe('Description'),
		from: z.number().nullish().describe('Start, UNIX time'),
		to: z.number().nullish().describe('End, UNIX time'),
		recurrence: z
			.string()
			.nullish()
			.describe('Recurrence, e.g. weekly, or none'),
		recurring: z.boolean().nullish().describe('Whether the window recurs'),
		effective_to: z
			.number()
			.nullish()
			.describe('When the recurrence stops, UNIX time'),
		checks: z.array(z.number()).nullish().describe('Check ids covered'),
		teams: z.array(z.number()).nullish().describe('Team ids covered'),
		contacts: z.array(z.number()).nullish().describe('Contact ids covered'),
	})
	.loose()
	.describe('A maintenance window');
export type Maintenance = z.infer<typeof MaintenanceSchema>;

/** A team with its members. */
export const TeamSchema = z
	.object({
		id: z.number().nullish().describe('Team id'),
		name: z.string().nullish().describe('Team name'),
		members: z
			.array(
				z
					.object({
						id: z.number().nullish().describe('Contact id'),
						name: z.string().nullish().describe('Member name'),
					})
					.loose(),
			)
			.nullish()
			.describe('Team members'),
	})
	.loose()
	.describe('An alerting team');
export type Team = z.infer<typeof TeamSchema>;

/** A notification target on a contact. */
export const NotificationTargetSchema = z
	.object({
		severity: z
			.string()
			.nullish()
			.describe('Severity level this target covers'),
		country_code: z.string().nullish().describe('Country code (phone targets)'),
		number: z.string().nullish().describe('Phone number'),
		email: z.string().nullish().describe('Email address'),
	})
	.loose()
	.describe('A contact notification target');
export type NotificationTarget = z.infer<typeof NotificationTargetSchema>;

/** A contact with its notification targets. */
export const ContactSchema = z
	.object({
		id: z.number().nullish().describe('Contact id'),
		name: z.string().nullish().describe('Contact name'),
		paused: z.boolean().nullish().describe('Whether alerts are paused'),
		type: z.string().nullish().describe('contact, team_member or admin'),
		notification_targets: z
			.array(NotificationTargetSchema)
			.nullish()
			.describe('Notification targets'),
	})
	.loose()
	.describe('An alerting contact');
export type Contact = z.infer<typeof ContactSchema>;

/** A raw test result. */
export const ResultSchema = z
	.object({
		probeid: z.number().nullish().describe('Probe id'),
		time: z.number().nullish().describe('UNIX time of the test'),
		// Open string: a status Pingdom adds later must not fail the read.
		status: z
			.string()
			.nullish()
			.describe('Result status: up, down, unconfirmed or unknown'),
		responsetime: z.number().nullish().describe('Response time in ms'),
		probedesc: z.string().nullish().describe('Probe description'),
		probeip: z.string().nullish().describe('Probe IP'),
		version: z.string().nullish().describe('Engine version'),
		activelytested: z.boolean().nullish().describe('Whether actively tested'),
		checkid: z.number().nullish().describe('Check id'),
		checkname: z.string().nullish().describe('Check name'),
		hostname: z.string().nullish().describe('Target host'),
	})
	.loose()
	.describe('A raw test result');
export type Result = z.infer<typeof ResultSchema>;

/** Shared from/to UNIX-second filter parameters. */
const timeRange = {
	from: z.number().int().optional().describe('Start of the period, UNIX time'),
	to: z.number().int().optional().describe('End of the period, UNIX time'),
};

const probesParam = z
	.string()
	.optional()
	.describe('Comma-separated probe ids to filter on');

const EmptyInputSchema = z.object({}).describe('No input parameters');
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

// ── checks ─────────────────────────────────────────────────────────────────

export const ChecksListInputSchema = z
	.object({
		limit: z.number().int().optional().describe('Maximum checks returned'),
		offset: z.number().int().optional().describe('Offset for pagination'),
		showEncryption: z
			.boolean()
			.optional()
			.describe('Include encryption state for http checks'),
		includeTags: z.boolean().optional().describe('Include tags'),
		includeSeverity: z
			.boolean()
			.optional()
			.describe('Include severity of the latest error'),
		tags: z.string().optional().describe('Comma-separated tag filter'),
	})
	.describe('Query parameters for listing checks');
export type ChecksListInput = z.infer<typeof ChecksListInputSchema>;

export const ChecksListOutputSchema = z
	.object({ checks: z.array(CheckSummarySchema) })
	.loose()
	.describe('The account checks');

export const CheckIdInputSchema = z
	.object({ checkId: z.number().int().describe('The check id') })
	.describe('Input with a check id');
export type CheckIdInput = z.infer<typeof CheckIdInputSchema>;

export const CheckOutputSchema = z
	.object({ check: CheckDetailSchema })
	.loose()
	.describe('The check');

export const ChecksCreateInputSchema = z
	.object({
		name: z.string().min(1).describe('Check name'),
		host: z.string().min(1).describe('Target host'),
		type: z
			.enum([
				'http',
				'httpcustom',
				'tcp',
				'ping',
				'dns',
				'udp',
				'smtp',
				'pop3',
				'imap',
			])
			.describe('Type of check'),
		typeSettings: z
			// unknown: provider-defined entries the reference does not type.
			.record(z.string(), z.unknown())
			.optional()
			.describe(
				'Type-specific settings as flat body fields, per the check type docs: http takes url/encryption/port/shouldcontain/shouldnotcontain/postdata/requestheaders/verify_certificate/ssl_down_days_before; tcp takes port/encryption/stringtoexpect; dns takes nameserver/expectedip; udp/smtp/pop3/imap take port/stringtoexpect',
			),
		...checkCommonFields,
	})
	.describe('Input for creating a check');
export type ChecksCreateInput = z.infer<typeof ChecksCreateInputSchema>;

export const CheckCreatedOutputSchema = z
	.object({
		check: z
			.object({
				id: z.number().nullish().describe('Created check id'),
				name: z.string().nullish().describe('Created check name'),
			})
			.loose(),
	})
	.loose()
	.describe('The created check reference');

export const ChecksUpdateInputSchema = z
	.object({
		checkId: z.number().int().describe('The check id'),
		name: z.string().optional().describe('New check name'),
		host: z.string().optional().describe('New target host'),
		type: z
			.enum([
				'http',
				'httpcustom',
				'tcp',
				'ping',
				'dns',
				'udp',
				'smtp',
				'pop3',
				'imap',
			])
			.optional()
			.describe('New type of check'),
		typeSettings: z
			// unknown: provider-defined entries the reference does not type.
			.record(z.string(), z.unknown())
			.optional()
			.describe('Type-specific settings as flat body fields'),
		...checkCommonFields,
	})
	.describe('Input for modifying a check');
export type ChecksUpdateInput = z.infer<typeof ChecksUpdateInputSchema>;

export const CheckModifiedOutputSchema = z
	.object({ message: z.string().nullish().describe('Modification result') })
	.loose()
	.describe('The modification answer');

export const ChecksUpdateMultiInputSchema = z
	.object({
		checkIds: z
			.array(z.number().int().positive())
			.min(1)
			.describe(
				'Checks to modify (sent as checkids); Pingdom changes every check in the account when the list is missing',
			),
		paused: z.boolean().optional().describe('Pause (true) or unpause (false)'),
		resolution: z
			.enum(['1', '5', '15', '30', '60'])
			.optional()
			.transform((v) => (v === undefined ? undefined : Number(v)))
			.describe('New test interval in minutes'),
	})
	.describe('Input for pausing or re-timing multiple checks');
export type ChecksUpdateMultiInput = z.infer<
	typeof ChecksUpdateMultiInputSchema
>;

export const ChecksDeleteMultiInputSchema = z
	.object({
		checkIds: z
			.array(z.number().int())
			.min(1)
			.describe('Ids of the checks to delete'),
	})
	.describe('Input for deleting multiple checks');
export type ChecksDeleteMultiInput = z.infer<
	typeof ChecksDeleteMultiInputSchema
>;

export const ChecksDeletedMultiOutputSchema = z
	.object({ message: z.string().nullish().describe('Deletion result') })
	.loose()
	.describe('The deletion answer');

// ── analysis & results ─────────────────────────────────────────────────────

export const AnalysisListInputSchema = z
	.object({
		checkId: z.number().int().describe('The check id'),
		limit: z.number().int().optional().describe('Maximum analyses returned'),
		offset: z.number().int().optional().describe('Offset for pagination'),
	})
	.describe('Input for listing root cause analyses');
export type AnalysisListInput = z.infer<typeof AnalysisListInputSchema>;

export const AnalysisOutputSchema = z
	.object({
		id: z.number().nullish().describe('Analysis id'),
		time: z.number().nullish().describe('UNIX time of the analysis'),
		// unknown: the root-cause block differs per check type and is undocumented.
		rootcause: z.unknown().nullish().describe('Root cause details'),
	})
	.loose()
	.describe('A root cause analysis');

export const AnalysisListOutputSchema = z
	.object({ analysis: z.array(AnalysisOutputSchema) })
	.loose()
	.describe('The latest analyses');

export const AnalysisGetInputSchema = z
	.object({
		checkId: z.number().int().describe('The check id'),
		analysisId: z.number().int().describe('The analysis id'),
	})
	.describe('Input for reading one analysis');
export type AnalysisGetInput = z.infer<typeof AnalysisGetInputSchema>;

export const AnalysisRawOutputSchema = z
	.object({})
	.loose()
	.describe('The raw analysis result');

export const ResultsListInputSchema = z
	.object({
		checkId: z.number().int().describe('The check id'),
		from: z
			.number()
			.int()
			.optional()
			.describe('Start of the period, UNIX time'),
		to: z.number().int().optional().describe('End of the period, UNIX time'),
		probes: probesParam,
		status: z
			.enum(['up', 'down', 'unconfirmed', 'unknown'])
			.optional()
			.describe('Result status filter'),
		limit: z.number().int().optional().describe('Maximum results returned'),
		offset: z.number().int().optional().describe('Offset for pagination'),
		includeAnalysis: z
			.boolean()
			.optional()
			.describe('Include root cause analysis links'),
		maxResponse: z
			.number()
			.int()
			.optional()
			.describe('Maximum response time filter'),
		minResponse: z
			.number()
			.int()
			.optional()
			.describe('Minimum response time filter'),
	})
	.describe('Input for listing raw test results');
export type ResultsListInput = z.infer<typeof ResultsListInputSchema>;

export const ResultsListOutputSchema = z
	.object({ results: z.array(ResultSchema) })
	.loose()
	.describe('The raw test results');

// ── summaries ──────────────────────────────────────────────────────────────

export const SummaryInputSchema = z
	.object({
		checkId: z.number().int().describe('The check id'),
		from: z
			.number()
			.int()
			.optional()
			.describe('Start of the period, UNIX time'),
		to: z.number().int().optional().describe('End of the period, UNIX time'),
		probes: probesParam,
	})
	.describe('Input for a check summary');
export type SummaryInput = z.infer<typeof SummaryInputSchema>;

export const SummaryAverageInputSchema = z
	.object({
		checkId: z.number().int().describe('The check id'),
		...timeRange,
		probes: probesParam,
		includeUptime: z.boolean().optional().describe('Include uptime'),
		byCountry: z.boolean().optional().describe('Group by country'),
		byProbe: z.boolean().optional().describe('Group by probe'),
	})
	.describe('Input for the average summary');
export type SummaryAverageInput = z.infer<typeof SummaryAverageInputSchema>;

export const SummaryAverageOutputSchema = z
	.object({
		summary: z
			.object({
				responsetime: z
					// unknown: provider-defined entries the reference does not type.
					.unknown()
					.nullish()
					.describe('Average response time block'),
				// unknown: the status block shape differs between summary endpoints.
				status: z.unknown().nullish().describe('Status and uptime block'),
			})
			.loose(),
	})
	.loose()
	.describe('The average time/uptime summary');

export const SummaryHoursOfDayOutputSchema = z
	.object({
		summary: z
			.object({
				hours: z
					// unknown: provider-defined entries the reference does not type.
					.array(z.unknown())
					.nullish()
					.describe('Per-hour response time entries'),
			})
			.loose(),
	})
	.loose()
	.describe('The per-hour response time summary');

export const SummaryOutageOutputSchema = z
	.object({
		summary: z
			.object({
				state: z.string().nullish().describe('Current state'),
				outages: z
					// unknown: provider-defined entries the reference does not type.
					.array(z.unknown())
					.nullish()
					.describe('Status change entries'),
			})
			.loose(),
	})
	.loose()
	.describe('The outage summary');

export const SummaryPerformanceInputSchema = z
	.object({
		checkId: z.number().int().describe('The check id'),
		...timeRange,
		resolution: z
			.enum(['day', 'week', 'month'])
			.optional()
			.describe('Interval resolution'),
		includeUptime: z.boolean().optional().describe('Include uptime'),
		probes: probesParam,
		order: z.enum(['asc', 'desc']).optional().describe('Interval order'),
	})
	.describe('Input for the performance summary');
export type SummaryPerformanceInput = z.infer<
	typeof SummaryPerformanceInputSchema
>;

export const SummaryPerformanceOutputSchema = z
	.object({
		summary: z
			.object({
				weeks: z
					// unknown: provider-defined entries the reference does not type.
					.array(z.unknown())
					.nullish()
					.describe('Weekly intervals, when resolution is week'),
				hours: z
					// unknown: provider-defined entries the reference does not type.
					.array(z.unknown())
					.nullish()
					.describe('Hourly intervals, when resolution is day'),
				days: z
					// unknown: provider-defined entries the reference does not type.
					.array(z.unknown())
					.nullish()
					.describe('Daily intervals, when resolution is month'),
			})
			.loose(),
	})
	.loose()
	.describe('The performance summary');

export const SummaryProbesOutputSchema = z
	.object({
		summary: z
			.object({
				probes: z
					// unknown: provider-defined entries the reference does not type.
					.array(z.unknown())
					.nullish()
					.describe('Per-probe test counts'),
			})
			.loose(),
	})
	.loose()
	.describe('The per-probe summary');

// ── actions, credits, probes, reference, single ────────────────────────────

export const ActionsListInputSchema = z
	.object({
		checkId: z
			.number()
			.int()
			.optional()
			.describe('Only actions for this check'),
		from: z
			.number()
			.int()
			.optional()
			.describe('Start of the period, UNIX time'),
		to: z.number().int().optional().describe('End of the period, UNIX time'),
		limit: z.number().int().optional().describe('Maximum actions returned'),
		offset: z.number().int().optional().describe('Offset for pagination'),
	})
	.describe('Query parameters for listing actions');
export type ActionsListInput = z.infer<typeof ActionsListInputSchema>;

export const ActionsListOutputSchema = z
	.object({
		actions: z
			.object({ alerts: z.array(ActionSchema).describe('Alert entries') })
			.loose(),
	})
	.loose()
	.describe('The alert actions');

export const CreditsOutputSchema = z
	.object({
		credits: z
			.object({
				checklimit: z.number().nullish().describe('Total check slots'),
				availablechecks: z
					.number()
					.nullish()
					.describe('Free check slots available'),
				useddefault: z.number().nullish().describe('Used default slots'),
				usedtransaction: z
					.number()
					.nullish()
					.describe('Used transaction slots'),
				availablesms: z.number().nullish().describe('SMS credits remaining'),
				availablesmstests: z
					.number()
					.nullish()
					.describe('SMS provider test credits remaining'),
			})
			.loose(),
	})
	.loose()
	.describe('The account credits');

export const ProbesListOutputSchema = z
	.object({ probes: z.array(ProbeSchema) })
	.loose()
	.describe('The Pingdom probe servers');

export const ReferenceOutputSchema = z
	.object({})
	.loose()
	.describe('Regions, timezone and date/number format references');

export const SingleRunInputSchema = z
	.object({
		host: z.string().min(1).describe('Target host to test'),
		publicName: z
			.string()
			.optional()
			.describe('Name shown on the public status page'),
		resolution: z
			.enum(['1', '5', '15', '30', '60'])
			.optional()
			.transform((v) => (v === undefined ? undefined : Number(v)))
			.describe('Test interval for the created check in minutes'),
		integrationIds: z
			.array(z.number().int())
			.optional()
			.describe('Integration ids to alert'),
		userIds: z.array(z.number().int()).optional().describe('User ids to alert'),
		teamIds: z.array(z.number().int()).optional().describe('Team ids to alert'),
	})
	.describe('Input for performing a single check');
export type SingleRunInput = z.infer<typeof SingleRunInputSchema>;

export const SingleRunOutputSchema = z
	.object({
		result: z
			.object({
				status: z.string().nullish().describe('up or down'),
				responsetime: z.number().nullish().describe('Response time in ms'),
				statusdesc: z.string().nullish().describe('Short status description'),
				statusdesclong: z
					.string()
					.nullish()
					.describe('Long status description'),
				probeid: z.number().nullish().describe('Probe id'),
				probedesc: z.string().nullish().describe('Probe description'),
			})
			.loose(),
	})
	.loose()
	.describe('The single check result');

// ── maintenance ────────────────────────────────────────────────────────────

export const MaintenanceWindowBodySchema = {
	description: z.string().min(1).describe('Description'),
	from: z
		.number()
		.int()
		.describe('Window start, UNIX time; only future allowed (use 1 for now)'),
	to: z
		.number()
		.int()
		.describe('Window end, UNIX time; only future allowed (use 1 for now)'),
	recurrence: z
		.enum(['none', 'daily', 'weekly', 'monthly'])
		.describe('Recurrence interval'),
	recurring: z
		.enum(['0', '1'])
		.optional()
		.transform((v) => (v === undefined ? undefined : v === '1'))
		.describe('Whether the window recurs (1) or is one-off (0)'),
	effectiveTo: z
		.number()
		.int()
		.optional()
		.describe('When the recurrence stops, UNIX time (0 = never)'),
	checks: z
		.array(z.number().int())
		.optional()
		.describe('Check ids the window covers'),
	teams: z
		.array(z.number().int())
		.optional()
		.describe('Team ids the window covers'),
	contacts: z
		.array(z.number().int())
		.optional()
		.describe('Contact ids the window covers'),
};

type MaintenanceWindowBody = {
	description: string;
	from: number;
	to: number;
	recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
	recurring?: boolean;
	effectiveTo?: number;
	checks?: number[];
	teams?: number[];
	contacts?: number[];
};

// unknown: the body is built from caller fields with mixed types.
function maintenanceBody(w: MaintenanceWindowBody): Record<string, unknown> {
	return {
		description: w.description,
		from: w.from,
		to: w.to,
		recurrence: w.recurrence,
		recurring: w.recurring,
		effective_to: w.effectiveTo,
		checks: w.checks,
		teams: w.teams,
		contacts: w.contacts,
	};
}

export const MaintenanceListInputSchema = z
	.object({
		limit: z.number().int().optional().describe('Maximum windows returned'),
		offset: z.number().int().optional().describe('Offset for pagination'),
		orderBy: z.string().optional().describe('Ordering column'),
		order: z.enum(['asc', 'desc']).optional().describe('Ordering direction'),
	})
	.describe('Query parameters for listing maintenance windows');
export type MaintenanceListInput = z.infer<typeof MaintenanceListInputSchema>;

export const MaintenanceListOutputSchema = z
	.object({ maintenance: z.array(MaintenanceSchema) })
	.loose()
	.describe('The maintenance windows');

export const MaintenanceCreateInputSchema = z
	.object({ ...MaintenanceWindowBodySchema })
	.describe('Input for creating a maintenance window');
export type MaintenanceCreateInput = z.infer<
	typeof MaintenanceCreateInputSchema
>;

export const MaintenanceCreatedOutputSchema = z
	.object({
		maintenance: z
			.object({
				id: z.number().nullish().describe('Id of the new window'),
			})
			.loose(),
	})
	.loose()
	.describe('The created window reference');

export const MaintenanceIdInputSchema = z
	.object({ id: z.number().int().describe('The maintenance window id') })
	.describe('Input with a maintenance window id');
export type MaintenanceIdInput = z.infer<typeof MaintenanceIdInputSchema>;

export const MaintenanceOutputSchema = z
	.object({
		maintenance: MaintenanceSchema.nullish().describe('The window'),
	})
	.loose()
	.describe('The maintenance window');

export const MaintenanceUpdateInputSchema = z
	.object({
		id: z.number().int().describe('The maintenance window id'),
		description: z.string().optional().describe('New description'),
		from: z.number().int().optional().describe('New start, UNIX time'),
		to: z.number().int().optional().describe('New end, UNIX time'),
		recurrence: z
			.enum(['none', 'daily', 'weekly', 'monthly'])
			.optional()
			.describe('New recurrence'),
		recurring: z.boolean().optional().describe('New recurring flag'),
		effectiveTo: z
			.number()
			.int()
			.optional()
			.describe('New recurrence stop, UNIX time'),
		checks: z.array(z.number().int()).optional().describe('New check ids'),
		teams: z.array(z.number().int()).optional().describe('New team ids'),
		contacts: z.array(z.number().int()).optional().describe('New contact ids'),
	})
	.describe('Input for modifying a maintenance window');
export type MaintenanceUpdateInput = z.infer<
	typeof MaintenanceUpdateInputSchema
>;

export const MaintenanceModifiedOutputSchema = z
	.object({ message: z.string().nullish().describe('Modification result') })
	.loose()
	.describe('The modification answer');

export const MaintenanceDeleteMultiInputSchema = z
	.object({
		windowIds: z
			.array(z.number().int())
			.min(1)
			.describe('Ids of the windows to delete'),
	})
	.describe('Input for deleting multiple maintenance windows');
export type MaintenanceDeleteMultiInput = z.infer<
	typeof MaintenanceDeleteMultiInputSchema
>;

// ── maintenance occurrences ────────────────────────────────────────────────

export const OccurrencesListInputSchema = z
	.object({
		maintenanceId: z
			.number()
			.int()
			.optional()
			.describe('Only occurrences of this window'),
		...timeRange,
	})
	.describe('Query parameters for listing maintenance occurrences');
export type OccurrencesListInput = z.infer<typeof OccurrencesListInputSchema>;

export const OccurrenceSchema = z
	.object({
		id: z.number().nullish().describe('Occurrence id'),
		maintenance_id: z.number().nullish().describe('Parent window id'),
		from: z.number().nullish().describe('Start, UNIX time'),
		to: z.number().nullish().describe('End, UNIX time'),
	})
	.loose()
	.describe('A maintenance occurrence');
export type Occurrence = z.infer<typeof OccurrenceSchema>;

export const OccurrencesListOutputSchema = z
	.object({ maintenance_occurrences: z.array(OccurrenceSchema) })
	.loose()
	.describe('The maintenance occurrences');

export const OccurrenceIdInputSchema = z
	.object({ id: z.number().int().describe('The occurrence id') })
	.describe('Input with an occurrence id');
export type OccurrenceIdInput = z.infer<typeof OccurrenceIdInputSchema>;

export const OccurrenceOutputSchema = z
	.object({
		maintenance_occurrence:
			OccurrenceSchema.nullish().describe('The occurrence'),
	})
	.loose()
	.describe('The maintenance occurrence');

export const OccurrenceUpdateInputSchema = z
	.object({
		id: z.number().int().describe('The occurrence id'),
		from: z
			.number()
			.int()
			.optional()
			.describe('New start, UNIX time (only future allowed)'),
		to: z
			.number()
			.int()
			.optional()
			.describe('New end, UNIX time (only future allowed)'),
	})
	.describe('Input for modifying a maintenance occurrence');
export type OccurrenceUpdateInput = z.infer<typeof OccurrenceUpdateInputSchema>;

// ── alerting ───────────────────────────────────────────────────────────────

export const TeamsListOutputSchema = z
	.object({ teams: z.array(TeamSchema) })
	.loose()
	.describe('The alerting teams');

export const TeamsCreateInputSchema = z
	.object({
		name: z.string().min(1).describe('Team name'),
		memberIds: z
			.array(z.number().int())
			.min(1)
			.describe('Contact ids of the team members'),
	})
	.describe('Input for creating a team');
export type TeamsCreateInput = z.infer<typeof TeamsCreateInputSchema>;

export const TeamIdInputSchema = z
	.object({ teamId: z.number().int().describe('The team id') })
	.describe('Input with a team id');
export type TeamIdInput = z.infer<typeof TeamIdInputSchema>;

export const TeamOutputSchema = z
	.object({ team: TeamSchema.nullish().describe('The team') })
	.loose()
	.describe('The team');

export const TeamsUpdateInputSchema = z
	.object({
		teamId: z.number().int().describe('The team id'),
		name: z.string().min(1).describe('Team name'),
		memberIds: z
			.array(z.number().int())
			.min(1)
			.describe('Contact ids of the team members'),
	})
	.describe('Input for modifying a team');
export type TeamsUpdateInput = z.infer<typeof TeamsUpdateInputSchema>;

export const TeamsCreatedOutputSchema = z
	.object({
		team: z
			.object({
				id: z.number().nullish().describe('Id of the created team'),
			})
			.loose(),
	})
	.loose()
	.describe('The created team reference');

export const ContactsListOutputSchema = z
	.object({ contacts: z.array(ContactSchema) })
	.loose()
	.describe('The alerting contacts');

const notificationTargetsSchema = z
	.array(
		z.object({
			severity: z
				.string()
				.optional()
				.describe('Severity level this target covers, e.g. H, M, L'),
			countryCode: z
				.string()
				.optional()
				.describe('Country code for phone targets'),
			number: z.string().optional().describe('Phone number for SMS targets'),
			email: z.string().optional().describe('Email address for email targets'),
		}),
	)
	.min(1);

type NotificationTargets = Array<{
	severity?: string;
	countryCode?: string;
	number?: string;
	email?: string;
}>;

// unknown: the body is built from caller fields with mixed types.
function targetsBody(targets: NotificationTargets): Record<string, unknown>[] {
	return targets.map((t) => ({
		severity: t.severity,
		country_code: t.countryCode,
		number: t.number,
		email: t.email,
	}));
}

export const ContactsCreateInputSchema = z
	.object({
		name: z.string().min(1).describe('Contact name'),
		paused: z.boolean().optional().describe('Create the contact paused'),
		notificationTargets: notificationTargetsSchema.describe(
			'Notification targets; each takes email or number (+countryCode) and an optional severity',
		),
	})
	.describe('Input for creating a contact');
export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;

export const ContactsCreatedOutputSchema = z
	.object({
		contact: z
			.object({
				id: z.number().nullish().describe('Id of the created contact'),
			})
			.loose(),
	})
	.loose()
	.describe('The created contact reference');

export const ContactIdInputSchema = z
	.object({ contactId: z.number().int().describe('The contact id') })
	.describe('Input with a contact id');
export type ContactIdInput = z.infer<typeof ContactIdInputSchema>;

export const ContactOutputSchema = z
	.object({
		contact: ContactSchema.nullish().describe('The contact'),
	})
	.loose()
	.describe('The contact');

export const ContactsUpdateInputSchema = z
	.object({
		contactId: z.number().int().describe('The contact id'),
		name: z.string().min(1).describe('Contact name'),
		paused: z.boolean().describe('Whether alerts are paused'),
		notificationTargets: notificationTargetsSchema.describe(
			'Notification targets; each takes email or number (+countryCode) and an optional severity',
		),
	})
	.describe('Input for modifying a contact');
export type ContactsUpdateInput = z.infer<typeof ContactsUpdateInputSchema>;

// ── Operation registry ─────────────────────────────────────────────────────

export const PingdomEndpointInputSchemas = {
	checksList: ChecksListInputSchema,
	checksCreate: ChecksCreateInputSchema,
	checksGet: CheckIdInputSchema,
	checksUpdate: ChecksUpdateInputSchema,
	checksDelete: CheckIdInputSchema,
	checksUpdateMulti: ChecksUpdateMultiInputSchema,
	checksDeleteMulti: ChecksDeleteMultiInputSchema,
	analysisList: AnalysisListInputSchema,
	analysisGet: AnalysisGetInputSchema,
	resultsList: ResultsListInputSchema,
	summariesAverage: SummaryAverageInputSchema,
	summariesHoursOfDay: SummaryInputSchema,
	summariesOutage: SummaryInputSchema,
	summariesPerformance: SummaryPerformanceInputSchema,
	summariesProbes: SummaryInputSchema,
	actionsList: ActionsListInputSchema,
	creditsGet: EmptyInputSchema,
	probesList: EmptyInputSchema,
	referenceGet: EmptyInputSchema,
	singleRun: SingleRunInputSchema,
	maintenanceList: MaintenanceListInputSchema,
	maintenanceCreate: MaintenanceCreateInputSchema,
	maintenanceGet: MaintenanceIdInputSchema,
	maintenanceUpdate: MaintenanceUpdateInputSchema,
	maintenanceDelete: MaintenanceIdInputSchema,
	maintenanceDeleteMulti: MaintenanceDeleteMultiInputSchema,
	occurrencesList: OccurrencesListInputSchema,
	occurrencesGet: OccurrenceIdInputSchema,
	occurrencesUpdate: OccurrenceUpdateInputSchema,
	occurrencesDelete: OccurrenceIdInputSchema,
	teamsList: EmptyInputSchema,
	teamsCreate: TeamsCreateInputSchema,
	teamsGet: TeamIdInputSchema,
	teamsUpdate: TeamsUpdateInputSchema,
	teamsDelete: TeamIdInputSchema,
	contactsList: EmptyInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsGet: ContactIdInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactIdInputSchema,
};

export const PingdomEndpointOutputSchemas = {
	checksList: ChecksListOutputSchema,
	checksCreate: CheckCreatedOutputSchema,
	checksGet: CheckOutputSchema,
	checksUpdate: CheckModifiedOutputSchema,
	checksDelete: ChecksDeletedMultiOutputSchema,
	checksUpdateMulti: CheckModifiedOutputSchema,
	checksDeleteMulti: ChecksDeletedMultiOutputSchema,
	analysisList: AnalysisListOutputSchema,
	analysisGet: AnalysisRawOutputSchema,
	resultsList: ResultsListOutputSchema,
	summariesAverage: SummaryAverageOutputSchema,
	summariesHoursOfDay: SummaryHoursOfDayOutputSchema,
	summariesOutage: SummaryOutageOutputSchema,
	summariesPerformance: SummaryPerformanceOutputSchema,
	summariesProbes: SummaryProbesOutputSchema,
	actionsList: ActionsListOutputSchema,
	creditsGet: CreditsOutputSchema,
	probesList: ProbesListOutputSchema,
	referenceGet: ReferenceOutputSchema,
	singleRun: SingleRunOutputSchema,
	maintenanceList: MaintenanceListOutputSchema,
	maintenanceCreate: MaintenanceCreatedOutputSchema,
	maintenanceGet: MaintenanceOutputSchema,
	maintenanceUpdate: MaintenanceModifiedOutputSchema,
	maintenanceDelete: ChecksDeletedMultiOutputSchema,
	maintenanceDeleteMulti: ChecksDeletedMultiOutputSchema,
	occurrencesList: OccurrencesListOutputSchema,
	occurrencesGet: OccurrenceOutputSchema,
	occurrencesUpdate: ChecksDeletedMultiOutputSchema,
	occurrencesDelete: ChecksDeletedMultiOutputSchema,
	teamsList: TeamsListOutputSchema,
	teamsCreate: TeamsCreatedOutputSchema,
	teamsGet: TeamOutputSchema,
	teamsUpdate: TeamOutputSchema,
	teamsDelete: ChecksDeletedMultiOutputSchema,
	contactsList: ContactsListOutputSchema,
	contactsCreate: ContactsCreatedOutputSchema,
	contactsGet: ContactOutputSchema,
	contactsUpdate: ContactOutputSchema,
	contactsDelete: ChecksDeletedMultiOutputSchema,
};

export type PingdomEndpointInputs = {
	[K in keyof typeof PingdomEndpointInputSchemas]: z.input<
		(typeof PingdomEndpointInputSchemas)[K]
	>;
};

export type PingdomEndpointOutputs = {
	[K in keyof typeof PingdomEndpointOutputSchemas]: z.infer<
		(typeof PingdomEndpointOutputSchemas)[K]
	>;
};
