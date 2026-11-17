import * as m from './endpoints/types-monitors';

export const monitorsSchemas = {
	'monitors.access': {
		input: m.MonitorsAccessInputSchema,
		output: m.MonitorsAccessOutputSchema,
	},
	'monitors.available': {
		input: m.MonitorsAvailableInputSchema,
		output: m.MonitorsAvailableOutputSchema,
	},
	'monitors.list': {
		input: m.MonitorsListInputSchema,
		output: m.MonitorsListOutputSchema,
	},
	'monitors.get': {
		input: m.MonitorKeyInputSchema,
		output: m.MonitorDetailOutputSchema,
	},
	'monitors.dependents': {
		input: m.MonitorKeyInputSchema,
		output: m.MonitorDependentsOutputSchema,
	},
	'monitors.check': {
		input: m.MonitorCheckInputSchema,
		output: m.MonitorCheckOutputSchema,
	},
	'monitors.preview': {
		input: m.MonitorPreviewInputSchema,
		output: m.MonitorPreviewOutputSchema,
	},
	'monitors.deploy': {
		input: m.MonitorDeployInputSchema,
		output: m.MonitorDeployOutputSchema,
	},
	'monitors.update': {
		input: m.MonitorUpdateInputSchema,
		output: m.MonitorUpdateOutputSchema,
	},
	'monitors.delete': {
		input: m.MonitorDryRunKeyInputSchema,
		output: m.MonitorDeleteOutputSchema,
	},
	'monitors.reactivate': {
		input: m.MonitorDryRunKeyInputSchema,
		output: m.MonitorReactivateOutputSchema,
	},
	'monitors.start': {
		input: m.MonitorLifecycleInputSchema,
		output: m.MonitorLifecycleOutputSchema,
	},
	'monitors.stop': {
		input: m.MonitorLifecycleInputSchema,
		output: m.MonitorLifecycleOutputSchema,
	},
	'monitors.test': {
		input: m.MonitorTestInputSchema,
		output: m.MonitorTestOutputSchema,
	},
	'monitors.health': {
		input: m.MonitorsHealthInputSchema,
		output: m.MonitorsHealthOutputSchema,
	},
	'monitors.ledger.list': {
		input: m.MonitorsLedgerListInputSchema,
		output: m.MonitorsLedgerListOutputSchema,
	},
	'monitors.ledger.get': {
		input: m.MonitorKeyInputSchema,
		output: m.MonitorsLedgerGetOutputSchema,
	},
	'monitors.ledger.findings': {
		input: m.MonitorsLedgerFindingsInputSchema,
		output: m.MonitorsLedgerFindingsOutputSchema,
	},
	'monitors.jobs.get': {
		input: m.MonitorJobIdInputSchema,
		output: m.MonitorJobResultSchema,
	},
	'monitors.jobs.logs': {
		input: m.MonitorJobLogsInputSchema,
		output: m.MonitorJobResultSchema,
	},
	'monitors.jobs.cancel': {
		input: m.MonitorJobIdInputSchema,
		output: m.MonitorJobResultSchema,
	},
	'monitors.batch.get': {
		input: m.MonitorBatchGetInputSchema,
		output: m.MonitorBatchOperationSchema,
	},
	'monitors.fleets.list': {
		input: m.MonitorFleetsListInputSchema,
		output: m.MonitorFleetsListOutputSchema,
	},
	'notifications.list': {
		input: m.NotificationsListInputSchema,
		output: m.NotificationsListOutputSchema,
	},
	'notifications.configuration.get': {
		input: m.NotificationsConfigurationGetInputSchema,
		output: m.NotificationsConfigurationGetOutputSchema,
	},
	'notifications.configuration.change': {
		input: m.NotificationsConfigurationChangeInputSchema,
		output: m.NotificationsConfigurationChangeOutputSchema,
	},
	'notifications.create': {
		input: m.NotificationsCreateInputSchema,
		output: m.NotificationsWriteOutputSchema,
	},
	'notifications.update': {
		input: m.NotificationsUpdateInputSchema,
		output: m.NotificationsWriteOutputSchema,
	},
	'notifications.delete': {
		input: m.NotificationIdInputSchema,
		output: m.NotificationsDeleteOutputSchema,
	},
	'notifications.test': {
		input: m.NotificationIdInputSchema,
		output: m.NotificationsTestOutputSchema,
	},
	'notifications.channels': {
		input: m.NotificationsChannelsInputSchema,
		output: m.NotificationsChannelsOutputSchema,
	},
	'notifications.dlq.list': {
		input: m.NotificationsDlqListInputSchema,
		output: m.NotificationsDlqListOutputSchema,
	},
	'notifications.dlq.get': {
		input: m.NotificationsDlqGetInputSchema,
		output: m.NotificationsDlqGetOutputSchema,
	},
	'notifications.dlq.update': {
		input: m.NotificationsDlqUpdateInputSchema,
		output: m.NotificationsDlqUpdateOutputSchema,
	},
} as const;

export const monitorsMeta = {
	'monitors.access': {
		riskLevel: 'read',
		description: 'Check whether the workspace can use Deepline Monitors',
	},
	'monitors.available': {
		riskLevel: 'read',
		description:
			'List deployable monitor tools, or describe the payload, outputs and pricing of one tool',
	},
	'monitors.list': {
		riskLevel: 'read',
		description:
			'List deployed monitors by lifecycle state, with cursor paging',
	},
	'monitors.get': {
		riskLevel: 'read',
		description: 'Get one deployed monitor by its public key',
	},
	'monitors.dependents': {
		riskLevel: 'read',
		description: 'List the published Plays that react to one monitor',
	},
	'monitors.check': {
		riskLevel: 'read',
		description:
			'Validate a monitor definition and show its plan and pricing without deploying or spending credits',
	},
	'monitors.preview': {
		riskLevel: 'destructive',
		description:
			'Sample recent matches for a monitor definition before deploying; each returned match costs credits',
	},
	'monitors.deploy': {
		riskLevel: 'destructive',
		description:
			'Deploy a monitor from a definition; creates an upstream provider resource and may spend credits',
	},
	'monitors.update': {
		riskLevel: 'destructive',
		description:
			'Update the name or payload of a deployed monitor; payload changes can replace the upstream resource and spend credits',
	},
	'monitors.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a deployed monitor and deprovision its upstream resource; dryRun shows the plan',
	},
	'monitors.reactivate': {
		riskLevel: 'destructive',
		description:
			'Reactivate a disabled monitor, creating a replacement upstream resource; dryRun shows the cost',
	},
	'monitors.start': {
		riskLevel: 'destructive',
		description:
			'Apply the retained definition of a stopped monitor upstream; may spend credits',
	},
	'monitors.stop': {
		riskLevel: 'write',
		description:
			'Stop a monitor upstream while keeping its definition for monitors.start',
	},
	'monitors.test': {
		riskLevel: 'read',
		description:
			'Validate an explicit event payload against the webhook contract of a deployed monitor; writes, charges and dispatches nothing',
	},
	'monitors.health': {
		riskLevel: 'read',
		description: 'Read monitor delivery and convergence health',
	},
	'monitors.ledger.list': {
		riskLevel: 'read',
		description:
			'List monitors with status, findings counts, signals and the Plays each one triggers',
	},
	'monitors.ledger.get': {
		riskLevel: 'read',
		description: 'Get the ledger entry of one monitor',
	},
	'monitors.ledger.findings': {
		riskLevel: 'read',
		description: 'List the recent findings of one monitor',
	},
	'monitors.jobs.get': {
		riskLevel: 'read',
		description: 'Get the state, phase and counts of a Monitor Job',
	},
	'monitors.jobs.logs': {
		riskLevel: 'read',
		description: 'Read the logs of a Monitor Job',
	},
	'monitors.jobs.cancel': {
		riskLevel: 'write',
		description: 'Cancel a running Monitor Job',
	},
	'monitors.batch.get': {
		riskLevel: 'read',
		description:
			'Read a monitor batch operation, such as the plan from a dry-run start or stop',
	},
	'monitors.fleets.list': {
		riskLevel: 'read',
		description: 'List Monitor Fleets, or their overview with status counts',
	},
	'notifications.list': {
		riskLevel: 'read',
		description:
			'List named notifications, the event catalog, destinations and dead-letter count',
	},
	'notifications.configuration.get': {
		riskLevel: 'read',
		description:
			'Read notification groups, destinations, rules and the workspace version',
	},
	'notifications.configuration.change': {
		riskLevel: 'write',
		description:
			'Save or delete one notification group atomically against the expected workspace version',
	},
	'notifications.create': {
		riskLevel: 'write',
		description: 'Create a named Slack notification for chosen Play events',
	},
	'notifications.update': {
		riskLevel: 'write',
		description:
			'Pause or resume a notification, or change its name, events and Slack target',
	},
	'notifications.delete': {
		riskLevel: 'destructive',
		description:
			'Archive a named notification without touching its Slack integration',
	},
	'notifications.test': {
		riskLevel: 'destructive',
		description: 'Send a test message to the Slack target of a notification',
	},
	'notifications.channels': {
		riskLevel: 'read',
		description:
			'List Slack channels visible to the connected Deepline Slack app',
	},
	'notifications.dlq.list': {
		riskLevel: 'read',
		description: 'List notification deliveries that exhausted their retries',
	},
	'notifications.dlq.get': {
		riskLevel: 'read',
		description: 'Get one dead-lettered notification delivery',
	},
	'notifications.dlq.update': {
		riskLevel: 'destructive',
		description:
			'Retry (send again) or archive one dead-lettered notification delivery',
	},
} as const;
