import { z } from 'zod';
import { PathSegmentSchema } from './types';

// Deepline Monitors (provider event feeds) and product notifications. Shapes
// follow the official SDK (client-core.ts, monitors.ts, shared_libs
// product-notifications) and live GET reads of code.deepline.com on
// 2026-11-17. Server-owned records stay open (looseObject) because Deepline
// adds fields without an SDK bump; only fields the SDK or CLI rely on are
// required.

const OpenRecordSchema = z.record(z.string(), z.unknown());
const EmptyInputSchema = z.strictObject({});

// Monitor job and preview idempotency keys. The SDK caps generated job keys at
// 96 characters; caller-owned keys use the same bound and alphabet as
// tools.execute.
export const MonitorIdempotencyKeySchema = z
	.string()
	.min(1)
	.max(96)
	.regex(/^[A-Za-z0-9._:-]+$/);

const MonitorKeySchema = PathSegmentSchema.describe(
	'Public key of a deployed monitor, as monitors.list returns it.',
);

export const MonitorDefinitionShape = {
	key: z
		.string()
		.trim()
		.min(1)
		.describe(
			'Stable public key for this monitor, unique within the workspace.',
		),
	tool: z
		.string()
		.trim()
		.min(1)
		.describe(
			'Monitor tool id from monitors.available, e.g. deepline_native.company_radar.',
		),
	name: z
		.string()
		.optional()
		.describe('Optional human-readable name shown in listings.'),
	payload: OpenRecordSchema.describe(
		'Provider-specific payload matching the payload schema monitors.available returns for this tool.',
	),
};
// Monitor definitions never name Plays or operational controls: the strict
// object rejects them before HTTP, as the SDK's defineMonitor does.
export const MonitorDefinitionSchema = z.strictObject(MonitorDefinitionShape);

const MonitorStateSchema = z.string();

// ——— monitors.access ———
export const MonitorsAccessInputSchema = EmptyInputSchema;
export const MonitorsAccessOutputSchema = z.looseObject({
	has_access: z.boolean(),
	reason: z.string().nullish(),
});

// ——— monitors.available ———
export const MonitorsAvailableInputSchema = z.strictObject({
	tool: z
		.string()
		.min(1)
		.optional()
		.describe(
			'A monitor tool id to describe in full (payload schema, outputs, pricing). Omit to list the catalog.',
		),
	provider: z
		.string()
		.optional()
		.describe('Only list monitor tools from this provider.'),
	search: z
		.string()
		.optional()
		.describe('Literal text to match against monitor tool metadata.'),
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Maximum monitor tools to list.'),
	full: z
		.boolean()
		.optional()
		.describe(
			'In list mode, return payload schemas and streams instead of the compact inventory. Ignored when tool is set.',
		),
});
const MonitorToolListEntrySchema = z.looseObject({
	tool: z.string(),
	display_name: z.string().nullish(),
	description: z.string().nullish(),
	deployed_count: z.number().nullish(),
});
const MonitorToolListSchema = z.looseObject({
	tools: z.array(MonitorToolListEntrySchema),
	total: z.number().optional(),
	returned: z.number().optional(),
	limit: z.number().optional(),
	is_truncated: z.boolean().optional(),
});
const MonitorToolDescriptionSchema = z.looseObject({
	tool: z.string(),
	provider: z.string().nullish(),
	display_name: z.string().nullish(),
	payload_schema: OpenRecordSchema.nullish(),
});
export const MonitorsAvailableOutputSchema = z.union([
	MonitorToolListSchema,
	MonitorToolDescriptionSchema,
]);

// ——— monitors.list ———
export const MonitorsListInputSchema = z
	.strictObject({
		state: z
			.enum([
				'active',
				'provisioning',
				'billing_suspended',
				'errored',
				'disabled',
				'all',
			])
			.optional()
			.describe('Lifecycle state to list. The server default is active.'),
		limit: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Maximum monitors on this page.'),
		cursor: z
			.string()
			.optional()
			.describe('next_cursor from the previous page.'),
		includeConsumers: z
			.boolean()
			.optional()
			.describe(
				'Include current Play listener delivery health for each monitor. Requires limit of 20 or less.',
			),
	})
	.refine(
		(v) => !v.includeConsumers || (v.limit !== undefined && v.limit <= 20),
		{ message: 'includeConsumers requires limit of 20 or less' },
	);
const MonitorListEntrySchema = z.looseObject({
	key: z.string().nullish(),
	monitor_key: z.string().nullish(),
	state: MonitorStateSchema.nullish(),
	tool: z.string().nullish(),
	name: z.string().nullish(),
});
export const MonitorsListOutputSchema = z.looseObject({
	monitors: z.array(MonitorListEntrySchema),
	total: z.number().optional(),
	returned: z.number().optional(),
	has_more: z.boolean().optional(),
	next_cursor: z.string().nullish(),
});

// ——— monitors.get / dependents ———
export const MonitorKeyInputSchema = z.strictObject({ key: MonitorKeySchema });
export const MonitorDetailOutputSchema = z
	.looseObject({
		key: z.string().nullish(),
		monitor_key: z.string().nullish(),
		tool: z.string().nullish(),
		state: MonitorStateSchema.nullish(),
		monitor_spec: OpenRecordSchema.nullish(),
	})
	.refine((v) => typeof (v.key ?? v.monitor_key) === 'string', {
		message: 'Deepline returned a monitor without a key',
	});
export const MonitorDependentsOutputSchema = z.looseObject({
	plays: z.array(OpenRecordSchema).optional(),
});

// ——— monitors.check / deploy / preview ———
export const MonitorCheckInputSchema = MonitorDefinitionSchema;
export const MonitorCheckOutputSchema = z.looseObject({
	valid: z.boolean(),
	mode: z.string().nullish(),
	issues: z.array(OpenRecordSchema).optional(),
	monitor: OpenRecordSchema.optional(),
});
export const MonitorDeployInputSchema = z.strictObject({
	...MonitorDefinitionShape,
	dryRun: z
		.boolean()
		.optional()
		.describe(
			'Validate and return the deploy plan (cost, reuse candidates) through the free check endpoint without deploying.',
		),
});
export const MonitorDeployOutputSchema = z.looseObject({
	valid: z.boolean().optional(),
	monitor: OpenRecordSchema.nullish(),
});
export const MonitorPreviewInputSchema = z.strictObject({
	...MonitorDefinitionShape,
	limit: z
		.number()
		.int()
		.min(1)
		.max(3)
		.optional()
		.describe('Matches to sample, 1-3. The server default is 3.'),
	idempotencyKey: MonitorIdempotencyKeySchema.describe(
		'Required. Persist it before calling; reuse it after an uncertain result to recover the same preview without paying again. A new key runs a new, paid preview.',
	),
});
export const MonitorPreviewOutputSchema = z.looseObject({
	idempotency_key: z.string(),
});

// ——— monitors.update / delete / reactivate ———
export const MonitorUpdateInputSchema = z
	.strictObject({
		key: MonitorKeySchema,
		name: z.string().optional().describe('New display name.'),
		payload: OpenRecordSchema.optional().describe(
			'Payload fields to change. Top-level fields merge with the stored payload; nested values and arrays replace whole. Changing filters can replace the upstream resource.',
		),
	})
	.refine((v) => v.name !== undefined || v.payload !== undefined, {
		message: 'Provide name or payload to update',
	});
export const MonitorUpdateOutputSchema = z.looseObject({
	change_summary: OpenRecordSchema.optional(),
});
export const MonitorDryRunKeyInputSchema = z.strictObject({
	key: MonitorKeySchema,
	dryRun: z
		.boolean()
		.optional()
		.describe('Return the plan and cost without changing anything.'),
});
export const MonitorDeleteOutputSchema = z.looseObject({
	plan: OpenRecordSchema.optional(),
	already_deleted: z.boolean().optional(),
	delete_pending: z.boolean().optional(),
});
export const MonitorReactivateOutputSchema = OpenRecordSchema;

// ——— monitors.test ———
export const MonitorTestInputSchema = z.strictObject({
	key: MonitorKeySchema,
	payload: OpenRecordSchema.describe(
		"An explicit event payload to validate against the monitor's webhook contract. Nothing is persisted, charged or dispatched.",
	),
});
export const MonitorTestOutputSchema = z.looseObject({
	accepted: z.boolean().optional(),
	persisted_rows: z.number().optional(),
	dispatched_bound_plays: z.number().optional(),
});

// ——— Monitor jobs and lifecycle ———
const MonitorJobProjectionSchema = z.looseObject({
	id: z.string(),
	operation_id: z.string().nullish(),
	kind: z.string().nullish(),
	state: z.string(),
	phase: z.string().nullish(),
	outcome: z.string().nullish(),
	target: OpenRecordSchema.nullish(),
	counts: OpenRecordSchema.nullish(),
	error: z.string().nullish(),
});
export const MonitorJobResultSchema = z.looseObject({
	ok: z.boolean().optional(),
	job: MonitorJobProjectionSchema.optional(),
	operation_id: z.string().nullish(),
	logs: z
		.array(
			z.looseObject({
				level: z.string(),
				phase: z.string(),
				message: z.string(),
				monitor_key: z.string().nullish(),
				at: z.string(),
			}),
		)
		.optional(),
	replayed: z.boolean().optional(),
	already_terminal: z.boolean().optional(),
	next: z.string().nullish(),
});
export const MonitorBatchOperationSchema = z.looseObject({
	ok: z.boolean().optional(),
	rejoined: z.boolean().optional(),
	operation: z.looseObject({
		runId: z.string(),
		kind: z.string(),
		state: z.string(),
		dryRun: z.boolean(),
		summary: OpenRecordSchema.nullish(),
		lastError: z.string().nullish(),
	}),
	results: z
		.looseObject({
			page: z.array(OpenRecordSchema),
			isDone: z.boolean(),
			continueCursor: z.string(),
		})
		.optional(),
});
export const MonitorLifecycleInputSchema = z.strictObject({
	key: MonitorKeySchema,
	dryRun: z
		.boolean()
		.optional()
		.describe(
			'Submit a dry-run batch operation that plans the change without touching the provider. Read the plan with monitors.batch.get and the returned operation.runId.',
		),
	idempotencyKey: MonitorIdempotencyKeySchema.optional().describe(
		'Stable retry key. Reusing it joins the original operation instead of starting another. Generated when omitted.',
	),
});
export const MonitorLifecycleOutputSchema = z.union([
	MonitorBatchOperationSchema,
	MonitorJobResultSchema,
]);
export const MonitorBatchGetInputSchema = z.strictObject({
	runId: PathSegmentSchema.describe(
		'operation.runId returned by a dry-run monitors.start or monitors.stop.',
	),
	cursor: z
		.string()
		.optional()
		.describe('results.continueCursor from the previous page.'),
});
export const MonitorJobIdInputSchema = z.strictObject({
	jobId: PathSegmentSchema.describe(
		'Monitor Job id returned by monitors.start or monitors.stop (job.id).',
	),
});
export const MonitorJobLogsInputSchema = z.strictObject({
	jobId: PathSegmentSchema.describe('Monitor Job id (job.id).'),
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Maximum log entries to return.'),
});

// ——— monitors.ledger ———
const LedgerStatusSchema = z.enum([
	'active',
	'setting_up',
	'paused_credits',
	'paused_cap',
	'paused_billing',
	'errored',
	'stopped',
]);
const FindingsWindowSchema = z.enum(['1d', '7d', '30d', '90d', '1y']);
export const MonitorsLedgerListInputSchema = z.strictObject({
	search: z
		.string()
		.optional()
		.describe('Search name, key, subject, signal and deploy filters.'),
	states: z
		.array(LedgerStatusSchema)
		.optional()
		.describe('Statuses to include. Every status except stopped by default.'),
	signals: z
		.array(z.string())
		.optional()
		.describe('Signal keys, as the response signals[].key lists them.'),
	play: z
		.string()
		.optional()
		.describe('A Play definition id, or none for monitors no Play listens to.'),
	fleet: z
		.string()
		.optional()
		.describe('A Monitor Fleet id: only the monitors that Fleet owns.'),
	sort: z
		.enum(['recent', 'installed', 'name', 'findings'])
		.optional()
		.describe('Row order. findings orders by most findings in window.'),
	window: FindingsWindowSchema.optional().describe(
		"The span each row's findings count covers. 30d by default.",
	),
	limit: z.number().int().min(1).optional().describe('Maximum rows.'),
	cursor: z.string().optional().describe('next_cursor from the previous page.'),
});
export const MonitorsLedgerListOutputSchema = z.looseObject({
	schemaVersion: z.number().optional(),
	monitors: z.array(OpenRecordSchema),
	total: z.number().optional(),
	next_cursor: z.string().nullish(),
});
export const MonitorsLedgerGetOutputSchema = OpenRecordSchema;
export const MonitorsLedgerFindingsInputSchema = z.strictObject({
	key: MonitorKeySchema,
	cursor: z
		.string()
		.optional()
		.describe('Cursor from the previous findings page.'),
});
export const MonitorsLedgerFindingsOutputSchema = OpenRecordSchema;

// ——— monitors.health ———
export const MonitorsHealthInputSchema = z.strictObject({
	fleetId: z
		.string()
		.min(1)
		.optional()
		.describe('Limit the report to one Monitor Fleet.'),
});
export const MonitorsHealthOutputSchema = z.looseObject({
	ok: z.boolean().optional(),
	scope: z.looseObject({
		org_id: z.string(),
		fleet_id: z.string().nullish(),
	}),
	scanned: z.number(),
	truncated: z.boolean(),
	converged: z.number().optional(),
	needs_repair: z.number().optional(),
});

// ——— monitors.fleets.list ———
export const MonitorFleetsListInputSchema = z
	.strictObject({
		overview: z
			.boolean()
			.optional()
			.describe(
				'Return the Fleets overview (status counts, findings, paused totals) instead of the plain list. Required for q, states, sort and window.',
			),
		q: z
			.string()
			.optional()
			.describe(
				'Overview only: search Fleet ids, source tables, tools, signals.',
			),
		states: z
			.array(
				z.enum([
					'needs_attention',
					'paused_credits',
					'paused_cap',
					'paused_billing',
					'setting_up',
					'running',
					'deactivated',
				]),
			)
			.optional()
			.describe(
				'Overview only: statuses to include. All but deactivated by default.',
			),
		sort: z
			.enum(['attention', 'findings', 'newest', 'name'])
			.optional()
			.describe('Overview only: row order. attention by default.'),
		window: FindingsWindowSchema.optional().describe(
			"Overview only: the span each Fleet's findings count covers.",
		),
	})
	.refine(
		(v) =>
			v.overview === true ||
			[v.q, v.states, v.sort, v.window].every((x) => x === undefined),
		{ message: 'q, states, sort and window require overview: true' },
	);
export const MonitorFleetsListOutputSchema = z.looseObject({
	schemaVersion: z.number().optional(),
	fleets: z.array(OpenRecordSchema),
	total: z.number().optional(),
});

// ——— Product notifications ———
const ProductNotificationSchema = z.looseObject({
	id: z.string(),
	name: z.string(),
	provider: z.string(),
	target: z.looseObject({
		id: z.string(),
		name: z.string(),
		kind: z.string().nullish(),
	}),
	enabled: z.boolean(),
	status: z.string(),
	eventTypes: z.array(z.string()),
});
export const NotificationsListInputSchema = EmptyInputSchema;
export const NotificationsListOutputSchema = z.looseObject({
	contractVersion: z.number(),
	catalog: z.array(
		z.looseObject({
			id: z.string(),
			label: z.string(),
			description: z.string().nullish(),
		}),
	),
	notifications: z.array(ProductNotificationSchema).optional(),
	destinations: z.array(OpenRecordSchema),
	subscriptions: z.array(OpenRecordSchema),
	dlq: z.looseObject({ count: z.number(), capped: z.boolean() }),
	slackConnection: z
		.looseObject({ connected: z.boolean(), status: z.string() })
		.optional(),
});

const DeliveryTimingSchema = z.union([
	z.looseObject({ mode: z.literal('immediate') }),
	z.looseObject({
		mode: z.enum(['immediate_first', 'digest_only', 'rolling_limit']),
		windowMs: z.number().int().positive(),
	}),
]);
const NotificationGroupSchema = z.looseObject({
	groupKey: z.string().min(1),
	name: z.string().min(1),
	enabled: z.boolean(),
	deliveryTiming: DeliveryTimingSchema,
	version: z.number(),
});
const NotificationDestinationSchema = z.looseObject({
	destinationKey: z.string().min(1),
	groupKey: z.string().min(1),
	name: z.string(),
	enabled: z.boolean(),
	settings: z.discriminatedUnion('kind', [
		z.looseObject({
			kind: z.literal('slack'),
			targetKind: z.enum(['channel', 'member']),
			targetId: z.string(),
			targetName: z.string(),
			oauthConnectionId: z.string(),
		}),
		z.looseObject({
			kind: z.literal('email_addresses'),
			to: z.array(z.string()),
			cc: z.array(z.string()).optional(),
			bcc: z.array(z.string()).optional(),
		}),
		z.looseObject({
			kind: z.literal('email_roles'),
			roles: z.array(z.string()),
		}),
	]),
	version: z.number(),
});
const NotificationRuleSchema = z.looseObject({
	ruleKey: z.string().min(1),
	groupKey: z.string().min(1),
	enabled: z.boolean(),
	notificationType: z.string(),
	eventName: z.string(),
	eventFilter: z.record(
		z.string(),
		z.union([z.string(), z.number(), z.boolean()]),
	),
	trigger: z.looseObject({ kind: z.string() }),
	version: z.number(),
});
const NotificationConfigurationSchema = z.looseObject({
	workspaceVersion: z.number(),
	groups: z.array(OpenRecordSchema),
	destinations: z.array(OpenRecordSchema),
	rules: z.array(OpenRecordSchema),
});
export const NotificationsConfigurationGetInputSchema = EmptyInputSchema;
export const NotificationsConfigurationGetOutputSchema = z.looseObject({
	configuration: NotificationConfigurationSchema,
	catalog: z.array(OpenRecordSchema),
	slackConnection: z.looseObject({
		connected: z.boolean(),
		status: z.string(),
		connectionId: z.string().nullish(),
	}),
});
export const NotificationsConfigurationChangeInputSchema = z.strictObject({
	expectedWorkspaceVersion: z
		.number()
		.int()
		.min(0)
		.describe(
			'configuration.workspaceVersion from notifications.configuration.get. A stale version is refused instead of overwriting newer changes.',
		),
	change: z
		.discriminatedUnion('kind', [
			z.strictObject({
				kind: z.literal('save_group'),
				draft: z.strictObject({
					group: NotificationGroupSchema,
					destinations: z.array(NotificationDestinationSchema),
					rules: z.array(NotificationRuleSchema),
				}),
			}),
			z.strictObject({
				kind: z.literal('delete_group'),
				groupKey: z.string().min(1),
			}),
		])
		.describe(
			'save_group sends the complete desired group with all of its destinations and rules (start from the objects configuration.get returns, keeping their version fields); delete_group removes one group.',
		),
});
export const NotificationsConfigurationChangeOutputSchema = z.looseObject({
	configuration: NotificationConfigurationSchema,
});

const SlackTargetShape = {
	channel: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Slack channel id or #name from notifications.channels. Give channel or memberId, not both.',
		),
	memberId: z
		.string()
		.min(1)
		.optional()
		.describe('Slack member id to message directly. Give channel or memberId.'),
};
const oneSlackTarget = (v: { channel?: string; memberId?: string }) =>
	(v.channel === undefined) !== (v.memberId === undefined);
const EventTypesSchema = z
	.array(z.string().min(1))
	.describe('Event ids from the catalog notifications.list returns.');
export const NotificationsCreateInputSchema = z
	.strictObject({
		name: z.string().trim().min(1).describe('Name of the notification.'),
		provider: z
			.literal('slack')
			.default('slack')
			.describe('Delivery provider. Only slack is supported.'),
		eventTypes: EventTypesSchema,
		...SlackTargetShape,
	})
	.refine(oneSlackTarget, {
		message: 'Give exactly one of channel or memberId',
	});
export const NotificationsWriteOutputSchema = OpenRecordSchema;
const NotificationIdSchema = PathSegmentSchema.describe(
	'Notification id from notifications.list.',
);
export const NotificationsUpdateInputSchema = z
	.strictObject({
		notificationId: NotificationIdSchema,
		enabled: z
			.boolean()
			.optional()
			.describe('Pause (false) or resume (true). Send alone.'),
		name: z
			.string()
			.trim()
			.min(1)
			.optional()
			.describe('New name. Send with eventTypes and one target.'),
		eventTypes: EventTypesSchema.optional(),
		...SlackTargetShape,
	})
	.refine(
		(v) => {
			const edits = [v.name, v.eventTypes, v.channel, v.memberId].some(
				(x) => x !== undefined,
			);
			if (v.enabled !== undefined) return !edits;
			return (
				v.name !== undefined && v.eventTypes !== undefined && oneSlackTarget(v)
			);
		},
		{
			message:
				'Send enabled alone, or name, eventTypes and exactly one of channel or memberId',
		},
	);
export const NotificationIdInputSchema = z.strictObject({
	notificationId: NotificationIdSchema,
});
export const NotificationsDeleteOutputSchema = z.looseObject({
	deleted: z.boolean(),
	id: z.string(),
});
export const NotificationsTestOutputSchema = z.looseObject({
	ok: z.boolean(),
	deliveryId: z.string(),
	state: z.string(),
	message: z.string(),
});
export const NotificationsChannelsInputSchema = z.strictObject({
	search: z
		.string()
		.optional()
		.describe('Words to match against channel names.'),
});
export const NotificationsChannelsOutputSchema = z.looseObject({
	identity: z.looseObject({
		teamId: z.string(),
		teamName: z.string().nullish(),
	}),
	channels: z.array(
		z.looseObject({ id: z.string(), name: z.string(), isPrivate: z.boolean() }),
	),
});
export const NotificationsDlqListInputSchema = z.strictObject({
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Maximum dead-lettered deliveries to return.'),
});
export const NotificationsDlqListOutputSchema = z.looseObject({
	count: z.number(),
	deliveries: z.array(OpenRecordSchema),
	hasMore: z.boolean(),
});
const DeliveryIdSchema = PathSegmentSchema.describe(
	'Dead-lettered delivery id from notifications.dlq.list.',
);
export const NotificationsDlqGetInputSchema = z.strictObject({
	deliveryId: DeliveryIdSchema,
});
export const NotificationsDlqGetOutputSchema = OpenRecordSchema;
export const NotificationsDlqUpdateInputSchema = z.strictObject({
	deliveryId: DeliveryIdSchema,
	action: z
		.enum(['retry', 'archive'])
		.describe(
			'retry sends the delivery again now; archive drops it from the queue. Dead-lettered deliveries never replay on their own.',
		),
});
export const NotificationsDlqUpdateOutputSchema = OpenRecordSchema;
