import { z } from 'zod';

/**
 * Field names match official JSON keys.
 * https://docs.browse.ai/api/
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

export const BrowseaiSelectParameterOption = z
	.object({
		label: S,
		value: S,
	})
	.loose();
export type BrowseaiSelectParameterOption = z.infer<
	typeof BrowseaiSelectParameterOption
>;

export const BrowseaiRobotInputParameter = z
	.object({
		type: S,
		name: S,
		label: S,
		required: B,
		encrypted: B,
		defaultValue: z
			.union([z.string(), z.number(), z.array(z.string())])
			.nullable()
			.optional(),
		value: z
			.union([z.string(), z.number(), z.array(z.string()), z.null()])
			.optional(),
		min: N,
		max: N,
		pattern: S,
		options: z.array(BrowseaiSelectParameterOption).nullable().optional(),
	})
	.loose();
export type BrowseaiRobotInputParameter = z.infer<
	typeof BrowseaiRobotInputParameter
>;

export const BrowseaiInputParameters = z.record(
	z.string(),
	z.union([z.string(), z.number(), z.array(z.string())]),
);
export type BrowseaiInputParameters = z.infer<typeof BrowseaiInputParameters>;

export const BrowseaiRobot = z
	.object({
		id: S,
		name: S,
		createdAt: N,
		inputParameters: z.array(BrowseaiRobotInputParameter).nullable().optional(),
	})
	.loose();
export type BrowseaiRobot = z.infer<typeof BrowseaiRobot>;

export const BrowseaiCapturedTexts = z.record(
	z.string(),
	z.union([z.string(), z.number(), z.boolean()]).nullable(),
);
export type BrowseaiCapturedTexts = z.infer<typeof BrowseaiCapturedTexts>;

export const BrowseaiCapturedScreenshot = z
	.object({
		id: S,
		name: S,
		src: S,
		width: N,
		height: N,
		x: N,
		y: N,
		deviceScaleFactor: N,
		full: S,
		comparedToScreenshotId: S,
		diffImageSrc: S,
		changePercentage: N,
		diffThreshold: N,
		fileRemovedAt: N,
	})
	.loose();
export type BrowseaiCapturedScreenshot = z.infer<
	typeof BrowseaiCapturedScreenshot
>;

export const BrowseaiRobotTask = z
	.object({
		id: S,
		inputParameters: BrowseaiInputParameters.nullable().optional(),
		robotId: S,
		status: S,
		runByUserId: S,
		robotBulkRunId: S,
		runByTaskMonitorId: S,
		runByAPI: B,
		createdAt: N,
		startedAt: N,
		finishedAt: N,
		userFriendlyError: S,
		triedRecordingVideo: B,
		videoUrl: S,
		videoRemovedAt: N,
		retriedOriginalTaskId: S,
		retriedTaskId: S,
		retriedByTaskId: S,
		capturedDataTemporaryUrl: S,
		capturedTexts: BrowseaiCapturedTexts.nullable().optional(),
		capturedScreenshots: z
			.record(z.string(), BrowseaiCapturedScreenshot)
			.nullable()
			.optional(),
		capturedLists: z
			.record(z.string(), z.array(BrowseaiCapturedTexts))
			.nullable()
			.optional(),
	})
	.loose();
export type BrowseaiRobotTask = z.infer<typeof BrowseaiRobotTask>;

export const BrowseaiFixedIntervalSchedule = z
	.object({
		type: S,
		everyMinutes: N,
	})
	.loose();
export type BrowseaiFixedIntervalSchedule = z.infer<
	typeof BrowseaiFixedIntervalSchedule
>;

export const BrowseaiMonitor = z
	.object({
		id: S,
		name: S,
		status: S,
		pausedReason: S,
		inputParameters: BrowseaiInputParameters.nullable().optional(),
		schedules: z.array(BrowseaiFixedIntervalSchedule).nullable().optional(),
		schedule: S,
		notifyOnCapturedScreenshotChange: B,
		notifyOnCapturedTextChange: B,
		capturedScreenshotNotificationThreshold: N,
		createdAt: N,
		pausedAt: N,
		updatedAt: N,
	})
	.loose();
export type BrowseaiMonitor = z.infer<typeof BrowseaiMonitor>;

export const BrowseaiWebhook = z
	.object({
		id: S,
		url: S,
		webhookEvent: S,
		createdAt: N,
	})
	.loose();
export type BrowseaiWebhook = z.infer<typeof BrowseaiWebhook>;

export const BrowseaiBulkRun = z
	.object({
		id: S,
		title: S,
		status: S,
		tasksCount: N,
		successfulTasks: N,
		failedTasks: N,
		robotId: S,
		createdAt: N,
	})
	.loose();
export type BrowseaiBulkRun = z.infer<typeof BrowseaiBulkRun>;

export const BrowseaiSystemStatus = z
	.object({
		statusCode: N,
		messageCode: S,
		tasksQueueStatus: S,
	})
	.loose();
export type BrowseaiSystemStatus = z.infer<typeof BrowseaiSystemStatus>;
