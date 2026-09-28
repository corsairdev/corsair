import {
	BrowseaiBulkRun,
	BrowseaiMonitor,
	BrowseaiRobot,
	BrowseaiRobotTask,
	BrowseaiSystemStatus,
	BrowseaiWebhook,
} from './database';

export const BrowseaiSchema = {
	version: '1.0.0',
	entities: {
		bulkRun: BrowseaiBulkRun,
		monitor: BrowseaiMonitor,
		robot: BrowseaiRobot,
		robotTask: BrowseaiRobotTask,
		systemStatus: BrowseaiSystemStatus,
		webhook: BrowseaiWebhook,
	},
} as const;

export * from './database';
