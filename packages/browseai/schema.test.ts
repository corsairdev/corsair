/**
 * Validates that every key Browse AI documents is declared in schema/database.ts.
 * Entities are `.loose()`, so `safeParse` alone would never notice a missing field.
 *
 * Key names come from https://docs.browse.ai/api/ (OpenAPI 3.1).
 */

import { BrowseaiSchema } from './schema';
import {
	BrowseaiBulkRun,
	BrowseaiCapturedScreenshot,
	BrowseaiMonitor,
	BrowseaiRobot,
	BrowseaiRobotInputParameter,
	BrowseaiRobotTask,
	BrowseaiSystemStatus,
	BrowseaiWebhook,
} from './schema/database';

const ROBOT_KEYS = ['id', 'name', 'createdAt', 'inputParameters'];
const PARAM_KEYS = [
	'type',
	'name',
	'label',
	'required',
	'encrypted',
	'defaultValue',
	'value',
	'min',
	'max',
	'pattern',
	'options',
];
const TASK_KEYS = [
	'id',
	'inputParameters',
	'robotId',
	'status',
	'runByUserId',
	'robotBulkRunId',
	'runByTaskMonitorId',
	'runByAPI',
	'createdAt',
	'startedAt',
	'finishedAt',
	'userFriendlyError',
	'triedRecordingVideo',
	'videoUrl',
	'videoRemovedAt',
	'retriedOriginalTaskId',
	'retriedTaskId',
	'retriedByTaskId',
	'capturedDataTemporaryUrl',
	'capturedTexts',
	'capturedScreenshots',
	'capturedLists',
];
const SCREENSHOT_KEYS = [
	'id',
	'name',
	'src',
	'width',
	'height',
	'x',
	'y',
	'deviceScaleFactor',
	'full',
	'comparedToScreenshotId',
	'diffImageSrc',
	'changePercentage',
	'diffThreshold',
	'fileRemovedAt',
];
const MONITOR_KEYS = [
	'id',
	'name',
	'status',
	'pausedReason',
	'inputParameters',
	'schedules',
	'schedule',
	'notifyOnCapturedScreenshotChange',
	'notifyOnCapturedTextChange',
	'capturedScreenshotNotificationThreshold',
	'createdAt',
	'pausedAt',
	'updatedAt',
];
const WEBHOOK_KEYS = ['id', 'url', 'webhookEvent', 'createdAt'];
const BULK_RUN_KEYS = [
	'id',
	'title',
	'status',
	'tasksCount',
	'successfulTasks',
	'failedTasks',
	'robotId',
	'createdAt',
];
const STATUS_KEYS = ['statusCode', 'messageCode', 'tasksQueueStatus'];

describe('Browse AI schema', () => {
	it('declares a semver version', () => {
		expect(BrowseaiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('mirrors the entities the plugin persists', () => {
		expect(Object.keys(BrowseaiSchema.entities).sort()).toEqual([
			'bulkRun',
			'monitor',
			'robot',
			'robotTask',
			'systemStatus',
			'webhook',
		]);
	});

	describe('every documented key is declared', () => {
		const cases: [string, { shape: Record<string, unknown> }, string[]][] = [
			['robot', BrowseaiRobot, ROBOT_KEYS],
			['param', BrowseaiRobotInputParameter, PARAM_KEYS],
			['task', BrowseaiRobotTask, TASK_KEYS],
			['screenshot', BrowseaiCapturedScreenshot, SCREENSHOT_KEYS],
			['monitor', BrowseaiMonitor, MONITOR_KEYS],
			['webhook', BrowseaiWebhook, WEBHOOK_KEYS],
			['bulkRun', BrowseaiBulkRun, BULK_RUN_KEYS],
			['status', BrowseaiSystemStatus, STATUS_KEYS],
		];

		for (const [label, entity, capturedKeys] of cases) {
			it(`declares every ${label} key`, () => {
				const declared = Object.keys(entity.shape);
				const undeclared = capturedKeys.filter((k) => !declared.includes(k));
				expect(undeclared).toEqual([]);
			});
		}
	});

	it('accepts a robot listed without extra fields', () => {
		expect(BrowseaiRobot.safeParse({ id: 'r1', name: 'Bot' }).success).toBe(
			true,
		);
	});

	it('accepts null for nullable task fields', () => {
		expect(
			BrowseaiRobotTask.safeParse({
				id: 't1',
				finishedAt: null,
				userFriendlyError: null,
			}).success,
		).toBe(true);
	});
});
