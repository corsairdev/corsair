import { z } from 'zod';
import {
	BrowseaiBulkRun,
	BrowseaiInputParameters,
	BrowseaiMonitor,
	BrowseaiRobot,
	BrowseaiRobotTask,
	BrowseaiSystemStatus,
	BrowseaiWebhook,
} from '../schema/database';

export const BrowseaiWebhookEventType = z.enum([
	'taskCapturedDataChanged',
	'taskFinished',
	'taskFinishedSuccessfully',
	'taskFinishedWithError',
	'tableExportFinishedSuccessfully',
]);

export const BrowseaiTaskStatus = z.enum([
	'failed',
	'successful',
	'in-progress',
]);

const SystemGetStatusInputSchema = z.object({});
const RobotsListInputSchema = z.object({});

const RobotsRunInputSchema = z.object({
	robotId: z.string().min(1),
	recordVideo: z.boolean().optional(),
	inputParameters: BrowseaiInputParameters.optional(),
});

const RobotsBulkRunInputSchema = z.object({
	robotId: z.string().min(1),
	title: z.string().min(1).max(200).optional(),
	inputParameters: z.array(BrowseaiInputParameters).min(1),
});

const TasksListInputSchema = z.object({
	robotId: z.string().min(1),
	page: z.number().optional(),
	pageSize: z.number().optional(),
	status: BrowseaiTaskStatus.optional(),
	robotBulkRunId: z.string().optional(),
	sort: z.string().optional(),
	includeRetried: z.boolean().optional(),
	fromDate: z.number().optional(),
	toDate: z.number().optional(),
});

const TasksGetInputSchema = z.object({
	robotId: z.string().min(1),
	taskId: z.string().min(1),
});

const MonitorsCreateInputSchema = z.object({
	robotId: z.string().min(1),
	name: z.string().min(1).max(200),
	inputParameters: BrowseaiInputParameters,
	notifyOnCapturedScreenshotChange: z.boolean(),
	notifyOnCapturedTextChange: z.boolean(),
	capturedScreenshotNotificationThreshold: z.number(),
	schedule: z.string().optional(),
	schedules: z
		.array(
			z.object({
				type: z.literal('FIXED_INTERVAL'),
				everyMinutes: z.number(),
			}),
		)
		.optional(),
});

const MonitorsDeleteInputSchema = z.object({
	robotId: z.string().min(1),
	monitorId: z.string().min(1),
});

const WebhooksCreateInputSchema = z.object({
	robotId: z.string().min(1),
	hookUrl: z.string().url(),
	eventType: BrowseaiWebhookEventType,
});

const WebhooksListInputSchema = z.object({
	robotId: z.string().min(1),
});

const StatusEnvelope = z
	.object({
		statusCode: z.number().nullable().optional(),
		messageCode: z.string().nullable().optional(),
	})
	.loose();

const RobotsListOutputSchema = StatusEnvelope.extend({
	robots: z
		.object({
			totalCount: z.number().nullable().optional(),
			items: z.array(BrowseaiRobot).nullable().optional(),
		})
		.loose()
		.nullable()
		.optional(),
});

const RobotTaskResultOutputSchema = StatusEnvelope.extend({
	result: BrowseaiRobotTask.nullable().optional(),
});

const TasksListOutputSchema = StatusEnvelope.extend({
	result: z
		.object({
			robotTasks: z
				.object({
					totalCount: z.number().nullable().optional(),
					pageNumber: z.number().nullable().optional(),
					hasMore: z.boolean().nullable().optional(),
					items: z.array(BrowseaiRobotTask).nullable().optional(),
				})
				.loose()
				.nullable()
				.optional(),
		})
		.loose()
		.nullable()
		.optional(),
});

const BulkRunOutputSchema = StatusEnvelope.extend({
	result: z
		.object({
			bulkRun: BrowseaiBulkRun.nullable().optional(),
		})
		.loose()
		.nullable()
		.optional(),
});

const MonitorCreateOutputSchema = StatusEnvelope.extend({
	monitor: BrowseaiMonitor.nullable().optional(),
});

const MonitorDeleteOutputSchema = StatusEnvelope;

const WebhookCreateOutputSchema = StatusEnvelope.extend({
	webhook: BrowseaiWebhook.nullable().optional(),
});

const WebhooksListOutputSchema = StatusEnvelope.extend({
	webhooks: z
		.object({
			totalCount: z.number().nullable().optional(),
			items: z.array(BrowseaiWebhook).nullable().optional(),
		})
		.loose()
		.nullable()
		.optional(),
});

export type BrowseaiEndpointInputs = {
	systemGetStatus: z.infer<typeof SystemGetStatusInputSchema>;
	robotsList: z.infer<typeof RobotsListInputSchema>;
	robotsRun: z.infer<typeof RobotsRunInputSchema>;
	robotsBulkRun: z.infer<typeof RobotsBulkRunInputSchema>;
	tasksList: z.infer<typeof TasksListInputSchema>;
	tasksGet: z.infer<typeof TasksGetInputSchema>;
	monitorsCreate: z.infer<typeof MonitorsCreateInputSchema>;
	monitorsDelete: z.infer<typeof MonitorsDeleteInputSchema>;
	webhooksCreate: z.infer<typeof WebhooksCreateInputSchema>;
	webhooksList: z.infer<typeof WebhooksListInputSchema>;
};

export type BrowseaiEndpointOutputs = {
	systemGetStatus: z.infer<typeof BrowseaiSystemStatus>;
	robotsList: z.infer<typeof RobotsListOutputSchema>;
	robotsRun: z.infer<typeof RobotTaskResultOutputSchema>;
	robotsBulkRun: z.infer<typeof BulkRunOutputSchema>;
	tasksList: z.infer<typeof TasksListOutputSchema>;
	tasksGet: z.infer<typeof RobotTaskResultOutputSchema>;
	monitorsCreate: z.infer<typeof MonitorCreateOutputSchema>;
	monitorsDelete: z.infer<typeof MonitorDeleteOutputSchema>;
	webhooksCreate: z.infer<typeof WebhookCreateOutputSchema>;
	webhooksList: z.infer<typeof WebhooksListOutputSchema>;
};

export const BrowseaiEndpointInputSchemas = {
	systemGetStatus: SystemGetStatusInputSchema,
	robotsList: RobotsListInputSchema,
	robotsRun: RobotsRunInputSchema,
	robotsBulkRun: RobotsBulkRunInputSchema,
	tasksList: TasksListInputSchema,
	tasksGet: TasksGetInputSchema,
	monitorsCreate: MonitorsCreateInputSchema,
	monitorsDelete: MonitorsDeleteInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksList: WebhooksListInputSchema,
} as const;

export const BrowseaiEndpointOutputSchemas = {
	systemGetStatus: BrowseaiSystemStatus,
	robotsList: RobotsListOutputSchema,
	robotsRun: RobotTaskResultOutputSchema,
	robotsBulkRun: BulkRunOutputSchema,
	tasksList: TasksListOutputSchema,
	tasksGet: RobotTaskResultOutputSchema,
	monitorsCreate: MonitorCreateOutputSchema,
	monitorsDelete: MonitorDeleteOutputSchema,
	webhooksCreate: WebhookCreateOutputSchema,
	webhooksList: WebhooksListOutputSchema,
} as const;
